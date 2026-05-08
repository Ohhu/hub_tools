// ==UserScript==
// @name         LinuxDo Hub 渠道 Key 绑定最小版
// @namespace    https://hub.linux.do/
// @version      0.1.0
// @description  在 Hub 渠道广场用最小面板把选中的渠道绑定到 API Key。
// @author       vsiu
// @license      GPL-3.0-only
// @match        https://hub.linux.do/marketplace*
// @match        https://hub.linux.do/project/api-keys*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const GRAPHQL_PATH = "/admin/graphql";
  const PROJECT_ID = "gid://axonhub/Project/1";
  const PANEL_ID = "hub-key-binder-minimal";
  const CHANNELS = new Map();
  const nativeFetch = window.fetch.bind(window);
  const graphqlHeaders = { authorization: "", projectID: PROJECT_ID };
  let meCache = null;
  let keysCache = [];
  let mountTimer = 0;

  const queries = {
    createKey: "mutation CreateAPIKey($input:CreateAPIKeyInput!){createAPIKey(input:$input){id key name status type}}",
    getKeys: "query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id key name type status}}pageInfo{hasNextPage endCursor}}}",
    getKey: "query GetApiKey($id:ID!){node(id:$id){... on APIKey{id name status profiles{activeProfile profiles{name modelMappings{from to} channelIDs channelTags channelTagsMatchMode modelIDs loadBalanceStrategy channelBindingMode dynamicChannelStrategy{mode maxChannels minChannels maxPriceMultiplier maxLatencyMs minSuccessRate onlyOfficial includeTags excludeTags excludeChannelIDs fallbackChannelIDs} quota{requests totalTokens cost period{type pastDuration{value unit} calendarDuration{unit}}}}}}}}",
    updateProfiles: "mutation UpdateAPIKeyProfiles($id:ID!,$input:UpdateAPIKeyProfilesInput!){updateAPIKeyProfiles(id:$id,input:$input){id name status profiles{activeProfile profiles{name channelIDs channelBindingMode}}}}",
    me: "query Me{me{id projects{projectID}}}",
  };

  window.fetch = async function patchedFetch(input, init) {
    const response = await nativeFetch(input, init);
    rememberChannelsFromResponse(input, init, response);
    schedulePanel();
    return response;
  };

  function rememberChannelsFromResponse(input, init, response) {
    const url = typeof input === "string" ? input : input?.url;
    if (!String(url || "").includes(GRAPHQL_PATH)) return;
    rememberGraphqlHeaders(input, init);
    const body = readBody(init?.body);
    if (!body || !/\bchannels\s*\(/.test(String(body.query || ""))) return;
    response.clone().json()
      .then((payload) => {
        for (const edge of payload?.data?.channels?.edges || []) rememberChannel(edge?.node);
        renderChannelOptions();
      })
      .catch(() => {});
  }

  function rememberGraphqlHeaders(input, init) {
    const headers = new Headers(init?.headers || input?.headers || {});
    const auth = headers.get("authorization");
    const projectID = headers.get("x-project-id");
    if (auth) graphqlHeaders.authorization = auth;
    if (projectID) graphqlHeaders.projectID = projectID;
  }

  function readBody(body) {
    if (!body) return null;
    if (typeof body !== "string") return body && typeof body === "object" ? body : null;
    try { return JSON.parse(body); } catch { return null; }
  }

  function rememberChannel(channel) {
    if (channel?.id) CHANNELS.set(String(channel.id), { id: channel.id, name: channel.name || `Channel ${channel.id}` });
  }

  function schedulePanel() {
    if (!location.pathname.startsWith("/marketplace") && !location.pathname.startsWith("/project/api-keys")) return;
    if (mountTimer) return;
    mountTimer = window.setTimeout(() => {
      mountTimer = 0;
      ensurePanel();
    }, 80);
  }

  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;
    const root = findPanelRoot();
    if (!root) return;
    injectStyle();
    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hkb-card">
        <div class="hkb-head">
          <div>
            <div class="hkb-title">Key 渠道绑定</div>
            <div class="hkb-subtitle">选择渠道和 API Key 后写入当前 profile</div>
          </div>
          <button type="button" class="hkb-secondary" data-action="reload-keys">刷新 Key</button>
        </div>
        <div class="hkb-grid">
          <label class="hkb-field"><span>渠道</span><select data-role="channel"></select></label>
          <label class="hkb-field"><span>API Key</span><select data-role="key"></select></label>
          <label class="hkb-field"><span>新 Key 名称</span><input data-role="new-key-name" type="text" placeholder="可选，填写后新建并绑定"></label>
        </div>
        <div class="hkb-actions">
          <button type="button" class="hkb-primary" data-action="bind-existing">绑定到选中 Key</button>
          <button type="button" class="hkb-secondary" data-action="create-bind">新建 Key 并绑定</button>
          <div class="hkb-status" data-role="status">等待页面加载渠道数据</div>
        </div>
      </div>`;
    const anchor = root.firstElementChild;
    if (anchor) root.insertBefore(panel, anchor.nextSibling);
    else root.prepend(panel);
    panel.addEventListener("click", handlePanelClick);
    renderChannelOptions();
    loadKeys().catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function findPanelRoot() {
    const headings = Array.from(document.querySelectorAll("main h1, main h2"));
    const marketplaceTitle = headings.find((node) => /广场|Marketplace/i.test(node.textContent || ""));
    return marketplaceTitle?.parentElement?.parentElement || document.querySelector("main") || document.body;
  }

  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style"); style.id = `${PANEL_ID}-style`;
    style.textContent = `
      #${PANEL_ID}{margin:0 0 16px;color:hsl(var(--foreground,222.2 84% 4.9%))}
      #${PANEL_ID} .hkb-card{border:1px solid hsl(var(--border,214.3 31.8% 91.4%));background:hsl(var(--card,0 0% 100%));border-radius:8px;padding:16px}
      #${PANEL_ID} .hkb-head,#${PANEL_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:12px}
      #${PANEL_ID} .hkb-title{font-size:16px;line-height:24px;font-weight:600}
      #${PANEL_ID} .hkb-subtitle,#${PANEL_ID} .hkb-status{color:hsl(var(--muted-foreground,215.4 16.3% 46.9%));font-size:13px;line-height:20px}
      #${PANEL_ID} .hkb-grid{display:grid;grid-template-columns:minmax(180px,1fr) minmax(220px,1fr) minmax(180px,1fr);gap:12px;margin:14px 0}
      #${PANEL_ID} .hkb-field{display:grid;gap:6px;font-size:13px;font-weight:500}
      #${PANEL_ID} select,#${PANEL_ID} input{width:100%;min-height:38px;border:1px solid hsl(var(--input,214.3 31.8% 91.4%));border-radius:6px;background:hsl(var(--background,0 0% 100%));color:inherit;font:inherit;padding:0 10px;outline:none}
      #${PANEL_ID} select:focus,#${PANEL_ID} input:focus{border-color:hsl(var(--ring,222.2 84% 4.9%));box-shadow:0 0 0 2px hsl(var(--ring,222.2 84% 4.9%) / .12)}
      #${PANEL_ID} button{min-height:38px;border-radius:6px;border:1px solid transparent;padding:0 12px;font:inherit;font-size:14px;font-weight:500;cursor:pointer}
      #${PANEL_ID} button:disabled{cursor:not-allowed;opacity:.6}
      #${PANEL_ID} .hkb-primary{background:hsl(var(--primary,222.2 47.4% 11.2%));color:hsl(var(--primary-foreground,210 40% 98%))}
      #${PANEL_ID} .hkb-secondary{border-color:hsl(var(--border,214.3 31.8% 91.4%));background:hsl(var(--background,0 0% 100%));color:inherit}
      @media(max-width:900px){#${PANEL_ID} .hkb-grid,#${PANEL_ID} .hkb-actions,#${PANEL_ID} .hkb-head{grid-template-columns:1fr;align-items:stretch;flex-direction:column}}
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  async function handlePanelClick(event) {
    const action = event.target?.dataset?.action;
    if (!action) return;
    try {
      setBusy(true);
      if (action === "reload-keys") await loadKeys(true);
      else if (action === "bind-existing") {
        await bindChannelToKey(getValue("key"), selectedChannelID());
        setStatus("已更新选中 Key 的渠道绑定");
      } else if (action === "create-bind") {
        const name = getValue("new-key-name").trim();
        if (!name) throw new Error("请先填写新 Key 名称");
        const key = await createKey(name);
        await bindChannelToKey(key.id, selectedChannelID());
        await loadKeys(true);
        setStatus(`已新建并绑定：${key.name || name}`);
      }
    } catch (error) { setStatus(error?.message || "操作失败"); } finally { setBusy(false); }
  }

  async function graphql(query, variables = {}, operationName = undefined) {
    const headers = { "content-type": "application/json", "x-project-id": graphqlHeaders.projectID };
    if (graphqlHeaders.authorization) headers.authorization = graphqlHeaders.authorization;
    const response = await nativeFetch(new URL(GRAPHQL_PATH, location.origin), {
      method: "POST",
      credentials: "same-origin",
      headers,
      body: JSON.stringify({ query, variables, operationName }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || `请求失败：${response.status}`);
    return payload.data;
  }

  async function loadMe() {
    if (meCache) return meCache;
    const data = await graphql(queries.me, {}, "Me");
    meCache = data.me;
    return meCache;
  }

  async function loadKeys(force = false) {
    if (keysCache.length && !force) {
      renderKeyOptions();
      return keysCache;
    }
    setStatus("正在加载 API Key");
    const userID = (await loadMe())?.id;
    if (!userID) throw new Error("未读取到当前用户 ID");
    const keys = [];
    let after = null;
    do {
      const data = await graphql(queries.getKeys, {
        first: 100,
        after,
        where: { statusIn: ["enabled", "disabled"], userID, typeNotIn: ["noauth"] },
        orderBy: { field: "CREATED_AT", direction: "DESC" },
      }, "GetApiKeys");
      const page = data.apiKeys;
      keys.push(...(page?.edges || []).map((edge) => edge.node).filter(Boolean));
      after = page?.pageInfo?.hasNextPage ? page.pageInfo.endCursor : null;
    } while (after);
    keysCache = keys;
    renderKeyOptions();
    setStatus(keys.length ? "请选择渠道和 API Key" : "没有读取到可用 API Key");
    return keys;
  }

  async function createKey(name) {
    const data = await graphql(queries.createKey, {
      input: { name, type: "user", projectID: graphqlHeaders.projectID },
    }, "CreateAPIKey");
    return data.createAPIKey;
  }

  async function bindChannelToKey(keyID, channelID) {
    if (!keyID) throw new Error("请选择 API Key");
    if (!channelID) throw new Error("请选择渠道");
    setStatus("正在读取当前 Key 配置");
    const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
    const numericChannelID = Number(channelID);
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    if (!Number.isFinite(numericChannelID)) throw new Error(`渠道 ID 无效：${channelID}`);
    setStatus("正在写入渠道绑定");
    await graphql(queries.updateProfiles, {
      id: keyID,
      input: buildProfilesInput(data.node.profiles, numericChannelID),
    }, "UpdateAPIKeyProfiles");
  }

  function buildProfilesInput(profilesPayload, channelID) {
    const activeProfile = profilesPayload.activeProfile || "default";
    const profiles = Array.isArray(profilesPayload.profiles) && profilesPayload.profiles.length
      ? profilesPayload.profiles.map((profile) => ({ ...profile }))
      : [{ name: activeProfile }];
    const target = profiles.find((profile) => profile.name === activeProfile) || profiles[0];
    target.name = target.name || activeProfile;
    target.channelIDs = [channelID];
    target.channelTags = Array.isArray(target.channelTags) ? target.channelTags : [];
    target.channelTagsMatchMode = target.channelTagsMatchMode || "any";
    target.modelMappings = Array.isArray(target.modelMappings) ? target.modelMappings : [];
    target.modelIDs = Array.isArray(target.modelIDs) ? target.modelIDs : [];
    target.channelBindingMode = "manual";
    target.dynamicChannelStrategy = null;
    return { activeProfile, profiles };
  }

  function renderChannelOptions() {
    const select = document.querySelector(`#${PANEL_ID} [data-role="channel"]`);
    if (!select) return;
    const selected = select.value;
    const channels = Array.from(CHANNELS.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
    select.innerHTML = channels.length
      ? channels.map((channel) => `<option value="${escapeHtml(channel.id)}">${escapeHtml(channel.name)} · ${escapeHtml(channel.id)}</option>`).join("")
      : `<option value="">等待渠道列表加载</option>`;
    if (selected && CHANNELS.has(selected)) select.value = selected;
  }

  function renderKeyOptions() {
    const select = document.querySelector(`#${PANEL_ID} [data-role="key"]`);
    if (!select) return;
    select.innerHTML = keysCache.length
      ? keysCache.map((key) => `<option value="${escapeHtml(key.id)}">${escapeHtml(key.name || key.key || key.id)}</option>`).join("")
      : `<option value="">暂无 API Key</option>`;
  }

  function selectedChannelID() { return getValue("channel"); }
  function getValue(role) { return document.querySelector(`#${PANEL_ID} [data-role="${role}"]`)?.value || ""; }
  function setStatus(message) {
    const status = document.querySelector(`#${PANEL_ID} [data-role="status"]`);
    if (status) status.textContent = message;
  }
  function setBusy(isBusy) {
    document.querySelectorAll(`#${PANEL_ID} button`).forEach((button) => { button.disabled = isBusy; });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function startMountWatcher() {
    schedulePanel();
    new MutationObserver(schedulePanel).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("popstate", schedulePanel);
    window.addEventListener("hashchange", schedulePanel);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startMountWatcher, { once: true });
  else startMountWatcher();
})();

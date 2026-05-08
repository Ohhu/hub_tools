// ==UserScript==
// @name         LinuxDo Hub 渠道 Key 绑定最小版
// @namespace    https://hub.linux.do/
// @version      0.1.0
// @description  在 Hub 页面用弹窗把选中的渠道绑定到 API Key。
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
  const PANEL_ID = "hub-key-binder-minimal", TRIGGER_CLASS = `${PANEL_ID}-trigger`;
  const DIALOG_ID = `${PANEL_ID}-dialog`;
  const nativeFetch = window.fetch.bind(window);
  const graphqlHeaders = { authorization: "", projectID: PROJECT_ID };
  let meCache = null, keysCache = [], mountTimer = 0;

  const queries = {
    createKey: "mutation CreateAPIKey($input:CreateAPIKeyInput!){createAPIKey(input:$input){id key name status type}}",
    getKeys: "query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id key name type status}}pageInfo{hasNextPage endCursor}}}",
    getKey: "query GetApiKey($id:ID!){node(id:$id){... on APIKey{id name status profiles{activeProfile profiles{name modelMappings{from to} channelIDs channelTags channelTagsMatchMode modelIDs loadBalanceStrategy channelBindingMode dynamicChannelStrategy{mode maxChannels minChannels maxPriceMultiplier maxLatencyMs minSuccessRate onlyOfficial includeTags excludeTags excludeChannelIDs fallbackChannelIDs} quota{requests totalTokens cost period{type pastDuration{value unit} calendarDuration{unit}}}}}}}}",
    updateProfiles: "mutation UpdateAPIKeyProfiles($id:ID!,$input:UpdateAPIKeyProfilesInput!){updateAPIKeyProfiles(id:$id,input:$input){id name status profiles{activeProfile profiles{name channelIDs channelBindingMode}}}}",
    me: "query Me{me{id projects{projectID}}}",
  };

  window.fetch = async function patchedFetch(input, init) {
    const response = await nativeFetch(input, init);
    rememberGraphqlContext(input, init);
    schedulePanel();
    return response;
  };

  function rememberGraphqlContext(input, init) {
    const url = typeof input === "string" ? input : input?.url;
    if (!String(url || "").includes(GRAPHQL_PATH)) return;
    rememberGraphqlHeaders(input, init);
  }

  function rememberGraphqlHeaders(input, init) {
    const headers = new Headers(init?.headers || input?.headers || {});
    const auth = headers.get("authorization"), projectID = headers.get("x-project-id");
    if (auth) graphqlHeaders.authorization = auth;
    if (projectID) graphqlHeaders.projectID = projectID;
  }

  function extractNumericChannelID(channelID) {
    if (typeof channelID === "number") return Number.isFinite(channelID) ? channelID : null;
    const text = String(channelID || "");
    if (/^\d+$/.test(text)) return Number(text);
    const match = text.match(/^gid:\/\/axonhub\/Channel\/(\d+)$/);
    return match ? Number(match[1]) : null;
  }

  function schedulePanel() {
    if (!location.pathname.startsWith("/marketplace") && !location.pathname.startsWith("/project/api-keys")) return;
    if (mountTimer) return;
    mountTimer = setTimeout(() => { mountTimer = 0; ensurePanel(); }, 80);
  }

  function ensurePanel() {
    injectStyle();
    for (const anchor of findCreateApiButtons()) {
      const trigger = anchor.parentElement?.querySelector(`.${TRIGGER_CLASS}`);
      if (trigger) updateTriggerChannel(trigger, anchor);
      else anchor.insertAdjacentElement("afterend", createTrigger(anchor));
    }
  }

  function findCreateApiButtons() { return Array.from(document.querySelectorAll('main [data-slot="card"] button')).filter((node) => /创建\s*API\s*密钥|Create\s*API\s*Key/i.test(node.textContent || "")); }

  function createTrigger(anchor) {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = "更新 API 密钥";
    button.className = anchor.className || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-9 rounded-md px-4";
    button.classList.add(TRIGGER_CLASS);
    updateTriggerChannel(button, anchor);
    button.addEventListener("click", openDialog);
    return button;
  }

  function findCardChannelName(node) { return node.closest('[data-slot="card"]')?.querySelector('[data-slot="card-title"]')?.textContent?.trim() || ""; }

  function findCardChannel(node) {
    const card = node.closest('[data-slot="card"]');
    const name = findCardChannelName(node);
    const channel = findReactChannel(card) || {};
    return {
      id: channel.id ? String(channel.id) : "",
      name: channel.name || name,
    };
  }

  function updateTriggerChannel(trigger, anchor) {
    const channel = findCardChannel(anchor);
    trigger.dataset.channelName = channel.name;
    if (channel.id) trigger.dataset.channelId = channel.id;
    else delete trigger.dataset.channelId;
  }

  function findReactChannel(node) {
    for (const current of [node, ...Array.from(node?.querySelectorAll("*") || [])]) {
      for (const key of Object.keys(current || {})) {
        if (!key.startsWith("__reactProps$") && !key.startsWith("__reactFiber$")) continue;
        const channel = findChannelInObject(current[key]);
        if (channel) return channel;
      }
    }
    return null;
  }

  function findChannelInObject(value, seen = new Set()) {
    if (!value || typeof value !== "object" || seen.has(value)) return null;
    seen.add(value);
    if (value.__typename === "Channel" && value.id) return value;
    if (value.id && value.name && extractNumericChannelID(value.id)) return value;
    for (const child of Object.values(value)) {
      const found = findChannelInObject(child, seen);
      if (found) return found;
    }
    return null;
  }

  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style"); style.id = `${PANEL_ID}-style`;
    style.textContent = `.${TRIGGER_CLASS}{margin-left:4px}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(17,24,39,.45);padding:16px;color:#111827}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(560px,100%);border:1px solid #d1d5db;background:#fff;border-radius:8px;padding:18px;box-shadow:0 20px 45px rgba(0,0,0,.2)}#${DIALOG_ID} .hkb-head,#${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:12px}
      #${DIALOG_ID} .hkb-title{font-size:16px;line-height:24px;font-weight:600}#${DIALOG_ID} .hkb-subtitle,#${DIALOG_ID} .hkb-status{color:#4b5563;font-size:13px;line-height:20px}#${DIALOG_ID} .hkb-grid{display:grid;gap:12px;margin:16px 0}#${DIALOG_ID} .hkb-field{display:grid;gap:6px;font-size:13px;font-weight:500}
      #${DIALOG_ID} .hkb-switch{display:grid;grid-template-columns:1fr 1fr;gap:4px;border:1px solid #d1d5db;border-radius:8px;background:#f3f4f6;padding:4px}#${DIALOG_ID} .hkb-mode{min-height:34px;background:transparent;color:#4b5563}#${DIALOG_ID} .hkb-mode[aria-selected="true"]{border-color:#d1d5db;background:#fff;color:#111827;box-shadow:0 1px 2px rgba(17,24,39,.08)}
      #${DIALOG_ID} .hkb-current-channel{min-height:38px;border:1px solid #d1d5db;border-radius:6px;background:#f9fafb;color:#111827;font-size:13px;line-height:20px;padding:8px 10px}#${DIALOG_ID} .hkb-section{display:grid;gap:10px;border:1px solid #e5e7eb;border-radius:8px;padding:12px}#${DIALOG_ID} .hkb-section-title{font-size:14px;font-weight:600;line-height:20px}
      #${DIALOG_ID} .hkb-row,#${DIALOG_ID} .hkb-created{display:flex;align-items:end;justify-content:flex-end;gap:8px;flex-wrap:wrap}#${DIALOG_ID} .hkb-created .hkb-field{flex:1 1 320px}#${DIALOG_ID} select,#${DIALOG_ID} input{width:100%;min-height:38px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:inherit;font:inherit;padding:0 10px;outline:none}
      #${DIALOG_ID} select:focus,#${DIALOG_ID} input:focus{border-color:#111827;box-shadow:0 0 0 2px rgba(17,24,39,.12)}#${DIALOG_ID} button{min-height:38px;border-radius:6px;border:1px solid transparent;padding:0 12px;font:inherit;font-size:14px;font-weight:500;cursor:pointer}#${DIALOG_ID} button:disabled{cursor:not-allowed;opacity:.6}#${DIALOG_ID} .hkb-primary{background:#111827;color:#f9fafb}#${DIALOG_ID} .hkb-secondary{border-color:#d1d5db;background:#fff;color:inherit}`;
    (document.head || document.documentElement).appendChild(style);
  }

  async function handlePanelClick(event) {
    const action = event.target?.dataset?.action;
    if (!action) return;
    if (action === "set-key-mode") {
      setKeyMode(event.target.dataset.mode || "update");
      return;
    }
    try {
      setBusy(true);
      if (action === "reload-keys") await loadKeys(true);
      else if (action === "bind-existing") await updateExistingKeyBinding();
      else if (action === "create-bind") await createKeyAndBind();
      else if (action === "copy-created-key") await copyCreatedKey();
    } catch (error) { setStatus(error?.message || "操作失败"); } finally { setBusy(false); }
  }

  function openDialog() {
    ensureDialog(); document.getElementById(DIALOG_ID).hidden = false;
    const channel = { id: this?.dataset?.channelId || "", name: this?.dataset?.channelName || "" };
    setCurrentChannel(channel);
    clearCreatedKey();
    setKeyMode("update");
    loadKeys().catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID); if (dialog) dialog.hidden = true;
  }

  function ensureDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID; dialog.hidden = true;
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true" aria-labelledby="hkb-title">
      <div class="hkb-head"><div><div class="hkb-title" id="hkb-title">更新 API 密钥</div><div class="hkb-subtitle">把选中的渠道写入 API Key 的当前 profile</div></div><button type="button" class="hkb-secondary" data-action="close">关闭</button></div>
      <div class="hkb-grid"><div class="hkb-field"><span>当前渠道</span><div class="hkb-current-channel" data-role="channel-label"></div></div>
        <div class="hkb-switch" role="tablist" aria-label="密钥操作">
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="update" aria-selected="true">更新已有</button>
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="create" aria-selected="false">新建密钥</button>
        </div>
        <div class="hkb-section" data-panel="update" role="tabpanel"><div class="hkb-section-title">选择要更新的 API Key</div><label class="hkb-field"><span>API Key</span><select data-role="key"></select></label><div class="hkb-row"><button type="button" class="hkb-secondary" data-action="reload-keys">刷新 Key</button><button type="button" class="hkb-primary" data-action="bind-existing">更新密钥</button></div></div>
        <div class="hkb-section" data-panel="create" role="tabpanel" hidden><div class="hkb-section-title">新建 Key 并绑定当前渠道</div><label class="hkb-field"><span>新 Key 名称</span><input data-role="new-key-name" type="text" placeholder="填写后新建并绑定"></label><div class="hkb-row"><button type="button" class="hkb-primary" data-action="create-bind">新建并绑定</button></div><div class="hkb-created" data-role="created-key-wrap" hidden><label class="hkb-field"><span>新 API Key</span><input data-role="created-key" type="text" readonly></label><button type="button" class="hkb-secondary" data-action="copy-created-key">复制</button></div></div>
      </div><div class="hkb-actions"><div class="hkb-status" data-role="status">等待 API Key 数据</div></div></div>`;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target?.dataset?.action === "close") closeDialog();
      else handlePanelClick(event);
    });
    document.body.appendChild(dialog);
  }

  function setKeyMode(mode) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const selectedMode = mode === "create" ? "create" : "update";
    dialog.dataset.keyMode = selectedMode;
    dialog.querySelectorAll("[data-action='set-key-mode']").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.mode === selectedMode));
    });
    dialog.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== selectedMode;
    });
    const title = dialog.querySelector("#hkb-title");
    if (title) title.textContent = selectedMode === "create" ? "新建 API 密钥" : "更新 API 密钥";
    setStatus(selectedMode === "create" ? "填写名称后新建并绑定当前渠道" : "请选择 API Key");
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
    setStatus(keys.length ? "请选择 API Key" : "没有读取到可用 API Key");
    return keys;
  }

  async function createKey(name) {
    const data = await graphql(queries.createKey, { input: { name, type: "user", projectID: graphqlHeaders.projectID } }, "CreateAPIKey");
    return data.createAPIKey;
  }

  async function updateExistingKeyBinding() {
    await bindChannelToKey(getValue("key"), currentChannelID());
    setStatus("已更新选中 Key 的渠道绑定");
  }

  async function createKeyAndBind() {
    const name = getValue("new-key-name").trim();
    if (!name) throw new Error("请先填写新 Key 名称");
    const key = await createKey(name);
    await bindChannelToKey(key.id, currentChannelID());
    await loadKeys(true);
    showCreatedKey(apiKeyValue(key));
    setStatus(`已新建并绑定：${key.name || name}`);
  }

  async function bindChannelToKey(keyID, channelID) {
    if (!keyID) throw new Error("请选择 API Key");
    if (!channelID) throw new Error("请选择渠道");
    setStatus("正在读取当前 Key 配置");
    const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
    const numericChannelID = extractNumericChannelID(channelID);
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    if (!numericChannelID) throw new Error(`渠道 ID 无效：${channelID}`);
    setStatus("正在写入渠道绑定");
    await graphql(queries.updateProfiles, { id: keyID, input: buildProfilesInput(data.node.profiles, numericChannelID) }, "UpdateAPIKeyProfiles");
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

  function renderKeyOptions() {
    const select = document.querySelector(`#${DIALOG_ID} [data-role="key"]`);
    if (!select) return;
    select.innerHTML = keysCache.length
      ? keysCache.map((key) => `<option value="${escapeHtml(key.id)}">${escapeHtml(key.name || key.key || key.id)}</option>`).join("")
      : `<option value="">暂无 API Key</option>`;
  }

  function setCurrentChannel(channel) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    dialog.dataset.channelId = channel.id || "";
    dialog.dataset.channelName = channel.name || "";
    const label = document.querySelector(`#${DIALOG_ID} [data-role="channel-label"]`);
    if (label) label.textContent = channel.name ? `${channel.name}${channel.id ? ` · ${channel.id}` : ""}` : "未读取到当前渠道";
    setStatus(channel.id ? "请选择 API Key" : "未读取到当前渠道 ID，请刷新页面后重试");
  }

  function currentChannelID() {
    const channelID = document.getElementById(DIALOG_ID)?.dataset?.channelId || "";
    if (!channelID) throw new Error("未读取到当前渠道 ID");
    return channelID;
  }

  function apiKeyValue(key) { return String(key?.key || ""); }

  function showCreatedKey(value) {
    const wrap = document.querySelector(`#${DIALOG_ID} [data-role="created-key-wrap"]`);
    const input = document.querySelector(`#${DIALOG_ID} [data-role="created-key"]`);
    if (!wrap || !input) return;
    input.value = value || "创建成功，但响应里没有返回 Key";
    wrap.hidden = false;
  }

  function clearCreatedKey() {
    const wrap = document.querySelector(`#${DIALOG_ID} [data-role="created-key-wrap"]`);
    const input = document.querySelector(`#${DIALOG_ID} [data-role="created-key"]`);
    if (input) input.value = "";
    if (wrap) wrap.hidden = true;
  }

  async function copyCreatedKey() {
    const value = getValue("created-key");
    if (!value || value.startsWith("创建成功")) throw new Error("没有可复制的 API Key");
    await navigator.clipboard.writeText(value);
    setStatus("已复制新 API Key");
  }

  function getValue(role) { return document.querySelector(`#${DIALOG_ID} [data-role="${role}"]`)?.value || ""; }
  function setStatus(message) {
    const status = document.querySelector(`#${DIALOG_ID} [data-role="status"]`); if (status) status.textContent = message;
  }
  function setBusy(isBusy) { document.querySelectorAll(`#${DIALOG_ID} button`).forEach((button) => { button.disabled = isBusy; }); }

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
    window.addEventListener("popstate", schedulePanel); window.addEventListener("hashchange", schedulePanel);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startMountWatcher, { once: true });
  else startMountWatcher();

  if (window.__hubKeyBinderEnableTest) {
    window.__hubKeyBinderTest = {
      extractNumericChannelID,
      findCardChannel,
      apiKeyValue,
    };
  }
})();

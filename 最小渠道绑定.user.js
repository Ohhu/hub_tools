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
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(17,24,39,.45);padding:16px;color:#111827;font-family:system-ui,-apple-system,sans-serif}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(440px,100%);background:#fff;border-radius:12px;padding:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}
      #${DIALOG_ID} .hkb-switch{display:flex;gap:0;border-bottom:1px solid #e5e7eb;margin-bottom:20px}
      #${DIALOG_ID} .hkb-mode{min-height:auto;border:none;border-bottom:2px solid transparent;background:transparent;color:#9ca3af;font-size:15px;font-weight:500;padding:0 16px 10px;cursor:pointer;margin-bottom:-1px;transition:color .15s,border-color .15s}#${DIALOG_ID} .hkb-mode:hover{color:#6b7280}#${DIALOG_ID} .hkb-mode[aria-selected="true"]{color:#111827;border-bottom-color:#111827;font-weight:600}
      #${DIALOG_ID} .hkb-grid{display:grid;gap:20px}
      #${DIALOG_ID} .hkb-field{display:grid;gap:6px}
      #${DIALOG_ID} .hkb-label{font-size:13px;font-weight:500;color:#374151}
      #${DIALOG_ID} .hkb-channel-tag{display:inline-flex;align-items:center;gap:6px;height:36px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;color:#111827;font-size:13px;padding:0 12px}
      #${DIALOG_ID} select,#${DIALOG_ID} input[type="text"]{width:100%;height:36px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:inherit;font:inherit;padding:0 12px;outline:none;transition:border-color .15s,box-shadow .15s}#${DIALOG_ID} select:focus,#${DIALOG_ID} input[type="text"]:focus{border-color:#6b7280;box-shadow:0 0 0 3px rgba(107,114,128,.1)}
      #${DIALOG_ID} .hkb-readonly-wrap{position:relative;display:flex;align-items:center}#${DIALOG_ID} .hkb-readonly-wrap input{padding-right:36px;background:#f3f4f6;border-color:#e5e7eb;color:#6b7280;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px}#${DIALOG_ID} .hkb-inline-copy{position:absolute;right:4px;height:28px;width:28px;border:none;border-radius:6px;background:transparent;color:#9ca3af;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:color .15s,background .15s}#${DIALOG_ID} .hkb-inline-copy:hover{color:#374151;background:#e5e7eb}
      #${DIALOG_ID} .hkb-select-row{display:flex;align-items:center;gap:6px}#${DIALOG_ID} .hkb-select-row>select{flex:1;min-width:0}#${DIALOG_ID} .hkb-icon-btn{height:36px;width:36px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#9ca3af;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s,border-color .15s}#${DIALOG_ID} .hkb-icon-btn:hover{color:#374151;background:#f9fafb;border-color:#9ca3af}
      #${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:8px;padding-top:16px;border-top:1px solid #f3f4f6}
      #${DIALOG_ID} .hkb-status{color:#6b7280;font-size:12px;line-height:16px;flex:1}
      #${DIALOG_ID} button{min-height:36px;border-radius:8px;border:1px solid transparent;padding:0 16px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:background .15s,opacity .15s}#${DIALOG_ID} button:disabled{cursor:not-allowed;opacity:.5}
      #${DIALOG_ID} .hkb-primary{background:#111827;color:#f9fafb}#${DIALOG_ID} .hkb-primary:hover{background:#1f2937}#${DIALOG_ID} .hkb-secondary{border-color:#d1d5db;background:#fff;color:#374151}#${DIALOG_ID} .hkb-secondary:hover{background:#f9fafb}`;
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
      else if (action === "copy-key") await copySelectedKey();
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
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true">
      <div class="hkb-switch" role="tablist" aria-label="密钥操作">
        <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="update" aria-selected="true">更新绑定</button>
        <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="create" aria-selected="false">新建密钥</button>
      </div>
      <div class="hkb-grid">
        <div class="hkb-field"><span class="hkb-label">当前渠道</span><div class="hkb-channel-tag" data-role="channel-label"></div></div>
        <div data-panel="update" role="tabpanel">
          <div class="hkb-field"><span class="hkb-label">API Key</span><div class="hkb-select-row"><select data-role="key"></select><button type="button" class="hkb-icon-btn" data-action="copy-key" title="复制密钥">⧉</button><button type="button" class="hkb-icon-btn" data-action="reload-keys" title="刷新">↻</button></div></div>
        </div>
        <div data-panel="create" role="tabpanel" hidden>
          <div class="hkb-field"><span class="hkb-label">Key 名称</span><input data-role="new-key-name" type="text" placeholder="输入 Key 名称"></div>
          <div class="hkb-created" data-role="created-key-wrap" hidden>
            <div class="hkb-field"><span class="hkb-label">生成的密钥</span><div class="hkb-readonly-wrap"><input data-role="created-key" type="text" readonly><button type="button" class="hkb-inline-copy" data-action="copy-created-key" title="复制">⧉</button></div></div>
          </div>
        </div>
      </div>
      <div class="hkb-actions"><div class="hkb-status" data-role="status"></div><button type="button" class="hkb-secondary" data-action="close">关闭</button><button type="button" class="hkb-primary" data-action="bind-existing" data-panel="update">更新绑定</button><button type="button" class="hkb-primary" data-action="create-bind" data-panel="create" hidden>新建并绑定</button></div>
    </div>`;
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
    dialog.querySelectorAll("[data-panel]").forEach((el) => {
      el.hidden = el.dataset.panel !== selectedMode;
    });
    const actions = dialog.querySelector(".hkb-actions");
    if (actions) actions.querySelectorAll("[data-panel]").forEach((el) => {
      el.hidden = el.dataset.panel !== selectedMode;
    });
    setStatus("");
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
    setStatus(keys.length ? "" : "没有可用 API Key");
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
    if (label) label.textContent = channel.name || "未读取到当前渠道";
    setStatus(channel.id ? "" : "未读取到渠道 ID，请刷新重试");
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

  async function copySelectedKey() {
    const keyID = getValue("key");
    if (!keyID) throw new Error("请先选择 API Key");
    const key = keysCache.find((k) => k.id === keyID);
    if (!key?.key) throw new Error("该 Key 无可复制的密钥值");
    await navigator.clipboard.writeText(key.key);
    setStatus("已复制密钥");
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

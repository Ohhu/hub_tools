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

  async function loadMissingChannelNames(channelIDs) {
    const missingIDs = uniqueChannelIDs(channelIDs)
      .filter((id) => !channelCache.has(String(id)))
      .slice(0, CHANNEL_NAME_LOOKUP_LIMIT);
    const results = await Promise.all(missingIDs.map((id) => loadChannelName(id).catch(() => null)));
    return results.filter(Boolean).length;
  }

  async function loadChannelName(channelID) {
    const numericID = extractNumericChannelID(channelID);
    if (!numericID) return null;
    if (channelCache.has(String(numericID))) return channelCache.get(String(numericID));
    if (channelNameRequestCache.has(numericID)) return channelNameRequestCache.get(numericID);
    const request = graphql(
      queries.getChannelName,
      { id: `gid://axonhub/Channel/${numericID}` },
      "GetChannelName",
    ).then((data) => {
      const channel = data?.node;
      if (channel?.id && channel?.name) {
        rememberChannel(channel);
        return channelCache.get(String(numericID)) || channel;
      }
      return null;
    }).finally(() => {
      channelNameRequestCache.delete(numericID);
    });
    channelNameRequestCache.set(numericID, request);
    return request;
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

  async function updateExistingKeyBinding(mode) {
    const result = await bindChannelToKey(selectedKeyID, currentChannelID(), mode);
    if (mode === "append" && result.alreadyBound) setStatus("当前渠道已在选中 Key 的绑定列表中");
    else setStatus(mode === "replace" ? "已替换选中 Key 的渠道绑定" : "已追加当前渠道到选中 Key");
  }

  async function createKeyAndBind() {
    const name = getValue("new-key-name").trim();
    if (!name) throw new Error("请先填写新 Key 名称");
    const key = await createKey(name);
    await bindChannelToKey(key.id, currentChannelID(), "replace");
    await loadKeys(true);
    setCreatedKeyValue(apiKeyValue(key));
    setStatus(`已新建并绑定：${key.name || name}`);
  }

  async function bindChannelToKey(keyID, channelID, mode = "replace") {
    if (!keyID) throw new Error("请选择 API Key");
    if (!channelID) throw new Error("请选择渠道");
    setStatus("正在读取当前 Key 配置");
    const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
    const numericChannelID = extractNumericChannelID(channelID);
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    if (!numericChannelID) throw new Error(`渠道 ID 无效：${channelID}`);
    setStatus("正在写入渠道绑定");
    const input = buildProfilesInput(data.node.profiles, numericChannelID, mode);
    await graphql(queries.updateProfiles, { id: keyID, input }, "UpdateAPIKeyProfiles");
    return { alreadyBound: mode === "append" && getActiveProfile(data.node.profiles).channelIDs?.includes(numericChannelID) };
  }

  function buildProfilesInput(profilesPayload, channelID, mode = "replace") {
    const targetIDs = mode === "append"
      ? uniqueChannelIDs([...currentProfileChannelIDs(profilesPayload), channelID])
      : [channelID];
    return buildProfilesInputWithChannelIDs(profilesPayload, targetIDs);
  }

  function buildProfilesInputWithChannelIDs(profilesPayload, channelIDs) {
    const activeProfile = profilesPayload.activeProfile || "default";
    const profiles = Array.isArray(profilesPayload.profiles) && profilesPayload.profiles.length
      ? profilesPayload.profiles.map((profile) => ({ ...profile }))
      : [{ name: activeProfile }];
    const target = profiles.find((profile) => profile.name === activeProfile) || profiles[0];
    target.name = target.name || activeProfile;
    target.channelIDs = uniqueChannelIDs(channelIDs);
    target.channelTags = Array.isArray(target.channelTags) ? target.channelTags : [];
    target.channelTagsMatchMode = target.channelTagsMatchMode || "any";
    target.modelMappings = Array.isArray(target.modelMappings) ? target.modelMappings : [];
    target.modelIDs = Array.isArray(target.modelIDs) ? target.modelIDs : [];
    target.channelBindingMode = "manual";
    target.dynamicChannelStrategy = null;
    return { activeProfile, profiles };
  }

  function getActiveProfile(profilesPayload) {
    const activeProfile = profilesPayload?.activeProfile || "default";
    const profiles = Array.isArray(profilesPayload?.profiles) ? profilesPayload.profiles : [];
    return profiles.find((profile) => profile.name === activeProfile) || profiles[0] || {};
  }

  function currentProfileChannelIDs(profilesPayload) {
    return uniqueChannelIDs(getActiveProfile(profilesPayload).channelIDs || []);
  }

  function uniqueChannelIDs(channelIDs) {
    const ids = [];
    const seen = new Set();
    for (const id of channelIDs || []) {
      const numericID = extractNumericChannelID(id);
      if (!numericID || seen.has(numericID)) continue;
      seen.add(numericID);
      ids.push(numericID);
    }
    return ids;
  }

  function renderKeyOptions() {
    if (!keysCache.some((key) => key.id === selectedKeyID)) selectedKeyID = keysCache[0]?.id || "";
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
      menu.innerHTML = keysCache.length
        ? keysCache.map((key) => `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}" role="option" aria-selected="${String(key.id === selectedKeyID)}"><span>${escapeHtml(keyLabel(key))}</span></button></li>`).join("")
        : `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="" role="option" disabled>暂无 API Key</button></li>`;
    });
    syncKeyPicker();
  }

  function setCurrentChannel(channel, options = {}) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    dialog.dataset.channelId = channel.id || "";
    dialog.dataset.channelName = channel.name || "";
    const label = document.querySelector(`#${DIALOG_ID} [data-role="channel-label"]`);
    if (label) label.textContent = channel.name || (options.allowEmpty ? "未指定" : "未读取到当前渠道");
    setStatus(channel.id || options.allowEmpty ? "" : "未读取到渠道 ID，请刷新重试");
  }

  function currentChannelID() {
    const channelID = document.getElementById(DIALOG_ID)?.dataset?.channelId || "";
    if (!channelID) throw new Error("无当前渠道");
    return channelID;
  }

  async function openEditPanel() {
    if (!selectedKeyID) throw new Error("请先选择 API Key");
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const channelID = dialog.dataset.channelId || "";
    showEditPanel();
    setEditDirty(false);
    setEditStatus("加载中");
    const channelLabelEl = dialog.querySelector("[data-role='edit-channel-label']");
    if (channelLabelEl) channelLabelEl.textContent = channelID ? channelLabel(channelID) : "未指定";
    syncKeyPicker();
    const data = await graphql(queries.getKey, { id: selectedKeyID }, "GetApiKey");
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    editChannelIDs = currentProfileChannelIDs(data.node.profiles);
    renderEditChannelList();
    const loadToken = ++editLoadToken;
    loadMissingChannelNames(editChannelIDs).then((loaded) => {
      if (loaded && loadToken === editLoadToken && currentViewPanel() === "edit") renderEditChannelList();
    }).catch(() => {});
    setEditStatus("");
  }

  function showEditPanel() {
    closeKeyMenu();
    showViewPanel("edit");
  }

  function showMainPanel() {
    editChannelIDs = [];
    editLoadToken += 1;
    setEditDirty(false);
    showViewPanel("main");
    setEditStatus("");
  }

  function showViewPanel(view) {
    document.querySelectorAll(`#${DIALOG_ID} [data-view-panel]`).forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
  }

  function currentViewPanel() {
    return document.querySelector(`#${DIALOG_ID} [data-view-panel]:not([hidden])`)?.dataset?.viewPanel || "main";
  }

  function addCurrentChannelToEditList() {
    const numericID = extractNumericChannelID(currentChannelID());
    if (!numericID) throw new Error("无当前渠道");
    if (editChannelIDs.includes(numericID)) {
      setEditStatus("已存在");
      return;
    }
    editChannelIDs = [...editChannelIDs, numericID];
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已添加");
  }

  function removeEditChannel(channelID) {
    const numericID = extractNumericChannelID(channelID);
    if (!numericID) {
      setEditStatus("渠道 ID 无效");
      return;
    }
    editChannelIDs = editChannelIDs.filter((id) => id !== numericID);
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已移除");
  }

  function moveEditChannel(channelID, direction) {
    const numericID = extractNumericChannelID(channelID);
    const currentIndex = editChannelIDs.indexOf(numericID);
    const offset = direction === "up" ? -1 : 1;
    const nextIndex = currentIndex + offset;
    if (!numericID || currentIndex < 0 || nextIndex < 0 || nextIndex >= editChannelIDs.length) return;
    const nextIDs = [...editChannelIDs];
    [nextIDs[currentIndex], nextIDs[nextIndex]] = [nextIDs[nextIndex], nextIDs[currentIndex]];
    editChannelIDs = nextIDs;
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已调整");
  }

  async function saveEditBindings() {
    if (!selectedKeyID) throw new Error("请先选择 API Key");
    setEditStatus("保存中");
    const data = await graphql(queries.getKey, { id: selectedKeyID }, "GetApiKey");
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    const input = buildProfilesInputWithChannelIDs(data.node.profiles, editChannelIDs);
    await graphql(queries.updateProfiles, { id: selectedKeyID, input }, "UpdateAPIKeyProfiles");
    setEditDirty(false);
    setEditStatus("已保存");
  }

  function renderEditChannelList() {
    const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
    if (!list) return;
    list.innerHTML = editChannelIDs.length
      ? editChannelIDs.map((id, index) => renderEditChannelRow(id, index)).join("")
      : `<div class="hkb-empty">暂无绑定渠道</div>`;
  }

  function renderEditChannelRow(channelID, index) {
    const safeID = escapeHtml(channelID);
    const isFirst = index === 0;
    const isLast = index === editChannelIDs.length - 1;
    return `<div class="hkb-channel-row" data-channel-id="${safeID}">
      <span class="hkb-channel-index">${index + 1}</span>
      <span class="hkb-channel-name">${escapeHtml(channelLabel(channelID))}</span>
      <span class="hkb-channel-actions">
        <button type="button" class="hkb-icon-btn hkb-row-btn" data-action="edit-move-channel" data-direction="up" data-channel-id="${safeID}" title="上移" aria-label="上移" ${isFirst ? "disabled" : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg></button>
        <button type="button" class="hkb-icon-btn hkb-row-btn" data-action="edit-move-channel" data-direction="down" data-channel-id="${safeID}" title="下移" aria-label="下移" ${isLast ? "disabled" : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button>
        <button type="button" class="hkb-icon-btn hkb-row-btn hkb-remove" data-action="edit-remove-channel" data-channel-id="${safeID}" title="移除" aria-label="移除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>
      </span>
    </div>`;
  }

  function channelLabel(channelID) {
    const id = String(channelID || "");
    const channel = channelCache.get(id) || channelCache.get(String(extractNumericChannelID(id) || ""));
    return channel?.name || (id ? `Channel #${extractNumericChannelID(id) || id}` : "未读取到当前渠道");
  }

  function apiKeyValue(key) { return String(key?.key || ""); }

  function setCreatedKeyValue(value) {
    createdKeyValueCache = String(value || "");
    syncActionButtons();
  }

  async function copyCreatedKey() {
    const value = createdKeyValue();
    if (!value) throw new Error("没有可复制的 API Key");
    await navigator.clipboard.writeText(value);
    setStatus("已复制新 API Key");
  }

  function createdKeyValue() { return createdKeyValueCache; }

  function syncActionButtons() {
    const dialog = document.getElementById(DIALOG_ID);
    const selectedMode = dialog?.dataset?.keyMode || "update";
    const actions = dialog?.querySelector(".hkb-actions");
    if (!actions) return;
    actions.querySelectorAll("[data-action-panel]").forEach((el) => {
      const isCopyCreated = el.dataset.role === "copy-created-key";
      const hasCreatedKey = Boolean(createdKeyValue());
      const isCreateBind = el.dataset.action === "create-bind";
      el.hidden = el.dataset.actionPanel !== selectedMode || (isCopyCreated && !hasCreatedKey) || (isCreateBind && hasCreatedKey);
    });
  }

  async function copySelectedKey() {
    const keyID = selectedKeyID;
    if (!keyID) throw new Error("请先选择 API Key");
    const data = await graphql(queries.getKeyValue, { id: keyID }, "GetApiKeyValue");
    const value = data?.node?.key;
    if (!value) throw new Error("该 Key 无可复制的密钥值");
    await navigator.clipboard.writeText(value);
    setStatus("已复制密钥");
  }

  function keyLabel(key) { return String(key?.name || key?.id || "未命名 API Key"); }

  function selectKey(keyID) {
    if (!keyID || !keysCache.some((key) => key.id === keyID)) return;
    selectedKeyID = keyID;
    syncKeyPicker();
  }

  function syncKeyPicker() {
    const current = keysCache.find((key) => key.id === selectedKeyID);
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-label"], #${DIALOG_ID} [data-role="edit-key-label"]`).forEach((label) => {
      label.textContent = current ? keyLabel(current) : "暂无 API Key";
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-trigger"], #${DIALOG_ID} [data-role="edit-key-trigger"]`).forEach((trigger) => {
      trigger.disabled = !keysCache.length;
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-action="select-key"]`).forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.keyId === selectedKeyID));
    });
  }

  function toggleKeyMenu() {
    const scope = currentViewPanel() === "edit" ? "edit-" : "";
    const trigger = document.querySelector(`#${DIALOG_ID} [data-role="${scope}key-trigger"]`);
    const menu = document.querySelector(`#${DIALOG_ID} [data-role="${scope}key-menu"]`);
    if (!trigger || !menu || !keysCache.length) return;
    const open = menu.hidden;
    closeKeyMenu();
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  }

  function closeKeyMenu() {
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
      menu.hidden = true;
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-trigger"], #${DIALOG_ID} [data-role="edit-key-trigger"]`).forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  function getValue(role) { return document.querySelector(`#${DIALOG_ID} [data-role="${role}"]`)?.value || ""; }
  function setStatus(message) {
    const status = document.querySelector(`#${DIALOG_ID} [data-role="status"]`); if (status) status.textContent = message;
  }
  function setEditStatus(message) {
    const status = document.querySelector(`#${DIALOG_ID} [data-role="edit-status"]`); if (status) status.textContent = message;
  }
  function setEditDirty(isDirty) {
    editDirty = Boolean(isDirty);
    const saveButton = document.querySelector(`#${DIALOG_ID} [data-action="save-edit"]`);
    if (saveButton) saveButton.dataset.dirty = String(editDirty);
  }
  function setBusy(isBusy) {
    document.querySelectorAll(`#${DIALOG_ID} button`).forEach((button) => { button.disabled = isBusy; });
    if (!isBusy) syncKeyPicker();
  }

  function markScrolling(node) {
    node.classList.add("is-scrolling");
    clearTimeout(node.__hkbScrollTimer);
    node.__hkbScrollTimer = setTimeout(() => node.classList.remove("is-scrolling"), 700);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPE_MAP[char]);
  }

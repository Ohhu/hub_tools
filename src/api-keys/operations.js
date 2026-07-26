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
  const channelLabelElement = dialog.querySelector("[data-role='edit-channel-label']");
  if (channelLabelElement) channelLabelElement.textContent = channelID ? channelLabel(channelID) : "未指定";
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

function apiKeyValue(key) {
  return String(key?.key || "");
}

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

function createdKeyValue() {
  return createdKeyValueCache;
}

function syncActionButtons() {
  const dialog = document.getElementById(DIALOG_ID);
  const selectedMode = dialog?.dataset?.keyMode || "update";
  const actions = dialog?.querySelector(".hkb-actions");
  if (!actions) return;
  actions.querySelectorAll("[data-action-panel]").forEach((element) => {
    const isCopyCreated = element.dataset.role === "copy-created-key";
    const hasCreatedKey = Boolean(createdKeyValue());
    const isCreateBind = element.dataset.action === "create-bind";
    element.hidden = element.dataset.actionPanel !== selectedMode
      || (isCopyCreated && !hasCreatedKey)
      || (isCreateBind && hasCreatedKey);
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

function getValue(role) {
  return document.querySelector(`#${DIALOG_ID} [data-role="${role}"]`)?.value || "";
}

function setStatus(message) {
  const status = document.querySelector(`#${DIALOG_ID} [data-role="status"]`);
  if (status) status.textContent = message;
}

function setBusy(isBusy) {
  document.querySelectorAll(`#${DIALOG_ID} button`).forEach((button) => {
    button.disabled = isBusy;
  });
  if (!isBusy) syncKeyPicker();
}

function escapeHtml(value) {
  return String(value ?? "").replace(HTML_ESCAPE_RE, (character) => HTML_ESCAPE_MAP[character]);
}

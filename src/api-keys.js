function buildProfilesInput(profilesPayload, channelID, mode = "replace") {
  const targetIDs = mode === "append"
    ? uniqueChannelIDs([...currentProfileChannelIDs(profilesPayload), channelID])
    : [channelID];
  return buildProfilesInputWithChannelIDs(profilesPayload, targetIDs);
}

function buildProfilesInputWithChannelIDs(profilesPayload, channelIDs) {
  const activeProfile = profilesPayload.activeProfile || "default";
  const profiles = Array.isArray(profilesPayload.profiles) && profilesPayload.profiles.length
    ? profilesPayload.profiles.map((profile) => ({
      ...profile,
      dynamicChannelStrategy: sanitizeDynamicChannelStrategyInput(profile.dynamicChannelStrategy),
    }))
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

// —— profiles 完整复制（0.4.14）：轮换密钥时把读到的绑定配置原样回写给新 Key ——
// 输出与输入字段同名（内省实测一致），白名单挑选 + 剔除 null 与必填字段缺失的节点即可，
// manual/dynamic 绑定、模型映射、配额、负载与路由策略全部保真，不重置为手动绑定。

const PROFILE_INPUT_KEYS = ["name", "modelMappings", "channelIDs", "channelTags", "channelTagsMatchMode", "modelIDs", "loadBalanceStrategy", "channelBindingMode", "quota", "routingPolicy", "dynamicChannelStrategy"];

function pruneInputNulls(value) {
  if (Array.isArray(value)) return value.map(pruneInputNulls);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      if (value[key] === null || value[key] === undefined) continue;
      out[key] = pruneInputNulls(value[key]);
    }
    return out;
  }
  return value;
}

// 列表内剔除缺必填字段的条目；清空后整个字段不提交（与省略等价）。
function keepCompleteEntries(input, key, isComplete) {
  if (!Array.isArray(input[key])) return;
  const kept = input[key].filter(isComplete);
  if (kept.length) input[key] = kept;
  else delete input[key];
}

// DynamicSelectionPolicy 合法值（2026-09-05 线上内省）。存量数据可能存空串等非法值——
// 读取不校验、写入校验严格（"is not a valid DynamicSelectionPolicy" 拒绝整笔 mutation），
// 回写前剔除非法值；该字段可空，剔除即回落服务端默认。
const DYNAMIC_SELECTION_POLICIES = ["ranked", "sticky_hrw", "power_of_two"];

function sanitizeDynamicChannelStrategyInput(strategy) {
  if (!strategy || typeof strategy !== "object") return strategy;
  const { selectionPolicy } = strategy;
  if (selectionPolicy == null || DYNAMIC_SELECTION_POLICIES.includes(selectionPolicy)) return strategy;
  const rest = { ...strategy };
  delete rest.selectionPolicy;
  return rest;
}

function buildProfileInputCopy(profile) {
  const input = pruneInputNulls(profile && typeof profile === "object" ? profile : {});
  for (const key of Object.keys(input)) {
    if (!PROFILE_INPUT_KEYS.includes(key)) delete input[key];
  }
  input.name = String(input.name || "default");
  if (Array.isArray(input.channelIDs)) input.channelIDs = input.channelIDs.filter((id) => Number.isInteger(id));
  keepCompleteEntries(input, "modelMappings", (item) => item?.from != null && item?.to != null);
  if (input.quota && !input.quota.period?.type) delete input.quota; // period.type 必填，缺失则放弃配额字段而非让迁移失败
  if (input.routingPolicy) {
    keepCompleteEntries(input.routingPolicy, "channelWeights", (item) => Number.isInteger(item?.channelID) && typeof item?.weight === "number");
    keepCompleteEntries(input.routingPolicy, "providerWeights", (item) => item?.provider != null && typeof item?.weight === "number");
    keepCompleteEntries(input.routingPolicy, "allowChannelAPIKeys", (item) => Number.isInteger(item?.channelID) && Array.isArray(item?.keyHashes) && item.keyHashes.length > 0);
    keepCompleteEntries(input.routingPolicy, "excludeChannelAPIKeys", (item) => Number.isInteger(item?.channelID) && Array.isArray(item?.keyHashes) && item.keyHashes.length > 0);
    if (!Object.keys(input.routingPolicy).length) delete input.routingPolicy;
  }
  if (input.dynamicChannelStrategy && !input.dynamicChannelStrategy.mode) delete input.dynamicChannelStrategy; // mode 必填
  else if (input.dynamicChannelStrategy) input.dynamicChannelStrategy = sanitizeDynamicChannelStrategyInput(input.dynamicChannelStrategy); // 剔除非法 selectionPolicy
  return input;
}

function buildProfilesInputCopy(profilesPayload) {
  const activeProfile = profilesPayload?.activeProfile || "default";
  const source = Array.isArray(profilesPayload?.profiles) ? profilesPayload.profiles : [];
  const profiles = source.length ? source.map((profile) => buildProfileInputCopy(profile)) : [{ name: activeProfile }];
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

function moveChannelIDToIndex(channelIDs, channelID, targetIndex) {
  const numericID = extractNumericChannelID(channelID);
  const currentIndex = channelIDs.indexOf(numericID);
  const nextIndex = Math.max(0, Math.min(channelIDs.length - 1, Number(targetIndex) || 0));
  if (!numericID || currentIndex < 0 || currentIndex === nextIndex) return channelIDs;
  const nextIDs = [...channelIDs];
  const [item] = nextIDs.splice(currentIndex, 1);
  nextIDs.splice(nextIndex, 0, item);
  return nextIDs;
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
    { id: channelGID(numericID) },
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
  setStatus("加载中");
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
  keysCache = sortKeys(keys);
  renderKeyOptions();
  setStatus(keys.length ? "" : "没有可用 API Key");
  return keys;
}

// 排序：emoji 等非文字符号排在前，文字名称（含中文）按 locale 首字母。
function sortKeys(keys) {
  const isTextual = (text) => /^[p{L}p{N}_]/u.test(text);
  return [...keys].sort((a, b) => {
    const aText = keyLabel(a);
    const bText = keyLabel(b);
    const aTextual = isTextual(aText);
    const bTextual = isTextual(bText);
    if (aTextual !== bTextual) return aTextual ? 1 : -1;
    return aText.localeCompare(bText, "zh-Hans-CN");
  });
}

async function createKey(name) {
  const data = await graphql(queries.createKey, { input: { name, type: "user", projectID: graphqlHeaders.projectID } }, "CreateAPIKey");
  return data.createAPIKey;
}

function renderKeyOptions() {
  if (!keysCache.some((key) => key.id === selectedKeyID)) selectedKeyID = keysCache[0]?.id || "";
  document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
    menu.innerHTML = keysCache.length
      ? keysCache.map((key) => renderKeyOptionRow(key)).join("")
      : `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="" role="option" disabled>暂无 API Key</button></li>`;
  });
  syncKeyPicker();
}

// option 主体负责选中，动作按钮与状态徽章为同级节点，避免 button 嵌套破坏 DOM 结构。
// 动作顺序：启用（开关）→ 更新（轮换）→ 归档；archived 行仅保留状态徽章。
function renderKeyOptionRow(key) {
  if (key.status === "archived") {
    return `<li class="hkb-key-option-row" role="option" aria-selected="${String(key.id === selectedKeyID)}" data-key-id="${escapeHtml(key.id)}"><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}"><span>${escapeHtml(keyLabel(key))}</span></button>${renderKeyStatusBadge(key)}</li>`;
  }
  return `<li class="hkb-key-option-row" role="option" aria-selected="${String(key.id === selectedKeyID)}" data-key-id="${escapeHtml(key.id)}"><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}"><span>${escapeHtml(keyLabel(key))}</span></button>${renderKeyStatusToggle(key)}${renderKeyRotateButton(key)}${renderKeyArchiveButton(key)}</li>`;
}

function renderKeyRotateButton(key) {
  const label = keyLabel(key);
  return `<button type="button" class="hkb-key-act" data-action="rotate-key" data-key-id="${escapeHtml(key.id)}" title="更新密钥" aria-label="更新密钥 ${escapeHtml(label)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M16 8h5V3"></path></svg></button>`;
}

function renderKeyArchiveButton(key) {
  const label = keyLabel(key);
  return `<button type="button" class="hkb-key-act" data-action="archive-key" data-key-id="${escapeHtml(key.id)}" title="归档" aria-label="归档 ${escapeHtml(label)}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="4" x="3" y="4" rx="1"></rect><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg></button>`;
}

// 归档：改名 #id 后归档，与轮换密钥同一命名约定，便于在密钥页识别来源。
async function archiveKey(keyID) {
  if (!keyID) throw new Error("请选择 API Key");
  const key = keysCache.find((entry) => entry.id === keyID);
  if (!key) throw new Error("未找到该 API Key");
  if (key.status === "archived") throw new Error("已归档 Key 不支持重复归档");
  const archivedName = keyArchiveName(keyID) || keyLabel(key);
  await graphql(queries.updateKey, { id: keyID, input: { name: archivedName } }, "UpdateAPIKey");
  await graphql(queries.updateKeyStatus, { id: keyID, status: "archived" }, "UpdateAPIKeyStatus");
  await loadKeys(true);
  return "archived";
}

const KEY_STATUS_LABELS = { enabled: "已启用", disabled: "已禁用", archived: "已归档" };

function keyStatusText(key) {
  return KEY_STATUS_LABELS[key?.status] || "";
}

// archived 为防御性保留：loadKeys 的 statusIn 过滤当前不含 archived。
function renderKeyStatusBadge(key) {
  const status = key?.status;
  const text = KEY_STATUS_LABELS[status];
  if (!text || status === "enabled") return "";
  return `<span class="hkb-key-status" data-status="${escapeHtml(status)}">${text}</span>`;
}

// 下拉面板内的启用/禁用开关：enabled/disabled 可直接切换，archived 等其余状态回落为状态徽章。
function renderKeyStatusToggle(key) {
  const status = key?.status;
  if (status !== "enabled" && status !== "disabled") return renderKeyStatusBadge(key);
  const enabled = status === "enabled";
  const label = keyLabel(key);
  return `<button type="button" class="hkb-key-toggle" data-action="toggle-key-status" data-key-id="${escapeHtml(key.id)}" data-status="${escapeHtml(status)}" role="switch" aria-checked="${String(enabled)}" aria-label="${escapeHtml(label)} 启用状态" title="${enabled ? "禁用" : "启用"} ${escapeHtml(label)}"><span class="hkb-key-toggle-track"><span class="hkb-key-toggle-thumb"></span></span></button>`;
}

// 开关状态即反馈，无文案提示；仅失败时回写错误信息。
async function toggleKeyStatus(keyID) {
  if (!keyID) throw new Error("请选择 API Key");
  const key = keysCache.find((entry) => entry.id === keyID);
  if (!key) throw new Error("未找到该 API Key");
  if (key.status === "archived") throw new Error("已归档 Key 不支持切换状态");
  const nextStatus = key.status === "enabled" ? "disabled" : "enabled";
  await graphql(queries.updateKeyStatus, { id: keyID, status: nextStatus }, "UpdateAPIKeyStatus");
  updateCachedKeyStatus(keyID, nextStatus);
  return nextStatus;
}

function keyLabel(key) {
  return String(key?.name || key?.id || "未命名 API Key");
}

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
  document.querySelectorAll(`#${DIALOG_ID} .hkb-key-option-row`).forEach((row) => {
    row.setAttribute("aria-selected", String(row.dataset.keyId === selectedKeyID));
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

const EDIT_CHANNEL_ROW_STEP = 40;
const EDIT_CHANNEL_ROW_HEIGHT = 36;
const EDIT_DRAG_SCROLL_EDGE = 34;
const EDIT_DRAG_SCROLL_SPEED = 4.3;

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
    setEditStatus("渠道无效");
    return;
  }
  editChannelIDs = editChannelIDs.filter((id) => id !== numericID);
  renderEditChannelList();
  setEditDirty(true);
  setEditStatus("已移除");
}

function clampEditChannelIndex(index) {
  return Math.max(0, Math.min(editChannelIDs.length - 1, index));
}

function handleEditChannelDragStart(event) {
  const handle = event.target?.closest?.('[data-action="edit-drag-channel"]');
  if (!handle) return;
  const numericID = extractNumericChannelID(handle.dataset.channelId || "");
  const currentIndex = editChannelIDs.indexOf(numericID);
  const list = handle.closest?.('[data-role="edit-channel-list"]');
  if (!numericID || currentIndex < 0 || !list) return;
  const listRect = list.getBoundingClientRect();
  const rowRect = handle.closest?.(".hkb-channel-row")?.getBoundingClientRect?.();
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget?.setPointerCapture?.(event.pointerId);
  editDragState = {
    channelID: numericID,
    pointerID: event.pointerId,
    pointerY: event.clientY,
    listTop: listRect.top,
    scrollTop: list.scrollTop || 0,
    grabOffsetY: event.clientY - (rowRect?.top || (listRect.top + currentIndex * EDIT_CHANNEL_ROW_STEP)),
    targetIndex: currentIndex,
  };
  renderEditChannelList();
  setEditStatus("");
}

function handleEditChannelDragMove(event) {
  if (!editDragState || editDragState.pointerID !== event.pointerId) return;
  const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
  if (!list || !editChannelIDs.length) return;
  const listRect = list.getBoundingClientRect();
  if (event.clientY - listRect.top < EDIT_DRAG_SCROLL_EDGE) {
    list.scrollTop = Math.max(0, (list.scrollTop || 0) - EDIT_DRAG_SCROLL_SPEED);
  } else if (listRect.bottom - event.clientY < EDIT_DRAG_SCROLL_EDGE) {
    list.scrollTop = Math.min(list.scrollHeight - list.clientHeight, (list.scrollTop || 0) + EDIT_DRAG_SCROLL_SPEED);
  }
  const scrollTop = list.scrollTop || 0;
  const contentY = event.clientY - listRect.top + scrollTop;
  editDragState = {
    ...editDragState,
    pointerY: event.clientY,
    listTop: listRect.top,
    scrollTop,
    targetIndex: clampEditChannelIndex(Math.floor(contentY / EDIT_CHANNEL_ROW_STEP)),
  };
  event.preventDefault();
  renderEditChannelList();
}

function handleEditChannelDragEnd(event) {
  if (!editDragState || editDragState.pointerID !== event.pointerId) return;
  const nextIDs = moveChannelIDToIndex(editChannelIDs, editDragState.channelID, editDragState.targetIndex);
  const changed = nextIDs !== editChannelIDs;
  editChannelIDs = nextIDs;
  editDragState = null;
  event.currentTarget?.releasePointerCapture?.(event.pointerId);
  renderEditChannelList();
  if (changed) setEditDirty(true);
  setEditStatus(changed ? "已调整" : "");
}

function cancelEditChannelDrag(event) {
  if (!editDragState || (event?.pointerId != null && editDragState.pointerID !== event.pointerId)) return;
  editDragState = null;
  renderEditChannelList();
  setEditStatus("");
}

function renderEditChannelList() {
  const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
  if (!list) return;
  if (!editChannelIDs.length) {
    editDragState = null;
    list.innerHTML = `<div class="hkb-empty">暂无绑定渠道</div>`;
    return;
  }
  list.innerHTML = renderEditChannelStage();
}

function renderEditChannelStage() {
  const dragIndex = editDragState ? editChannelIDs.indexOf(editDragState.channelID) : -1;
  const dragChannelID = dragIndex >= 0 ? editDragState.channelID : null;
  const targetIndex = dragChannelID ? clampEditChannelIndex(editDragState.targetIndex) : -1;
  const visibleIDs = dragChannelID ? editChannelIDs.filter((id) => id !== dragChannelID) : editChannelIDs;
  const slots = visibleIDs.map((id, visibleIndex) => {
    const displayIndex = dragChannelID && visibleIndex >= targetIndex ? visibleIndex + 1 : visibleIndex;
    return `<div class="hkb-channel-slot" style="top:${displayIndex * EDIT_CHANNEL_ROW_STEP}px">${renderEditChannelRow(id)}</div>`;
  }).join("");
  const placeholder = dragChannelID
    ? `<div class="hkb-channel-placeholder" style="top:${targetIndex * EDIT_CHANNEL_ROW_STEP}px;height:${EDIT_CHANNEL_ROW_HEIGHT}px"></div>`
    : "";
  const dragTop = dragChannelID
    ? Math.max(0, Math.min((editChannelIDs.length - 1) * EDIT_CHANNEL_ROW_STEP, editDragState.pointerY - editDragState.listTop + editDragState.scrollTop - editDragState.grabOffsetY))
    : 0;
  const dragging = dragChannelID
    ? `<div class="hkb-channel-slot" style="top:${dragTop}px;z-index:2;transition:none">${renderEditChannelRow(dragChannelID, { dragging: true })}</div>`
    : "";
  return `<div class="hkb-channel-list-stage" style="height:${editChannelIDs.length * EDIT_CHANNEL_ROW_STEP}px">${slots}${placeholder}${dragging}</div>`;
}

function renderEditChannelRow(channelID, options = {}) {
  const safeID = escapeHtml(channelID);
  const rowClass = options.dragging ? "hkb-channel-row is-dragging" : "hkb-channel-row";
  return `<div class="${rowClass}" data-channel-id="${safeID}">
    <button type="button" class="hkb-drag-handle" data-action="edit-drag-channel" data-channel-id="${safeID}" title="拖动排序" aria-label="拖动排序">::</button>
    <span class="hkb-channel-name">${escapeHtml(channelLabel(channelID))}</span>
    <span class="hkb-channel-actions">
      <button type="button" class="hkb-icon-btn hkb-row-btn hkb-remove" data-action="edit-remove-channel" data-channel-id="${safeID}" title="移除" aria-label="移除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>
    </span>
  </div>`;
}

function channelLabel(channelID) {
  const id = String(channelID || "");
  const channel = findCachedChannelByID(id);
  return channel?.name || (id ? `Channel #${extractNumericChannelID(id) || id}` : "未读取到当前渠道");
}

function setEditStatus(message) {
  const status = document.querySelector(`#${DIALOG_ID} [data-role="edit-status"]`);
  if (status) status.textContent = message;
}

function setEditKeyName(name) {
  editKeyNameBaseline = String(name || "");
  const input = document.querySelector(`#${DIALOG_ID} [data-role="edit-key-name"]`);
  if (input) input.value = editKeyNameBaseline;
}

function setEditDirty(isDirty) {
  editDirty = Boolean(isDirty);
  const saveButton = document.querySelector(`#${DIALOG_ID} [data-action="save-edit"]`);
  if (saveButton) saveButton.dataset.dirty = String(editDirty);
}

function markScrolling(node) {
  node.classList.add("is-scrolling");
  clearTimeout(node.__hkbScrollTimer);
  node.__hkbScrollTimer = setTimeout(() => node.classList.remove("is-scrolling"), 700);
}

async function updateExistingKeyBinding(mode) {
  const result = await bindChannelToKey(selectedKeyID, currentChannelID(), mode);
  if (mode === "append" && result.alreadyBound) {
    setStatus("已绑定");
    return;
  }
  setStatus(mode === "replace" ? "已替换" : "已追加");
}

async function createKeyAndBind() {
  const name = getValue("new-key-name").trim();
  if (!name) throw new Error("请先填写新 Key 名称");
  const key = await createKey(name);
  await bindChannelToKey(key.id, currentChannelID(), "replace");
  await loadKeys(true);
  setCreatedKeyValue(apiKeyValue(key));
  setStatus("已新建并绑定");
}

async function bindChannelToKey(keyID, channelID, mode = "replace") {
  if (!keyID) throw new Error("请选择 API Key");
  if (!channelID) throw new Error("请选择渠道");
  setStatus("读取中");
  const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
  const numericChannelID = extractNumericChannelID(channelID);
  if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
  if (!numericChannelID) throw new Error(`渠道 ID 无效：${channelID}`);
  const enabledKey = await ensureKeyEnabledForBinding(keyID, data.node.status);
  setStatus("保存中");
  const input = buildProfilesInput(data.node.profiles, numericChannelID, mode);
  await graphql(queries.updateProfiles, { id: keyID, input }, "UpdateAPIKeyProfiles");
  return { alreadyBound: mode === "append" && getActiveProfile(data.node.profiles).channelIDs?.includes(numericChannelID), enabledKey };
}

async function ensureKeyEnabledForBinding(keyID, status) {
  if (status !== "disabled") return false;
  setStatus("启用中");
  await graphql(queries.updateKeyStatus, { id: keyID, status: "enabled" }, "UpdateAPIKeyStatus");
  updateCachedKeyStatus(keyID, "enabled");
  return true;
}

function updateCachedKeyStatus(keyID, status) {
  const key = keysCache.find((entry) => entry.id === keyID);
  if (!key) return;
  key.status = status;
  renderKeyOptions();
}

function setCurrentChannel(channel, options = {}) {
  const dialog = document.getElementById(DIALOG_ID);
  if (!dialog) return;
  dialog.dataset.channelId = channel.id || "";
  dialog.dataset.channelName = channel.name || "";
  const label = document.querySelector(`#${DIALOG_ID} [data-role="channel-label"]`);
  if (label) label.textContent = channel.name || (options.allowEmpty ? "未指定" : "未读取到当前渠道");
  setStatus(channel.id || options.allowEmpty ? "" : "未读取到渠道 ID");
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
  setEditKeyName(data.node.name || "");
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
  setEditKeyName("");
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
  await renameKeyIfChanged(selectedKeyID, data.node.name);
  await ensureKeyEnabledForBinding(selectedKeyID, data.node.status);
  const input = buildProfilesInputWithChannelIDs(data.node.profiles, editChannelIDs);
  await graphql(queries.updateProfiles, { id: selectedKeyID, input }, "UpdateAPIKeyProfiles");
  await loadKeys(true);
  setEditDirty(false);
  setEditStatus("已保存");
}

// 名称与打开面板时不同才提交改名，避免无谓的 UpdateAPIKey 请求。
// nextName 供测试直传，运行时从面板输入框读取。
async function renameKeyIfChanged(keyID, serverName, nextName) {
  const input = document.querySelector(`#${DIALOG_ID} [data-role="edit-key-name"]`);
  const rawName = arguments.length > 2 ? nextName : input?.value;
  const trimmed = String(rawName ?? "").trim();
  if (!trimmed) throw new Error("名称不能为空");
  if (trimmed === String(serverName ?? editKeyNameBaseline)) return false;
  await graphql(queries.updateKey, { id: keyID, input: { name: trimmed } }, "UpdateAPIKey");
  editKeyNameBaseline = trimmed;
  return true;
}

// 旧密钥归档名：Key 本身的数字 id（如 #71966），确定存在且不需要拉取明文。
function keyArchiveName(keyID) {
  const text = String(keyID || "");
  const match = /^gid:\/\/axonhub\/APIKey\/(\d+)$/.exec(text) || /^(\d+)$/.exec(text);
  return match ? `#${match[1]}` : "";
}

// 轮换密钥：旧 Key 改名为其数字 id（如 #71966）并归档，用当前名称创建新 Key 并完整复制 profiles 配置（含 dynamic 绑定、模型映射、配额与路由策略）。
// 完成后选中并缓存新 Key 明文，复制按钮即可复制新密钥。
async function rotateKey(keyID, options = {}) {
  if (!keyID) throw new Error("请选择 API Key");
  const current = keysCache.find((key) => key.id === keyID);
  if (!current) throw new Error("未找到该 API Key");
  if (current.status === "archived") throw new Error("已归档 Key 不支持更新");
  const nextName = String(options.name ?? editKeyValueInput() ?? "").trim() || keyLabel(current);
  const archivedName = keyArchiveName(keyID) || keyLabel(current);
  const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
  if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
  await graphql(queries.updateKey, { id: keyID, input: { name: archivedName } }, "UpdateAPIKey");
  await graphql(queries.updateKeyStatus, { id: keyID, status: "archived" }, "UpdateAPIKeyStatus");
  const created = await createKey(nextName);
  const input = buildProfilesInputCopy(data.node.profiles);
  await graphql(queries.updateProfiles, { id: created.id, input }, "UpdateAPIKeyProfiles");
  await loadKeys(true);
  selectedKeyID = created.id;
  setCreatedKeyValue(apiKeyValue(created));
  syncKeyPicker();
  return created;
}

// 编辑面板名称输入框的当前值（主面板视图返回空串）。
function editKeyValueInput() {
  if (currentViewPanel() !== "edit") return "";
  const input = document.querySelector(`#${DIALOG_ID} [data-role="edit-key-name"]`);
  return input?.value || "";
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
  setStatus("已复制新密钥");
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
  const value = data?.node?.key || "";
  if (!value) throw new Error("读取密钥值失败");
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

  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style");
    style.id = `${PANEL_ID}-style`;
    style.textContent = `.${REQUEST_TRIGGER_CLASS}{margin-left:4px}
      .${CHANNEL_TRIGGER_CLASS}{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:28px;min-height:28px;border:1px solid color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 24%,var(--border,hsl(20 5.9% 90%)));border-radius:8px;background:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 7%,transparent);color:var(--primary,hsl(20 14.3% 4.1%));padding:0 10px;font:inherit;font-size:12px;font-weight:600;line-height:18px;white-space:nowrap;cursor:pointer;box-shadow:none;transition:color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      .${CHANNEL_TRIGGER_CLASS}:hover{border-color:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 42%,var(--border,hsl(20 5.9% 90%)));background:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 13%,transparent)}
      .${CHANNEL_TRIGGER_CLASS}:focus-visible{outline:none;border-color:var(--ring,var(--primary,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 22%,transparent)}
      .${CHANNEL_TRIGGER_CLASS} svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
      html.dark .${CHANNEL_TRIGGER_CLASS}{border-color:color-mix(in oklab,var(--primary) 34%,var(--border));background:color-mix(in oklab,var(--primary) 12%,transparent);color:color-mix(in oklab,var(--primary) 82%,white)}
      html.dark .${CHANNEL_TRIGGER_CLASS}:hover{border-color:color-mix(in oklab,var(--primary) 52%,var(--border));background:color-mix(in oklab,var(--primary) 20%,transparent)}
      #${PRICE_FIELD_ID}{box-sizing:border-box;min-width:0;order:2147483647}
      #${MODEL_ID_FIELD_ID}{box-sizing:border-box;min-width:0;order:2147483646}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-wrap{position:relative;width:fit-content;max-width:260px;min-width:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;width:fit-content;max-width:100%;height:36px;min-height:36px;border:1px solid var(--input,var(--border,hsl(20 5.9% 90%)));border-radius:12px;background:transparent;color:var(--foreground,hsl(20 14.3% 4.1%));padding:8px 12px;font:inherit;font-size:14px;font-weight:400;line-height:20px;white-space:nowrap;cursor:pointer;outline:none;box-shadow:0 1px 3px 0 rgb(176 93 46 / .04);transition:border-color .15s ease,box-shadow .15s ease,background-color .15s ease}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:hover{border-color:color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 40%,var(--input,var(--border,hsl(20 5.9% 90%))))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:focus-visible,#${MODEL_ID_FIELD_ID} .hkb-model-id-trigger[aria-expanded="true"]{border-color:var(--ring,var(--primary,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 18%,transparent)}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger svg{width:16px;height:16px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.5;pointer-events:none;transition:transform .15s ease}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger[aria-expanded="true"] svg{transform:rotate(180deg)}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-menu{position:absolute;left:0;top:calc(100% + 6px);z-index:60;width:max-content;min-width:100%;max-width:min(340px,90vw);max-height:264px;overflow:auto;margin:0;padding:6px;list-style:none;background:var(--popover,var(--card,#fff));border:1px solid var(--border,rgba(229,231,235,.9));border-radius:12px;box-shadow:0 18px 48px -24px rgb(15 23 42 / .55),0 8px 20px -18px rgb(15 23 42 / .45);color:var(--popover-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-menu[hidden]{display:none}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option{display:flex;align-items:center;gap:8px;width:100%;min-height:34px;border:none;border-radius:8px;background:transparent;color:inherit;text-align:left;padding:8px 10px;font:inherit;font-size:14px;font-weight:500;line-height:20px;cursor:pointer}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700;flex-shrink:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option:not([aria-selected="true"])::before{content:"";width:12px;flex-shrink:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger{border-color:var(--input,var(--border));color:var(--foreground,#e4e4e4)}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:hover{background:color-mix(in oklab,var(--input,rgb(255 255 255/.09)) 50%,transparent)}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-menu{background:var(--popover,var(--card,#1c1c1c));border-color:var(--border,rgb(255 255 255/.09));color:var(--popover-foreground,var(--foreground,#e4e4e4))}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-option:hover,html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]{background:var(--accent,rgb(255 255 255/.08));color:var(--accent-foreground,var(--foreground,#e4e4e4))}
      #${PRICE_FIELD_ID} .hkb-filter-buttons{display:flex;align-items:center;flex-wrap:wrap;gap:6px;min-height:32px}
      #${PRICE_FIELD_ID} [data-role$="-filter"]{--hkb-filter-accent:var(--primary,hsl(20 14.3% 4.1%));box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:7px;width:fit-content;max-width:100%;height:32px;min-height:32px;border:1px solid var(--border,hsl(20 5.9% 90%));border-radius:999px;background:color-mix(in oklab,var(--background,#fff) 92%,transparent);color:var(--muted-foreground,hsl(25 5.3% 44.7%));padding:5px 12px;font:inherit;font-size:13px;font-weight:550;line-height:20px;white-space:nowrap;cursor:pointer;box-shadow:0 1px 1px rgb(0 0 0 / .025);pointer-events:auto;transition:transform .15s ease,color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role$="-filter"]::before{content:"";width:6px;height:6px;border-radius:999px;background:currentColor;opacity:.35;box-shadow:0 0 0 2px color-mix(in oklab,currentColor 10%,transparent);transition:opacity .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{--hkb-filter-accent:#16a34a}
      #${PRICE_FIELD_ID} [data-role="official-filter"]{--hkb-filter-accent:#0284c7}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:hover{transform:translateY(-1px);border-color:color-mix(in oklab,var(--hkb-filter-accent) 30%,var(--border,hsl(20 5.9% 90%)));background:color-mix(in oklab,var(--hkb-filter-accent) 6%,var(--background,#fff));color:color-mix(in oklab,var(--hkb-filter-accent) 80%,var(--foreground,hsl(20 14.3% 4.1%)));box-shadow:0 3px 8px -5px color-mix(in oklab,var(--hkb-filter-accent) 55%,transparent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:active{transform:translateY(0)}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:focus-visible{outline:none;border-color:var(--hkb-filter-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--hkb-filter-accent) 22%,transparent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]{border-color:color-mix(in oklab,var(--hkb-filter-accent) 45%,var(--border));background:color-mix(in oklab,var(--hkb-filter-accent) 12%,var(--background,#fff));color:var(--hkb-filter-accent);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--hkb-filter-accent) 8%,transparent),0 3px 10px -7px var(--hkb-filter-accent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]::before{opacity:1;box-shadow:0 0 0 3px color-mix(in oklab,var(--hkb-filter-accent) 16%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"]{background:color-mix(in oklab,var(--background) 78%,transparent);box-shadow:none}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"]:hover{background:color-mix(in oklab,var(--hkb-filter-accent) 12%,var(--background))}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]{border-color:color-mix(in oklab,var(--hkb-filter-accent) 58%,var(--border));background:color-mix(in oklab,var(--hkb-filter-accent) 18%,var(--background));color:color-mix(in oklab,var(--hkb-filter-accent) 82%,white)}
      @media (min-width:1280px){.hkb-marketplace-filter-grid{grid-template-columns:repeat(6,minmax(0,auto))!important}}
      [data-hub-tool-price-hidden="true"]{display:none!important}
      th.${REQUEST_LOG_CHANNEL_COLUMN_CLASS},td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}{box-sizing:border-box;width:160px;max-width:160px}
      td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS},td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}>*{min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      td.${MULTIPLIER_COLUMN_CLASS}{box-sizing:border-box;padding-left:6px;padding-right:6px;text-align:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--primary,hsl(20 14.3% 4.1%));white-space:nowrap}
      td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_LOW_TONE_CLASS}{color:var(--success,#16845d)}
      td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_HIGH_TONE_CLASS}{color:var(--destructive,#dc2626)}
      .${MULTIPLIER_COLUMN_HEADER_CLASS}{box-sizing:border-box;padding-left:6px;padding-right:6px;text-align:center;color:var(--muted-foreground,hsl(25 5.3% 44.7%));white-space:nowrap}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}{color:var(--primary,#e4e4e4)}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_LOW_TONE_CLASS}{color:#3fa266}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_HIGH_TONE_CLASS}{color:#fc6b83}
      html.dark .${MULTIPLIER_COLUMN_HEADER_CLASS}{color:var(--muted-foreground,oklch(0.7713 0.0169 99.0657))}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgb(0 0 0 / .48);padding:16px;color:var(--foreground,#111827);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(480px,100%);height:392px;box-sizing:border-box;background:var(--card,#fff);border:1px solid var(--border,rgba(229,231,235,.9));color:var(--card-foreground,var(--foreground,#111827));border-radius:14px;padding:24px;box-shadow:0 24px 60px -24px rgb(15 23 42 / .55),0 10px 24px -20px rgb(15 23 42 / .35)}
      #${DIALOG_ID} .hkb-switch{display:flex;gap:0;margin-bottom:22px}
      #${DIALOG_ID} .hkb-mode{min-height:auto;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--muted-foreground,#9ca3af);font-size:15px;font-weight:650;padding:0 16px 10px;cursor:pointer;transition:color .15s,border-color .15s}#${DIALOG_ID} .hkb-mode:hover{color:var(--foreground,#4b5563)}#${DIALOG_ID} .hkb-mode[aria-selected="true"]{color:var(--foreground,#111827);border-bottom-color:var(--primary,var(--foreground,#111827))}
      #${DIALOG_ID} [data-view-panel]{height:100%;display:grid;grid-template-rows:auto 1fr auto}
      #${DIALOG_ID} [data-view-panel][hidden]{display:none}
      #${DIALOG_ID} .hkb-grid{display:grid;gap:16px;min-height:0;align-content:start}
      #${DIALOG_ID} .hkb-edit-body{display:grid;grid-template-rows:auto auto auto minmax(0,1fr);gap:14px;min-height:0;padding-top:4px}
      #${DIALOG_ID} .hkb-edit-row{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:12px;min-height:0}
      #${DIALOG_ID} .hkb-edit-row .hkb-label{align-self:center}
      #${DIALOG_ID} .hkb-edit-key-picker{display:flex;align-items:center;gap:8px}
      #${DIALOG_ID} .hkb-edit-key-picker .hkb-control{flex:1;min-width:0}
      #${DIALOG_ID} .hkb-key-caret{width:36px;min-width:36px;height:36px;min-height:36px;border-radius:10px;border:1px solid var(--border,#e5e7eb);background:color-mix(in oklab,var(--input,#e5e7eb) 18%,transparent)}
      #${DIALOG_ID} .hkb-key-caret[aria-expanded="true"]{border-color:var(--ring,#9ca3af)}
      #${DIALOG_ID} .hkb-key-caret svg{width:16px;height:16px;transition:transform .15s}
      #${DIALOG_ID} .hkb-key-caret[aria-expanded="true"] svg{transform:rotate(180deg)}
      #${DIALOG_ID} .hkb-edit-row-list{align-items:start}
      #${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:10px}
      #${DIALOG_ID} [data-key-panel]{min-height:70px}
      #${DIALOG_ID} .hkb-field{display:grid;gap:6px}
      #${DIALOG_ID} .hkb-label{font-size:13px;font-weight:650;color:var(--foreground,#374151)}
      #${DIALOG_ID} .hkb-control{width:100%;min-height:36px;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 18%,transparent);color:var(--foreground,#111827);font:inherit;font-size:14px;line-height:20px;padding:9px 12px;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
      #${DIALOG_ID} .hkb-control:focus,#${DIALOG_ID} .hkb-control[aria-expanded="true"]{background:var(--popover,var(--card,#fff));border-color:var(--ring,#9ca3af);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#111827) 18%,transparent)}
      #${DIALOG_ID} .hkb-channel-tag{display:flex;align-items:center;min-height:36px}
      #${DIALOG_ID} input[type="text"]{height:36px}
      #${DIALOG_ID} .hkb-copy-new{border-color:var(--border,#d1d5db);background:var(--card,#fff);color:var(--foreground,#374151);white-space:nowrap}#${DIALOG_ID} .hkb-copy-new:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#374151))}
      #${DIALOG_ID} .hkb-select-row{display:flex;align-items:center;gap:8px}#${DIALOG_ID} .hkb-key-picker{position:relative;flex:1;min-width:0}#${DIALOG_ID} .hkb-key-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;cursor:pointer}#${DIALOG_ID} .hkb-key-trigger span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-key-trigger::after{content:"";width:8px;height:8px;border-right:1.5px solid var(--muted-foreground,#6b7280);border-bottom:1.5px solid var(--muted-foreground,#6b7280);transform:rotate(45deg) translateY(-2px);flex-shrink:0;transition:transform .15s}#${DIALOG_ID} .hkb-key-trigger[aria-expanded="true"]::after{transform:rotate(225deg) translateY(-1px)}
      #${DIALOG_ID} .hkb-key-menu{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:1;max-height:272px;overflow:auto;margin:0;padding:6px;list-style:none;background:var(--popover,var(--card,#fff));border:1px solid var(--border,#e5e7eb);border-radius:12px;box-shadow:0 18px 48px -24px rgb(15 23 42 / .55),0 8px 20px -18px rgb(15 23 42 / .45)}#${DIALOG_ID} .hkb-key-menu[hidden]{display:none}
      #${DIALOG_ID} .hkb-key-option-row{display:flex;align-items:center;gap:2px;min-height:34px;border-radius:8px;padding-right:4px}#${DIALOG_ID} .hkb-key-option-row[aria-selected="true"]{background:var(--accent,#f3f4f6)}#${DIALOG_ID} .hkb-key-option{flex:1;min-width:0;min-height:34px;display:flex;align-items:center;gap:8px;border:none;border-radius:8px;background:transparent;color:var(--popover-foreground,var(--foreground,#111827));text-align:left;padding:6px 10px;font-size:14px;font-weight:500}#${DIALOG_ID} .hkb-key-option:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-key-option-row[aria-selected="true"] .hkb-key-option::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700}#${DIALOG_ID} .hkb-key-option-row:not([aria-selected="true"]) .hkb-key-option::before{content:"";width:12px;flex-shrink:0}#${DIALOG_ID} .hkb-key-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-key-act{height:24px;width:24px;min-height:24px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s}#${DIALOG_ID} .hkb-key-act:hover{color:var(--accent-foreground,var(--foreground,#0f172a));background:var(--accent,#f1f5f9)}#${DIALOG_ID} .hkb-key-act:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-key-act svg{width:13px;height:13px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;pointer-events:none}#${DIALOG_ID} .hkb-key-act[data-action="archive-key"]:hover{color:var(--destructive,#dc2626);background:color-mix(in oklab,var(--destructive,#dc2626) 8%,transparent)}#${DIALOG_ID} .hkb-key-status{flex-shrink:0;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:650;line-height:16px;white-space:nowrap}#${DIALOG_ID} .hkb-key-status[data-status="disabled"]{border:1px solid color-mix(in oklab,var(--destructive,#dc2626) 35%,transparent);background:color-mix(in oklab,var(--destructive,#dc2626) 10%,transparent);color:var(--destructive,#dc2626)}#${DIALOG_ID} .hkb-key-status[data-status="archived"]{border:1px solid var(--border,#e5e7eb);background:var(--secondary,#f3f4f6);color:var(--muted-foreground,#6b7280)}html.dark #${DIALOG_ID} .hkb-key-status[data-status="disabled"]{border-color:color-mix(in oklab,var(--destructive,#fc6b83) 45%,transparent);background:color-mix(in oklab,var(--destructive,#fc6b83) 14%,transparent);color:var(--destructive,#fc6b83)}html.dark #${DIALOG_ID} .hkb-key-status[data-status="archived"]{border-color:var(--border,rgb(255 255 255/.09));background:color-mix(in oklab,white 8%,transparent);color:var(--muted-foreground,#9ca3af)}
      #${DIALOG_ID} .hkb-key-toggle{box-sizing:border-box;height:16px;min-height:16px;width:28px;border:1px solid transparent;border-radius:999px;background:color-mix(in oklab,var(--muted-foreground,#6b7280) 38%,transparent);padding:0;cursor:pointer;display:inline-flex;align-items:center;flex-shrink:0;margin-right:5.5px;overflow:hidden;transition:background-color .15s ease,border-color .15s ease,box-shadow .15s ease}#${DIALOG_ID} .hkb-key-toggle .hkb-key-toggle-track{display:block;width:100%;height:100%;position:relative}#${DIALOG_ID} .hkb-key-toggle .hkb-key-toggle-thumb{position:absolute;top:1.5px;left:1.5px;width:11px;height:11px;border-radius:999px;background:#fff;box-shadow:0 1px 2px rgb(15 23 42 / .35);transition:left .15s ease,background-color .15s ease}#${DIALOG_ID} .hkb-key-toggle[aria-checked="true"]{background:var(--primary,var(--foreground,#111827))}#${DIALOG_ID} .hkb-key-toggle[aria-checked="true"] .hkb-key-toggle-thumb{left:calc(100% - 12.5px)}#${DIALOG_ID} .hkb-key-toggle:hover{border-color:color-mix(in oklab,var(--primary,var(--foreground,#111827)) 35%,transparent)}#${DIALOG_ID} .hkb-key-toggle:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-key-toggle:disabled{cursor:not-allowed;opacity:.5}html.dark #${DIALOG_ID} .hkb-key-toggle{background:color-mix(in oklab,white 28%,transparent)}html.dark #${DIALOG_ID} .hkb-key-toggle .hkb-key-toggle-thumb{background:#e4e4e4}html.dark #${DIALOG_ID} .hkb-key-toggle[aria-checked="true"]{background:var(--primary,#e4e4e4)}html.dark #${DIALOG_ID} .hkb-key-toggle[aria-checked="true"] .hkb-key-toggle-thumb{background:#111827}
      #${DIALOG_ID} .hkb-icon-btn{height:28px;width:28px;min-height:28px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s,box-shadow .15s}#${DIALOG_ID} .hkb-icon-btn:hover{color:var(--accent-foreground,var(--foreground,#0f172a));background:var(--accent,#f1f5f9)}#${DIALOG_ID} .hkb-icon-btn:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-icon-btn svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;pointer-events:none}
      #${DIALOG_ID} .hkb-edit-title{display:flex;align-items:center;gap:6px;margin:-8px 0 4px -8px;font-size:15px;font-weight:650;color:var(--foreground,#111827)}
      #${DIALOG_ID} .hkb-back{height:28px;width:28px;min-height:28px}
      #${DIALOG_ID} .hkb-edit-list{height:100%;min-height:92px;overflow:auto;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 14%,transparent);padding:4px;scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .15s;touch-action:pan-y;user-select:none}#${DIALOG_ID} .hkb-edit-list:hover,#${DIALOG_ID} .hkb-edit-list:focus-within,#${DIALOG_ID} .hkb-edit-list.is-scrolling{scrollbar-color:var(--border,#cbd5e1) transparent}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar{width:6px}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar-thumb{background:transparent;border-radius:999px}#${DIALOG_ID} .hkb-edit-list:hover::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list:focus-within::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list.is-scrolling::-webkit-scrollbar-thumb{background:var(--border,#cbd5e1)}
      #${DIALOG_ID} .hkb-channel-list-stage{position:relative;min-height:36px}#${DIALOG_ID} .hkb-channel-slot{position:absolute;left:0;right:0;transition:top .12s ease}#${DIALOG_ID} .hkb-channel-placeholder{position:absolute;left:0;right:0;border:1px dashed var(--primary,var(--foreground,#111827));border-radius:8px;background:color-mix(in oklab,var(--primary,var(--foreground,#111827)) 8%,transparent)}#${DIALOG_ID} .hkb-channel-row{height:36px;box-sizing:border-box;display:flex;align-items:center;gap:6px;padding:4px 6px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--foreground,#111827);font-size:13px}#${DIALOG_ID} .hkb-channel-row:hover{background:var(--accent,#fff);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-channel-row.is-dragging{border-color:var(--primary,var(--foreground,#111827));background:var(--card,#fff);box-shadow:0 8px 18px -14px rgb(15 23 42 / .65);pointer-events:none}#${DIALOG_ID} .hkb-drag-handle{width:22px;height:26px;min-height:26px;border:0;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:grab;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font:inherit;line-height:1;letter-spacing:1px;touch-action:none}#${DIALOG_ID} .hkb-drag-handle:active{cursor:grabbing}#${DIALOG_ID} .hkb-channel-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-channel-actions{display:flex;align-items:center;gap:2px;flex-shrink:0}#${DIALOG_ID} .hkb-row-btn{width:26px;height:26px;min-height:26px;border-color:transparent}#${DIALOG_ID} .hkb-row-btn svg{width:14px;height:14px}#${DIALOG_ID} .hkb-remove{color:var(--muted-foreground,#6b7280)}#${DIALOG_ID} .hkb-remove:hover{color:var(--destructive,#dc2626)}
      #${DIALOG_ID} .hkb-empty{padding:14px 10px;color:var(--muted-foreground,#9ca3af);font-size:13px}
      #${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:0;padding-top:16px;border-top:1px solid var(--border,#f3f4f6)}
      #${DIALOG_ID} .hkb-edit-actions{border-top:none;padding-top:18px}
      #${DIALOG_ID} [data-action="save-edit"]{position:relative}
      #${DIALOG_ID} [data-action="save-edit"][data-dirty="true"]::after{content:"";position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:999px;background:var(--primary,#111827);box-shadow:0 0 0 2px var(--card,#fff)}
      #${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{display:flex;align-items:center;gap:8px}
      #${DIALOG_ID} .hkb-status{color:var(--muted-foreground,#6b7280);font-size:12px;line-height:16px;flex:1;min-width:0;text-align:center}
      #${DIALOG_ID} button:not(.hkb-icon-btn):not(.hkb-key-toggle):not(.hkb-key-act){box-sizing:border-box;height:32px;min-height:32px;line-height:18px;border-radius:8px;border:1px solid transparent;padding:0 14px;font:inherit;font-size:13.5px;font-weight:500;cursor:pointer;transition:background .15s,opacity .15s}#${DIALOG_ID} button:disabled{cursor:not-allowed;opacity:.5}#${DIALOG_ID} .hkb-key-option:disabled{cursor:default;opacity:1}
      #${DIALOG_ID} .hkb-primary{border-color:var(--primary,#111827);background:var(--primary,#111827);color:var(--primary-foreground,#f9fafb)}#${DIALOG_ID} .hkb-primary:hover{background:color-mix(in oklab,var(--primary,#111827) 88%,white)}#${DIALOG_ID} .hkb-secondary{border-color:var(--border,#d1d5db);background:var(--secondary,#f3f4f6);color:var(--secondary-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-secondary:hover{background:var(--accent,#e5e7eb);color:var(--accent-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-ghost{border-color:transparent;background:transparent;color:var(--muted-foreground,#374151)}#${DIALOG_ID} .hkb-ghost:hover{background:var(--accent,#f9fafb);color:var(--accent-foreground,var(--foreground,#374151))}
      @media (max-width:360px){#${DIALOG_ID}{padding:8px}#${DIALOG_ID} .hkb-card{height:min(388px,calc(100vh - 16px));padding:16px}#${DIALOG_ID} .hkb-edit-row{grid-template-columns:1fr;gap:6px}#${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:0}#${DIALOG_ID} .hkb-actions{flex-wrap:wrap;align-items:flex-start}#${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{flex-wrap:wrap}#${DIALOG_ID} .hkb-status{flex-basis:100%;order:3}}
      html.dark #${DIALOG_ID}{background:rgb(0 0 0 / .56);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-card{box-shadow:0 24px 64px -24px rgb(0 0 0 / .85),0 12px 28px -20px rgb(0 0 0 / .75)}
      html.dark #${DIALOG_ID} .hkb-control{background:color-mix(in oklab,var(--input) 30%,transparent);border-color:var(--border);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-control::placeholder{color:var(--muted-foreground)}
      html.dark #${DIALOG_ID} .hkb-control:focus,html.dark #${DIALOG_ID} .hkb-control[aria-expanded="true"]{box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent)}
      html.dark #${DIALOG_ID} .hkb-key-menu{box-shadow:0 18px 48px -24px rgb(0 0 0 / .85),0 8px 20px -18px rgb(0 0 0 / .8)}
      html.dark #${DIALOG_ID} .hkb-edit-list{background:color-mix(in oklab,var(--input) 22%,transparent)}`;
    (document.head || document.documentElement).appendChild(style);
  }

  async function handlePanelClick(event) {
    const actionEl = event.target?.closest?.("[data-action]");
    const action = actionEl?.dataset?.action;
    if (!action && !event.target?.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    if (!action) return;
    if (action === "set-key-mode") {
      setKeyMode(actionEl.dataset.mode || "update");
      return;
    }
    if (action === "toggle-key-menu") {
      toggleKeyMenu();
      return;
    }
    if (action === "select-key") {
      selectKey(actionEl.dataset.keyId || "");
      closeKeyMenu();
      if (currentViewPanel() === "edit") {
        openEditPanel().catch((error) => setEditStatus(error?.message || "加载失败"));
      }
      return;
    }
    if (action === "toggle-key-status") {
      try {
        setBusy(true);
        await toggleKeyStatus(actionEl.dataset.keyId || "");
      } catch (error) {
        setStatus(error?.message || "状态更新失败");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (action === "rotate-key") {
      try {
        setBusy(true);
        await rotateKey(actionEl.dataset.keyId || "");
        setStatus("已更新密钥");
      } catch (error) {
        setStatus(error?.message || "更新密钥失败");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (action === "archive-key") {
      try {
        setBusy(true);
        await archiveKey(actionEl.dataset.keyId || "");
        setStatus("已归档");
      } catch (error) {
        setStatus(error?.message || "归档失败");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (action === "open-edit") {
      openEditPanel().catch((error) => setEditStatus(error?.message || "加载失败"));
      return;
    }
    if (action === "close-edit") {
      showMainPanel();
      return;
    }
    if (action === "edit-add-current") {
      addCurrentChannelToEditList();
      return;
    }
    if (action === "edit-remove-channel") {
      removeEditChannel(actionEl.dataset.channelId || "");
      return;
    }
    if (action === "edit-drag-channel") return;
    if (!actionEl.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    try {
      setBusy(true);
      if (action === "reload-keys") await loadKeys(true);
      else if (action === "append-bind") await updateExistingKeyBinding("append");
      else if (action === "replace-bind") await updateExistingKeyBinding("replace");
      else if (action === "save-edit") await saveEditBindings();
      else if (action === "create-bind") await createKeyAndBind();
      else if (action === "copy-created-key") await copyCreatedKey();
      else if (action === "copy-key") await copySelectedKey();
    } catch (error) {
      setStatus(error?.message || "操作失败");
    } finally {
      setBusy(false);
    }
  }

  function openDialog() {
    ensureDialog();
    document.getElementById(DIALOG_ID).hidden = false;
    const channel = { id: this?.dataset?.channelId || "", name: this?.dataset?.channelName || "" };
    setCurrentChannel(channel);
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys().catch((error) => setStatus(error?.message || "加载失败"));
  }

  function openRequestEditDialog() {
    ensureDialog();
    document.getElementById(DIALOG_ID).hidden = false;
    setCurrentChannel({ id: "", name: "" }, { allowEmpty: true });
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys()
      .then(() => openEditPanel())
      .catch((error) => setStatus(error?.message || "加载失败"));
  }

  function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID);
    if (dialog) dialog.hidden = true;
  }

  function ensureDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID;
    dialog.hidden = true;
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true" aria-label="API 密钥渠道管理">
      <div class="hkb-main" data-view-panel="main">
        <div class="hkb-switch" role="tablist" aria-label="密钥操作">
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="update" aria-selected="true">绑定渠道</button>
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="create" aria-selected="false">新建密钥</button>
        </div>
        <div class="hkb-grid">
          <div class="hkb-field"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="channel-label"></div></div>
          <div data-key-panel="update" role="tabpanel">
            <div class="hkb-field"><span class="hkb-label">API Key</span><div class="hkb-select-row"><div class="hkb-key-picker" data-role="key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="key-menu" role="listbox" hidden></ul></div><button type="button" class="hkb-icon-btn" data-action="copy-key" title="复制密钥" aria-label="复制密钥"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="reload-keys" title="刷新" aria-label="刷新"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M16 8h5V3"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="open-edit" title="编辑绑定渠道" aria-label="编辑绑定渠道"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button></div></div>
          </div>
          <div data-key-panel="create" role="tabpanel" hidden>
            <div class="hkb-field"><label class="hkb-label" for="hkb-new-key-name">Key 名称</label><input id="hkb-new-key-name" name="hkb-new-key-name" class="hkb-control" data-role="new-key-name" type="text" placeholder="输入 Key 名称" autocomplete="off"></div>
          </div>
        </div>
        <div class="hkb-actions"><div class="hkb-action-left"><button type="button" class="hkb-primary" data-action="append-bind" data-action-panel="update">追加绑定</button><button type="button" class="hkb-secondary" data-action="replace-bind" data-action-panel="update">替换绑定</button><button type="button" class="hkb-primary" data-action="create-bind" data-action-panel="create" hidden>新建并绑定</button><button type="button" class="hkb-secondary hkb-copy-new" data-action="copy-created-key" data-action-panel="create" data-role="copy-created-key" hidden>复制新密钥</button></div><div class="hkb-status" data-role="status" role="status" aria-live="polite"></div><div class="hkb-action-right"><button type="button" class="hkb-ghost" data-action="close">关闭</button></div></div>
      </div>
      <div class="hkb-main" data-view-panel="edit" hidden>
        <div class="hkb-edit-title"><button type="button" class="hkb-icon-btn hkb-back" data-action="close-edit" title="返回" aria-label="返回"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><span>编辑绑定渠道</span></div>
        <div class="hkb-edit-body">
          <div class="hkb-edit-row"><label class="hkb-label" for="hkb-edit-key-name">API Key</label><div class="hkb-key-picker hkb-edit-key-picker" data-role="edit-key-picker"><input id="hkb-edit-key-name" name="hkb-edit-key-name" class="hkb-control" data-role="edit-key-name" type="text" autocomplete="off" placeholder="名称可直接修改"><button type="button" class="hkb-icon-btn hkb-key-caret" data-action="toggle-key-menu" data-role="edit-key-trigger" aria-haspopup="listbox" aria-expanded="false" title="切换 API Key" aria-label="切换 API Key"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button><ul class="hkb-key-menu" data-role="edit-key-menu" role="listbox" hidden></ul></div></div>
          <div class="hkb-edit-row"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="edit-channel-label"></div></div>
          <div class="hkb-edit-row hkb-edit-row-list"><span class="hkb-label">绑定渠道</span><div class="hkb-edit-list" data-role="edit-channel-list" tabindex="0"></div></div>
        </div>
        <div class="hkb-actions hkb-edit-actions"><div class="hkb-action-left"><button type="button" class="hkb-secondary" data-action="edit-add-current">添加</button></div><div class="hkb-status" data-role="edit-status" role="status" aria-live="polite"></div><div class="hkb-action-right"><button type="button" class="hkb-primary" data-action="save-edit">保存</button><button type="button" class="hkb-ghost" data-action="close-edit">取消</button></div></div>
      </div>
    </div>`;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target?.dataset?.action === "close") closeDialog();
      else handlePanelClick(event);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeKeyMenu();
    });
    dialog.addEventListener("input", (event) => {
      if (event.target?.dataset?.role === "new-key-name") {
        setCreatedKeyValue("");
        setStatus("");
      }
      if (event.target?.dataset?.role === "edit-key-name") {
        setEditDirty(true);
        setEditStatus("");
      }
    });
    dialog.addEventListener("pointerdown", handleEditChannelDragStart);
    dialog.addEventListener("pointermove", handleEditChannelDragMove);
    dialog.addEventListener("pointerup", handleEditChannelDragEnd);
    dialog.addEventListener("pointercancel", cancelEditChannelDrag);
    dialog.addEventListener("scroll", (event) => {
      if (event.target?.dataset?.role === "edit-channel-list") markScrolling(event.target);
    }, true);
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
    dialog.querySelectorAll("[data-key-panel]").forEach((el) => {
      el.hidden = el.dataset.keyPanel !== selectedMode;
    });
    closeKeyMenu();
    syncActionButtons();
    setStatus("");
  }

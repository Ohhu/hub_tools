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
    setEditStatus("渠道 ID 无效");
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

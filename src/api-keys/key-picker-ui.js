function renderKeyOptions() {
  if (!keysCache.some((key) => key.id === selectedKeyID)) selectedKeyID = keysCache[0]?.id || "";
  document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
    menu.innerHTML = keysCache.length
      ? keysCache.map((key) => `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}" role="option" aria-selected="${String(key.id === selectedKeyID)}"><span>${escapeHtml(keyLabel(key))}</span></button></li>`).join("")
      : `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="" role="option" disabled>暂无 API Key</button></li>`;
  });
  syncKeyPicker();
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

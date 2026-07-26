function findApiKeyActionButtons() {
  return Array.from(document.querySelectorAll("main button")).filter(isApiKeyActionButton);
}

function findChannelActionButtons() {
  return Array.from(document.querySelectorAll("main button")).filter((button) =>
    isApiKeyActionButton(button) || isTriggerButton(button),
  );
}

function isApiKeyActionButton(node) {
  return !isTriggerButton(node) && isApiKeyActionButtonText(node.textContent || "");
}

function isApiKeyActionButtonText(text) {
  const normalizedText = cleanText(text);
  return API_KEY_CREATE_ACTION_RE.test(normalizedText) || API_KEY_EXISTING_ACTION_RE.test(normalizedText);
}

function isExistingApiKeyActionButtonText(text) {
  return API_KEY_EXISTING_ACTION_RE.test(cleanText(text));
}

function isTriggerButton(node) {
  return Boolean(node?.classList?.contains(TRIGGER_CLASS));
}

function selectPreferredApiKeyActionButton(buttons) {
  return buttons.find((button) => isExistingApiKeyActionButtonText(button.textContent || "")) || buttons[0] || null;
}

function replaceApiKeyActionButtons() {
  const buttonsByContext = new Map();
  for (const button of findApiKeyActionButtons()) {
    const context = findChannelContext(button);
    if (!context) continue;
    const contextButtons = buttonsByContext.get(context) || [];
    contextButtons.push(button);
    buttonsByContext.set(context, contextButtons);
  }

  for (const [context, buttons] of buttonsByContext) {
    const existingTrigger = context.querySelector?.(`.${TRIGGER_CLASS}`);
    if (existingTrigger) {
      buttons.forEach((button) => button.remove?.());
      moveChannelTriggerToActionEnd(existingTrigger);
      continue;
    }

    const anchor = selectPreferredApiKeyActionButton(buttons);
    if (!anchor) continue;
    const channel = findChannelFromButton(anchor);
    if (!channel.id) continue;

    buttons.forEach((button) => {
      if (button !== anchor) button.remove?.();
    });
    replaceApiKeyActionButton(anchor, channel);
  }
}

function removeMarketplaceVerificationButtons() {
  if (!location.pathname.startsWith("/marketplace")) return;
  for (const button of document.querySelectorAll("main button")) {
    if (isMarketplaceVerificationButtonText(button.textContent || "")) button.remove?.();
  }
}

function isMarketplaceVerificationButtonText(text) {
  return MARKETPLACE_VERIFICATION_ACTION_RE.test(cleanText(text));
}

function replaceApiKeyActionButton(anchor, channel = findChannelFromButton(anchor)) {
  if (!channel.id) return;
  const trigger = createTrigger(channel);
  anchor.replaceWith(trigger);
  moveChannelTriggerToActionEnd(trigger);
}

function moveChannelTriggerToActionEnd(trigger) {
  const actionContainer = trigger?.parentElement;
  if (!actionContainer || actionContainer.lastElementChild === trigger) return;
  actionContainer.append(trigger);
}

function createTrigger(channel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${TRIGGER_CLASS} ${CHANNEL_TRIGGER_CLASS}`;
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"></circle><path d="m11 12 9-9"></path><path d="m16 4 4 4"></path></svg><span>更新 API 密钥</span>`;
  button.setAttribute("aria-label", `更新 ${channel.name || "当前渠道"} 的 API 密钥`);
  updateTriggerChannel(button, channel);
  button.addEventListener("click", openDialog);
  return button;
}

function findChannelContext(node) {
  const fixed = node.closest('[data-slot="card"], tr, [role="row"]');
  if (fixed) return fixed;
  let current = node.parentElement;
  while (current && current !== document.body) {
    if (findChannelNameFromText(textBeforeButton(current, node))) return current;
    current = current.parentElement;
  }
  return node.parentElement;
}

function findCardChannelName(node) {
  return node.closest('[data-slot="card"]')?.querySelector('[data-slot="card-title"]')?.textContent?.trim() || "";
}

function findChannelFromButton(node) {
  const name = findVisibleChannelName(node);
  const channel = findCachedChannel(name) || findDirectReactChannel(node) || {};
  return {
    id: channel.id ? String(channel.id) : "",
    name: channel.name || name,
  };
}

function findVisibleChannelName(node) {
  const context = findChannelContext(node);
  return findCardChannelName(node) || findChannelNameFromText(context ? textBeforeButton(context, node) : "");
}

function textBeforeButton(context, button) {
  const text = [];
  for (const current of Array.from(context.childNodes || context.children || [])) {
    if (current === button || containsNode(current, button)) break;
    const value = current.textContent?.trim();
    if (value) text.push(value);
  }
  return text.join("\n");
}

function containsNode(parent, child) {
  if (parent?.contains) return parent.contains(child);
  let current = child?.parentElement;
  while (current) {
    if (current === parent) return true;
    current = current.parentElement;
  }
  return false;
}

function findChannelNameFromText(text) {
  const lines = String(text || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const channel = findCachedChannel(line);
    if (channel) return channel.name;
  }
  return "";
}

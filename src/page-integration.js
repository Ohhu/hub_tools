const MARKETPLACE_CHANNEL_TAB_RE = /渠道广场|channel/i;
const MARKETPLACE_CHANNELS_ROOT_RE = /渠道广场|按渠道名称|全部标签/i;
const MARKETPLACE_TAGS_LABEL_RE = /^(标签|tags?)$/i;
const MARKETPLACE_SORT_LABEL_RE = /^(排序|sort)$/i;
const MARKETPLACE_HEALTH_LABEL_RE = /^(健康序列|health(?:\s+window|\s+sequence)?)$/i;
const MARKETPLACE_VERIFICATION_ACTION_RE = /^(真伪核验|Authenticity\s+Check|Verify\s+Authenticity)$/i;
const MARKETPLACE_SEARCH_PLACEHOLDER_RE = /渠道名称|支持模型|search/i;
const REQUESTS_API_KEY_LABEL = "API密钥";
const REQUEST_LOG_CHANNEL_HEADER_RE = /^(渠道|channel)$/i;
const MARKETPLACE_FREE_SORT_TEXT = "倍率从低到高";
const MARKETPLACE_DEFAULT_SORT_TEXT = "综合推荐";

function openSelectLikeUser(trigger) {
  dispatchPointerEvent(trigger, "pointerdown", 1);
}

function selectOptionLikeUser(option) {
  dispatchPointerEvent(option, "pointermove", 1);
  dispatchMouseEvent(option, "mousemove", 1);
  dispatchPointerEvent(option, "pointerup", 0);
  dispatchMouseEvent(option, "mouseup", 0);
  dispatchMouseEvent(option, "click", 0);
}

function dispatchPointerEvent(element, type, buttons) {
  const init = mouseEventInit(element, buttons);
  const event = typeof PointerEvent === "function"
    ? new PointerEvent(type, { ...init, pointerId: 1, pointerType: "mouse", isPrimary: true })
    : new MouseEvent(type, init);
  element.dispatchEvent(event);
}

function dispatchMouseEvent(element, type, buttons) {
  element.dispatchEvent(new MouseEvent(type, mouseEventInit(element, buttons)));
}

function mouseEventInit(element, buttons) {
  const rect = element.getBoundingClientRect?.();
  const clientX = rect ? rect.left + rect.width / 2 : 0;
  const clientY = rect ? rect.top + rect.height / 2 : 0;
  return {
    bubbles: true,
    cancelable: true,
    composed: true,
    button: 0,
    buttons,
    clientX,
    clientY,
  };
}

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

function insertPriceFilter() {
  if (!location.pathname.startsWith("/marketplace")) {
    resetPriceFilterState();
    removePriceFilterField();
    removeModelIDFilterField();
    return;
  }
  const anchors = findMarketplaceFilterFields();
  if (!isMarketplaceChannelsTabActive() && !anchors.tags) {
    removePriceFilterField();
    removeModelIDFilterField();
    return;
  }
  const filterAnchor = anchors.health || anchors.sort || anchors.tags;
  if (!filterAnchor) return;
  let field = document.getElementById(PRICE_FIELD_ID);
  if (!field) field = createPriceFilterField();
  const previousParent = field.parentElement;
  const filterGrid = movePriceFilterToEndOfGrid(filterAnchor, field);
  if (!filterGrid) return;
  ensureModelIDFilterField(filterGrid);
  if (previousParent && previousParent !== filterGrid) {
    previousParent.classList?.remove?.("hkb-marketplace-filter-grid");
  }
  markMarketplaceFilterGrid(filterGrid);
  cleanupMarketplaceSearchInput();
  syncPriceFilterField(field);
}

function movePriceFilterToEndOfGrid(filterAnchor, priceFilterField) {
  const filterGrid = filterAnchor?.parentElement;
  if (!filterGrid) return null;
  if (priceFilterField.parentElement !== filterGrid || filterGrid.lastElementChild !== priceFilterField) {
    filterGrid.append(priceFilterField);
  }
  return filterGrid;
}

function removePriceFilterField() {
  const field = document.getElementById(PRICE_FIELD_ID);
  const parent = field?.parentElement;
  field?.remove?.();
  parent?.classList?.remove?.("hkb-marketplace-filter-grid");
  document.querySelectorAll?.(".hkb-marketplace-filter-grid")?.forEach?.((grid) => {
    grid.classList?.remove?.("hkb-marketplace-filter-grid");
  });
}

function markMarketplaceFilterGrid(activeGrid) {
  document.querySelectorAll?.(".hkb-marketplace-filter-grid")?.forEach?.((grid) => {
    if (grid !== activeGrid) grid.classList?.remove?.("hkb-marketplace-filter-grid");
  });
  activeGrid?.classList?.add?.("hkb-marketplace-filter-grid");
}

function isMarketplaceChannelsTabActive() {
  if (!location.pathname.startsWith("/marketplace")) return false;
  const root = document.querySelector("main") || document;
  const selected = root.querySelector('[role="tab"][aria-selected="true"], [role="tab"][data-state="active"]');
  return !selected || MARKETPLACE_CHANNEL_TAB_RE.test(String(selected.textContent || ""));
}

function findMarketplaceFilterFields(fields = Array.from(marketplaceChannelsRoot().querySelectorAll("label, p, div, span"))) {
  return {
    tags: filterFieldByLabel(fields, MARKETPLACE_TAGS_LABEL_RE),
    sort: filterFieldByLabel(fields, MARKETPLACE_SORT_LABEL_RE),
    health: filterFieldByLabel(fields, MARKETPLACE_HEALTH_LABEL_RE),
  };
}

function marketplaceChannelsRoot() {
  const main = document.querySelector("main") || document;
  const panels = Array.from(main.querySelectorAll?.('[role="tabpanel"], [data-slot="tabs-content"]') || []);
  return panels.find((panel) => isElementVisible(panel) && MARKETPLACE_CHANNELS_ROOT_RE.test(String(panel.textContent || ""))) || main;
}

function filterFieldByLabel(elements, pattern) {
  for (const label of elements) {
    if (!isFilterLabelText(label.textContent, pattern)) continue;
    const field = closestFilterField(label);
    if (hasFilterControl(field)) return field;
  }
  return null;
}

function isFilterLabelText(text, pattern) {
  const normalized = cleanText(text);
  return normalized.length <= 24 && pattern.test(normalized);
}

function closestFilterField(label) {
  let current = label;
  while (current && current !== document.body) {
    if (hasFilterControl(current)) return current;
    current = current.parentElement;
  }
  return null;
}

function hasFilterControl(field) {
  return Boolean(field?.querySelector?.("select") || field?.querySelector?.('[role="combobox"]'));
}

function currentOfficialFilter() {
  return selectedOfficialFilter;
}

function createModelIDFilterField() {
  const field = document.createElement("div");
  field.id = MODEL_ID_FIELD_ID;
  field.className = "space-y-1";
  field.dataset.hubToolModelIDFilter = "true";
  field.innerHTML = `<p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">模型 ID</p>
    <div class="hkb-model-id-wrap">
      <button type="button" id="${MODEL_ID_SELECT_ID}" class="hkb-model-id-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="按模型 ID 筛选渠道">
        <span class="hkb-model-id-value">全部（不过滤）</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </button>
      <div class="hkb-model-id-menu" role="listbox" aria-label="模型 ID 选项" hidden></div>
    </div>`;
  field.querySelector("button").addEventListener("click", handleModelIDTriggerClick);
  field.querySelector("[role=\"listbox\"]").addEventListener("click", handleModelIDOptionClick);
  ensureModelIDMenuGlobalHandler();
  return field;
}

function syncModelIDFilterField(field) {
  if (!field) return;
  const trigger = field.querySelector(`#${MODEL_ID_SELECT_ID}`);
  const menu = field.querySelector('[role="listbox"]');
  if (!trigger || !menu) return;
  const options = marketplaceModelIDOptions;
  const nextValue = isModelIDFilterAll() ? MODEL_ID_ALL_VALUE : currentSelectedModelID();
  const nextSignature = `${options.__signature || ""}|${nextValue}`;
  const wrap = trigger.parentElement;
  if (wrap.dataset.hubToolSignature === nextSignature) return;
  wrap.dataset.hubToolSignature = nextSignature;
  const optionLabel = (option) => `${option.value}（${option.serves}）`;
  const selected = options.find((option) => option.value === nextValue);
  const label = nextValue === MODEL_ID_ALL_VALUE ? "全部（不过滤）" : selected ? optionLabel(selected) : nextValue;
  trigger.querySelector(".hkb-model-id-value").textContent = label;
  trigger.title = label;
  menu.textContent = "";
  const entries = [{ value: MODEL_ID_ALL_VALUE, label: "全部（不过滤）" },
    ...options.map((option) => ({ value: option.value, label: optionLabel(option) }))];
  for (const entry of entries) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "hkb-model-id-option";
    element.setAttribute("role", "option");
    element.dataset.value = entry.value;
    element.setAttribute("aria-selected", String(entry.value === nextValue));
    element.innerHTML = `<span></span>`;
    element.querySelector("span").textContent = entry.label;
    menu.append(element);
  }
}

function handleModelIDTriggerClick(event) {
  const trigger = event.currentTarget;
  const menu = trigger.parentElement.querySelector('[role="listbox"]');
  if (!menu) return;
  const open = menu.hidden;
  closeAllModelIDMenus();
  setModelIDMenuOpen(menu, open);
}

function handleModelIDOptionClick(event) {
  const option = event.target?.closest?.("[data-value]");
  if (!option) return;
  const menu = event.currentTarget;
  setModelIDMenuOpen(menu, false);
  const value = option.dataset.value || "";
  setModelIDFilter(value === currentMarketplaceModelID() ? "" : value);
}

function setModelIDMenuOpen(menu, open) {
  menu.hidden = !open;
  menu.parentElement?.querySelector(`#${MODEL_ID_SELECT_ID}`)?.setAttribute("aria-expanded", String(open));
}

function closeAllModelIDMenus() {
  document.querySelectorAll(`#${MODEL_ID_FIELD_ID} [role="listbox"]`).forEach((menu) => {
    if (!menu.hidden) setModelIDMenuOpen(menu, false);
  });
}

function ensureModelIDMenuGlobalHandler() {
  if (ensureModelIDMenuGlobalHandler.bound) return;
  ensureModelIDMenuGlobalHandler.bound = true;
  document.addEventListener("click", (event) => {
    document.querySelectorAll(`#${MODEL_ID_FIELD_ID} .hkb-model-id-wrap`).forEach((wrap) => {
      const menu = wrap.querySelector('[role="listbox"]');
      if (menu && !menu.hidden && !wrap.contains(event.target)) setModelIDMenuOpen(menu, false);
    });
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModelIDMenus();
  }, true);
}

function setModelIDFilter(value) {
  const next = value === MODEL_ID_ALL_VALUE ? MODEL_ID_ALL_VALUE : String(value || "");
  if (next === selectedMarketplaceModelID) return;
  selectedMarketplaceModelID = next;
  syncModelIDFilterField(document.getElementById(MODEL_ID_FIELD_ID));
  applyVisiblePriceFilter();
}

function syncModelIDFilterPageContext() {
  const isModelPage = location.pathname.startsWith("/marketplace/models/");
  const current = isModelPage ? location.pathname : "";
  if (current === modelIDFilterPathname) return;
  modelIDFilterPathname = current;
  selectedMarketplaceModelID = "";
  syncModelIDFilterField(document.getElementById(MODEL_ID_FIELD_ID));
}

function ensureModelIDFilterField(filterGrid) {
  if (!location.pathname.startsWith("/marketplace/models/")) {
    removeModelIDFilterField();
    return;
  }
  let field = document.getElementById(MODEL_ID_FIELD_ID);
  if (!field) field = createModelIDFilterField();
  if (field.parentElement !== filterGrid) filterGrid.append(field);
  syncModelIDFilterField(field);
}

function removeModelIDFilterField() {
  document.getElementById(MODEL_ID_FIELD_ID)?.remove?.();
}

function createPriceFilterField() {
  const field = document.createElement("div");
  field.id = PRICE_FIELD_ID;
  field.className = "space-y-1";
  field.dataset.hubToolPriceFilter = "true";
  field.innerHTML = `<p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">渠道筛选</p>
    <div class="hkb-filter-buttons" role="group" aria-label="渠道筛选">
      <button type="button" class="hkb-price-button inline-flex items-center justify-center whitespace-nowrap outline-none" data-role="price-filter" data-price="free" aria-label="只看免费渠道">免费</button>
      <button type="button" class="hkb-price-button inline-flex items-center justify-center whitespace-nowrap outline-none" data-role="official-filter" aria-label="只看官方渠道">官方</button>
    </div>`;
  field.addEventListener("click", handlePriceFilterClick);
  return field;
}

function syncPriceFilterField(field) {
  if (!field) return;
  const price = currentPriceFilter();
  field.querySelectorAll("[data-price]").forEach((button) => {
    const selected = button.dataset.price === price;
    button.setAttribute("aria-pressed", String(selected));
  });
  const official = currentOfficialFilter();
  field.querySelectorAll('[data-role="official-filter"]').forEach((button) => {
    button.setAttribute("aria-pressed", String(official));
  });
}

function handlePriceFilterClick(event) {
  const officialButton = event.target?.closest?.('[data-role="official-filter"]');
  if (officialButton) {
    setOfficialFilter(!selectedOfficialFilter);
    return;
  }
  const button = event.target?.closest?.("[data-price]");
  if (!button) return;
  setPriceFilter(currentPriceFilter() === button.dataset.price ? "all" : button.dataset.price);
}

function setOfficialFilter(value) {
  const official = Boolean(value);
  if (official === selectedOfficialFilter) return;
  selectedOfficialFilter = official;
  syncPriceFilterField(document.getElementById(PRICE_FIELD_ID));
  applyVisiblePriceFilter();
  triggerMarketplaceRefresh();
}

function resetOfficialFilterState() {
  if (!selectedOfficialFilter) return;
  selectedOfficialFilter = false;
  applyVisiblePriceFilter();
}

function setPriceFilter(value) {
  const price = normalizePriceFilter(value);
  if (price === selectedPriceFilter) return;
  selectedPriceFilter = price;
  syncPriceFilterField(document.getElementById(PRICE_FIELD_ID));
  applyVisiblePriceFilter();
  triggerMarketplaceRefresh();
}

function cleanupLegacyPriceParam() {
  const url = new URL(location.href);
  if (!url.searchParams.has("price")) return;
  url.searchParams.delete("price");
  history.replaceState(history.state, "", url);
}

function triggerMarketplaceRefresh() {
  if (location.pathname.startsWith("/marketplace/models/")) {
    scheduleRouteScans();
    return;
  }
  const targetSort = currentPriceFilter() === "free" ? MARKETPLACE_FREE_SORT_TEXT : MARKETPLACE_DEFAULT_SORT_TEXT;
  if (triggerMarketplaceSortRefresh(targetSort)) return;
  scheduleRouteScans();
}

function triggerMarketplaceSortRefresh(targetText) {
  const trigger = findMarketplaceSortTrigger();
  if (!trigger) return false;
  const fetchStartedAt = lastMarketplaceChannelsFetchAt;
  openSelectLikeUser(trigger);
  setTimeout(() => {
    const option = findVisibleOptionByText(targetText);
    if (option) selectOptionLikeUser(option);
  }, 0);
  setTimeout(() => {
    if (lastMarketplaceChannelsFetchAt <= fetchStartedAt) scheduleRouteScans();
  }, 260);
  return true;
}

function resetPriceFilterState() {
  const priceChanged = selectedPriceFilter !== "all";
  const officialChanged = selectedOfficialFilter;
  if (priceChanged) selectedPriceFilter = "all";
  if (officialChanged) selectedOfficialFilter = false;
  if (!priceChanged && !officialChanged) return;
  applyVisiblePriceFilter();
}function findMarketplaceSortTrigger() {
  const anchors = findMarketplaceFilterFields();
  return anchors.sort?.querySelector?.('[role="combobox"], button') || null;
}

function findVisibleOptionByText(text) {
  return Array.from(document.querySelectorAll('[role="option"]')).find((option) =>
    cleanText(option.textContent) === text && isElementVisible(option),
  ) || null;
}

function isElementVisible(element) {
  return Boolean(element?.offsetParent || element?.getClientRects?.().length);
}

function cleanupMarketplaceSearchInput(input = findMarketplaceSearchInput()) {
  if (!input || !hasMarketplaceSearchMarker(input.value)) return;
  setInputValue(input, cleanMarketplaceSearch(input.value));
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(input, value);
  else input.value = value;
}

function findMarketplaceSearchInput() {
  return Array.from(document.querySelectorAll("main input")).find((input) =>
    MARKETPLACE_SEARCH_PLACEHOLDER_RE.test(String(input.placeholder || "")),
  ) || null;
}

function applyVisiblePriceFilter() {
  if (!location.pathname.startsWith("/marketplace/models/")) return;
  const mode = currentPriceFilter();
  const official = currentOfficialFilter();
  const idFilterEnabled = !isModelIDFilterAll();
  for (const button of findChannelActionButtons()) {
    const context = findChannelContext(button);
    const channel = findActionButtonChannel(button);
    const state = modelProviderFreeState(channel);
    const officialState = modelProviderOfficialState(channel);
    const priceHidden = mode !== "all" && state !== null && !priceStateMatches(state, mode);
    const officialHidden = official && officialState === false;
    const idHidden = idFilterEnabled && !providerServesSelectedModelID(channel);
    const hidden = priceHidden || officialHidden || idHidden;
    if (context) context.dataset.hubToolPriceHidden = hidden ? "true" : "false";
  }
}

function findActionButtonChannel(button) {
  if (isTriggerButton(button)) {
    return { id: button.dataset.channelId || "", name: button.dataset.channelName || "" };
  }
  return findChannelFromButton(button);
}

function insertRequestTriggers() {
  if (!isRequestsConsumerRoute()) {
    document.querySelectorAll(`.${REQUEST_TRIGGER_CLASS}`).forEach((button) => button.remove?.());
    return;
  }
  const apiKeyButton = findRequestsApiKeyFilterButton();
  const host = apiKeyButton?.parentElement;
  if (!apiKeyButton || !host || host.querySelector?.(`.${REQUEST_TRIGGER_CLASS}`)) return;
  apiKeyButton.insertAdjacentElement("afterend", createRequestEditTrigger(apiKeyButton));
}

function injectRequestLogMultiplierColumn() {
  if (!isRequestsConsumerRoute()) {
    removeRequestLogMultiplierColumn();
    return;
  }
  const table = document.querySelector("main table");
  if (!table) return;
  const channelColumnIndex = requestLogChannelColumnIndex(table);
  if (channelColumnIndex < 0) {
    removeRequestLogMultiplierColumn();
    return;
  }
  ensureRequestLogMultiplierHeader(table, channelColumnIndex);
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  for (const row of rows) {
    injectRequestLogMultiplierRow(row, channelColumnIndex);
  }
}

function removeRequestLogMultiplierColumn() {
  document.querySelectorAll?.(`.${MULTIPLIER_COLUMN_CLASS}`).forEach((cell) => cell.remove?.());
  document.querySelectorAll?.(`.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}`).forEach((cell) => {
    cell.classList?.remove?.(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
    if (cell.tagName === "TD") cell.removeAttribute?.("title");
  });
}

function ensureRequestLogMultiplierHeader(table, channelColumnIndex) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  const channelHeader = headers[channelColumnIndex];
  if (!channelHeader) return;
  channelHeader.classList.add(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
  const multiplierHeaders = headers.filter((header) => header?.classList?.contains?.(MULTIPLIER_COLUMN_CLASS));
  multiplierHeaders.slice(1).forEach((header) => header.remove?.());
  let header = multiplierHeaders[0];
  if (!header) {
    header = document.createElement("th");
    header.className = `${channelHeader.className || "h-10 px-2 text-left align-middle whitespace-nowrap"} ${MULTIPLIER_COLUMN_CLASS} ${MULTIPLIER_COLUMN_HEADER_CLASS}`;
    header.textContent = "倍率";
    header.setAttribute("aria-label", "倍率");
  } else {
    header.classList.add(MULTIPLIER_COLUMN_HEADER_CLASS);
  }
  if (header.parentElement !== channelHeader.parentElement || header.previousElementSibling !== channelHeader) {
    channelHeader.parentElement.insertBefore(header, channelHeader.nextElementSibling);
  }
}

function injectRequestLogMultiplierRow(row, channelColumnIndex) {
  const cells = Array.from(row.children);
  if (!cells.length) return;
  const channelCell = cells[channelColumnIndex];
  if (!channelCell) return;
  constrainRequestLogChannelCell(channelCell);
  const multiplierCells = cells.filter((cell) => cell?.classList?.contains?.(MULTIPLIER_COLUMN_CLASS));
  multiplierCells.slice(1).forEach((cell) => cell.remove?.());
  let cell = multiplierCells[0];
  if (!cell) {
    cell = document.createElement("td");
    cell.className = `${channelCell.className || "p-2 align-middle whitespace-nowrap"} ${MULTIPLIER_COLUMN_CLASS}`;
  }
  if (cell.parentElement !== channelCell.parentElement || cell.previousElementSibling !== channelCell) {
    channelCell.parentElement.insertBefore(cell, channelCell.nextElementSibling);
  }
  applyRequestLogMultiplierCellContent(cell, row);
}

function applyRequestLogMultiplierCellContent(cell, row) {
  const requestID = requestLogIDFromRow(row);
  const multiplier = requestID == null ? null : requestLogMultiplierCache.get(requestID);
  cell.classList.remove(MULTIPLIER_LOW_TONE_CLASS, MULTIPLIER_HIGH_TONE_CLASS);
  if (multiplier == null) {
    if (cell.textContent !== "-") {
      cell.textContent = "-";
      cell.removeAttribute?.("title");
      cell.setAttribute("aria-label", "渠道倍率未知");
    }
    return;
  }
  const formattedMultiplier = formatMultiplier(multiplier);
  if (multiplierTone(formattedMultiplier) === "low") cell.classList.add(MULTIPLIER_LOW_TONE_CLASS);
  if (multiplierTone(formattedMultiplier) === "high") cell.classList.add(MULTIPLIER_HIGH_TONE_CLASS);
  const text = `×${formattedMultiplier}`;
  const title = `渠道倍率：${formattedMultiplier}`;
  if (cell.textContent === text && cell.title === title) return;
  cell.textContent = text;
  cell.title = title;
  cell.setAttribute("aria-label", `渠道倍率 ${formattedMultiplier}`);
}

function constrainRequestLogChannelCell(channelCell) {
  if (!channelCell) return;
  channelCell.classList.add(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
  const channelName = cleanText(channelCell.textContent);
  if (channelName) channelCell.setAttribute("title", channelName);
}

function multiplierTone(multiplier) {
  if (multiplier == null || multiplier === "") return "mid";
  const value = Number(multiplier);
  if (!Number.isFinite(value)) return "mid";
  if (value < 1) return "low";
  if (value > 2) return "high";
  return "mid";
}

function requestLogChannelColumnIndex(table) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  const index = headers.findIndex((th) => REQUEST_LOG_CHANNEL_HEADER_RE.test(cleanText(th.textContent)));
  return index < 0 ? -1 : index;
}

function requestLogIDFromRow(row) {
  const idCell = row.children[0];
  const text = cleanText(idCell?.textContent || "");
  const match = text.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function formatMultiplier(multiplier) {
  const value = Number(multiplier);
  if (!Number.isFinite(value)) return String(multiplier ?? "");
  const normalizedValue = Number(value.toFixed(4));
  return Number.isInteger(normalizedValue) ? normalizedValue.toFixed(1) : String(normalizedValue);
}

function isRequestsConsumerRoute() {
  if (!location.pathname.startsWith("/project/requests")) return false;
  const view = new URLSearchParams(location.search || "").get("view");
  return !view || view === "consumer";
}

function findRequestsApiKeyFilterButton() {
  return Array.from(document.querySelectorAll("main button"))
    .find((button) => cleanText(button.textContent) === REQUESTS_API_KEY_LABEL);
}

function createRequestEditTrigger(anchor) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "更新 API 密钥";
  button.className = anchor.className
    || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-8 rounded-md px-3";
  button.classList.add(TRIGGER_CLASS, REQUEST_TRIGGER_CLASS);
  button.addEventListener("click", openRequestEditDialog);
  return button;
}

function ensurePanel() {
  syncModelIDFilterPageContext();
  injectStyle();
  replaceApiKeyActionButtons();
  removeMarketplaceVerificationButtons();
  insertRequestTriggers();
  injectRequestLogMultiplierColumn();
  insertPriceFilter();
  applyVisiblePriceFilter();
}

function schedulePanel() {
  if (!isTargetRoute()) return;
  if (mountTimer) return;
  mountTimer = requestFrame(() => {
    mountTimer = 0;
    ensurePanel();
  });
}

function requestFrame(callback) {
  return typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(callback, 16);
}

function isTargetRoute(pathname = location.pathname) {
  return pathname.startsWith("/marketplace")
    || pathname.startsWith("/project/api-keys")
    || pathname.startsWith("/project/requests");
}

function handleRouteChange() {
  const route = `${location.pathname}${location.search || ""}`;
  if (lastPathname === route) return;
  lastPathname = route;
  scheduleRouteScans();
}

function scheduleRouteScans() {
  if (!isTargetRoute()) return;
  schedulePanel();
  setTimeout(schedulePanel, 120);
  setTimeout(schedulePanel, 360);
}

function insertPriceFilter() {
  if (!location.pathname.startsWith("/marketplace")) {
    resetPriceFilterState();
    removePriceFilterField();
    return;
  }
  const anchors = findMarketplaceFilterFields();
  if (!isMarketplaceChannelsTabActive() && !anchors.tags) {
    removePriceFilterField();
    return;
  }
  const filterAnchor = anchors.health || anchors.sort || anchors.tags;
  if (!filterAnchor) return;
  let field = document.getElementById(PRICE_FIELD_ID);
  if (!field) field = createPriceFilterField();
  const previousParent = field.parentElement;
  const filterGrid = movePriceFilterToEndOfGrid(filterAnchor, field);
  if (!filterGrid) return;
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

function createPriceFilterField() {
  const field = document.createElement("div");
  field.id = PRICE_FIELD_ID;
  field.className = "space-y-1";
  field.dataset.hubToolPriceFilter = "true";
  field.innerHTML = `<p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">价格</p>
    <button type="button" class="hkb-price-button inline-flex items-center justify-center whitespace-nowrap outline-none" data-role="price-filter" data-price="free" aria-label="只看免费渠道">免费</button>`;
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
}

function handlePriceFilterClick(event) {
  const button = event.target?.closest?.("[data-price]");
  if (!button) return;
  setPriceFilter(currentPriceFilter() === button.dataset.price ? "all" : button.dataset.price);
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
  if (selectedPriceFilter === "all") return;
  selectedPriceFilter = "all";
  applyVisiblePriceFilter();
}

function findMarketplaceSortTrigger() {
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
  for (const button of findChannelActionButtons()) {
    const context = findChannelContext(button);
    const channel = findActionButtonChannel(button);
    const state = modelProviderFreeState(channel);
    const hidden = mode !== "all" && state !== null && !priceStateMatches(state, mode);
    if (context) context.dataset.hubToolPriceHidden = hidden ? "true" : "false";
  }
}

function findActionButtonChannel(button) {
  if (isTriggerButton(button)) {
    return { id: button.dataset.channelId || "", name: button.dataset.channelName || "" };
  }
  return findChannelFromButton(button);
}

  function schedulePanel() {
    if (!isTargetRoute()) return;
    if (mountTimer) return;
    mountTimer = requestFrame(() => { mountTimer = 0; ensurePanel(); });
  }

  function requestFrame(callback) {
    return typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(callback, 16);
  }

  function isTargetRoute(pathname = location.pathname) {
    return pathname.startsWith("/marketplace") || pathname.startsWith("/project/api-keys") || pathname.startsWith("/project/requests");
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

  function ensurePanel() {
    injectStyle();
    for (const anchor of findCreateApiButtons()) replaceCreateApiButton(anchor);
    insertRequestTriggers();
    insertPriceFilter();
    applyVisiblePriceFilter();
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

  function isRequestsConsumerRoute() {
    if (!location.pathname.startsWith("/project/requests")) return false;
    const view = new URLSearchParams(location.search || "").get("view");
    return !view || view === "consumer";
  }

  function findRequestsApiKeyFilterButton() {
    return Array.from(document.querySelectorAll("main button"))
      .find((button) => cleanText(button.textContent) === "API密钥");
  }

  function createRequestEditTrigger(anchor) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "更新 API 密钥";
    button.className = anchor.className || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-8 rounded-md px-3";
    button.classList.add(TRIGGER_CLASS, REQUEST_TRIGGER_CLASS);
    button.addEventListener("click", openRequestEditDialog);
    return button;
  }

  function findCreateApiButtons() {
    return Array.from(document.querySelectorAll("main button")).filter(isApiKeyActionButton);
  }

  function findChannelActionButtons() {
    return Array.from(document.querySelectorAll("main button")).filter((button) =>
      isApiKeyActionButton(button) || isTriggerButton(button),
    );
  }

  function isApiKeyActionButton(node) {
    return !isTriggerButton(node) && isCreateApiButtonText(node.textContent || "");
  }

  function isCreateApiButtonText(text) {
    return CREATE_API_KEY_RE.test(String(text || ""));
  }

  function isTriggerButton(node) {
    return Boolean(node?.classList?.contains(TRIGGER_CLASS));
  }

  function replaceCreateApiButton(anchor) {
    const channel = findChannelFromButton(anchor);
    if (!channel.id) return;
    const button = createTrigger(anchor, channel);
    anchor.replaceWith(button);
  }

  function insertPriceFilter() {
    if (!location.pathname.startsWith("/marketplace")) {
      resetPriceFilterState();
      document.getElementById(PRICE_FIELD_ID)?.remove();
      return;
    }
    if (!isMarketplaceChannelsTabActive()) {
      document.getElementById(PRICE_FIELD_ID)?.remove();
      return;
    }
    const anchors = findMarketplaceFilterFields();
    const anchor = anchors.sort || anchors.tags;
    if (!anchor) return;
    let field = document.getElementById(PRICE_FIELD_ID);
    if (!field) field = createPriceFilterField();
    cleanupMarketplaceSearchInput();
    syncPriceFilterField(field);
    if (anchors.sort) {
      if (field.parentElement !== anchor) anchor.appendChild(field);
    } else if (field.parentElement !== anchor.parentElement || field.previousElementSibling !== anchor) {
      anchor.insertAdjacentElement("afterend", field);
    }
    alignPriceFilterWithSort(anchors.sort, field);
  }

  function isMarketplaceChannelsTabActive() {
    if (!location.pathname.startsWith("/marketplace")) return false;
    const root = document.querySelector("main") || document;
    const selected = root.querySelector('[role="tab"][aria-selected="true"], [role="tab"][data-state="active"]');
    return !selected || /渠道广场|channel/i.test(String(selected.textContent || ""));
  }

  function findMarketplaceFilterFields(fields = Array.from(marketplaceChannelsRoot().querySelectorAll("label, p, div, span"))) {
    return {
      tags: filterFieldByLabel(fields, /^(标签|tags?)$/i),
      sort: filterFieldByLabel(fields, /^(排序|sort)$/i),
    };
  }

  function marketplaceChannelsRoot() {
    const main = document.querySelector("main") || document;
    const panels = Array.from(main.querySelectorAll?.('[role="tabpanel"], [data-slot="tabs-content"]') || []);
    return panels.find((panel) => isElementVisible(panel) && /渠道广场|按渠道名称|全部标签/i.test(String(panel.textContent || ""))) || main;
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
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
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

  function alignPriceFilterWithSort(anchor, field) {
    if (!anchor || !field) return;
    anchor.classList?.add?.("hkb-sort-anchor");
    const trigger = anchor.querySelector?.('[role="combobox"], button');
    const marginBottom = Number.parseFloat(getComputedStyle(trigger || anchor).marginBottom || "0");
    field.style.setProperty("--hkb-price-bottom", `${Number.isFinite(marginBottom) ? marginBottom : 0}px`);
  }

  function createPriceFilterField() {
    const field = document.createElement("div");
    field.id = PRICE_FIELD_ID;
    field.dataset.hubToolPriceFilter = "true";
    field.innerHTML = `<button type="button" class="hkb-price-button border-input flex items-center justify-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]" data-size="default" data-role="price-filter" data-price="free" aria-label="只看免费渠道">免费</button>`;
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
    const targetSort = currentPriceFilter() === "free" ? "倍率从低到高" : "综合推荐";
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
      /渠道名称|支持模型|search/i.test(String(input.placeholder || "")),
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

  function priceStateMatches(freeState, mode) {
    return mode === "free" ? freeState === true : freeState === false;
  }

  function createTrigger(anchor, channel) {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = "更新 API 密钥";
    button.className = anchor.className || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-9 rounded-md px-4";
    button.classList.add(TRIGGER_CLASS);
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

  function findCardChannelName(node) { return node.closest('[data-slot="card"]')?.querySelector('[data-slot="card-title"]')?.textContent?.trim() || ""; }

  function findChannelFromButton(node) {
    const name = findVisibleChannelName(node);
    const channel = findCachedChannel(name) || findDirectReactChannel(node) || {};
    return {
      id: channel.id ? String(channel.id) : "",
      name: channel.name || name,
    };
  }

  function findVisibleChannelName(node) {
    return findCardChannelName(node) || findChannelNameFromText(findContextTextBeforeButton(findChannelContext(node), node));
  }

  function findContextTextBeforeButton(context, button) {
    if (!context) return "";
    return textBeforeButton(context, button);
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

  function startMountWatcher() {
    patchHistoryRouting();
    cleanupLegacyPriceParam();
    new MutationObserver((mutations) => {
      if (isTargetRoute() && mutations.some(isUsefulMutation)) schedulePanel();
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
    scheduleRouteScans();
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("load", scheduleRouteScans, { once: true });
    document.addEventListener("click", handleMarketplaceTabActivation, true);
    document.addEventListener("keydown", handleMarketplaceTabActivation, true);
  }

  function handleMarketplaceTabActivation(event) {
    if (!location.pathname.startsWith("/marketplace")) return;
    if (event.type === "keydown" && !["Enter", " ", "Spacebar"].includes(event.key)) return;
    const tab = event.target?.closest?.("[role='tab'], [data-slot='tabs-trigger']");
    if (!tab || !MARKETPLACE_CHANNEL_TAB_RE.test(String(tab.textContent || ""))) return;
    setTimeout(schedulePanel, 0);
    setTimeout(schedulePanel, 120);
  }

  function patchHistoryRouting() {
    if (history.__hubKeyBinderPatched) return;
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function patchedHistoryMethod(...args) {
        const result = original.apply(this, args);
        setTimeout(handleRouteChange, 0);
        return result;
      };
    }
    Object.defineProperty(history, "__hubKeyBinderPatched", { value: true });
  }

  function isUsefulMutation(mutation) {
    if (mutation.target?.closest?.(`#${DIALOG_ID}`)) return false;
    for (const node of mutation.addedNodes || []) {
      if (isUsefulAddedNode(node)) return true;
    }
    return false;
  }

  function isUsefulAddedNode(node) {
    if (node.nodeType !== 1) return false;
    if (node.closest?.(`#${DIALOG_ID}`)) return false;
    if (node.matches?.("main, button, [data-slot='card'], tr, [role='row']")) return true;
    return Boolean(node.querySelector?.("main, button, [data-slot='card'], tr, [role='row']"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startMountWatcher, { once: true });
  else startMountWatcher();

  if (window.__hubKeyBinderEnableTest) {
    window.__hubKeyBinderTest = {
      findChannelFromButton,
      isApiKeyActionButton,
      isApiKeyActionButtonText,
      isExistingApiKeyActionButtonText,
      isMarketplaceVerificationButtonText,
      selectPreferredApiKeyActionButton,
      moveChannelTriggerToActionEnd,
      movePriceFilterToEndOfGrid,
      rememberChannelsFromPayload,
      buildProfilesInput,
      buildProfilesInputWithChannelIDs,
      moveChannelIDToIndex,
      findMarketplaceFilterFields,
      isMarketplaceChannelsTabActive,
      filterMarketplacePayloadByPrice,
      augmentChannelModelPricesPayload,
      ensurePricingFields,
      marketplaceChannelsScanUrl,
      sanitizeMarketplaceChannelsRequest,
      normalizePriceFilter,
      requestUrl,
      requestBodyText,
      readRequestBodyText,
      withMarketplaceModelPricingFields,
      isTargetRoute,
      isRequestsConsumerRoute,
      channelLabel,
      loadMissingChannelNames,
      __setPriceFilterForTest: (value) => { selectedPriceFilter = normalizePriceFilter(value); },
      __setGraphqlForTest: setGraphqlRunnerForTest,
    };
  }

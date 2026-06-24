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
    if (!tab || !/渠道广场|channel/i.test(String(tab.textContent || ""))) return;
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
    let graphqlRunner = null;
    const testGraphql = (query, variables = {}, operationName = undefined) =>
      (graphqlRunner ? graphqlRunner(query, variables, operationName) : graphql(query, variables, operationName));
    const testLoadChannelName = async (channelID) => {
      const numericID = extractNumericChannelID(channelID);
      if (!numericID) return null;
      if (channelCache.has(String(numericID))) return channelCache.get(String(numericID));
      const data = await testGraphql(
        queries.getChannelName,
        { id: `gid://axonhub/Channel/${numericID}` },
        "GetChannelName",
      );
      const channel = data?.node;
      if (!channel?.id || !channel?.name) return null;
      rememberChannel(channel);
      return channelCache.get(String(numericID)) || channel;
    };
    const testLoadMissingChannelNames = async (channelIDs) => {
      const missingIDs = uniqueChannelIDs(channelIDs)
        .filter((id) => !channelCache.has(String(id)))
        .slice(0, CHANNEL_NAME_LOOKUP_LIMIT);
      const results = await Promise.all(missingIDs.map((id) => testLoadChannelName(id).catch(() => null)));
      return results.filter(Boolean).length;
    };
    window.__hubKeyBinderTest = {
      extractNumericChannelID,
      findChannelFromButton,
      isApiKeyActionButton,
      isCreateApiButtonText,
      rememberChannelsFromPayload,
      apiKeyValue,
      buildProfilesInput,
      buildProfilesInputWithChannelIDs,
      moveChannelIDToIndex,
      findMarketplaceFilterFields,
      isMarketplaceChannelsTabActive,
      filterMarketplacePayloadByPrice,
      augmentChannelModelPricesPayload,
      channelFreeStateForModelDetail,
      implicitFreePriceRowsForCurrentModelPage,
      ensurePricingFields,
      marketplaceChannelsScanUrl,
      sanitizeMarketplaceChannelsRequest,
      cleanMarketplaceSearch,
      normalizePriceFilter,
      requestUrl,
      requestBodyText,
      readRequestBodyText,
      withMarketplaceModelPricingFields,
      rememberModelProviderPricesFromPayload,
      isTargetRoute,
      isRequestsConsumerRoute,
      findRequestsApiKeyFilterButton,
      insertRequestTriggers,
      channelLabel,
      loadMissingChannelNames: testLoadMissingChannelNames,
      __setPriceFilterForTest: (value) => { selectedPriceFilter = normalizePriceFilter(value); },
      __setGraphqlForTest: (runner) => { graphqlRunner = runner; },
    };
  }

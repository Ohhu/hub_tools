function augmentChannelModelPricesPayload(input, init, payload) {
  const channel = payload?.data?.node;
  const prices = channel?.channelModelPrices;
  if (!channel?.id || !Array.isArray(prices)) return payload;
  cacheChannelModelPrices(channel.id, prices);
  const implicitRows = implicitFreePriceRowsForCurrentContext(channel.id, prices);
  if (!implicitRows.length) return payload;
  return {
    ...payload,
    data: {
      ...payload.data,
      node: {
        ...channel,
        channelModelPrices: [...implicitRows, ...prices],
      },
    },
  };
}

function implicitFreePriceRowsForCurrentContext(channelID, prices) {
  return [
    ...implicitFreePriceRowsForCurrentSearch(channelID, prices),
    ...implicitFreePriceRowsForCurrentModelPage(channelID, prices),
  ];
}

function implicitFreePriceRowsForCurrentSearch(channelID, prices) {
  const search = cleanMarketplaceSearch(findMarketplaceSearchInput()?.value);
  if (!search) return [];
  const channel = findCachedChannelByID(channelID);
  if (!channel?.priceSummary?.hasPrices) return [];
  const supportedModels = matchedSupportedModels(channel, search);
  if (!supportedModels.length) return [];
  const existing = existingModelPriceIDSet(prices);
  return supportedModels
    .filter((modelID) => !existing.has(normalizeModelID(modelID)))
    .slice(0, IMPLICIT_FREE_PRICE_LIMIT)
    .map((modelID) => createImplicitFreePriceRow(channelID, modelID));
}

function implicitFreePriceRowsForCurrentModelPage(channelID, prices) {
  if (!location.pathname.startsWith("/marketplace/models/")) return [];
  if (currentPriceFilter() !== "free") return [];
  const modelID = currentMarketplaceModelID();
  if (!modelID || !hasModelPageImplicitFree(channelID, modelID)) return [];
  const existing = existingModelPriceIDSet(prices);
  return existing.has(normalizeModelID(modelID)) ? [] : [createImplicitFreePriceRow(channelID, modelID)];
}

function existingModelPriceIDSet(prices) {
  return new Set((prices || []).map((price) => normalizeModelID(price?.modelID)).filter(Boolean));
}

function createImplicitFreePriceRow(channelID, modelID) {
  return {
    id: `${IMPLICIT_FREE_PRICE_ROW_PREFIX}:${channelCacheKey(channelID)}:${modelID}`,
    modelID,
    price: {
      items: [
        createZeroPriceItem("prompt_tokens"),
        createZeroPriceItem("completion_tokens"),
      ],
    },
  };
}

function createZeroPriceItem(itemCode) {
  return {
    itemCode,
    multiplier: 0,
    pricing: {
      mode: "usage_per_unit",
      flatFee: 0,
      usagePerUnit: 0,
      usageTiered: { tiers: [] },
    },
    promptWriteCacheVariants: [],
  };
}

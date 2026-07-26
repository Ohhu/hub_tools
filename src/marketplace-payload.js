async function filterMarketplacePayloadByPrice(payload, price) {
  const mode = normalizePriceFilter(price);
  if (mode === "all") return payload;
  if (Array.isArray(payload?.data?.marketplaceModel?.providers)) {
    const providers = payload.data.marketplaceModel.providers.filter((provider) =>
      priceMatchesProviderForModel(provider, mode),
    );
    return {
      ...payload,
      data: {
        ...payload.data,
        marketplaceModel: {
          ...payload.data.marketplaceModel,
          providers,
        },
      },
    };
  }
  if (!Array.isArray(payload?.items)) return payload;
  const items = await filterMarketplaceChannelItems(payload.items, mode, "");
  return {
    ...payload,
    items,
    totalCount: items.length,
    totalPages: 1,
    page: 1,
  };
}

function priceMatchesProviderForModel(provider, mode) {
  const modelID = provider?.modelID || currentMarketplaceModelID();
  const detail = channelFreeStateForModelDetail(provider?.channel, modelID);
  if (mode === "free") rememberImplicitFreeModelPageContext(provider?.channel, modelID, detail);
  return mode === "free" ? detail.free === true : detail.free === false;
}

async function filterMarketplaceChannelItems(items, mode, search, input, init) {
  const checks = await Promise.all((items || []).map(async (item) =>
    priceMatchesMarketplaceChannel(item, mode, search, input, init).catch(() => {
      if (normalizePriceFilter(mode) === "free" && cleanMarketplaceSearch(search)) return false;
      return priceMatchesChannel(item, mode);
    }),
  ));
  return (items || []).filter((_, index) => checks[index]);
}

async function priceMatchesMarketplaceChannel(channel, mode, search, input, init) {
  if (normalizePriceFilter(mode) !== "free" || !search) return priceMatchesChannel(channel, mode);
  const freeState = await marketplaceChannelFreeStateForSearch(channel, search, input, init);
  return freeState === true;
}

async function marketplaceChannelFreeStateForSearch(channel, search, input, init) {
  const matchedModels = matchedSupportedModels(channel, search);
  if (!matchedModels.length) return marketplaceChannelFreeState(channel);
  if (!channel?.priceSummary?.hasPrices) return true;
  const prices = await loadChannelModelPrices(channel.id, input, init);
  if (!Array.isArray(prices)) return false;
  return matchedModels.some((modelID) => modelFreeInPriceRows(modelID, prices));
}

async function loadFilteredMarketplaceChannelsPayload(input, init, firstPayload, mode) {
  if (!Array.isArray(firstPayload?.items)) return firstPayload;
  const search = cleanMarketplaceSearch(marketplaceChannelsUrl(input).searchParams.get("search"));
  const first = marketplacePageSize(input, firstPayload);
  const targetPage = marketplacePageNumber(input, firstPayload);
  const needed = Math.max(first, targetPage * first);
  const items = [];
  let sourcePage = targetPage === 1 ? firstPayload : await fetchMarketplaceChannelsPage(input, init, 1);
  let pageNumber = marketplacePayloadPageNumber(sourcePage, input);
  let maxPages = Math.max(marketplacePayloadTotalPages(firstPayload), marketplacePayloadTotalPages(sourcePage));
  while (sourcePage && pageNumber <= maxPages) {
    items.push(...await filterMarketplaceChannelItems(sourcePage.items, mode, search, input, init));
    if (shouldStopMarketplacePriceScan(sourcePage.items, mode, search) || items.length >= needed || pageNumber >= maxPages) break;
    if (!Array.isArray(sourcePage.items) || sourcePage.items.length === 0) break;
    pageNumber += 1;
    sourcePage = await fetchMarketplaceChannelsPage(input, init, pageNumber);
    maxPages = Math.max(maxPages, marketplacePayloadTotalPages(sourcePage));
  }
  const pageItems = items.slice((targetPage - 1) * first, targetPage * first);
  const hasMore = pageNumber < maxPages && Array.isArray(sourcePage?.items) && sourcePage.items.length > 0;
  const filteredTotal = items.length + (hasMore ? 1 : 0);
  return {
    ...firstPayload,
    items: pageItems,
    page: targetPage,
    totalCount: filteredTotal,
    totalPages: Math.max(1, Math.ceil(filteredTotal / first)),
  };
}

function marketplacePageSize(input, payload) {
  const first = Number.parseInt(marketplaceChannelsUrl(input).searchParams.get("first") || "", 10);
  return Number.isFinite(first) && first > 0 ? first : Math.max(1, Number(payload?.items?.length) || 20);
}

function marketplacePageNumber(input, payload) {
  const page = Number.parseInt(marketplaceChannelsUrl(input).searchParams.get("page") || "", 10);
  return Number.isFinite(page) && page > 0 ? page : marketplacePayloadPageNumber(payload, input);
}

function marketplacePayloadPageNumber(payload, input) {
  const page = Number(payload?.page);
  if (Number.isFinite(page) && page > 0) return page;
  const urlPage = Number.parseInt(marketplaceChannelsUrl(input).searchParams.get("page") || "", 10);
  return Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1;
}

function marketplacePayloadTotalPages(payload) {
  const totalPages = Number(payload?.totalPages);
  if (Number.isFinite(totalPages) && totalPages > 0) return totalPages;
  return Array.isArray(payload?.items) && payload.items.length ? Number.MAX_SAFE_INTEGER : 1;
}

async function fetchMarketplaceChannelsPage(input, init, page) {
  const url = marketplaceChannelsScanUrl(requestUrl(input), currentPriceFilter(), page);
  const response = await nativeFetch(url, marketplaceChannelsFetchInit(input, init));
  return response.json();
}

function marketplaceChannelsScanUrl(url, mode, page) {
  const nextUrl = new URL(url, location.origin);
  nextUrl.searchParams.set("page", String(page));
  cleanMarketplaceSearchParam(nextUrl);
  if (normalizePriceFilter(mode) === "free") nextUrl.searchParams.set("sort", "multiplier_asc");
  return nextUrl;
}

function shouldStopMarketplacePriceScan(items, mode, search) {
  if (normalizePriceFilter(mode) !== "free") return false;
  if (cleanMarketplaceSearch(search)) return false;
  return (items || []).some((item) => marketplaceChannelFreeState(item) === false);
}

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

  function currentPriceFilter() {
    return selectedPriceFilter;
  }

  function currentMarketplaceModelID() {
    const match = location.pathname.match(/^\/marketplace\/models\/([^/?#]+)/);
    if (!match) return "";
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  function marketplaceModelIDFromPayload(payload) {
    return payload?.data?.marketplaceModel?.modelID || currentMarketplaceModelID();
  }

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

  function priceMatchesChannel(channel, mode) {
    const freeState = marketplaceChannelFreeState(channel);
    return mode === "free" ? freeState === true : freeState === false;
  }

  function priceMatchesProviderForModel(provider, mode) {
    const modelID = provider?.modelID || currentMarketplaceModelID();
    const detail = channelFreeStateForModelDetail(provider?.channel, modelID);
    if (mode === "free") rememberImplicitFreeModelPageContext(provider?.channel, modelID, detail);
    return mode === "free" ? detail.free === true : detail.free === false;
  }

  function marketplaceChannelFreeState(channel) {
    if (typeof channel?.priceSummary?.allFree === "boolean") return channel.priceSummary.allFree;
    return null;
  }

  function channelFreeStateForModelDetail(channel, modelID = "") {
    if (!Array.isArray(channel?.channelModelPrices)) return { free: true, reason: "missing_prices" };
    const prices = channel.channelModelPrices;
    if (prices.length === 0) return { free: true, reason: "empty_prices" };
    const normalizedModelID = normalizeModelID(modelID);
    if (!normalizedModelID) {
      return { free: prices.every((modelPrice) => modelPriceItemsFree(modelPrice?.price?.items)), reason: "all_models" };
    }
    const modelPrice = findModelPriceRow(prices, modelID);
    if (!modelPrice) return { free: true, reason: "implicit_missing_row" };
    return { free: modelPriceItemsFree(modelPrice?.price?.items), reason: "explicit_row" };
  }

  function rememberImplicitFreeModelPageContext(channel, modelID, detail) {
    if (detail.free === true && detail.reason === "implicit_missing_row" && channel?.id) {
      rememberModelPageImplicitFree(channel.id, modelID);
    }
  }

  function modelPriceItemsFree(items) {
    if (!Array.isArray(items) || items.length === 0) return false;
    return (items || []).every((item) => {
      const pricing = item?.pricing || {};
      return pricingFree(pricing)
        && (item?.promptWriteCacheVariants || []).every((variant) => pricingFree(variant?.pricing));
    });
  }

  function pricingFree(pricing) {
    if (!pricing) return false;
    if (pricing.mode === "flat_fee") return priceNumberFree(pricing.flatFee);
    if (pricing.mode === "usage_per_unit") return priceNumberFree(pricing.usagePerUnit);
    if (pricing.mode === "usage_tiered") {
      const tiers = pricing.usageTiered?.tiers || [];
      return tiers.length > 0 && tiers.every((tier) => priceNumberFree(tier?.pricePerUnit));
    }
    const values = [pricing.usagePerUnit, pricing.flatFee]
      .concat((pricing.usageTiered?.tiers || []).map((tier) => tier?.pricePerUnit))
      .map(parsePriceNumber)
      .filter((number) => number !== null);
    return values.length > 0 && values.every((number) => number <= 0);
  }

  function priceNumberFree(value) {
    const number = parsePriceNumber(value);
    return number !== null && number <= 0;
  }

  function parsePriceNumber(value) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : null;
  }

  function normalizeModelID(modelID) {
    return String(modelID || "").trim().toLowerCase();
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

  function matchedSupportedModels(channel, search) {
    const needle = normalizeModelID(search);
    if (!needle || !Array.isArray(channel?.supportedModels)) return [];
    return channel.supportedModels.filter((modelID) => normalizeModelID(modelID).includes(needle));
  }

  function modelFreeInPriceRows(modelID, prices) {
    const row = findModelPriceRow(prices, modelID);
    return row ? modelPriceItemsFree(row?.price?.items) : true;
  }

  function findModelPriceRow(prices, modelID) {
    const normalizedModelID = normalizeModelID(modelID);
    return (prices || []).find((price) => normalizeModelID(price?.modelID) === normalizedModelID) || null;
  }

  function modelPageImplicitFreeKey(channelID, modelID) {
    const channelKey = channelCacheKey(channelID), modelKey = normalizeModelID(modelID);
    return channelKey && modelKey ? `${channelKey}:${modelKey}` : "";
  }

  function rememberModelPageImplicitFree(channelID, modelID) {
    const key = modelPageImplicitFreeKey(channelID, modelID);
    if (!key) return;
    modelPageImplicitFreeCache.set(key, { channelID, modelID, pathname: location.pathname });
  }

  function hasModelPageImplicitFree(channelID, modelID) {
    const key = modelPageImplicitFreeKey(channelID, modelID);
    if (!key) return false;
    const record = modelPageImplicitFreeCache.get(key);
    return Boolean(record && record.pathname === location.pathname);
  }

  async function loadChannelModelPrices(channelID, input, init) {
    const cacheKey = channelCacheKey(channelID);
    if (!cacheKey) return [];
    if (channelModelPricesCache.has(cacheKey)) {
      const cached = channelModelPricesCache.get(cacheKey);
      if (cached && typeof cached.then === "function") return cached;
      if (Array.isArray(cached)) return cached;
      channelModelPricesCache.delete(cacheKey);
    }
    const request = graphqlWithRequestContext(
      queries.getChannelModelPrices,
      { id: channelGID(channelID) },
      "ChannelModelPrices",
      input,
      init,
    )
      .then((data) => data?.node?.channelModelPrices || [])
      .then((prices) => {
        cacheChannelModelPrices(channelID, prices);
        return prices;
      })
      .catch(() => {
        channelModelPricesCache.delete(cacheKey);
        return null;
      });
    channelModelPricesCache.set(cacheKey, request);
    return request;
  }

  async function graphqlWithRequestContext(query, variables = {}, operationName = undefined, input, init) {
    const request = typeof Request !== "undefined" && input instanceof Request ? input : null;
    const headers = new Headers(init?.headers || request?.headers || {});
    headers.set("content-type", "application/json");
    if (!headers.has("x-project-id")) headers.set("x-project-id", graphqlHeaders.projectID);
    if (!headers.has("authorization") && graphqlHeaders.authorization) headers.set("authorization", graphqlHeaders.authorization);
    const response = await nativeFetch(new URL(GRAPHQL_PATH, location.origin), {
      method: "POST",
      credentials: init?.credentials || request?.credentials || "same-origin",
      headers,
      body: JSON.stringify({ query, variables, operationName }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || `请求失败：${response.status}`);
    return payload.data;
  }

  function cacheChannelModelPrices(channelID, prices) {
    const cacheKey = channelCacheKey(channelID);
    if (!cacheKey || !Array.isArray(prices)) return;
    channelModelPricesCache.set(cacheKey, prices);
    const numericID = extractNumericChannelID(channelID);
    if (numericID) channelModelPricesCache.set(String(numericID), prices);
  }

  function channelCacheKey(channelID) {
    const numericID = extractNumericChannelID(channelID);
    return numericID ? String(numericID) : String(channelID || "");
  }

  function channelGID(channelID) {
    const numericID = extractNumericChannelID(channelID);
    return numericID ? `gid://axonhub/Channel/${numericID}` : String(channelID || "");
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

  function cleanMarketplaceSearchParam(url) {
    const search = cleanMarketplaceSearch(url.searchParams.get("search"));
    if (search) url.searchParams.set("search", search);
    else url.searchParams.delete("search");
  }

  function cleanMarketplaceSearch(value) {
    return String(value || "").replace(ZERO_WIDTH_RE, "").trim();
  }

  function cleanText(value) {
    return String(value || "").replace(WHITESPACE_RE, " ").trim();
  }

  function shouldStopMarketplacePriceScan(items, mode, search) {
    if (normalizePriceFilter(mode) !== "free") return false;
    if (cleanMarketplaceSearch(search)) return false;
    return (items || []).some((item) => marketplaceChannelFreeState(item) === false);
  }

  function marketplaceChannelsUrl(input) {
    return new URL(requestUrl(input), location.origin);
  }

  function marketplaceChannelsFetchInit(input, init) {
    const request = typeof Request !== "undefined" && input instanceof Request ? input : null;
    const method = init?.method || request?.method || "GET";
    const nextInit = {
      ...init,
      method,
      credentials: init?.credentials || request?.credentials || "same-origin",
      headers: init?.headers || request?.headers,
    };
    if (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") delete nextInit.body;
    return nextInit;
  }

  function extractNumericChannelID(channelID) {
    if (typeof channelID === "number") return Number.isFinite(channelID) ? channelID : null;
    const text = String(channelID || "");
    if (/^\d+$/.test(text)) return Number(text);
    const match = text.match(/^gid:\/\/axonhub\/Channel\/(\d+)$/);
    return match ? Number(match[1]) : null;
  }

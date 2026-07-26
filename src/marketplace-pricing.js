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

function channelCacheKey(channelID) {
  const numericID = extractNumericChannelID(channelID);
  return numericID ? String(numericID) : String(channelID || "");
}

function channelGID(channelID) {
  const numericID = extractNumericChannelID(channelID);
  return numericID ? `gid://axonhub/Channel/${numericID}` : String(channelID || "");
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

function normalizePriceFilter(value) {
  return value === "free" || value === "paid" ? value : "all";
}

function priceMatchesChannel(channel, mode) {
  const freeState = marketplaceChannelFreeState(channel);
  return priceStateMatches(freeState, mode);
}

function priceStateMatches(freeState, mode) {
  return mode === "free" ? freeState === true : freeState === false;
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

function modelPriceItemsFree(items) {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every((item) => {
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

function rememberImplicitFreeModelPageContext(channel, modelID, detail) {
  if (detail.free === true && detail.reason === "implicit_missing_row" && channel?.id) {
    rememberModelPageImplicitFree(channel.id, modelID);
  }
}

function modelPageImplicitFreeKey(channelID, modelID) {
  const channelKey = channelCacheKey(channelID);
  const modelKey = normalizeModelID(modelID);
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

function cacheChannelModelPrices(channelID, prices) {
  const cacheKey = channelCacheKey(channelID);
  if (!cacheKey || !Array.isArray(prices)) return;
  channelModelPricesCache.set(cacheKey, prices);
}

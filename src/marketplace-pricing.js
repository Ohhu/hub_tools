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

function currentSelectedModelID() {
  return selectedMarketplaceModelID && selectedMarketplaceModelID !== MODEL_ID_ALL_VALUE
    ? selectedMarketplaceModelID
    : currentMarketplaceModelID();
}

function isModelIDFilterAll() {
  return selectedMarketplaceModelID === MODEL_ID_ALL_VALUE;
}

function providerServesModelID(channel, modelID) {
  const supportedModels = Array.isArray(channel?.supportedModels) ? channel.supportedModels : null;
  const prices = Array.isArray(channel?.channelModelPrices) ? channel.channelModelPrices : null;
  const target = normalizeModelID(modelID);
  if (supportedModels?.some((id) => normalizeModelID(id) === target)) return true;
  if (prices?.some((row) => normalizeModelID(row?.modelID) === target)) return true;
  if (supportedModels && supportedModels.length > 0) return false;
  return true;
}

function buildMarketplaceModelIDOptions(providers, pageModelID) {
  const normalizedPageModelID = normalizeModelID(pageModelID);
  if (!normalizedPageModelID || !Array.isArray(providers)) return [];
  const mentions = new Map();
  for (const provider of providers) {
    const channel = provider?.channel || {};
    const seen = new Set();
    for (const id of channel.supportedModels || []) seen.add(id);
    for (const row of channel.channelModelPrices || []) seen.add(row?.modelID);
    for (const id of seen) {
      const kind = modelIDVariantKind(id, normalizedPageModelID);
      if (!kind) continue;
      const key = normalizeModelID(id);
      const entry = mentions.get(key) || { value: String(id), kind, count: 0 };
      entry.count += 1;
      mentions.set(key, entry);
    }
  }
  const kindOrder = { exact: 0, prefixed: 1, dated: 2 };
  const options = [...mentions.entries()].map(([key, entry]) => ({
    key,
    value: kindOrder[entry.kind] === 0 ? pageModelID : entry.value,
    kind: entry.kind,
    serves: providers.filter((provider) => providerServesModelID(provider?.channel, key)).length,
  }));
  options.sort((a, b) =>
    (b.serves - a.serves)
    || (kindOrder[a.kind] - kindOrder[b.kind])
    || a.key.localeCompare(b.key),
  );
  return options;
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

function channelIsOfficial(channel) {
  if (typeof channel?.usesOfficialBaseURL === "boolean") return channel.usesOfficialBaseURL;
  if (Array.isArray(channel?.tags)) {
    if (channel.tags.some((tag) => tag === "official" || tag === "official:true")) return true;
    if (channel.tags.includes("official:false")) return false;
  }
  if (typeof channel?.official === "boolean") return channel.official;
  return false;
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
  if (!normalizedModelID) return null;
  const rows = Array.isArray(prices) ? prices : [];
  for (const kind of MODEL_PRICE_ROW_MATCH_KINDS) {
    const row = rows.find((price) => modelPriceRowMatchKind(price, normalizedModelID) === kind);
    if (row) return row;
  }
  return null;
}

function hasModelPriceRowFor(prices, modelID) {
  return Boolean(findModelPriceRow(prices, modelID));
}

function modelPriceRowMatchKind(price, normalizedModelID) {
  return modelIDVariantKind(price?.modelID, normalizedModelID);
}

function modelIDVariantKind(candidateID, normalizedModelID) {
  const candidate = normalizeModelID(candidateID);
  if (!candidate || !normalizedModelID) return "";
  if (candidate === normalizedModelID) return "exact";
  if (candidate.endsWith(`/${normalizedModelID}`)) return "prefixed";
  if (modelDatedVariantRE(normalizedModelID).test(candidate)) return "dated";
  return "";
}

function modelDatedVariantRE(normalizedModelID) {
  let pattern = modelDatedVariantRECache.get(normalizedModelID);
  if (!pattern) {
    const escaped = normalizedModelID.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    pattern = new RegExp(`^${escaped}-\\d{3,4}$`);
    modelDatedVariantRECache.set(normalizedModelID, pattern);
  }
  return pattern;
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

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

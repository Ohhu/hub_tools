function findDirectReactChannel(node) {
  for (const key of Object.keys(node || {})) {
    if (key.startsWith("__reactProps$")) {
      const channel = pickReactChannel(node[key]);
      if (channel) return channel;
    } else if (key.startsWith("__reactFiber$")) {
      const channel = findChannelInFiber(node[key]);
      if (channel) return channel;
    }
  }
  return null;
}

function findChannelInFiber(fiber) {
  let current = fiber;
  for (let depth = 0; current && depth < REACT_FIBER_CHANNEL_LOOKUP_LIMIT; depth += 1, current = current.return) {
    const channel = pickReactChannel(current.memoizedProps) || pickReactChannel(current.pendingProps);
    if (channel) return channel;
  }
  return null;
}

function pickReactChannel(props) {
  if (!props || typeof props !== "object" || Array.isArray(props)) return null;
  if (isChannelObject(props)) return props;
  for (const key of ["channel", "node", "data", "item", "row"]) {
    if (isChannelObject(props[key])) return props[key];
  }
  return null;
}

function knownPayloadChannels(payload) {
  const channels = [];
  if (Array.isArray(payload?.items)) channels.push(...payload.items);
  if (Array.isArray(payload?.data?.marketplaceModel?.providers)) {
    channels.push(...payload.data.marketplaceModel.providers.map((provider) => provider?.channel).filter(Boolean));
  }
  if (Array.isArray(payload?.data?.channels?.edges)) {
    channels.push(...payload.data.channels.edges.map((edge) => edge?.node).filter(Boolean));
  }
  if (payload?.data?.node) channels.push(payload.data.node);
  return channels.filter(isChannelObject);
}

  function findCachedChannel(name) {
    return channelNameCache.get(cleanText(name));
  }

  function findCachedChannelByID(channelID) {
    const cacheKey = channelCacheKey(channelID);
    return cacheKey ? channelCache.get(cacheKey) : null;
  }

  function updateTriggerChannel(trigger, channel) {
    trigger.dataset.channelName = channel.name;
    if (channel.id) trigger.dataset.channelId = channel.id;
    else delete trigger.dataset.channelId;
  }

  function isChannelObject(value) {
    if (!value?.id || !value?.name) return false;
    if (value.__typename === "Channel") return true;
    if (!extractNumericChannelID(value.id)) return false;
    return "supportedModels" in value
      || "channelTags" in value
      || "pricing" in value
      || "provider" in value
      || "type" in value;
  }

  function rememberChannelsFromPayload(payload, seen = new Set(), depth = 0) {
    if (!payload || typeof payload !== "object" || seen.has(payload)) return false;
    const directChannels = knownPayloadChannels(payload);
    if (directChannels.length) return rememberChannelList(directChannels);
    if (depth >= 4) return false;
    if (Array.isArray(payload)) {
      return rememberChannelList(payload) || payload.some((item) => rememberChannelsFromPayload(item, seen, depth + 1));
    }
    seen.add(payload);
    let changed = false;
    if (isChannelObject(payload)) changed = rememberChannel(payload) || changed;
    for (const child of Object.values(payload)) changed = rememberChannelsFromPayload(child, seen, depth + 1) || changed;
    return changed;
  }

  function rememberChannelList(channels) {
    let changed = false;
    for (const channel of channels || []) {
      if (isChannelObject(channel)) changed = rememberChannel(channel) || changed;
    }
    return changed;
  }

  function rememberModelProviderPricesFromPayload(payload) {
    const modelID = marketplaceModelIDFromPayload(payload);
    const providers = payload?.data?.marketplaceModel?.providers;
    if (!modelID || !Array.isArray(providers)) return;
    for (const provider of providers) {
      const channel = provider?.channel;
      if (!channel?.id) continue;
      const providerModelID = provider?.modelID || modelID;
      const detail = channelFreeStateForModelDetail(channel, providerModelID);
      rememberImplicitFreeModelPageContext(channel, providerModelID, detail);
      const cacheKey = modelProviderCacheKey(channel.id, modelID);
      modelProviderPriceCache.set(cacheKey, detail.free);
      modelProviderOfficialCache.set(cacheKey, channelIsOfficial(channel));
      modelProviderServedCache.set(channelCacheKey(channel.id), {
        supportedModels: Array.isArray(channel.supportedModels) ? channel.supportedModels : null,
        channelModelPrices: Array.isArray(channel.channelModelPrices) ? channel.channelModelPrices : null,
      });
    }
    replaceMarketplaceModelIDOptions(buildMarketplaceModelIDOptions(providers, modelID));
  }

  function replaceMarketplaceModelIDOptions(options) {
    const signature = JSON.stringify(options);
    if (marketplaceModelIDOptions.__signature === signature) return;
    marketplaceModelIDOptions.__signature = signature;
    marketplaceModelIDOptions.length = 0;
    marketplaceModelIDOptions.push(...options);
    syncModelIDFilterField(document.getElementById(MODEL_ID_FIELD_ID));
  }

  function modelProviderFreeState(channel) {
    if (!channel?.id) return null;
    const modelID = currentSelectedModelID();
    const key = modelProviderCacheKey(channel.id, modelID);
    if (modelProviderPriceCache.has(key)) return modelProviderPriceCache.get(key);
    const served = modelProviderServedCache.get(channelCacheKey(channel.id));
    if (!served) return null;
    return channelFreeStateForModelDetail(served, modelID).free;
  }

  function providerServesSelectedModelID(channel) {
    if (!channel?.id) return true;
    const served = modelProviderServedCache.get(channelCacheKey(channel.id));
    if (!served) return true;
    return providerServesModelID(served, currentSelectedModelID());
  }

  function modelProviderOfficialState(channel) {
    if (!channel?.id) return null;
    const key = modelProviderCacheKey(channel.id, currentMarketplaceModelID());
    return modelProviderOfficialCache.has(key) ? modelProviderOfficialCache.get(key) : null;
  }

  function modelProviderCacheKey(channelID, modelID) {
    return `${channelCacheKey(channelID)}:${normalizeModelID(modelID)}`;
  }

  function rememberChannel(channel) {
    if (!channel?.id || !channel?.name) return false;
    const item = {
      id: String(channel.id),
      name: String(channel.name),
      type: channel.type,
      usesOfficialBaseURL: channel.usesOfficialBaseURL,
      supportedModels: Array.isArray(channel.supportedModels) ? channel.supportedModels.slice() : undefined,
      priceSummary: channel.priceSummary,
    };
    const existing = channelCache.get(item.id);
    if (existing) {
      item.type ??= existing.type;
      item.usesOfficialBaseURL ??= existing.usesOfficialBaseURL;
      item.supportedModels ??= existing.supportedModels;
      item.priceSummary ??= existing.priceSummary;
      if (existing.name === item.name
        && existing.type === item.type
        && existing.usesOfficialBaseURL === item.usesOfficialBaseURL
        && sameStringArray(existing.supportedModels, item.supportedModels)
        && sameJsonValue(existing.priceSummary, item.priceSummary)) return false;
    }
    channelCache.set(item.id, item);
    const numericID = extractNumericChannelID(item.id);
    if (numericID) channelCache.set(String(numericID), item);
    channelNameCache.set(cleanText(item.name), item);
    return true;
  }

  function sameStringArray(left, right) {
    if (left === right) return true;
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((value, index) => value === right[index]);
  }

  function sameJsonValue(left, right) {
    if (left === right) return true;
    if (left == null || right == null) return left == null && right == null;
    try {
      return JSON.stringify(left) === JSON.stringify(right);
    } catch {
      return false;
    }
  }

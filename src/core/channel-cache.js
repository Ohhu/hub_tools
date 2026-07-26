  function findCachedChannel(name) {
    return channelNameCache.get(normalizeChannelName(name));
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
    }
  }

  function modelProviderFreeState(channel) {
    if (!channel?.id) return null;
    const key = modelProviderCacheKey(channel.id, currentMarketplaceModelID());
    return modelProviderPriceCache.has(key) ? modelProviderPriceCache.get(key) : null;
  }

  function modelProviderCacheKey(channelID, modelID) {
    const numericID = extractNumericChannelID(channelID);
    return `${numericID || String(channelID || "")}:${normalizeModelID(modelID)}`;
  }

  function rememberChannel(channel) {
    if (!channel?.id || !channel?.name) return false;
    const item = {
      id: String(channel.id),
      name: String(channel.name),
      type: channel.type,
      supportedModels: Array.isArray(channel.supportedModels) ? channel.supportedModels.slice() : undefined,
      priceSummary: channel.priceSummary,
    };
    const existing = channelCache.get(item.id);
    if (existing) {
      item.type ??= existing.type;
      item.supportedModels ??= existing.supportedModels;
      item.priceSummary ??= existing.priceSummary;
      if (existing.name === item.name
        && existing.type === item.type
        && sameStringArray(existing.supportedModels, item.supportedModels)
        && sameJsonValue(existing.priceSummary, item.priceSummary)) return false;
    }
    channelCache.set(item.id, item);
    const numericID = extractNumericChannelID(item.id);
    if (numericID) channelCache.set(String(numericID), item);
    channelNameCache.set(normalizeChannelName(item.name), item);
    return true;
  }

  function normalizeChannelName(name) {
    return cleanText(name);
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

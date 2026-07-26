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

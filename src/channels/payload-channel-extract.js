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

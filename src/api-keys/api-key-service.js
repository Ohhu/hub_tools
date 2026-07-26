async function loadMissingChannelNames(channelIDs) {
  const missingIDs = uniqueChannelIDs(channelIDs)
    .filter((id) => !channelCache.has(String(id)))
    .slice(0, CHANNEL_NAME_LOOKUP_LIMIT);
  const results = await Promise.all(missingIDs.map((id) => loadChannelName(id).catch(() => null)));
  return results.filter(Boolean).length;
}

async function loadChannelName(channelID) {
  const numericID = extractNumericChannelID(channelID);
  if (!numericID) return null;
  if (channelCache.has(String(numericID))) return channelCache.get(String(numericID));
  if (channelNameRequestCache.has(numericID)) return channelNameRequestCache.get(numericID);
  const request = graphql(
    queries.getChannelName,
    { id: channelGID(numericID) },
    "GetChannelName",
  ).then((data) => {
    const channel = data?.node;
    if (channel?.id && channel?.name) {
      rememberChannel(channel);
      return channelCache.get(String(numericID)) || channel;
    }
    return null;
  }).finally(() => {
    channelNameRequestCache.delete(numericID);
  });
  channelNameRequestCache.set(numericID, request);
  return request;
}

async function loadMe() {
  if (meCache) return meCache;
  const data = await graphql(queries.me, {}, "Me");
  meCache = data.me;
  return meCache;
}

async function loadKeys(force = false) {
  if (keysCache.length && !force) {
    renderKeyOptions();
    return keysCache;
  }
  setStatus("正在加载 API Key");
  const userID = (await loadMe())?.id;
  if (!userID) throw new Error("未读取到当前用户 ID");
  const keys = [];
  let after = null;
  do {
    const data = await graphql(queries.getKeys, {
      first: 100,
      after,
      where: { statusIn: ["enabled", "disabled"], userID, typeNotIn: ["noauth"] },
      orderBy: { field: "CREATED_AT", direction: "DESC" },
    }, "GetApiKeys");
    const page = data.apiKeys;
    keys.push(...(page?.edges || []).map((edge) => edge.node).filter(Boolean));
    after = page?.pageInfo?.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  keysCache = keys;
  renderKeyOptions();
  setStatus(keys.length ? "" : "没有可用 API Key");
  return keys;
}

async function createKey(name) {
  const data = await graphql(queries.createKey, { input: { name, type: "user", projectID: graphqlHeaders.projectID } }, "CreateAPIKey");
  return data.createAPIKey;
}


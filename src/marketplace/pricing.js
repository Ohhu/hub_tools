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

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

function shouldStopMarketplacePriceScan(items, mode, search) {
  if (normalizePriceFilter(mode) !== "free") return false;
  if (cleanMarketplaceSearch(search)) return false;
  return (items || []).some((item) => marketplaceChannelFreeState(item) === false);
}

// ==UserScript==
// @name         LinuxDo Hub Tool
// @namespace    https://hub.linux.do/
// @version      0.3.2
// @description  在 LinuxDo Hub 中快捷管理 API Key 渠道绑定，并支持资源市场免费筛选
// @author       vsiu
// @license      GPL-3.0-only
// @icon         https://hub.linux.do/favicon
// @match        https://hub.linux.do/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const GRAPHQL_PATH = "/admin/graphql";
  const PROJECT_ID = "gid://axonhub/Project/1";
  const PANEL_ID = "linuxdo-hub-tool", TRIGGER_CLASS = `${PANEL_ID}-trigger`;
  const REQUEST_TRIGGER_CLASS = `${PANEL_ID}-request-trigger`;
  const DIALOG_ID = `${PANEL_ID}-dialog`;
  const PRICE_FIELD_ID = `${PANEL_ID}-price-field`;
  const CHANNEL_NAME_LOOKUP_LIMIT = 20;
  const REACT_FIBER_CHANNEL_LOOKUP_LIMIT = 8;
  const IMPLICIT_FREE_PRICE_LIMIT = 50;
  const IMPLICIT_FREE_PRICE_ROW_PREFIX = "implicit-free";
  const ZERO_WIDTH_RE = /[\u200b-\u200d\ufeff]/g;
  const WHITESPACE_RE = /\s+/g;
  const CREATE_API_KEY_RE = /创建\s*API\s*密钥|Create\s*API\s*Key/i;
  const HAS_FLAT_FEE_RE = /flatFee\b/;
  const HAS_MODE_RE = /\bmode\b/;
  const HTML_ESCAPE_RE = /[&<>"']/g;
  const HTML_ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
  const nativeFetch = window.fetch.bind(window);
  const graphqlHeaders = { authorization: "", projectID: PROJECT_ID };
  const channelCache = new Map(), channelNameCache = new Map();
  const channelNameRequestCache = new Map();
  const modelProviderPriceCache = new Map();
  const channelModelPricesCache = new Map();
  const modelPageImplicitFreeCache = new Map();
  const requestBodyTextCache = new WeakMap();
  let meCache = null, keysCache = [], selectedKeyID = "", mountTimer = 0;
  let selectedPriceFilter = "all";
  let createdKeyValueCache = "";
  let lastMarketplaceChannelsFetchAt = 0;
  let editChannelIDs = [];
  let editLoadToken = 0;
  let editDirty = false;
  let lastPathname = location.pathname;

  const queries = {
    createKey: "mutation CreateAPIKey($input:CreateAPIKeyInput!){createAPIKey(input:$input){id key name status type}}",
    getKeys: "query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id name}cursor}pageInfo{hasNextPage endCursor}totalCount}}",
    getKey: "query GetApiKey($id:ID!){node(id:$id){... on APIKey{id name status profiles{activeProfile profiles{name modelMappings{from to} channelIDs channelTags channelTagsMatchMode modelIDs loadBalanceStrategy channelBindingMode dynamicChannelStrategy{mode maxChannels minChannels maxPriceMultiplier maxLatencyMs minSuccessRate onlyOfficial includeTags excludeTags excludeChannelIDs fallbackChannelIDs} quota{requests totalTokens cost period{type pastDuration{value unit} calendarDuration{unit}}}}}}}}",
    getKeyValue: "query GetApiKeyValue($id:ID!){node(id:$id){... on APIKey{id key}}}",
    getChannelName: "query GetChannelName($id:ID!){node(id:$id){... on Channel{id name}}}",
    getChannelModelPrices: "query ChannelModelPrices($id:ID!){node(id:$id){... on Channel{id channelModelPrices{id modelID price{items{itemCode multiplier pricing{mode flatFee usagePerUnit usageTiered{tiers{upTo pricePerUnit}}} promptWriteCacheVariants{variantCode pricing{mode flatFee usagePerUnit}}}}}}}}",
    updateProfiles: "mutation UpdateAPIKeyProfiles($id:ID!,$input:UpdateAPIKeyProfilesInput!){updateAPIKeyProfiles(id:$id,input:$input){id name status profiles{activeProfile profiles{name channelIDs channelBindingMode}}}}",
    me: "query Me{me{id projects{projectID}}}",
  };

  window.fetch = async function patchedFetch(input, init) {
    const sanitizedRequest = sanitizeMarketplaceChannelsRequest(input, init);
    await rememberRequestBodyText(sanitizedRequest.input, sanitizedRequest.init);
    const nextRequest = await withMarketplaceModelPricingFields(sanitizedRequest.input, sanitizedRequest.init);
    if (isMarketplaceChannelsUrl(requestUrl(nextRequest.input))) lastMarketplaceChannelsFetchAt = Date.now();
    rememberRequestHeaders(nextRequest.input, nextRequest.init);
    const response = await nativeFetch(nextRequest.input, nextRequest.init);
    rememberGraphqlContext(nextRequest.input, nextRequest.init);
    rememberResponseChannels(response);
    schedulePanel();
    return wrapMarketplaceChannelsResponse(nextRequest.input, nextRequest.init, response);
  };

  function sanitizeMarketplaceChannelsRequest(input, init) {
    if (!isMarketplaceChannelsUrl(requestUrl(input))) return { input, init };
    const url = marketplaceChannelsUrl(input);
    cleanMarketplaceSearchParam(url);
    if (typeof input === "string" || input instanceof URL) return { input: url, init };
    if (typeof Request !== "undefined" && input instanceof Request) return { input: new Request(url, input), init };
    return { input, init };
  }

  function rememberGraphqlContext(input, init) {
    const url = typeof input === "string" ? input : input?.url;
    if (!String(url || "").includes(GRAPHQL_PATH)) return;
    rememberGraphqlHeaders(input, init);
  }

  function rememberRequestHeaders(input, init) {
    const url = requestUrl(input);
    const path = String(url || "").replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
    if (!path.startsWith("/admin/")) return;
    rememberGraphqlHeaders(input, init);
  }

  function rememberGraphqlHeaders(input, init) {
    const headers = new Headers(init?.headers || input?.headers || {});
    const auth = headers.get("authorization"), projectID = headers.get("x-project-id");
    if (auth) graphqlHeaders.authorization = auth;
    if (projectID) graphqlHeaders.projectID = projectID;
  }

  function rememberResponseChannels(response) {
    const type = response?.headers?.get?.("content-type") || "";
    if (!type.includes("application/json")) return;
    response.clone().json().then((payload) => {
      const changed = rememberChannelsFromPayload(payload);
      rememberModelProviderPricesFromPayload(payload);
      if (changed) schedulePanel();
    }).catch(() => {});
  }

  function wrapMarketplaceChannelsResponse(input, init, response) {
    if (!shouldFilterMarketplaceResponse(input, init, response)) return response;
    return new Proxy(response, {
      get(target, prop) {
        if (prop === "json") {
          return async () => filterMarketplaceResponseJson(input, init, target, currentPriceFilter());
        }
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  }

  async function filterMarketplaceResponseJson(input, init, response, price) {
    const payload = await response.clone().json();
    if (isGraphqlChannelModelPricesRequest(input, init, response)) {
      return augmentChannelModelPricesPayload(input, init, payload);
    }
    const mode = normalizePriceFilter(price);
    if (mode === "all") return payload;
    if (isMarketplaceChannelsUrl(requestUrl(input))) {
      const filteredPayload = await loadFilteredMarketplaceChannelsPayload(input, init, payload, mode);
      rememberChannelsFromPayload(filteredPayload);
      return filteredPayload;
    }
    const filteredPayload = await filterMarketplacePayloadByPrice(payload, mode);
    rememberChannelsFromPayload(filteredPayload);
    return filteredPayload;
  }

  function shouldFilterMarketplaceResponse(input, init, response) {
    if (isMarketplaceChannelsUrl(requestUrl(input))) return true;
    return isGraphqlMarketplaceModelRequest(input, init, response)
      || isGraphqlChannelModelPricesRequest(input, init, response);
  }

  function isMarketplaceChannelsUrl(url) {
    const value = String(url || "");
    const path = value.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
    return path === "/admin/marketplace/channels";
  }

  function isGraphqlMarketplaceModelRequest(input, init, response) {
    const path = requestUrl(input).replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
    if (path !== GRAPHQL_PATH) return false;
    if (!location.pathname.startsWith("/marketplace/models/")) return false;
    if (response?.headers?.get?.("content-type") && !response.headers.get("content-type").includes("application/json")) return false;
    const body = requestBodyText(input, init);
    return body.includes("MarketplaceModel") || body.includes("marketplaceModel");
  }

  function isGraphqlChannelModelPricesRequest(input, init, response) {
    const path = requestUrl(input).replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
    if (path !== GRAPHQL_PATH) return false;
    if (!location.pathname.startsWith("/marketplace")) return false;
    if (response?.headers?.get?.("content-type") && !response.headers.get("content-type").includes("application/json")) return false;
    const body = requestBodyText(input, init);
    const operationName = graphqlOperationName(body);
    return operationName === "ChannelModelPrices"
      || /query\s+ChannelModelPrices\b/.test(body);
  }

  function graphqlOperationName(bodyText) {
    try {
      return JSON.parse(String(bodyText || "")).operationName || "";
    } catch {
      return "";
    }
  }

  function requestUrl(input) {
    if (input instanceof URL) return input.toString();
    return String(typeof input === "string" ? input : input?.url || "");
  }

  async function rememberRequestBodyText(input, init) {
    await readRequestBodyText(input, init);
  }

  async function readRequestBodyText(input, init) {
    if (init && Object.prototype.hasOwnProperty.call(init, "body")) return bodyValueText(init.body);
    if (typeof Request !== "undefined" && input instanceof Request) {
      if (requestBodyTextCache.has(input)) return requestBodyTextCache.get(input);
      try {
        const text = await input.clone().text();
        requestBodyTextCache.set(input, text);
        return text;
      } catch {
        requestBodyTextCache.set(input, "");
        return "";
      }
    }
    return requestBodyText(input, init);
  }

  function requestBodyText(input, init) {
    if (init && Object.prototype.hasOwnProperty.call(init, "body")) return bodyValueText(init.body);
    if (typeof Request !== "undefined" && input instanceof Request) return requestBodyTextCache.get(input) || "";
    return bodyValueText(input?.body ?? "");
  }

  function bodyValueText(value) {
    if (typeof value === "string") return value;
    if (value == null) return "";
    if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) return value.toString();
    if (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) return "";
    return String(value);
  }

  async function withMarketplaceModelPricingFields(input, init) {
    const bodyText = await readRequestBodyText(input, init);
    if (!isMarketplaceModelRequestBody(bodyText)) return { input, init };
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return { input, init };
    }
    const query = ensurePricingFields(body.query);
    if (query === body.query) return { input, init };
    const nextInit = {
      ...init,
      body: JSON.stringify({ ...body, query }),
    };
    return { input, init: nextInit };
  }

  function isMarketplaceModelRequestBody(bodyText) {
    const text = String(bodyText || "");
    return text.includes("MarketplaceModel") || text.includes("marketplaceModel");
  }

  function ensurePricingFields(query) {
    if (!query) return query;
    const text = String(query);
    let output = "", cursor = 0, changed = false;
    const pricingStartRe = /pricing\s*\{/g;
    for (let match; (match = pricingStartRe.exec(text));) {
      const openIndex = text.indexOf("{", match.index);
      const closeIndex = findMatchingBrace(text, openIndex);
      if (openIndex < 0 || closeIndex < 0) break;
      const block = text.slice(match.index, closeIndex + 1);
      const inner = text.slice(openIndex + 1, closeIndex);
      output += text.slice(cursor, match.index);
      if (!/\busagePerUnit\b/.test(inner)) {
        output += block;
      } else {
        const additions = [
          HAS_MODE_RE.test(inner) ? "" : "\n          mode",
          HAS_FLAT_FEE_RE.test(inner) ? "" : "\n          flatFee",
        ].join("");
        output += `${text.slice(match.index, openIndex + 1)}${additions}${inner}}`;
        changed = changed || Boolean(additions);
      }
      cursor = closeIndex + 1;
      pricingStartRe.lastIndex = closeIndex + 1;
    }
    output += text.slice(cursor);
    return changed ? output : query;
  }

  function findMatchingBrace(text, openIndex) {
    if (openIndex < 0 || text[openIndex] !== "{") return -1;
    let depth = 0;
    for (let index = openIndex; index < text.length; index += 1) {
      if (text[index] === "{") depth += 1;
      else if (text[index] === "}") {
        depth -= 1;
        if (depth === 0) return index;
      }
    }
    return -1;
  }

  function normalizePriceFilter(value) {
    return value === "free" || value === "paid" ? value : "all";
  }

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

  function priceMatchesChannel(channel, mode) {
    const freeState = marketplaceChannelFreeState(channel);
    return mode === "free" ? freeState === true : freeState === false;
  }

  function priceMatchesProviderForModel(provider, mode) {
    const modelID = provider?.modelID || currentMarketplaceModelID();
    const detail = channelFreeStateForModelDetail(provider?.channel, modelID);
    if (mode === "free") rememberImplicitFreeModelPageContext(provider?.channel, modelID, detail);
    return mode === "free" ? detail.free === true : detail.free === false;
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

  function rememberImplicitFreeModelPageContext(channel, modelID, detail) {
    if (detail.free === true && detail.reason === "implicit_missing_row" && channel?.id) {
      rememberModelPageImplicitFree(channel.id, modelID);
    }
  }

  function modelPriceItemsFree(items) {
    if (!Array.isArray(items) || items.length === 0) return false;
    return (items || []).every((item) => {
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

  function modelPageImplicitFreeKey(channelID, modelID) {
    const channelKey = channelCacheKey(channelID), modelKey = normalizeModelID(modelID);
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

  async function graphqlWithRequestContext(query, variables = {}, operationName = undefined, input, init) {
    const request = typeof Request !== "undefined" && input instanceof Request ? input : null;
    const headers = new Headers(init?.headers || request?.headers || {});
    headers.set("content-type", "application/json");
    if (!headers.has("x-project-id")) headers.set("x-project-id", graphqlHeaders.projectID);
    if (!headers.has("authorization") && graphqlHeaders.authorization) headers.set("authorization", graphqlHeaders.authorization);
    const response = await nativeFetch(new URL(GRAPHQL_PATH, location.origin), {
      method: "POST",
      credentials: init?.credentials || request?.credentials || "same-origin",
      headers,
      body: JSON.stringify({ query, variables, operationName }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || `请求失败：${response.status}`);
    return payload.data;
  }

  function cacheChannelModelPrices(channelID, prices) {
    const cacheKey = channelCacheKey(channelID);
    if (!cacheKey || !Array.isArray(prices)) return;
    channelModelPricesCache.set(cacheKey, prices);
    const numericID = extractNumericChannelID(channelID);
    if (numericID) channelModelPricesCache.set(String(numericID), prices);
  }

  function channelCacheKey(channelID) {
    const numericID = extractNumericChannelID(channelID);
    return numericID ? String(numericID) : String(channelID || "");
  }

  function channelGID(channelID) {
    const numericID = extractNumericChannelID(channelID);
    return numericID ? `gid://axonhub/Channel/${numericID}` : String(channelID || "");
  }

  function augmentChannelModelPricesPayload(input, init, payload) {
    const channel = payload?.data?.node;
    const prices = channel?.channelModelPrices;
    if (!channel?.id || !Array.isArray(prices)) return payload;
    cacheChannelModelPrices(channel.id, prices);
    const implicitRows = implicitFreePriceRowsForCurrentContext(channel.id, prices);
    if (!implicitRows.length) return payload;
    return {
      ...payload,
      data: {
        ...payload.data,
        node: {
          ...channel,
          channelModelPrices: [...implicitRows, ...prices],
        },
      },
    };
  }

  function implicitFreePriceRowsForCurrentContext(channelID, prices) {
    return [
      ...implicitFreePriceRowsForCurrentSearch(channelID, prices),
      ...implicitFreePriceRowsForCurrentModelPage(channelID, prices),
    ];
  }

  function implicitFreePriceRowsForCurrentSearch(channelID, prices) {
    const search = cleanMarketplaceSearch(findMarketplaceSearchInput()?.value);
    if (!search) return [];
    const channel = findCachedChannelByID(channelID);
    if (!channel?.priceSummary?.hasPrices) return [];
    const supportedModels = matchedSupportedModels(channel, search);
    if (!supportedModels.length) return [];
    const existing = existingModelPriceIDSet(prices);
    return supportedModels
      .filter((modelID) => !existing.has(normalizeModelID(modelID)))
      .slice(0, IMPLICIT_FREE_PRICE_LIMIT)
      .map((modelID) => createImplicitFreePriceRow(channelID, modelID));
  }

  function implicitFreePriceRowsForCurrentModelPage(channelID, prices) {
    if (!location.pathname.startsWith("/marketplace/models/")) return [];
    if (currentPriceFilter() !== "free") return [];
    const modelID = currentMarketplaceModelID();
    if (!modelID || !hasModelPageImplicitFree(channelID, modelID)) return [];
    const existing = existingModelPriceIDSet(prices);
    return existing.has(normalizeModelID(modelID)) ? [] : [createImplicitFreePriceRow(channelID, modelID)];
  }

  function existingModelPriceIDSet(prices) {
    return new Set((prices || []).map((price) => normalizeModelID(price?.modelID)).filter(Boolean));
  }

  function createImplicitFreePriceRow(channelID, modelID) {
    return {
      id: `${IMPLICIT_FREE_PRICE_ROW_PREFIX}:${channelCacheKey(channelID)}:${modelID}`,
      modelID,
      price: {
        items: [
          createZeroPriceItem("prompt_tokens"),
          createZeroPriceItem("completion_tokens"),
        ],
      },
    };
  }

  function createZeroPriceItem(itemCode) {
    return {
      itemCode,
      multiplier: 0,
      pricing: {
        mode: "usage_per_unit",
        flatFee: 0,
        usagePerUnit: 0,
        usageTiered: { tiers: [] },
      },
      promptWriteCacheVariants: [],
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

  function shouldStopMarketplacePriceScan(items, mode, search) {
    if (normalizePriceFilter(mode) !== "free") return false;
    if (cleanMarketplaceSearch(search)) return false;
    return (items || []).some((item) => marketplaceChannelFreeState(item) === false);
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

  function schedulePanel() {
    if (!isTargetRoute()) return;
    if (mountTimer) return;
    mountTimer = requestFrame(() => { mountTimer = 0; ensurePanel(); });
  }

  function requestFrame(callback) {
    return typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(callback, 16);
  }

  function isTargetRoute(pathname = location.pathname) {
    return pathname.startsWith("/marketplace") || pathname.startsWith("/project/api-keys") || pathname.startsWith("/project/requests");
  }

  function handleRouteChange() {
    const route = `${location.pathname}${location.search || ""}`;
    if (lastPathname === route) return;
    lastPathname = route;
    scheduleRouteScans();
  }

  function scheduleRouteScans() {
    if (!isTargetRoute()) return;
    schedulePanel();
    setTimeout(schedulePanel, 120);
    setTimeout(schedulePanel, 360);
  }

  function ensurePanel() {
    injectStyle();
    for (const anchor of findCreateApiButtons()) replaceCreateApiButton(anchor);
    insertRequestTriggers();
    insertPriceFilter();
    applyVisiblePriceFilter();
  }

  function insertRequestTriggers() {
    if (!isRequestsConsumerRoute()) {
      document.querySelectorAll(`.${REQUEST_TRIGGER_CLASS}`).forEach((button) => button.remove?.());
      return;
    }
    const apiKeyButton = findRequestsApiKeyFilterButton();
    const host = apiKeyButton?.parentElement;
    if (!apiKeyButton || !host || host.querySelector?.(`.${REQUEST_TRIGGER_CLASS}`)) return;
    apiKeyButton.insertAdjacentElement("afterend", createRequestEditTrigger(apiKeyButton));
  }

  function isRequestsConsumerRoute() {
    if (!location.pathname.startsWith("/project/requests")) return false;
    const view = new URLSearchParams(location.search || "").get("view");
    return !view || view === "consumer";
  }

  function findRequestsApiKeyFilterButton() {
    return Array.from(document.querySelectorAll("main button"))
      .find((button) => cleanText(button.textContent) === "API密钥");
  }

  function createRequestEditTrigger(anchor) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "更新 API 密钥";
    button.className = anchor.className || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-8 rounded-md px-3";
    button.classList.add(TRIGGER_CLASS, REQUEST_TRIGGER_CLASS);
    button.addEventListener("click", openRequestEditDialog);
    return button;
  }

  function findCreateApiButtons() {
    return Array.from(document.querySelectorAll("main button")).filter(isApiKeyActionButton);
  }

  function findChannelActionButtons() {
    return Array.from(document.querySelectorAll("main button")).filter((button) =>
      isApiKeyActionButton(button) || isTriggerButton(button),
    );
  }

  function isApiKeyActionButton(node) {
    return !isTriggerButton(node) && isCreateApiButtonText(node.textContent || "");
  }

  function isCreateApiButtonText(text) {
    return CREATE_API_KEY_RE.test(String(text || ""));
  }

  function isTriggerButton(node) {
    return Boolean(node?.classList?.contains(TRIGGER_CLASS));
  }

  function replaceCreateApiButton(anchor) {
    const channel = findChannelFromButton(anchor);
    if (!channel.id) return;
    const button = createTrigger(anchor, channel);
    anchor.replaceWith(button);
  }

  function insertPriceFilter() {
    if (!location.pathname.startsWith("/marketplace")) {
      resetPriceFilterState();
      document.getElementById(PRICE_FIELD_ID)?.remove();
      return;
    }
    if (!isMarketplaceChannelsTabActive()) {
      document.getElementById(PRICE_FIELD_ID)?.remove();
      return;
    }
    const anchors = findMarketplaceFilterFields();
    const anchor = anchors.sort || anchors.tags;
    if (!anchor) return;
    let field = document.getElementById(PRICE_FIELD_ID);
    if (!field) field = createPriceFilterField();
    cleanupMarketplaceSearchInput();
    syncPriceFilterField(field);
    if (anchors.sort) {
      if (field.parentElement !== anchor) anchor.appendChild(field);
    } else if (field.parentElement !== anchor.parentElement || field.previousElementSibling !== anchor) {
      anchor.insertAdjacentElement("afterend", field);
    }
    alignPriceFilterWithSort(anchors.sort, field);
  }

  function isMarketplaceChannelsTabActive() {
    if (!location.pathname.startsWith("/marketplace")) return false;
    const root = document.querySelector("main") || document;
    const selected = root.querySelector('[role="tab"][aria-selected="true"], [role="tab"][data-state="active"]');
    return !selected || /渠道广场|channel/i.test(String(selected.textContent || ""));
  }

  function findMarketplaceFilterFields(fields = Array.from(marketplaceChannelsRoot().querySelectorAll("label, p, div, span"))) {
    return {
      tags: filterFieldByLabel(fields, /^(标签|tags?)$/i),
      sort: filterFieldByLabel(fields, /^(排序|sort)$/i),
    };
  }

  function marketplaceChannelsRoot() {
    const main = document.querySelector("main") || document;
    const panels = Array.from(main.querySelectorAll?.('[role="tabpanel"], [data-slot="tabs-content"]') || []);
    return panels.find((panel) => isElementVisible(panel) && /渠道广场|按渠道名称|全部标签/i.test(String(panel.textContent || ""))) || main;
  }

  function filterFieldByLabel(elements, pattern) {
    for (const label of elements) {
      if (!isFilterLabelText(label.textContent, pattern)) continue;
      const field = closestFilterField(label);
      if (hasFilterControl(field)) return field;
    }
    return null;
  }

  function isFilterLabelText(text, pattern) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    return normalized.length <= 24 && pattern.test(normalized);
  }

  function closestFilterField(label) {
    let current = label;
    while (current && current !== document.body) {
      if (hasFilterControl(current)) return current;
      current = current.parentElement;
    }
    return null;
  }

  function hasFilterControl(field) {
    return Boolean(field?.querySelector?.("select") || field?.querySelector?.('[role="combobox"]'));
  }

  function alignPriceFilterWithSort(anchor, field) {
    if (!anchor || !field) return;
    anchor.classList?.add?.("hkb-sort-anchor");
    const trigger = anchor.querySelector?.('[role="combobox"], button');
    const marginBottom = Number.parseFloat(getComputedStyle(trigger || anchor).marginBottom || "0");
    field.style.setProperty("--hkb-price-bottom", `${Number.isFinite(marginBottom) ? marginBottom : 0}px`);
  }

  function createPriceFilterField() {
    const field = document.createElement("div");
    field.id = PRICE_FIELD_ID;
    field.dataset.hubToolPriceFilter = "true";
    field.innerHTML = `<button type="button" class="hkb-price-button border-input flex items-center justify-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]" data-size="default" data-role="price-filter" data-price="free" aria-label="只看免费渠道">免费</button>`;
    field.addEventListener("click", handlePriceFilterClick);
    return field;
  }

  function syncPriceFilterField(field) {
    if (!field) return;
    const price = currentPriceFilter();
    field.querySelectorAll("[data-price]").forEach((button) => {
      const selected = button.dataset.price === price;
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function handlePriceFilterClick(event) {
    const button = event.target?.closest?.("[data-price]");
    if (!button) return;
    setPriceFilter(currentPriceFilter() === button.dataset.price ? "all" : button.dataset.price);
  }

  function setPriceFilter(value) {
    const price = normalizePriceFilter(value);
    if (price === selectedPriceFilter) return;
    selectedPriceFilter = price;
    syncPriceFilterField(document.getElementById(PRICE_FIELD_ID));
    applyVisiblePriceFilter();
    triggerMarketplaceRefresh();
  }

  function cleanupLegacyPriceParam() {
    const url = new URL(location.href);
    if (!url.searchParams.has("price")) return;
    url.searchParams.delete("price");
    history.replaceState(history.state, "", url);
  }

  function triggerMarketplaceRefresh() {
    if (location.pathname.startsWith("/marketplace/models/")) {
      scheduleRouteScans();
      return;
    }
    const targetSort = currentPriceFilter() === "free" ? "倍率从低到高" : "综合推荐";
    if (triggerMarketplaceSortRefresh(targetSort)) return;
    scheduleRouteScans();
  }

  function triggerMarketplaceSortRefresh(targetText) {
    const trigger = findMarketplaceSortTrigger();
    if (!trigger) return false;
    const fetchStartedAt = lastMarketplaceChannelsFetchAt;
    openSelectLikeUser(trigger);
    setTimeout(() => {
      const option = findVisibleOptionByText(targetText);
      if (option) selectOptionLikeUser(option);
    }, 0);
    setTimeout(() => {
      if (lastMarketplaceChannelsFetchAt <= fetchStartedAt) scheduleRouteScans();
    }, 260);
    return true;
  }

  function openSelectLikeUser(trigger) {
    dispatchPointerEvent(trigger, "pointerdown", 1);
  }

  function selectOptionLikeUser(option) {
    dispatchPointerEvent(option, "pointermove", 1);
    dispatchMouseEvent(option, "mousemove", 1);
    dispatchPointerEvent(option, "pointerup", 0);
    dispatchMouseEvent(option, "mouseup", 0);
    dispatchMouseEvent(option, "click", 0);
  }

  function dispatchPointerEvent(element, type, buttons) {
    const init = mouseEventInit(element, buttons);
    const event = typeof PointerEvent === "function"
      ? new PointerEvent(type, { ...init, pointerId: 1, pointerType: "mouse", isPrimary: true })
      : new MouseEvent(type, init);
    element.dispatchEvent(event);
  }

  function dispatchMouseEvent(element, type, buttons) {
    element.dispatchEvent(new MouseEvent(type, mouseEventInit(element, buttons)));
  }

  function mouseEventInit(element, buttons) {
    const rect = element.getBoundingClientRect?.();
    const clientX = rect ? rect.left + rect.width / 2 : 0;
    const clientY = rect ? rect.top + rect.height / 2 : 0;
    return {
      bubbles: true,
      cancelable: true,
      composed: true,
      button: 0,
      buttons,
      clientX,
      clientY,
    };
  }

  function resetPriceFilterState() {
    if (selectedPriceFilter === "all") return;
    selectedPriceFilter = "all";
    applyVisiblePriceFilter();
  }

  function findMarketplaceSortTrigger() {
    const anchors = findMarketplaceFilterFields();
    return anchors.sort?.querySelector?.('[role="combobox"], button') || null;
  }

  function findVisibleOptionByText(text) {
    return Array.from(document.querySelectorAll('[role="option"]')).find((option) =>
      cleanText(option.textContent) === text && isElementVisible(option),
    ) || null;
  }

  function isElementVisible(element) {
    return Boolean(element?.offsetParent || element?.getClientRects?.().length);
  }

  function cleanupMarketplaceSearchInput(input = findMarketplaceSearchInput()) {
    if (!input || !hasMarketplaceSearchMarker(input.value)) return;
    setInputValue(input, cleanMarketplaceSearch(input.value));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function setInputValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (setter) setter.call(input, value);
    else input.value = value;
  }

  function findMarketplaceSearchInput() {
    return Array.from(document.querySelectorAll("main input")).find((input) =>
      /渠道名称|支持模型|search/i.test(String(input.placeholder || "")),
    ) || null;
  }

  function applyVisiblePriceFilter() {
    if (!location.pathname.startsWith("/marketplace/models/")) return;
    const mode = currentPriceFilter();
    for (const button of findChannelActionButtons()) {
      const context = findChannelContext(button);
      const channel = findActionButtonChannel(button);
      const state = modelProviderFreeState(channel);
      const hidden = mode !== "all" && state !== null && !priceStateMatches(state, mode);
      if (context) context.dataset.hubToolPriceHidden = hidden ? "true" : "false";
    }
  }

  function findActionButtonChannel(button) {
    if (isTriggerButton(button)) {
      return { id: button.dataset.channelId || "", name: button.dataset.channelName || "" };
    }
    return findChannelFromButton(button);
  }

  function priceStateMatches(freeState, mode) {
    return mode === "free" ? freeState === true : freeState === false;
  }

  function createTrigger(anchor, channel) {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = "更新 API 密钥";
    button.className = anchor.className || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-9 rounded-md px-4";
    button.classList.add(TRIGGER_CLASS);
    updateTriggerChannel(button, channel);
    button.addEventListener("click", openDialog);
    return button;
  }

  function findChannelContext(node) {
    const fixed = node.closest('[data-slot="card"], tr, [role="row"]');
    if (fixed) return fixed;
    let current = node.parentElement;
    while (current && current !== document.body) {
      if (findChannelNameFromText(textBeforeButton(current, node))) return current;
      current = current.parentElement;
    }
    return node.parentElement;
  }

  function findCardChannelName(node) { return node.closest('[data-slot="card"]')?.querySelector('[data-slot="card-title"]')?.textContent?.trim() || ""; }

  function findChannelFromButton(node) {
    const name = findVisibleChannelName(node);
    const channel = findCachedChannel(name) || findDirectReactChannel(node) || {};
    return {
      id: channel.id ? String(channel.id) : "",
      name: channel.name || name,
    };
  }

  function findVisibleChannelName(node) {
    return findCardChannelName(node) || findChannelNameFromText(findContextTextBeforeButton(findChannelContext(node), node));
  }

  function findContextTextBeforeButton(context, button) {
    if (!context) return "";
    return textBeforeButton(context, button);
  }

  function textBeforeButton(context, button) {
    const text = [];
    for (const current of Array.from(context.childNodes || context.children || [])) {
      if (current === button || containsNode(current, button)) break;
      const value = current.textContent?.trim();
      if (value) text.push(value);
    }
    return text.join("\n");
  }

  function containsNode(parent, child) {
    if (parent?.contains) return parent.contains(child);
    let current = child?.parentElement;
    while (current) {
      if (current === parent) return true;
      current = current.parentElement;
    }
    return false;
  }

  function findChannelNameFromText(text) {
    const lines = String(text || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const channel = findCachedChannel(line);
      if (channel) return channel.name;
    }
    return "";
  }

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
      const state = detail.free;
      for (const key of modelProviderCacheKeys(channel.id, modelID)) modelProviderPriceCache.set(key, state);
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

  function modelProviderCacheKeys(channelID, modelID) {
    const keys = new Set([modelProviderCacheKey(channelID, modelID)]);
    const numericID = extractNumericChannelID(channelID);
    if (numericID) {
      keys.add(`${numericID}:${normalizeModelID(modelID)}`);
      keys.add(`gid://axonhub/channel/${numericID}:${normalizeModelID(modelID)}`);
    }
    return Array.from(keys);
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
        && existing.supportedModels === item.supportedModels
        && existing.priceSummary === item.priceSummary) return false;
    }
    channelCache.set(item.id, item);
    const numericID = extractNumericChannelID(item.id);
    if (numericID) channelCache.set(String(numericID), item);
    channelNameCache.set(normalizeChannelName(item.name), item);
    return true;
  }

  function normalizeChannelName(name) {
    return String(name || "").replace(/\s+/g, " ").trim();
  }

  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style"); style.id = `${PANEL_ID}-style`;
    style.textContent = `.${TRIGGER_CLASS}{margin-left:4px}
      .hkb-sort-anchor{position:relative}
      #${PRICE_FIELD_ID}{box-sizing:border-box;position:absolute;left:calc(100% + 12px);bottom:var(--hkb-price-bottom,0px);display:flex;align-items:center;height:36px}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:36px;min-height:36px;border:1px solid var(--input,hsl(20 5.9% 90%));border-radius:12px;background:color-mix(in oklab,var(--input,hsl(20 5.9% 90%)) 12%,transparent);color:var(--foreground,hsl(20 14.3% 4.1%));padding:8px 12px;font:inherit;font-size:14px;font-weight:400;line-height:20px;white-space:nowrap;cursor:pointer;box-shadow:0 1px 2px 0 rgb(0 0 0 / .05);transition:color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{pointer-events:auto}
      #${PRICE_FIELD_ID} [data-role="price-filter"]:hover{background:var(--accent,hsl(60 4.8% 95.9%));color:var(--accent-foreground,var(--foreground,hsl(20 14.3% 4.1%)))}
      #${PRICE_FIELD_ID} [data-role="price-filter"]:focus-visible{outline:none;border-color:var(--ring,var(--foreground,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--foreground,hsl(20 14.3% 4.1%))) 24%,transparent)}
      #${PRICE_FIELD_ID} [data-role="price-filter"][aria-pressed="true"]{border-color:var(--primary,hsl(20 14.3% 4.1%));background:var(--primary,hsl(20 14.3% 4.1%));color:var(--primary-foreground,hsl(60 9.1% 97.8%))}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]{background:color-mix(in oklab,var(--input) 30%,transparent);box-shadow:0 1px 3px 0 rgb(0 0 0 / .3)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]:hover{background:color-mix(in oklab,var(--accent) 70%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]:focus-visible{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"][aria-pressed="true"]{border-color:var(--primary);background:var(--primary);color:var(--primary-foreground)}
      [data-hub-tool-price-hidden="true"]{display:none!important}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgb(0 0 0 / .48);padding:16px;color:var(--foreground,#111827);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(460px,100%);height:388px;box-sizing:border-box;background:var(--card,#fff);border:1px solid var(--border,rgba(229,231,235,.9));color:var(--card-foreground,var(--foreground,#111827));border-radius:14px;padding:24px;box-shadow:0 24px 60px -24px rgb(15 23 42 / .55),0 10px 24px -20px rgb(15 23 42 / .35)}
      #${DIALOG_ID} .hkb-switch{display:flex;gap:0;margin-bottom:22px}
      #${DIALOG_ID} .hkb-mode{min-height:auto;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--muted-foreground,#9ca3af);font-size:15px;font-weight:650;padding:0 18px 11px;cursor:pointer;transition:color .15s,border-color .15s}#${DIALOG_ID} .hkb-mode:hover{color:var(--foreground,#4b5563)}#${DIALOG_ID} .hkb-mode[aria-selected="true"]{color:var(--foreground,#111827);border-bottom-color:var(--primary,var(--foreground,#111827))}
      #${DIALOG_ID} [data-view-panel]{height:100%;display:grid;grid-template-rows:auto 1fr auto}
      #${DIALOG_ID} [data-view-panel][hidden]{display:none}
      #${DIALOG_ID} .hkb-grid{display:grid;gap:16px;min-height:0;align-content:start}
      #${DIALOG_ID} .hkb-edit-body{display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:14px;min-height:0;padding-top:4px}
      #${DIALOG_ID} .hkb-edit-row{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:12px;min-height:0}
      #${DIALOG_ID} .hkb-edit-row .hkb-label{align-self:center}
      #${DIALOG_ID} .hkb-edit-row-list{align-items:start}
      #${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:10px}
      #${DIALOG_ID} [data-key-panel]{min-height:70px}
      #${DIALOG_ID} .hkb-field{display:grid;gap:6px}
      #${DIALOG_ID} .hkb-label{font-size:13px;font-weight:650;color:var(--foreground,#374151)}
      #${DIALOG_ID} .hkb-control{width:100%;min-height:40px;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 18%,transparent);color:var(--foreground,#111827);font:inherit;font-size:14px;line-height:20px;padding:9px 12px;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
      #${DIALOG_ID} .hkb-control:focus,#${DIALOG_ID} .hkb-control[aria-expanded="true"]{background:var(--popover,var(--card,#fff));border-color:var(--ring,#9ca3af);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#111827) 18%,transparent)}
      #${DIALOG_ID} .hkb-channel-tag{display:flex;align-items:center;min-height:40px}
      #${DIALOG_ID} input[type="text"]{height:40px}
      #${DIALOG_ID} .hkb-copy-new{border-color:var(--border,#d1d5db);background:var(--card,#fff);color:var(--foreground,#374151);white-space:nowrap}#${DIALOG_ID} .hkb-copy-new:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#374151))}
      #${DIALOG_ID} .hkb-select-row{display:flex;align-items:center;gap:8px}#${DIALOG_ID} .hkb-key-picker{position:relative;flex:1;min-width:0}#${DIALOG_ID} .hkb-key-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;cursor:pointer}#${DIALOG_ID} .hkb-key-trigger span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-key-trigger::after{content:"";width:8px;height:8px;border-right:1.5px solid var(--muted-foreground,#6b7280);border-bottom:1.5px solid var(--muted-foreground,#6b7280);transform:rotate(45deg) translateY(-2px);flex-shrink:0;transition:transform .15s}#${DIALOG_ID} .hkb-key-trigger[aria-expanded="true"]::after{transform:rotate(225deg) translateY(-1px)}
      #${DIALOG_ID} .hkb-key-menu{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:1;max-height:232px;overflow:auto;margin:0;padding:6px;list-style:none;background:var(--popover,var(--card,#fff));border:1px solid var(--border,#e5e7eb);border-radius:12px;box-shadow:0 18px 48px -24px rgb(15 23 42 / .55),0 8px 20px -18px rgb(15 23 42 / .45)}#${DIALOG_ID} .hkb-key-menu[hidden]{display:none}
      #${DIALOG_ID} .hkb-key-option{width:100%;min-height:38px;display:flex;align-items:center;gap:8px;border:none;border-radius:8px;background:transparent;color:var(--popover-foreground,var(--foreground,#111827));text-align:left;padding:8px 10px;font-size:14px;font-weight:500}#${DIALOG_ID} .hkb-key-option:hover,#${DIALOG_ID} .hkb-key-option[aria-selected="true"]{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-key-option[aria-selected="true"]::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700}#${DIALOG_ID} .hkb-key-option:not([aria-selected="true"])::before{content:"";width:12px}#${DIALOG_ID} .hkb-key-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #${DIALOG_ID} .hkb-icon-btn{height:32px;width:32px;min-height:32px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s,box-shadow .15s}#${DIALOG_ID} .hkb-icon-btn:hover{color:var(--accent-foreground,var(--foreground,#0f172a));background:var(--accent,#f1f5f9)}#${DIALOG_ID} .hkb-icon-btn:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-icon-btn svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;pointer-events:none}
      #${DIALOG_ID} .hkb-edit-title{display:flex;align-items:center;gap:6px;margin:-8px 0 4px -8px;font-size:15px;font-weight:650;color:var(--foreground,#111827)}
      #${DIALOG_ID} .hkb-back{height:28px;width:28px;min-height:28px}
      #${DIALOG_ID} .hkb-edit-list{height:100%;min-height:92px;overflow:auto;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 14%,transparent);padding:4px;scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .15s}#${DIALOG_ID} .hkb-edit-list:hover,#${DIALOG_ID} .hkb-edit-list:focus-within,#${DIALOG_ID} .hkb-edit-list.is-scrolling{scrollbar-color:var(--border,#cbd5e1) transparent}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar{width:6px}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar-thumb{background:transparent;border-radius:999px}#${DIALOG_ID} .hkb-edit-list:hover::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list:focus-within::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list.is-scrolling::-webkit-scrollbar-thumb{background:var(--border,#cbd5e1)}
      #${DIALOG_ID} .hkb-channel-row{min-height:36px;display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:8px;color:var(--foreground,#111827);font-size:13px}#${DIALOG_ID} .hkb-channel-row:hover{background:var(--accent,#fff);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-channel-index{width:22px;flex-shrink:0;color:var(--muted-foreground,#64748b);font-size:12px;font-variant-numeric:tabular-nums;text-align:center}#${DIALOG_ID} .hkb-channel-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-channel-actions{display:flex;align-items:center;gap:2px;flex-shrink:0}#${DIALOG_ID} .hkb-row-btn{width:26px;height:26px;min-height:26px;border-color:transparent}#${DIALOG_ID} .hkb-row-btn svg{width:14px;height:14px}#${DIALOG_ID} .hkb-remove{color:var(--muted-foreground,#6b7280)}#${DIALOG_ID} .hkb-remove:hover{color:var(--destructive,#dc2626)}
      #${DIALOG_ID} .hkb-empty{padding:14px 10px;color:var(--muted-foreground,#9ca3af);font-size:13px}
      #${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:0;padding-top:16px;border-top:1px solid var(--border,#f3f4f6)}
      #${DIALOG_ID} .hkb-edit-actions{border-top:none;padding-top:18px}
      #${DIALOG_ID} [data-action="save-edit"]{position:relative}
      #${DIALOG_ID} [data-action="save-edit"][data-dirty="true"]::after{content:"";position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:999px;background:var(--primary,#111827);box-shadow:0 0 0 2px var(--card,#fff)}
      #${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{display:flex;align-items:center;gap:8px}
      #${DIALOG_ID} .hkb-status{color:var(--muted-foreground,#6b7280);font-size:12px;line-height:16px;flex:1;min-width:0}
      #${DIALOG_ID} button:not(.hkb-icon-btn){box-sizing:border-box;height:36px;min-height:36px;line-height:20px;border-radius:8px;border:1px solid transparent;padding:0 16px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:background .15s,opacity .15s}#${DIALOG_ID} button:disabled{cursor:not-allowed;opacity:.5}
      #${DIALOG_ID} .hkb-primary{border-color:var(--primary,#111827);background:var(--primary,#111827);color:var(--primary-foreground,#f9fafb)}#${DIALOG_ID} .hkb-primary:hover{background:color-mix(in oklab,var(--primary,#111827) 88%,white)}#${DIALOG_ID} .hkb-secondary{border-color:var(--border,#d1d5db);background:var(--secondary,#f3f4f6);color:var(--secondary-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-secondary:hover{background:var(--accent,#e5e7eb);color:var(--accent-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-ghost{border-color:transparent;background:transparent;color:var(--muted-foreground,#374151)}#${DIALOG_ID} .hkb-ghost:hover{background:var(--accent,#f9fafb);color:var(--accent-foreground,var(--foreground,#374151))}
      @media (max-width:360px){#${DIALOG_ID}{padding:8px}#${DIALOG_ID} .hkb-card{height:min(388px,calc(100vh - 16px));padding:16px}#${DIALOG_ID} .hkb-edit-row{grid-template-columns:1fr;gap:6px}#${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:0}#${DIALOG_ID} .hkb-actions{flex-wrap:wrap;align-items:flex-start}#${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{flex-wrap:wrap}#${DIALOG_ID} .hkb-status{flex-basis:100%;order:3}}
      html.dark #${DIALOG_ID}{background:rgb(0 0 0 / .56);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-card{box-shadow:0 24px 64px -24px rgb(0 0 0 / .85),0 12px 28px -20px rgb(0 0 0 / .75)}
      html.dark #${DIALOG_ID} .hkb-control{background:color-mix(in oklab,var(--input) 30%,transparent);border-color:var(--border);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-control::placeholder{color:var(--muted-foreground)}
      html.dark #${DIALOG_ID} .hkb-control:focus,html.dark #${DIALOG_ID} .hkb-control[aria-expanded="true"]{box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent)}
      html.dark #${DIALOG_ID} .hkb-key-menu{box-shadow:0 18px 48px -24px rgb(0 0 0 / .85),0 8px 20px -18px rgb(0 0 0 / .8)}
      html.dark #${DIALOG_ID} .hkb-edit-list{background:color-mix(in oklab,var(--input) 22%,transparent)}`;
    (document.head || document.documentElement).appendChild(style);
  }

  async function handlePanelClick(event) {
    const actionEl = event.target?.closest?.("[data-action]");
    const action = actionEl?.dataset?.action;
    if (!action && !event.target?.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    if (!action) return;
    if (action === "set-key-mode") {
      setKeyMode(actionEl.dataset.mode || "update");
      return;
    }
    if (action === "toggle-key-menu") {
      toggleKeyMenu();
      return;
    }
    if (action === "select-key") {
      selectKey(actionEl.dataset.keyId || "");
      closeKeyMenu();
      if (currentViewPanel() === "edit") {
        openEditPanel().catch((error) => setEditStatus(error?.message || "绑定渠道加载失败"));
      }
      return;
    }
    if (action === "open-edit") {
      openEditPanel().catch((error) => setEditStatus(error?.message || "绑定渠道加载失败"));
      return;
    }
    if (action === "close-edit") {
      showMainPanel();
      return;
    }
    if (action === "edit-add-current") {
      addCurrentChannelToEditList();
      return;
    }
    if (action === "edit-remove-channel") {
      removeEditChannel(actionEl.dataset.channelId || "");
      return;
    }
    if (action === "edit-move-channel") {
      moveEditChannel(actionEl.dataset.channelId || "", actionEl.dataset.direction || "down");
      return;
    }
    if (!actionEl.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    try {
      setBusy(true);
      if (action === "reload-keys") await loadKeys(true);
      else if (action === "append-bind") await updateExistingKeyBinding("append");
      else if (action === "replace-bind") await updateExistingKeyBinding("replace");
      else if (action === "save-edit") await saveEditBindings();
      else if (action === "create-bind") await createKeyAndBind();
      else if (action === "copy-created-key") await copyCreatedKey();
      else if (action === "copy-key") await copySelectedKey();
    } catch (error) { setStatus(error?.message || "操作失败"); } finally { setBusy(false); }
  }

  function openDialog() {
    ensureDialog(); document.getElementById(DIALOG_ID).hidden = false;
    const channel = { id: this?.dataset?.channelId || "", name: this?.dataset?.channelName || "" };
    setCurrentChannel(channel);
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys().catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function openRequestEditDialog() {
    ensureDialog(); document.getElementById(DIALOG_ID).hidden = false;
    setCurrentChannel({ id: "", name: "" }, { allowEmpty: true });
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys()
      .then(() => openEditPanel())
      .catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID); if (dialog) dialog.hidden = true;
  }

  function ensureDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID; dialog.hidden = true;
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true">
      <div class="hkb-main" data-view-panel="main">
        <div class="hkb-switch" role="tablist" aria-label="密钥操作">
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="update" aria-selected="true">绑定渠道</button>
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="create" aria-selected="false">新建密钥</button>
        </div>
        <div class="hkb-grid">
          <div class="hkb-field"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="channel-label"></div></div>
          <div data-key-panel="update" role="tabpanel">
            <div class="hkb-field"><span class="hkb-label">API Key</span><div class="hkb-select-row"><div class="hkb-key-picker" data-role="key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="key-menu" role="listbox" hidden></ul></div><button type="button" class="hkb-icon-btn" data-action="copy-key" title="复制密钥" aria-label="复制密钥"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="reload-keys" title="刷新" aria-label="刷新"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M16 8h5V3"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="open-edit" title="编辑绑定渠道" aria-label="编辑绑定渠道"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button></div></div>
          </div>
          <div data-key-panel="create" role="tabpanel" hidden>
            <div class="hkb-field"><span class="hkb-label">Key 名称</span><input class="hkb-control" data-role="new-key-name" type="text" placeholder="输入 Key 名称"></div>
          </div>
        </div>
        <div class="hkb-actions"><div class="hkb-action-left"><button type="button" class="hkb-primary" data-action="append-bind" data-action-panel="update">追加绑定</button><button type="button" class="hkb-secondary" data-action="replace-bind" data-action-panel="update">替换绑定</button><button type="button" class="hkb-primary" data-action="create-bind" data-action-panel="create" hidden>新建并绑定</button><button type="button" class="hkb-secondary hkb-copy-new" data-action="copy-created-key" data-action-panel="create" data-role="copy-created-key" hidden>复制新密钥</button></div><div class="hkb-status" data-role="status"></div><div class="hkb-action-right"><button type="button" class="hkb-ghost" data-action="close">关闭</button></div></div>
      </div>
      <div class="hkb-main" data-view-panel="edit" hidden>
        <div class="hkb-edit-title"><button type="button" class="hkb-icon-btn hkb-back" data-action="close-edit" title="返回" aria-label="返回"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><span>编辑绑定渠道</span></div>
        <div class="hkb-edit-body">
          <div class="hkb-edit-row"><span class="hkb-label">API Key</span><div class="hkb-key-picker" data-role="edit-key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="edit-key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="edit-key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="edit-key-menu" role="listbox" hidden></ul></div></div>
          <div class="hkb-edit-row"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="edit-channel-label"></div></div>
          <div class="hkb-edit-row hkb-edit-row-list"><span class="hkb-label">已绑定渠道</span><div class="hkb-edit-list" data-role="edit-channel-list" tabindex="0"></div></div>
        </div>
        <div class="hkb-actions hkb-edit-actions"><div class="hkb-action-left"><button type="button" class="hkb-primary" data-action="edit-add-current">添加当前渠道</button></div><div class="hkb-status" data-role="edit-status"></div><div class="hkb-action-right"><button type="button" class="hkb-secondary" data-action="save-edit">保存修改</button><button type="button" class="hkb-ghost" data-action="close-edit">取消</button></div></div>
      </div>
    </div>`;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target?.dataset?.action === "close") closeDialog();
      else handlePanelClick(event);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeKeyMenu();
    });
    dialog.addEventListener("input", (event) => {
      if (event.target?.dataset?.role === "new-key-name") {
        setCreatedKeyValue("");
        setStatus("");
      }
    });
    dialog.addEventListener("scroll", (event) => {
      if (event.target?.dataset?.role === "edit-channel-list") markScrolling(event.target);
    }, true);
    document.body.appendChild(dialog);
  }

  function setKeyMode(mode) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const selectedMode = mode === "create" ? "create" : "update";
    dialog.dataset.keyMode = selectedMode;
    dialog.querySelectorAll("[data-action='set-key-mode']").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.mode === selectedMode));
    });
    dialog.querySelectorAll("[data-key-panel]").forEach((el) => {
      el.hidden = el.dataset.keyPanel !== selectedMode;
    });
    closeKeyMenu();
    syncActionButtons();
    setStatus("");
  }

  async function graphql(query, variables = {}, operationName = undefined) {
    const headers = { "content-type": "application/json", "x-project-id": graphqlHeaders.projectID };
    if (graphqlHeaders.authorization) headers.authorization = graphqlHeaders.authorization;
    const response = await nativeFetch(new URL(GRAPHQL_PATH, location.origin), {
      method: "POST",
      credentials: "same-origin",
      headers,
      body: JSON.stringify({ query, variables, operationName }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || `请求失败：${response.status}`);
    return payload.data;
  }

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
      { id: `gid://axonhub/Channel/${numericID}` },
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

  async function updateExistingKeyBinding(mode) {
    const result = await bindChannelToKey(selectedKeyID, currentChannelID(), mode);
    if (mode === "append" && result.alreadyBound) setStatus("当前渠道已在选中 Key 的绑定列表中");
    else setStatus(mode === "replace" ? "已替换选中 Key 的渠道绑定" : "已追加当前渠道到选中 Key");
  }

  async function createKeyAndBind() {
    const name = getValue("new-key-name").trim();
    if (!name) throw new Error("请先填写新 Key 名称");
    const key = await createKey(name);
    await bindChannelToKey(key.id, currentChannelID(), "replace");
    await loadKeys(true);
    setCreatedKeyValue(apiKeyValue(key));
    setStatus(`已新建并绑定：${key.name || name}`);
  }

  async function bindChannelToKey(keyID, channelID, mode = "replace") {
    if (!keyID) throw new Error("请选择 API Key");
    if (!channelID) throw new Error("请选择渠道");
    setStatus("正在读取当前 Key 配置");
    const data = await graphql(queries.getKey, { id: keyID }, "GetApiKey");
    const numericChannelID = extractNumericChannelID(channelID);
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    if (!numericChannelID) throw new Error(`渠道 ID 无效：${channelID}`);
    setStatus("正在写入渠道绑定");
    const input = buildProfilesInput(data.node.profiles, numericChannelID, mode);
    await graphql(queries.updateProfiles, { id: keyID, input }, "UpdateAPIKeyProfiles");
    return { alreadyBound: mode === "append" && getActiveProfile(data.node.profiles).channelIDs?.includes(numericChannelID) };
  }

  function buildProfilesInput(profilesPayload, channelID, mode = "replace") {
    const targetIDs = mode === "append"
      ? uniqueChannelIDs([...currentProfileChannelIDs(profilesPayload), channelID])
      : [channelID];
    return buildProfilesInputWithChannelIDs(profilesPayload, targetIDs);
  }

  function buildProfilesInputWithChannelIDs(profilesPayload, channelIDs) {
    const activeProfile = profilesPayload.activeProfile || "default";
    const profiles = Array.isArray(profilesPayload.profiles) && profilesPayload.profiles.length
      ? profilesPayload.profiles.map((profile) => ({ ...profile }))
      : [{ name: activeProfile }];
    const target = profiles.find((profile) => profile.name === activeProfile) || profiles[0];
    target.name = target.name || activeProfile;
    target.channelIDs = uniqueChannelIDs(channelIDs);
    target.channelTags = Array.isArray(target.channelTags) ? target.channelTags : [];
    target.channelTagsMatchMode = target.channelTagsMatchMode || "any";
    target.modelMappings = Array.isArray(target.modelMappings) ? target.modelMappings : [];
    target.modelIDs = Array.isArray(target.modelIDs) ? target.modelIDs : [];
    target.channelBindingMode = "manual";
    target.dynamicChannelStrategy = null;
    return { activeProfile, profiles };
  }

  function getActiveProfile(profilesPayload) {
    const activeProfile = profilesPayload?.activeProfile || "default";
    const profiles = Array.isArray(profilesPayload?.profiles) ? profilesPayload.profiles : [];
    return profiles.find((profile) => profile.name === activeProfile) || profiles[0] || {};
  }

  function currentProfileChannelIDs(profilesPayload) {
    return uniqueChannelIDs(getActiveProfile(profilesPayload).channelIDs || []);
  }

  function uniqueChannelIDs(channelIDs) {
    const ids = [];
    const seen = new Set();
    for (const id of channelIDs || []) {
      const numericID = extractNumericChannelID(id);
      if (!numericID || seen.has(numericID)) continue;
      seen.add(numericID);
      ids.push(numericID);
    }
    return ids;
  }

  function renderKeyOptions() {
    if (!keysCache.some((key) => key.id === selectedKeyID)) selectedKeyID = keysCache[0]?.id || "";
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
      menu.innerHTML = keysCache.length
        ? keysCache.map((key) => `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}" role="option" aria-selected="${String(key.id === selectedKeyID)}"><span>${escapeHtml(keyLabel(key))}</span></button></li>`).join("")
        : `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="" role="option" disabled>暂无 API Key</button></li>`;
    });
    syncKeyPicker();
  }

  function setCurrentChannel(channel, options = {}) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    dialog.dataset.channelId = channel.id || "";
    dialog.dataset.channelName = channel.name || "";
    const label = document.querySelector(`#${DIALOG_ID} [data-role="channel-label"]`);
    if (label) label.textContent = channel.name || (options.allowEmpty ? "未指定" : "未读取到当前渠道");
    setStatus(channel.id || options.allowEmpty ? "" : "未读取到渠道 ID，请刷新重试");
  }

  function currentChannelID() {
    const channelID = document.getElementById(DIALOG_ID)?.dataset?.channelId || "";
    if (!channelID) throw new Error("无当前渠道");
    return channelID;
  }

  async function openEditPanel() {
    if (!selectedKeyID) throw new Error("请先选择 API Key");
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const channelID = dialog.dataset.channelId || "";
    showEditPanel();
    setEditDirty(false);
    setEditStatus("加载中");
    const channelLabelEl = dialog.querySelector("[data-role='edit-channel-label']");
    if (channelLabelEl) channelLabelEl.textContent = channelID ? channelLabel(channelID) : "未指定";
    syncKeyPicker();
    const data = await graphql(queries.getKey, { id: selectedKeyID }, "GetApiKey");
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    editChannelIDs = currentProfileChannelIDs(data.node.profiles);
    renderEditChannelList();
    const loadToken = ++editLoadToken;
    loadMissingChannelNames(editChannelIDs).then((loaded) => {
      if (loaded && loadToken === editLoadToken && currentViewPanel() === "edit") renderEditChannelList();
    }).catch(() => {});
    setEditStatus("");
  }

  function showEditPanel() {
    closeKeyMenu();
    showViewPanel("edit");
  }

  function showMainPanel() {
    editChannelIDs = [];
    editLoadToken += 1;
    setEditDirty(false);
    showViewPanel("main");
    setEditStatus("");
  }

  function showViewPanel(view) {
    document.querySelectorAll(`#${DIALOG_ID} [data-view-panel]`).forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== view;
    });
  }

  function currentViewPanel() {
    return document.querySelector(`#${DIALOG_ID} [data-view-panel]:not([hidden])`)?.dataset?.viewPanel || "main";
  }

  function addCurrentChannelToEditList() {
    const numericID = extractNumericChannelID(currentChannelID());
    if (!numericID) throw new Error("无当前渠道");
    if (editChannelIDs.includes(numericID)) {
      setEditStatus("已存在");
      return;
    }
    editChannelIDs = [...editChannelIDs, numericID];
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已添加");
  }

  function removeEditChannel(channelID) {
    const numericID = extractNumericChannelID(channelID);
    if (!numericID) {
      setEditStatus("渠道 ID 无效");
      return;
    }
    editChannelIDs = editChannelIDs.filter((id) => id !== numericID);
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已移除");
  }

  function moveEditChannel(channelID, direction) {
    const numericID = extractNumericChannelID(channelID);
    const currentIndex = editChannelIDs.indexOf(numericID);
    const offset = direction === "up" ? -1 : 1;
    const nextIndex = currentIndex + offset;
    if (!numericID || currentIndex < 0 || nextIndex < 0 || nextIndex >= editChannelIDs.length) return;
    const nextIDs = [...editChannelIDs];
    [nextIDs[currentIndex], nextIDs[nextIndex]] = [nextIDs[nextIndex], nextIDs[currentIndex]];
    editChannelIDs = nextIDs;
    renderEditChannelList();
    setEditDirty(true);
    setEditStatus("已调整");
  }

  async function saveEditBindings() {
    if (!selectedKeyID) throw new Error("请先选择 API Key");
    setEditStatus("保存中");
    const data = await graphql(queries.getKey, { id: selectedKeyID }, "GetApiKey");
    if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
    const input = buildProfilesInputWithChannelIDs(data.node.profiles, editChannelIDs);
    await graphql(queries.updateProfiles, { id: selectedKeyID, input }, "UpdateAPIKeyProfiles");
    setEditDirty(false);
    setEditStatus("已保存");
  }

  function renderEditChannelList() {
    const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
    if (!list) return;
    list.innerHTML = editChannelIDs.length
      ? editChannelIDs.map((id, index) => renderEditChannelRow(id, index)).join("")
      : `<div class="hkb-empty">暂无绑定渠道</div>`;
  }

  function renderEditChannelRow(channelID, index) {
    const safeID = escapeHtml(channelID);
    const isFirst = index === 0;
    const isLast = index === editChannelIDs.length - 1;
    return `<div class="hkb-channel-row" data-channel-id="${safeID}">
      <span class="hkb-channel-index">${index + 1}</span>
      <span class="hkb-channel-name">${escapeHtml(channelLabel(channelID))}</span>
      <span class="hkb-channel-actions">
        <button type="button" class="hkb-icon-btn hkb-row-btn" data-action="edit-move-channel" data-direction="up" data-channel-id="${safeID}" title="上移" aria-label="上移" ${isFirst ? "disabled" : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg></button>
        <button type="button" class="hkb-icon-btn hkb-row-btn" data-action="edit-move-channel" data-direction="down" data-channel-id="${safeID}" title="下移" aria-label="下移" ${isLast ? "disabled" : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button>
        <button type="button" class="hkb-icon-btn hkb-row-btn hkb-remove" data-action="edit-remove-channel" data-channel-id="${safeID}" title="移除" aria-label="移除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>
      </span>
    </div>`;
  }

  function channelLabel(channelID) {
    const id = String(channelID || "");
    const channel = channelCache.get(id) || channelCache.get(String(extractNumericChannelID(id) || ""));
    return channel?.name || (id ? `Channel #${extractNumericChannelID(id) || id}` : "未读取到当前渠道");
  }

  function apiKeyValue(key) { return String(key?.key || ""); }

  function setCreatedKeyValue(value) {
    createdKeyValueCache = String(value || "");
    syncActionButtons();
  }

  async function copyCreatedKey() {
    const value = createdKeyValue();
    if (!value) throw new Error("没有可复制的 API Key");
    await navigator.clipboard.writeText(value);
    setStatus("已复制新 API Key");
  }

  function createdKeyValue() { return createdKeyValueCache; }

  function syncActionButtons() {
    const dialog = document.getElementById(DIALOG_ID);
    const selectedMode = dialog?.dataset?.keyMode || "update";
    const actions = dialog?.querySelector(".hkb-actions");
    if (!actions) return;
    actions.querySelectorAll("[data-action-panel]").forEach((el) => {
      const isCopyCreated = el.dataset.role === "copy-created-key";
      const hasCreatedKey = Boolean(createdKeyValue());
      const isCreateBind = el.dataset.action === "create-bind";
      el.hidden = el.dataset.actionPanel !== selectedMode || (isCopyCreated && !hasCreatedKey) || (isCreateBind && hasCreatedKey);
    });
  }

  async function copySelectedKey() {
    const keyID = selectedKeyID;
    if (!keyID) throw new Error("请先选择 API Key");
    const data = await graphql(queries.getKeyValue, { id: keyID }, "GetApiKeyValue");
    const value = data?.node?.key;
    if (!value) throw new Error("该 Key 无可复制的密钥值");
    await navigator.clipboard.writeText(value);
    setStatus("已复制密钥");
  }

  function keyLabel(key) { return String(key?.name || key?.id || "未命名 API Key"); }

  function selectKey(keyID) {
    if (!keyID || !keysCache.some((key) => key.id === keyID)) return;
    selectedKeyID = keyID;
    syncKeyPicker();
  }

  function syncKeyPicker() {
    const current = keysCache.find((key) => key.id === selectedKeyID);
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-label"], #${DIALOG_ID} [data-role="edit-key-label"]`).forEach((label) => {
      label.textContent = current ? keyLabel(current) : "暂无 API Key";
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-trigger"], #${DIALOG_ID} [data-role="edit-key-trigger"]`).forEach((trigger) => {
      trigger.disabled = !keysCache.length;
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-action="select-key"]`).forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.keyId === selectedKeyID));
    });
  }

  function toggleKeyMenu() {
    const scope = currentViewPanel() === "edit" ? "edit-" : "";
    const trigger = document.querySelector(`#${DIALOG_ID} [data-role="${scope}key-trigger"]`);
    const menu = document.querySelector(`#${DIALOG_ID} [data-role="${scope}key-menu"]`);
    if (!trigger || !menu || !keysCache.length) return;
    const open = menu.hidden;
    closeKeyMenu();
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  }

  function closeKeyMenu() {
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
      menu.hidden = true;
    });
    document.querySelectorAll(`#${DIALOG_ID} [data-role="key-trigger"], #${DIALOG_ID} [data-role="edit-key-trigger"]`).forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  function getValue(role) { return document.querySelector(`#${DIALOG_ID} [data-role="${role}"]`)?.value || ""; }
  function setStatus(message) {
    const status = document.querySelector(`#${DIALOG_ID} [data-role="status"]`); if (status) status.textContent = message;
  }
  function setEditStatus(message) {
    const status = document.querySelector(`#${DIALOG_ID} [data-role="edit-status"]`); if (status) status.textContent = message;
  }
  function setEditDirty(isDirty) {
    editDirty = Boolean(isDirty);
    const saveButton = document.querySelector(`#${DIALOG_ID} [data-action="save-edit"]`);
    if (saveButton) saveButton.dataset.dirty = String(editDirty);
  }
  function setBusy(isBusy) {
    document.querySelectorAll(`#${DIALOG_ID} button`).forEach((button) => { button.disabled = isBusy; });
    if (!isBusy) syncKeyPicker();
  }

  function markScrolling(node) {
    node.classList.add("is-scrolling");
    clearTimeout(node.__hkbScrollTimer);
    node.__hkbScrollTimer = setTimeout(() => node.classList.remove("is-scrolling"), 700);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPE_MAP[char]);
  }

  function startMountWatcher() {
    patchHistoryRouting();
    cleanupLegacyPriceParam();
    new MutationObserver((mutations) => {
      if (isTargetRoute() && mutations.some(isUsefulMutation)) schedulePanel();
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
    scheduleRouteScans();
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("load", scheduleRouteScans, { once: true });
    document.addEventListener("click", handleMarketplaceTabActivation, true);
    document.addEventListener("keydown", handleMarketplaceTabActivation, true);
  }

  function handleMarketplaceTabActivation(event) {
    if (!location.pathname.startsWith("/marketplace")) return;
    if (event.type === "keydown" && !["Enter", " ", "Spacebar"].includes(event.key)) return;
    const tab = event.target?.closest?.("[role='tab'], [data-slot='tabs-trigger']");
    if (!tab || !/渠道广场|channel/i.test(String(tab.textContent || ""))) return;
    setTimeout(schedulePanel, 0);
    setTimeout(schedulePanel, 120);
  }

  function patchHistoryRouting() {
    if (history.__hubKeyBinderPatched) return;
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function patchedHistoryMethod(...args) {
        const result = original.apply(this, args);
        setTimeout(handleRouteChange, 0);
        return result;
      };
    }
    Object.defineProperty(history, "__hubKeyBinderPatched", { value: true });
  }

  function isUsefulMutation(mutation) {
    if (mutation.target?.closest?.(`#${DIALOG_ID}`)) return false;
    for (const node of mutation.addedNodes || []) {
      if (isUsefulAddedNode(node)) return true;
    }
    return false;
  }

  function isUsefulAddedNode(node) {
    if (node.nodeType !== 1) return false;
    if (node.closest?.(`#${DIALOG_ID}`)) return false;
    if (node.matches?.("main, button, [data-slot='card'], tr, [role='row']")) return true;
    return Boolean(node.querySelector?.("main, button, [data-slot='card'], tr, [role='row']"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startMountWatcher, { once: true });
  else startMountWatcher();

  if (window.__hubKeyBinderEnableTest) {
    let graphqlRunner = null;
    const testGraphql = (query, variables = {}, operationName = undefined) =>
      (graphqlRunner ? graphqlRunner(query, variables, operationName) : graphql(query, variables, operationName));
    const testLoadChannelName = async (channelID) => {
      const numericID = extractNumericChannelID(channelID);
      if (!numericID) return null;
      if (channelCache.has(String(numericID))) return channelCache.get(String(numericID));
      const data = await testGraphql(
        queries.getChannelName,
        { id: `gid://axonhub/Channel/${numericID}` },
        "GetChannelName",
      );
      const channel = data?.node;
      if (!channel?.id || !channel?.name) return null;
      rememberChannel(channel);
      return channelCache.get(String(numericID)) || channel;
    };
    const testLoadMissingChannelNames = async (channelIDs) => {
      const missingIDs = uniqueChannelIDs(channelIDs)
        .filter((id) => !channelCache.has(String(id)))
        .slice(0, CHANNEL_NAME_LOOKUP_LIMIT);
      const results = await Promise.all(missingIDs.map((id) => testLoadChannelName(id).catch(() => null)));
      return results.filter(Boolean).length;
    };
    window.__hubKeyBinderTest = {
      extractNumericChannelID,
      findChannelFromButton,
      isApiKeyActionButton,
      isCreateApiButtonText,
      rememberChannelsFromPayload,
      apiKeyValue,
      buildProfilesInput,
      buildProfilesInputWithChannelIDs,
      findMarketplaceFilterFields,
      isMarketplaceChannelsTabActive,
      filterMarketplacePayloadByPrice,
      augmentChannelModelPricesPayload,
      channelFreeStateForModelDetail,
      implicitFreePriceRowsForCurrentModelPage,
      ensurePricingFields,
      marketplaceChannelsScanUrl,
      sanitizeMarketplaceChannelsRequest,
      cleanMarketplaceSearch,
      normalizePriceFilter,
      requestUrl,
      requestBodyText,
      readRequestBodyText,
      withMarketplaceModelPricingFields,
      rememberModelProviderPricesFromPayload,
      isTargetRoute,
      isRequestsConsumerRoute,
      findRequestsApiKeyFilterButton,
      insertRequestTriggers,
      channelLabel,
      loadMissingChannelNames: testLoadMissingChannelNames,
      __setPriceFilterForTest: (value) => { selectedPriceFilter = normalizePriceFilter(value); },
      __setGraphqlForTest: (runner) => { graphqlRunner = runner; },
    };
  }
})();

// ==UserScript==
// @name         LinuxDo Hub Tool
// @namespace    https://hub.linux.do/
// @version      0.4.9
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
const PANEL_ID = "linuxdo-hub-tool";
const TRIGGER_CLASS = `${PANEL_ID}-trigger`;
const CHANNEL_TRIGGER_CLASS = `${PANEL_ID}-channel-trigger`;
const REQUEST_TRIGGER_CLASS = `${PANEL_ID}-request-trigger`;
const DIALOG_ID = `${PANEL_ID}-dialog`;
const PRICE_FIELD_ID = `${PANEL_ID}-price-field`;
const MODEL_ID_FIELD_ID = `${PANEL_ID}-model-id-field`;
const MODEL_ID_SELECT_ID = `${PANEL_ID}-model-id-select`;
const MODEL_ID_ALL_VALUE = "__all__";
const MULTIPLIER_TAG_CLASS = `${PANEL_ID}-multiplier-tag`;
const MULTIPLIER_COLUMN_CLASS = `${PANEL_ID}-multiplier-column`;
const MULTIPLIER_COLUMN_HEADER_CLASS = `${MULTIPLIER_COLUMN_CLASS}-header`;
const MULTIPLIER_LOW_TONE_CLASS = `${MULTIPLIER_COLUMN_CLASS}-low`;
const MULTIPLIER_HIGH_TONE_CLASS = `${MULTIPLIER_COLUMN_CLASS}-high`;
const REQUEST_LOG_CHANNEL_COLUMN_CLASS = `${PANEL_ID}-request-channel-column`;
const CHANNEL_NAME_LOOKUP_LIMIT = 20;
const REACT_FIBER_CHANNEL_LOOKUP_LIMIT = 8;
const IMPLICIT_FREE_PRICE_LIMIT = 50;
const IMPLICIT_FREE_PRICE_ROW_PREFIX = "implicit-free";
const MODEL_PRICE_ROW_MATCH_KINDS = ["exact", "prefixed", "dated"];
const ZERO_WIDTH_RE = /[\u200b-\u200d\ufeff]/g;
const WHITESPACE_RE = /\s+/g;
const API_KEY_CREATE_ACTION_RE = /^(?:创建\s*API\s*密钥|Create\s*API\s*Key)$/i;
const API_KEY_EXISTING_ACTION_RE = /^(?:添加到已有密钥|Add\s+to\s+(?:an?\s+)?Existing(?:\s+API)?\s+Key)$/i;
const HAS_FLAT_FEE_RE = /flatFee\b/;
const HAS_MODE_RE = /\bmode\b/;
const HTML_ESCAPE_RE = /[&<>"']/g;
const HTML_ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };

const nativeFetch = window.fetch.bind(window);
const graphqlHeaders = { authorization: "", projectID: PROJECT_ID };
const channelCache = new Map();
const channelNameCache = new Map();
const channelNameRequestCache = new Map();
const modelProviderPriceCache = new Map();
const modelProviderOfficialCache = new Map();
const channelModelPricesCache = new Map();
const modelPageImplicitFreeCache = new Map();
const modelDatedVariantRECache = new Map();
const modelProviderServedCache = new Map();
const marketplaceModelIDOptions = [];
const requestLogMultiplierCache = new Map();
const requestBodyTextCache = new WeakMap();
let meCache = null;
let keysCache = [];
let selectedKeyID = "";
let mountTimer = 0;
let selectedPriceFilter = "all";
let selectedMarketplaceModelID = "";
let modelIDFilterPathname = "";
let selectedOfficialFilter = false;
let createdKeyValueCache = "";
let lastMarketplaceChannelsFetchAt = 0;
let editChannelIDs = [];
let editLoadToken = 0;
let editDirty = false;
let editDragState = null;
let lastPathname = location.pathname;

function requestUrl(input) {
  if (input instanceof URL) return input.toString();
  return String(typeof input === "string" ? input : input?.url || "");
}

function requestPath(input) {
  return requestUrl(input).replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
}

function graphqlOperationName(bodyText) {
  try {
    return JSON.parse(String(bodyText || "")).operationName || "";
  } catch {
    return "";
  }
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

function isJsonResponse(response) {
  return String(response?.headers?.get?.("content-type") || "").includes("application/json");
}

const queries = {
  createKey: "mutation CreateAPIKey($input:CreateAPIKeyInput!){createAPIKey(input:$input){id key name status type}}",
  getKeys: "query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id name status}cursor}pageInfo{hasNextPage endCursor}totalCount}}",
  getKey: "query GetApiKey($id:ID!){node(id:$id){... on APIKey{id name status user{id} profiles{activeProfile profiles{name modelMappings{from to} channelIDs channelTags channelTagsMatchMode modelIDs loadBalanceStrategy channelBindingMode dynamicChannelStrategy{mode maxChannels minChannels maxPriceMultiplier maxLatencyMs minSuccessRate onlyOfficial includeTags excludeTags excludeChannelIDs fallbackChannelIDs} quota{requests totalTokens cost period{type pastDuration{value unit} calendarDuration{unit}}}}}}}}",
  getKeyValue: "query GetApiKeyValue($id:ID!){node(id:$id){... on APIKey{id key status user{id}}}}",
  getChannelName: "query GetChannelName($id:ID!){node(id:$id){... on Channel{id name}}}",
  getChannelModelPrices: "query ChannelModelPrices($id:ID!){node(id:$id){... on Channel{id channelModelPrices{id modelID price{items{itemCode multiplier pricing{mode flatFee usagePerUnit usageTiered{tiers{upTo pricePerUnit}}} promptWriteCacheVariants{variantCode pricing{mode flatFee usagePerUnit}}}}}}}}",
  updateProfiles: "mutation UpdateAPIKeyProfiles($id:ID!,$input:UpdateAPIKeyProfilesInput!){updateAPIKeyProfiles(id:$id,input:$input){id name status profiles{activeProfile profiles{name channelIDs channelBindingMode}}}}",
  updateKeyStatus: "mutation UpdateAPIKeyStatus($id:ID!,$status:APIKeyStatus!){updateAPIKeyStatus(id:$id,status:$status){id status}}",
  me: "query Me{me{id projects{projectID}}}",
};

let graphqlRunnerOverride = null;

async function runGraphql(query, variables = {}, operationName = undefined, options = {}) {
  if (graphqlRunnerOverride) return graphqlRunnerOverride(query, variables, operationName, options);
  const request = typeof Request !== "undefined" && options.input instanceof Request ? options.input : null;
  const headers = new Headers(options.init?.headers || request?.headers || {});
  headers.set("content-type", "application/json");
  if (!headers.has("x-project-id")) headers.set("x-project-id", graphqlHeaders.projectID);
  if (!headers.has("authorization") && graphqlHeaders.authorization) headers.set("authorization", graphqlHeaders.authorization);
  const response = await nativeFetch(new URL(GRAPHQL_PATH, location.origin), {
    method: "POST",
    credentials: options.credentials || options.init?.credentials || request?.credentials || "same-origin",
    headers,
    body: JSON.stringify({ query, variables, operationName }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || `请求失败：${response.status}`);
  return payload.data;
}

function graphql(query, variables = {}, operationName = undefined) {
  return runGraphql(query, variables, operationName);
}

function graphqlWithRequestContext(query, variables = {}, operationName = undefined, input, init) {
  return runGraphql(query, variables, operationName, { input, init });
}

function setGraphqlRunnerForTest(runner) {
  graphqlRunnerOverride = typeof runner === "function" ? runner : null;
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

function filterMarketplacePayloadByOfficial(payload, onlyOfficial) {
  if (!onlyOfficial) return payload;
  if (Array.isArray(payload?.data?.marketplaceModel?.providers)) {
    const providers = payload.data.marketplaceModel.providers.filter((provider) =>
      channelIsOfficial(provider?.channel),
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
  const items = payload.items.filter((item) => channelIsOfficial(item));
  return {
    ...payload,
    items,
    totalCount: items.length,
    totalPages: 1,
    page: 1,
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
  return supportedModels
    .filter((modelID) => !hasModelPriceRowFor(prices, modelID))
    .slice(0, IMPLICIT_FREE_PRICE_LIMIT)
    .map((modelID) => createImplicitFreePriceRow(channelID, modelID));
}

function implicitFreePriceRowsForCurrentModelPage(channelID, prices) {
  if (!location.pathname.startsWith("/marketplace/models/")) return [];
  if (currentPriceFilter() !== "free") return [];
  const modelID = currentMarketplaceModelID();
  if (!modelID || !hasModelPageImplicitFree(channelID, modelID)) return [];
  return hasModelPriceRowFor(prices, modelID) ? [] : [createImplicitFreePriceRow(channelID, modelID)];
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

  window.fetch = async function patchedFetch(input, init) {
    const sanitizedRequest = sanitizeMarketplaceChannelsRequest(input, init);
    await readRequestBodyText(sanitizedRequest.input, sanitizedRequest.init);
    const nextRequest = await withMarketplaceModelPricingFields(sanitizedRequest.input, sanitizedRequest.init);
    if (isMarketplaceChannelsUrl(requestUrl(nextRequest.input))) lastMarketplaceChannelsFetchAt = Date.now();
    rememberRequestHeaders(nextRequest.input, nextRequest.init);
    const response = await nativeFetch(nextRequest.input, nextRequest.init);
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

  function rememberRequestHeaders(input, init) {
    if (!requestPath(input).startsWith("/admin/")) return;
    const headers = new Headers(init?.headers || input?.headers || {});
    const auth = headers.get("authorization");
    const projectID = headers.get("x-project-id");
    if (auth) graphqlHeaders.authorization = auth;
    if (projectID) graphqlHeaders.projectID = projectID;
  }

  function rememberResponseChannels(response) {
    if (!isJsonResponse(response)) return;
    response.clone().json().then((payload) => {
      const changed = rememberChannelsFromPayload(payload);
      rememberModelProviderPricesFromPayload(payload);
      rememberRequestLogMultipliers(payload);
      if (changed) schedulePanel();
    }).catch(() => {});
  }

  function rememberRequestLogMultipliers(payload) {
    const edges = payload?.data?.requests?.edges;
    if (!Array.isArray(edges)) return;
    for (const edge of edges) {
      const node = edge?.node;
      if (!node?.id) continue;
      const usageLog = node?.usageLogs?.edges?.[0]?.node;
      const lines = usageLog?.costExplanation?.lines;
      if (!Array.isArray(lines)) continue;
      const multiplier = lines.find((line) => line?.multiplier != null)?.multiplier;
      if (multiplier == null) continue;
      const numericID = requestLogNumericID(node.id);
      if (numericID == null) continue;
      requestLogMultiplierCache.set(numericID, multiplier);
    }
  }

  function requestLogNumericID(requestID) {
    const match = String(requestID || "").match(/gid:\/\/axonhub\/Request\/(\d+)$/);
    return match ? Number(match[1]) : null;
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
    let filteredPayload = payload;
    if (mode !== "all") {
      if (isMarketplaceChannelsUrl(requestUrl(input))) {
        filteredPayload = await loadFilteredMarketplaceChannelsPayload(input, init, filteredPayload, mode);
      } else {
        filteredPayload = await filterMarketplacePayloadByPrice(filteredPayload, mode);
      }
    }
    filteredPayload = filterMarketplacePayloadByOfficial(filteredPayload, selectedOfficialFilter);
    rememberChannelsFromPayload(filteredPayload);
    return filteredPayload;
  }

  function shouldFilterMarketplaceResponse(input, init, response) {
    if (isMarketplaceChannelsUrl(requestUrl(input))) return true;
    return isGraphqlMarketplaceModelRequest(input, init, response)
      || isGraphqlChannelModelPricesRequest(input, init, response);
  }

  function isMarketplaceChannelsUrl(url) {
    return requestPath(url) === "/admin/marketplace/channels";
  }

  function isGraphqlMarketplaceModelRequest(input, init, response) {
    if (requestPath(input) !== GRAPHQL_PATH) return false;
    if (!location.pathname.startsWith("/marketplace/models/")) return false;
    if (response?.headers?.get?.("content-type") && !isJsonResponse(response)) return false;
    const body = requestBodyText(input, init);
    return isMarketplaceModelRequestBody(body);
  }

  function isGraphqlChannelModelPricesRequest(input, init, response) {
    if (requestPath(input) !== GRAPHQL_PATH) return false;
    if (!location.pathname.startsWith("/marketplace")) return false;
    if (response?.headers?.get?.("content-type") && !isJsonResponse(response)) return false;
    const body = requestBodyText(input, init);
    const operationName = graphqlOperationName(body);
    return operationName === "ChannelModelPrices"
      || /query\s+ChannelModelPrices\b/.test(body);
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

const MARKETPLACE_CHANNEL_TAB_RE = /渠道广场|channel/i;
const MARKETPLACE_CHANNELS_ROOT_RE = /渠道广场|按渠道名称|全部标签/i;
const MARKETPLACE_TAGS_LABEL_RE = /^(标签|tags?)$/i;
const MARKETPLACE_SORT_LABEL_RE = /^(排序|sort)$/i;
const MARKETPLACE_HEALTH_LABEL_RE = /^(健康序列|health(?:\s+window|\s+sequence)?)$/i;
const MARKETPLACE_VERIFICATION_ACTION_RE = /^(真伪核验|Authenticity\s+Check|Verify\s+Authenticity)$/i;
const MARKETPLACE_SEARCH_PLACEHOLDER_RE = /渠道名称|支持模型|search/i;
const REQUESTS_API_KEY_LABEL = "API密钥";
const REQUEST_LOG_CHANNEL_HEADER_RE = /^(渠道|channel)$/i;
const MARKETPLACE_FREE_SORT_TEXT = "倍率从低到高";
const MARKETPLACE_DEFAULT_SORT_TEXT = "综合推荐";

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

function findApiKeyActionButtons() {
  return Array.from(document.querySelectorAll("main button")).filter(isApiKeyActionButton);
}

function findChannelActionButtons() {
  return Array.from(document.querySelectorAll("main button")).filter((button) =>
    isApiKeyActionButton(button) || isTriggerButton(button),
  );
}

function isApiKeyActionButton(node) {
  return !isTriggerButton(node) && isApiKeyActionButtonText(node.textContent || "");
}

function isApiKeyActionButtonText(text) {
  const normalizedText = cleanText(text);
  return API_KEY_CREATE_ACTION_RE.test(normalizedText) || API_KEY_EXISTING_ACTION_RE.test(normalizedText);
}

function isExistingApiKeyActionButtonText(text) {
  return API_KEY_EXISTING_ACTION_RE.test(cleanText(text));
}

function isTriggerButton(node) {
  return Boolean(node?.classList?.contains(TRIGGER_CLASS));
}

function selectPreferredApiKeyActionButton(buttons) {
  return buttons.find((button) => isExistingApiKeyActionButtonText(button.textContent || "")) || buttons[0] || null;
}

function replaceApiKeyActionButtons() {
  const buttonsByContext = new Map();
  for (const button of findApiKeyActionButtons()) {
    const context = findChannelContext(button);
    if (!context) continue;
    const contextButtons = buttonsByContext.get(context) || [];
    contextButtons.push(button);
    buttonsByContext.set(context, contextButtons);
  }

  for (const [context, buttons] of buttonsByContext) {
    const existingTrigger = context.querySelector?.(`.${TRIGGER_CLASS}`);
    if (existingTrigger) {
      buttons.forEach((button) => button.remove?.());
      moveChannelTriggerToActionEnd(existingTrigger);
      continue;
    }

    const anchor = selectPreferredApiKeyActionButton(buttons);
    if (!anchor) continue;
    const channel = findChannelFromButton(anchor);
    if (!channel.id) continue;

    buttons.forEach((button) => {
      if (button !== anchor) button.remove?.();
    });
    replaceApiKeyActionButton(anchor, channel);
  }
}

function removeMarketplaceVerificationButtons() {
  if (!location.pathname.startsWith("/marketplace")) return;
  for (const button of document.querySelectorAll("main button")) {
    if (isMarketplaceVerificationButtonText(button.textContent || "")) button.remove?.();
  }
}

function isMarketplaceVerificationButtonText(text) {
  return MARKETPLACE_VERIFICATION_ACTION_RE.test(cleanText(text));
}

function replaceApiKeyActionButton(anchor, channel = findChannelFromButton(anchor)) {
  if (!channel.id) return;
  const trigger = createTrigger(channel);
  anchor.replaceWith(trigger);
  moveChannelTriggerToActionEnd(trigger);
}

function moveChannelTriggerToActionEnd(trigger) {
  const actionContainer = trigger?.parentElement;
  if (!actionContainer || actionContainer.lastElementChild === trigger) return;
  actionContainer.append(trigger);
}

function createTrigger(channel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${TRIGGER_CLASS} ${CHANNEL_TRIGGER_CLASS}`;
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"></circle><path d="m11 12 9-9"></path><path d="m16 4 4 4"></path></svg><span>更新 API 密钥</span>`;
  button.setAttribute("aria-label", `更新 ${channel.name || "当前渠道"} 的 API 密钥`);
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

function findCardChannelName(node) {
  return node.closest('[data-slot="card"]')?.querySelector('[data-slot="card-title"]')?.textContent?.trim() || "";
}

function findChannelFromButton(node) {
  const name = findVisibleChannelName(node);
  const channel = findCachedChannel(name) || findDirectReactChannel(node) || {};
  return {
    id: channel.id ? String(channel.id) : "",
    name: channel.name || name,
  };
}

function findVisibleChannelName(node) {
  const context = findChannelContext(node);
  return findCardChannelName(node) || findChannelNameFromText(context ? textBeforeButton(context, node) : "");
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

function insertPriceFilter() {
  if (!location.pathname.startsWith("/marketplace")) {
    resetPriceFilterState();
    removePriceFilterField();
    removeModelIDFilterField();
    return;
  }
  const anchors = findMarketplaceFilterFields();
  if (!isMarketplaceChannelsTabActive() && !anchors.tags) {
    removePriceFilterField();
    removeModelIDFilterField();
    return;
  }
  const filterAnchor = anchors.health || anchors.sort || anchors.tags;
  if (!filterAnchor) return;
  let field = document.getElementById(PRICE_FIELD_ID);
  if (!field) field = createPriceFilterField();
  const previousParent = field.parentElement;
  const filterGrid = movePriceFilterToEndOfGrid(filterAnchor, field);
  if (!filterGrid) return;
  ensureModelIDFilterField(filterGrid);
  if (previousParent && previousParent !== filterGrid) {
    previousParent.classList?.remove?.("hkb-marketplace-filter-grid");
  }
  markMarketplaceFilterGrid(filterGrid);
  cleanupMarketplaceSearchInput();
  syncPriceFilterField(field);
}

function movePriceFilterToEndOfGrid(filterAnchor, priceFilterField) {
  const filterGrid = filterAnchor?.parentElement;
  if (!filterGrid) return null;
  if (priceFilterField.parentElement !== filterGrid || filterGrid.lastElementChild !== priceFilterField) {
    filterGrid.append(priceFilterField);
  }
  return filterGrid;
}

function removePriceFilterField() {
  const field = document.getElementById(PRICE_FIELD_ID);
  const parent = field?.parentElement;
  field?.remove?.();
  parent?.classList?.remove?.("hkb-marketplace-filter-grid");
  document.querySelectorAll?.(".hkb-marketplace-filter-grid")?.forEach?.((grid) => {
    grid.classList?.remove?.("hkb-marketplace-filter-grid");
  });
}

function markMarketplaceFilterGrid(activeGrid) {
  document.querySelectorAll?.(".hkb-marketplace-filter-grid")?.forEach?.((grid) => {
    if (grid !== activeGrid) grid.classList?.remove?.("hkb-marketplace-filter-grid");
  });
  activeGrid?.classList?.add?.("hkb-marketplace-filter-grid");
}

function isMarketplaceChannelsTabActive() {
  if (!location.pathname.startsWith("/marketplace")) return false;
  const root = document.querySelector("main") || document;
  const selected = root.querySelector('[role="tab"][aria-selected="true"], [role="tab"][data-state="active"]');
  return !selected || MARKETPLACE_CHANNEL_TAB_RE.test(String(selected.textContent || ""));
}

function findMarketplaceFilterFields(fields = Array.from(marketplaceChannelsRoot().querySelectorAll("label, p, div, span"))) {
  return {
    tags: filterFieldByLabel(fields, MARKETPLACE_TAGS_LABEL_RE),
    sort: filterFieldByLabel(fields, MARKETPLACE_SORT_LABEL_RE),
    health: filterFieldByLabel(fields, MARKETPLACE_HEALTH_LABEL_RE),
  };
}

function marketplaceChannelsRoot() {
  const main = document.querySelector("main") || document;
  const panels = Array.from(main.querySelectorAll?.('[role="tabpanel"], [data-slot="tabs-content"]') || []);
  return panels.find((panel) => isElementVisible(panel) && MARKETPLACE_CHANNELS_ROOT_RE.test(String(panel.textContent || ""))) || main;
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
  const normalized = cleanText(text);
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

function currentOfficialFilter() {
  return selectedOfficialFilter;
}

function createModelIDFilterField() {
  const field = document.createElement("div");
  field.id = MODEL_ID_FIELD_ID;
  field.className = "space-y-1";
  field.dataset.hubToolModelIDFilter = "true";
  field.innerHTML = `<p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">模型 ID</p>
    <div class="hkb-model-id-wrap">
      <button type="button" id="${MODEL_ID_SELECT_ID}" class="hkb-model-id-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="按模型 ID 筛选渠道">
        <span class="hkb-model-id-value">全部（不过滤）</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </button>
      <div class="hkb-model-id-menu" role="listbox" aria-label="模型 ID 选项" hidden></div>
    </div>`;
  field.querySelector("button").addEventListener("click", handleModelIDTriggerClick);
  field.querySelector("[role=\"listbox\"]").addEventListener("click", handleModelIDOptionClick);
  ensureModelIDMenuGlobalHandler();
  return field;
}

function syncModelIDFilterField(field) {
  if (!field) return;
  const trigger = field.querySelector(`#${MODEL_ID_SELECT_ID}`);
  const menu = field.querySelector('[role="listbox"]');
  if (!trigger || !menu) return;
  const options = marketplaceModelIDOptions;
  const nextValue = isModelIDFilterAll() ? MODEL_ID_ALL_VALUE : currentSelectedModelID();
  const nextSignature = `${options.__signature || ""}|${nextValue}`;
  const wrap = trigger.parentElement;
  if (wrap.dataset.hubToolSignature === nextSignature) return;
  wrap.dataset.hubToolSignature = nextSignature;
  const optionLabel = (option) => `${option.value}（${option.serves}）`;
  const selected = options.find((option) => option.value === nextValue);
  const label = nextValue === MODEL_ID_ALL_VALUE ? "全部（不过滤）" : selected ? optionLabel(selected) : nextValue;
  trigger.querySelector(".hkb-model-id-value").textContent = label;
  trigger.title = label;
  menu.textContent = "";
  const entries = [{ value: MODEL_ID_ALL_VALUE, label: "全部（不过滤）" },
    ...options.map((option) => ({ value: option.value, label: optionLabel(option) }))];
  for (const entry of entries) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "hkb-model-id-option";
    element.setAttribute("role", "option");
    element.dataset.value = entry.value;
    element.setAttribute("aria-selected", String(entry.value === nextValue));
    element.innerHTML = `<span></span>`;
    element.querySelector("span").textContent = entry.label;
    menu.append(element);
  }
}

function handleModelIDTriggerClick(event) {
  const trigger = event.currentTarget;
  const menu = trigger.parentElement.querySelector('[role="listbox"]');
  if (!menu) return;
  const open = menu.hidden;
  closeAllModelIDMenus();
  setModelIDMenuOpen(menu, open);
}

function handleModelIDOptionClick(event) {
  const option = event.target?.closest?.("[data-value]");
  if (!option) return;
  const menu = event.currentTarget;
  setModelIDMenuOpen(menu, false);
  const value = option.dataset.value || "";
  setModelIDFilter(value === currentMarketplaceModelID() ? "" : value);
}

function setModelIDMenuOpen(menu, open) {
  menu.hidden = !open;
  menu.parentElement?.querySelector(`#${MODEL_ID_SELECT_ID}`)?.setAttribute("aria-expanded", String(open));
}

function closeAllModelIDMenus() {
  document.querySelectorAll(`#${MODEL_ID_FIELD_ID} [role="listbox"]`).forEach((menu) => {
    if (!menu.hidden) setModelIDMenuOpen(menu, false);
  });
}

function ensureModelIDMenuGlobalHandler() {
  if (ensureModelIDMenuGlobalHandler.bound) return;
  ensureModelIDMenuGlobalHandler.bound = true;
  document.addEventListener("click", (event) => {
    document.querySelectorAll(`#${MODEL_ID_FIELD_ID} .hkb-model-id-wrap`).forEach((wrap) => {
      const menu = wrap.querySelector('[role="listbox"]');
      if (menu && !menu.hidden && !wrap.contains(event.target)) setModelIDMenuOpen(menu, false);
    });
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModelIDMenus();
  }, true);
}

function setModelIDFilter(value) {
  const next = value === MODEL_ID_ALL_VALUE ? MODEL_ID_ALL_VALUE : String(value || "");
  if (next === selectedMarketplaceModelID) return;
  selectedMarketplaceModelID = next;
  syncModelIDFilterField(document.getElementById(MODEL_ID_FIELD_ID));
  applyVisiblePriceFilter();
}

function syncModelIDFilterPageContext() {
  const isModelPage = location.pathname.startsWith("/marketplace/models/");
  const current = isModelPage ? location.pathname : "";
  if (current === modelIDFilterPathname) return;
  modelIDFilterPathname = current;
  selectedMarketplaceModelID = "";
  syncModelIDFilterField(document.getElementById(MODEL_ID_FIELD_ID));
}

function ensureModelIDFilterField(filterGrid) {
  if (!location.pathname.startsWith("/marketplace/models/")) {
    removeModelIDFilterField();
    return;
  }
  let field = document.getElementById(MODEL_ID_FIELD_ID);
  if (!field) field = createModelIDFilterField();
  if (field.parentElement !== filterGrid) filterGrid.append(field);
  syncModelIDFilterField(field);
}

function removeModelIDFilterField() {
  document.getElementById(MODEL_ID_FIELD_ID)?.remove?.();
}

function createPriceFilterField() {
  const field = document.createElement("div");
  field.id = PRICE_FIELD_ID;
  field.className = "space-y-1";
  field.dataset.hubToolPriceFilter = "true";
  field.innerHTML = `<p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">渠道筛选</p>
    <div class="hkb-filter-buttons" role="group" aria-label="渠道筛选">
      <button type="button" class="hkb-price-button inline-flex items-center justify-center whitespace-nowrap outline-none" data-role="price-filter" data-price="free" aria-label="只看免费渠道">免费</button>
      <button type="button" class="hkb-price-button inline-flex items-center justify-center whitespace-nowrap outline-none" data-role="official-filter" aria-label="只看官方渠道">官方</button>
    </div>`;
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
  const official = currentOfficialFilter();
  field.querySelectorAll('[data-role="official-filter"]').forEach((button) => {
    button.setAttribute("aria-pressed", String(official));
  });
}

function handlePriceFilterClick(event) {
  const officialButton = event.target?.closest?.('[data-role="official-filter"]');
  if (officialButton) {
    setOfficialFilter(!selectedOfficialFilter);
    return;
  }
  const button = event.target?.closest?.("[data-price]");
  if (!button) return;
  setPriceFilter(currentPriceFilter() === button.dataset.price ? "all" : button.dataset.price);
}

function setOfficialFilter(value) {
  const official = Boolean(value);
  if (official === selectedOfficialFilter) return;
  selectedOfficialFilter = official;
  syncPriceFilterField(document.getElementById(PRICE_FIELD_ID));
  applyVisiblePriceFilter();
  triggerMarketplaceRefresh();
}

function resetOfficialFilterState() {
  if (!selectedOfficialFilter) return;
  selectedOfficialFilter = false;
  applyVisiblePriceFilter();
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
  const targetSort = currentPriceFilter() === "free" ? MARKETPLACE_FREE_SORT_TEXT : MARKETPLACE_DEFAULT_SORT_TEXT;
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

function resetPriceFilterState() {
  const priceChanged = selectedPriceFilter !== "all";
  const officialChanged = selectedOfficialFilter;
  if (priceChanged) selectedPriceFilter = "all";
  if (officialChanged) selectedOfficialFilter = false;
  if (!priceChanged && !officialChanged) return;
  applyVisiblePriceFilter();
}function findMarketplaceSortTrigger() {
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
    MARKETPLACE_SEARCH_PLACEHOLDER_RE.test(String(input.placeholder || "")),
  ) || null;
}

function applyVisiblePriceFilter() {
  if (!location.pathname.startsWith("/marketplace/models/")) return;
  const mode = currentPriceFilter();
  const official = currentOfficialFilter();
  const idFilterEnabled = !isModelIDFilterAll();
  for (const button of findChannelActionButtons()) {
    const context = findChannelContext(button);
    const channel = findActionButtonChannel(button);
    const state = modelProviderFreeState(channel);
    const officialState = modelProviderOfficialState(channel);
    const priceHidden = mode !== "all" && state !== null && !priceStateMatches(state, mode);
    const officialHidden = official && officialState === false;
    const idHidden = idFilterEnabled && !providerServesSelectedModelID(channel);
    const hidden = priceHidden || officialHidden || idHidden;
    if (context) context.dataset.hubToolPriceHidden = hidden ? "true" : "false";
  }
}

function findActionButtonChannel(button) {
  if (isTriggerButton(button)) {
    return { id: button.dataset.channelId || "", name: button.dataset.channelName || "" };
  }
  return findChannelFromButton(button);
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

function injectRequestLogMultiplierColumn() {
  if (!isRequestsConsumerRoute()) {
    removeRequestLogMultiplierColumn();
    return;
  }
  const table = document.querySelector("main table");
  if (!table) return;
  const channelColumnIndex = requestLogChannelColumnIndex(table);
  if (channelColumnIndex < 0) {
    removeRequestLogMultiplierColumn();
    return;
  }
  ensureRequestLogMultiplierHeader(table, channelColumnIndex);
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  for (const row of rows) {
    injectRequestLogMultiplierRow(row, channelColumnIndex);
  }
}

function removeRequestLogMultiplierColumn() {
  document.querySelectorAll?.(`.${MULTIPLIER_COLUMN_CLASS}`).forEach((cell) => cell.remove?.());
  document.querySelectorAll?.(`.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}`).forEach((cell) => {
    cell.classList?.remove?.(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
    if (cell.tagName === "TD") cell.removeAttribute?.("title");
  });
}

function ensureRequestLogMultiplierHeader(table, channelColumnIndex) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  const channelHeader = headers[channelColumnIndex];
  if (!channelHeader) return;
  channelHeader.classList.add(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
  const multiplierHeaders = headers.filter((header) => header?.classList?.contains?.(MULTIPLIER_COLUMN_CLASS));
  multiplierHeaders.slice(1).forEach((header) => header.remove?.());
  let header = multiplierHeaders[0];
  if (!header) {
    header = document.createElement("th");
    header.className = `${channelHeader.className || "h-10 px-2 text-left align-middle whitespace-nowrap"} ${MULTIPLIER_COLUMN_CLASS} ${MULTIPLIER_COLUMN_HEADER_CLASS}`;
    header.textContent = "倍率";
    header.setAttribute("aria-label", "倍率");
  } else {
    header.classList.add(MULTIPLIER_COLUMN_HEADER_CLASS);
  }
  if (header.parentElement !== channelHeader.parentElement || header.previousElementSibling !== channelHeader) {
    channelHeader.parentElement.insertBefore(header, channelHeader.nextElementSibling);
  }
}

function injectRequestLogMultiplierRow(row, channelColumnIndex) {
  const cells = Array.from(row.children);
  if (!cells.length) return;
  const channelCell = cells[channelColumnIndex];
  if (!channelCell) return;
  constrainRequestLogChannelCell(channelCell);
  const multiplierCells = cells.filter((cell) => cell?.classList?.contains?.(MULTIPLIER_COLUMN_CLASS));
  multiplierCells.slice(1).forEach((cell) => cell.remove?.());
  let cell = multiplierCells[0];
  if (!cell) {
    cell = document.createElement("td");
    cell.className = `${channelCell.className || "p-2 align-middle whitespace-nowrap"} ${MULTIPLIER_COLUMN_CLASS}`;
  }
  if (cell.parentElement !== channelCell.parentElement || cell.previousElementSibling !== channelCell) {
    channelCell.parentElement.insertBefore(cell, channelCell.nextElementSibling);
  }
  applyRequestLogMultiplierCellContent(cell, row);
}

function applyRequestLogMultiplierCellContent(cell, row) {
  const requestID = requestLogIDFromRow(row);
  const multiplier = requestID == null ? null : requestLogMultiplierCache.get(requestID);
  cell.classList.remove(MULTIPLIER_LOW_TONE_CLASS, MULTIPLIER_HIGH_TONE_CLASS);
  if (multiplier == null) {
    if (cell.textContent !== "-") {
      cell.textContent = "-";
      cell.removeAttribute?.("title");
      cell.setAttribute("aria-label", "渠道倍率未知");
    }
    return;
  }
  const formattedMultiplier = formatMultiplier(multiplier);
  if (multiplierTone(formattedMultiplier) === "low") cell.classList.add(MULTIPLIER_LOW_TONE_CLASS);
  if (multiplierTone(formattedMultiplier) === "high") cell.classList.add(MULTIPLIER_HIGH_TONE_CLASS);
  const text = `×${formattedMultiplier}`;
  const title = `渠道倍率：${formattedMultiplier}`;
  if (cell.textContent === text && cell.title === title) return;
  cell.textContent = text;
  cell.title = title;
  cell.setAttribute("aria-label", `渠道倍率 ${formattedMultiplier}`);
}

function constrainRequestLogChannelCell(channelCell) {
  if (!channelCell) return;
  channelCell.classList.add(REQUEST_LOG_CHANNEL_COLUMN_CLASS);
  const channelName = cleanText(channelCell.textContent);
  if (channelName) channelCell.setAttribute("title", channelName);
}

function multiplierTone(multiplier) {
  if (multiplier == null || multiplier === "") return "mid";
  const value = Number(multiplier);
  if (!Number.isFinite(value)) return "mid";
  if (value < 1) return "low";
  if (value > 2) return "high";
  return "mid";
}

function requestLogChannelColumnIndex(table) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  const index = headers.findIndex((th) => REQUEST_LOG_CHANNEL_HEADER_RE.test(cleanText(th.textContent)));
  return index < 0 ? -1 : index;
}

function requestLogIDFromRow(row) {
  const idCell = row.children[0];
  const text = cleanText(idCell?.textContent || "");
  const match = text.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function formatMultiplier(multiplier) {
  const value = Number(multiplier);
  if (!Number.isFinite(value)) return String(multiplier ?? "");
  const normalizedValue = Number(value.toFixed(4));
  return Number.isInteger(normalizedValue) ? normalizedValue.toFixed(1) : String(normalizedValue);
}

function isRequestsConsumerRoute() {
  if (!location.pathname.startsWith("/project/requests")) return false;
  const view = new URLSearchParams(location.search || "").get("view");
  return !view || view === "consumer";
}

function findRequestsApiKeyFilterButton() {
  return Array.from(document.querySelectorAll("main button"))
    .find((button) => cleanText(button.textContent) === REQUESTS_API_KEY_LABEL);
}

function createRequestEditTrigger(anchor) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "更新 API 密钥";
  button.className = anchor.className
    || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-8 rounded-md px-3";
  button.classList.add(TRIGGER_CLASS, REQUEST_TRIGGER_CLASS);
  button.addEventListener("click", openRequestEditDialog);
  return button;
}

function ensurePanel() {
  syncModelIDFilterPageContext();
  injectStyle();
  replaceApiKeyActionButtons();
  removeMarketplaceVerificationButtons();
  insertRequestTriggers();
  injectRequestLogMultiplierColumn();
  insertPriceFilter();
  applyVisiblePriceFilter();
}

function schedulePanel() {
  if (!isTargetRoute()) return;
  if (mountTimer) return;
  mountTimer = requestFrame(() => {
    mountTimer = 0;
    ensurePanel();
  });
}

function requestFrame(callback) {
  return typeof requestAnimationFrame === "function" ? requestAnimationFrame(callback) : setTimeout(callback, 16);
}

function isTargetRoute(pathname = location.pathname) {
  return pathname.startsWith("/marketplace")
    || pathname.startsWith("/project/api-keys")
    || pathname.startsWith("/project/requests");
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

function moveChannelIDToIndex(channelIDs, channelID, targetIndex) {
  const numericID = extractNumericChannelID(channelID);
  const currentIndex = channelIDs.indexOf(numericID);
  const nextIndex = Math.max(0, Math.min(channelIDs.length - 1, Number(targetIndex) || 0));
  if (!numericID || currentIndex < 0 || currentIndex === nextIndex) return channelIDs;
  const nextIDs = [...channelIDs];
  const [item] = nextIDs.splice(currentIndex, 1);
  nextIDs.splice(nextIndex, 0, item);
  return nextIDs;
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

function renderKeyOptions() {
  if (!keysCache.some((key) => key.id === selectedKeyID)) selectedKeyID = keysCache[0]?.id || "";
  document.querySelectorAll(`#${DIALOG_ID} [data-role="key-menu"], #${DIALOG_ID} [data-role="edit-key-menu"]`).forEach((menu) => {
    menu.innerHTML = keysCache.length
      ? keysCache.map((key) => `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="${escapeHtml(key.id)}" role="option" aria-selected="${String(key.id === selectedKeyID)}"><span>${escapeHtml(keyLabel(key))}</span>${renderKeyStatusBadge(key)}</button></li>`).join("")
      : `<li><button type="button" class="hkb-key-option" data-action="select-key" data-key-id="" role="option" disabled>暂无 API Key</button></li>`;
  });
  syncKeyPicker();
}

const KEY_STATUS_LABELS = { enabled: "已启用", disabled: "已禁用", archived: "已归档" };

function keyStatusText(key) {
  return KEY_STATUS_LABELS[key?.status] || "";
}

// archived 为防御性保留：loadKeys 的 statusIn 过滤当前不含 archived。
function renderKeyStatusBadge(key) {
  const status = key?.status;
  const text = KEY_STATUS_LABELS[status];
  if (!text || status === "enabled") return "";
  return `<span class="hkb-key-status" data-status="${escapeHtml(status)}">${text}</span>`;
}

function keyLabel(key) {
  return String(key?.name || key?.id || "未命名 API Key");
}

function selectKey(keyID) {
  if (!keyID || !keysCache.some((key) => key.id === keyID)) return;
  selectedKeyID = keyID;
  syncKeyPicker();
}

function syncKeyPicker() {
  const current = keysCache.find((key) => key.id === selectedKeyID);
  const statusText = keyStatusText(current);
  document.querySelectorAll(`#${DIALOG_ID} [data-role="key-label"], #${DIALOG_ID} [data-role="edit-key-label"]`).forEach((label) => {
    label.textContent = current ? `${keyLabel(current)}${statusText ? `（${statusText}）` : ""}` : "暂无 API Key";
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

const EDIT_CHANNEL_ROW_STEP = 40;
const EDIT_CHANNEL_ROW_HEIGHT = 36;
const EDIT_DRAG_SCROLL_EDGE = 34;
const EDIT_DRAG_SCROLL_SPEED = 4.3;

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

function clampEditChannelIndex(index) {
  return Math.max(0, Math.min(editChannelIDs.length - 1, index));
}

function handleEditChannelDragStart(event) {
  const handle = event.target?.closest?.('[data-action="edit-drag-channel"]');
  if (!handle) return;
  const numericID = extractNumericChannelID(handle.dataset.channelId || "");
  const currentIndex = editChannelIDs.indexOf(numericID);
  const list = handle.closest?.('[data-role="edit-channel-list"]');
  if (!numericID || currentIndex < 0 || !list) return;
  const listRect = list.getBoundingClientRect();
  const rowRect = handle.closest?.(".hkb-channel-row")?.getBoundingClientRect?.();
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget?.setPointerCapture?.(event.pointerId);
  editDragState = {
    channelID: numericID,
    pointerID: event.pointerId,
    pointerY: event.clientY,
    listTop: listRect.top,
    scrollTop: list.scrollTop || 0,
    grabOffsetY: event.clientY - (rowRect?.top || (listRect.top + currentIndex * EDIT_CHANNEL_ROW_STEP)),
    targetIndex: currentIndex,
  };
  renderEditChannelList();
  setEditStatus("");
}

function handleEditChannelDragMove(event) {
  if (!editDragState || editDragState.pointerID !== event.pointerId) return;
  const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
  if (!list || !editChannelIDs.length) return;
  const listRect = list.getBoundingClientRect();
  if (event.clientY - listRect.top < EDIT_DRAG_SCROLL_EDGE) {
    list.scrollTop = Math.max(0, (list.scrollTop || 0) - EDIT_DRAG_SCROLL_SPEED);
  } else if (listRect.bottom - event.clientY < EDIT_DRAG_SCROLL_EDGE) {
    list.scrollTop = Math.min(list.scrollHeight - list.clientHeight, (list.scrollTop || 0) + EDIT_DRAG_SCROLL_SPEED);
  }
  const scrollTop = list.scrollTop || 0;
  const contentY = event.clientY - listRect.top + scrollTop;
  editDragState = {
    ...editDragState,
    pointerY: event.clientY,
    listTop: listRect.top,
    scrollTop,
    targetIndex: clampEditChannelIndex(Math.floor(contentY / EDIT_CHANNEL_ROW_STEP)),
  };
  event.preventDefault();
  renderEditChannelList();
}

function handleEditChannelDragEnd(event) {
  if (!editDragState || editDragState.pointerID !== event.pointerId) return;
  const nextIDs = moveChannelIDToIndex(editChannelIDs, editDragState.channelID, editDragState.targetIndex);
  const changed = nextIDs !== editChannelIDs;
  editChannelIDs = nextIDs;
  editDragState = null;
  event.currentTarget?.releasePointerCapture?.(event.pointerId);
  renderEditChannelList();
  if (changed) setEditDirty(true);
  setEditStatus(changed ? "已调整" : "");
}

function cancelEditChannelDrag(event) {
  if (!editDragState || (event?.pointerId != null && editDragState.pointerID !== event.pointerId)) return;
  editDragState = null;
  renderEditChannelList();
  setEditStatus("");
}

function renderEditChannelList() {
  const list = document.querySelector(`#${DIALOG_ID} [data-role="edit-channel-list"]`);
  if (!list) return;
  if (!editChannelIDs.length) {
    editDragState = null;
    list.innerHTML = `<div class="hkb-empty">暂无绑定渠道</div>`;
    return;
  }
  list.innerHTML = renderEditChannelStage();
}

function renderEditChannelStage() {
  const dragIndex = editDragState ? editChannelIDs.indexOf(editDragState.channelID) : -1;
  const dragChannelID = dragIndex >= 0 ? editDragState.channelID : null;
  const targetIndex = dragChannelID ? clampEditChannelIndex(editDragState.targetIndex) : -1;
  const visibleIDs = dragChannelID ? editChannelIDs.filter((id) => id !== dragChannelID) : editChannelIDs;
  const slots = visibleIDs.map((id, visibleIndex) => {
    const displayIndex = dragChannelID && visibleIndex >= targetIndex ? visibleIndex + 1 : visibleIndex;
    return `<div class="hkb-channel-slot" style="top:${displayIndex * EDIT_CHANNEL_ROW_STEP}px">${renderEditChannelRow(id)}</div>`;
  }).join("");
  const placeholder = dragChannelID
    ? `<div class="hkb-channel-placeholder" style="top:${targetIndex * EDIT_CHANNEL_ROW_STEP}px;height:${EDIT_CHANNEL_ROW_HEIGHT}px"></div>`
    : "";
  const dragTop = dragChannelID
    ? Math.max(0, Math.min((editChannelIDs.length - 1) * EDIT_CHANNEL_ROW_STEP, editDragState.pointerY - editDragState.listTop + editDragState.scrollTop - editDragState.grabOffsetY))
    : 0;
  const dragging = dragChannelID
    ? `<div class="hkb-channel-slot" style="top:${dragTop}px;z-index:2;transition:none">${renderEditChannelRow(dragChannelID, { dragging: true })}</div>`
    : "";
  return `<div class="hkb-channel-list-stage" style="height:${editChannelIDs.length * EDIT_CHANNEL_ROW_STEP}px">${slots}${placeholder}${dragging}</div>`;
}

function renderEditChannelRow(channelID, options = {}) {
  const safeID = escapeHtml(channelID);
  const rowClass = options.dragging ? "hkb-channel-row is-dragging" : "hkb-channel-row";
  return `<div class="${rowClass}" data-channel-id="${safeID}">
    <button type="button" class="hkb-drag-handle" data-action="edit-drag-channel" data-channel-id="${safeID}" title="拖动排序" aria-label="拖动排序">::</button>
    <span class="hkb-channel-name">${escapeHtml(channelLabel(channelID))}</span>
    <span class="hkb-channel-actions">
      <button type="button" class="hkb-icon-btn hkb-row-btn hkb-remove" data-action="edit-remove-channel" data-channel-id="${safeID}" title="移除" aria-label="移除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>
    </span>
  </div>`;
}

function channelLabel(channelID) {
  const id = String(channelID || "");
  const channel = findCachedChannelByID(id);
  return channel?.name || (id ? `Channel #${extractNumericChannelID(id) || id}` : "未读取到当前渠道");
}

function setEditStatus(message) {
  const status = document.querySelector(`#${DIALOG_ID} [data-role="edit-status"]`);
  if (status) status.textContent = message;
}

function setEditDirty(isDirty) {
  editDirty = Boolean(isDirty);
  const saveButton = document.querySelector(`#${DIALOG_ID} [data-action="save-edit"]`);
  if (saveButton) saveButton.dataset.dirty = String(editDirty);
}

function markScrolling(node) {
  node.classList.add("is-scrolling");
  clearTimeout(node.__hkbScrollTimer);
  node.__hkbScrollTimer = setTimeout(() => node.classList.remove("is-scrolling"), 700);
}

async function updateExistingKeyBinding(mode) {
  const result = await bindChannelToKey(selectedKeyID, currentChannelID(), mode);
  if (mode === "append" && result.alreadyBound) {
    setStatus("当前渠道已在选中 Key 的绑定列表中");
    return;
  }
  const suffix = result.enabledKey ? "（Key 已自动启用）" : "";
  setStatus(`${mode === "replace" ? "已替换选中 Key 的渠道绑定" : "已追加当前渠道到选中 Key"}${suffix}`);
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
  const enabledKey = await ensureKeyEnabledForBinding(keyID, data.node.status);
  setStatus("正在写入渠道绑定");
  const input = buildProfilesInput(data.node.profiles, numericChannelID, mode);
  await graphql(queries.updateProfiles, { id: keyID, input }, "UpdateAPIKeyProfiles");
  return { alreadyBound: mode === "append" && getActiveProfile(data.node.profiles).channelIDs?.includes(numericChannelID), enabledKey };
}

async function ensureKeyEnabledForBinding(keyID, status) {
  if (status !== "disabled") return false;
  setStatus("Key 处于禁用状态，正在启用");
  await graphql(queries.updateKeyStatus, { id: keyID, status: "enabled" }, "UpdateAPIKeyStatus");
  updateCachedKeyStatus(keyID, "enabled");
  return true;
}

function updateCachedKeyStatus(keyID, status) {
  const key = keysCache.find((entry) => entry.id === keyID);
  if (!key) return;
  key.status = status;
  renderKeyOptions();
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
  const channelLabelElement = dialog.querySelector("[data-role='edit-channel-label']");
  if (channelLabelElement) channelLabelElement.textContent = channelID ? channelLabel(channelID) : "未指定";
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

async function saveEditBindings() {
  if (!selectedKeyID) throw new Error("请先选择 API Key");
  setEditStatus("保存中");
  const data = await graphql(queries.getKey, { id: selectedKeyID }, "GetApiKey");
  if (!data.node?.profiles) throw new Error("未读取到 Key profiles");
  const enabledKey = await ensureKeyEnabledForBinding(selectedKeyID, data.node.status);
  const input = buildProfilesInputWithChannelIDs(data.node.profiles, editChannelIDs);
  await graphql(queries.updateProfiles, { id: selectedKeyID, input }, "UpdateAPIKeyProfiles");
  setEditDirty(false);
  setEditStatus(enabledKey ? "已保存（Key 已自动启用）" : "已保存");
}

function apiKeyValue(key) {
  return String(key?.key || "");
}

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

function createdKeyValue() {
  return createdKeyValueCache;
}

function syncActionButtons() {
  const dialog = document.getElementById(DIALOG_ID);
  const selectedMode = dialog?.dataset?.keyMode || "update";
  const actions = dialog?.querySelector(".hkb-actions");
  if (!actions) return;
  actions.querySelectorAll("[data-action-panel]").forEach((element) => {
    const isCopyCreated = element.dataset.role === "copy-created-key";
    const hasCreatedKey = Boolean(createdKeyValue());
    const isCreateBind = element.dataset.action === "create-bind";
    element.hidden = element.dataset.actionPanel !== selectedMode
      || (isCopyCreated && !hasCreatedKey)
      || (isCreateBind && hasCreatedKey);
  });
}

async function copySelectedKey() {
  const keyID = selectedKeyID;
  if (!keyID) throw new Error("请先选择 API Key");
  const data = await graphql(queries.getKeyValue, { id: keyID }, "GetApiKeyValue");
  const value = data?.node?.key || "";
  if (!value) {
    const status = keysCache.find((key) => key.id === keyID)?.status || data?.node?.status;
    throw new Error(status === "disabled" ? "读取密钥值失败（Key 处于禁用状态）" : "读取密钥值失败，请刷新后重试");
  }
  await navigator.clipboard.writeText(value);
  setStatus("已复制密钥");
}

function getValue(role) {
  return document.querySelector(`#${DIALOG_ID} [data-role="${role}"]`)?.value || "";
}

function setStatus(message) {
  const status = document.querySelector(`#${DIALOG_ID} [data-role="status"]`);
  if (status) status.textContent = message;
}

function setBusy(isBusy) {
  document.querySelectorAll(`#${DIALOG_ID} button`).forEach((button) => {
    button.disabled = isBusy;
  });
  if (!isBusy) syncKeyPicker();
}

function escapeHtml(value) {
  return String(value ?? "").replace(HTML_ESCAPE_RE, (character) => HTML_ESCAPE_MAP[character]);
}

  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style");
    style.id = `${PANEL_ID}-style`;
    style.textContent = `.${REQUEST_TRIGGER_CLASS}{margin-left:4px}
      .${CHANNEL_TRIGGER_CLASS}{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:28px;min-height:28px;border:1px solid color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 24%,var(--border,hsl(20 5.9% 90%)));border-radius:8px;background:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 7%,transparent);color:var(--primary,hsl(20 14.3% 4.1%));padding:0 10px;font:inherit;font-size:12px;font-weight:600;line-height:18px;white-space:nowrap;cursor:pointer;box-shadow:none;transition:color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      .${CHANNEL_TRIGGER_CLASS}:hover{border-color:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 42%,var(--border,hsl(20 5.9% 90%)));background:color-mix(in oklab,var(--primary,hsl(20 14.3% 4.1%)) 13%,transparent)}
      .${CHANNEL_TRIGGER_CLASS}:focus-visible{outline:none;border-color:var(--ring,var(--primary,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 22%,transparent)}
      .${CHANNEL_TRIGGER_CLASS} svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
      html.dark .${CHANNEL_TRIGGER_CLASS}{border-color:color-mix(in oklab,var(--primary) 34%,var(--border));background:color-mix(in oklab,var(--primary) 12%,transparent);color:color-mix(in oklab,var(--primary) 82%,white)}
      html.dark .${CHANNEL_TRIGGER_CLASS}:hover{border-color:color-mix(in oklab,var(--primary) 52%,var(--border));background:color-mix(in oklab,var(--primary) 20%,transparent)}
      #${PRICE_FIELD_ID}{box-sizing:border-box;min-width:0;order:2147483647}
      #${MODEL_ID_FIELD_ID}{box-sizing:border-box;min-width:0;order:2147483646}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-wrap{position:relative;width:fit-content;max-width:260px;min-width:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;width:fit-content;max-width:100%;height:36px;min-height:36px;border:1px solid var(--input,var(--border,hsl(20 5.9% 90%)));border-radius:12px;background:transparent;color:var(--foreground,hsl(20 14.3% 4.1%));padding:8px 12px;font:inherit;font-size:14px;font-weight:400;line-height:20px;white-space:nowrap;cursor:pointer;outline:none;box-shadow:0 1px 3px 0 rgb(176 93 46 / .04);transition:border-color .15s ease,box-shadow .15s ease,background-color .15s ease}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:hover{border-color:color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 40%,var(--input,var(--border,hsl(20 5.9% 90%))))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:focus-visible,#${MODEL_ID_FIELD_ID} .hkb-model-id-trigger[aria-expanded="true"]{border-color:var(--ring,var(--primary,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--primary,hsl(20 14.3% 4.1%))) 18%,transparent)}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger svg{width:16px;height:16px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.5;pointer-events:none;transition:transform .15s ease}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger[aria-expanded="true"] svg{transform:rotate(180deg)}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-menu{position:absolute;left:0;top:calc(100% + 6px);z-index:60;width:max-content;min-width:100%;max-width:min(340px,90vw);max-height:264px;overflow:auto;margin:0;padding:6px;list-style:none;background:var(--popover,var(--card,#fff));border:1px solid var(--border,rgba(229,231,235,.9));border-radius:12px;box-shadow:0 18px 48px -24px rgb(15 23 42 / .55),0 8px 20px -18px rgb(15 23 42 / .45);color:var(--popover-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-menu[hidden]{display:none}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option{display:flex;align-items:center;gap:8px;width:100%;min-height:34px;border:none;border-radius:8px;background:transparent;color:inherit;text-align:left;padding:8px 10px;font:inherit;font-size:14px;font-weight:500;line-height:20px;cursor:pointer}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700;flex-shrink:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option:not([aria-selected="true"])::before{content:"";width:12px;flex-shrink:0}
      #${MODEL_ID_FIELD_ID} .hkb-model-id-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger{border-color:var(--input,var(--border));color:var(--foreground,#e4e4e4)}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-trigger:hover{background:color-mix(in oklab,var(--input,rgb(255 255 255/.09)) 50%,transparent)}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-menu{background:var(--popover,var(--card,#1c1c1c));border-color:var(--border,rgb(255 255 255/.09));color:var(--popover-foreground,var(--foreground,#e4e4e4))}
      html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-option:hover,html.dark #${MODEL_ID_FIELD_ID} .hkb-model-id-option[aria-selected="true"]{background:var(--accent,rgb(255 255 255/.08));color:var(--accent-foreground,var(--foreground,#e4e4e4))}
      #${PRICE_FIELD_ID} .hkb-filter-buttons{display:flex;align-items:center;flex-wrap:wrap;gap:6px;min-height:32px}
      #${PRICE_FIELD_ID} [data-role$="-filter"]{--hkb-filter-accent:var(--primary,hsl(20 14.3% 4.1%));box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:7px;width:fit-content;max-width:100%;height:32px;min-height:32px;border:1px solid var(--border,hsl(20 5.9% 90%));border-radius:999px;background:color-mix(in oklab,var(--background,#fff) 92%,transparent);color:var(--muted-foreground,hsl(25 5.3% 44.7%));padding:5px 12px;font:inherit;font-size:13px;font-weight:550;line-height:20px;white-space:nowrap;cursor:pointer;box-shadow:0 1px 1px rgb(0 0 0 / .025);pointer-events:auto;transition:transform .15s ease,color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role$="-filter"]::before{content:"";width:6px;height:6px;border-radius:999px;background:currentColor;opacity:.35;box-shadow:0 0 0 2px color-mix(in oklab,currentColor 10%,transparent);transition:opacity .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{--hkb-filter-accent:#16a34a}
      #${PRICE_FIELD_ID} [data-role="official-filter"]{--hkb-filter-accent:#0284c7}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:hover{transform:translateY(-1px);border-color:color-mix(in oklab,var(--hkb-filter-accent) 30%,var(--border,hsl(20 5.9% 90%)));background:color-mix(in oklab,var(--hkb-filter-accent) 6%,var(--background,#fff));color:color-mix(in oklab,var(--hkb-filter-accent) 80%,var(--foreground,hsl(20 14.3% 4.1%)));box-shadow:0 3px 8px -5px color-mix(in oklab,var(--hkb-filter-accent) 55%,transparent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:active{transform:translateY(0)}
      #${PRICE_FIELD_ID} [data-role$="-filter"]:focus-visible{outline:none;border-color:var(--hkb-filter-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--hkb-filter-accent) 22%,transparent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]{border-color:color-mix(in oklab,var(--hkb-filter-accent) 45%,var(--border));background:color-mix(in oklab,var(--hkb-filter-accent) 12%,var(--background,#fff));color:var(--hkb-filter-accent);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--hkb-filter-accent) 8%,transparent),0 3px 10px -7px var(--hkb-filter-accent)}
      #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]::before{opacity:1;box-shadow:0 0 0 3px color-mix(in oklab,var(--hkb-filter-accent) 16%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"]{background:color-mix(in oklab,var(--background) 78%,transparent);box-shadow:none}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"]:hover{background:color-mix(in oklab,var(--hkb-filter-accent) 12%,var(--background))}
      html.dark #${PRICE_FIELD_ID} [data-role$="-filter"][aria-pressed="true"]{border-color:color-mix(in oklab,var(--hkb-filter-accent) 58%,var(--border));background:color-mix(in oklab,var(--hkb-filter-accent) 18%,var(--background));color:color-mix(in oklab,var(--hkb-filter-accent) 82%,white)}
      @media (min-width:1280px){.hkb-marketplace-filter-grid{grid-template-columns:repeat(6,minmax(0,auto))!important}}
      [data-hub-tool-price-hidden="true"]{display:none!important}
      th.${REQUEST_LOG_CHANNEL_COLUMN_CLASS},td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}{box-sizing:border-box;width:160px;max-width:160px}
      td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS},td.${REQUEST_LOG_CHANNEL_COLUMN_CLASS}>*{min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      td.${MULTIPLIER_COLUMN_CLASS}{box-sizing:border-box;padding-left:6px;padding-right:6px;text-align:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--primary,hsl(20 14.3% 4.1%));white-space:nowrap}
      td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_LOW_TONE_CLASS}{color:var(--success,#16845d)}
      td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_HIGH_TONE_CLASS}{color:var(--destructive,#dc2626)}
      .${MULTIPLIER_COLUMN_HEADER_CLASS}{box-sizing:border-box;padding-left:6px;padding-right:6px;text-align:center;color:var(--muted-foreground,hsl(25 5.3% 44.7%));white-space:nowrap}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}{color:var(--primary,#e4e4e4)}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_LOW_TONE_CLASS}{color:#3fa266}
      html.dark td.${MULTIPLIER_COLUMN_CLASS}.${MULTIPLIER_HIGH_TONE_CLASS}{color:#fc6b83}
      html.dark .${MULTIPLIER_COLUMN_HEADER_CLASS}{color:var(--muted-foreground,oklch(0.7713 0.0169 99.0657))}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgb(0 0 0 / .48);padding:16px;color:var(--foreground,#111827);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(420px,100%);height:388px;box-sizing:border-box;background:var(--card,#fff);border:1px solid var(--border,rgba(229,231,235,.9));color:var(--card-foreground,var(--foreground,#111827));border-radius:14px;padding:24px;box-shadow:0 24px 60px -24px rgb(15 23 42 / .55),0 10px 24px -20px rgb(15 23 42 / .35)}
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
      #${DIALOG_ID} .hkb-key-option{width:100%;min-height:38px;display:flex;align-items:center;gap:8px;border:none;border-radius:8px;background:transparent;color:var(--popover-foreground,var(--foreground,#111827));text-align:left;padding:8px 10px;font-size:14px;font-weight:500}#${DIALOG_ID} .hkb-key-option:hover,#${DIALOG_ID} .hkb-key-option[aria-selected="true"]{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-key-option[aria-selected="true"]::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700}#${DIALOG_ID} .hkb-key-option:not([aria-selected="true"])::before{content:"";width:12px}#${DIALOG_ID} .hkb-key-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-key-status{margin-left:auto;flex-shrink:0;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:650;line-height:16px;white-space:nowrap}#${DIALOG_ID} .hkb-key-status[data-status="disabled"]{border:1px solid color-mix(in oklab,var(--destructive,#dc2626) 35%,transparent);background:color-mix(in oklab,var(--destructive,#dc2626) 10%,transparent);color:var(--destructive,#dc2626)}#${DIALOG_ID} .hkb-key-status[data-status="archived"]{border:1px solid var(--border,#e5e7eb);background:var(--secondary,#f3f4f6);color:var(--muted-foreground,#6b7280)}html.dark #${DIALOG_ID} .hkb-key-status[data-status="disabled"]{border-color:color-mix(in oklab,var(--destructive,#fc6b83) 45%,transparent);background:color-mix(in oklab,var(--destructive,#fc6b83) 14%,transparent);color:var(--destructive,#fc6b83)}html.dark #${DIALOG_ID} .hkb-key-status[data-status="archived"]{border-color:var(--border,rgb(255 255 255/.09));background:color-mix(in oklab,white 8%,transparent);color:var(--muted-foreground,#9ca3af)}
      #${DIALOG_ID} .hkb-icon-btn{height:32px;width:32px;min-height:32px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s,box-shadow .15s}#${DIALOG_ID} .hkb-icon-btn:hover{color:var(--accent-foreground,var(--foreground,#0f172a));background:var(--accent,#f1f5f9)}#${DIALOG_ID} .hkb-icon-btn:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-icon-btn svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;pointer-events:none}
      #${DIALOG_ID} .hkb-edit-title{display:flex;align-items:center;gap:6px;margin:-8px 0 4px -8px;font-size:15px;font-weight:650;color:var(--foreground,#111827)}
      #${DIALOG_ID} .hkb-back{height:28px;width:28px;min-height:28px}
      #${DIALOG_ID} .hkb-edit-list{height:100%;min-height:92px;overflow:auto;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 14%,transparent);padding:4px;scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .15s;touch-action:pan-y;user-select:none}#${DIALOG_ID} .hkb-edit-list:hover,#${DIALOG_ID} .hkb-edit-list:focus-within,#${DIALOG_ID} .hkb-edit-list.is-scrolling{scrollbar-color:var(--border,#cbd5e1) transparent}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar{width:6px}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar-thumb{background:transparent;border-radius:999px}#${DIALOG_ID} .hkb-edit-list:hover::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list:focus-within::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list.is-scrolling::-webkit-scrollbar-thumb{background:var(--border,#cbd5e1)}
      #${DIALOG_ID} .hkb-channel-list-stage{position:relative;min-height:36px}#${DIALOG_ID} .hkb-channel-slot{position:absolute;left:0;right:0;transition:top .12s ease}#${DIALOG_ID} .hkb-channel-placeholder{position:absolute;left:0;right:0;border:1px dashed var(--primary,var(--foreground,#111827));border-radius:8px;background:color-mix(in oklab,var(--primary,var(--foreground,#111827)) 8%,transparent)}#${DIALOG_ID} .hkb-channel-row{height:36px;box-sizing:border-box;display:flex;align-items:center;gap:6px;padding:4px 6px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--foreground,#111827);font-size:13px}#${DIALOG_ID} .hkb-channel-row:hover{background:var(--accent,#fff);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-channel-row.is-dragging{border-color:var(--primary,var(--foreground,#111827));background:var(--card,#fff);box-shadow:0 8px 18px -14px rgb(15 23 42 / .65);pointer-events:none}#${DIALOG_ID} .hkb-drag-handle{width:22px;height:26px;min-height:26px;border:0;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:grab;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font:inherit;line-height:1;letter-spacing:1px;touch-action:none}#${DIALOG_ID} .hkb-drag-handle:active{cursor:grabbing}#${DIALOG_ID} .hkb-channel-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-channel-actions{display:flex;align-items:center;gap:2px;flex-shrink:0}#${DIALOG_ID} .hkb-row-btn{width:26px;height:26px;min-height:26px;border-color:transparent}#${DIALOG_ID} .hkb-row-btn svg{width:14px;height:14px}#${DIALOG_ID} .hkb-remove{color:var(--muted-foreground,#6b7280)}#${DIALOG_ID} .hkb-remove:hover{color:var(--destructive,#dc2626)}
      #${DIALOG_ID} .hkb-empty{padding:14px 10px;color:var(--muted-foreground,#9ca3af);font-size:13px}
      #${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:0;padding-top:16px;border-top:1px solid var(--border,#f3f4f6)}
      #${DIALOG_ID} .hkb-edit-actions{border-top:none;padding-top:18px}
      #${DIALOG_ID} [data-action="save-edit"]{position:relative}
      #${DIALOG_ID} [data-action="save-edit"][data-dirty="true"]::after{content:"";position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:999px;background:var(--primary,#111827);box-shadow:0 0 0 2px var(--card,#fff)}
      #${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{display:flex;align-items:center;gap:8px}
      #${DIALOG_ID} .hkb-status{color:var(--muted-foreground,#6b7280);font-size:12px;line-height:16px;flex:1;min-width:0;text-align:center}
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
    if (action === "edit-drag-channel") return;
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
    } catch (error) {
      setStatus(error?.message || "操作失败");
    } finally {
      setBusy(false);
    }
  }

  function openDialog() {
    ensureDialog();
    document.getElementById(DIALOG_ID).hidden = false;
    const channel = { id: this?.dataset?.channelId || "", name: this?.dataset?.channelName || "" };
    setCurrentChannel(channel);
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys().catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function openRequestEditDialog() {
    ensureDialog();
    document.getElementById(DIALOG_ID).hidden = false;
    setCurrentChannel({ id: "", name: "" }, { allowEmpty: true });
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys()
      .then(() => openEditPanel())
      .catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID);
    if (dialog) dialog.hidden = true;
  }

  function ensureDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID;
    dialog.hidden = true;
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true" aria-label="API 密钥渠道管理">
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
            <div class="hkb-field"><label class="hkb-label" for="hkb-new-key-name">Key 名称</label><input id="hkb-new-key-name" name="hkb-new-key-name" class="hkb-control" data-role="new-key-name" type="text" placeholder="输入 Key 名称" autocomplete="off"></div>
          </div>
        </div>
        <div class="hkb-actions"><div class="hkb-action-left"><button type="button" class="hkb-primary" data-action="append-bind" data-action-panel="update">追加绑定</button><button type="button" class="hkb-secondary" data-action="replace-bind" data-action-panel="update">替换绑定</button><button type="button" class="hkb-primary" data-action="create-bind" data-action-panel="create" hidden>新建并绑定</button><button type="button" class="hkb-secondary hkb-copy-new" data-action="copy-created-key" data-action-panel="create" data-role="copy-created-key" hidden>复制新密钥</button></div><div class="hkb-status" data-role="status" role="status" aria-live="polite"></div><div class="hkb-action-right"><button type="button" class="hkb-ghost" data-action="close">关闭</button></div></div>
      </div>
      <div class="hkb-main" data-view-panel="edit" hidden>
        <div class="hkb-edit-title"><button type="button" class="hkb-icon-btn hkb-back" data-action="close-edit" title="返回" aria-label="返回"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><span>编辑绑定渠道</span></div>
        <div class="hkb-edit-body">
          <div class="hkb-edit-row"><span class="hkb-label">API Key</span><div class="hkb-key-picker" data-role="edit-key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="edit-key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="edit-key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="edit-key-menu" role="listbox" hidden></ul></div></div>
          <div class="hkb-edit-row"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="edit-channel-label"></div></div>
          <div class="hkb-edit-row hkb-edit-row-list"><span class="hkb-label">绑定渠道</span><div class="hkb-edit-list" data-role="edit-channel-list" tabindex="0"></div></div>
        </div>
        <div class="hkb-actions hkb-edit-actions"><div class="hkb-action-left"><button type="button" class="hkb-secondary" data-action="edit-add-current">添加</button></div><div class="hkb-status" data-role="edit-status" role="status" aria-live="polite"></div><div class="hkb-action-right"><button type="button" class="hkb-primary" data-action="save-edit">保存</button><button type="button" class="hkb-ghost" data-action="close-edit">取消</button></div></div>
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
    dialog.addEventListener("pointerdown", handleEditChannelDragStart);
    dialog.addEventListener("pointermove", handleEditChannelDragMove);
    dialog.addEventListener("pointerup", handleEditChannelDragEnd);
    dialog.addEventListener("pointercancel", cancelEditChannelDrag);
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
    if (!tab || !MARKETPLACE_CHANNEL_TAB_RE.test(String(tab.textContent || ""))) return;
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
    window.__hubKeyBinderTest = {
      findChannelFromButton,
      isApiKeyActionButton,
      isApiKeyActionButtonText,
      isExistingApiKeyActionButtonText,
      isMarketplaceVerificationButtonText,
      selectPreferredApiKeyActionButton,
      moveChannelTriggerToActionEnd,
      movePriceFilterToEndOfGrid,
      rememberChannelsFromPayload,
      buildProfilesInput,
      buildProfilesInputWithChannelIDs,
      moveChannelIDToIndex,
      findMarketplaceFilterFields,
      isMarketplaceChannelsTabActive,
      filterMarketplacePayloadByPrice,
      filterMarketplacePayloadByOfficial,
      findModelPriceRow,
      channelFreeStateForModelDetail,
      providerServesModelID,
      buildMarketplaceModelIDOptions,
      modelIDVariantKind,
      currentSelectedModelID,
      channelIsOfficial,
      augmentChannelModelPricesPayload,
      ensurePricingFields,
      marketplaceChannelsScanUrl,
      sanitizeMarketplaceChannelsRequest,
      normalizePriceFilter,
      requestUrl,
      requestBodyText,
      readRequestBodyText,
      withMarketplaceModelPricingFields,
      isTargetRoute,
      isRequestsConsumerRoute,
      injectRequestLogMultiplierColumn,
      removeRequestLogMultiplierColumn,
      rememberRequestLogMultipliers,
      requestLogChannelColumnIndex,
      formatMultiplier,
      multiplierTone,
      constrainRequestLogChannelCell,
      channelLabel,
      keyStatusText,
      bindChannelToKey,
      renderKeyStatusBadge,
      ensureKeyEnabledForBinding,
      updateCachedKeyStatus,
      loadMissingChannelNames,
      __setPriceFilterForTest: (value) => { selectedPriceFilter = normalizePriceFilter(value); },
      __setModelIDFilterForTest: (value) => { selectedMarketplaceModelID = String(value || ""); },
      __setOfficialFilterForTest: (value) => { selectedOfficialFilter = Boolean(value); },
      __setGraphqlForTest: setGraphqlRunnerForTest,
    };
  }
})();

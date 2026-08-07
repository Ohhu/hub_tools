const GRAPHQL_PATH = "/admin/graphql";
const PROJECT_ID = "gid://axonhub/Project/1";
const PANEL_ID = "linuxdo-hub-tool";
const TRIGGER_CLASS = `${PANEL_ID}-trigger`;
const CHANNEL_TRIGGER_CLASS = `${PANEL_ID}-channel-trigger`;
const REQUEST_TRIGGER_CLASS = `${PANEL_ID}-request-trigger`;
const DIALOG_ID = `${PANEL_ID}-dialog`;
const PRICE_FIELD_ID = `${PANEL_ID}-price-field`;
const MULTIPLIER_TAG_CLASS = `${PANEL_ID}-multiplier-tag`;
const MULTIPLIER_COLUMN_CLASS = `${PANEL_ID}-multiplier-column`;
const MULTIPLIER_COLUMN_HEADER_CLASS = `${MULTIPLIER_COLUMN_CLASS}-header`;
const MULTIPLIER_LOW_TONE_CLASS = `${MULTIPLIER_COLUMN_CLASS}-low`;
const MULTIPLIER_HIGH_TONE_CLASS = `${MULTIPLIER_COLUMN_CLASS}-high`;
const CHANNEL_NAME_LOOKUP_LIMIT = 20;
const REACT_FIBER_CHANNEL_LOOKUP_LIMIT = 8;
const IMPLICIT_FREE_PRICE_LIMIT = 50;
const IMPLICIT_FREE_PRICE_ROW_PREFIX = "implicit-free";
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
const requestLogMultiplierCache = new Map();
const requestBodyTextCache = new WeakMap();
let meCache = null;
let keysCache = [];
let selectedKeyID = "";
let mountTimer = 0;
let selectedPriceFilter = "all";
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


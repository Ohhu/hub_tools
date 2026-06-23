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

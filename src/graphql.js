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

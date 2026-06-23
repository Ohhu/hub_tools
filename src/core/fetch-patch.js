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

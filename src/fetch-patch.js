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
      requestLogMultiplierCache.set(requestLogNumericID(node.id), multiplier);
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

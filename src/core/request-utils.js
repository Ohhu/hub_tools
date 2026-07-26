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


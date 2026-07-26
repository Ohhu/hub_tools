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

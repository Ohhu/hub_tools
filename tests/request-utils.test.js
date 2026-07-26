const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");

async function main() {
  const helpers = loadHelpers();

  assert.equal(helpers.requestUrl(new URL("https://hub.linux.do/admin/graphql")), "https://hub.linux.do/admin/graphql");
  assert.equal(helpers.requestBodyText("https://hub.linux.do/admin/graphql", { body: "MarketplaceModel" }), "MarketplaceModel");

  const body = JSON.stringify({ operationName: "MarketplaceModel", query: "query MarketplaceModel { marketplaceModel { modelID } }" });
  const request = new Request("https://hub.linux.do/admin/graphql", { method: "POST", body });
  assert.equal(helpers.requestBodyText(request), "");
  assert.equal(await helpers.readRequestBodyText(request), body);
  assert.equal(helpers.requestBodyText(request), body);

  console.log("request utils helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


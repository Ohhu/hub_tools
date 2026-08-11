const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");
const { FakeElement } = require("./helpers/fake-dom");

async function main() {
  const helpers = loadHelpers();

  assert.equal(helpers.requestUrl(new URL("https://hub.linux.do/admin/graphql")), "https://hub.linux.do/admin/graphql");
  assert.equal(helpers.requestBodyText("https://hub.linux.do/admin/graphql", { body: "MarketplaceModel" }), "MarketplaceModel");

  const body = JSON.stringify({ operationName: "MarketplaceModel", query: "query MarketplaceModel { marketplaceModel { modelID } }" });
  const request = new Request("https://hub.linux.do/admin/graphql", { method: "POST", body });
  assert.equal(helpers.requestBodyText(request), "");
  assert.equal(await helpers.readRequestBodyText(request), body);
  assert.equal(helpers.requestBodyText(request), body);

  assert.equal(helpers.formatMultiplier(1), "1.0");
  assert.equal(helpers.formatMultiplier(0.4), "0.4");
  assert.equal(helpers.formatMultiplier(0.05), "0.05");
  assert.equal(helpers.formatMultiplier(0.39999999999999997), "0.4");

  assert.equal(helpers.multiplierTone(0.4), "low");
  assert.equal(helpers.multiplierTone(1), "mid");
  assert.equal(helpers.multiplierTone(2), "mid");
  assert.equal(helpers.multiplierTone(2.4), "high");
  assert.equal(helpers.multiplierTone("0.05"), "low");
  assert.equal(helpers.multiplierTone(null), "mid");

  const channelCell = new FakeElement({ text: "  一个很长的渠道名称  " });
  helpers.constrainRequestLogChannelCell(channelCell);
  assert.equal(channelCell.classList.contains("linuxdo-hub-tool-request-channel-column"), true);
  assert.equal(channelCell.getAttribute("title"), "一个很长的渠道名称");

  console.log("request utils helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

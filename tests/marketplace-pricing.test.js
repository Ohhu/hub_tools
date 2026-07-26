const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");

const plain = (value) => JSON.parse(JSON.stringify(value));

async function main() {
  const helpers = loadHelpers();
  const payload = {
    items: [
      { name: "free", priceSummary: { allFree: true } },
      { name: "paid", priceSummary: { allFree: false } },
      { name: "unknown" },
    ],
    totalCount: 3,
    totalPages: 1,
  };

  assert.deepEqual(plain(await helpers.filterMarketplacePayloadByPrice(payload, "free")).items.map((item) => item.name), ["free"]);
  assert.deepEqual(plain(await helpers.filterMarketplacePayloadByPrice(payload, "paid")).items.map((item) => item.name), ["paid"]);
  assert.equal(helpers.normalizePriceFilter("weird"), "all");

  const url = helpers.marketplaceChannelsScanUrl("https://hub.linux.do/admin/marketplace/channels?page=3&first=20&search=gpt&sort=created_desc", "free", 2);
  assert.equal(url.pathname, "/admin/marketplace/channels");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("sort"), "multiplier_asc");

  console.log("marketplace pricing helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


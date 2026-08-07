const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");

const plain = (value) => JSON.parse(JSON.stringify(value));

async function main() {
  const helpers = loadHelpers();

  const officialChannel = {
    name: "official",
    usesOfficialBaseURL: true,
  };
  assert.equal(helpers.channelIsOfficial(officialChannel), true);

  const nonOfficialChannel = {
    name: "thirdparty",
    usesOfficialBaseURL: false,
  };
  assert.equal(helpers.channelIsOfficial(nonOfficialChannel), false);

  const tagOfficial = {
    name: "tag-official",
    tags: ["official:true"],
  };
  assert.equal(helpers.channelIsOfficial(tagOfficial), true);

  const tagNonOfficial = {
    name: "tag-nonofficial",
    tags: ["official:false"],
  };
  assert.equal(helpers.channelIsOfficial(tagNonOfficial), false);

  const officialWithDiscount = {
    name: "official-discounted",
    usesOfficialBaseURL: true,
    priceSummary: { multiplier: { min: 0.2, max: 0.2 } },
  };
  assert.equal(helpers.channelIsOfficial(officialWithDiscount), true);

  const unknownChannel = { name: "unknown" };
  assert.equal(helpers.channelIsOfficial(unknownChannel), false);

  const payload = {
    data: {
      marketplaceModel: {
        modelID: "gpt-5.5",
        providers: [
          { modelID: "gpt-5.5", channel: officialChannel },
          { modelID: "gpt-5.5", channel: nonOfficialChannel },
          { modelID: "gpt-5.5", channel: officialWithDiscount },
          { modelID: "gpt-5.5", channel: tagNonOfficial },
        ],
      },
    },
  };
  const filtered = plain(await helpers.filterMarketplacePayloadByOfficial(payload, true));
  assert.deepEqual(
    filtered.data.marketplaceModel.providers.map((provider) => provider.channel.name),
    ["official", "official-discounted"],
  );
  assert.deepEqual(
    plain(await helpers.filterMarketplacePayloadByOfficial(payload, false)),
    plain(payload),
  );

  const itemsPayload = {
    items: [officialChannel, nonOfficialChannel, officialWithDiscount],
    totalCount: 3,
    totalPages: 1,
  };
  const filteredItems = plain(await helpers.filterMarketplacePayloadByOfficial(itemsPayload, true));
  assert.deepEqual(filteredItems.items.map((item) => item.name), ["official", "official-discounted"]);

  console.log("official filter helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

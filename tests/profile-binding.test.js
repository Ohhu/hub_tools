const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");

const plain = (value) => JSON.parse(JSON.stringify(value));

function main() {
  const helpers = loadHelpers();
  const input = {
    activeProfile: "default",
    profiles: [{ name: "default", channelIDs: [5638], channelTags: ["fast"] }],
  };

  assert.deepEqual(plain(helpers.buildProfilesInput(input, 29812, "append")).profiles[0].channelIDs, [5638, 29812]);
  assert.deepEqual(plain(helpers.buildProfilesInput(input, 42, "replace")).profiles[0].channelIDs, [42]);
  assert.deepEqual(plain(helpers.moveChannelIDToIndex([5638, 29812, 42], 29812, 0)), [29812, 5638, 42]);

  console.log("profile binding helpers ok");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}


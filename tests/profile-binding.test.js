const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");

const plain = (value) => JSON.parse(JSON.stringify(value));

async function main() {
  const helpers = loadHelpers();
  const input = {
    activeProfile: "default",
    profiles: [{ name: "default", channelIDs: [5638], channelTags: ["fast"] }],
  };

  assert.deepEqual(plain(helpers.buildProfilesInput(input, 29812, "append")).profiles[0].channelIDs, [5638, 29812]);
  assert.deepEqual(plain(helpers.buildProfilesInput(input, 42, "replace")).profiles[0].channelIDs, [42]);
  assert.deepEqual(plain(helpers.moveChannelIDToIndex([5638, 29812, 42], 29812, 0)), [29812, 5638, 42]);


  // ===== key 状态与自动启用（0.4.8）=====
  const callLog = [];
  const makeFakeGql = (status) => async (query, variables, op) => {
    callLog.push([op, variables]);
    if (op === "GetApiKey") return { node: { id: variables.id, status, profiles: { activeProfile: "default", profiles: [{ name: "default", channelIDs: [1] }] } } };
    if (op === "UpdateAPIKeyStatus") return { updateAPIKeyStatus: { id: variables.id, status: variables.status } };
    if (op === "UpdateAPIKeyProfiles") return { updateAPIKeyProfiles: { id: variables.id } };
    return {};
  };
  helpers.__setGraphqlForTest(makeFakeGql("disabled"));

  // 禁用 key 绑定渠道：先启用再写绑定
  {
    callLog.length = 0;
    const result = await helpers.bindChannelToKey("gid://axonhub/APIKey/1", "gid://axonhub/Channel/42", "append");
    assert.deepEqual(callLog.map(([op]) => op), ["GetApiKey", "UpdateAPIKeyStatus", "UpdateAPIKeyProfiles"]);
    assert.equal(callLog[1][1].status, "enabled");
    assert.equal(result.enabledKey, true);
    assert.equal(result.alreadyBound, false);
  }

  // 启用 key 绑定渠道：不触发状态修正
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(makeFakeGql("enabled"));
    const result = await helpers.bindChannelToKey("gid://axonhub/APIKey/1", "gid://axonhub/Channel/42", "replace");
    assert.deepEqual(callLog.map(([op]) => op), ["GetApiKey", "UpdateAPIKeyProfiles"]);
    assert.equal(result.enabledKey, false);
  }

  // 状态文案
  assert.equal(helpers.keyStatusText({ status: "enabled" }), "已启用");
  assert.equal(helpers.keyStatusText({ status: "disabled" }), "已禁用");
  assert.equal(helpers.keyStatusText({ status: "archived" }), "已归档");
  assert.equal(helpers.keyStatusText({}), "");
  assert.equal(helpers.keyStatusText(null), "");

  // 徽章只对非启用状态渲染
  assert.equal(helpers.renderKeyStatusBadge({ status: "disabled" }), '<span class="hkb-key-status" data-status="disabled">已禁用</span>');
  assert.equal(helpers.renderKeyStatusBadge({ status: "enabled" }), "");
  assert.equal(helpers.renderKeyStatusBadge({}), "");

  helpers.__setGraphqlForTest(null);

  await Promise.resolve();
  console.log("profile binding helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


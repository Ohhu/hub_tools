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

  // ===== Key 状态开关（0.4.10）=====
  // 开关渲染：enabled/disabled 渲染 role="switch"，archived 仅保留状态徽章
  {
    const toggle = helpers.renderKeyStatusToggle({ id: "gid://axonhub/APIKey/1", name: "主力 Key", status: "enabled" });
    assert.equal(toggle.includes('class="hkb-key-toggle"'), true);
    assert.equal(toggle.includes('data-action="toggle-key-status"'), true);
    assert.equal(toggle.includes('data-key-id="gid://axonhub/APIKey/1"'), true);
    assert.equal(toggle.includes('data-status="enabled"'), true);
    assert.equal(toggle.includes('role="switch"'), true);
    assert.equal(toggle.includes('aria-checked="true"'), true);
    assert.equal(toggle.includes('aria-label="主力 Key 启用状态"'), true);
  }
  {
    const toggle = helpers.renderKeyStatusToggle({ id: "gid://axonhub/APIKey/2", name: "备用 <Key>", status: "disabled" });
    assert.equal(toggle.includes('data-status="disabled"'), true);
    assert.equal(toggle.includes('aria-checked="false"'), true);
    assert.equal(toggle.includes("备用 &lt;Key&gt;"), true);
  }
  assert.equal(helpers.renderKeyStatusToggle({ status: "archived" }), '<span class="hkb-key-status" data-status="archived">已归档</span>');
  assert.equal(helpers.renderKeyStatusToggle({}), "");
  assert.equal(helpers.renderKeyStatusToggle(null), "");

  // 开关切换：disabled -> enabled / enabled -> disabled
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(makeFakeGql("disabled"));
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/1", name: "主力 Key", status: "disabled" }]);
    const next = await helpers.toggleKeyStatus("gid://axonhub/APIKey/1");
    assert.deepEqual(callLog.map(([op]) => op), ["UpdateAPIKeyStatus"]);
    assert.equal(callLog[0][1].status, "enabled");
    assert.equal(next, "enabled");
  }
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(makeFakeGql("enabled"));
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/1", name: "主力 Key", status: "enabled" }]);
    const next = await helpers.toggleKeyStatus("gid://axonhub/APIKey/1");
    assert.deepEqual(callLog.map(([op]) => op), ["UpdateAPIKeyStatus"]);
    assert.equal(callLog[0][1].status, "disabled");
    assert.equal(next, "disabled");
  }
  {
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/1", name: "主力 Key", status: "archived" }]);
    await assert.rejects(helpers.toggleKeyStatus("gid://axonhub/APIKey/1"), /已归档/);
    helpers.__setKeysCacheForTest([]);
  }

  // ===== Key 排序（0.4.11）：emoji 等符号在前，文字名称按 locale 首字母 =====
  {
    const keys = [
      { id: "4", name: "deepseek" },
      { id: "1", name: "主力 Key" },
      { id: "2", name: "🚀 fast lane" },
      { id: "3", name: "Alpha" },
      { id: "5", name: "备用" },
      { id: "6", name: "★ special" },
      { id: "7", name: "" },
    ];
    const names = plain(helpers.sortKeys(keys)).map((key) => key.name || key.id);
    // 符号组在前（按 locale 序）；文字组内：数字 → 中文（拼音序）→ 拉丁字母。
    assert.deepEqual(names, ["★ special", "🚀 fast lane", "7", "备用", "主力 Key", "Alpha", "deepseek"]);
  }

  helpers.__setGraphqlForTest(null);

  await Promise.resolve();
  console.log("profile binding helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


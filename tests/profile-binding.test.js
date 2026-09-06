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

  // ===== Key 改名（0.4.12）：saveEditBindings 流程中的 renameKeyIfChanged =====
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(async (query, variables, op) => {
      callLog.push([op, variables]);
      if (op === "GetApiKey") return { node: { id: variables.id, name: "旧名字", status: "enabled", profiles: { activeProfile: "default", profiles: [{ name: "default", channelIDs: [1] }] } } };
      if (op === "UpdateAPIKey") return { updateAPIKey: { id: variables.id, name: variables.input.name, status: "enabled" } };
      if (op === "UpdateAPIKeyStatus") return { updateAPIKeyStatus: { id: variables.id, status: variables.status } };
      if (op === "UpdateAPIKeyProfiles") return { updateAPIKeyProfiles: { id: variables.id } };
      return {};
    });

    // 名称未变：不提交 UpdateAPIKey
    assert.equal(await helpers.renameKeyIfChanged("gid://axonhub/APIKey/1", "旧名字", "旧名字"), false);
    assert.deepEqual(callLog.map(([op]) => op), []);

    // 名称改变：提交 UpdateAPIKey 且只带 name
    callLog.length = 0;
    assert.equal(await helpers.renameKeyIfChanged("gid://axonhub/APIKey/1", "旧名字", "新名字"), true);
    assert.deepEqual(callLog.map(([op]) => op), ["UpdateAPIKey"]);
    assert.equal(callLog[0][1].input.name, "新名字");

    // 空名称拒绝
    await assert.rejects(helpers.renameKeyIfChanged("gid://axonhub/APIKey/1", "旧名字", "  "), /名称不能为空/);
  }

  // ===== profiles 完整复制（0.4.14）：轮换迁移 buildProfilesInputCopy =====
  {
    // 空 payload：回落为单个 default
    assert.deepEqual(plain(helpers.buildProfilesInputCopy(null)), { activeProfile: "default", profiles: [{ name: "default" }] });

    // 富配置保真：dynamic 绑定、策略、配额、路由策略、模型映射全保留；null 与未知字段剔除
    const rich = plain(helpers.buildProfilesInputCopy({
      activeProfile: "auto",
      profiles: [
        {
          name: "default",
          modelMappings: [{ from: "gpt-5.5", to: "gpt-5.5-pro" }, { from: "x" }],
          channelIDs: [1, 2, "bad"],
          channelTags: null,
          channelTagsMatchMode: "any",
          modelIDs: ["gpt-5.5"],
          loadBalanceStrategy: "round_robin",
          channelBindingMode: "manual",
          quota: { requests: 100, totalTokens: null, cost: "12.5", period: { type: "past_duration", pastDuration: { value: 24, unit: "hour" }, calendarDuration: null } },
          routingPolicy: { channelWeights: [{ channelID: 1, weight: 2 }, { channelID: "x", weight: 1 }], includeProviders: null },
          dynamicChannelStrategy: null,
          updatedAt: "2026-09-05", // 未知字段应被剔除
        },
        { name: "auto", channelBindingMode: "dynamic", dynamicChannelStrategy: { mode: "balanced", selectionPolicy: "sticky_hrw", maxChannels: 3, excludeTags: null } },
      ],
    }));
    assert.equal(rich.activeProfile, "auto");
    assert.equal(rich.profiles.length, 2);
    const manual = rich.profiles[0];
    assert.deepEqual(manual.modelMappings, [{ from: "gpt-5.5", to: "gpt-5.5-pro" }]); // 缺 to 的条目剔除
    assert.deepEqual(manual.channelIDs, [1, 2]);
    assert.equal(manual.loadBalanceStrategy, "round_robin");
    assert.deepEqual(manual.quota, { requests: 100, cost: "12.5", period: { type: "past_duration", pastDuration: { value: 24, unit: "hour" } } });
    assert.deepEqual(manual.routingPolicy, { channelWeights: [{ channelID: 1, weight: 2 }] }); // 非法权重剔除，空 includeProviders 剔除
    assert.equal("updatedAt" in manual, false);
    assert.equal("dynamicChannelStrategy" in manual, false); // null 不提交
    const dynamic = rich.profiles[1];
    assert.equal(dynamic.channelBindingMode, "dynamic");
    assert.deepEqual(dynamic.dynamicChannelStrategy, { mode: "balanced", selectionPolicy: "sticky_hrw", maxChannels: 3 });

    // 必填字段缺失时降级：quota 缺 period、策略缺 mode、空 routingPolicy 均不提交而非报错
    const degraded = plain(helpers.buildProfilesInputCopy({ activeProfile: "default", profiles: [{ name: "default", quota: { requests: 5 }, dynamicChannelStrategy: { maxChannels: 2 }, routingPolicy: {} }] }));
    assert.deepEqual(degraded.profiles[0], { name: "default" });

    // #68350 真实形态：default + Auto 双配置，activeProfile=Auto（非 default 也要原样带回）
    const dual = plain(helpers.buildProfilesInputCopy({
      activeProfile: "Auto",
      profiles: [
        { name: "default", channelTagsMatchMode: "any", channelBindingMode: "manual" },
        { name: "Auto", modelIDs: ["deepseek-v4-flash"], channelBindingMode: "dynamic", routingPolicy: { providerWeights: [{ provider: "deepseek", weight: 10 }] }, dynamicChannelStrategy: { mode: "balanced", selectionPolicy: "ranked", maxChannels: 15, minChannels: 3, maxPriceMultiplier: 0.2, maxLatencyMs: 5000, minSuccessRate: 0.95, minCacheRate: 0, minDetectionScore: 0, onlyOfficial: false } },
      ],
    }));
    assert.equal(dual.activeProfile, "Auto");
    assert.equal(dual.profiles.length, 2); // 两个配置全部复制
    assert.equal(dual.profiles[0].name, "default");
    assert.equal(dual.profiles[1].name, "Auto");
    assert.equal(dual.profiles[1].routingPolicy.providerWeights[0].weight, 10);
    assert.equal(dual.profiles[1].dynamicChannelStrategy.maxChannels, 15);

    // ===== 枚举脏数据清洗（0.4.15）：selectionPolicy 空串读取原样返回、回写被拒 =====
    // 2026-09-05 实测形态：非激活 dynamic profile 的 selectionPolicy 为 ""，
    // 追加/替换与轮换两条回写路径都剔除非法值（合法值保留，其余字段不动）。
    {
      const dirtyPayload = {
        activeProfile: "default",
        profiles: [
          { name: "default", channelIDs: [17533] },
          { name: "auto", channelBindingMode: "dynamic", dynamicChannelStrategy: { mode: "high_availability", selectionPolicy: "", maxChannels: 15, onlyOfficial: true } },
        ],
      };
      const appended = plain(helpers.buildProfilesInput(dirtyPayload, 42, "append"));
      assert.equal("selectionPolicy" in appended.profiles[1].dynamicChannelStrategy, false); // 脏值剔除
      assert.equal(appended.profiles[1].dynamicChannelStrategy.mode, "high_availability"); // 其余字段保留
      assert.deepEqual(appended.profiles[0].channelIDs, [17533, 42]); // 追加目标不受影响
      assert.equal(appended.profiles[0].dynamicChannelStrategy, null); // 激活 profile 维持 manual 强制
      const copied = plain(helpers.buildProfilesInputCopy(dirtyPayload));
      assert.equal("selectionPolicy" in copied.profiles[1].dynamicChannelStrategy, false);
      assert.equal(copied.profiles[1].dynamicChannelStrategy.onlyOfficial, true);

      const validPayload = {
        activeProfile: "default",
        profiles: [
          { name: "default", channelBindingMode: "manual" },
          { name: "auto", channelBindingMode: "dynamic", dynamicChannelStrategy: { mode: "balanced", selectionPolicy: "sticky_hrw", maxChannels: 3 } },
        ],
      };
      const validCopied = plain(helpers.buildProfilesInputCopy(validPayload));
      assert.equal(validCopied.profiles[1].dynamicChannelStrategy.selectionPolicy, "sticky_hrw"); // 合法值保留
      const validAppended = plain(helpers.buildProfilesInput(validPayload, 7, "replace"));
      assert.equal(validAppended.profiles[1].dynamicChannelStrategy.selectionPolicy, "sticky_hrw");
      assert.deepEqual(validAppended.profiles[0].channelIDs, [7]);
    }
  }

  // ===== 更新密钥（0.4.12）：rotateKey 轮换流程 =====
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(async (query, variables, op) => {
      callLog.push([op, variables]);
      if (op === "GetApiKey") return { node: { id: variables.id, name: "主力", status: "enabled", profiles: { activeProfile: "default", profiles: [{ name: "default", channelIDs: [1, 2], modelMappings: [{ from: "gpt-5.5", to: "gpt-5.5-pro" }] }, { name: "auto", channelBindingMode: "dynamic", dynamicChannelStrategy: { mode: "balanced", maxChannels: 3 } }] } } };
      if (op === "UpdateAPIKey") return { updateAPIKey: { id: variables.id, name: variables.input.name, status: "enabled" } };
      if (op === "UpdateAPIKeyStatus") return { updateAPIKeyStatus: { id: variables.id, status: variables.status } };
      if (op === "CreateAPIKey") return { createAPIKey: { id: "gid://axonhub/APIKey/999", key: "ah-newkey", name: variables.input.name, status: "enabled", type: "user" } };
      if (op === "UpdateAPIKeyProfiles") return { updateAPIKeyProfiles: { id: variables.id } };
      if (op === "Me") return { me: { id: "gid://axonhub/User/1", projects: [] } };
      if (op === "GetApiKeys") return { apiKeys: { edges: [{ node: { id: "gid://axonhub/APIKey/999", name: "主力", status: "enabled" } }], pageInfo: { hasNextPage: false } } };
      return {};
    });

    assert.equal(helpers.keyArchiveName("gid://axonhub/APIKey/71966"), "#71966");
    assert.equal(helpers.keyArchiveName("71966"), "#71966");
    assert.equal(helpers.keyArchiveName(""), "");

    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/71966", name: "主力", status: "enabled" }]);
    const created = await helpers.rotateKey("gid://axonhub/APIKey/71966", { name: "主力" });
    // 顺序：读配置 -> 旧 Key 改名 #id -> 归档 -> 新建 -> 迁移绑定 -> 刷新列表（Me 仅首次）
    assert.deepEqual(callLog.map(([op]) => op), ["GetApiKey", "UpdateAPIKey", "UpdateAPIKeyStatus", "CreateAPIKey", "UpdateAPIKeyProfiles", "Me", "GetApiKeys"]);
    assert.equal(callLog[1][1].input.name, "#71966");
    assert.equal(callLog[2][1].status, "archived");
    assert.equal(callLog[3][1].input.name, "主力");
    assert.equal(JSON.stringify(callLog[4][1].input.profiles[0].channelIDs), "[1,2]");
    // 0.4.14：迁移输入为完整复制，两个 profile 原样回写（含 dynamic 绑定与模型映射）
    assert.equal(callLog[4][1].input.activeProfile, "default");
    assert.equal(callLog[4][1].input.profiles.length, 2);
    assert.equal(callLog[4][1].input.profiles[0].modelMappings[0].to, "gpt-5.5-pro");
    assert.equal(callLog[4][1].input.profiles[1].channelBindingMode, "dynamic");
    assert.equal(callLog[4][1].input.profiles[1].dynamicChannelStrategy.mode, "balanced");
    assert.equal(created.id, "gid://axonhub/APIKey/999");

    // 新旧名称相同时仍可轮换（旧 Key 改名 #id，新 Key 沿用原名）
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/71966", name: "主力", status: "enabled" }]);
    callLog.length = 0;
    const again = await helpers.rotateKey("gid://axonhub/APIKey/71966", { name: "主力" });
    assert.equal(again.id, "gid://axonhub/APIKey/999");

    // archived 拒绝
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/71966", name: "主力", status: "archived" }]);
    await assert.rejects(helpers.rotateKey("gid://axonhub/APIKey/71966", { name: "新名字" }), /已归档/);
    helpers.__setKeysCacheForTest([]);
  }

  // ===== 归档（0.4.13）：archiveKey 改名 #id 后归档 =====
  {
    callLog.length = 0;
    helpers.__setGraphqlForTest(async (query, variables, op) => {
      callLog.push([op, variables]);
      if (op === "UpdateAPIKey") return { updateAPIKey: { id: variables.id, name: variables.input.name, status: "enabled" } };
      if (op === "UpdateAPIKeyStatus") return { updateAPIKeyStatus: { id: variables.id, status: variables.status } };
      if (op === "Me") return { me: { id: "gid://axonhub/User/1", projects: [] } };
      if (op === "GetApiKeys") return { apiKeys: { edges: [], pageInfo: { hasNextPage: false } } };
      return {};
    });
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/71966", name: "主力", status: "enabled" }]);
    const result = await helpers.archiveKey("gid://axonhub/APIKey/71966");
    // 顺序：改名 #id -> 状态置 archived -> 刷新列表（Me 已缓存）
    assert.deepEqual(callLog.map(([op]) => op), ["UpdateAPIKey", "UpdateAPIKeyStatus", "GetApiKeys"]);
    assert.equal(callLog[0][1].input.name, "#71966");
    assert.equal(callLog[1][1].status, "archived");
    assert.equal(result, "archived");

    // 已归档拒绝
    helpers.__setKeysCacheForTest([{ id: "gid://axonhub/APIKey/71966", name: "#71966", status: "archived" }]);
    await assert.rejects(helpers.archiveKey("gid://axonhub/APIKey/71966"), /已归档/);
    helpers.__setKeysCacheForTest([]);
  }

  helpers.__setGraphqlForTest(null);

  await Promise.resolve();
  console.log("profile binding helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


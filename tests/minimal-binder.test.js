const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

class FakeClassList {
  constructor(value = "") {
    this.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  contains(name) {
    return this.values.has(name);
  }

  toString() {
    return Array.from(this.values).join(" ");
  }
}

class FakeElement {
  constructor({ text = "", attrs = {}, className = "", parent = null, props = {} } = {}) {
    this.textContent = text;
    this.attributes = { ...attrs };
    this.className = className;
    this.classList = new FakeClassList(className);
    this.parentElement = parent;
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    Object.assign(this, props);
    if (parent) parent.children.push(this);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (selector === "[data-slot=\"card\"]" && current.attributes["data-slot"] === "card") return current;
      if (selector === "[data-slot=\"card\"], tr, [role=\"row\"]") {
        if (current.attributes["data-slot"] === "card" || current.tagName === "TR" || current.attributes.role === "row") return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (matchesFakeSelector(child, selector)) {
          results.push(child);
        }
        visit(child);
      }
    };
    visit(this);
    return results;
  }

  replaceWith(node) {
    const index = this.parentElement.children.indexOf(this);
    this.parentElement.children[index] = node;
    node.parentElement = this.parentElement;
  }
}

function matchesFakeSelector(node, selector) {
  return String(selector).split(",").some((part) => {
    const value = part.trim();
    if (value === "[data-slot=\"card-title\"]") return node.attributes["data-slot"] === "card-title";
    if (value === "[role=\"combobox\"]") return node.attributes.role === "combobox";
    if (value === "[role=\"tab\"][aria-selected=\"true\"]") return node.attributes.role === "tab" && node.attributes["aria-selected"] === "true";
    if (value === "[role=\"tab\"][data-state=\"active\"]") return node.attributes.role === "tab" && node.attributes["data-state"] === "active";
    return value === "*" || value === "button";
  });
}

function loadHelpers() {
  const source = fs.readFileSync("LinuxDo Hub Tool.user.js", "utf8");
  const documentElement = new FakeElement();
  const documentState = { main: null, selectedTab: null };
  const context = {
    Headers,
    MutationObserver: class { observe() {} },
    URL,
    document: {
      readyState: "loading",
      documentElement,
      addEventListener() {},
      createElement: () => new FakeElement(),
      getElementById: () => null,
      querySelector: (selector) => {
        if (selector === "main") return documentState.main;
        if (selector === '[role="tab"][aria-selected="true"], [role="tab"][data-state="active"]') return documentState.selectedTab;
        return null;
      },
      querySelectorAll: () => [],
    },
    location: { pathname: "/marketplace", origin: "https://hub.linux.do" },
    navigator: { clipboard: { writeText() {} } },
    setTimeout,
    window: {
      __hubKeyBinderEnableTest: true,
      addEventListener() {},
      fetch() {},
    },
  };
  context.window.window = context.window;
  context.window.document = context.document;
  context.window.location = context.location;
  context.window.navigator = context.navigator;
  context.window.setTimeout = setTimeout;
  context.window.MutationObserver = context.MutationObserver;
  context.window.Headers = Headers;
  context.window.URL = URL;
  vm.runInNewContext(source, context.window);
  context.window.__hubKeyBinderTest.__documentState = documentState;
  context.window.__hubKeyBinderTest.__location = context.location;
  return context.window.__hubKeyBinderTest;
}

const helpers = loadHelpers();
const plain = (value) => JSON.parse(JSON.stringify(value));
const source = fs.readFileSync("LinuxDo Hub Tool.user.js", "utf8");

async function main() {
assert.equal(helpers.isCreateApiButtonText("创建 API 密钥"), true);
assert.equal(helpers.isCreateApiButtonText("Create API Key"), true);
assert.equal(helpers.isCreateApiButtonText("更新 API 密钥"), false);
assert.equal(source.includes('data-role="created-key-wrap"'), false);
assert.equal(source.includes('data-role="created-key"'), false);
assert.equal(source.includes("data-panel="), false);
assert.equal(source.includes("data-key-panel="), true);
assert.equal(source.includes("data-action-panel="), true);
assert.equal(source.includes("<select"), false);
assert.equal(source.includes('data-role="key-trigger"'), true);
assert.equal(source.includes('data-role="key-menu"'), true);
assert.equal(source.includes('data-action="select-key"'), true);
assert.equal(source.includes("// @match        https://hub.linux.do/*"), true);
assert.equal(source.includes("// @version      0.2.4"), true);
assert.equal(source.includes("getKeyValue:"), true);
assert.equal(source.includes("getKeys: \"query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id name}cursor}pageInfo{hasNextPage endCursor}totalCount}}\""), true);
assert.equal(source.includes("linuxdoProfile{id username name avatarTemplate avatarUrl active trustLevel silenced externalIds updatedAt}"), false);
assert.equal(source.includes("function isTargetRoute"), true);
assert.equal(source.includes("function patchHistoryRouting"), true);
assert.equal(source.includes('["pushState", "replaceState"]'), true);
assert.equal(source.includes("new MutationObserver((mutations) =>"), true);
assert.equal(source.includes('hkb-icon-btn svg'), true);
assert.equal(source.includes('aria-label="复制密钥"'), true);
assert.equal(source.includes('aria-label="编辑绑定渠道"'), true);
assert.equal(source.includes('data-action="append-bind"'), true);
assert.equal(source.includes('data-action="replace-bind"'), true);
assert.equal(source.includes(">替换绑定</button>"), true);
assert.equal(source.includes('data-view-panel="edit"'), true);
assert.equal(source.includes(".hkb-card{width:min(460px,100%);height:388px"), true);
assert.equal(source.includes("[data-view-panel]{height:100%;display:grid;grid-template-rows:auto 1fr auto}"), true);
assert.equal(source.includes("button:not(.hkb-icon-btn){box-sizing:border-box;height:36px;min-height:36px;line-height:20px"), true);
assert.equal(source.includes("hkb-edit-body{display:grid;grid-template-rows:auto auto minmax(0,1fr)"), true);
assert.equal(source.includes("hkb-edit-row{display:grid;grid-template-columns:72px minmax(0,1fr)"), true);
assert.equal(source.includes("hkb-edit-actions{border-top:none;padding-top:18px"), true);
assert.equal(source.includes('data-role="edit-key-picker"'), true);
assert.equal(source.includes('data-role="edit-key-label"'), true);
assert.equal(source.includes("hkb-edit-list{height:100%;min-height:92px"), true);
assert.equal(source.includes("hkb-drag-handle"), false);
assert.equal(source.includes('draggable="true"'), false);
assert.equal(source.includes('>⧉</button>'), false);
assert.equal(source.includes('>↻</button>'), false);
assert.equal(source.includes("node{id createdAt updatedAt user{id firstName lastName email avatar linuxdoUserID linuxdoUsername"), false);
assert.equal(source.includes("async function loadSelectedKeyValue"), false);
assert.equal(source.includes("price-filter"), true);
assert.equal(source.includes("function insertPriceFilter"), true);
assert.equal(source.includes('data-price="all"'), false);
assert.equal(source.includes('data-price="paid"'), false);
assert.equal(source.includes('data-price="free"'), true);
assert.equal(source.includes("hkb-price-button border-input"), true);
assert.equal(source.includes('searchParams.set("price"'), false);
assert.equal(source.includes('searchParams.get("price"'), false);
assert.equal(source.includes("let searchNudgeCounter = 0"), false);
assert.equal(source.includes("cleanMarketplaceSearch"), true);
assert.equal(source.includes("\"\\u200b\".repeat"), false);
assert.equal(source.includes("function sanitizeMarketplaceChannelsRequest"), true);
assert.equal(source.includes("function triggerMarketplaceSortRefresh"), true);
assert.equal(source.includes("function openSelectLikeUser"), true);
assert.equal(source.includes("function selectOptionLikeUser"), true);
assert.equal(source.includes("pointerType: \"mouse\""), true);
assert.equal(source.includes("trigger.click();"), false);
assert.equal(source.includes("option.click();"), false);
assert.equal(source.includes("倍率从低到高"), true);
assert.equal(source.includes("综合推荐"), true);
assert.equal(source.includes("function resetPriceFilterState"), true);
assert.equal(source.includes("height:36px"), true);
assert.equal(source.includes("--hkb-price-bottom"), true);
assert.equal(source.includes("getComputedStyle(trigger || anchor).marginBottom"), true);
assert.equal(source.includes("html.dark #${PRICE_FIELD_ID}"), true);
assert.equal(source.includes("background:var(--card,#fff)"), true);
assert.equal(source.includes("border:1px solid var(--border"), true);
assert.equal(source.includes("background:var(--primary,#111827)"), true);
assert.equal(source.includes("color-mix(in oklab"), true);
assert.equal(source.includes("CHANNEL_NAME_LOOKUP_LIMIT = 20"), true);

{
  const input = {
    activeProfile: "default",
    profiles: [
      {
        name: "default",
        channelIDs: [5638],
        channelTags: ["fast"],
        modelMappings: [],
        modelIDs: [],
      },
    ],
  };
  assert.deepEqual(plain(helpers.buildProfilesInput(input, 29812, "append")).profiles[0].channelIDs, [5638, 29812]);
}

{
  const input = {
    activeProfile: "default",
    profiles: [
      {
        name: "default",
        channelIDs: [5638, 29812],
      },
    ],
  };
  assert.deepEqual(plain(helpers.buildProfilesInput(input, 29812, "append")).profiles[0].channelIDs, [5638, 29812]);
  assert.deepEqual(plain(helpers.buildProfilesInput(input, 42, "replace")).profiles[0].channelIDs, [42]);
}

{
  const input = {
    activeProfile: "default",
    profiles: [{ name: "default", channelIDs: [5638, 29812] }],
  };
  assert.deepEqual(plain(helpers.buildProfilesInputWithChannelIDs(input, [29812])).profiles[0].channelIDs, [29812]);
}

{
  const trigger = new FakeElement({ text: "更新 API 密钥" });
  trigger.classList.add("linuxdo-hub-tool-trigger");
  assert.equal(helpers.isApiKeyActionButton(trigger), false);
}

{
  const createButton = new FakeElement({ text: "创建 API 密钥" });
  assert.equal(helpers.isApiKeyActionButton(createButton), true);
}

{
  const main = new FakeElement();
  const tableRow = new FakeElement({
    attrs: { role: "row" },
    parent: main,
  });
  new FakeElement({ text: "列表渠道", parent: tableRow });
  const button = new FakeElement({ text: "创建 API 密钥", parent: tableRow });
  helpers.rememberChannelsFromPayload({ id: "gid://axonhub/Channel/5638", name: "列表渠道", supportedModels: [] });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "gid://axonhub/Channel/5638",
    name: "列表渠道",
  });
}

{
  const card = new FakeElement({
    attrs: { "data-slot": "card" },
  });
  new FakeElement({ text: "官Codex-Team(0.15倍率)", attrs: { "data-slot": "card-title" }, parent: card });
  const button = new FakeElement({ text: "创建 API 密钥", parent: card });
  helpers.rememberChannelsFromPayload({
    account: { id: 29811, name: "Merit" },
    channel: {
      id: "gid://axonhub/Channel/29812",
      name: "官Codex-Team(0.15倍率)",
      supportedModels: ["gpt-5.5"],
    },
  });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "gid://axonhub/Channel/29812",
    name: "官Codex-Team(0.15倍率)",
  });
}

{
  const card = new FakeElement({
    attrs: { "data-slot": "card" },
  });
  new FakeElement({ text: "当前按钮渠道", attrs: { "data-slot": "card-title" }, parent: card });
  const button = new FakeElement({
    text: "创建 API 密钥",
    parent: card,
  });
  helpers.rememberChannelsFromPayload({
    channels: [
      {
        id: "gid://axonhub/Channel/1",
        name: "第一个渠道",
        supportedModels: ["gpt-5.5"],
      },
      {
        id: "gid://axonhub/Channel/2",
        name: "当前按钮渠道",
        supportedModels: ["gpt-5.5"],
      },
    ],
  });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "gid://axonhub/Channel/2",
    name: "当前按钮渠道",
  });
}

{
  const card = new FakeElement({
    attrs: { "data-slot": "card" },
  });
  new FakeElement({ text: "缺失缓存渠道", attrs: { "data-slot": "card-title" }, parent: card });
  const button = new FakeElement({ text: "创建 API 密钥", parent: card });
  helpers.rememberChannelsFromPayload({
    channels: [
      {
        id: "gid://axonhub/Channel/1",
        name: "第一个渠道",
        supportedModels: ["gpt-5.5"],
      },
    ],
  });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "",
    name: "缺失缓存渠道",
  });
}

{
  const card = new FakeElement({ attrs: { "data-slot": "card" } });
  new FakeElement({ text: "React 卡片渠道", attrs: { "data-slot": "card-title" }, parent: card });
  const button = new FakeElement({
    text: "创建 API 密钥",
    parent: card,
    props: {
      __reactFiber$test: {
        memoizedProps: { channel: { id: 2875, name: "React 卡片渠道", type: "openai" } },
      },
    },
  });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "2875",
    name: "React 卡片渠道",
  });
}

{
  const card = new FakeElement({ attrs: { "data-slot": "card" } });
  new FakeElement({ text: "不应误匹配渠道", attrs: { "data-slot": "card-title" }, parent: card });
  const button = new FakeElement({
    text: "创建 API 密钥",
    parent: card,
    props: {
      __reactFiber$test: {
        memoizedProps: {
          unrelated: {
            deeply: {
              nested: { id: 991122, name: "错误深层渠道", type: "openai" },
            },
          },
        },
      },
    },
  });
  assert.deepEqual(plain(helpers.findChannelFromButton(button)), {
    id: "",
    name: "不应误匹配渠道",
  });
}

{
  const remembered = helpers.rememberChannelsFromPayload({
    data: {
      channels: {
        edges: [
          { node: { id: "gid://axonhub/Channel/777001", name: "列表响应渠道", type: "openai" } },
        ],
      },
    },
  });
  assert.equal(remembered, true);
  assert.equal(helpers.channelLabel(777001), "列表响应渠道");
}

{
  const remembered = helpers.rememberChannelsFromPayload({
    data: {
      marketplaceModel: {
        providers: [
          { channel: { id: "gid://axonhub/Channel/777002", name: "模型响应渠道", type: "openai" } },
        ],
      },
    },
  });
  assert.equal(remembered, true);
  assert.equal(helpers.channelLabel(777002), "模型响应渠道");
}

{
  const remembered = helpers.rememberChannelsFromPayload({
    data: {
      node: { id: "gid://axonhub/APIKey/777003", name: "不是渠道" },
      wrapper: {
        channel: { id: "gid://axonhub/Channel/777003", name: "嵌套渠道", type: "openai" },
      },
    },
  });
  assert.equal(remembered, true);
  assert.equal(helpers.channelLabel(777003), "嵌套渠道");
}

{
  const requestedIDs = [];
  helpers.__setGraphqlForTest(async (query, variables, operationName) => {
    assert.equal(operationName, "GetChannelName");
    requestedIDs.push(variables.id);
    return { node: { id: variables.id, name: "按需渠道名" } };
  });
  assert.equal(helpers.channelLabel(987654), "Channel #987654");
  const loaded = await helpers.loadMissingChannelNames([987654]);
  assert.equal(loaded, 1);
  assert.equal(helpers.channelLabel(987654), "按需渠道名");
  assert.deepEqual(requestedIDs, ["gid://axonhub/Channel/987654"]);
}

{
  const requestedIDs = [];
  helpers.__setGraphqlForTest(async (query, variables) => {
    requestedIDs.push(variables.id);
    return { node: { id: variables.id, name: `渠道 ${variables.id}` } };
  });
  const ids = Array.from({ length: 25 }, (_, index) => 990000 + index);
  const loaded = await helpers.loadMissingChannelNames([...ids, ids[0]]);
  assert.equal(loaded, 20);
  assert.equal(requestedIDs.length, 20);
  assert.equal(requestedIDs[0], "gid://axonhub/Channel/990000");
  assert.equal(requestedIDs[19], "gid://axonhub/Channel/990019");
}

{
  let active = 0;
  let peakActive = 0;
  helpers.__setGraphqlForTest(async (query, variables) => {
    active += 1;
    peakActive = Math.max(peakActive, active);
    await new Promise((resolve) => setTimeout(resolve, 0));
    active -= 1;
    return { node: { id: variables.id, name: `并发 ${variables.id}` } };
  });
  const loaded = await helpers.loadMissingChannelNames([991100, 991101, 991102]);
  assert.equal(loaded, 3);
  assert.equal(peakActive > 1, true);
}

{
  const payload = {
    items: [
      { name: "free", priceSummary: { allFree: true } },
      { name: "paid", priceSummary: { allFree: false } },
      { name: "unknown" },
    ],
    totalCount: 3,
    totalPages: 1,
  };
  assert.deepEqual(plain(await helpers.filterMarketplacePayloadByPrice(payload, "all")).items.map((item) => item.name), ["free", "paid", "unknown"]);
  assert.deepEqual(plain(await helpers.filterMarketplacePayloadByPrice(payload, "free")).items.map((item) => item.name), ["free"]);
  assert.deepEqual(plain(await helpers.filterMarketplacePayloadByPrice(payload, "paid")).items.map((item) => item.name), ["paid"]);
}

{
  const payload = {
    data: {
      marketplaceModel: {
        modelID: "gpt-5.4",
        providers: [
          { channel: { name: "no-current-price", channelModelPrices: [] } },
          { channel: { name: "current-free", channelModelPrices: [{ modelID: "openai/GPT-5.4", price: { items: [{ pricing: { usagePerUnit: "0" } }] } }] } },
          { channel: { name: "current-paid-by-prefix", channelModelPrices: [{ modelID: "bbg/gpt-5.4", price: { items: [{ pricing: { usagePerUnit: "100" } }] } }] } },
          { channel: { name: "free-with-multiplier", channelModelPrices: [{ modelID: "GPT-5.4", price: { items: [{ multiplier: 20, pricing: { usagePerUnit: "0" } }] } }] } },
          { channel: { name: "paid-by-flat-fee", channelModelPrices: [{ modelID: "GPT-5.4", price: { items: [{ multiplier: 20, pricing: { mode: "flat_fee", flatFee: "100", usagePerUnit: "0" } }] } }] } },
          {
            channel: {
              name: "other-model-paid-current-free",
              channelModelPrices: [
                { modelID: "gpt-5.5", price: { items: [{ pricing: { usagePerUnit: "100" } }] } },
                { modelID: "gpt-5.4", price: { items: [{ pricing: { usagePerUnit: "0" } }] } },
              ],
            },
          },
        ],
      },
    },
  };
  assert.deepEqual(
    plain(await helpers.filterMarketplacePayloadByPrice(payload, "free")).data.marketplaceModel.providers.map((item) => item.channel.name),
    ["no-current-price", "current-free", "free-with-multiplier"],
  );
  assert.deepEqual(
    plain(await helpers.filterMarketplacePayloadByPrice(payload, "paid")).data.marketplaceModel.providers.map((item) => item.channel.name),
    ["current-paid-by-prefix", "paid-by-flat-fee", "other-model-paid-current-free"],
  );
}

{
  helpers.__location.pathname = "/marketplace/models/gpt-5.4";
  helpers.__setPriceFilterForTest("free");
  const payload = {
    data: {
      marketplaceModel: {
        modelID: "gpt-5.4",
        providers: [
          {
            channel: {
              id: "gid://axonhub/Channel/12345",
              name: "implicit-current-free",
              channelModelPrices: [
                { modelID: "gpt-5.5", price: { items: [{ pricing: { usagePerUnit: "100" } }] } },
              ],
            },
          },
        ],
      },
    },
  };
  assert.deepEqual(
    plain(await helpers.filterMarketplacePayloadByPrice(payload, "free")).data.marketplaceModel.providers.map((item) => item.channel.name),
    ["implicit-current-free"],
  );
  const augmented = helpers.augmentChannelModelPricesPayload(null, null, {
    data: {
      node: {
        id: "gid://axonhub/Channel/12345",
        channelModelPrices: [
          { modelID: "gpt-5.5", price: { items: [{ pricing: { usagePerUnit: "100" } }] } },
        ],
      },
    },
  });
  const rows = augmented.data.node.channelModelPrices;
  assert.equal(rows[0].id, "implicit-free:12345:gpt-5.4");
  assert.equal(rows[0].modelID, "gpt-5.4");
  assert.equal(rows[0].price.items.every((item) => item.pricing.usagePerUnit === 0), true);
  helpers.__setPriceFilterForTest("all");
  helpers.__location.pathname = "/marketplace";
}

{
  assert.equal(helpers.normalizePriceFilter("free"), "free");
  assert.equal(helpers.normalizePriceFilter("paid"), "paid");
  assert.equal(helpers.normalizePriceFilter("weird"), "all");
}

{
  assert.equal(helpers.requestBodyText("https://hub.linux.do/admin/graphql", { body: "MarketplaceModel" }), "MarketplaceModel");
  assert.equal(helpers.requestBodyText({ body: "marketplaceModel" }), "marketplaceModel");
  assert.equal(helpers.requestUrl(new URL("https://hub.linux.do/admin/marketplace/channels?page=1")), "https://hub.linux.do/admin/marketplace/channels?page=1");
}

{
  const query = "query MarketplaceModel { marketplaceModel { providers { channel { channelModelPrices { price { items { pricing { usagePerUnit } } } } } } } }";
  const nextQuery = helpers.ensurePricingFields(query);
  assert.equal(nextQuery.includes("mode"), true);
  assert.equal(nextQuery.includes("flatFee"), true);
  assert.equal(helpers.ensurePricingFields(nextQuery), nextQuery);
}

{
  const url = helpers.marketplaceChannelsScanUrl("https://hub.linux.do/admin/marketplace/channels?page=3&first=20&search=gpt-5.5&sort=created_desc", "free", 2);
  assert.equal(url.pathname, "/admin/marketplace/channels");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(url.searchParams.get("first"), "20");
  assert.equal(url.searchParams.get("search"), "gpt-5.5");
  assert.equal(url.searchParams.get("sort"), "multiplier_asc");
}

{
  const request = helpers.sanitizeMarketplaceChannelsRequest("https://hub.linux.do/admin/marketplace/channels?page=1&first=20&search=%E2%80%8B%E2%80%8B&tag=all&sort=multiplier_asc", {});
  assert.equal(request.input.pathname, "/admin/marketplace/channels");
  assert.equal(request.input.searchParams.get("page"), "1");
  assert.equal(request.input.searchParams.get("first"), "20");
  assert.equal(request.input.searchParams.get("tag"), "all");
  assert.equal(request.input.searchParams.get("sort"), "multiplier_asc");
  assert.equal(request.input.searchParams.has("search"), false);
}

{
  assert.equal(source.includes("function findChannelActionButtons"), true);
  assert.equal(source.includes('[data-hub-tool-price-hidden="true"]'), true);
}

{
  const fields = [];
  const tagsField = new FakeElement();
  const tagsLabel = new FakeElement({ text: "标签", parent: tagsField });
  new FakeElement({ text: "全部标签", attrs: { role: "combobox" }, parent: tagsField });
  const sortField = new FakeElement();
  const sortLabel = new FakeElement({ text: "排序", parent: sortField });
  new FakeElement({ text: "综合推荐", attrs: { role: "combobox" }, parent: sortField });
  fields.push(tagsLabel, sortLabel);
  const anchors = helpers.findMarketplaceFilterFields(fields);
  assert.strictEqual(anchors.tags, tagsField);
  assert.strictEqual(anchors.sort, sortField);
}

{
  const main = new FakeElement();
  helpers.__documentState.main = main;
  new FakeElement({
    text: "渠道广场",
    attrs: { role: "tab", "aria-selected": "true" },
    parent: main,
  });
  helpers.__documentState.selectedTab = new FakeElement({
    text: "绑定渠道",
    attrs: { role: "tab", "aria-selected": "true" },
  });
  helpers.__location.pathname = "/marketplace";
  assert.equal(helpers.isMarketplaceChannelsTabActive(), true);
  helpers.__location.pathname = "/project/api-keys";
  assert.equal(helpers.isMarketplaceChannelsTabActive(), false);
}

console.log("minimal binder helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

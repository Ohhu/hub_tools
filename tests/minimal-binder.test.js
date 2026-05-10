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
        if (
          selector === "[data-slot=\"card-title\"]" &&
          child.attributes["data-slot"] === "card-title"
        ) {
          results.push(child);
        } else if (selector === "*" || selector === "button") {
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

function loadHelpers() {
  const source = fs.readFileSync("LinuxDo Hub Tool.user.js", "utf8");
  const documentElement = new FakeElement();
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
  return context.window.__hubKeyBinderTest;
}

const helpers = loadHelpers();
const plain = (value) => JSON.parse(JSON.stringify(value));
const source = fs.readFileSync("LinuxDo Hub Tool.user.js", "utf8");

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
assert.equal(source.includes('data-role="edit-key-picker"'), true);
assert.equal(source.includes('data-role="edit-key-label"'), true);
assert.equal(source.includes("hkb-edit-list{height:100%;min-height:92px"), true);
assert.equal(source.includes('>⧉</button>'), false);
assert.equal(source.includes('>↻</button>'), false);
assert.equal(source.includes("linuxdoProfile{id username name avatarTemplate avatarUrl active trustLevel silenced externalIds updatedAt}"), true);
assert.equal(source.includes("node{id createdAt updatedAt user{id firstName lastName email avatar linuxdoUserID linuxdoUsername"), true);
assert.equal(source.includes("async function loadSelectedKeyValue"), false);

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

console.log("minimal binder helpers ok");

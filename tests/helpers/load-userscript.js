const fs = require("node:fs");
const vm = require("node:vm");
const { FakeElement } = require("./fake-dom");

function loadHelpers(sourcePath = "LinuxDo Hub Tool.user.js") {
  const source = fs.readFileSync(sourcePath, "utf8");
  const documentElement = new FakeElement();
  const documentState = { main: null, selectedTab: null };
  const context = {
    Headers,
    Request,
    MutationObserver: class { observe() {} },
    ReadableStream,
    URL,
    URLSearchParams,
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
  context.window.Request = Request;
  context.window.ReadableStream = ReadableStream;
  context.window.URL = URL;
  context.window.URLSearchParams = URLSearchParams;
  vm.runInNewContext(source, context.window);
  context.window.__hubKeyBinderTest.__documentState = documentState;
  context.window.__hubKeyBinderTest.__location = context.location;
  return context.window.__hubKeyBinderTest;
}

module.exports = { loadHelpers };


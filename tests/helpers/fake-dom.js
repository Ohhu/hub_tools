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

  get lastElementChild() {
    return this.children.at(-1) || null;
  }

  append(node) {
    if (node.parentElement) {
      const previousIndex = node.parentElement.children.indexOf(node);
      if (previousIndex >= 0) node.parentElement.children.splice(previousIndex, 1);
    }
    this.children.push(node);
    node.parentElement = this;
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
        if (matchesFakeSelector(child, selector)) results.push(child);
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

module.exports = {
  FakeClassList,
  FakeElement,
  matchesFakeSelector,
};

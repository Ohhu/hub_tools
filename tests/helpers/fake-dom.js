class FakeClassList {
  constructor(value = "") {
    this.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
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
    this.classList = new FakeClassList(className);
    this.parentElement = parent;
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    Object.assign(this, props);
    if (parent) parent.children.push(this);
  }

  get className() {
    return this.classList.toString();
  }

  set className(value) {
    this.classList = new FakeClassList(value);
  }

  get lastElementChild() {
    return this.children.at(-1) || null;
  }

  get previousElementSibling() {
    const siblings = this.parentElement?.children || [];
    const index = siblings.indexOf(this);
    return index > 0 ? siblings[index - 1] : null;
  }

  get nextElementSibling() {
    const siblings = this.parentElement?.children || [];
    const index = siblings.indexOf(this);
    return index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  append(node) {
    if (node.parentElement) {
      const previousIndex = node.parentElement.children.indexOf(node);
      if (previousIndex >= 0) node.parentElement.children.splice(previousIndex, 1);
    }
    this.children.push(node);
    node.parentElement = this;
  }

  appendChild(node) {
    this.append(node);
    return node;
  }

  insertBefore(node, referenceNode) {
    if (node.parentElement) {
      const previousIndex = node.parentElement.children.indexOf(node);
      if (previousIndex >= 0) node.parentElement.children.splice(previousIndex, 1);
    }
    const referenceIndex = referenceNode ? this.children.indexOf(referenceNode) : -1;
    if (referenceIndex >= 0) this.children.splice(referenceIndex, 0, node);
    else this.children.push(node);
    node.parentElement = this;
    return node;
  }

  remove() {
    if (this.parentElement) {
      const index = this.parentElement.children.indexOf(this);
      if (index >= 0) this.parentElement.children.splice(index, 1);
    }
    this.parentElement = null;
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
    this.parentElement = null;
  }
}

function matchesFakeSelector(node, selector) {
  return String(selector).split(",").some((part) => matchesFakeCompoundSelector(node, part.trim()));
}

function matchesFakeCompoundSelector(node, selector) {
  const parts = selector.split(/\s+/).filter(Boolean);
  if (!parts.length) return false;
  if (!matchesFakeSimpleSelector(node, parts[parts.length - 1])) return false;
  let ancestor = node.parentElement;
  for (let index = parts.length - 2; index >= 0; index -= 1) {
    while (ancestor && !matchesFakeSimpleSelector(ancestor, parts[index])) ancestor = ancestor.parentElement;
    if (!ancestor) return false;
    ancestor = ancestor.parentElement;
  }
  return true;
}

function matchesFakeSimpleSelector(node, selector) {
  if (!node) return false;
  if (selector === "*" || selector === "button") return true;
  const attributePattern = /\[([a-zA-Z-]+)(?:="([^"]*)")?\]/g;
  for (const match of selector.matchAll(attributePattern)) {
    if (match[2] === undefined) {
      if (node.attributes?.[match[1]] == null) return false;
    } else if (node.attributes?.[match[1]] !== match[2]) return false;
  }
  let remaining = selector.replace(attributePattern, "");
  const classes = remaining.match(/\.([a-zA-Z0-9_-]+)/g) || [];
  for (const className of classes) {
    if (!node.classList?.contains?.(className.slice(1))) return false;
  }
  remaining = remaining.replace(/\.([a-zA-Z0-9_-]+)/g, "").trim();
  if (remaining) return String(node.tagName || "").toLowerCase() === remaining.toLowerCase();
  return true;
}

module.exports = {
  FakeClassList,
  FakeElement,
  matchesFakeSelector,
};

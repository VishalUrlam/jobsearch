const fs = require("fs");
const vm = require("vm");

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.hidden = false;
    this.value = "";
    this.checked = false;
    this.textContent = "";
    this.className = "";
    this.type = "";
    this.id = "";
    this.rel = "";
    this.href = "";
    this.target = "";
  }

  set innerHTML(_value) {
    this.children = [];
    this.textContent = "";
  }

  get innerHTML() {
    return this.textContent;
  }

  append(...children) {
    this.children.push(...children);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = [...children];
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
    this[name] = value;
  }

  addEventListener(name, callback) {
    this.listeners[name] = callback;
  }

  focus() {}

  get selectedOptions() {
    const selected = this.children.find(child => child.value === this.value);
    return selected ? [selected] : [];
  }
}

class FakeOption extends FakeElement {
  constructor(label, value) {
    super("option");
    this.textContent = label;
    this.value = value;
    this.disabled = false;
  }
}

const elements = new Map();
const ids = [
  "jobTitle",
  "timeFilter",
  "startButton",
  "openSelectedButton",
  "advancedToggle",
  "advancedPanel",
  "excludeRemote",
  "locationSelect",
  "engineSelect",
  "boardPreset",
  "boardPicker",
  "selectAllBoards",
  "clearBoards",
  "results",
  "resultActions",
  "resultSummary",
  "emptyState",
  "suggestions",
  "clearButton",
  "themeToggle"
];

ids.forEach(id => {
  elements.set(id, new FakeElement(id.includes("Select") || id === "timeFilter" ? "select" : "div"));
});

elements.get("engineSelect").value = "google";
["google", "duckduckgo", "bing", "yahoo", "kagi", "qwant", "brave", "startpage"].forEach(engine => {
  elements.get("engineSelect").append(new FakeOption(engine, engine));
});
elements.get("boardPreset").value = "all";
["all", "popular", "ats", "startup", "company", "enterprise", "custom"].forEach(preset => {
  elements.get("boardPreset").append(new FakeOption(preset, preset));
});

const documentElement = {
  classList: {
    values: new Set(),
    add(value) { this.values.add(value); },
    contains(value) { return this.values.has(value); },
    toggle(value) {
      this.values.has(value) ? this.values.delete(value) : this.values.add(value);
    }
  }
};

const context = {
  console,
  URLSearchParams,
  Date,
  Option: FakeOption,
  document: {
    documentElement,
    querySelector(selector) {
      return elements.get(selector.slice(1));
    },
    createElement(tag) {
      return new FakeElement(tag);
    },
    createTextNode(text) {
      const node = new FakeElement("#text");
      node.textContent = text;
      return node;
    },
    addEventListener(event, callback) {
      if (event === "DOMContentLoaded") callback();
    }
  },
  window: {
    location: { search: "", pathname: "/index.html" },
    opened: [],
    open(url) {
      this.opened.push(url);
    },
    scrollTo() {}
  },
  history: {
    pushed: "",
    pushState(_state, _title, url) {
      this.pushed = url;
    }
  }
};

context.globalThis = context;
vm.runInNewContext(fs.readFileSync("app.js", "utf8"), context, { filename: "app.js" });

elements.get("jobTitle").value = "software engineer";
elements.get("engineSelect").value = "duckduckgo";
elements.get("locationSelect").value = "california";
elements.get("excludeRemote").checked = true;
context.generateList();

const resultGroups = elements.get("results").children;
const firstList = resultGroups[0].children[1];
const firstCard = firstList.children[0];
const firstLink = firstCard.children[1].children[0];
const firstCheckbox = firstCard.children[0];

if (resultGroups.length !== 1) {
  throw new Error(`Expected 1 result group, got ${resultGroups.length}`);
}
if (firstList.children.length !== 40) {
  throw new Error(`Expected 40 target cards, got ${firstList.children.length}`);
}
if (!firstLink.href.includes("duckduckgo.com/html/")) {
  throw new Error(`Expected DuckDuckGo URL, got ${firstLink.href}`);
}
if (!firstLink.href.includes("california")) {
  throw new Error(`Expected location in URL, got ${firstLink.href}`);
}
if (firstLink.href.includes("%20remote")) {
  throw new Error(`Remote term should be excluded, got ${firstLink.href}`);
}
if (context.window.opened.length !== 0) {
  throw new Error("Generating results should not open tabs");
}
if (firstCheckbox.listeners.click) {
  firstCheckbox.listeners.click();
}
if (context.window.opened.length !== 0) {
  throw new Error("Checking a result card should not open a tab");
}

context.setSelectedBoards(["greenhouse.io", "lever.co"]);
context.generateList();

const filteredList = elements.get("results").children[0].children[1];
if (filteredList.children.length !== 2) {
  throw new Error(`Expected 2 filtered target cards, got ${filteredList.children.length}`);
}
if (!context.history.pushed.includes("boards=greenhouse.io%2Clever.co")) {
  throw new Error(`Expected selected boards in URL, got ${context.history.pushed}`);
}

context.openSelectedSearches();
if (context.window.opened.length !== 2) {
  throw new Error(`Expected explicit open action to open 2 tabs, got ${context.window.opened.length}`);
}

console.log("smoke test passed");

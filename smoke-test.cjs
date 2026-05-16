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
    this.classList = {
      values: new Set(),
      add: value => this.classList.values.add(value),
      contains: value => this.classList.values.has(value)
    };
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
  "advancedToggle",
  "advancedPanel",
  "excludeRemote",
  "locationSelect",
  "engineSelect",
  "boardPreset",
  "boardPicker",
  "selectAllBoards",
  "clearBoards",
  "searchStatus",
  "resultsPanel",
  "resultSummary",
  "resultList",
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
      return {};
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

const firstBoardInput = elements.get("boardPicker").children[0].children[0];
firstBoardInput.listeners.change();
if (context.window.opened.length !== 0) {
  throw new Error("Changing a board selection should not open tabs");
}

context.setSelectedBoards(["greenhouse.io", "lever.co"]);
context.renderSearchResults();

if (!context.history.pushed.includes("boards=greenhouse.io%2Clever.co")) {
  throw new Error(`Expected selected boards in URL, got ${context.history.pushed}`);
}
if (context.window.opened.length !== 0) {
  throw new Error(`Search should render links without opening tabs, got ${context.window.opened.length}`);
}
if (elements.get("resultsPanel").hidden) {
  throw new Error("Expected results panel to be visible");
}
if (elements.get("resultSummary").textContent !== "2 links") {
  throw new Error(`Expected 2 links summary, got ${elements.get("resultSummary").textContent}`);
}
if (elements.get("resultList").children.length !== 2) {
  throw new Error(`Expected 2 selected board rows, got ${elements.get("resultList").children.length}`);
}
const firstButton = elements.get("resultList").children[0].children[1];
firstButton.listeners.click();
if (context.window.opened.length !== 1) {
  throw new Error(`Expected Open link to open one tab, got ${context.window.opened.length}`);
}
if (firstButton.textContent !== "Opened") {
  throw new Error(`Expected opened button label, got ${firstButton.textContent}`);
}
if (!firstButton.classList.contains("is-opened")) {
  throw new Error("Expected opened button cue class");
}
if (!context.window.opened[0].includes("duckduckgo.com/html/")) {
  throw new Error(`Expected DuckDuckGo URL, got ${context.window.opened[0]}`);
}
if (!context.window.opened[0].includes("california")) {
  throw new Error(`Expected location in URL, got ${context.window.opened[0]}`);
}
if (context.window.opened[0].includes("%20remote")) {
  throw new Error(`Remote term should be excluded, got ${context.window.opened[0]}`);
}

if (elements.get("themeToggle").textContent !== "Dark mode") {
  throw new Error(`Expected initial dark mode toggle, got ${elements.get("themeToggle").textContent}`);
}
elements.get("themeToggle").listeners.click();
if (elements.get("themeToggle").textContent !== "Light mode") {
  throw new Error(`Expected light mode toggle after dark mode, got ${elements.get("themeToggle").textContent}`);
}

console.log("smoke test passed");

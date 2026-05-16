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
    navigated: [],
    open(url) {
      this.opened.push(url);
      const windowRef = {
        opener: {},
        location: {
          replace: nextUrl => {
            this.navigated.push(nextUrl);
          }
        }
      };
      return windowRef;
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
context.launchSearches();

if (!context.history.pushed.includes("boards=greenhouse.io%2Clever.co")) {
  throw new Error(`Expected selected boards in URL, got ${context.history.pushed}`);
}
if (context.window.opened.length !== 2) {
  throw new Error(`Expected Search to open 2 tabs, got ${context.window.opened.length}`);
}
if (!context.window.opened.every(url => url === "about:blank")) {
  throw new Error(`Expected placeholder tabs first, got ${context.window.opened.join(", ")}`);
}
if (context.window.navigated.length !== 2) {
  throw new Error(`Expected Search to navigate 2 tabs, got ${context.window.navigated.length}`);
}
if (!context.window.navigated[0].includes("duckduckgo.com/html/")) {
  throw new Error(`Expected DuckDuckGo URL, got ${context.window.navigated[0]}`);
}
if (!context.window.navigated[0].includes("california")) {
  throw new Error(`Expected location in URL, got ${context.window.navigated[0]}`);
}
if (context.window.navigated[0].includes("%20remote")) {
  throw new Error(`Remote term should be excluded, got ${context.window.navigated[0]}`);
}
if (elements.get("searchStatus").textContent !== "Opened 2 search tabs.") {
  throw new Error(`Expected opened status, got ${elements.get("searchStatus").textContent}`);
}

console.log("smoke test passed");

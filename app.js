const targetSites = [
  ["greenhouse.io", "Greenhouse", "ats"],
  ["lever.co", "Lever", "ats"],
  ["ashbyhq.com", "Ashby", "ats"],
  ["remoterocketship.com", "Remote Rocketship", "startup"],
  ["pinpointhq.com", "Pinpoint", "ats"],
  ["jobs.*", "Jobs Subdomain", "company"],
  ["careers.*", "Careers Pages", "company"],
  ["people.*", "People Subdomain", "company"],
  ["talent.*", "Talent Subdomain", "company"],
  ["recruiting.paylocity.com", "Paylocity", "enterprise"],
  ["keka.com", "Keka", "enterprise"],
  ["jobs.workable.com", "Workable", "ats"],
  ["breezy.hr", "BreezyHR", "ats"],
  ["wellfound.com", "Wellfound", "startup"],
  ["workatastartup.com", "Y Combinator Work at a Startup", "startup"],
  ["oraclecloud.com", "Oracle Cloud", "enterprise"],
  ["myworkdayjobs.com", "Workday Jobs", "enterprise"],
  ["recruitee.com", "Recruitee", "ats"],
  ["rippling", "Rippling", "enterprise"],
  ["jobs.gusto.com", "Gusto", "enterprise"],
  ["careerpuck.com", "CareerPuck", "ats"],
  ["teamtailor.com", "Teamtailor", "ats"],
  ["jobs.smartrecruiters.com", "SmartRecruiters", "ats"],
  ["jobappnetwork.com", "TalentReef", "enterprise"],
  ["homerun.co", "Homerun", "ats"],
  ["gem.com", "Gem", "ats"],
  ["trakstar.com", "Trakstar", "ats"],
  ["catsone.com", "Cats", "ats"],
  ["applytojob.com", "JazzHR", "ats"],
  ["jobvite.com", "Jobvite", "ats"],
  ["icims.com", "iCIMS", "enterprise"],
  ["dover.io", "Dover", "ats"],
  ["notion.site", "Notion", "company"],
  ["builtin.com/job/", "Builtin", "startup"],
  ["adp", "ADP", "enterprise"],
  ["linkedin.com", "LinkedIn", "popular"],
  ["glassdoor.com/job-listing/", "Glassdoor", "popular"],
  ["factorialhr.com", "Factorial", "enterprise"],
  ["trinethire.com", "TriNet Hire", "enterprise"],
  ["other-pages", "Other Pages", "company"]
];

const boardPresets = {
  all: targetSites.map(([site]) => site),
  popular: ["greenhouse.io", "lever.co", "ashbyhq.com", "linkedin.com", "wellfound.com", "workatastartup.com", "myworkdayjobs.com", "jobs.smartrecruiters.com", "glassdoor.com/job-listing/"],
  ats: targetSites.filter(([, , group]) => group === "ats").map(([site]) => site),
  startup: targetSites.filter(([, , group]) => group === "startup").map(([site]) => site),
  company: targetSites.filter(([, , group]) => group === "company").map(([site]) => site),
  enterprise: targetSites.filter(([, , group]) => group === "enterprise").map(([site]) => site)
};

let boardInputs = [];

const countryQueries = {
  "canada": "canada",
  "usa": "usa",
  "uk": "uk",
  "germany": "germany",
  "france": "france",
  "australia": "australia",
  "brazil": "brazil",
  "china": "china",
  "russia": "russia",
  "india": "india",
  "japan": "japan",
  "south korea": "south korea",
  "mexico": "mexico",
  "italy": "italy",
  "spain": "spain",
  "netherlands": "netherlands",
  "sweden": "sweden",
  "norway": "norway",
  "denmark": "denmark",
  "finland": "finland",
  "poland": "poland",
  "ireland": "ireland",
  "belgium": "belgium",
  "switzerland": "switzerland",
  "new zealand": "new zealand",
  "argentina": "argentina",
  "chile": "chile",
  "south africa": "south africa",
  "egypt": "egypt",
  "saudi arabia": "saudi arabia",
  "turkey": "turkey",
  "greece": "greece",
  "portugal": "portugal",
  "austria": "austria",
  "hungary": "hungary",
  "czech republic": "czech republic",
  "slovakia": "slovakia",
  "romania": "romania",
  "bulgaria": "bulgaria",
  "croatia": "croatia",
  "serbia": "serbia",
  "malaysia": "malaysia",
  "singapore": "singapore",
  "indonesia": "indonesia",
  "philippines": "philippines",
  "vietnam": "vietnam",
  "thailand": "thailand",
  "israel": "israel",
  "united arab emirates": "united arab emirates",
  "qatar": "qatar",
  "kuwait": "kuwait",
  "nigeria": "nigeria",
  "kenya": "kenya",
  "ghana": "ghana",
  "morocco": "morocco",
  "estonia": "estonia",
  "lithuania": "lithuania",
  "latvia": "latvia",
  "slovenia": "slovenia",
  "luxembourg": "luxembourg",
  "ukraine": "ukraine",
  "united states": "usa",
  "united states of america": "usa",
  "pakistan": "pakistan",
  "bangladesh": "bangladesh",
  "sri lanka": "sri lanka",
  "kazakhstan": "kazakhstan",
  "uzbekistan": "uzbekistan",
  "ethiopia": "ethiopia",
  "tanzania": "tanzania",
  "uganda": "uganda",
  "ivory coast": "ivory coast",
  "algeria": "algeria",
  "oman": "oman",
  "bahrain": "bahrain",
  "jordan": "jordan",
  "lebanon": "lebanon",
  "jamaica": "jamaica",
  "dominican republic": "dominican republic",
  "cuba": "cuba",
  "colombia": "colombia",
  "peru": "peru",
  "ecuador": "ecuador",
  "uruguay": "uruguay",
  "paraguay": "paraguay",
  "fiji": "fiji",
  "papua new guinea": "papua new guinea",
  "samoa": "samoa",
  "armenia": "armenia",
  "azerbaijan": "azerbaijan",
  "alabama": "alabama",
  "alaska": "alaska",
  "arizona": "arizona",
  "arkansas": "arkansas",
  "california": "california",
  "colorado": "colorado",
  "connecticut": "connecticut",
  "delaware": "delaware",
  "district of columbia": "washington dc",
  "florida": "florida",
  "georgia": "georgia",
  "hawaii": "hawaii",
  "idaho": "idaho",
  "illinois": "illinois",
  "indiana": "indiana",
  "iowa": "iowa",
  "kansas": "kansas",
  "kentucky": "kentucky",
  "louisiana": "louisiana",
  "maine": "maine",
  "maryland": "maryland",
  "massachusetts": "massachusetts",
  "michigan": "michigan",
  "minnesota": "minnesota",
  "mississippi": "mississippi",
  "missouri": "missouri",
  "montana": "montana",
  "nebraska": "nebraska",
  "nevada": "nevada",
  "new hampshire": "new hampshire",
  "new jersey": "new jersey",
  "new mexico": "new mexico",
  "new york": "new york",
  "north carolina": "north carolina",
  "north dakota": "north dakota",
  "ohio": "ohio",
  "oklahoma": "oklahoma",
  "oregon": "oregon",
  "pennsylvania": "pennsylvania",
  "rhode island": "rhode island",
  "south carolina": "south carolina",
  "south dakota": "south dakota",
  "tennessee": "tennessee",
  "texas": "texas",
  "utah": "utah",
  "vermont": "vermont",
  "virginia": "virginia",
  "washington": "washington",
  "washington dc": "washington dc",
  "west virginia": "west virginia",
  "wisconsin": "wisconsin",
  "wyoming": "wyoming"
};

const usStates = new Set([
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware",
  "district of columbia", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa",
  "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota",
  "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey",
  "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon",
  "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah",
  "vermont", "virginia", "washington", "washington dc", "west virginia", "wisconsin", "wyoming"
]);

const jobGroups = {
  media: ["Video Producer", "Film Editor", "Content Producer", "Content Creator", "Media Manager", "Digital Marketing Specialist", "Multimedia Designer", "Social Media Strategist", "Brand Content Manager", "Video Production Coordinator", "Creative Director"],
  qa: ["Qa Engineer", "Software Tester", "Automation Engineer", "Test Analyst", "Quality Assurance Specialist", "Test Engineer", "Qa", "Sdet", "Software Development Engineer In Test", "Release Manager", "Quality Assurance", "Software Quality Assurance"],
  software: ["Software Engineer", "Developer", "Systems Engineer", "Application Developer", "Software Architect", "Full Stack Developer", "Frontend", "Engineering Manager", "React"],
  project: ["Project Manager", "Program Manager", "Operations Manager", "Team Lead", "Project Coordinator"],
  product: ["Product Manager", "Product Owner", "Program Manager", "Innovation Manager", "Technical Product Manager", "Digital Product Manager"],
  salesforce: ["Salesforce Administrator", "Salesforce Developer", "Salesforce Consultant", "Salesforce Business Analyst", "Database Administrator", "IT Systems Administrator"],
  data: ["Data Analyst", "Business Intelligence Analyst", "Data Scientist", "Power Bi", "Python", "Data Engineer", "Data", "Business Analyst"],
  agile: ["Scrum Master", "Agile Coach", "Lean Practioner", "Kanban Coach", "Agile Project Facilitator", "Agile Transformation Lead", "Agile Team Coach", "Iteration Manager", "Scrum"]
};

const olderTimeOptions = [
  ["older1month", "Older than 1 month"],
  ["older3months", "Older than 3 months"],
  ["older6months", "Older than 6 months"]
];

const timeOptionSets = {
  google: [["all", "All"], ["1hour", "Past Hour"], ["4hours", "Past 4 Hours"], ["8hours", "Past 8 Hours"], ["12hours", "Past 12 Hours"], ["24hours", "Past 24 Hours"], ["48hours", "Past 48 Hours"], ["72hours", "Past 72 Hours"], ["week", "Past Week"], ["month", "Past Month"], ...olderTimeOptions],
  duckduckgo: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ["year", "Past Year"], ...olderTimeOptions],
  bing: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ...olderTimeOptions],
  yahoo: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ...olderTimeOptions],
  kagi: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ["year", "Past Year"], ...olderTimeOptions],
  qwant: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ...olderTimeOptions],
  brave: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ["year", "Past Year"], ...olderTimeOptions],
  startpage: [["all", "All"], ["24hours", "Past 24 Hours"], ["week", "Past Week"], ["month", "Past Month"], ["year", "Past Year"], ...olderTimeOptions]
};

const els = {
  jobTitle: document.querySelector("#jobTitle"),
  timeFilter: document.querySelector("#timeFilter"),
  startButton: document.querySelector("#startButton"),
  advancedPanel: document.querySelector("#advancedPanel"),
  excludeRemote: document.querySelector("#excludeRemote"),
  locationSelect: document.querySelector("#locationSelect"),
  boardPreset: document.querySelector("#boardPreset"),
  boardPicker: document.querySelector("#boardPicker"),
  selectAllBoards: document.querySelector("#selectAllBoards"),
  clearBoards: document.querySelector("#clearBoards"),
  searchStatus: document.querySelector("#searchStatus"),
  resultsPanel: document.querySelector("#resultsPanel"),
  resultSummary: document.querySelector("#resultSummary"),
  resultList: document.querySelector("#resultList"),
  suggestions: document.querySelector("#suggestions"),
  clearButton: document.querySelector("#clearButton"),
  themeToggle: document.querySelector("#themeToggle"),
  sunIcon: document.querySelector(".sun-icon"),
  moonIcon: document.querySelector(".moon-icon")
};

function titleCase(value) {
  return value.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
}

function labelCase(value) {
  if (value === "usa") return "United States";
  return value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function populateLocations() {
  const countries = [];
  const states = [];
  Object.keys(countryQueries).forEach(key => {
    if (["usa", "united states", "united states of america"].includes(key)) return;
    if (usStates.has(key)) states.push(key);
    else countries.push(key);
  });

  els.locationSelect.innerHTML = "";
  els.locationSelect.append(new Option("All Locations", ""));
  els.locationSelect.append(new Option("United States", "usa"));
  countries.sort().forEach(country => els.locationSelect.append(new Option(labelCase(country), country)));
  const divider = new Option("------- US States -------", "");
  divider.disabled = true;
  els.locationSelect.append(divider);
  states.sort().forEach(state => els.locationSelect.append(new Option(labelCase(state), state)));
}

function boardInputId(site) {
  return `board-${site.replace(/[^a-z0-9]+/gi, "-")}`;
}

function populateBoards() {
  els.boardPicker.innerHTML = "";
  boardInputs = targetSites.map(([site, label]) => {
    const wrapper = document.createElement("label");
    wrapper.className = "board-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = boardInputId(site);
    checkbox.value = site;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => {
      syncBoardPreset();
      clearLaunchStatus();
    });

    const text = document.createElement("span");
    text.textContent = label;
    wrapper.append(checkbox, text);
    els.boardPicker.append(wrapper);
    return checkbox;
  });
}

function getSelectedBoardIds() {
  return boardInputs.filter(input => input.checked).map(input => input.value);
}

function getSelectedTargets() {
  const selected = new Set(getSelectedBoardIds());
  return targetSites.filter(([site]) => selected.has(site));
}

function setSelectedBoards(ids) {
  const selected = new Set(ids);
  boardInputs.forEach(input => {
    input.checked = selected.has(input.value);
  });
  syncBoardPreset();
}

function syncBoardPreset() {
  const selected = getSelectedBoardIds().sort().join("|");
  const preset = Object.entries(boardPresets).find(([, ids]) => ids.slice().sort().join("|") === selected);
  els.boardPreset.value = preset ? preset[0] : "custom";
}

function applyBoardPreset(preset) {
  if (boardPresets[preset]) {
    setSelectedBoards(boardPresets[preset]);
  }
  clearLaunchStatus();
}

function rebuildTimeOptions(preferredValue) {
  const engine = "google";
  const options = timeOptionSets[engine] || timeOptionSets.google;
  const current = preferredValue || els.timeFilter.value || "24hours";
  els.timeFilter.innerHTML = "";
  options.forEach(([value, label]) => els.timeFilter.append(new Option(label, value)));
  els.timeFilter.value = options.some(([value]) => value === current) ? current : "24hours";
}

function monthsBack(timeFilter) {
  return { older1month: 1, older3months: 3, older6months: 6 }[timeFilter] || null;
}

function pastDate(months, format = "iso") {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return format === "us" ? `${mm}/${dd}/${yyyy}` : `${yyyy}-${mm}-${dd}`;
}

function withOlderThan(query, timeFilter) {
  const months = monthsBack(timeFilter);
  return months ? `${query} before:${pastDate(months)}` : query;
}

function googleTimeParam(timeFilter) {
  const exact = {
    "1hour": "&tbs=qdr:h1",
    "4hours": "&tbs=qdr:h4",
    "8hours": "&tbs=qdr:h8",
    "12hours": "&tbs=qdr:h12",
    "24hours": "&tbs=qdr:d",
    "48hours": "&tbs=qdr:h48",
    "72hours": "&tbs=qdr:h72",
    week: "&tbs=qdr:w",
    month: "&tbs=qdr:m",
    year: "&tbs=qdr:y"
  };
  const months = monthsBack(timeFilter);
  return months ? `&tbs=cdr:1,cd_max:${pastDate(months, "us")}` : exact[timeFilter] || "";
}

function startpageAfterDate(timeFilter) {
  const days = { "24hours": 1, week: 7, month: 30, year: 365 }[timeFilter];
  if (!days) return "";
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

function searchUrl(engine, query, timeFilter) {
  const datedQuery = withOlderThan(query, timeFilter);
  const encoded = encodeURIComponent(datedQuery);

  if (engine === "duckduckgo") {
    const df = { "24hours": "d", week: "w", month: "m", year: "y" }[timeFilter];
    return `https://duckduckgo.com/html/?q=${encoded}${df ? `&df=${df}` : ""}`;
  }
  if (engine === "bing") {
    const code = { "24hours": "ez1", week: "ez2", month: "ez3" }[timeFilter];
    return `https://www.bing.com/search?q=${encoded}${code ? `&filters=ex1%3a%22${code}%22` : ""}`;
  }
  if (engine === "yahoo") {
    const code = { "24hours": "d", week: "w", month: "m" }[timeFilter];
    return `https://search.yahoo.com/search?p=${encoded}${code ? `&fr2=time&btf=${code}&fr=sfp` : ""}`;
  }
  if (engine === "kagi") {
    const code = { "24hours": "1", week: "2", month: "3", year: "4" }[timeFilter];
    return `https://kagi.com/search?q=${encoded}${code ? `&dr=${code}` : ""}`;
  }
  if (engine === "qwant") {
    const code = { "24hours": "day", week: "week", month: "month" }[timeFilter];
    return `https://www.qwant.com/?q=${encoded}&t=web${code ? `&freshness=${code}` : ""}`;
  }
  if (engine === "brave") {
    const code = { "24hours": "pd", week: "pw", month: "pm", year: "py" }[timeFilter];
    return `https://search.brave.com/search?q=${encoded}&source=web${code ? `&tf=${code}` : ""}`;
  }
  if (engine === "startpage") {
    const after = startpageAfterDate(timeFilter);
    const startpageQuery = after && !monthsBack(timeFilter) ? `${query} after:${after}` : datedQuery;
    return `https://www.startpage.com/sp/search?query=${encodeURIComponent(startpageQuery)}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(query)}${googleTimeParam(timeFilter)}`;
}

function formattedTime(timeFilter) {
  return Object.values(timeOptionSets).flat().find(([value]) => value === timeFilter)?.[1] || "All";
}

function linkedinTime(timeFilter) {
  return {
    "1hour": "r3600",
    "4hours": "r14400",
    "8hours": "r28800",
    "12hours": "r43200",
    "24hours": "r86400",
    "48hours": "r172800",
    "72hours": "r259200",
    year: "r31536000"
  }[timeFilter] || "r10800";
}

function targetUrl(site, jobTitle, context) {
  const encodedJob = encodeURIComponent(jobTitle);
  if (site === "remoterocketship.com") {
    return `https://remoterocketship.com/?ref=jobsearchlauncher&jobTitle=${encodedJob}`;
  }

  const locationTerm = context.locationQuery ? ` ${context.locationQuery}` : "";
  const remoteTerm = context.excludeRemote ? "" : " remote";

  if (site === "adp") {
    return searchUrl(context.engine, `"${jobTitle}" (site:workforcenow.adp.com OR site:myjobs.adp.com)${remoteTerm}${locationTerm}`, context.timeFilter);
  }
  if (site === "rippling") {
    return searchUrl(context.engine, `"${jobTitle}" (site:rippling.com OR site:rippling-ats.com)${remoteTerm}${locationTerm}`, context.timeFilter);
  }
  if (site === "careers.*") {
    return searchUrl(context.engine, `"${jobTitle}" (site:careers.* OR site:*/careers/* OR site:*/career/*)${remoteTerm}${locationTerm}`, context.timeFilter);
  }
  if (site === "other-pages") {
    return searchUrl(context.engine, `"${jobTitle}" (site:*/employment/* OR site:*/opportunities/* OR site:*/openings/* OR site:*/join-us/* OR site:*/work-with-us/*)${remoteTerm}${locationTerm}`, context.timeFilter);
  }
  if (site === "linkedin.com" && !monthsBack(context.timeFilter)) {
    let linkedinLocation = context.locationLabel || "Remote";
    if (context.excludeRemote && !context.locationLabel) linkedinLocation = "United States";
    return `https://www.linkedin.com/jobs/search/?keywords=${encodedJob}&location=${encodeURIComponent(linkedinLocation)}&f_TPR=${linkedinTime(context.timeFilter)}`;
  }

  return searchUrl(context.engine, `"${jobTitle}" site:${site}${remoteTerm}${locationTerm}`, context.timeFilter);
}

function relatedTitles(jobTitle) {
  return Object.values(jobGroups).find(group => group.includes(jobTitle))?.filter(title => title !== jobTitle) || [];
}

function detectLocation(jobTitle) {
  const lowerTitle = jobTitle.toLowerCase();
  const detected = Object.keys(countryQueries)
    .sort((a, b) => b.length - a.length)
    .find(country => lowerTitle.includes(country));
  if (!detected) return { title: jobTitle, key: "", query: "", label: "" };
  return {
    title: jobTitle.replace(new RegExp(detected, "ig"), "").trim(),
    key: detected,
    query: countryQueries[detected],
    label: labelCase(detected)
  };
}

function updateUrl(jobTitles) {
  const params = new URLSearchParams(window.location.search);
  const selectedBoards = getSelectedBoardIds();
  params.set("job", jobTitles.join(","));
  params.set("time", els.timeFilter.value);
  params.set("campaign", jobTitles.join(","));
  els.excludeRemote.checked ? params.set("remote", "false") : params.delete("remote");
  els.locationSelect.value ? params.set("location", els.locationSelect.value) : params.delete("location");
  if (selectedBoards.length === targetSites.length) {
    params.delete("boards");
  } else if (selectedBoards.length) {
    params.set("boards", selectedBoards.join(","));
  } else {
    params.set("boards", "none");
  }
  if (document.documentElement.classList.contains("dark")) params.set("mode", "dark");
  else params.delete("mode");
  history.pushState(null, "", `?${params.toString()}`);
}

function renderSuggestions(jobTitles) {
  const firstMatch = jobTitles.find(title => relatedTitles(title).length);
  if (!firstMatch) {
    els.suggestions.hidden = true;
    els.suggestions.innerHTML = "";
    return;
  }

  els.suggestions.hidden = false;
  els.suggestions.replaceChildren(document.createTextNode("Try: "));
  relatedTitles(firstMatch).forEach(title => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = title;
    button.addEventListener("click", () => {
      els.jobTitle.value = title;
      renderSearchResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.suggestions.append(button);
  });
}

function getPreparedSearches() {
  const rawTitles = els.jobTitle.value.split(",").map(title => title.trim()).filter(Boolean);
  const jobTitles = rawTitles.map(titleCase);
  const selectedLocation = els.locationSelect.value;
  const selectedLocationLabel = selectedLocation ? els.locationSelect.selectedOptions[0].textContent : "";
  const selectedLocationQuery = selectedLocation ? countryQueries[selectedLocation] : "";
  const targets = getSelectedTargets();

  return jobTitles.map(originalTitle => {
    const suffixExcludesRemote = originalTitle.toLowerCase().endsWith("-remote");
    const trimmedTitle = suffixExcludesRemote ? originalTitle.slice(0, -7).trim() : originalTitle;
    const detected = selectedLocation ? { title: trimmedTitle, query: selectedLocationQuery, label: selectedLocationLabel } : detectLocation(trimmedTitle);
    return {
      title: detected.title || trimmedTitle,
      originalTitle,
      context: {
        timeFilter: els.timeFilter.value,
        engine: "google",
        excludeRemote: els.excludeRemote.checked || suffixExcludesRemote,
        locationQuery: detected.query,
        locationLabel: detected.label,
        targets
      }
    };
  });
}

function clearLaunchStatus() {
  els.searchStatus.textContent = "";
  els.resultsPanel.hidden = true;
  els.resultList.innerHTML = "";
  els.resultSummary.textContent = "";
}

function getSearchRows(searches) {
  const rows = [];
  searches.forEach(search => {
    search.context.targets.forEach(([site, label]) => {
      rows.push({
        label,
        site,
        title: search.title,
        url: targetUrl(site, search.title, search.context)
      });
    });
  });
  return rows;
}

function openSearchUrl(url) {
  return window.open(url, "_blank", "noopener,noreferrer");
}

function renderResultRow(row) {
  const item = document.createElement("article");
  item.className = "result-row";

  const main = document.createElement("div");
  main.className = "result-main";

  const title = document.createElement("strong");
  title.textContent = row.label;

  const details = document.createElement("small");
  details.textContent = `${row.title} - ${row.site}`;

  const action = document.createElement("button");
  action.className = "open-link-button";
  action.type = "button";
  action.textContent = "Open link";
  action.addEventListener("click", () => {
    openSearchUrl(row.url);
    action.textContent = "Opened";
    action.classList.add("is-opened");
    action.setAttribute("aria-pressed", "true");
  });

  main.append(title, details);
  item.append(main, action);
  return item;
}

function renderSearchResults() {
  const searches = getPreparedSearches();
  if (!searches.length) {
    clearLaunchStatus();
    els.jobTitle.focus();
    return;
  }

  const jobTitles = searches.map(search => search.originalTitle);
  updateUrl(jobTitles);
  renderSuggestions(jobTitles);
  const rows = getSearchRows(searches);
  els.resultList.innerHTML = "";
  els.resultSummary.textContent = "";
  if (!rows.length) {
    els.searchStatus.textContent = "Select at least one job board.";
    els.resultsPanel.hidden = true;
    return;
  }

  els.searchStatus.textContent = "";
  els.resultsPanel.hidden = false;
  els.resultSummary.textContent = `${rows.length} links`;
  rows.forEach(row => {
    els.resultList.append(renderResultRow(row));
  });
  
  setTimeout(() => {
    els.resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function clearAll() {
  els.jobTitle.value = "";
  els.excludeRemote.checked = false;
  els.locationSelect.value = "";
  setSelectedBoards(boardPresets.all);
  rebuildTimeOptions("24hours");
  els.suggestions.hidden = true;
  clearLaunchStatus();
  history.pushState(null, "", window.location.pathname);
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  rebuildTimeOptions(params.get("time") || "24hours");

  const location = params.get("location");
  if (location && countryQueries[location]) {
    els.locationSelect.value = location;
  }

  if (params.get("remote") === "false") {
    els.excludeRemote.checked = true;
  }

  if (params.get("mode") === "dark") {
    document.documentElement.classList.add("dark");
  }

  const boards = params.get("boards");
  if (boards === "none") {
    setSelectedBoards([]);
  } else if (boards) {
    const allowed = new Set(targetSites.map(([site]) => site));
    setSelectedBoards(boards.split(",").filter(site => allowed.has(site)));
  }

  const job = params.get("job");
  if (job) {
    els.jobTitle.value = decodeURIComponent(job.replace(/\+/g, " "));
  }
}

function updateThemeToggle() {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    els.sunIcon.style.display = "none";
    els.moonIcon.style.display = "block";
  } else {
    els.sunIcon.style.display = "block";
    els.moonIcon.style.display = "none";
  }
  els.themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

document.addEventListener("DOMContentLoaded", () => {
  populateLocations();
  populateBoards();
  rebuildTimeOptions("24hours");
  hydrateFromUrl();
  updateThemeToggle();

  els.startButton.addEventListener("click", renderSearchResults);
  els.jobTitle.addEventListener("keydown", event => {
    if (event.key === "Enter") renderSearchResults();
  });
  els.clearButton.addEventListener("click", clearAll);
  [els.excludeRemote, els.locationSelect].forEach(control => {
    control.addEventListener("change", clearLaunchStatus);
  });
  els.boardPreset.addEventListener("change", () => applyBoardPreset(els.boardPreset.value));
  els.selectAllBoards.addEventListener("click", () => applyBoardPreset("all"));
  els.clearBoards.addEventListener("click", () => {
    setSelectedBoards([]);
    clearLaunchStatus();
  });
  els.timeFilter.addEventListener("change", clearLaunchStatus);
  els.themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    updateThemeToggle();
    if (els.jobTitle.value.trim()) updateUrl(els.jobTitle.value.split(",").map(title => titleCase(title.trim())).filter(Boolean));
  });
});

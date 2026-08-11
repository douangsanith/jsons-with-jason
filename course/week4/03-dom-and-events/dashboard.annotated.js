// ANNOTATED VERSION — same script as dashboard.js, with teaching comments.
// Read this one to learn; use the clean dashboard.js to build.
//
// Week 4 · Day 3 — The DOM & events
// This file is loaded by dashboard.html (see the <script src="..."> at the bottom
// of that file). Open dashboard.html in a browser to run it.

// The same array of objects from Day 2. In a real tool this would arrive from an
// API — which is exactly what Week 5 Day 4 does.
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// --- Find the elements once, up front ---
// `document` is the browser's live model of the page — the DOM. getElementById
// hands you the one element whose id attribute matches, so you can read or change it.
// We look each one up ONCE here rather than inside render(), because searching the
// page is the slow part and these elements never get replaced.
const boardEl = document.getElementById("board"); // the empty <div class="board">
const summaryEl = document.getElementById("summary"); // the <p> under the heading
const searchEl = document.getElementById("search"); // the <input type="search">
const activeOnlyEl = document.getElementById("active-only"); // the checkbox

// toLocaleString with these options formats 42750.5 as "$42,750.50" — commas,
// currency symbol and 2 decimals, all handled for you.
const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// --- One matter -> one card's worth of HTML ---
// A template literal spanning several lines. Every ${...} drops a value into the
// markup. Note the two ternaries: one picks the extra CSS class, one picks the label.
const cardHtml = (m) => `
  <div class="card">
    <h3>${m.id}</h3>
    <p>${m.client}</p>
    <p><span class="tag">${m.area}</span></p>
    <p><span class="tag ${m.active ? "" : "closed"}">${m.active ? "Active" : "Closed"}</span></p>
    <p class="amt">${money(m.billed)}</p>
  </div>
`;

// --- render(): read the controls, filter the data, write the page ---
// ONE function is responsible for putting the page in the right state. Every event
// below just calls it again. Keeping all the drawing in one place is what makes
// this readable — and it's the idea React formalises.
function render() {
  // .value is whatever is typed in the box right now. .trim() drops stray spaces;
  // .toLowerCase() lets "acme" match "Acme Corp" (searching is case-insensitive).
  const term = searchEl.value.trim().toLowerCase();
  // A checkbox reports .checked (true/false), not .value.
  const activeOnly = activeOnlyEl.checked;

  // Day 2's pipeline, now driven by the controls instead of hard-coded.
  const shown = matters
    // If the box is ticked keep only active ones; otherwise keep everything.
    .filter((m) => (activeOnly ? m.active : true))
    // .includes("") is always true, so an empty search box matches every row.
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  const total = shown.reduce((sum, m) => sum + m.billed, 0);
  // .textContent sets plain text. Prefer it over .innerHTML whenever the value
  // is just text — it can never be mistaken for markup.
  summaryEl.textContent = `${shown.length} of ${matters.length} matters · ${money(total)} billed`;

  // .map() turns the list of data into a list of HTML strings; .join("") glues them
  // into one string. Without join you'd get commas between every card.
  // .innerHTML replaces everything inside the element with that markup.
  // `shown.length ? ... : ...` — 0 counts as false, so an empty list shows the message.
  boardEl.innerHTML = shown.length
    ? shown.map(cardHtml).join("")
    : `<p class="empty">No matters match that search.</p>`;
}

// --- Events: when the user does something, render again ---
// addEventListener(eventName, functionToRun) wires a user action to code.
// "input" fires on EVERY keystroke, so the list filters as you type.
searchEl.addEventListener("input", render);
// "change" fires when a checkbox is ticked or unticked.
activeOnlyEl.addEventListener("change", render);

// Draw once on load, so the page isn't empty before the first keystroke.
render();

// 👉 Notice the pattern: data -> render() -> HTML, and every event just calls render()
//    again. That is exactly what React automates for you in Week 5 — you'll change
//    the data and React re-renders, with no getElementById and no innerHTML.

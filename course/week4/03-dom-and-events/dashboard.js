// Week 4 · Day 3 — The DOM & events
// This file is loaded by dashboard.html. Open that file in a browser.

const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// --- Find the elements once, up front ---
const boardEl = document.getElementById("board");
const summaryEl = document.getElementById("summary");
const searchEl = document.getElementById("search");
const activeOnlyEl = document.getElementById("active-only");

const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// --- One matter -> one card's worth of HTML ---
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
function render() {
  const term = searchEl.value.trim().toLowerCase();
  const activeOnly = activeOnlyEl.checked;

  const shown = matters
    .filter((m) => (activeOnly ? m.active : true))
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  const total = shown.reduce((sum, m) => sum + m.billed, 0);
  summaryEl.textContent = `${shown.length} of ${matters.length} matters · ${money(total)} billed`;

  // .map() turns the list of data into a list of HTML strings; .join("") glues them.
  boardEl.innerHTML = shown.length
    ? shown.map(cardHtml).join("")
    : `<p class="empty">No matters match that search.</p>`;
}

// --- Events: when the user does something, render again ---
searchEl.addEventListener("input", render);
activeOnlyEl.addEventListener("change", render);

// Draw once on load, so the page isn't empty before the first keystroke.
render();

// 👉 Notice the pattern: data -> render() -> HTML, and every event just calls render()
//    again. That is exactly what React automates for you in Week 5 — you'll change
//    the data and React re-renders, with no getElementById and no innerHTML.

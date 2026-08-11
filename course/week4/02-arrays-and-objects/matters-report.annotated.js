// ANNOTATED VERSION — same script as matters-report.js, with teaching comments.
// Read this one to learn; use the clean matters-report.js to build.
//
// Week 4 · Day 2 — Arrays & the three methods
// Run this file from a terminal:   node matters-report.annotated.js

// --- Data: an ARRAY of OBJECTS. ---
// [ ... ] is an array (an ordered list). { ... } is an object (named fields).
// An array of objects is THE shape of most web data: one object per row, each
// with the same set of keys. A CSV, a database table, and a JSON API response
// all arrive looking like this.
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// --- Reading an array ---
console.log("count:", matters.length); // .length = how many items
// Indexes start at ZERO, so [0] is the first row and [1] is the second.
// matters[0] is an object, so you can keep going with .client.
console.log("first client:", matters[0].client); // index 0 is the FIRST item

// --- filter: keep the rows that pass a test ---
// You hand .filter a function. It runs that function on every item and keeps the
// items for which it returned true. The original array is untouched — filter
// returns a NEW array. (m) => m.active is an arrow function from yesterday.
const active = matters.filter((m) => m.active);
console.log("active:", active.length);

// --- map: transform EACH row into something new ---
// .map also runs your function on every item, but keeps ALL of them — it collects
// what your function RETURNS. Six matters in, six labels out. Always same length.
const labels = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// --- reduce: collapse the whole array down to ONE value ---
// reduce carries a running result (here `sum`) from item to item.
// The `0` at the end is the STARTING value — the most-forgotten part of reduce.
// Step by step: 0 + 42750.5 -> + 18500 -> + 9800 -> ... -> the grand total.
const total = matters.reduce((sum, m) => sum + m.billed, 0);
console.log("total billed:", total.toFixed(2)); // toFixed(2) = 2 decimal places

// --- sort: order the rows ---
// WARNING: .sort() changes the array IN PLACE. [...matters] makes a copy first
// (the "spread" ...), so the original order is preserved for everything below.
// The comparison returns a negative/positive number: b - a means biggest first.
const byBilled = [...matters].sort((a, b) => b.billed - a.billed);
console.log("top matter:", byBilled[0].id, byBilled[0].client);

// --- Chaining ---
// Each method returns a new array, so you can hang the next one off it and read
// the whole pipeline top to bottom: keep active -> order by size -> take 3 -> label.
// .slice(0, 3) takes items 0, 1, 2 (the end index is not included).
const activeTop3 = matters
  .filter((m) => m.active)
  .sort((a, b) => b.billed - a.billed)
  .slice(0, 3)
  .map((m) => `${m.client} ($${m.billed.toFixed(2)})`);

console.log("top 3 active:", activeTop3);

// --- A few more you'll reach for ---
console.log("any over 100k?", matters.some((m) => m.billed > 100000)); // some → true if AT LEAST ONE passes
console.log("all billed?", matters.every((m) => m.billed > 0)); // every → true only if ALL pass
// find returns the first matching ITEM (not an array). Note === , not = :
// one equals assigns, three equals compares. Using = here is a classic bug.
console.log("find M-1004:", matters.find((m) => m.id === "M-1004").client);

// --- Grouping: total billed per practice area ---
// This is reduce again, but the running result is an OBJECT instead of a number,
// so the starting value is {} rather than 0. This is the JS twin of pandas'
// df.groupby("area")["billed"].sum().
const byArea = matters.reduce((acc, m) => {
  // (acc[m.area] || 0) means "whatever's there, or 0 the first time we see this area".
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc; // with { } braces you must return the accumulator for the next round
}, {});

console.log("\nBilled by practice area:");
// Object.entries turns { Litigation: 42750.5 } into [ ["Litigation", 42750.5] ].
// `for (const [area, amount] of ...)` unpacks each pair into two names at once —
// that unpacking is called DESTRUCTURING, and it's Friday's topic.
for (const [area, amount] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} $${amount.toFixed(2)}`); // padEnd lines the columns up
}

// --- The artifact: one reusable report function ---
// Nothing new here — just the pieces above, packaged so you can call report(anyRows).
const report = (rows) => {
  const activeRows = rows.filter((m) => m.active);
  const totalBilled = rows.reduce((s, m) => s + m.billed, 0);
  const top = [...rows].sort((a, b) => b.billed - a.billed)[0];
  // An array of three strings, then .join("\n") glues them with line breaks.
  return [
    `Matters:      ${rows.length} (${activeRows.length} active)`,
    `Total billed: $${totalBilled.toFixed(2)}`,
    `Largest:      ${top.client} — $${top.billed.toFixed(2)}`,
  ].join("\n");
};

console.log("\n" + report(matters));

// 👉 The map() move — turning a list of data into a list of somethings — is exactly
//    how React builds UI. In Week 5: matters.map(m => <MatterCard matter={m} />)

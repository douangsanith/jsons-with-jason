// Week 4 · Day 2 — Arrays & the three methods
// Run this file from a terminal:   node matters-report.js

// --- Data: an ARRAY of OBJECTS. This is the shape of all web data. ---
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// --- Reading an array ---
console.log("count:", matters.length);
console.log("first client:", matters[0].client); // index 0 is the FIRST item

// --- filter: keep the rows that pass a test (like df[df.active] in pandas) ---
const active = matters.filter((m) => m.active);
console.log("active:", active.length);

// --- map: transform EACH row into something new (like a list comprehension) ---
const labels = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// --- reduce: collapse the whole array down to ONE value (like .sum()) ---
const total = matters.reduce((sum, m) => sum + m.billed, 0);
console.log("total billed:", total.toFixed(2));

// --- sort: order the rows. Copy first with [...] so the original is left alone. ---
const byBilled = [...matters].sort((a, b) => b.billed - a.billed);
console.log("top matter:", byBilled[0].id, byBilled[0].client);

// --- Chaining: filter -> sort -> map, read left to right ---
const activeTop3 = matters
  .filter((m) => m.active)
  .sort((a, b) => b.billed - a.billed)
  .slice(0, 3)
  .map((m) => `${m.client} ($${m.billed.toFixed(2)})`);

console.log("top 3 active:", activeTop3);

// --- A few more you'll reach for ---
console.log("any over 100k?", matters.some((m) => m.billed > 100000));
console.log("all billed?", matters.every((m) => m.billed > 0));
console.log("find M-1004:", matters.find((m) => m.id === "M-1004").client);

// --- Grouping: total billed per practice area, using reduce into an object ---
const byArea = matters.reduce((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc;
}, {});

console.log("\nBilled by practice area:");
for (const [area, amount] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} $${amount.toFixed(2)}`);
}

// --- The artifact: one reusable report function ---
const report = (rows) => {
  const activeRows = rows.filter((m) => m.active);
  const totalBilled = rows.reduce((s, m) => s + m.billed, 0);
  const top = [...rows].sort((a, b) => b.billed - a.billed)[0];
  return [
    `Matters:      ${rows.length} (${activeRows.length} active)`,
    `Total billed: $${totalBilled.toFixed(2)}`,
    `Largest:      ${top.client} — $${top.billed.toFixed(2)}`,
  ].join("\n");
};

console.log("\n" + report(matters));

// 👉 The map() move — turning a list of data into a list of somethings — is exactly
//    how React builds UI. In Week 5: matters.map(m => <MatterCard matter={m} />)

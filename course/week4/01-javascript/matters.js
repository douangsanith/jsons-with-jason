// Week 4 · Day 1 — JavaScript essentials
// Run this file from a terminal:   node matters.js
// (Node.js is JavaScript outside the browser — the same engine Vite uses.)

// --- Data: an array of objects. This is the shape of all web data. ---
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
];

// --- Variables & template literals ---
const firm = "Rivera & Associates";
console.log(`Firm: ${firm}`); // backticks + ${...} = f-string

// --- filter: keep some rows (like df[df.active]) ---
const active = matters.filter((m) => m.active);
console.log("active matters:", active.length);

// --- map: transform each row (like a comprehension) ---
const labels = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// --- reduce: collapse to one value (like .sum()) ---
const total = matters.reduce((sum, m) => sum + m.billed, 0);
console.log("total billed:", total.toFixed(2));

// --- An arrow function that ties it together ---
const summarize = (rows) => {
  const top = [...rows].sort((a, b) => b.billed - a.billed)[0];
  return {
    matters: rows.length,
    active: rows.filter((m) => m.active).length,
    totalBilled: rows.reduce((s, m) => s + m.billed, 0),
    topClient: top.client,
  };
};

const s = summarize(matters);
console.log(
  `\nSummary: ${s.active}/${s.matters} active · $${s.totalBilled.toFixed(2)} billed · top: ${s.topClient}`,
);

// 👉 The map() move — turning data into a list — is exactly how React builds UI.
//    Tomorrow: matters.map(m => <MatterCard matter={m} />)

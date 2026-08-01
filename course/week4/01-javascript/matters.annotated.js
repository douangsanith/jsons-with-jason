// ANNOTATED VERSION — same script as matters.js, with teaching comments.
// Read this one to learn; use the clean matters.js to build.
//
// Week 4 · Day 1 — JavaScript essentials
// Run this file from a terminal:   node matters.annotated.js
// (Node.js is JavaScript outside the browser — the same engine Vite uses.)

// --- Data: an ARRAY of OBJECTS. ---
// [ ... ] is an array (an ordered list). { ... } is an object (named fields,
// like a dictionary/record). An array of objects is THE shape of most web data:
// one object per row, each with the same set of keys.
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
];

// --- Variables & template literals ---
// `const` declares a value that won't be reassigned.
const firm = "Rivera & Associates";
// Backticks ` ` make a "template literal"; ${...} drops a value into the text.
// It's JavaScript's version of a Python f-string.
console.log(`Firm: ${firm}`); // backticks + ${...} = f-string

// --- filter: keep only the rows that pass a test (like df[df.active] in pandas) ---
// .filter takes a function; it keeps each item for which that function is true.
// (m) => m.active is an "arrow function": input => value it returns.
const active = matters.filter((m) => m.active);
console.log("active matters:", active.length);   // .length = how many items

// --- map: transform EACH row into something new (like a list comprehension) ---
// .map runs the function on every item and collects the results into a new array.
const labels = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// --- reduce: collapse the whole array down to ONE value (like .sum()) ---
// It carries a running total (`sum`), adds each item's billed amount, starting at 0.
const total = matters.reduce((sum, m) => sum + m.billed, 0);
console.log("total billed:", total.toFixed(2));  // toFixed(2) = 2 decimal places

// --- An arrow function that ties it all together ---
// `summarize` takes an array of rows and returns a small summary object.
const summarize = (rows) => {
  // [...rows] makes a COPY first (the "spread" ...) so .sort doesn't reorder the
  // original array. sort((a,b) => b.billed - a.billed) puts the biggest first;
  // [0] then takes that top row.
  const top = [...rows].sort((a, b) => b.billed - a.billed)[0];
  return {
    matters: rows.length,
    active: rows.filter((m) => m.active).length,
    totalBilled: rows.reduce((s, m) => s + m.billed, 0),
    topClient: top.client,
  };
};

const s = summarize(matters);
// \n starts a new line. Each ${...} pulls a field out of the summary object.
console.log(
  `\nSummary: ${s.active}/${s.matters} active · $${s.totalBilled.toFixed(2)} billed · top: ${s.topClient}`,
);

// 👉 The map() move — turning data into a list — is exactly how React builds UI.
//    Tomorrow: matters.map(m => <MatterCard matter={m} />)

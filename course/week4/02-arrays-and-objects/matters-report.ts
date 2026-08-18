// Week 4 · Day 2 — the same program as matters-report.js, written in TypeScript.
// Run it exactly the same way:   node matters-report.ts
// (Needs Node 22.18 or newer — check with `node --version`.)
//
// The logic is identical to the .js version; what types add here is that the
// compiler knows what's IN the array, so it can check every .filter, .map and
// .reduce for you. For a line-by-line walkthrough, read matters-report.annotated.ts.

// The shape of one row. Day 1 introduced this; here it describes six of them.
type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
};

// --- Matter[] means "an array of Matter" ---
const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

console.log("count:", matters.length);
console.log("first client:", matters[0].client); // autocompletes, and typos are caught

// --- No annotations needed inside filter/map/reduce ---
// `(m)` has no type and doesn't need one: TypeScript knows `matters` is Matter[],
// so `m` must be a Matter. That's INFERENCE doing the work.
const active: Matter[] = matters.filter((m) => m.active);
console.log("active:", active.length);

// map's result type follows the arrow function's return — here, string[].
const labels: string[] = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// reduce's type comes from the starting value: `0` is a number, so total is too.
const total: number = matters.reduce((sum, m) => sum + m.billed, 0);
console.log("total billed:", total.toFixed(2));

const byBilled: Matter[] = [...matters].sort((a, b) => b.billed - a.billed);
console.log("top matter:", byBilled[0].id, byBilled[0].client);

// Chaining keeps its types the whole way down: Matter[] -> Matter[] -> Matter[]
// -> string[]. Hover over any step in VS Code and it tells you what you have.
const activeTop3: string[] = matters
  .filter((m) => m.active)
  .sort((a, b) => b.billed - a.billed)
  .slice(0, 3)
  .map((m) => `${m.client} ($${m.billed.toFixed(2)})`);

console.log("top 3 active:", activeTop3);

console.log("any over 100k?", matters.some((m) => m.billed > 100000)); // boolean
console.log("all billed?", matters.every((m) => m.billed > 0)); // boolean

// --- The best example of types earning their keep ---
// .find might not find anything, so its type is `Matter | undefined`. TypeScript
// will NOT let you write `found.client` directly — it forces the check.
const found: Matter | undefined = matters.find((m) => m.id === "M-1004");
console.log("find M-1004:", found ? found.client : "not found");

// --- Record<string, number>: "keys are strings, values are numbers" ---
// The angle brackets pass types as arguments. You'll meet them again as
// `useState<Matter[]>` in Week 5.
const byArea: Record<string, number> = matters.reduce<Record<string, number>>((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc;
}, {});

console.log("\nBilled by practice area:");
// Object.entries gives [string, number] pairs, so .toFixed(2) is allowed.
for (const [area, amount] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} $${amount.toFixed(2)}`);
}

// --- The artifact, with a signature that documents itself ---
// `(rows: Matter[]): string` says everything a caller needs to know.
const report = (rows: Matter[]): string => {
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

// 👉 In Week 5 this exact `Matter` type moves into its own file, and every React
//    component agrees with it: matter-app/src/types.ts.

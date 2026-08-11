// Week 4 · Day 2 — the same program as matters-report.js, written in TypeScript.
// Run it exactly the same way:   node matters-report.ts
// (Needs Node 22.18 or newer — check with `node --version`.)
//
// One commented copy, for comparing against matters-report.js. The logic is
// identical; what types add here is that the compiler knows what's IN the array,
// so it can check every .filter, .map and .reduce for you.

// The shape of one row. Day 1 introduced this; here it describes six of them.
type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
};

// --- Matter[] means "an array of Matter" ---
// The [] suffix is how you say "a list of these". It's the most common type
// you'll write, because web data is almost always an array of records.
const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

console.log("count:", matters.length);
// Because the array is typed, your editor autocompletes `.client` after
// `matters[0].` — and flags `.clientt` instantly. That autocomplete is the
// day-to-day benefit of types, more than the error catching.
console.log("first client:", matters[0].client);

// --- No annotations needed inside filter/map/reduce ---
// Notice `(m)` has no type on it and doesn't need one: TypeScript knows `matters`
// is Matter[], so `m` must be a Matter. That's INFERENCE doing the work, and it's
// why well-typed code isn't cluttered with annotations.
const active: Matter[] = matters.filter((m) => m.active);
console.log("active:", active.length);

// map's result type follows the arrow function's return. This one returns a
// template literal, so the result is string[] — a list of strings.
const labels: string[] = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// reduce's type comes from the starting value: `0` is a number, so total is a
// number. Which is exactly why forgetting that `0` breaks things — without it
// TypeScript can't work out what you're building.
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
// .find might not find anything, so its type is `Matter | undefined` — a union.
// TypeScript will NOT let you write `found.client` directly, because `found`
// might be undefined and that would crash. It forces the check.
// Look at the same line in the .js version: it reads `.find(...).client` with no
// check at all, and works only because we happen to know M-1004 exists.
const found: Matter | undefined = matters.find((m) => m.id === "M-1004");
console.log("find M-1004:", found ? found.client : "not found");

// --- Record<string, number> ---
// "An object whose keys are strings and whose values are numbers." The angle
// brackets pass types as arguments — like function arguments, but for shapes.
// You'll meet them again as `useState<Matter[]>` in Week 5.
// `reduce<...>` tells reduce what it's accumulating, since a bare {} is ambiguous.
const byArea: Record<string, number> = matters.reduce<Record<string, number>>((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc;
}, {});

console.log("\nBilled by practice area:");
// Object.entries gives [string, number] pairs, so `amount` is known to be a
// number and .toFixed(2) is allowed on it.
for (const [area, amount] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} $${amount.toFixed(2)}`);
}

// --- The artifact, with a signature that documents itself ---
// `(rows: Matter[]): string` says everything a caller needs: hand me a list of
// matters, get back a string. No need to read the body.
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
//    component agrees with it: matter-app/src/types.ts. The type you just read is
//    the one the whole application is built on.

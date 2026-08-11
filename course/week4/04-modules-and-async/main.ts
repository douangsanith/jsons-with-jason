// Week 4 · Day 4 — the same program as main.js, written in TypeScript.
// Run it exactly the same way:   node main.ts
// (Needs Node 22.18 or newer — `node --version` to check.)
//
// Self-contained on purpose: it brings its own data and fake API so you can read
// the typed version of everything in one place.

// `import type` imports a SHAPE, not a value. It disappears entirely at runtime.
import type { Matter } from "./types.ts";

const firm: string = "Rivera & Associates";

const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true,
    lead: { name: "R. Rivera", email: "rrivera@example.com" } },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true,
    lead: { name: "P. Osei" } },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false,
    lead: { name: "L. Chen", email: "lchen@example.com" } },
];

// --- Formatting helpers ---
const money = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

// `lead` is optional, so `m.lead?.name` is `string | undefined`. The `??` turns
// it back into a plain `string` — which is what the return type promises.
const leadName = (m: Matter): string => m.lead?.name ?? "Unassigned";

const line = (m: Matter): string =>
  `${m.id} · ${m.client} · ${statusLabel(m)} · ${money(m.billed)} · ${leadName(m)}`;

// --- A fake API. Promise<Matter[]> = "a promise of an array of Matter". ---
function fetchMatters(delayMs: number = 400): Promise<Matter[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matters), delayMs);
  });
}

function fetchMatter(id: string, delayMs: number = 200): Promise<Matter> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = matters.find((m) => m.id === id); // Matter | undefined
      if (found) resolve(found);
      else reject(new Error(`No matter with id ${id}`));
    }, delayMs);
  });
}

console.log(`=== ${firm} — ${matters.length} matters ===\n`);

// --- Destructuring keeps its types ---
const { client, billed, area } = matters[0]; // string, number, string
console.log(`destructured: ${client} · ${area} · ${money(billed)}`);

const [first, second, ...others] = matters; // Matter, Matter, Matter[]
console.log(`first: ${first.id} · second: ${second.id} · rest: ${others.length}`);

// --- Spread produces a value of the same type ---
const newMatter: Matter = { id: "M-1007", client: "Glenmoor PLC", area: "Tax", billed: 4200, active: true };
const withNew: Matter[] = [...matters, newMatter];
console.log(`spread array: ${matters.length} -> ${withNew.length}`);

const closedFirst: Matter = { ...matters[0], active: false };
console.log(`spread object: ${statusLabel(matters[0])} -> ${statusLabel(closedFirst)}`);

console.log(`lead of ${matters[0].id}: ${leadName(matters[0])}`);
console.log(`lead of ${matters[1].id}: ${leadName(matters[1])}`);
console.log(`email: ${matters[1].lead?.email ?? "none on file"}`);

// --- await unwraps the promise: Promise<Matter[]> in, Matter[] out ---
async function main(): Promise<void> {
  console.log("\nfetching…");
  const rows: Matter[] = await fetchMatters();
  console.log(`got ${rows.length} matters`);
  rows.slice(0, 3).forEach((m) => console.log("  " + line(m)));

  try {
    const one: Matter = await fetchMatter("M-1003");
    console.log(`\nfound: ${line(one)}`);
    await fetchMatter("M-9999");
  } catch (err) {
    // `err` is typed `unknown` — TypeScript makes you prove what it is first.
    console.log(`handled: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    console.log("done.");
  }
}

main();

// 👉 Every idea here reappears in Week 5: a shared types.ts, an optional field
//    handled with ?., and an await that unwraps a Promise<Matter[]> — that last
//    one is literally the fetch in matter-app/src/App.tsx.

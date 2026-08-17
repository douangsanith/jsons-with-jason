// Week 4 · Day 4 — the same program as main.js, written in TypeScript.
// Run it exactly the same way:   node main.ts
// (Needs Node 22.18 or newer — `node --version` to check.)
//
// Four files, same as the JavaScript side: types.ts holds the shape,
// matters-data.ts holds the data and the fake API, format.ts holds the helpers,
// and this file wires them together.

// `import type` imports a SHAPE, not a value. It disappears entirely at runtime.
import type { Matter } from "./types.ts";
// Default import (no braces) + named imports (in braces), from one file.
import matters, { firm, fetchMatters, fetchMatter } from "./matters-data.ts";
import { money, statusLabel, leadName, line } from "./format.ts";

console.log(`=== ${firm} — ${matters.length} matters ===\n`);

// --- Destructuring keeps its types ---
const { client, billed, area } = matters[0]; // string, number, string
console.log(`destructured: ${client} · ${area} · ${money(billed)}`);

// No TypeScript equivalent of main.js's `currency = "USD"` line: `currency`
// isn't in the Matter type, so destructuring it is a compile error. The fix is
// to add `currency?: string` to the type — TypeScript won't let you invent a
// field at the point of use, which is the whole idea.

const [first, second, ...others] = matters; // Matter, Matter, Matter[]
console.log(`first: ${first.id} · second: ${second.id} · rest: ${others.length}`);

// --- Spread produces a value of the same type ---
const newMatter: Matter = { id: "M-1007", client: "Glenmoor PLC", area: "Tax", billed: 4200, active: true };
const withNew: Matter[] = [...matters, newMatter]; // a NEW array; `matters` is untouched
console.log(`spread array: ${matters.length} -> ${withNew.length}`);

const closedFirst: Matter = { ...matters[0], active: false }; // copy, override one field
console.log(`spread object: ${statusLabel(matters[0])} -> ${statusLabel(closedFirst)}`);

// --- Optional chaining (?.) and nullish coalescing (??) ---
console.log(`lead of ${matters[0].id}: ${leadName(matters[0])}`);
console.log(`lead of ${matters[1].id}: ${leadName(matters[1])}`); // no `lead` field at all
console.log(`email: ${matters[1].lead?.email ?? "none on file"}`);

// --- await unwraps the promise: Promise<Matter[]> in, Matter[] out ---
async function main(): Promise<void> {
  console.log("\nfetching…");
  const rows: Matter[] = await fetchMatters(); // waits ~400ms, then hands back the array
  console.log(`got ${rows.length} matters`);
  rows.slice(0, 3).forEach((m) => console.log("  " + line(m)));

  // try/catch is how you handle a promise that rejects.
  try {
    const one: Matter = await fetchMatter("M-1003");
    console.log(`\nfound: ${line(one)}`);
    await fetchMatter("M-9999"); // this one rejects
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

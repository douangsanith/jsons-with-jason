// Week 4 · Day 4 — Modules & async
// Run it two ways:
//   node main.js
//   python3 -m http.server   → open http://localhost:8000 and read the browser Console

// Default import (no braces) + named imports (in braces), from one file.
import matters, { firm, fetchMatters, fetchMatter } from "./matters-data.js";
import { money, statusLabel, leadName, line } from "./format.js";

console.log(`=== ${firm} — ${matters.length} matters ===\n`);

// --- Object destructuring: pull fields out into their own names ---
const { client, billed, area } = matters[0];
console.log(`destructured: ${client} · ${area} · ${money(billed)}`);

// Rename on the way out, and supply a default for a missing field.
const { id: matterId, currency = "USD" } = matters[0];
console.log(`renamed + default: ${matterId} (${currency})`);

// --- Array destructuring: by position ---
const [first, second, ...others] = matters;
console.log(`first: ${first.id} · second: ${second.id} · rest: ${others.length}`);

// --- Spread: copy and extend, instead of mutating ---
const newMatter = { id: "M-1007", client: "Glenmoor PLC", area: "Tax", billed: 4200, active: true };
const withNew = [...matters, newMatter]; // a NEW array; `matters` is untouched
console.log(`spread array: ${matters.length} -> ${withNew.length}`);

const closedFirst = { ...matters[0], active: false }; // copy, override one field
console.log(`spread object: ${statusLabel(matters[0])} -> ${statusLabel(closedFirst)}`);

// --- Optional chaining (?.) and nullish coalescing (??) ---
console.log(`lead of ${matters[0].id}: ${leadName(matters[0])}`);
console.log(`lead of ${matters[1].id}: ${leadName(matters[1])}`); // no `lead` field at all
console.log(`email: ${matters[1].lead?.email ?? "none on file"}`);

// --- Data that arrives LATER ---
// An async function can `await` a promise: pause here, carry on when it resolves.
async function main() {
  console.log("\nfetching…");
  const rows = await fetchMatters(); // waits ~400ms, then hands back the array
  console.log(`got ${rows.length} matters`);
  rows.slice(0, 3).forEach((m) => console.log("  " + line(m)));

  // try/catch is how you handle a promise that rejects.
  try {
    const one = await fetchMatter("M-1003");
    console.log(`\nfound: ${line(one)}`);
    await fetchMatter("M-9999"); // this one rejects
  } catch (err) {
    console.log(`handled: ${err.message}`);
  } finally {
    console.log("done.");
  }
}

main();

// 👉 Everything on this page is what React code is written in: imports at the top,
//    destructured props, spread to update state without mutating, ?. for data that
//    might not have arrived yet, and await for data that arrives over the network.

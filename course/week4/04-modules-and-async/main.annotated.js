// ANNOTATED VERSION — same script as main.js, with teaching comments.
// Read this one to learn; use the clean main.js to build.
// (It imports the .annotated.js modules, so the whole set is annotated.)
//
// Week 4 · Day 4 — Modules & async
// Run it two ways:
//   node main.annotated.js
//   python3 -m http.server   → open http://localhost:8000/index.annotated.html

// --- Imports ---
// One line can pull in both kinds of export. `matters` (no braces) is the DEFAULT
// export; `{ firm, fetchMatters, fetchMatter }` are NAMED exports and must match
// their names in the other file exactly. The "./" and the ".js" are both required
// in the browser — unlike Python, there is no guessing at the extension.
import matters, { firm, fetchMatters, fetchMatter } from "./matters-data.annotated.js";
import { money, statusLabel, leadName, line } from "./format.annotated.js";

console.log(`=== ${firm} — ${matters.length} matters ===\n`);

// --- Object destructuring ---
// Instead of `const client = matters[0].client;` three times over, pull the fields
// out in one line. The names in braces must match the KEYS in the object.
const { client, billed, area } = matters[0];
console.log(`destructured: ${client} · ${area} · ${money(billed)}`);

// `id: matterId` renames on the way out (useful when `id` would collide with
// something else). `currency = "USD"` supplies a default for a key that isn't
// there at all — the same defaulting you saw on function parameters in Day 1.
const { id: matterId, currency = "USD" } = matters[0];
console.log(`renamed + default: ${matterId} (${currency})`);

// --- Array destructuring ---
// Arrays destructure by POSITION, not by name. `...others` is the REST pattern:
// "everything I haven't already named," collected into a new array.
const [first, second, ...others] = matters;
console.log(`first: ${first.id} · second: ${second.id} · rest: ${others.length}`);

// --- Spread: copy and extend, instead of mutating ---
const newMatter = { id: "M-1007", client: "Glenmoor PLC", area: "Tax", billed: 4200, active: true };
// `...matters` unpacks every existing item into a brand-new array, then adds one.
// Compare with matters.push(newMatter), which would CHANGE the original array.
const withNew = [...matters, newMatter]; // a NEW array; `matters` is untouched
console.log(`spread array: ${matters.length} -> ${withNew.length}`);

// Spread works on objects too: copy every field, then override the ones you list
// afterwards (later keys win). This is THE way React updates state — you never
// edit the old value, you produce a new one.
const closedFirst = { ...matters[0], active: false }; // copy, override one field
console.log(`spread object: ${statusLabel(matters[0])} -> ${statusLabel(closedFirst)}`);

// --- Optional chaining (?.) and nullish coalescing (??) ---
// See format.annotated.js for what leadName does. M-1002 has a lead; M-1001 has
// no `lead` key at all — and nothing crashes.
console.log(`lead of ${matters[0].id}: ${leadName(matters[0])}`);
console.log(`lead of ${matters[1].id}: ${leadName(matters[1])}`); // no `lead` field at all
// Chained inline: `.lead?.email` is undefined here, so `??` supplies the fallback.
console.log(`email: ${matters[1].lead?.email ?? "none on file"}`);

// --- Data that arrives LATER ---
// `async` marks a function as one that may pause. Inside it, `await` says
// "stop here until this promise settles, then continue with its value."
// The code reads top-to-bottom like ordinary code, but it does NOT block the
// browser — the page stays responsive while it waits.
async function main() {
  console.log("\nfetching…");
  const rows = await fetchMatters(); // waits ~400ms, then hands back the array
  // Without `await`, `rows` would be the Promise object itself, and rows.length
  // would be undefined. That's the classic async bug.
  console.log(`got ${rows.length} matters`);
  // .forEach is like .map but for side effects — it runs the function on every
  // item and returns nothing. Use it when you want to DO something, not build a list.
  rows.slice(0, 3).forEach((m) => console.log("  " + line(m)));

  // try/catch is how you handle a promise that rejects. Anything thrown inside
  // `try` jumps straight to `catch` — the rest of the try block is skipped.
  try {
    const one = await fetchMatter("M-1003");
    console.log(`\nfound: ${line(one)}`);
    await fetchMatter("M-9999"); // this one rejects → jumps to catch
    console.log("you will never see this line");
  } catch (err) {
    // `err` is the Error created in matters-data.js; .message is its text.
    console.log(`handled: ${err.message}`);
  } finally {
    // `finally` runs either way — success or failure. Good for "stop the spinner".
    console.log("done.");
  }
}

// Calling it starts the work. Note that main() returns immediately (it's async),
// which is why "fetching…" appears before the results.
main();

// 👉 Everything on this page is what React code is written in: imports at the top,
//    destructured props, spread to update state without mutating, ?. for data that
//    might not have arrived yet, and await for data that arrives over the network.

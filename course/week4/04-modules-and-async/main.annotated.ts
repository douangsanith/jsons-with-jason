// Week 4 · Day 4 — the entry point, annotated, in TypeScript.
// Read this beside main.ts, and beside main.annotated.js. The JavaScript and the
// TypeScript run the same logic in the same order; every difference is a type.
//
// Run it with:   node main.annotated.ts
// Node strips the annotations and runs what's left. It does NOT check them — your
// editor does that. See Day 1 section 6 for why that gap matters.

// --- Imports ---
// `import type` brings in a SHAPE, not a value. It is erased before the file
// runs, so it creates no runtime dependency at all — there is no types.js and
// there never needs to be one.
import type { Matter } from "./types.annotated.ts";

// One file, two kinds of import in one statement:
//   `matters`                     — the DEFAULT export, no braces, name is ours to pick
//   `{ firm, fetchMatters, ... }` — NAMED exports, braces, names must match exactly
// The "./" and the ".ts" are both required. Unlike Python, there is no guessing
// at the extension, and unlike bundler-flavoured TypeScript you write `.ts` here
// rather than `.js` — because Node is reading this file directly.
import matters, { firm, fetchMatters, fetchMatter } from "./matters-data.annotated.ts";
import { money, statusLabel, leadName, line } from "./format.annotated.ts";

// `matters` arrived typed as `Matter[]`, so `.length` is known to be a number and
// `.lenth` would be flagged. Types cross module boundaries — that's the payoff of
// having declared the shape once in types.annotated.ts.
console.log(`=== ${firm} — ${matters.length} matters ===\n`);

// --- Object destructuring keeps its types ---
// The names in braces must match KEYS in the object — and now TypeScript enforces
// that too. `client` is `string`, `billed` is `number`, `area` is `string`, all
// inferred from the Matter type with nothing annotated.
//
// That inference is load-bearing on the next line: `money(billed)` compiles only
// because `billed` is known to be a number, and `money` only accepts numbers.
const { client, billed, area } = matters[0]; // string, number, string
console.log(`destructured: ${client} · ${area} · ${money(billed)}`);

// --- One line from main.annotated.js that CAN'T be written here ---
// The .js version does this:
//     const { id: matterId, currency = "USD" } = matters[0];
// and prints "renamed + default: M-1002 (USD)". In TypeScript that's an error:
//     Property 'currency' does not exist on type 'Matter'.
// Renaming (`id: matterId`) is fine — that's just a local name. It's the
// `currency` default that fails, because you cannot destructure a key the type
// says isn't there. JavaScript happily hands you `undefined` and lets the default
// paper over it; TypeScript asks whether the field exists at all.
//
// The fix is to say so in the type — add `currency?: string` to Matter — not to
// work around it at the point of use. That's the habit worth forming: when the
// type and reality disagree, the type is the thing to change.
//
// This is also why this file prints one fewer line than main.annotated.js.

// --- Array destructuring ---
// Arrays destructure by POSITION, not by name, so these names are ours to choose.
// TypeScript tracks the positions: `first` and `second` are `Matter`, and the
// REST pattern `...others` collects everything left over into a NEW `Matter[]`.
// Six matters in, two named, so `others.length` is 4.
const [first, second, ...others] = matters; // Matter, Matter, Matter[]
console.log(`first: ${first.id} · second: ${second.id} · rest: ${others.length}`);

// --- Spread: copy and extend, instead of mutating ---
// `: Matter` is a promise to the compiler. Miss a required field, add one that
// isn't in the type, or put a string where a number belongs, and the editor says
// so before you run anything. Note `lead` is absent and that's fine — it's optional.
const newMatter: Matter = { id: "M-1007", client: "Glenmoor PLC", area: "Tax", billed: 4200, active: true };
// `...matters` unpacks every existing item into a brand-new array, then adds one.
// Spreading a `Matter[]` and appending a `Matter` gives a `Matter[]` — the
// annotation is checked, not assumed. Compare `matters.push(newMatter)`, which
// would CHANGE the original array and return a number instead.
const withNew: Matter[] = [...matters, newMatter]; // a NEW array; `matters` is untouched
console.log(`spread array: ${matters.length} -> ${withNew.length}`);

// Object spread: copy every field, then override the ones listed afterwards
// (later keys win). The result still satisfies `Matter`, because a full copy plus
// a same-typed override can't break the shape — TypeScript can prove that.
//
// Worth knowing: spread is SHALLOW. `closedFirst.lead` is the SAME object as
// `matters[0].lead`, not a copy. Mutating it would affect both. That bites people
// constantly in React state.
const closedFirst: Matter = { ...matters[0], active: false }; // copy, override one field
console.log(`spread object: ${statusLabel(matters[0])} -> ${statusLabel(closedFirst)}`);

// --- Optional chaining (?.) and nullish coalescing (??) ---
// M-1002 has a lead; M-1001 has no `lead` key at all — and nothing crashes.
// See format.annotated.ts for how leadName pulls that off.
console.log(`lead of ${matters[0].id}: ${leadName(matters[0])}`);
console.log(`lead of ${matters[1].id}: ${leadName(matters[1])}`); // no `lead` field at all
// Chained inline. `matters[1].lead` is `undefined`, so `?.email` short-circuits
// to `undefined`, and `??` supplies the fallback. Without the `?.` this is a
// compile error, not just a crash — which is the improvement over the .js version.
console.log(`email: ${matters[1].lead?.email ?? "none on file"}`);

// --- Data that arrives LATER ---
// `async` marks a function as one that may pause. `: Promise<void>` is its return
// type: an async function ALWAYS returns a promise, and `void` means it resolves
// with no useful value. You cannot annotate an async function as `: void` — the
// compiler insists on the Promise wrapper, which is a helpful reminder of what
// `async` actually does to a signature.
async function main(): Promise<void> {
  console.log("\nfetching…");
  // `fetchMatters()` returns `Promise<Matter[]>`. `await` UNWRAPS that: promise
  // in, `Matter[]` out. The `: Matter[]` annotation is redundant — inference
  // already knows — and is written here only to make the unwrapping visible.
  //
  // Without `await`, this would be a type ERROR rather than the silent
  // `rows.length === undefined` bug the .js version has: you'd be annotating a
  // `Promise<Matter[]>` as a `Matter[]`, and the compiler catches it. The classic
  // async bug is simply not available to you here.
  const rows: Matter[] = await fetchMatters(); // waits ~400ms, then hands back the array
  console.log(`got ${rows.length} matters`);
  // .forEach is like .map but for side effects — it runs the function on every
  // item and returns nothing. `m` needs no annotation: TypeScript knows `rows` is
  // `Matter[]`, so `m` must be a `Matter`. Inference doing the work again.
  rows.slice(0, 3).forEach((m) => console.log("  " + line(m)));

  // try/catch is how you handle a promise that REJECTS. Anything thrown inside
  // `try` jumps straight to `catch` — the rest of the try block is skipped.
  try {
    // `fetchMatter` returns `Promise<Matter>`, singular. Note there's no
    // `| undefined` to deal with: the module already handled the not-found case
    // by rejecting, so a successful await always yields a real Matter.
    const one: Matter = await fetchMatter("M-1003");
    console.log(`\nfound: ${line(one)}`);
    // No such id, so this rejects — and the `await` turns that rejection into a
    // thrown error, which is why try/catch works on it at all. The console.log
    // below it never runs.
    await fetchMatter("M-9999"); // this one rejects
  } catch (err) {
    // Here's a real difference from the .js version. `err` is typed `unknown`,
    // not `Error`, because JavaScript lets you throw literally anything —
    // `throw "oops"` is legal. So `err.message` is a compile error, and
    // TypeScript makes you PROVE what you have first.
    //
    // `err instanceof Error` is the proof. Inside that branch, `err` is narrowed
    // to `Error` and `.message` becomes legal. `String(err)` handles the other
    // case. Compare main.annotated.js, which reads `err.message` and would print
    // `undefined` if anything ever threw a non-Error.
    console.log(`handled: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    // `finally` runs either way — success or failure. Use it for cleanup that
    // must happen regardless: closing a connection, hiding a spinner.
    console.log("done.");
  }
}

// Called WITHOUT await, at the top level. `main()` starts, hits its first
// `await`, and hands control straight back here — which is why "done." prints
// last even though this is the final line of the file. Nothing after this call
// waits for it.
main();

// 👉 Every idea here reappears in Week 5: a shared types.ts, an optional field
//    handled with ?., and an await that unwraps a Promise<Matter[]> — that last
//    one is literally the fetch in matter-app/src/App.tsx.

// Week 4 · Day 4 — the data module, annotated.
// Read this beside matters-data.ts. Nothing here runs on its own: this file only
// EXPORTS things, and main.annotated.ts decides what to use.

// The type comes from types.annotated.ts. Note that this module and
// format.annotated.ts both import the SAME Matter — that's the point of a shared
// type file. In Days 1 and 2 the shape had to be redeclared in every script, and
// nothing stopped two copies from drifting apart.
import type { Matter } from "./types.annotated.ts";

// --- Named exports ---
// `export` in front of a declaration makes it importable BY NAME. The importing
// file must ask for it in braces and spell it identically:
//   import { firm } from "./matters-data.annotated.ts";
// The `: string` is optional here — TypeScript already infers `string` from the
// value. It's written out only to show where an annotation would go.
export const firm: string = "Rivera & Associates";

// --- Matter[] — "an array of Matter" ---
// The `[]` suffix is how you say "a list of these", and it's the most common type
// you'll write, because web data is nearly always an array of records.
//
// This annotation checks all six rows at once. Try it: misspell `client` as
// `clint`, drop `active` from a row, or write `billed: "42750.5"` with quotes.
// Each one is flagged in the editor immediately, pointing at the offending row.
// The .js version accepts all three silently and fails much later, somewhere else.
//
// Note there is NO `export` here. `matters` is private to this module until the
// `export default` line below hands it out — declaration and export are separate
// steps, and you can choose to do only the first.
const matters: Matter[] = [
  // Rows 1, 3 and 4 have a `lead`; rows 2, 5 and 6 don't. That's legal because
  // `lead?` is optional in the type — and it's what makes `?.` necessary later.
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true,
    lead: { name: "R. Rivera", email: "rrivera@example.com" } },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  // P. Osei has a name but no email — `email?` is optional inside `lead` too.
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true,
    lead: { name: "P. Osei" } },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false,
    lead: { name: "L. Chen", email: "lchen@example.com" } },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// --- The default export ---
// One per file, maximum. It's "the one main thing this file is about", and the
// importer gets to choose the name it lands under (no braces, no name matching):
//   import matters from "./matters-data.annotated.ts";
//   import rows    from "./matters-data.annotated.ts";   // same array
// That flexibility is also the downside — a typo in the name is undetectable,
// whereas a mistyped NAMED import fails loudly. Prefer named exports by default.
export default matters;

// --- A fake API ---
// `Promise<Matter[]>` reads as "a promise of an array of Matter". The angle
// brackets pass a type as an argument, the same way parens pass a value. You'll
// meet this syntax again as `useState<Matter[]>` in Week 5.
//
// The return type is doing real work: it tells a caller both that this is async
// AND what they'll have once they await it. Compare the .js version, where you
// have to read the body to learn either fact.
//
// `delayMs: number = 400` is an annotated default parameter. The `: number` is
// redundant — the default `400` already proves it's a number — and is shown here
// only to mark the position. Idiomatic TypeScript would write `delayMs = 400`.
export function fetchMatters(delayMs: number = 400): Promise<Matter[]> {
  // `new Promise(...)` takes an EXECUTOR function, and this is the part people
  // misread: the executor runs IMMEDIATELY and SYNCHRONOUSLY, right now, as part
  // of this call. So the clock below starts the instant somebody calls
  // fetchMatters() — NOT when they await it.
  //
  // That's why you can start two requests and await them afterwards to have both
  // running at once. The call starts the work; the await only collects it.
  return new Promise((resolve) => {
    // `resolve` is a function handed to you by the Promise. Calling it is what
    // flips the promise from `pending` to `fulfilled` and notifies everyone
    // waiting. A promise can only settle ONCE — later calls are ignored.
    //
    // Nobody is polling for this. The awaiting code registered itself as a
    // subscriber and went away; `resolve` is the doorbell that wakes it up.
    //
    // We don't annotate `resolve`. TypeScript infers it from the `Promise<Matter[]>`
    // return type, which is also why passing the wrong thing here — say
    // `resolve(firm)` — is an error.
    setTimeout(() => resolve(matters), delayMs);
  });
}

// The same idea, but this one can FAIL. A promise has two exits: `resolve` for
// success and `reject` for failure.
//
// Note the return type is `Promise<Matter>` — singular, no `[]` — and there's no
// `| undefined` in it. That's a promise to the caller that if this settles
// successfully, they get a real Matter. The `if` below is what makes it true.
export function fetchMatter(id: string, delayMs: number = 200): Promise<Matter> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // `.find` returns `Matter | undefined` — it might not find anything. This
      // is the single best example of types earning their keep: TypeScript will
      // NOT let you pass `found` straight to `resolve`, because `undefined` isn't
      // a `Matter`. It forces the check on the next line.
      const found = matters.find((m) => m.id === id); // Matter | undefined
      // Inside this `if`, TypeScript NARROWS `found` from `Matter | undefined`
      // down to just `Matter` — it can see that undefined is impossible here.
      // That narrowing is what makes `resolve(found)` type-check.
      if (found) resolve(found);
      // Rejecting with `new Error(...)` is the convention, not a requirement —
      // you can reject with any value. Stick to Errors: they carry a `.message`
      // and a stack trace, and `err instanceof Error` in main's catch depends on it.
      else reject(new Error(`No matter with id ${id}`));
    }, delayMs);
  });
}

// 👉 A real data module looks exactly like this, with `fetch(url)` in place of
//    `setTimeout`. The types don't change at all — which is why the React
//    component in Week 5 Day 4 works against a JSON file, FastAPI or Snowflake
//    without a single edit. Only the URL moves.

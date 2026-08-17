// Week 4 · Day 1 — the TypeScript version, annotated.
// Run it with:   node matters.annotated.ts
//
// There are now four files worth comparing, and the comparison IS the lesson:
//   matters.js             the plain JavaScript
//   matters.annotated.js   the same, explained line by line
//   matters.ts             the TypeScript, tidied
//   matters.annotated.ts   this file — the TypeScript, explained line by line
//
// Put matters.annotated.js beside this one. The logic is identical, statement for
// statement. Every single difference you find is a type annotation. That is the
// whole of TypeScript: JavaScript, plus notes about what shape things are.

// --- A type: a description of a shape, written once ---
// `type Name = { ... }` names a shape you can reuse anywhere. By convention your
// own types are Capitalised; the built-in ones (string, number, boolean) are
// lowercase. That casing is the quickest way to tell them apart when reading.
//
// This declaration produces NO runtime code. Node deletes it before running the
// file. It exists purely so your editor — and the next person — knows what a
// matter is.
type Matter = {
  // Each member is `key: type`, separated by SEMICOLONS. This is a type literal,
  // not an object literal, so `;` is idiomatic here where `,` would be used in a
  // real object. (Commas also work, which trips people up. Pick one and stick.)
  id: string;
  client: string;
  area: string;
  // Declaring this as `number` rather than `string` is what makes `.toFixed(2)`
  // and arithmetic legal on it later. Get this wrong and every use is wrong.
  billed: number; // a NUMBER, so .toFixed() and arithmetic are safe
  active: boolean;
  // `string | null` is a UNION: the `|` means "either of these". This field holds
  // EITHER a date string OR null, and TypeScript then makes you handle both
  // possibilities before you use it — you can't call `.toUpperCase()` on it
  // without first proving it isn't null.
  //
  // Unions are the feature that most changes how you write code. Once you have
  // them, "this might be missing" stops being a thing you remember and becomes a
  // thing the compiler tracks.
  closedOn: string | null;
};

// --- Annotating a variable ---
// The `: string` after the name is the annotation. Read it aloud as "firm is a
// string". It goes after the name and before the `=`, always.
const firm: string = "Rivera & Associates";
// Same for numbers. `let` because this one gets reassigned two lines down.
let openMatters: number = 3;
// Because openMatters is declared a number, this arithmetic is fine. Try writing
// `openMatters = "three"` and your editor objects the instant you type it —
// no build step, no terminal, no waiting.
openMatters = openMatters - 1;

console.log(`Firm: ${firm}`);
console.log(`Open matters: ${openMatters}`);

// --- Most of the time you don't annotate at all ---
// This surprises people who expect TypeScript to be noisy. It INFERS the type
// from the value: `"Acme Corp"` is obviously a string, so writing `: string`
// would add nothing at all and just make the line longer.
//
// The rule of thumb: annotate at the EDGES — function parameters, return types,
// and data arriving from outside your program — and let inference handle the
// middle. Good TypeScript mostly looks like untyped JavaScript.
const client = "Acme Corp"; // inferred: string
const billed = 18500.0; // inferred: number
const active = true; // inferred: boolean
// Inferred as exactly `null`, which is narrower than you might want. Assigning a
// string to it later would be an error. `let closedOn: string | null = null` is
// what you'd write if you intended it to change.
const closedOn = null; // inferred: null

// `typeof` is a RUNTIME operator and has nothing to do with the annotations above
// — it still works identically in the .js version. Don't confuse it with
// TypeScript's compile-time `typeof`, which is a different thing entirely.
console.log(typeof client, typeof billed, typeof active);

// --- An object that must match the shape ---
// `: Matter` is a promise to the compiler, and it's checked three ways at once.
// Miss a required field, add one that isn't in the type, or put a string where a
// number belongs, and the editor tells you before you ever run the file.
//
// Try each: delete the `area` line; add `priority: "high"`; change `billed:` to
// `billed: "18500"`. Three different errors, all instant.
const matter: Matter = {
  id: "M-1001",
  // `client: client` reads oddly but is just "the key `client`, set to the
  // variable `client`". Since the names match, modern JS lets you shorten this to
  // just `client` — shown longhand here so the two halves stay visible.
  client: client,
  area: "Contracts",
  billed: billed,
  active: active,
  // This is why `closedOn` was typed `string | null`: we're putting null in it.
  closedOn: closedOn,
};

console.log(matter.id); // dot access — autocompletes, and typos are caught
console.log(matter["client"]); // bracket access — same value, also type-checked
// Still allowed, and worth understanding why: `const` protects the BINDING (you
// can't point `matter` at a different object), not the fields. And `area` is
// declared `string`, so a string is what it accepts. Assigning `42` here fails.
matter.area = "Commercial Contracts";

// --- Functions: the most valuable place to annotate ---
// `(amount: number)` types the input. The `: string` after the closing paren
// types what comes BACK. Together they're a contract: anyone calling feeNote
// knows what to hand it and what they'll get, without reading the body.
//
// This is where annotations pay for themselves. A wrong argument is caught at the
// CALL SITE — `feeNote("18500")` fails where the mistake actually is, rather than
// crashing inside `.toFixed()` and making you trace back.
function feeNote(amount: number): string {
  // `.toFixed(2)` is legal precisely because `amount` is a number. In the .js
  // version this line is a landmine: pass a string and it crashes here.
  return `$${amount.toFixed(2)} billed to date`;
}

// Arrow functions annotate the same way. `m: Matter` means this accepts a full
// matter and nothing less — so `m.active` is GUARANTEED to exist, and no
// defensive check is needed. That guarantee is the type doing real work.
const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

// A multi-line arrow function needs `{ }` and an explicit `return`. The
// annotations sit in the same places regardless of the body's shape.
const describe = (m: Matter): string => {
  // No annotation needed: `statusLabel` is declared to return `string`, so
  // `status` is inferred as `string`. Types flow through calls automatically.
  const status = statusLabel(m);
  // `feeNote(m.billed)` type-checks because `m.billed` is declared `number` and
  // `feeNote` wants a `number`. Two annotations, written far apart, agreeing.
  return `${m.id} · ${m.client} · ${m.area} · ${status} · ${feeNote(m.billed)}`;
};

console.log("\n" + describe(matter));

// --- Default parameters ---
// `name: string = "team"` has both an annotation and a default. The `: string` is
// actually redundant here — the default `"team"` already proves it's a string —
// and is shown only to mark where it would go. Idiomatic TypeScript writes
// `(name = "team")` and lets inference do it.
const greetLead = (name: string = "team"): string => `Prepared for ${name}.`;

console.log(greetLead("Jason"));
console.log(greetLead()); // no argument, so the default is used

// --- The one thing to understand before Week 5 ---
// Types are ERASED. Node reads this file, deletes every annotation, and runs the
// plain JavaScript that's left. It does not check a single thing. So:
//   • your EDITOR catches mistakes as you type (red squiggle, no setup needed)
//   • `node matters.annotated.ts` runs regardless, even with a type error in it
//   • `npm run build` (Week 5 Day 3) REFUSES to build — that's the enforcement
//
// Try it: change `billed` to "18500" with quotes. Squiggle in the editor, runs
// fine in the terminal — right up until `.toFixed()` crashes at runtime. That gap
// between "the editor knows" and "nothing stopped me" is exactly what Week 5
// closes, and it's why a build step exists at all.

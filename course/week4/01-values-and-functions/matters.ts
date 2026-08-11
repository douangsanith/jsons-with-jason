// Week 4 · Day 1 — the same program as matters.js, written in TypeScript.
// Run it exactly the same way:   node matters.ts
// (Needs Node 22.18 or newer — check with `node --version`.)
//
// There is ONE copy of this file, and it's commented — it exists to be compared
// with matters.js, not to be built on. Open the two side by side: every line of
// logic is identical. The only additions are the type annotations. That is
// genuinely all TypeScript is — JavaScript, plus notes about what shape things are.

// --- A type: a description of a shape, written once ---
// `type Name = { ... }` names a shape you can then reuse. By convention your own
// types are Capitalised; the built-in ones (string, number, boolean) are lowercase.
type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number; // a NUMBER, so .toFixed() and arithmetic are safe
  active: boolean;
  // `string | null` is a UNION: this field holds EITHER a date string OR null.
  // TypeScript then makes you handle both possibilities before using it.
  closedOn: string | null;
};

// --- Annotating a variable ---
// The `: string` after the name is the annotation. Read it as "firm is a string".
const firm: string = "Rivera & Associates";
let openMatters: number = 3;
// Because openMatters is a number, this arithmetic is fine. Try
// `openMatters = "three"` and your editor objects straight away.
openMatters = openMatters - 1;

console.log(`Firm: ${firm}`);
console.log(`Open matters: ${openMatters}`);

// --- Most of the time you don't annotate at all ---
// This surprises people: TypeScript INFERS the type from the value. `client` is
// obviously a string, so writing `: string` would add nothing. Good TypeScript
// mostly looks untyped; you annotate at the EDGES — function parameters, and
// shapes that arrive from outside your program.
const client = "Acme Corp"; // inferred: string
const billed = 18500.0; // inferred: number
const active = true; // inferred: boolean
const closedOn = null; // inferred: null

console.log(typeof client, typeof billed, typeof active);

// --- An object that must match the shape ---
// `: Matter` is a promise to the compiler. Miss a field, add one that isn't in
// the type, or put a string where a number belongs, and your editor says so
// before you ever run the file.
const matter: Matter = {
  id: "M-1001",
  client: client,
  area: "Contracts",
  billed: billed,
  active: active,
  closedOn: closedOn,
};

console.log(matter.id);
console.log(matter["client"]);
// Still allowed: `const` protects the binding, not the fields — and `area` is
// declared as a string, so a string is what it accepts.
matter.area = "Commercial Contracts";

// --- Functions: the most valuable place to annotate ---
// `(amount: number)` types the input; the `: string` after the ) types what comes
// back. Now anyone calling feeNote knows what to hand it and what they'll get,
// without reading the body.
function feeNote(amount: number): string {
  return `$${amount.toFixed(2)} billed to date`;
}

// Arrow functions annotate the same way. `m: Matter` means this only accepts a
// full matter — so `m.active` below is guaranteed to exist.
const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

const describe = (m: Matter): string => {
  const status = statusLabel(m);
  return `${m.id} · ${m.client} · ${m.area} · ${status} · ${feeNote(m.billed)}`;
};

console.log("\n" + describe(matter));

// --- Default parameters ---
// The default "team" is a string, so TypeScript already knows. The `: string`
// here is optional — shown only to mark where it would go.
const greetLead = (name: string = "team"): string => `Prepared for ${name}.`;

console.log(greetLead("Jason"));
console.log(greetLead());

// --- The one thing to understand before Week 5 ---
// Types are ERASED. Node reads this file, deletes every annotation, and runs the
// plain JavaScript that's left — it does not check anything. So:
//   • your EDITOR catches mistakes as you type (red squiggle, no setup needed)
//   • `node matters.ts` runs regardless, even with a type error in the file
//   • `npm run build` (Week 5 Day 3) REFUSES to build — that's the enforcement
// Try it: change `billed` to "18500" with quotes. Squiggle in the editor, runs
// fine in the terminal. That gap is exactly what Week 5 closes.

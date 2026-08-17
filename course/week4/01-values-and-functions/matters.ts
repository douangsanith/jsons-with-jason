// Week 4 · Day 1 — the same program as matters.js, written in TypeScript.
// Run it exactly the same way:   node matters.ts
// (Needs Node 22.18 or newer — check with `node --version`.)
//
// Open this beside matters.js: every line of logic is identical, and the only
// additions are the type annotations. That is genuinely all TypeScript is —
// JavaScript, plus notes about what shape things are.
// For a line-by-line walkthrough, read matters.annotated.ts.

// --- A type: a description of a shape, written once ---
type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number; // a NUMBER, so .toFixed() and arithmetic are safe
  active: boolean;
  closedOn: string | null; // a UNION: either a date string OR null
};

// --- Annotating a variable: read `: string` as "firm is a string" ---
const firm: string = "Rivera & Associates";
let openMatters: number = 3;
openMatters = openMatters - 1; // fine — openMatters is a number

console.log(`Firm: ${firm}`);
console.log(`Open matters: ${openMatters}`);

// --- Most of the time you don't annotate at all: TypeScript INFERS ---
const client = "Acme Corp"; // inferred: string
const billed = 18500.0; // inferred: number
const active = true; // inferred: boolean
const closedOn = null; // inferred: null

console.log(typeof client, typeof billed, typeof active);

// --- An object that must match the shape ---
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
matter.area = "Commercial Contracts"; // `const` protects the binding, not the fields

// --- Functions: the most valuable place to annotate ---
// `(amount: number)` types the input; `: string` types what comes back.
function feeNote(amount: number): string {
  return `$${amount.toFixed(2)} billed to date`;
}

// Arrow functions annotate the same way.
const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

const describe = (m: Matter): string => {
  const status = statusLabel(m);
  return `${m.id} · ${m.client} · ${m.area} · ${status} · ${feeNote(m.billed)}`;
};

console.log("\n" + describe(matter));

// --- Default parameters ---
const greetLead = (name: string = "team"): string => `Prepared for ${name}.`;

console.log(greetLead("Jason"));
console.log(greetLead());

// --- The one thing to understand before Week 5: types are ERASED ---
// Node deletes every annotation and runs the plain JavaScript that's left — it
// does not check anything. Your EDITOR is what catches mistakes; `npm run build`
// (Week 5 Day 3) is what refuses to ship them.

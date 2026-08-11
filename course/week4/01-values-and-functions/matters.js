// Week 4 · Day 1 — Values & functions
// Run this file from a terminal:   node matters.js
// (Node.js is JavaScript outside the browser — the same engine Vite uses.)

// --- Variables: const for values that won't be reassigned, let for ones that will ---
const firm = "Rivera & Associates";
let openMatters = 3;
openMatters = openMatters - 1; // allowed, because it's `let`

// --- Template literals: backticks + ${...} — JavaScript's f-string ---
console.log(`Firm: ${firm}`);
console.log(`Open matters: ${openMatters}`);

// --- The four types you'll meet all week ---
const client = "Acme Corp"; // string
const billed = 18500.0; // number
const active = true; // boolean
const closedOn = null; // null = "deliberately empty"

console.log(typeof client, typeof billed, typeof active);

// --- Objects: named fields, like one row of a matter intake form ---
const matter = {
  id: "M-1001",
  client: client,
  area: "Contracts",
  billed: billed,
  active: active,
  closedOn: closedOn,
};

console.log(matter.id); // dot access
console.log(matter["client"]); // bracket access — same thing
matter.area = "Commercial Contracts"; // fields can change even on a `const` object

// --- Functions: a named, reusable recipe ---
function feeNote(amount) {
  return `$${amount.toFixed(2)} billed to date`;
}

// --- Arrow functions: the same idea, shorter. This is the form React code uses. ---
const statusLabel = (m) => (m.active ? "Active" : "Closed");

// A multi-line arrow function needs { } and an explicit `return`.
const describe = (m) => {
  const status = statusLabel(m);
  return `${m.id} · ${m.client} · ${m.area} · ${status} · ${feeNote(m.billed)}`;
};

console.log("\n" + describe(matter));

// --- Default parameters: a fallback when an argument isn't passed ---
const greetLead = (name = "team") => `Prepared for ${name}.`;

console.log(greetLead("Jason"));
console.log(greetLead());

// 👉 Tomorrow: one matter becomes a LIST of matters, and you'll learn the three
//    array methods (map / filter / reduce) that every React app is built on.

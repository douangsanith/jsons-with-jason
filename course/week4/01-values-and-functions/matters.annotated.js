// ANNOTATED VERSION — same script as matters.js, with teaching comments.
// Read this one to learn; use the clean matters.js to build.
//
// Week 4 · Day 1 — Values & functions
// Run this file from a terminal:   node matters.annotated.js
// (Node.js is JavaScript outside the browser — the same engine Vite uses.)

// --- Variables: two ways to name a value ---
// `const` = a CONSTANT: you can never point this name at a different value.
// Use it by default — it tells the next reader "this won't move."
const firm = "Rivera & Associates";

// `let` = a value you intend to change later. Use it only when you must.
let openMatters = 3;
// Reassignment: compute a new value and store it back under the same name.
// If `openMatters` had been declared with `const`, this line would crash.
openMatters = openMatters - 1; // allowed, because it's `let`

// --- Template literals ---
// Backticks ` ` (not quotes) let you drop values into text with ${...}.
// This is JavaScript's version of a Python f-string.
console.log(`Firm: ${firm}`);
console.log(`Open matters: ${openMatters}`);

// --- The four types you'll meet all week ---
const client = "Acme Corp"; // string  — text, in quotes
const billed = 18500.0; // number  — JS has ONE number type (no separate int/float)
const active = true; // boolean — exactly `true` or `false`, no quotes
const closedOn = null; // null    — "deliberately empty" (a matter with no close date)

// `typeof` reports the type of a value. Handy when a bug makes you ask
// "wait, is this a number or a string?" — a very common JavaScript mix-up.
console.log(typeof client, typeof billed, typeof active);

// --- Objects: named fields, like one row of a matter intake form ---
// { } groups related values under labels (keys). Each `key: value` pair is a field.
const matter = {
  id: "M-1001",
  client: client, // the value of the `client` variable above
  area: "Contracts",
  billed: billed,
  active: active,
  closedOn: closedOn,
};

console.log(matter.id); // dot access — the normal way to read a field
console.log(matter["client"]); // bracket access — same thing, useful when the key is itself a variable

// Surprise worth knowing: `const` freezes the NAME, not the contents.
// You can't do `matter = {...}`, but you CAN change a field inside it.
matter.area = "Commercial Contracts"; // fields can change even on a `const` object

// --- Functions: a named, reusable recipe ---
// `function name(inputs) { ... return output }`. It runs only when you CALL it.
function feeNote(amount) {
  // .toFixed(2) formats a number to exactly 2 decimal places and returns a STRING.
  return `$${amount.toFixed(2)} billed to date`;
}

// --- Arrow functions ---
// The same idea, written shorter: (inputs) => the value it returns.
// With no { }, the single expression is returned automatically — no `return` needed.
// `condition ? a : b` is a "ternary": an if/else that produces a value.
const statusLabel = (m) => (m.active ? "Active" : "Closed");

// If the body needs more than one line, add { } — and then you MUST write `return`
// yourself. Forgetting it is the #1 arrow-function bug (the function returns nothing).
const describe = (m) => {
  const status = statusLabel(m); // functions can call other functions
  return `${m.id} · ${m.client} · ${m.area} · ${status} · ${feeNote(m.billed)}`;
};

// "\n" is an escape sequence meaning "start a new line" — it adds a blank line here.
console.log("\n" + describe(matter));

// --- Default parameters ---
// `name = "team"` supplies a fallback used only when the caller passes nothing.
const greetLead = (name = "team") => `Prepared for ${name}.`;

console.log(greetLead("Jason")); // → Prepared for Jason.
console.log(greetLead()); // → Prepared for team.   (default kicks in)

// 👉 Tomorrow: one matter becomes a LIST of matters, and you'll learn the three
//    array methods (map / filter / reduce) that every React app is built on.

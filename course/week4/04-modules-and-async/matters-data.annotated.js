// ANNOTATED VERSION — same module as matters-data.js, with teaching comments.
// Read this one to learn; use the clean matters-data.js to build.
//
// Week 4 · Day 4 — the data module.
// Nothing here runs on its own; main.annotated.js imports what it needs.
// A module's job is to OWN one thing and hand it out. This one owns the matters.

// A NAMED export: the name is part of the deal, so the importer must use braces:
//   import { firm } from "./matters-data.js";
export const firm = "Rivera & Associates";

// No `export` keyword on this line, so `matters` is PRIVATE to this file until
// we deliberately export it below. That's the point of modules: you choose what
// leaves the file, and everything else stays out of everyone's way.
// Note that some matters have a `lead` object and some don't — that's on purpose,
// so main.js has something real to use optional chaining (?.) on.
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true,
    lead: { name: "R. Rivera", email: "rrivera@example.com" } },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true,
    lead: { name: "P. Osei" } },                       // has a lead, but no email
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false,
    lead: { name: "L. Chen", email: "lchen@example.com" } },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// The DEFAULT export: "the one main thing this file is about." A file may have
// at most one. Because it has no name of its own, the importer picks one and
// writes it WITHOUT braces:
//   import matters from "./matters-data.js";   (or `import rows from ...` — same thing)
export default matters;

// --- A fake API ---
// A PROMISE is an object representing a value that isn't ready yet. `new Promise`
// hands you a `resolve` function; calling it means "the value is ready, here it is."
// setTimeout(fn, ms) runs fn after ms milliseconds — so this pretends to be a
// network request that takes 400ms, with no network involved.
export function fetchMatters(delayMs = 400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matters), delayMs);
  });
}

// The same idea, but this one can FAIL. A promise has two exits: `resolve` for
// success and `reject` for failure. Rejecting with `new Error(...)` is the
// convention — main.js catches it and reads err.message.
export function fetchMatter(id, delayMs = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = matters.find((m) => m.id === id); // Day 2's .find
      if (found) resolve(found);
      else reject(new Error(`No matter with id ${id}`));
    }, delayMs);
  });
}

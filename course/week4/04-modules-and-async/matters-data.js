// Week 4 · Day 4 — the data module.
// Nothing here runs on its own; main.js imports what it needs.

// A NAMED export: imported as   import { firm } from "./matters-data.js";
export const firm = "Rivera & Associates";

const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true,
    lead: { name: "R. Rivera", email: "rrivera@example.com" } },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true,
    lead: { name: "P. Osei" } },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false,
    lead: { name: "L. Chen", email: "lchen@example.com" } },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// The DEFAULT export: the one main thing this file is about.
// Imported without braces as   import matters from "./matters-data.js";
export default matters;

// A fake API. It returns a PROMISE that resolves after a short delay — the same
// shape a real network call has, with no network involved.
export function fetchMatters(delayMs = 400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matters), delayMs);
  });
}

// This one REJECTS when the id doesn't exist, so we can practise error handling.
export function fetchMatter(id, delayMs = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = matters.find((m) => m.id === id);
      if (found) resolve(found);
      else reject(new Error(`No matter with id ${id}`));
    }, delayMs);
  });
}

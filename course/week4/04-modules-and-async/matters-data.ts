// Week 4 · Day 4 — the data module, in TypeScript.
// Nothing here runs on its own; main.ts imports what it needs.

import type { Matter } from "./types.ts";

// A NAMED export: imported as   import { firm } from "./matters-data.ts";
export const firm: string = "Rivera & Associates";

// `Matter[]` means "an array of Matter". Every row below is checked against the
// type — misspell a key or drop a required field and your editor says so.
const matters: Matter[] = [
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
// Imported without braces as   import matters from "./matters-data.ts";
export default matters;

// A fake API. `Promise<Matter[]>` reads as "a promise of an array of Matter" —
// the return type tells you both that it's async and what you'll get.
export function fetchMatters(delayMs: number = 400): Promise<Matter[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matters), delayMs);
  });
}

// This one REJECTS when the id doesn't exist, so we can practise error handling.
export function fetchMatter(id: string, delayMs: number = 200): Promise<Matter> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = matters.find((m) => m.id === id); // Matter | undefined
      if (found) resolve(found);
      else reject(new Error(`No matter with id ${id}`));
    }, delayMs);
  });
}

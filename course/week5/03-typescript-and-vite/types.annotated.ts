// ANNOTATED READING COPY — Week 5 · Day 3
// This is matter-app/src/types.ts, commented. The live file is ../matter-app/src/types.ts.
//
// This is the smallest file in the project and the most valuable. It is the one
// place that says what a "matter" IS. Every component, every fetch, and every
// build check agrees with this shape or fails.

// `type X = { ... }` defines a shape: which fields exist and what kind each is.
// Note the field types are lowercase — `string`, `number`, `boolean` — while a
// type you define yourself is Capitalised by convention (`Matter`).
export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number; // a NUMBER, so .toFixed() and arithmetic are safe
  active: boolean; // a BOOLEAN, so `m.active ? ... : ...` means what you think
  lead: string;
};

// None of this exists at runtime. `tsc` checks the types, then strips them out —
// the browser downloads plain JavaScript with no trace of this file. Types are a
// conversation between you and the compiler, not code that runs.

// --- Things you'll see next to a type like this ---
//
// Optional field — the `?` means "may be missing". Then TypeScript FORCES you to
// handle the missing case (Week 4 Day 4's ?. and ??) before you can read it:
//   type Matter = { ...; closedOn?: string };
//
// Union type — a value that must be one of a fixed set. Typo-proof by construction:
//   type Status = "open" | "closed" | "on-hold";
//
// Array of the shape — `Matter[]` means "a list of matters":
//   const matters: Matter[] = [ ... ];
//
// --- Try it ---
// Add `lead: string;` to a type whose data has no lead, and every place that
// builds a Matter turns red until you supply one. That is the value: the compiler
// finds all the affected code for you, instead of a user finding it in production.

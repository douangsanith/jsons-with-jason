// Week 4 · Day 4 — the shared type.
// Now that we have modules, the Matter shape can live in ONE file that every
// other file imports. Days 1 and 2 had to redeclare it in each script.
//
// This is the same file, doing the same job, as Week 5's matter-app/src/types.ts.

export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
  // `?` marks an OPTIONAL field: some matters have a lead, some don't.
  lead?: { name: string; email?: string };
};

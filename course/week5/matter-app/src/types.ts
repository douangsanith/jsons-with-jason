// One shape everything agrees on. Written once here, checked everywhere.
// If a matter arrives without a `lead`, or with `billed` as a string,
// TypeScript complains at build time instead of the UI breaking at 4pm.
export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
  lead: string;
};

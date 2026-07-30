// A Matter — one record in our data. This single type keeps the whole app honest:
// the JSON, the component props, and the state all agree on this shape.
export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
};

import type { Matter } from "../types";

// Props — the inputs a component receives, like arguments to a function.
// This one takes a single `matter` and TypeScript checks it has the right shape.
type MatterCardProps = {
  matter: Matter;
};

// A component is a function that returns JSX (HTML-inside-JavaScript).
// `{matter.client}` drops a JS value into the markup with curly braces.
export function MatterCard({ matter }: MatterCardProps) {
  const amount = matter.billed.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="card">
      <h3>{matter.id}</h3>
      <p>{matter.client}</p>
      <p className="tag">{matter.area}</p>
      <p className="amt">{amount}</p>
    </div>
  );
}

import type { Matter } from "../types";

// Props — the inputs a component receives, like arguments to a function.
// This one takes a single `matter` and TypeScript checks it has the right shape.
type MatterCardProps = {
  matter: Matter;
};

// A component is a function that returns JSX (HTML-inside-JavaScript).
// `{ matter }` in the parameter list is destructuring — Week 4 Day 4.
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
      <p>
        <span className="tag">{matter.area}</span>
      </p>
      {/* A ternary picks both the class and the label — same move as Week 4 Day 3. */}
      <p>
        <span className={matter.active ? "tag" : "tag closed"}>
          {matter.active ? "Active" : "Closed"}
        </span>
      </p>
      <p className="amt">{amount}</p>
      <p className="lead">{matter.lead}</p>
    </div>
  );
}

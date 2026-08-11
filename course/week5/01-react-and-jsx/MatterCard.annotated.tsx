// ANNOTATED READING COPY — Week 5 · Day 1
// This is matter-app/src/components/MatterCard.tsx with a comment on nearly every
// line. It is here to READ, not to run — the live file is the one in the project:
//   ../matter-app/src/components/MatterCard.tsx

// `import type` brings in a TYPE only — a description of a shape, not a value.
// It vanishes completely when the code is built. (Types are Day 3's topic; for
// today just read it as "this file agrees to use the shared Matter shape".)
import type { Matter } from "../types";

// PROPS are a component's inputs, exactly like arguments to a function.
// This says: MatterCard receives an object with one key, `matter`, whose value
// must be a Matter.
type MatterCardProps = {
  matter: Matter;
};

// A COMPONENT is a function that returns JSX. Two rules the compiler enforces:
//   1. the name must start with a Capital letter (that's how JSX tells your
//      components apart from built-in HTML tags like <div>)
//   2. it must return a single top-level element
//
// `{ matter }` in the parameter list is DESTRUCTURING — Week 4 Day 4. It pulls
// the `matter` key out of the props object so you can write `matter` instead of
// `props.matter` everywhere below.
export function MatterCard({ matter }: MatterCardProps) {
  // Plain JavaScript runs here, before the return. Nothing React-specific about it —
  // this is Week 4 Day 3's money formatter.
  const amount = matter.billed.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  // JSX: it LOOKS like HTML but it's JavaScript. The parentheses after `return`
  // just let the markup span several lines.
  return (
    // `className`, NOT `class` — because `class` is a reserved word in JavaScript.
    // This is the single most common surprise when reading Claude's JSX.
    <div className="card">
      {/* Curly braces drop a JavaScript value into the markup.
          Anything between { } is an expression that gets evaluated. */}
      <h3>{matter.id}</h3>
      <p>{matter.client}</p>
      <p>
        <span className="tag">{matter.area}</span>
      </p>
      {/* A ternary picks both the class and the label — same move as Week 4 Day 3,
          except there you glued strings together and here you write markup directly.
          Note: comments inside JSX must be wrapped in { } like this one. */}
      <p>
        <span className={matter.active ? "tag" : "tag closed"}>
          {matter.active ? "Active" : "Closed"}
        </span>
      </p>
      {/* `amount` is the value computed above — no quotes, it's a variable. */}
      <p className="amt">{amount}</p>
      <p className="lead">{matter.lead}</p>
    </div>
  );
}

// 👉 That's the whole component: data in through props, markup out through JSX.
//    It has no idea where the matters came from and no idea how many there are.
//    App.tsx decides that — see App.annotated.tsx next to this file.

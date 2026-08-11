// ANNOTATED READING COPY — Week 5 · Day 1
// This is matter-app/src/App.tsx AS IT WOULD LOOK TODAY — the simplest version
// that renders cards, with no state and no fetching yet. Days 2 and 4 grow it.
// Read this one; the live project file is ../matter-app/src/App.tsx.

import type { Matter } from "./types";
import { MatterCard } from "./components/MatterCard";

// Hard-coded data for today, so nothing distracts from the rendering.
// (Day 4 replaces this with a real fetch over HTTP.)
const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true, lead: "R. Rivera" },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true, lead: "P. Osei" },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true, lead: "P. Osei" },
];

// `export default` — Week 4 Day 4's default export. main.tsx imports this one
// function and mounts it into index.html's <div id="root">. That is the entire
// connection between the HTML file and everything you see on screen.
export default function App() {
  return (
    <div className="wrap">
      {/* Ordinary semantic HTML from Week 3 — <header>, <h1>, <p> all work in JSX. */}
      <header>
        <h1>Matter Intelligence</h1>
        {/* An expression in braces: JavaScript computes the number, JSX shows it. */}
        <p className="subtitle">{matters.length} matters</p>
      </header>

      <div className="board">
        {/* THE PAYOFF. This is Week 4 Day 2's map, except each item becomes a
            COMPONENT instead of a string of HTML.

            Week 4 Day 3:  shown.map(cardHtml).join("")
            Here:          matters.map((matter) => <MatterCard ... />)

            `matter={matter}` passes the prop: the name on the left is what the
            component receives, the value on the right is what we're sending.

            `key` is React's bookkeeping. It must be unique and stable per item so
            React can tell which card is which when the list changes. Leave it off
            and React warns in the console. The id is the natural choice — never
            use the array index if the list can be reordered or filtered. */}
        {matters.map((matter) => (
          <MatterCard key={matter.id} matter={matter} />
        ))}
      </div>
    </div>
  );
}

// 👉 Notice what ISN'T here: no getElementById, no innerHTML, no addEventListener,
//    no render() that you have to remember to call. You describe what the UI should
//    look like for this data, and React works out the DOM changes. Tomorrow you'll
//    change the data and watch it redraw itself.

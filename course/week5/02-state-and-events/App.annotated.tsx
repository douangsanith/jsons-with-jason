// ANNOTATED READING COPY — Week 5 · Day 2
// matter-app/src/App.tsx AS IT WOULD LOOK TODAY: state and events added, but the
// data is still a local array (Day 4 makes it a real fetch).
// Read this one; the live project file is ../matter-app/src/App.tsx.

// Hooks are imported from react by name — a named import, Week 4 Day 4.
import { useState } from "react";
import type { Matter } from "./types";
import { MatterCard } from "./components/MatterCard";

const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true, lead: "R. Rivera" },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true, lead: "P. Osei" },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true, lead: "P. Osei" },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false, lead: "L. Chen" },
];

export default function App() {
  // --- STATE: values this component remembers between renders ---
  // useState(initialValue) hands back exactly two things, and array destructuring
  // (Week 4 Day 4) names them: the current value, and a function to change it.
  // Calling the setter tells React "this is stale, run App() again" — which is
  // why there is no render() to call yourself.
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState("");

  // --- DERIVED values: computed fresh on every render ---
  // These are NOT state. They can always be worked out from state + data, so
  // storing them would just be a second copy to keep in sync. Rule of thumb:
  // if you can calculate it, calculate it.
  const term = search.trim().toLowerCase();
  const shown = matters
    .filter((m) => (activeOnly ? m.active : true))
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  const total = shown.reduce((sum, m) => sum + m.billed, 0);

  return (
    <div className="wrap">
      <header>
        <h1>Matter Intelligence</h1>
        <p className="subtitle">
          {shown.length} of {matters.length} matters ·{" "}
          {/* {" "} is a deliberate space. JSX collapses whitespace around line
              breaks, so this is how you keep one when the markup wraps. */}
          {total.toLocaleString("en-US", { style: "currency", currency: "USD" })} billed
        </p>
      </header>

      <div className="controls">
        {/* A CONTROLLED INPUT. Two halves that must both be present:
              value={search}            → the box always shows what state says
              onChange={... setSearch}  → typing writes the new text back to state
            React state is the single source of truth; the DOM just displays it.
            Supply `value` without `onChange` and the box appears frozen — you type
            and nothing happens, because state never changes and React redraws the
            old value. That is the classic controlled-input bug. */}
        <input
          type="search"
          value={search}
          placeholder="Search client or practice area…"
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Checkboxes use `checked` rather than `value`, and read e.target.checked —
            the same distinction as Week 4 Day 3's .value vs .checked. */}
        <label>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />{" "}
          Active only
        </label>
      </div>

      <div className="board">
        {shown.map((matter) => (
          <MatterCard key={matter.id} matter={matter} />
        ))}
      </div>

      {/* CONDITIONAL RENDERING with &&: if the left side is true, render the right
          side; if false, render nothing.
          Careful: use a real boolean. `shown.length && <p/>` would print a bare 0
          on screen when the list is empty, because 0 is falsy but still renderable.
          `=== 0` makes it an honest true/false. */}
      {shown.length === 0 && <p className="empty">No matters match that search.</p>}
    </div>
  );
}

// 👉 Compare with Week 4 Day 3. There, every event handler ended by calling render().
//    Here, no handler mentions the DOM at all — they only update state, and React
//    re-runs App() for you. That swap is the whole reason React exists.

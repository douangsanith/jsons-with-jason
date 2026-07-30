import { useState } from "react";
import type { Matter } from "./types";
import { MatterCard } from "./components/MatterCard";
import mattersData from "./data/matters.json";

// The imported JSON is our data source (Week 5 will swap this for a live API call).
const matters = mattersData as Matter[];

export default function App() {
  // useState = a value the component remembers between renders. When it changes,
  // React re-renders the UI. Here it tracks whether we're filtering to active matters.
  const [activeOnly, setActiveOnly] = useState(false);

  const shown = activeOnly ? matters.filter((m) => m.active) : matters;

  return (
    <div className="wrap">
      <header>
        <h1>Matter Intelligence</h1>
        <p className="subtitle">{shown.length} matters shown.</p>
      </header>

      {/* onClick wires the button to a state update — React re-renders automatically. */}
      <button onClick={() => setActiveOnly((v) => !v)}>
        {activeOnly ? "Show all" : "Show active only"}
      </button>

      {/* .map() turns each matter into a <MatterCard/> — the same map from Day 1, now building UI. */}
      <div className="board">
        {shown.map((matter) => (
          <MatterCard key={matter.id} matter={matter} />
        ))}
      </div>
    </div>
  );
}

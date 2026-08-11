import { useEffect, useState } from "react";
import type { Matter } from "./types";
import { MatterCard } from "./components/MatterCard";

export default function App() {
  // --- State: values the component remembers between renders. ---
  // Change any of these and React re-renders the UI for you.
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState("");

  // --- Effect: run this AFTER the first render, not during it. ---
  // The [] at the end means "only once", so we don't fetch on every keystroke.
  // matters.json is served from public/, so this works offline in dev and in the
  // production build alike.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/matters.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Matter[] = await response.json();
        if (!cancelled) setMatters(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // The cleanup function runs if the component goes away mid-request.
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived values — recomputed on every render from state. No extra state needed.
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
          {loading
            ? "Loading…"
            : `${shown.length} of ${matters.length} matters · ${total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })} billed`}
        </p>
      </header>

      {/* A controlled input: its value comes from state, and onChange writes back. */}
      <div className="controls">
        <input
          type="search"
          value={search}
          placeholder="Search client or practice area…"
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />{" "}
          Active only
        </label>
      </div>

      {error && <p className="error">Could not load matters: {error}</p>}

      {/* .map() turns each matter into a <MatterCard/> — Week 4's map, now building UI. */}
      <div className="board">
        {shown.map((matter) => (
          <MatterCard key={matter.id} matter={matter} />
        ))}
      </div>

      {!loading && !error && shown.length === 0 && (
        <p className="empty">No matters match that search.</p>
      )}
    </div>
  );
}

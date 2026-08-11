// ANNOTATED READING COPY — Week 5 · Day 4 (the finished app)
// This is matter-app/src/App.tsx exactly as it now stands, commented line by line.
// The live file is ../matter-app/src/App.tsx.

// useEffect joins useState. Both are "hooks" — functions React provides that let a
// component remember things and reach outside itself.
import { useEffect, useState } from "react";
import type { Matter } from "./types";
import { MatterCard } from "./components/MatterCard";

// Notice what's GONE from Day 2: the hard-coded `matters` array. Nothing in this
// file knows the data any more; it asks for it.

export default function App() {
  // --- State ---
  // useState<Matter[]>([]) — the <Matter[]> tells TypeScript what will live here.
  // It starts as an EMPTY array, not null, so the .filter calls below are always
  // safe to run, even on the very first render before any data exists.
  const [matters, setMatters] = useState<Matter[]>([]);
  // Three states every real fetch needs: loading, error, and the data itself.
  // Start `loading` as true — the request is already on its way by first paint.
  const [loading, setLoading] = useState(true);
  // `string | null` is a UNION type: either a message, or nothing wrong.
  const [error, setError] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState("");

  // --- Effect: talk to the outside world ---
  // Rendering must be pure — a component works out its markup and nothing else.
  // Fetching is a SIDE EFFECT, so it goes in useEffect, which React runs AFTER
  // the render is on screen.
  useEffect(() => {
    // A flag for the cleanup below. See the return at the bottom of the effect.
    let cancelled = false;

    // The effect callback itself cannot be `async` (React expects it to return
    // either nothing or a cleanup function, not a promise), so we declare an async
    // function inside and call it. This is the standard pattern.
    async function load() {
      try {
        // fetch() sends an HTTP GET and returns a promise for the RESPONSE —
        // status and headers, not yet the body. Week 4 Day 4's await, on a real
        // request this time.
        const response = await fetch("/matters.json");
        // fetch does NOT throw on 404 or 500 — it only rejects if the request
        // couldn't be made at all. You must check .ok (true for status 200–299)
        // yourself. Skipping this line is the most common fetch bug there is.
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // .json() parses the response body text into real JavaScript values —
        // and it's a second await, because the body may still be arriving.
        const data: Matter[] = await response.json();
        if (!cancelled) setMatters(data);
      } catch (err) {
        // `err` is typed `unknown` in TypeScript, so narrow it before using it.
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        // Runs on success AND failure — so the spinner always stops.
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // The CLEANUP function. React runs it if the component is removed before the
    // request finishes. Setting state on a component that's gone does nothing
    // useful, so the flag tells the handlers above to stay quiet.
    return () => {
      cancelled = true;
    };
    // The DEPENDENCY ARRAY. [] = "depends on nothing", so run once after the first
    // render and never again. Omit it entirely and the effect runs after EVERY
    // render — which sets state, which triggers a render, which runs the effect…
    // an infinite loop. This is the single most important bracket pair in React.
  }, []);

  // --- Derived values (unchanged from Day 2) ---
  const term = search.trim().toLowerCase();
  const shown = matters
    .filter((m) => (activeOnly ? m.active : true))
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  const total = shown.reduce((sum, m) => sum + m.billed, 0);

  return (
    <div className="wrap">
      <header>
        <h1>Matter Intelligence</h1>
        {/* While loading there is no count to show, so say so instead. */}
        <p className="subtitle">
          {loading
            ? "Loading…"
            : `${shown.length} of ${matters.length} matters · ${total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })} billed`}
        </p>
      </header>

      {/* The controls are exactly Day 2's — fetching changed nothing about them. */}
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

      {/* `error &&` renders nothing while error is null — Day 2's conditional. */}
      {error && <p className="error">Could not load matters: {error}</p>}

      {/* On the first render `matters` is [], so this maps over nothing and the
          board is simply empty. No crash, no special case needed — that's why the
          initial state was [] rather than null. */}
      <div className="board">
        {shown.map((matter) => (
          <MatterCard key={matter.id} matter={matter} />
        ))}
      </div>

      {/* "Nothing to show" only means something once we've finished and succeeded. */}
      {!loading && !error && shown.length === 0 && (
        <p className="empty">No matters match that search.</p>
      )}
    </div>
  );
}

// 👉 This component now works exactly the same whether /matters.json is a static
//    file, a FastAPI endpoint, or a query against the Snowflake matters table from
//    Weeks 6–7. Swap the URL; nothing else changes. That's the point of the
//    request/response contract.

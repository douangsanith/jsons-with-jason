# Course foundations — for the Legal Innovation Team

These weeks build the fundamentals the team needs before we wire matters into Claude: **Python**
(Weeks 1–2), the **web track** (Weeks 3–5: HTML/CSS → JavaScript → React), then **SQL + Snowflake**
(Weeks 6–7). Every lesson ends with a small working artifact. Concepts are taught on relatable everyday data
(a coffee shop's orders) and then tied back to **legal-domain data** (matters, clients, billings) — the
*Matter Intelligence* capstone we're building toward.

## ⭐ Course structure — continuous weeks (not by topic)

The whole course runs as **one continuous sequence of weeks — Week 1, Week 2, Week 3, …** The week
count **never restarts when the topic changes.** A new subject (SQL, Claude, FastAPI…) picks up at the
**current course week**, not a fresh "Week 1" — so, for example, there is **no "SQL Week 1"; SQL just
begins at whatever week we've reached.** Weeks 1–2 are Python, Weeks 3–5 are the web track, Weeks 6–7 are
SQL + Snowflake — all under `course/`, one folder per week.

## Teaching cadence

Sessions run **Mon · Tue · Thu · Fri**, ~**30 minutes** each — **4 sessions per week**. Each notebook is
sized to fit a single 30-minute session with a live "Your turn" exercise. Notebooks are named
`W{week}D{day}_{topic}.ipynb` (day: Mon=1, Tue=2, Thu=3, Fri=4), where **`week` is the global course
week**.

## How it's organized

**Week-first layout under `Training/course/`** — each week folder holds that week's sessions regardless
of topic. All notebooks read `../../data/…`, a relative path shared by every week.

```
Training/course/
  README.md          ← this file
  week1/   ← W1D1..W1D4   (Python foundations → NumPy)
    W1D1_variables-and-data-types.ipynb
    W1D2_lists-dicts-loops.ipynb
    W1D3_functions.ipynb
    W1D4_numpy-intro.ipynb
  week2/   ← W2D1..W2D4   (pandas deep-dive → Polars)
    W2D1_pandas-fundamentals.ipynb
    W2D2_data-cleaning.ipynb
    W2D3_groupby-and-joins.ipynb
    W2D4_pandas-to-polars.ipynb
  week3/   ← HTML & CSS — real files you open in a browser (not notebooks)
    01-html-structure/        (README.md + matter-intelligence.html)
    02-css-basics/            (README.md + index.html + styles.css)
    03-flexbox-and-grid/      (README.md + index.html + styles.css)
    04-anatomy-of-an-artifact/(README.md + matter-intelligence.html)
  week4/   ← JavaScript fundamentals — real files you run with node or a browser
    01-values-and-functions/  (README.md + matters.js + matters.ts)
    02-arrays-and-objects/    (README.md + matters-report.js + matters-report.ts)
    03-dom-and-events/        (README.md + dashboard.html/.js + events.html)
    04-modules-and-async/     (README.md + main/matters-data/format as .js AND .ts + types.ts)
  week5/   ← React + Vite + TypeScript — four lessons over one runnable project
    01-react-and-jsx/         (README.md + annotated .tsx reading copies)
    02-state-and-events/      (README.md + annotated .tsx reading copies)
    03-typescript-and-vite/   (README.md + annotated .ts reading copy)
    04-data-over-http/        (README.md + annotated .tsx reading copy)
    matter-app/               (Vite + React + TypeScript project; all four days)
  week6/   ← W6D1..W6D4   (SQL, run the Snowflake way)
    W6D1_sql-select-the-snowflake-way.ipynb
    W6D2_group-by-and-aggregates.ipynb
    W6D3_joins.ipynb
    W6D4_sql-and-python-together.ipynb
  week7/   ← W7D1..W7D4   (Snowflake basics → Cortex)
    W7D1_snowflake-building-blocks.ipynb
    W7D2_loading-data-copy-into.ipynb
    W7D3_window-functions-and-qualify.ipynb
    W7D4_cortex-llm-in-snowflake.ipynb
  week8/   ← W8D1..       (dbt — transformation layer)                   [planned]
```

> **Sequencing note (updated 2026-08-10).** The web track (**HTML/CSS → JavaScript → React**) sits *ahead* of
> SQL/Snowflake so the team can read and productionize the **HTML/JSX/TSX** that Claude produces. Order:
> **W3 HTML/CSS → W4 JavaScript → W5 React → W6 SQL → W7 Snowflake**. JavaScript and React were originally
> compressed into a single Week 4 (one day of JS, three of React); each now has a **full week**, because that
> pace was unworkable for a team new to code. The standalone **JSON/HTTP bridge week was folded into W5 Day 4**,
> where a built UI actually needs to talk to real data — the hinge between the frontend (W3–5) and the
> data/backend half (W6–7, and FastAPI later). SQL/Snowflake stay at **Weeks 6–7**; nothing was renumbered.
> Week counter stays continuous.

Sample data lives in `../data/` — synthetic only, never real client data. Two families:
`matters.csv` (the legal capstone data) and the coffee-shop set used to *teach* from Week 1 Day 4 on
(`coffee_orders.csv`, `coffee_orders_raw.csv`, `menu.csv`, `stores.csv`).

## Week 1 — Python foundations

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | Variables & data types | variables, `str`/`int`/`float`/`bool`, f-strings | a matter summary line |
| **Tue** | Lists, dicts & loops | lists, dictionaries, `for`, `if/elif/else` | a docket triage report |
| **Thu** | Functions | `def`, parameters, `return`, defaults | a reusable matter-helpers module |
| **Fri** | Intro to NumPy | arrays, vectorization, boolean masks, aggregations, axis/broadcasting | a coffee-sales stats report |

**Design notes for the instructor**
- Each notebook follows the course's Standard Lesson Format (title → objectives → why → setup →
  concept/demo → your turn → build artifact → recap → check → next → glossary).
- **Core Path** works for complete non-coders; **`Go Deeper 🔧`** callouts stretch the technical folks.
- Everything runs **offline with no API key** — these are pure Python/NumPy/pandas/Polars lessons.
- **NumPy first (Day 4):** arrays and vectorization are the machinery every DataFrame is built on,
  so Week 1 now ends with NumPy — "pandas is NumPy arrays with labels" is the bridge into Week 2.

### 📊 Teaching pedagogy — relatable examples, legal application
- From **W1D4 onward**, concepts are **taught on a relatable coffee-shop-orders dataset**
  (`coffee_orders.csv`), then a short **`🔗 Your world`** cell in each notebook maps the exact same
  move back to `matters.csv` (order price → `amount_billed`, item category → `practice_area`,
  group-by-category → billing-by-practice-area). This keeps the *Matter Intelligence* capstone and
  the SQL-twin priming intact while making the examples click for every participant.
- **W1D1–D3 remain legal-themed** for now (pending a later reframing pass).
- The **SQL-twin framing** (select/filter/sort/group = `SELECT`/`WHERE`/`ORDER BY`/`GROUP BY`) now
  lives in **W2D1**, so the upcoming **SQL** track still feels familiar.

## Week 2 — pandas deep-dive → Polars

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | Pandas fundamentals | DataFrames, read CSV, select/filter/sort/`groupby` (→ SQL twins) | a sales-summary-by-category report |
| **Tue** | Cleaning & transforming | dtypes/`to_numeric`, missing data, `.str` text cleanup, duplicates, derived columns | a cleaned coffee-orders table |
| **Thu** | Grouping, aggregation & joins | named `.agg`, multi-key groupby, `pivot_table`, `merge` (inner/left/right/outer) | a profit-margin-by-store report |
| **Fri** | From pandas to Polars | Polars expression API, lazy vs eager, when to use which | the Day 1 sales report rebuilt in Polars (eager + lazy) |

*Week 2 is a full pandas deep-dive taught on the coffee dataset, capped by Polars. Days 1–3 build the
pandas toolkit (select/filter/group, cleaning, join-then-group); Day 4 swaps the engine. The honest
"is Polars more powerful than pandas?" comparison is built into the finale: yes on speed/scale (Rust +
Arrow + multithreading + lazy execution), but pandas still wins on ecosystem maturity and is the right
place to learn the concepts.*

## Week 3 — HTML & CSS: reading Claude's markup

**Real files you open in a browser** ([`week3/`](week3/)), taught **reading-first** — start from an actual
Claude HTML artifact and learn the language by understanding and modifying it. Each lesson is a folder with a
`README.md` and the `.html`/`.css` files.

| Day | Folder | Concepts | Ships |
|---|---|---|---|
| **Mon** | `01-html-structure/` | elements, attributes, semantic tags, the DOM tree | read/modify a Claude HTML artifact |
| **Tue** | `02-css-basics/` | selectors, the box model, an external stylesheet | restyle it via `styles.css` |
| **Thu** | `03-flexbox-and-grid/` | flex/grid, responsive layout | a responsive card dashboard |
| **Fri** | `04-anatomy-of-an-artifact/` | inline CSS/JS, `<script>`, data URIs — what's safe to change | a self-contained artifact + edit playbook |

## Week 4 — JavaScript fundamentals

**Real files you run with `node` or a browser** ([`week4/`](week4/)). The third language of the web: HTML is
structure, CSS is look, **JavaScript is behavior**. Taught in four steps, each one a prerequisite for React.

| Day | Folder | Concepts | Ships |
|---|---|---|---|
| **Mon** | `01-values-and-functions/` | `const`/`let` (and why not `var`), data types, template literals, objects, functions, arrow functions, ternaries | `node matters.js` — a matter summary line |
| **Tue** | `02-arrays-and-objects/` | arrays of objects, `filter`/`map`/`reduce`, `sort`, chaining, group-by via `reduce`, `for...of`/`while` | `node matters-report.js` — a billing report |
| **Thu** | `03-dom-and-events/` | the DOM, `getElementById`, `addEventListener`, the `render()` pattern | an **interactive** matters dashboard (vanilla JS) |
| **Fri** | `04-modules-and-async/` | `import`/`export`, destructuring, spread, `?.`/`??`, Promises, `async`/`await`, `try`/`catch` | a modular script fed by a fake async API |

*(Day 3 is the payoff: Week 3's static card grid becomes a live dashboard that filters as you type. Day 4 is
deliberately "the JavaScript React is written in" — every construct reappears on Week 5 Day 1.)*

**TypeScript is introduced here, not in Week 5.** Days 1, 2 and 4 each ship a `.ts` twin of the day's script —
the same program with annotations, a shared `types.ts`, and `Promise<Matter[]>`. They run with plain
`node matters.ts` on **Node 22.18+** (Node strips types and runs; it does not check them — the editor does that,
and Week 5's `npm run build` enforces it). Day 3 is deliberately excluded: typing raw DOM lookups needs a cast on
every `getElementById`, which is noise when the subject is events. The payoff is that Week 5 Day 3 can teach
typed **props** and the build gate instead of re-explaining what a type is.

## Week 5 — React + Vite + TypeScript

**Four lessons over one runnable Vite project** ([`week5/`](week5/)). Where the team stops reading code and starts
shipping it: `.html`/`.jsx` output becomes a typed, buildable, deployable `.tsx` application.

| Day | Folder | Concepts | Ships |
|---|---|---|---|
| **Mon** | `01-react-and-jsx/` | components, JSX, `className`, props, `key`, `map` → UI | the app running under `npm run dev` |
| **Tue** | `02-state-and-events/` | `useState`, `onChange`/`onClick`, controlled inputs, derived vs. state, conditional rendering | a searchable, filterable dashboard |
| **Thu** | `03-typescript-and-vite/` | typed props, what Vite does, breaking the build on purpose *(types themselves were taught in W4)* | a type-safe project |
| **Fri** | `04-data-over-http/` | JSON, request/response & status codes, `useEffect` + `fetch`, loading/error states, pagination with `while`, `npm run build` + `preview` | the app fed by a real HTTP request |

*(All four days build up **one** project, `matter-app/`. Each day folder holds the lesson plus **annotated
reading copies** of the files at that day's complexity; the committed project is in its finished Friday state.
The planned standalone JSON/HTTP bridge week is folded into **Day 4**, where the UI actually needs it.)*

**Design notes for the web weeks (3–5)**
- **Real files, not notebooks.** The web track is `.html`/`.css`/`.js`/`.tsx` files + a `README.md` lesson per
  topic — you open pages in a browser and run the project with npm/Vite, exactly as you would in production.
- **Reading-first, artifact-driven.** Every lesson starts from a real Claude artifact — the goal is to
  *understand and productionize the code Claude writes*, so the team can take an artifact to prod.
- **Clean + annotated twins.** Every code file ships as `name.ext` (build with it) and `name.annotated.ext`
  (learn from it — a plain-English comment on nearly every line). Both produce identical output.
- **Mostly zero-setup; one `npm install`.** Week 3 needs only a browser. Week 4 needs Node (and `python3 -m
  http.server` for Day 4's ES modules). Week 5 needs Node + a one-time `npm install` in `matter-app/` — the one
  internet-connected step in the course. The committed Vite project is verified to build (`npm run build`).
- **Even the `fetch` runs offline.** `matter-app/public/matters.json` is served at `/matters.json` by Vite in
  both dev and the production build, so Week 5 Day 4 teaches a genuine HTTP request with no backend and no
  internet — and the same component works unchanged against FastAPI or Snowflake later.
- **Legal tie-in.** The UI surfaces `matters` / *Matter Intelligence* data, keeping the capstone through-line.

## Week 6 — SQL, run the Snowflake way

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | SQL & the warehouse | `SELECT`/`WHERE`/`ORDER BY`/`LIMIT`; the `run_sql` connection pattern | first queries on `coffee_orders` |
| **Tue** | Aggregations | `COUNT`/`SUM`/`AVG`, `GROUP BY`, `HAVING`, `AS`/`ROUND` | a revenue-by-category report in SQL |
| **Thu** | Joins | `INNER`/`LEFT JOIN ... ON`, table aliases, join-then-`GROUP BY` | a profit-by-store report |
| **Fri** | SQL **and** Python | query → DataFrame → matplotlib chart → Claude-ready briefing; injection & CTAS | a query→chart→LLM mini-pipeline |

## Week 7 — Snowflake basics → Cortex

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | Building blocks | account→warehouse→database→schema→table, `CREATE TABLE`, `INSERT`, types, CTAS | your own `matters` table |
| **Tue** | Loading data | stages, `COPY INTO`, file formats, `ON_ERROR`, reconciliation | a table loaded from a CSV file |
| **Thu** | Analytical SQL | CTEs, `CASE`, window functions, `QUALIFY` (top-N per group), running totals | a best-seller-per-store report |
| **Fri** | Cortex (LLM in-warehouse) | `SUMMARIZE`/`CLASSIFY_TEXT` in SQL; Cortex vs. Claude API; responsible AI | the `matter_intelligence` table |

**Design notes for the SQL/Snowflake weeks**
- **Real Snowflake SQL, runs offline.** A single `run_sql(...)` helper talks to **Snowflake** when
  `SNOWFLAKE_*` credentials are in `.env`, else to a local **DuckDB** engine whose dialect is very close
  to Snowflake's (window functions, `QUALIFY`, CTAS all work). Learners write real warehouse SQL with no
  account. `duckdb` (and `matplotlib` for W6D4) install automatically if missing.
- **Cortex is mock-first**, exactly like the Claude lessons: W7D4 registers local stand-ins for
  `SUMMARIZE`/`CLASSIFY_TEXT`, so the identical SQL runs offline and swaps to real Cortex when credentials appear.
- **Same coffee→matters pedagogy** as Weeks 1–2: each verb is taught on `coffee_orders`, then a
  `🔗 Your world` cell maps it to `matters`.

## What comes next (continuing the week count)

- **Week 8 · dbt** *(planned)* — turn Weeks 6–7's loose `CREATE TABLE AS SELECT` statements into a
  **versioned, tested, documented** dbt project with lineage, using the offline `dbt-duckdb` adapter —
  rebuilding `matter_intelligence` the disciplined way. Taught *after* SQL/Snowflake on purpose: dbt wraps
  SQL + a warehouse, so it only clicks once the `JOIN`/`GROUP BY`/CTAS underneath are second nature.
- **NumPy, Part 2 — vectors & embeddings** (`../notebooks/L00_numpy-for-embeddings.ipynb`) — reshape/stack,
  NaN-aware stats, `np.random`, sorting, linear algebra → **cosine similarity**. The on-ramp to embedding
  search, taught right before the Claude work.
- **Building with Claude** — feed a filtered DataFrame (or a Cortex-enriched table) of matters into an LLM
  to summarize/classify (the *Matter Intelligence* capstone).

## Running the notebooks

From the `Training/` folder:

```bash
pip install -r requirements.txt
jupyter lab            # or: jupyter notebook
```

Open `course/week1/W1D1_variables-and-data-types.ipynb` and run the cells top to bottom.
No key or internet required. (SQL weeks: open `course/week6/W6D1_sql-select-the-snowflake-way.ipynb`.)

# Course foundations — Weeks 1–4 — for the Legal Innovation Team

These weeks build the **data-focused fundamentals** the team needs before we wire matters into
Claude: **Python** (Weeks 1–2), then **SQL + Snowflake** (Weeks 3–4). Every lesson ends with a small
working artifact. Concepts are taught on relatable everyday data (a coffee shop's orders) and then tied
back to **legal-domain data** (matters, clients, billings) — the *Matter Intelligence* capstone we're
building toward.

## ⭐ Course structure — continuous weeks (not by topic)

The whole course runs as **one continuous sequence of weeks — Week 1, Week 2, Week 3, …** The week
count **never restarts when the topic changes.** A new subject (SQL, Claude, FastAPI…) picks up at the
**current course week**, not a fresh "Week 1" — so, for example, there is **no "SQL Week 1"; SQL just
begins at whatever week we've reached.** Weeks 1–2 are Python, Weeks 3–4 are SQL + Snowflake — all under
`course/`, one folder per week.

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
  week3/   ← W3D1..W3D4   (HTML & CSS — reading Claude's markup)         [planned]
  week4/   ← W4D1..W4D4   (JavaScript & React → Vite + TypeScript)       [planned]
  week5/   ← W5D1..W5D4   (bridge: JSON, HTTP & wiring a UI to data)     [planned]
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

> **Sequencing note (updated 2026-07-30).** The web track (**HTML/CSS → JavaScript/React**) was moved
> *ahead* of SQL/Snowflake so the team can read and productionize the **HTML/JSX/TSX** that Claude
> produces. Order: **W3 HTML/CSS → W4 JS/React → W5 JSON/HTTP bridge → W6 SQL → W7 Snowflake**. The
> JSON/HTTP bridge sits at **Week 5**, right where a built UI needs to talk to real data — the hinge
> between the frontend (W3–4) and the data/backend half (W6–7, and FastAPI later). SQL/Snowflake shifted
> from Weeks 3–4 to **Weeks 6–7**. Week counter stays continuous.

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

## Week 3 — HTML & CSS: reading Claude's markup  *(planned)*

Taught **reading-first** — start from an actual Claude HTML artifact and learn the language by understanding
and modifying it, not by building from a blank page.

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | HTML structure | elements, attributes, semantic tags, the DOM tree | read a Claude HTML artifact |
| **Tue** | CSS basics | selectors, the box model, color & spacing | restyle that artifact |
| **Thu** | Layout — flexbox & grid | flex/grid, responsive basics | a responsive card layout |
| **Fri** | Anatomy of a Claude artifact | inline CSS/JS, `<script>`, data URIs — what's safe to change | a modified, shipped artifact |

## Week 4 — JavaScript & React → Vite + TypeScript  *(planned)*

From "make a page interactive" to **porting a Claude artifact into a real, buildable project** — the path
from `.html`/`.jsx` output to production `.tsx`.

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | JavaScript essentials | variables, functions, arrays/objects, DOM events | make a page interactive |
| **Tue** | React & JSX | components, `props`, `useState`; reading Claude's JSX | a small component from an artifact |
| **Thu** | Artifact → project (Vite + TS) | `npm create vite`, `.tsx`, typing props/state | the artifact ported into a real project |
| **Fri** | Render data + build | render `matters` from a **local JSON object**, `npm run build` + preview | a production build of the tool |

*(Real network calls are deferred to Week 5 — here the component renders a hardcoded/imported JSON object,
the standard React teaching order: props/state on static data first, fetching later.)*

## Week 5 — Bridge: JSON, HTTP & wiring a UI to data  *(planned)*

The hinge between the two halves: your UI can render data (W3–4) and soon you'll query a warehouse (W6–7) —
**JSON over HTTP is how they talk.** Also the on-ramp to the FastAPI backend later.

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | JSON — the lingua franca | `dict` ↔ JSON, the `json` module, nested data | a matter record as JSON |
| **Tue** | HTTP & the request/response model | URLs, methods, status codes, headers | the anatomy of a request |
| **Thu** | `fetch` from an API | JS `fetch`, `httpx` in Python, query params, parsing JSON (mock offline) | a UI that pulls live JSON |
| **Fri** | End-to-end: UI ↔ data | serialize a DataFrame → JSON → render it in the Week-4 component | the tool wired to real data |

**Design notes for the web weeks (3–5)**
- **Reading-first, artifact-driven.** Every lesson starts from a real Claude artifact (HTML/JSX/TSX) — the
  goal is to *understand and productionize the code Claude writes*, so the team can take an artifact to prod.
- **Runs in a browser, no key.** HTML/CSS/JS lessons render inline (`IPython.display.HTML`) or as a
  standalone `.html` file you open — no build step, no credentials.
- **Vite + TypeScript for production.** Week 4 graduates to a real `npm` / Vite / TS project. Those build
  lessons are the one place we step outside the notebook and **need Node.js installed** (called out in-lesson).
- **JSON/HTTP is the bridge, not a prerequisite.** Week 4 renders static/local JSON; Week 5 adds real
  `fetch`/HTTP and connects the UI to data — which sets up SQL/Snowflake (W6–7) and FastAPI.
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

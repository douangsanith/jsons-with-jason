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
  week3/   ← W3D1..W3D4   (SQL, run the Snowflake way)
    W3D1_sql-select-the-snowflake-way.ipynb
    W3D2_group-by-and-aggregates.ipynb
    W3D3_joins.ipynb
    W3D4_sql-and-python-together.ipynb
  week4/   ← W4D1..W4D4   (Snowflake basics → Cortex)
    W4D1_snowflake-building-blocks.ipynb
    W4D2_loading-data-copy-into.ipynb
    W4D3_window-functions-and-qualify.ipynb
    W4D4_cortex-llm-in-snowflake.ipynb
```

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

## Week 3 — SQL, run the Snowflake way

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | SQL & the warehouse | `SELECT`/`WHERE`/`ORDER BY`/`LIMIT`; the `run_sql` connection pattern | first queries on `coffee_orders` |
| **Tue** | Aggregations | `COUNT`/`SUM`/`AVG`, `GROUP BY`, `HAVING`, `AS`/`ROUND` | a revenue-by-category report in SQL |
| **Thu** | Joins | `INNER`/`LEFT JOIN ... ON`, table aliases, join-then-`GROUP BY` | a profit-by-store report |
| **Fri** | SQL **and** Python | query → DataFrame → matplotlib chart → Claude-ready briefing; injection & CTAS | a query→chart→LLM mini-pipeline |

## Week 4 — Snowflake basics → Cortex

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
  account. `duckdb` (and `matplotlib` for W3D4) install automatically if missing.
- **Cortex is mock-first**, exactly like the Claude lessons: W4D4 registers local stand-ins for
  `SUMMARIZE`/`CLASSIFY_TEXT`, so the identical SQL runs offline and swaps to real Cortex when credentials appear.
- **Same coffee→matters pedagogy** as Weeks 1–2: each verb is taught on `coffee_orders`, then a
  `🔗 Your world` cell maps it to `matters`.

## What comes next (continuing the week count)

- **Week 5 · dbt** — turn Weeks 3–4's loose `CREATE TABLE AS SELECT` statements into a **versioned,
  tested, documented** dbt project with lineage, using the offline `dbt-duckdb` adapter — rebuilding
  `matter_intelligence` the disciplined way. Taught *after* SQL/Snowflake on purpose: dbt wraps SQL + a
  warehouse, so it only clicks once the `JOIN`/`GROUP BY`/CTAS underneath are second nature.
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
No key or internet required. (SQL weeks: open `course/week3/W3D1_sql-select-the-snowflake-way.ipynb`.)

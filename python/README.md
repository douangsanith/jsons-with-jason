# Foundations — Weeks 1–2 (Python) — for the Legal Innovation Team

These weeks build the **data-focused fundamentals** the team needs before we wire matters into
Claude and Snowflake. Every lesson ends with a small working artifact. Concepts are taught on
relatable everyday data (a coffee shop's orders) and then tied back to **legal-domain data**
(matters, clients, billings) — the *Matter Intelligence* capstone we're building toward.

## ⭐ Course structure — continuous weeks (not by topic)

The whole course runs as **one continuous sequence of weeks — Week 1, Week 2, Week 3, …** The week
count **never restarts when the topic changes.** A new subject (SQL, Claude, FastAPI…) picks up at the
**current course week**, not a fresh "Week 1" — so, for example, there is **no "SQL Week 1"; SQL just
begins at whatever week we've reached.** Weeks 1–2 happen to be Python; that's why this file lives in
`python/` today.

## Teaching cadence

Sessions run **Mon · Tue · Thu · Fri**, ~**30 minutes** each — **4 sessions per week**. Each notebook is
sized to fit a single 30-minute session with a live "Your turn" exercise. Notebooks are named
`W{week}D{day}_{topic}.ipynb` (day: Mon=1, Tue=2, Thu=3, Fri=4), where **`week` is the global course
week**.

## How it's organized

**Target layout (week-first):** the course is moving to week folders under `Training/course/`, so each
week folder holds that week's sessions regardless of topic:

```
Training/course/
  week1/   ← W1D1..W1D4  (Python foundations)
  week2/   ← W2D1 pandas→polars, ...  (SQL may begin here or a later week)
  week3/   ← ...   the counter never restarts
```

**Current location (pending move):** the notebooks presently sit here under `python/week1/` and
`python/week2/`. They'll move to `course/week1/` and `course/week2/` on request — the notebooks read
`../../data/matters.csv`, a relative path that keeps working after the move.

```
python/
  README.md          ← this file
  week1/
    W1D1_variables-and-data-types.ipynb
    W1D2_lists-dicts-loops.ipynb
    W1D3_functions.ipynb
    W1D4_numpy-intro.ipynb
  week2/
    W2D1_pandas-fundamentals.ipynb
    W2D2_data-cleaning.ipynb
    W2D3_groupby-and-joins.ipynb
    W2D4_pandas-to-polars.ipynb
```

Sample data lives in `../data/` — synthetic only, never real client data. Two families:
`matters.csv` (the legal capstone data) and the coffee-shop set used to *teach* Weeks 1D4–2
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

## What comes next (continuing the week count)

- **SQL for Snowflake** — the same four verbs the pandas/Polars lessons preview, written as real SQL
  against a matters table (with a local SQLite fallback so notebooks run offline). A first-class part of
  the course because SQL is required for Snowflake. It slots into **whatever course week it's taught**
  (likely Week 2/3) — **not** a separate "SQL Week 1."
- **Building with Claude** — feed a filtered DataFrame of matters into an LLM to summarize/classify
  (the *Matter Intelligence* capstone).

## Running the notebooks

From the `Training/` folder:

```bash
pip install -r requirements.txt
jupyter lab            # or: jupyter notebook
```

Open `python/week1/W1D1_variables-and-data-types.ipynb` and run the cells top to bottom.
No key or internet required.

# Foundations — Weeks 1–2 (Python) — for the Legal Innovation Team

These weeks build the **data-focused fundamentals** the team needs before we wire matters into
Claude and Snowflake. Every lesson ends with a small working artifact built on **legal-domain data**
(matters, clients, billings).

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
    W1D4_pandas-intro.ipynb
  week2/
    W2D1_pandas-to-polars.ipynb
```

Sample data lives in `../data/` (e.g. `matters.csv`) — synthetic only, never real client data.

## Week 1 — Python foundations

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | Variables & data types | variables, `str`/`int`/`float`/`bool`, f-strings | a matter summary line |
| **Tue** | Lists, dicts & loops | lists, dictionaries, `for`, `if/elif/else` | a docket triage report |
| **Thu** | Functions | `def`, parameters, `return`, defaults | a reusable matter-helpers module |
| **Fri** | Intro to pandas | DataFrames, read CSV, select/filter/sort/`groupby` | a billing-summary-by-area report |

**Design notes for the instructor**
- Each notebook follows the course's Standard Lesson Format (title → objectives → why → setup →
  concept/demo → your turn → build artifact → recap → check → next → glossary).
- **Core Path** works for complete non-coders; **`Go Deeper 🔧`** callouts stretch the technical folks.
- Everything runs **offline with no API key** — these are pure Python/pandas lessons.
- Day 4 deliberately frames pandas' select / filter / sort / group as the twins of SQL's
  `SELECT` / `WHERE` / `ORDER BY` / `GROUP BY`, so the upcoming **SQL** track feels familiar.

## Week 2 — in progress

| Day | Session | Concepts | Ships |
|---|---|---|---|
| **Mon** | From pandas to Polars | Polars expression API, select/filter/sort/`group_by`, lazy vs eager, when to use which | the Week 1 billing report rebuilt in Polars (eager + lazy) |

*Polars is taught as a direct companion to the Week 1 pandas lesson — same `matters.csv`, same four operations, faster engine. The honest "is Polars more powerful than pandas?" comparison is built into the notebook: yes on speed/scale (Rust + Arrow + multithreading + lazy execution), but pandas still wins on ecosystem maturity and is the right place to learn the concepts.*

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

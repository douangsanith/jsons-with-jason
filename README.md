# Training — Legal Innovation Team: Building LLM-Powered Tools

A hands-on course that takes a legal team from zero to building real LLM-powered data solutions. Each lesson is a Jupyter notebook that **ships a working artifact**, and the artifacts add up to one capstone tool: **Matter Intelligence** (ingest legal docs → summarize/extract with Claude → store in Snowflake → serve via FastAPI → surface in a React UI).

## How this folder is organized

```
Training/
  Cowork_Instructor_Instructions.md   ← paste into Cowork to generate new lessons
  README.md                           ← this file (course map)
  requirements.txt                    ← Python dependencies (grows over time)
  .env.example                        ← copy to .env and add your keys
  course/                             ← the course, organized WEEK-FIRST (continuous weeks, any topic)
    week1/                            ← Week 1 sessions (Python foundations, ending in NumPy)
    week2/                            ← Week 2 sessions (pandas deep-dive → Polars)
    week3/                            ← Week 3 sessions (HTML & CSS — reading Claude's markup)
    week4/                            ← Week 4 sessions (JavaScript & React → Vite + TypeScript) [planned]
    week5/                            ← Week 5 sessions (bridge: JSON, HTTP & wiring a UI to data) [planned]
    week6/                            ← Week 6 sessions (SQL, run the Snowflake way: SELECT → GROUP BY → JOIN → SQL+Python)
    week7/                            ← Week 7 sessions (Snowflake basics: build/load tables → window functions → Cortex)
    …                                 ← the week counter never restarts (dbt begins Week 8)
  data/                               ← synthetic sample data (legal matters + a coffee-shop teaching set; no real client data)
  notebooks/                          ← LLM-track lessons: L00 (NumPy for embeddings) → L01 (first Claude call) → ...
```

## How the course is structured — continuous weeks

The course runs as **one continuous sequence of weeks — Week 1, Week 2, Week 3, …** across the *entire*
course. **The week count never restarts when the topic changes.** A new subject (SQL, Claude, FastAPI…)
begins at **whatever week we're currently on**, not a fresh "Week 1" — so there's no separate "SQL Week 1,"
it's just the current course week. Each week folder under `course/` holds that week's sessions **regardless
of topic**.

Sessions run in short **~30-minute blocks, Mon · Tue · Thu · Fri** (4 per week). Notebooks are named
`W{week}D{day}_{topic}.ipynb` (day: Mon=1, Tue=2, Thu=3, Fri=4).

> *Note:* all weeks live under `course/` (`course/week1/` … `course/week7/`) — every week sits in one place.
> **Built so far:** Weeks 1–3 (Python, then HTML/CSS) and Weeks 6–7 (SQL/Snowflake). Weeks 4–5 (JS/React
> + JSON/HTTP) and Week 8 (dbt) are planned. See `course/README.md`.

## Getting started (once)

1. **Install Python 3.10+** and Jupyter. From this folder:
   ```bash
   pip install -r requirements.txt
   jupyter lab            # or: jupyter notebook
   ```
2. **(Optional) Add a Claude API key** for real output:
   ```bash
   cp .env.example .env
   # edit .env and paste your key after ANTHROPIC_API_KEY=
   ```
   Every lesson also runs in **MOCK mode** with no key and no internet, so you can start immediately.
3. **Open `notebooks/L01_first-llm-call.ipynb`** and run the cells top to bottom.

## How to generate the next lesson

Open Cowork with the *Training* project, make sure `Cowork_Instructor_Instructions.md` is set as the project instructions, and ask, for example:

> "Build Lesson 2: structured output — extract parties, dates, and governing law from an NDA as JSON."

Cowork will produce the next notebook in `notebooks/`, following the same format as Lesson 1.

## Ground rules

- **Synthetic data only** — never put real client or privileged data in a lesson.
- **Not legal advice** — these lessons teach technology; a lawyer reviews any AI output that will be relied on.
- **Keys in `.env`, never in code.**

## Course map (modules)

*(Modules are topic areas; they're taught across the continuous week calendar above — a module can span several weeks, and a week can touch more than one module.)*

- **M0 · Orientation** — what LLMs are, the toolkit, environment setup
- **M1 · Python foundations** — variables, lists/dicts, functions, NumPy, then pandas + Polars *(Course Weeks 1–2)*
- **M6 · Web UI** — HTML/CSS → JavaScript/React → **Vite + TypeScript**, taught *reading-first* from real Claude artifacts so the team can productionize the HTML/JSX/TSX Claude produces *(Course Weeks 3–4)*
- **M1c · Web-data bridge** — JSON, HTTP, and the request/response model; wiring a UI to real data *(Course Week 5)*
- **M1b · SQL foundations** — `SELECT / WHERE / ORDER BY / GROUP BY / JOIN`, taught *the Snowflake way* against a `coffee_orders`/`matters` table with a **DuckDB** offline fallback *(Course Week 6)*
- **M4 · Data & Snowflake** — build/load tables, window functions, and Cortex LLM functions (summarize/classify in-warehouse) *(Course Week 7; dbt intro in Week 8)*
- **M2 · Building with Claude** — the messages API, prompting, structured output, evaluation *(Lesson 1 is here; `L00_numpy-for-embeddings` is the NumPy→embeddings on-ramp that precedes it)*
- **M3 · Claude Code** — agentic coding to accelerate everything
- **M5 · Backend with FastAPI** — serve the tool as an API
- **M7 · Integration & capstone** — assemble Matter Intelligence end-to-end
- **M8 · Buy-vs-build & responsible AI** — Harvey, verification, privilege/PII, deployment

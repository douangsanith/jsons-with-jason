# Week 4 — JavaScript & React → Vite + TypeScript

The web track continues in **real files and a real project** — no notebooks. Goal: go from "I can read an
artifact" to **"I can build and ship one,"** so the team can productionize the JS/JSX/TSX Claude produces.

## Lessons

| Day | Where | Topic | You'll do |
|---|---|---|---|
| **Mon** | [`01-javascript/`](01-javascript/) | JavaScript essentials | `node matters.js`; open `events.html` |
| **Tue** | [`matter-app/`](matter-app/) | React & JSX (components, props, state) | read `MatterCard.tsx` / `App.tsx`, `npm run dev` |
| **Thu** | [`matter-app/`](matter-app/) | Vite + TypeScript | understand the tooling & `Matter` type |
| **Fri** | [`matter-app/`](matter-app/) | Render data + build | render from `matters.json`, `npm run build` |

Days 2–4 all live in **one project**, [`matter-app/`](matter-app/) — you build it up across the three days.
Its README is the lesson.

## What you need

- **Day 1** needs **Node.js** to run `matters.js` (`node matters.js`); `events.html` just needs a browser.
- **Days 2–4** need Node + **one `npm install`** in `matter-app/` (downloads React/Vite/TypeScript — the one
  internet-connected step in the course). Then everything runs locally.

Install Node from [nodejs.org](https://nodejs.org) if you don't have it (`node --version` to check).

## The through-line

Week 3 you **read** Claude's HTML/CSS. Week 4 you make it **behave** (JavaScript) and **compose** it (React
components), then take it to a **production build** (Vite + TypeScript). The recurring artifact is the same
**Matter Intelligence** dashboard — now a real, buildable app.

**Next (Week 5):** swap the local `matters.json` for a live **`fetch`** over HTTP — the bridge to the data
side of the course (SQL/Snowflake, Weeks 6–7).

> Synthetic data only. Not legal advice — a lawyer reviews any AI output that will be relied upon.

# `matter-app` — the Week 5 project

A real **Vite + React + TypeScript** app: the *Matter Intelligence* dashboard, built up across Week 5 Days 1–4.
This file is the **project reference** — the lessons themselves live one folder up:

| Day | Lesson |
|---|---|
| **Mon** | [`../01-react-and-jsx/`](../01-react-and-jsx/) — components, JSX, props, `map` |
| **Tue** | [`../02-state-and-events/`](../02-state-and-events/) — `useState`, controlled inputs |
| **Thu** | [`../03-typescript-and-vite/`](../03-typescript-and-vite/) — the `Matter` type, the build |
| **Fri** | [`../04-data-over-http/`](../04-data-over-http/) — `useEffect` + `fetch` |

## Commands

```bash
npm install       # one-time; downloads React, Vite, TypeScript (needs internet, ~1 min)
npm run dev       # dev server with hot reload → http://localhost:5173
npm run build     # tsc type-check, then bundle to dist/
npm run preview   # serve the built dist/ as a real host would
npm run lint      # oxlint
```

`npm run dev` is fast and **does not type-check**; `npm run build` is the one that tells you the truth. Run it
before calling anything finished.

> `node_modules/` and `dist/` are git-ignored — that's why you run `npm install` once after cloning.

## Structure

```
matter-app/
  index.html              ← the single HTML page; loads src/main.tsx
  package.json            ← dependencies + scripts
  vite.config.ts          ← Vite config (the React plugin)
  tsconfig*.json          ← TypeScript settings
  .oxlintrc.json          ← linter rules
  public/
    matters.json          ← the data — served at /matters.json, fetched by App.tsx
  src/
    main.tsx              ← entry point: mounts <App/> into index.html's #root
    App.tsx               ← the page: state, the fetch, the list of cards
    components/
      MatterCard.tsx      ← one card (props)
    types.ts              ← the Matter type — one shape everything agrees on
    index.css             ← styling (the Week 3 card + grid, now shared)
```

## Why `public/matters.json`

Vite serves everything in `public/` at the site root, in **both** `npm run dev` and the built `dist/`. So
`fetch("/matters.json")` in `App.tsx` is a genuine HTTP request against your own local server — which means Day
4's lesson works with **no internet and no backend**. Point that same `fetch` at a FastAPI endpoint later and
nothing else in the component changes.

> Synthetic data only. Not legal advice — a lawyer reviews any AI output that will be relied upon.

# Week 5 — React + Vite + TypeScript

The end of the web track, and the point where the team stops reading code and starts **shipping** it. Week 4 you
built a dashboard by hand. This week you rebuild it in **React**, add types, and end with a production build that
loads its data over **HTTP**.

Everything happens in one real project — [`matter-app/`](matter-app/) — which you grow across the four days.

## ▶️ Run it (do this first)

```bash
cd course/week5/matter-app
npm install       # one-time; downloads React, Vite, TypeScript (~1 min, needs internet)
npm run dev       # start the dev server → open the printed http://localhost:5173
```

Leave `npm run dev` running all week — every file you save appears in the browser instantly.

| Command | What it does |
|---|---|
| `npm run dev` | dev server with hot reload (fast; **does not type-check**) |
| `npm run build` | `tsc` type-check, then bundle to `dist/` — **the honest one** |
| `npm run preview` | serve the built `dist/` as a real host would |
| `npm run lint` | oxlint — catches sloppy patterns TypeScript won't |

> `node_modules/` and `dist/` are git-ignored, which is why you run `npm install` once after cloning.
> That install is **the only internet-connected step in the course.**

## Lessons

| Day | Folder | Topic | You'll build |
|---|---|---|---|
| **Mon** | [`01-react-and-jsx/`](01-react-and-jsx/) | components, JSX, `className`, props, `key`, `map` → UI | the app running on your machine |
| **Tue** | [`02-state-and-events/`](02-state-and-events/) | `useState`, `onChange`, controlled inputs, conditional rendering | a searchable, filterable dashboard |
| **Thu** | [`03-typescript-and-vite/`](03-typescript-and-vite/) | the `Matter` type, typed props, what Vite does, breaking the build | a type-safe project |
| **Fri** | [`04-data-over-http/`](04-data-over-http/) | JSON, request/response, `useEffect` + `fetch`, loading & error states | the app fed by a real HTTP request |

Each day folder holds that day's `README.md` (the lesson) plus **annotated reading copies** of the files it
teaches — the project at *that day's* level of complexity, with a comment on nearly every line. The live
[`matter-app/`](matter-app/) is committed in its **finished, Friday state**, so don't be surprised that Monday's
`App.tsx` already contains more than Monday's lesson covers. Read the annotated copy; edit the real project.

## 🗂️ Project structure

```
matter-app/
  index.html              ← one nearly-empty page with <div id="root">
  package.json            ← dependencies + the dev/build/preview/lint scripts
  vite.config.ts          ← Vite config (the React plugin)
  tsconfig*.json          ← TypeScript settings
  public/
    matters.json          ← the data, served over HTTP at /matters.json (Day 4)
  src/
    main.tsx              ← entry point: mounts <App/> into index.html
    App.tsx               ← the page: state, the fetch, the list of cards
    components/
      MatterCard.tsx      ← one card (props)
    types.ts              ← the Matter type — one shape everything agrees on
    index.css             ← styling (the Week 3 card + grid, unchanged)
```

## What you need

**Node.js** (`node --version`; install from [nodejs.org](https://nodejs.org)) and a browser. That's it — after
`npm install`, everything including Day 4's `fetch` runs **entirely offline**, because `public/matters.json` is
served by your own dev server.

## The through-line

Week 3 you **read** an artifact's HTML and CSS. Week 4 you made it **behave** — `map`, the DOM, events, modules,
`await`. This week React takes over the tedious half: you describe the UI for the current data, and it updates
the page itself. Then TypeScript makes the shape of that data explicit, and `fetch` makes it come from somewhere
else.

The recurring artifact is the same **Matter Intelligence** dashboard it has been since Week 3 Day 1 — now a
typed, buildable, deployable application.

> **The line the whole track has been building to:**
> ```tsx
> {matters.map((matter) => <MatterCard key={matter.id} matter={matter} />)}
> ```
> That's Week 4 Day 2's `map`, rendering components instead of strings.

**Next (Week 6):** [SQL, run the Snowflake way](../week6/) — the other end of Friday's HTTP request. You've built
the thing that *asks* for matters; now you learn where they live.

> Synthetic data only — never put real client or privileged data in a teaching file.
> Not legal advice — a lawyer reviews any AI output that will be relied upon.

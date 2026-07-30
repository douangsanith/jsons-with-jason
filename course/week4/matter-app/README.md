# Week 4 · Days 2–4 — React & TypeScript: the `matter-app` project

*One real project, built up over three days: read React components → understand the Vite + TypeScript setup
→ render data and build for production. This is the path from a Claude artifact to something you ship.*

This is a genuine **Vite + React + TypeScript** app (the same toolchain a Claude `.tsx` artifact targets). You
run it, edit it, and build it — no notebooks.

---

## ▶️ Run it (do this first)

```bash
cd course/week4/matter-app
npm install       # one-time; downloads React, Vite, TypeScript (needs internet, ~1 min)
npm run dev       # start the dev server → open the printed http://localhost:5173
```

Other commands:
- `npm run build` — type-check (`tsc`) **and** bundle for production into `dist/`.
- `npm run preview` — serve the built `dist/` to see the production version.

> `node_modules/` and `dist/` are git-ignored — that's why you run `npm install` once after cloning.

## 🗂️ Project structure

```
matter-app/
  index.html              ← the single HTML page; loads src/main.tsx
  package.json            ← dependencies + the dev/build/preview scripts
  vite.config.ts          ← Vite config (the React plugin)
  tsconfig*.json          ← TypeScript settings
  src/
    main.tsx              ← entry point: mounts <App/> into index.html's #root
    App.tsx               ← the app: state + the list of cards
    components/
      MatterCard.tsx      ← a reusable card component (props)
    data/
      matters.json        ← the data (Week 5 swaps this for a live API)
    types.ts              ← the Matter type — one shape everything agrees on
    index.css             ← styling (the Week 3 card/grid, now shared)
```

---

## Day 2 — React & JSX (read [`src/components/MatterCard.tsx`](src/components/MatterCard.tsx) and [`src/App.tsx`](src/App.tsx))

**React builds UI from components.** A **component** is a function that returns **JSX** — HTML-inside-JavaScript.
Open `MatterCard.tsx`:

```tsx
export function MatterCard({ matter }: MatterCardProps) {
  return (
    <div className="card">
      <h3>{matter.id}</h3>
      <p>{matter.client}</p>
      ...
    </div>
  );
}
```

- **JSX** looks like HTML but lives in a `.tsx` file. Curly braces drop JavaScript in: `{matter.client}`.
- **`className`** (not `class`) — because `class` is a reserved word in JavaScript. *(This is the #1 thing to
  know when reading Claude's JSX.)*
- **Props** — the `{ matter }` parameter is the component's input, like arguments to a function. `<MatterCard
  matter={m} />` passes one in.

Now open `App.tsx` and find the payoff — **`map` builds the UI**:

```tsx
{shown.map((matter) => (
  <MatterCard key={matter.id} matter={matter} />
))}
```

That's yesterday's `matters.map(...)`, but each item becomes a **component** instead of a string. `key` helps
React track list items (always give mapped elements a unique `key`).

**State & events** — also in `App.tsx`:

```tsx
const [activeOnly, setActiveOnly] = useState(false);
...
<button onClick={() => setActiveOnly((v) => !v)}>…</button>
```

- **`useState`** gives the component a value it remembers; calling `setActiveOnly` updates it and React
  **re-renders** automatically. No manual DOM poking (contrast Week 3's `events.html`).
- **`onClick`** wires the button to that update.

> **Legal analogy:** a component is a **reusable document template** (a `MatterCard`); props are the **fields
> you fill in** (this matter's data); state is a value the page **remembers** (are we filtering?).

**Try it:** with `npm run dev` running, change some JSX text in `MatterCard.tsx` and save — the browser
hot-reloads instantly.

## Day 3 — Vite + TypeScript (the tooling)

**Vite** is the dev server + build tool. `npm run dev` serves the app with instant hot-reload; `npm run build`
bundles it for production. It's what turns many `.tsx` files into the handful of files a browser downloads.

**TypeScript** is JavaScript **with types**. Open [`src/types.ts`](src/types.ts):

```ts
export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
};
```

Because `MatterCard` declares `matter: Matter`, TypeScript **catches mistakes before they ship** — misspell
`matter.clientt` or forget a field and the build fails with a clear error. That safety is why production
artifacts are `.tsx`, not `.jsx`.

**Prove it:** open `MatterCard.tsx`, change `{matter.client}` to `{matter.clientt}`, and run `npm run build` —
watch TypeScript reject it. Fix it and the build passes.

## Day 4 — Render data + build

The app renders from [`src/data/matters.json`](src/data/matters.json). In `App.tsx`:

```tsx
import mattersData from "./data/matters.json";
const matters = mattersData as Matter[];
```

The UI is a pure function of that data — add a matter to `matters.json`, save, and a new card appears. **This
is the whole point:** the same components render *any* matters you feed them.

**Ship it:**

```bash
npm run build     # type-checks, then writes an optimized bundle to dist/
npm run preview   # serve dist/ — this is the production build
```

`dist/` is what you'd deploy (to Netlify, S3, an internal server…). You've taken an artifact all the way to a
production build.

> **🔗 Your world & the bridge to Week 5.** Right now the data is a local JSON file. In **Week 5 (JSON, HTTP &
> wiring a UI to data)** you'll replace that import with a **`fetch`** call over HTTP, so the cards fill from a
> live source — and later that source is the **Snowflake matters** from Weeks 6–7. Same components, real data.

---

## ✍️ Your turn
1. **(Day 2)** Add a `<p>` in `MatterCard.tsx` showing whether the matter is active (`{matter.active ? "Active"
   : "Closed"}`).
2. **(Day 3)** Add a `lead: string` field to the `Matter` type, add it to each row in `matters.json`, and show
   it in the card. Run `npm run build` — TypeScript will nag until every matter has a `lead`.
3. **(Day 4)** Add a "sort by billed" button using `useState` (toggle a sorted copy of `shown`).

## 📝 Recap
- **Component** = a function returning **JSX**; **props** are its inputs; **`className`** not `class`.
- **`map`** turns data into components; **`useState`** holds state and triggers re-renders.
- **Vite** runs/builds; **TypeScript** (`Matter` type) catches errors before they ship.
- The UI renders from **data** (`matters.json`); `npm run build` produces a deployable `dist/`.

## ➡️ Next — Week 5: JSON, HTTP & wiring a UI to data
Replace the local `matters.json` import with a real **`fetch`** over HTTP — the hinge between this UI and the
data/backend half of the course (Weeks 6–7, and FastAPI later).

## 📖 Reference
- React — Quick start: https://react.dev/learn
- Vite guide: https://vite.dev/guide/
- TypeScript for JS programmers: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

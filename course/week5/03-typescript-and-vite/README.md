# Week 5 · Day 3 — TypeScript & Vite: the tools holding it up

*Two days in, the app works and you've never asked how. Today: what turns a folder of `.tsx` files into something
a browser can run — and the moment your types stop being advice and start being enforced.*

**You'll ship:** a type-safe project — plus the experience of **breaking the build on purpose** and watching
TypeScript catch a bug that would otherwise have been someone's Friday afternoon.

> 👉 **Two commands to keep straight:**
> ```bash
> npm run dev      # fast, forgiving — for building
> npm run build    # strict — type-checks, then bundles to dist/
> ```

> 📝 **Reading copy:** [`types.annotated.ts`](types.annotated.ts) — the project's `Matter` type, commented,
> plus the type syntax you'll meet next.

---

## 🎯 Objectives
- Say what **Vite** does in `npm run dev` and in `npm run build`.
- Explain the difference between your **editor** flagging a type error and the **build** refusing it.
- See TypeScript **reject a real mistake** at build time.
- Recognise typed **props** — `matter: Matter` — and why the type lives in one shared file.
- Know where the config files are and which ones you'll ever touch.

> **Prerequisite:** you met TypeScript in Week 4 — [Day 1](../../week4/01-values-and-functions/) (annotations),
> [Day 2](../../week4/02-arrays-and-objects/) (`Matter[]`, `Matter | undefined`) and
> [Day 4](../../week4/04-modules-and-async/) (a shared `types.ts`, `Promise<Matter[]>`). Today adds the two
> things a plain `node file.ts` can't give you: **typed props**, and a build that says no.

## ⚖️ Why it matters
The reason production artifacts are `.tsx` and not `.jsx` is that a legal tool showing the **wrong billed
amount** is worse than one that doesn't build. TypeScript moves that class of mistake from "a client notices" to
"the build fails in 3 seconds." For a team shipping AI-generated code they didn't write line by line, that check
is the safety net.

---

## 1 · What Vite does

You write `import`s and `.tsx` files. A browser understands neither. **Vite** is the tool in between:

| Command | What it does |
|---|---|
| `npm run dev` | starts a local server with **hot reload** — save a file, the browser updates in milliseconds |
| `npm run build` | runs `tsc -b` to type-check, then bundles everything into `dist/` |
| `npm run preview` | serves the built `dist/` so you can check the real production output |

`dist/` is what you'd deploy — a handful of optimised files. Note that `dev` **doesn't type-check**: it prioritises
speed. That's why `npm run build` is the one that tells you the truth, and why it's worth running before you say
you're done.

> **Legal analogy:** `dev` is the **working draft** — fast, tolerant of red ink. `build` is **engrossment** —
> everything is checked, and it refuses to produce a final unless it's correct.

Vite is also why Week 4 Day 4's `python3 -m http.server` isn't needed here: the dev server does that job, and a
great deal more.

## 2 · TypeScript — you've already met it

Open [`../matter-app/src/types.ts`](../matter-app/src/types.ts):

```ts
export type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
  lead: string;
};
```

This should look familiar — it is almost exactly the `types.ts` you read in
[Week 4 Day 4](../../week4/04-modules-and-async/types.ts). One file states what a matter **is**, and everything
else agrees with it.

So today is **not** "what is a type." You know that: annotations on values and functions (W4D1), `Matter[]` and
`Matter | undefined` through a pipeline (W4D2), a shared type module and `Promise<Matter[]>` (W4D4). Today is the
part Week 4 couldn't show you — **the enforcement**, and the tool that does it.

Recall the honest gap from Week 4:

| Where | What it does |
|---|---|
| Your editor | flags the mistake as you type |
| `node file.ts` | **strips** the types and runs anyway |
| **`npm run build`** | **refuses to build** ← this is new, and it's today |

**None of it runs.** `tsc` checks the types and then strips them out — the browser downloads plain JavaScript. A
type is a conversation with the compiler, not code.

## 3 · Typed props

```tsx
type MatterCardProps = { matter: Matter };

export function MatterCard({ matter }: MatterCardProps) { … }
```

Because `MatterCard` declares what it accepts, calling it wrongly is caught immediately: forget the prop, misspell
it, or pass a string where a `Matter` belongs, and the build stops. In an untyped app you'd find out when a card
renders blank.

## 4 · Prove it — break the build

Do this now, it takes thirty seconds:

1. Open [`../matter-app/src/components/MatterCard.tsx`](../matter-app/src/components/MatterCard.tsx).
2. Change `{matter.client}` to `{matter.clientt}`.
3. Run `npm run build`.

```
src/components/MatterCard.tsx(21,18): error TS2551:
  Property 'clientt' does not exist on type 'Matter'. Did you mean 'client'?
```

The build **refuses**, names the file, the line, the column, and the fix. Fix the typo and it passes again.

Now notice the interesting part: with `npm run dev` running, that same typo just renders an empty gap. The page
looks *almost* right. **That's the bug TypeScript exists to catch** — the one that doesn't crash.

## 5 · The config files

You'll rarely touch these, but you should know what they are:

```
matter-app/
  package.json        ← dependencies + the dev/build/preview/lint scripts
  package-lock.json   ← the exact versions installed (commit it; don't edit it)
  vite.config.ts      ← Vite's config — here, just the React plugin
  tsconfig.json       ← points at the two below
  tsconfig.app.json   ← rules for src/ (your code)
  tsconfig.node.json  ← rules for the config files themselves
  .oxlintrc.json      ← the linter — `npm run lint` catches sloppy patterns
```

Open [`../matter-app/package.json`](../matter-app/package.json) and find `"type": "module"` — the same line as
the three-line `package.json` in [Week 4 Day 4](../../week4/04-modules-and-async/package.json). Same purpose:
"the files here use `import`/`export`."

> **Go Deeper 🔧** — `npm run lint` runs **oxlint**, which flags things that are legal but wrong, such as calling
> a hook inside a condition. It's a different check from TypeScript: types ask *"is this shape right?"*, the
> linter asks *"is this pattern sane?"*

---

## ✍️ Your turn
1. Run the typo experiment from section 4 end to end, and read the error carefully.
2. Add `lead: string` to a **new** type field — say `openedOn: string` — in `types.ts`. Run `npm run build` and
   watch it fail, then satisfy it by adding `openedOn` to every row of
   [`../matter-app/public/matters.json`](../matter-app/public/matters.json) and showing it in `MatterCard.tsx`.
3. Make it optional instead: change it to `openedOn?: string`. Build again — now the missing rows are allowed,
   but TypeScript will make you handle the `undefined` case when you display it (`{matter.openedOn ?? "—"}`).
4. Try passing a wrong prop: `<MatterCard key={m.id} matter={m.client} />`. Read the error, then undo it.
5. Run `npm run lint` and confirm it's clean.

<details><summary>✅ What it should look like</summary>

```ts
// 2 — src/types.ts
export type Matter = { /* ... */ lead: string; openedOn: string };
```
```json
// public/matters.json — every row needs it
{ "id": "M-1002", "client": "Brightline LLC", "...": "...", "openedOn": "2026-01-14" }
```
```tsx
// MatterCard.tsx
<p className="lead">Opened {matter.openedOn}</p>

// 3 — optional version
<p className="lead">Opened {matter.openedOn ?? "—"}</p>
```
Exercise 4 gives `Type 'string' is not assignable to type 'Matter'` — TypeScript naming the exact mismatch.

Note for (2): the JSON is fetched at runtime, so TypeScript can't actually verify the file's contents — it only
checks the code that *uses* it. That gap is real, and Day 4 addresses it.
</details>

## 📝 Recap
- **Vite**: `dev` for fast hot-reload (**no type-check**), `build` for the strict check + `dist/` bundle,
  `preview` to serve the result.
- **TypeScript** is JavaScript with declared shapes; `tsc` checks them and then **strips them out** — same
  erasure `node file.ts` did in Week 4, but with the checking switched on.
- **One shared `Matter` type** means every component agrees on what a matter is.
- **Typed props** catch a wrong or missing prop at build time rather than on screen.
- `?` marks an **optional** field — and then TypeScript makes you handle its absence.
- **`npm run build` is the honest one.** Run it before you call something finished.

## 🧠 Check yourself
1. Why does a typo like `matter.clientt` survive `npm run dev` but fail `npm run build`?
   *(dev skips type-checking for speed; build runs `tsc` first)*
2. What happens to the `Matter` type in the shipped bundle? *(nothing — types are erased at build time)*
3. What does `openedOn?: string` change? *(the field may be missing, so you must handle `undefined` before use)*

## ➡️ Next — [04-data-over-http](../04-data-over-http/)
The data is still baked into the app. Friday you'll fetch it over **HTTP** — `useEffect` + `fetch`, plus the
loading and error states every real tool needs. That's the hinge to the data half of the course: Snowflake in
Weeks 6–7, and a FastAPI backend later.

## 📖 Reference
- TypeScript for JavaScript programmers: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- React — TypeScript with React: https://react.dev/learn/typescript
- Vite — Getting started: https://vite.dev/guide/

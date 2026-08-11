# Week 5 · Day 2 — State & events: the page updates itself

*Yesterday the data never changed. Today it does — and the moment you understand why you never call `render()`,
you understand React.*

**You'll ship:** the dashboard with a working **search box** and an **active-only** filter, built entirely from
state — the same features you hand-wired in Week 4 Day 3, with none of the wiring.

> 👉 **Keep the dev server running** and edit alongside it:
> ```bash
> cd course/week5/matter-app && npm run dev
> ```
> Open [`../matter-app/src/App.tsx`](../matter-app/src/App.tsx) next to the browser.

> 📝 **Reading copy:** [`App.annotated.tsx`](App.annotated.tsx) — the app at **today's** complexity (state and
> events, but still a local array), commented line by line. The live project file already has Friday's fetching
> in it; ignore the `useEffect` for now.

---

## 🎯 Objectives
- Hold a changing value with **`useState`**, and read the pair it returns.
- Wire **`onChange`** / **`onClick`** to state updates — with no DOM code at all.
- Build a **controlled input** and know why it needs both `value` and `onChange`.
- Tell **state** from **derived values**, and store only what you must.
- Show and hide markup with **conditional rendering** (`&&` and ternaries).

## ⚖️ Why it matters
Every artifact your team wants to productionize has controls — filter this, search that, toggle the other. This
is the lesson where you can add one. It's also the lesson that explains the biggest difference between the code
Claude writes and the code you wrote by hand last week.

---

## 1 · `useState` — a value the component remembers

```tsx
const [search, setSearch] = useState("");
//     ^ current value  ^ how to change it   ^ starting value
```

`useState` returns exactly two things, and **array destructuring** (Week 4 Day 4) names them. Calling
`setSearch("acme")` does two jobs: it stores the new value, **and** it tells React this component is stale.
React then re-runs `App()` and updates whatever changed on screen.

That's the whole trick. **There is no `render()` to call**, because calling the setter *is* the request to
re-render.

> **Legal analogy:** state is the **matter record**. You don't redraft the report; you update the record, and
> everything that shows it refreshes.

> **Common pitfalls ⚠️** — never assign to the variable directly. `search = "acme"` doesn't compile, and
> `matters.push(x)` changes the array without telling React, so nothing redraws. Always go through the setter,
> and always hand it a **new** value — Week 4 Day 4's spread (`[...matters, x]`) is exactly how.

## 2 · Events — no DOM in sight

Compare last Thursday with today:

```js
// Week 4 Day 3 — vanilla JS
searchEl.addEventListener("input", render);
const term = searchEl.value;              // ask the DOM what it's holding
```
```tsx
// Week 5 — React
<input value={search} onChange={(e) => setSearch(e.target.value)} />
const term = search;                      // ask state; the DOM just displays it
```

No `getElementById`, no `addEventListener`, no `render()`. Handlers are ordinary props: `onChange`, `onClick`,
`onSubmit` — camelCase, taking a function.

## 3 · Controlled inputs

```tsx
<input
  type="search"
  value={search}                                    // state decides what's shown
  onChange={(e) => setSearch(e.target.value)}       // typing writes back to state
/>
```

Both halves are required, and the direction matters: **state is the single source of truth, and the input just
displays it.** Provide `value` without `onChange` and the box looks frozen — you type, state never changes, React
redraws the old value. That's the classic React bug, and now you know its cause.

Checkboxes use `checked` instead of `value`, and read `e.target.checked` — the same `.value` vs `.checked`
distinction from Week 4 Day 3.

## 4 · State vs. derived values

This is the judgement call that separates tidy React from messy React:

```tsx
const [search, setSearch] = useState("");        // ✅ state — only the user knows it
const [activeOnly, setActiveOnly] = useState(false); // ✅ state

const shown = matters.filter(…).filter(…);       // ✅ derived — recomputed each render
const total = shown.reduce((s, m) => s + m.billed, 0);  // ✅ derived
```

`shown` and `total` are **not** state. They can always be worked out from the data plus the two state values, so
storing them would just be a second copy to keep in sync — and copies drift.

**Rule of thumb: if you can calculate it, calculate it.** Only keep in state what you couldn't work out any other
way.

And notice what `shown` actually is: **Week 4 Day 2's `filter → filter` pipeline**, unchanged. The data work is
the JavaScript you already know; React only changes where the results go.

## 5 · Conditional rendering

Two forms, both just JavaScript expressions inside `{ }`:

```tsx
{shown.length === 0 && <p className="empty">No matters match that search.</p>}

<span className={matter.active ? "tag" : "tag closed"}>
  {matter.active ? "Active" : "Closed"}
</span>
```

`&&` means "if the left is true, render the right." The ternary picks between two things — the same ternary from
Week 4 Day 1, now choosing markup.

> **Common pitfalls ⚠️** — write `shown.length === 0 && …`, not `shown.length && …`. `0` is falsy *and*
> renderable, so the short version prints a stray **0** on the page. Give `&&` a real boolean.

> **Go Deeper 🔧** — React re-runs the whole `App()` function on every keystroke. That sounds wasteful and
> isn't: React compares the JSX it gets back with what's on screen and touches only the DOM nodes that actually
> differ. This is precisely the optimisation you were told to want at the end of Week 4 Day 3.

---

## ✍️ Your turn — edit `App.tsx`
1. Add a **Reset** button that clears the search and unticks the checkbox
   (`<button onClick={…}>`, calling both setters).
2. Add a `sortDesc` state (a boolean) and a button that toggles it, sorting `shown` by `billed`.
   Remember to copy the array before sorting — `[...shown].sort(…)`.
3. Show the active count in the header — a derived value, not new state.
4. Break it deliberately: delete `onChange` from the search input, save, and try to type. Then delete `value`
   instead and try again. Explain to yourself what each version does.

<details><summary>✅ What it should look like</summary>

```tsx
// 1
<button onClick={() => { setSearch(""); setActiveOnly(false); }}>Reset</button>

// 2
const [sortDesc, setSortDesc] = useState(false);
const ordered = sortDesc ? [...shown].sort((a, b) => b.billed - a.billed) : shown;
<button onClick={() => setSortDesc((v) => !v)}>
  {sortDesc ? "Original order" : "Sort by billed"}
</button>
// ...then map over `ordered` instead of `shown`

// 3 — derived, no useState
const activeCount = matters.filter((m) => m.active).length;
```
`setSortDesc((v) => !v)` passes a **function** to the setter — "whatever the value is, flip it." That's the safe
way to toggle, because it never reads a stale copy.

In (4): without `onChange` the box is frozen (state never updates, so React keeps redrawing the old value).
Without `value` it becomes uncontrolled — typing works, but the filter still uses the empty state, so the cards
don't change.
</details>

## 📝 Recap
- **`useState`** returns `[value, setValue]`; calling the setter **is** the re-render request.
- **Never mutate** — hand the setter a new value (spread, don't `push`).
- Handlers are **props**: `onChange`, `onClick`, camelCase, taking a function. No DOM code.
- A **controlled input** needs both `value` (state decides) and `onChange` (typing writes back).
- **Derive** anything you can calculate; keep in state only what you can't.
- **`&&`** and ternaries render conditionally — give `&&` a real boolean, not a length.

## 🧠 Check yourself
1. Why is there no `render()` call anywhere in this file? *(calling a state setter tells React to re-run the
   component)*
2. Should the filtered list `shown` be state? *(no — it's derivable from `matters` + the two state values)*
3. What happens if you give an input `value` but no `onChange`? *(it appears frozen — state never changes, so
   React redraws the same value)*

## ➡️ Next — [03-typescript-and-vite](../03-typescript-and-vite/)
The app works. Thursday you'll look at the two tools holding it up — **Vite**, which serves and builds it, and
**TypeScript**, which catches a whole class of mistake before anyone sees it. You'll break the build on purpose.

## 📖 Reference
- React — State: a component's memory: https://react.dev/learn/state-a-components-memory
- React — Responding to events: https://react.dev/learn/responding-to-events
- React — Conditional rendering: https://react.dev/learn/conditional-rendering

# Week 5 · Day 1 — React & JSX: components instead of strings

*Last Thursday you built a dashboard by hand — find the element, build the HTML, remember to re-render. Today you
describe what the page should look like, and React does the rest.*

**You'll ship:** the Matter Intelligence dashboard running as a real React app on your own machine
(`npm run dev`), rendered from a **component** you can read line by line.

> 👉 **Start the app — do this first:**
> ```bash
> cd course/week5/matter-app
> npm install       # one-time; downloads React, Vite, TypeScript (~1 min, needs internet)
> npm run dev       # then open the printed http://localhost:5173
> ```
> Leave it running all week. Every edit you save appears in the browser instantly.

> 📝 **Reading copies for today:** [`MatterCard.annotated.tsx`](MatterCard.annotated.tsx) and
> [`App.annotated.tsx`](App.annotated.tsx) — the project's two components with a comment on nearly every line.
> `App.annotated.tsx` shows the app at **today's** complexity (no state, no fetching); the live
> [`../matter-app/src/App.tsx`](../matter-app/src/App.tsx) is the finished Friday version, so don't be alarmed
> that it has more in it.

---

## 🎯 Objectives
- Explain what **React** is and what problem it solves.
- Read a **component** — a function that returns **JSX**.
- Spot the JSX rules that trip everyone up: **`className`**, `{ }` expressions, one root element.
- Pass data into a component with **props**.
- Turn a list of data into a list of UI with **`map`** — and know what **`key`** is for.

## ⚖️ Why it matters
When Claude gives you a `.jsx` or `.tsx` artifact, this is what's inside it. Every component you learn to read is
one you can change — and the *Matter Intelligence* tool your team wants to ship is a few dozen of these. Today is
the point where "Claude's output" becomes "our codebase."

---

## 1 · What React actually does for you

Week 4 Day 3, you wrote this by hand:

```js
boardEl.innerHTML = shown.map(cardHtml).join("");   // and remember to call render()
```

You owned three jobs: **find** the element, **build** the HTML, and **remember to re-run** it whenever anything
changed. Miss the third and the page silently goes stale — the single most common bug in hand-written UI code.

React takes the last two. You write a function that says *"for this data, the page looks like this,"* and React
works out which parts of the real DOM to touch. No `getElementById`, no `innerHTML`, no `render()` calls.

> **Legal analogy:** you stop hand-editing the engrossed document and instead update the **matter record** — the
> document regenerates itself from the current data, correctly, every time.

## 2 · A component is a function that returns JSX

Open [`../matter-app/src/components/MatterCard.tsx`](../matter-app/src/components/MatterCard.tsx):

```tsx
export function MatterCard({ matter }: MatterCardProps) {
  const amount = matter.billed.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="card">
      <h3>{matter.id}</h3>
      <p>{matter.client}</p>
      <p className="amt">{amount}</p>
    </div>
  );
}
```

**JSX** is HTML written inside JavaScript. Four rules cover almost everything:

| Rule | Why |
|---|---|
| **`className`, not `class`** | `class` is a reserved word in JavaScript |
| **`{ }` drops JavaScript in** | `{matter.client}` evaluates, then renders |
| **One root element per return** | wrap siblings in a `<div>` (or an empty `<>…</>`) |
| **Components start with a Capital** | that's how JSX tells `<MatterCard>` from `<div>` |

`className` is the one to memorize — it's the #1 thing to know when reading Claude's JSX.

Everything above the `return` is ordinary JavaScript. `toLocaleString` is the exact money formatter from Week 4.

## 3 · Props — a component's inputs

```tsx
type MatterCardProps = { matter: Matter };

export function MatterCard({ matter }: MatterCardProps) { … }
```

**Props** are arguments. `{ matter }` in the parameter list is Friday's **destructuring** — it pulls the `matter`
key out of the props object so you can write `matter` rather than `props.matter`.

Passing one in looks like an HTML attribute:

```tsx
<MatterCard matter={m} />
```

Left of the `=` is the name the component receives; right of it, in braces, is the value you're sending.

> **Legal analogy:** the component is a **document template** — a Matter Card. Props are the **fields you fill
> in** for this particular matter. One template, one hundred matters, one hundred cards.

## 4 · `map` — the move you already know

Here is the whole reason Week 4 Day 2 mattered:

```tsx
{matters.map((matter) => (
  <MatterCard key={matter.id} matter={matter} />
))}
```

```js
// Week 4 Day 3, by hand:
shown.map(cardHtml).join("")
```

**Same `map`.** The only difference is what each item turns into — a string of HTML then, a component now. And
there's no `.join("")`, because React knows what to do with an array of elements.

**`key`** is React's bookkeeping: a unique, stable id per item so React can tell which card is which when the
list is filtered or reordered. Leave it out and React warns in the console.

> **Common pitfalls ⚠️** — don't use the array index as a `key` in a list that can be filtered or sorted. When
> the order changes, React matches up the wrong items and you get cards showing the wrong data. Use `matter.id`.

## 5 · How the app hangs together

```
index.html          ← one nearly-empty page with <div id="root">
  src/main.tsx      ← mounts <App/> into that div
    src/App.tsx     ← the page: the data, and the list of cards
      components/MatterCard.tsx   ← one card
  src/index.css     ← the Week 3 card + grid CSS, unchanged
```

Open [`../matter-app/index.html`](../matter-app/index.html) — it's twelve lines and contains no content. That's
normal: **everything you see on screen is built by JavaScript**, exactly like Week 4 Day 3's empty `<div
id="board">`, just at the scale of the whole page.

> **Go Deeper 🔧** — `.tsx` is TypeScript + JSX; `.jsx` is JavaScript + JSX. Claude produces both. The JSX half
> is identical; Day 3 covers what the TypeScript half adds.

---

## ✍️ Your turn — edit the project (keep `npm run dev` running)
1. In `MatterCard.tsx`, change some visible text and save. Watch the browser update without a reload.
2. Add a `<p>` to `MatterCard.tsx` showing the practice area in capitals:
   `{matter.area.toUpperCase()}`.
3. In `App.tsx`, change the `<h1>` to include the count: `Matter Intelligence ({matters.length})`.
4. Deliberately break it: change `className` to `class` in `MatterCard.tsx`, save, and read the browser console
   warning. Change it back.
5. Delete `key={matter.id}` from the `map` in `App.tsx`, open the console, and read React's complaint. Put it back.

<details><summary>✅ What it should look like</summary>

```tsx
// 2 — inside the returned <div className="card">
<p>{matter.area.toUpperCase()}</p>

// 3 — in App.tsx
<h1>Matter Intelligence ({matters.length})</h1>
```
Exercise 4 gives you `Warning: Invalid DOM property 'class'. Did you mean 'className'?` — worth seeing once so
you recognise it later. Exercise 5 gives `Warning: Each child in a list should have a unique "key" prop.`

If the page goes blank, check the terminal running `npm run dev` — Vite prints the syntax error there, usually a
missing `}` or an unclosed tag.
</details>

## 📝 Recap
- A **component** is a function that returns **JSX**; its name must start with a **Capital**.
- **JSX** is HTML in JavaScript: **`className`** not `class`, `{ }` for values, one root element per `return`.
- **Props** are a component's inputs, passed like attributes and read by **destructuring**.
- **`map`** turns data into components — Week 4's `map`, with no `.join("")` needed.
- **`key`** must be a unique, stable id (use `matter.id`, never the array index).
- You describe the UI for the current data; **React handles the DOM**.

## 🧠 Check yourself
1. Why `className` instead of `class`? *(`class` is a reserved word in JavaScript)*
2. In `<MatterCard matter={m} />`, which part is the prop name and which is the value?
   *(`matter` is the name the component receives; `{m}` is the value being sent)*
3. What breaks if two items in a list share the same `key`? *(React can't tell them apart, so it reuses the
   wrong card when the list changes)*

## ➡️ Next — [02-state-and-events](../02-state-and-events/)
Right now the data never changes. Tomorrow you'll add a search box and a filter with **`useState`** — and the
key difference from Week 4 lands: you won't call `render()`, because **changing the data re-renders the page by
itself**.

## 📖 Reference
- React — Your first component: https://react.dev/learn/your-first-component
- React — Writing markup with JSX: https://react.dev/learn/writing-markup-with-jsx
- React — Rendering lists: https://react.dev/learn/rendering-lists

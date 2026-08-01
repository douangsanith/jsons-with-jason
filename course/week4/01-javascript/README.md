# Week 4 · Day 1 — JavaScript essentials

*HTML is the structure, CSS is the look — JavaScript is the **behavior**. It's what makes an artifact do something.*

**You'll ship:** a JavaScript module you run with Node ([`matters.js`](matters.js)) and an interactive page
you open in a browser ([`events.html`](events.html)) — and fluency with the `map`/`filter`/`reduce` that
powers React.

> 👉 **Two ways to run today's code:**
> - In a terminal: `node matters.js` (Node is JavaScript outside the browser — install from
>   [nodejs.org](https://nodejs.org) if you don't have it).
> - In a browser: double-click [`events.html`](events.html) and click the buttons.

> 📝 **Learning copies:** [`matters.annotated.js`](matters.annotated.js) and
> [`events.annotated.html`](events.annotated.html) are the same code with a plain-English comment on every line
> (arrays vs. objects, `map`/`filter`/`reduce`, the DOM, `addEventListener`). Read those to learn; use the clean
> files to build. Run the annotated script with `node matters.annotated.js`.

---

## 🎯 Objectives
- Read/write **variables** (`const`/`let`), **template literals**, and **arrow functions**.
- Work with **arrays** and **objects** — the shape of all web data.
- Use **`map`**, **`filter`**, **`reduce`** — the three methods behind every React list.
- Recognize **DOM** access and **events** (`addEventListener`) — how a page reacts.

## ⚖️ Why it matters
Every interactive Claude artifact has a `<script>`. In Week 3 you learned to *recognize* it; now you *read and
edit* it. And one pattern rules them all: **`array.map(...)`** — turning a list of data into a list of UI. That
single idea *is* how React renders your matters, so it's the bridge into tomorrow.

---

## 1 · Run `matters.js` and read it

```bash
node matters.js
```

Open [`matters.js`](matters.js) alongside the output. It shows:
- **`const` / `let`** — declare values (`const` = won't be reassigned).
- **Template literals** — `` `Firm: ${firm}` `` (JavaScript's f-string).
- **Arrow functions** — `(m) => m.active` is a compact function; a single-expression body returns
  automatically.
- **Arrays & objects** — `matters` is an array of objects (`[{...}]`), a list of records.

## 2 · The three array methods

From `matters.js`, matched to what you know:

| JS | Does | Python twin |
|---|---|---|
| `matters.filter(m => m.active)` | keep matching items | `[m for m in matters if m.active]` |
| `matters.map(m => m.client)` | transform each item | `[m.client for m in matters]` |
| `matters.reduce((s, m) => s + m.billed, 0)` | collapse to one value | `sum(m.billed for m in matters)` |

The `0` in `reduce` is the **starting value** of the running total. **Hold onto `map`** — tomorrow
`matters.map(m => <MatterCard matter={m} />)` renders one card per matter in React.

## 3 · The DOM & events (open `events.html`)

In a browser, JS reaches into the page via the **DOM** (`document.getElementById(...)`) and reacts to
**events** (`addEventListener("click", …)`). Open [`events.html`](events.html), click **Close one** and
**Reset**, then read the `<script>` — that's every button, filter, and toggle in an artifact, in miniature.

> **Legal analogy:** the browser is the **courtroom** where things happen live; Node (and Python) is the
> **back office**.

---

## ✍️ Your turn

**In `matters.js`:**
1. Log the number of **closed** matters (`filter(m => m.active === false)`).
2. `map` matters to an array of just `client` names and log it.
3. Compute total billed for **active** matters only (filter, then reduce).

**In `events.html`:**
4. Add a third button, **"Close two"**, that subtracts 2 from the count.

<details><summary>✅ Hints</summary>

```js
// 1
console.log("closed:", matters.filter((m) => m.active === false).length);
// 2
console.log(matters.map((m) => m.client));
// 3
console.log(matters.filter((m) => m.active).reduce((s, m) => s + m.billed, 0).toFixed(2));
```
For (4), copy the "close" listener, change the id, and subtract 2 (guard against going below 0).
</details>

## 📝 Recap
- JavaScript = **behavior**; `const`/`let`, `` `${…}` `` template literals, arrow `=>` functions.
- Web data is an **array of objects**.
- **`filter`/`map`/`reduce`** transform arrays — and **`map` is how React renders lists**.
- The **DOM + events** let a page react to the user.

## 🧠 Check yourself
1. `const` vs `let`? 2. What does `matters.map(m => m.client)` produce? 3. What's the `0` in that `reduce`?

## ➡️ Next — [../matter-app/](../matter-app/) (Days 2–4: React & TypeScript)
That `map` move becomes React. Open the **matter-app** project's README to read a real `MatterCard`
component, then run the app with Vite and build it for production.

## 📖 Reference
- MDN — JS first steps: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps
- MDN — Array methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

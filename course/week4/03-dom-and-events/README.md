# Week 4 · Day 3 — The DOM & events: making the page react

*Two days of JavaScript have printed to a terminal. Today it lands **on the page** — and the page starts
answering back.*

**You'll ship:** the Week 3 Matter Intelligence dashboard, now **live** —
[`dashboard.html`](dashboard.html) + [`dashboard.js`](dashboard.js) with a search box and an "active only"
toggle that re-render the cards as you type.

> 👉 **Open both demos in your browser now** (double-click them):
> - [`events.html`](events.html) — the two-button warm-up. Click **Close one** and **Reset**.
> - [`dashboard.html`](dashboard.html) — today's build. Type in the search box; tick the checkbox.
>
> Keep `dashboard.js` open in your editor beside the page.

> 📝 **Annotated copies:** [`events.annotated.html`](events.annotated.html),
> [`dashboard.annotated.html`](dashboard.annotated.html) and
> [`dashboard.annotated.js`](dashboard.annotated.js) are the same code with a plain-English comment on nearly
> every line. The annotated page loads the annotated script, so you can open it and read both halves together.

---

## 🎯 Objectives
- Explain what the **DOM** is, and how it differs from the HTML file on disk.
- Find elements with **`getElementById`** and change them with **`textContent`** and **`innerHTML`**.
- Wire user actions to code with **`addEventListener`** (`click`, `input`, `change`).
- Read a control's current value — **`.value`** for inputs, **`.checked`** for checkboxes.
- Build a **`render()`** function that turns data into HTML, and call it from every event.

## ⚖️ Why it matters
This is the `<script>` block Week 3 told you not to touch. Every filter, toggle, search box and sortable table in
a Claude artifact is the pattern you're about to write — and once you can read it, you can change it. It's also
the last thing you'll ever do by hand: Week 5's React does all of today's wiring for you, and you'll only
appreciate *why* that's a relief if you've done it the manual way once.

---

## 1 · What the DOM actually is

**DOM** stands for **Document Object Model** — the browser's live, in-memory version of your page. The `.html`
file is the blueprint; the DOM is the building, and JavaScript can walk through it and change it while people are
standing inside.

Prove it to yourself: open `dashboard.html`, then use **View Source** — the `<div class="board">` is empty. Now
right-click a card → **Inspect** and look at the Elements panel — the cards are there. The file never changed;
the DOM did.

> **Legal analogy:** the HTML file is the **executed contract in the drawer**; the DOM is the **working copy on
> the table** that everyone is redlining right now.

## 2 · Finding and changing elements

```js
const summaryEl = document.getElementById("summary");

summaryEl.textContent = "6 of 6 matters";      // set plain text
boardEl.innerHTML = "<div class='card'>…</div>"; // set actual markup
```

An **`id`** in the HTML is the **hook** the script grabs. That's why `dashboard.html` gives ids to `#board`,
`#summary`, `#search` and `#active-only` — Week 3's "outline → data → **hooks**" reading, now paying off.

| Property | Sets | Use it when |
|---|---|---|
| `.textContent` | plain text | the value is just words or a number — **prefer this** |
| `.innerHTML` | parsed markup | you're inserting real HTML you built yourself |

> **Common pitfalls ⚠️** — `.innerHTML` **executes the markup you give it**. Never pass it text that came from a
> user or an outside system without escaping it first — that's how a search box becomes a security hole. This is
> the same "escaping" caution from Week 3 Day 4. Here the card HTML is built from our own trusted data, so it's
> fine.

Also note **where the `<script>` tag sits** — the very bottom of `<body>`. Move it into the `<head>` and
`getElementById` returns `null`, because the elements don't exist yet.

## 3 · Events — wiring an action to code

```js
searchEl.addEventListener("input", render);
activeOnlyEl.addEventListener("change", render);
```

`addEventListener(eventName, functionToRun)` says "when this happens, run this." The events you'll use most:

| Event | Fires when |
|---|---|
| `click` | a button is pressed |
| `input` | **every keystroke** in a text field |
| `change` | a checkbox is ticked, or a dropdown changes |
| `submit` | a form is submitted |

Reading what the user did:

```js
searchEl.value        // "acme"  — text inputs report .value (always a string)
activeOnlyEl.checked  // true    — checkboxes report .checked (a boolean)
```

> **Common pitfalls ⚠️** — `.value` is **always a string**, even from a number input. `"3" - 1` gives `2`, but
> `"3" + 1` gives `"31"`. Wrap it in `Number(...)` before doing arithmetic — see `events.html`, which does
> exactly that.

## 4 · The `render()` pattern — the big idea

Don't scatter DOM updates through your event handlers. Write **one** function that puts the page in the correct
state for the current data, and have every event call it:

```js
function render() {
  const term = searchEl.value.trim().toLowerCase();
  const activeOnly = activeOnlyEl.checked;

  const shown = matters
    .filter((m) => (activeOnly ? m.active : true))
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  summaryEl.textContent = `${shown.length} of ${matters.length} matters · ${money(total)} billed`;
  boardEl.innerHTML = shown.map(cardHtml).join("");
}
```

There it is — **Day 2's `filter` → `map` pipeline, now driving a web page.** `cardHtml` is an arrow function that
turns one matter into one card's markup, `map` runs it over every row, and `.join("")` glues the strings
together. (Without `join`, you'd get commas between the cards.)

Two small touches worth copying: `.toLowerCase()` on both sides makes the search case-insensitive, and
`.includes("")` is always true — so an empty search box matches everything, for free.

> **Go Deeper 🔧** — Rebuilding the whole board on every keystroke looks wasteful, and at six rows it isn't. At
> six *thousand* it would be, and you'd reach for a library that updates only what changed. That library is
> React.

**The shape to remember: data → `render()` → HTML, and every event just calls `render()` again.**

> **No TypeScript twin today — on purpose.** Days 1, 2 and 4 each ship a `.ts` version, but typing raw DOM code
> means writing casts like `document.getElementById("search") as HTMLInputElement` on every lookup, because
> `getElementById` can't know what kind of element it found and might return `null`. That's real, and it's noise
> when the subject is events. In Week 5, React removes the problem rather than annotating it: you never look
> elements up, so there's nothing to cast.

---

## ✍️ Your turn — edit `dashboard.js` and `events.html`

**In `dashboard.js`:**
1. Add the practice area to the search — it's already there; now **break** it. Delete the
   `|| m.area.toLowerCase().includes(term)` clause, reload, and search `litigation`. Put it back.
2. Sort the cards biggest-first before mapping (`.sort((a, b) => b.billed - a.billed)` — remember to copy the
   array first).
3. Add a **"Reset"** button to `dashboard.html` that clears the search box, unticks the checkbox, and calls
   `render()`.

**In `events.html`:**
4. Add a third button, **"Close two"**, that subtracts 2 from the count (and never goes below 0).

<details><summary>✅ What it should look like</summary>

```js
// 2 — inside render(), between the filters and the map
const shown = [...matters]
  .sort((a, b) => b.billed - a.billed)
  .filter((m) => (activeOnly ? m.active : true))
  .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

// 3 — in dashboard.html, next to the checkbox:
//   <button id="reset">Reset</button>
document.getElementById("reset").addEventListener("click", () => {
  searchEl.value = "";
  activeOnlyEl.checked = false;
  render();
});

// 4 — in events.html
document.getElementById("close-two").addEventListener("click", () => {
  const n = Number(countEl.textContent);
  countEl.textContent = Math.max(0, n - 2);
});
```
If nothing happens when you click, open the browser console (**⌥⌘I** on a Mac → Console). `null is not an
object` almost always means the `id` in your JavaScript doesn't match the `id` in your HTML — check the spelling.
</details>

## 📝 Recap
- The **DOM** is the browser's live model of the page — changing it changes what people see, not the file.
- **`getElementById`** finds an element by its **hook**; **`.textContent`** sets text, **`.innerHTML`** sets markup.
- **`addEventListener`** connects `click` / `input` / `change` to a function.
- Inputs report **`.value`** (a string); checkboxes report **`.checked`** (a boolean).
- One **`render()`** function owns the drawing; **every event just calls it again**.
- `map(...).join("")` turns a list of data into a block of HTML — the same `map` as Day 2.

## 🧠 Check yourself
1. Why does the `<script>` tag go at the bottom of `<body>`? *(so the elements exist before the code looks for them)*
2. When should you use `.textContent` instead of `.innerHTML`? *(whenever the value is plain text — it can't be
   mistaken for markup)*
3. What does `.join("")` fix after a `.map()`? *(without it the array's commas end up in the page)*

## ➡️ Next — [04-modules-and-async](../04-modules-and-async/)
One file is fine for six matters. Friday you'll split this code into **modules** (`import`/`export`), meet the
shorthand React code is written in — destructuring, spread, optional chaining — and handle data that arrives
**later** with `async`/`await`. That's the last stop before React.

## 📖 Reference
- MDN — Introduction to the DOM: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction
- MDN — `EventTarget.addEventListener`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- MDN — Events reference: https://developer.mozilla.org/en-US/docs/Web/Events

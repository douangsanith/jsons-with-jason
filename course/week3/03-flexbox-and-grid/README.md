# Week 3 · Day 3 — Layout: flexbox & grid

*Styling makes things pretty; layout puts them where you want. This is how Claude arranges a dashboard.*

**You'll ship:** the matters as a **responsive grid of cards** ([`index.html`](index.html) +
[`styles.css`](styles.css)) — and you'll know how to switch it to a flex **row**.

> 👉 **Open [`index.html`](index.html) in your browser, then drag the window narrower and wider** — watch the
> cards re-flow. That's responsive layout.

> 📝 **Learning copies:** [`index.annotated.html`](index.annotated.html) and
> [`styles.annotated.css`](styles.annotated.css) explain grid vs. flex line by line (what `auto-fit`, `minmax`,
> and `flex: 1 1 180px` mean). Read those to learn; use the clean files to build.

---

## 🎯 Objectives
- Explain **normal flow** (block vs inline).
- Use **flexbox** (`display: flex`, `gap`, `justify-content`, `flex-wrap`) for a **row**.
- Use **CSS grid** (`display: grid`, `grid-template-columns`) for a **2-D dashboard**.
- Make a layout **responsive** so it wraps on narrow screens.

## ⚖️ Why it matters
Almost every Claude dashboard is *"a row of stat cards"* or *"a grid of panels."* Both are **flexbox** or
**grid**. Once you can read `display: flex`, you can rearrange the pieces of any artifact — the difference
between "I can recolor it" and "I can restructure it into what we need."

---

## 1 · Normal flow (the default)

Without any layout, block elements (`div`, `section`, `h1`) stack top-to-bottom. Layout tools override this.

## 2 · A short history: how we laid things out *before* flex & grid

CSS launched in 1996 with **no layout system at all** — just normal flow. But designers wanted **columns**
(a sidebar next to content, a row of cards). For ~15 years people built columns out of properties that were
never meant for layout. Here's what that looked like and why it hurt — this is *why* flex and grid exist.

> 🔬 **See it break, live:** open [`float-demo.html`](float-demo.html) in your browser. It shows the classic
> **collapsing container** (and a footer bar riding up over the cards), the **clearfix** that fixed it, and the
> modern one-line flex version — side by side. Delete the `clearfix` class and refresh to watch it break again.

### 2a · `float` (the workhorse, ~2000–2015)

`float` was invented for **one job**: letting text wrap around an image (like a newspaper). People discovered
that if you floated a `<div>`, the *next* element would slide up beside it — so they abused floats to make
columns:

```css
/* "Two columns" the old way */
.sidebar { float: left;  width: 30%; }
.content { float: left;  width: 70%; }
```

The problem: a floated element is **pulled out of normal flow**, so its parent forgets it exists and
**collapses to zero height** — backgrounds vanish, borders ride up. You had to "fix" this with a hack called
the **clearfix**, pasted into every project for a decade:

```css
/* The infamous clearfix — needed just to make a float container behave */
.row::after {
  content: "";
  display: table;
  clear: both;
}
```

**Why it was limiting:**
- **No vertical centering.** Floats only push things left/right. Centering a card vertically was famously
  near-impossible ("How do I vertically center a div?" was the most-asked CSS question for years).
- **Equal-height columns were fake.** If the sidebar was shorter than the content, its background stopped
  early. People used background images or JavaScript to fake matching heights.
- **Source order = visual order.** To put the sidebar on the *right* but keep it *first* in the HTML (good for
  screen readers), you needed brittle negative-margin tricks.
- **The clearfix tax.** Every layout container needed boilerplate just to not collapse.

### 2b · `display: inline-block` (~2010)

To dodge floats, people set columns to `inline-block` — items flow left-to-right like words in a sentence:

```css
.card {
  display: inline-block;
  width: 33%;
  vertical-align: top;
}
```

Cleaner than floats (no clearfix), but it had its own gremlin: because items are laid out **like text**, the
**whitespace between your HTML tags becomes a real gap.** Three `width: 33%` cards would *not* fit on one row
because the spaces between the `<div>`s added a few pixels each and pushed the third card down:

```html
<div class="card">A</div>
<div class="card">B</div>   <!-- the line breaks between these count as space! -->
<div class="card">C</div>
```

People "fixed" this with genuinely ugly workarounds — setting `font-size: 0` on the parent (then resetting it
on children), or writing HTML comments `</div><!--` to delete the whitespace. A layout system shouldn't care
how you format your HTML — but this one did.

### 2c · `.col` grid frameworks (Bootstrap era, ~2011–2016)

Floats and inline-block were so painful that frameworks like **Bootstrap** and **960.gs** wrapped the mess in
reusable classes. You'd add `.row` and `.col-*` classes and let the framework's CSS do the floats + clearfix
for you:

```html
<div class="row">
  <div class="col-md-4">A</div>
  <div class="col-md-4">B</div>
  <div class="col-md-4">C</div>
</div>
```

```css
/* Roughly what a framework generated under the hood */
.row::after { content: ""; display: table; clear: both; }   /* clearfix again */
.col-md-4 {
  float: left;
  width: 33.3333%;
  padding: 0 15px;      /* "gutters" faked with padding + negative margins on .row */
}
```

This *worked* and dominated the web — but notice what it really was: **the same float hacks, hidden behind
class names.** The costs:
- You had to **learn a framework's vocabulary** (`col-md-4`, `col-sm-6`, `offset-2`) instead of CSS itself.
- The **12-column model was rigid** — anything that wasn't a clean fraction of 12 was a fight.
- **Gutters (gaps) were faked** with padding + negative margins, which broke in edge cases.
- You shipped a **big CSS file** to solve a problem the browser should solve natively.

### Why we switched

Every approach above **repurposed a tool built for something else** (text wrapping, inline text, generated
classes) to fake 2-D layout. That's why centering, equal heights, gaps, and reordering were all so hard — the
browser had no idea you were *trying to build a layout*.

**Flexbox (2013) and Grid (2017) are the first properties designed *for layout from the start*.** They give
the container real layout powers, so the things that took hacks before are now one line:

| The old pain | Float / inline-block / `.col` | Flexbox / Grid today |
|---|---|---|
| Space between items | negative margins / padding | **`gap: 12px`** |
| Vertical centering | JS or nasty hacks | **`align-items: center`** |
| Equal-height columns | fake backgrounds / JS | **automatic** |
| Container collapsing | **clearfix** boilerplate | never happens |
| Whitespace gaps in HTML | `font-size: 0` tricks | never happens |
| Reorder without touching HTML | negative margins | **`order`**, `row-reverse` |
| Responsive columns | many `.col-sm/md/lg` classes | **`repeat(auto-fit, minmax(...))`** |

Keep this table in mind as you read the next two sections — every "one line" on the right replaced a paragraph
of hacks on the left.

## 3 · Grid — rows and columns (what's in the file)

> 🏞️ **A grid you've held in your hands.** If you've ever picked up a **US National Park brochure**, you've
> used a grid system. In 1977 the designer **Massimo Vignelli** gave the National Park Service the *Unigrid
> System*: one modular grid — fixed columns, consistent gaps, a black title band — that every park's brochure
> snaps into. Yellowstone, the Everglades, and a tiny historic site all look like one family because their
> content is poured into the **same underlying grid**, just arranged differently. That's *exactly* what CSS
> Grid does: you define the columns and gaps once (the `.board` rule below), and every card "snaps" into the
> structure. **The blueprint:** [NPS Unigrid design specifications (PDF)](https://npshistory.com/brochures/unigrid.pdf)
> — the literal spec sheet — and an [overview of the Unigrid system](https://en.wikipedia.org/wiki/Unigrids).
> Keep it in mind as you read: `grid-template-columns` *is* your Unigrid.

Look at `.board` in `styles.css`:

```css
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
```

- `display: grid` turns the container into a grid.
- `repeat(auto-fit, minmax(180px, 1fr))` = "fit as many **~180px** columns as will fit; each grows to share
  leftover space (`1fr`)." Add cards or resize the window and it re-flows automatically.
- `gap` spaces the cards.

This one line is the famous "responsive grid," and it's what most Claude dashboards use.

## 4 · Flexbox — a single row

`styles.css` also has a `.row` rule (unused until you switch to it):

```css
.row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
.row .card { flex: 1 1 180px; }
```

- `display: flex` lays children out in a **row**.
- `justify-content` spaces them along the row (`space-between`, `center`, `flex-start`).
- `flex-wrap: wrap` lets items drop to a new line instead of overflowing.
- `flex: 1 1 180px` = grow, shrink, ideal width 180px.

### 4a · `flex-direction` — row *or* column

`display: flex` defaults to a **row** (left → right), but that's just the default. One property,
`flex-direction`, flips the axis — this is the "or column" half of flexbox:

```css
.row    { display: flex; flex-direction: row; }            /* default → → left to right */
.stack  { display: flex; flex-direction: column; }         /* ↓ top to bottom          */
.row-r  { display: flex; flex-direction: row-reverse; }    /* ← → right to left        */
.stack-r{ display: flex; flex-direction: column-reverse; } /* ↑ bottom to top          */
```

`styles.css` has a ready-to-try `.stack` (column) version — swap `class="board"` for `class="stack"` in
`index.html` and the cards run **top to bottom** instead of across.

**The key idea — main axis vs cross axis.** Flex has two axes, and `flex-direction` decides which is which:

| `flex-direction` | Main axis (what `justify-content` controls) | Cross axis (what `align-items` controls) |
|---|---|---|
| `row` (default) | horizontal ← → | vertical ↑ ↓ |
| `column` | vertical ↑ ↓ | horizontal ← → |

So the *same* `justify-content: center` **centers horizontally** in a row but **vertically** in a column —
because it always follows the main axis. This trips everyone up once; after that it's second nature.

> **Gotcha:** `...-reverse` only flips *visual* order, not the HTML/DOM order — so keyboard and screen-reader
> users still move through the original source order. Use it for looks, not to fix real ordering.

**Flex is for one dimension (a row *or* column); grid is for two (rows *and* columns).**

> **Legal analogy:** flex is arranging exhibits **side by side on a table**; grid is a **full page layout**
> with rows and columns.

---

## ✍️ Your turn

1. **Switch grid → flex:** in `index.html`, change `<div class="board">` to `<div class="row">`, save,
   refresh. Same cards, laid out by flexbox. Resize the window to see wrapping.
2. **Switch row → column:** change `class="board"` to `class="stack"` — the same cards now run **top to
   bottom**. That's `flex-direction: column`. Then, in `.stack`, add `align-items: center;` and watch the
   cards center **horizontally** (the cross axis in a column).
3. Back on the grid (`class="board"`), change `minmax(180px, 1fr)` to `minmax(120px, 1fr)` — more, narrower
   columns.
4. In `.card`, add `text-align: center;` and see every card's content center.

<details><summary>✅ What to expect</summary>

With `row`, cards sit in a spaced row that wraps on narrow screens. With `stack`, they run top-to-bottom, and
`align-items: center` narrows and centers them horizontally. With smaller `minmax`, more columns fit per row.
`text-align: center` centers the card text. Flex/grid properties go on the **container**; if nothing changes,
make sure you edited the container's class, not the `.card`.
</details>

## 📝 Recap
- **Before flex/grid**, columns were faked with `float` (needed a **clearfix**), `inline-block` (whitespace
  gaps), or `.col` **frameworks** (float hacks behind class names) — all repurposing tools built for other jobs.
- **Normal flow** stacks block elements; layout tools override it.
- **Flexbox** = 1-D (a row): `display: flex`, `gap`, `justify-content`, `flex-wrap`.
- **Grid** = 2-D: `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(...))`.
- Both go on the **container**; `gap` spaces items; auto-fit/wrap makes it **responsive** — no hacks needed.

## 🧠 Check yourself
1. Does `display: flex` go on the container or the items? *(container)*
2. Flex vs grid — when each? *(one dimension vs two)*
3. What does `repeat(auto-fit, minmax(180px, 1fr))` do? *(responsive columns in one line)*
4. Why did floated column layouts need a **clearfix**? *(floats leave normal flow, so the parent collapses to
   zero height)*
5. Name one thing that took a hack before flex/grid and is now one property. *(gaps → `gap`, vertical centering
   → `align-items`, equal heights → automatic…)*

## ➡️ Next — [04-anatomy-of-an-artifact](../04-anatomy-of-an-artifact/)
You can structure, style, and lay out a page. Next we zoom out to the **whole file** Claude hands you —
`<head>`, `<style>`, `<script>` — and a **playbook** for what's safe to change. It's the bridge into Week 4.

## 📖 Reference
- MDN — Flexbox: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
- MDN — Grids: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids

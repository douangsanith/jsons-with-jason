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

> 🎛️ **Play with it live:** the [App Brewery flexbox playground](https://appbrewery.github.io/flex-layout/)
> lets you toggle `justify-content`, `flex-wrap`, `align-items`, and `align-content` and watch the boxes rearrange
> instantly — the fastest way to build intuition for the properties below.

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

### 4b · `flex-basis` — the *starting size* before growing or shrinking

Remember `flex: 1 1 180px` on the cards? That's shorthand for **three** properties, and the last one is the
one people skip over:

```css
.row .card { flex: 1 1 180px; }
/* is exactly the same as: */
.row .card {
  flex-grow:   1;      /* may I get BIGGER to fill leftover space?  1 = yes */
  flex-shrink: 1;      /* may I get SMALLER if we run out of room?  1 = yes */
  flex-basis:  180px;  /* what's my IDEAL size BEFORE any grow/shrink? */
}
```

**`flex-basis` is the size an item *wants* to be**, measured along the main axis (width in a row, height in a
column). Flexbox starts every item at its `flex-basis`, then uses `grow`/`shrink` to divide up whatever space
is left over or missing. So the flow is: **basis first → then grow/shrink adjusts.**

- `flex-basis: 180px` → "start me at 180px." With `flex-grow: 1`, all cards start at 180 and then stretch
  equally to fill the row.
- `flex-basis: 0` (as in `flex: 1`) → "I have *no* preferred size; just split the container by the grow
  numbers." This is how you get **truly equal columns** regardless of content — each item's final width is
  purely its share of the space.
- `flex-basis: auto` (the default) → "use my `width`, or my content's natural size." Cards with more text
  end up wider. This is why `flex: 1` (basis 0) looks even but `flex: auto` (basis auto) doesn't.

**`flex-basis` vs `width`:** in a flex row, `flex-basis` *wins* over `width` — set the starting size with
`flex-basis` and let it be the single source of truth. (In a **column**, `flex-basis` controls **height**,
which surprises people the first time.)

| Shorthand | grow / shrink / basis | Behavior |
|---|---|---|
| `flex: 1` | `1 1 0` | equal columns, ignore content width |
| `flex: auto` | `1 1 auto` | grow to fill, but bigger content → wider item |
| `flex: none` | `0 0 auto` | fixed to content size; never grow or shrink |
| `flex: 1 1 180px` | `1 1 180px` | start at 180px, then share leftover space evenly |

### 4c · `order` — rearrange items *without* touching the HTML

By default flex items appear in **source order** — the order they're written in the HTML. The `order`
property lets you override that *visually* without moving a single line of markup:

```css
.row .card         { order: 0; }   /* default — everything is 0 */
.row .card.urgent  { order: -1; }  /* lower number = comes FIRST */
.row .card.archived{ order: 1; }   /* higher number = comes LAST */
```

Items are sorted by their `order` number (low → high); ties keep source order. Since the default is `0`, a
single `order: -1` is the quick trick to "float this one to the front," and `order: 1` sends one to the back —
without re-writing the HTML.

**Why this is useful:** the HTML can stay in the order that makes sense for *meaning* (and for screen readers),
while CSS arranges it for *looks* — and you can even flip that arrangement responsively:

```css
/* Keep an "Urgent" card first in the markup, but on wide screens show it last */
@media (min-width: 700px) {
  .row .card.urgent { order: 99; }
}
```

> ⚠️ **Same gotcha as `...-reverse`:** `order` changes the **visual** order only, *not* the DOM order.
> Keyboard tabbing and screen readers still follow the HTML. So `order` is great for **presentation**, but
> don't use it to fix an order that actually matters for reading or focus — fix the HTML for that.

**`order` vs `flex-direction: ...-reverse`:** `-reverse` flips *all* items at once; `order` repositions
*specific* items (or a few) precisely. Reach for `order` when only one or two things need to move.

### 4d · `flex-wrap` — `wrap` vs `nowrap` (does the row break onto new lines?)

`flex-wrap` decides what happens when the items don't all fit on one line:

```css
.row { display: flex; flex-wrap: nowrap; }  /* default — everyone stays on ONE line */
.row { display: flex; flex-wrap: wrap;   }  /* overflowing items drop to a NEW line */
```

- **`nowrap` (the default):** flex **forces every item onto a single line**, even if there's no room. To make
  them fit, it *shrinks* them (that's `flex-shrink` doing its job) — and once they can't shrink any further,
  they **overflow** the container. On a narrow screen this is how you get cards squished into unreadable
  slivers or spilling past the edge.
- **`wrap`:** when the line runs out of room, the next item **flows down to a new line** instead of shrinking
  everything. Each line then lays out on its own. This is what makes a row of cards **responsive** — it becomes
  as many rows as it needs as the window narrows.

That's why the lesson's `.row` uses `flex-wrap: wrap`: resize the window and the cards re-flow onto new lines
instead of getting crushed. Try switching it to `nowrap` and dragging the window narrow — you'll watch the
cards shrink and then overflow. That single word is the difference between "responsive" and "broken on mobile."

> **Mental model:** `nowrap` = "one line, no matter what (shrink or overflow)." `wrap` = "keep items their
> size; add more lines as needed." (There's also `wrap-reverse`, which wraps *upward* — rarely needed.)
>
> Note this is a **1-D** kind of wrapping. If you want a true 2-D grid where items align into neat rows **and**
> columns, that's what **CSS Grid** (section 3) is for.

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
3. **Play with `flex-basis`:** in the `.row .card` rule, change `flex: 1 1 180px` to `flex: 1` (basis `0`) —
   the cards become perfectly equal widths no matter their text. Then try `flex: none` — each card shrinks to
   just fit its own content and stops growing.
4. **Reorder without touching HTML:** with `class="row"`, add `.row .card:last-child { order: -1; }` to
   `styles.css` — the last card jumps to the **front** of the row, even though it's still last in the HTML.
5. **See `wrap` vs `nowrap`:** in `.row`, change `flex-wrap: wrap` to `flex-wrap: nowrap` and drag the window
   narrow — the cards shrink into slivers and then overflow instead of dropping to new lines. Switch it back to
   `wrap` to restore the responsive re-flow.
6. Back on the grid (`class="board"`), change `minmax(180px, 1fr)` to `minmax(120px, 1fr)` — more, narrower
   columns.
7. In `.card`, add `text-align: center;` and see every card's content center.

<details><summary>✅ What to expect</summary>

With `row`, cards sit in a spaced row that wraps on narrow screens. With `stack`, they run top-to-bottom, and
`align-items: center` narrows and centers them horizontally. `flex: 1` (basis `0`) makes every card an equal
width regardless of content, while `flex: none` sizes each card to its own text. `order: -1` visually moves the
last card to the front while the HTML stays put. `flex-wrap: nowrap` keeps everything on one line so cards
shrink then overflow; `wrap` lets them re-flow onto new lines. With smaller `minmax`, more columns fit per row.
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
- **Interactive flexbox playground** (App Brewery): https://appbrewery.github.io/flex-layout/ — flip
  `justify-content`, `flex-wrap`, `align-items`, and `align-content` and watch the items move in real time.
- MDN — Flexbox: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
- MDN — Grids: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids

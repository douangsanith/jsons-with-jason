# Week 3 · Day 3 — Layout: flexbox & grid

*Styling makes things pretty; layout puts them where you want. This is how Claude arranges a dashboard.*

**You'll ship:** the matters as a **responsive grid of cards** ([`index.html`](index.html) +
[`styles.css`](styles.css)) — and you'll know how to switch it to a flex **row**.

> 👉 **Open [`index.html`](index.html) in your browser, then drag the window narrower and wider** — watch the
> cards re-flow. That's responsive layout.

> 📝 **Learning copies:** [`index.annotated.html`](index.annotated.html) and
> [`styles.annotated.css`](styles.annotated.css) explain flex vs. grid line by line (what `auto-fit`, `minmax`,
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

> 🐼 **Coming from NumPy & pandas? Here's the shortcut.** You already learned this shape in Weeks 1–2 — it's
> the **1-D vs 2-D** distinction, just for layout instead of data:
>
> | Weeks 1–2 (data) | This week (layout) | Shape |
> |---|---|---|
> | A **1-D NumPy array** / a pandas **Series** — one axis | **Flexbox** — items along one axis (a row *or* a column) | **1-D** |
> | A **2-D DataFrame** — rows **and** columns | **CSS Grid** — cells in rows **and** columns | **2-D** |
>
> And the **axis** idea carries straight over. In pandas you pick a direction with `axis=0` (down the rows) or
> `axis=1` (across the columns); in flexbox you pick the **main axis** with `flex-direction: column` or `row`,
> and `justify-content` acts *along* that axis — just like a pandas operation runs along the axis you name.
> A DataFrame's **index (rows)** and **columns** are literally `grid-template-rows` and
> `grid-template-columns`.
>
> *(Where the analogy stops:* pandas is *built on top of* NumPy; CSS Grid is **not** built on flexbox — they're
> two independent, sibling layout systems. The useful part is the **1-D-vs-2-D / axis** intuition, not a
> layering.)*

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

## 3 · Flexbox — a single row

> 📐 **Why is layout "flexible" at all?** Because the browser can't know two things in advance: the **screen**
> (a 375px phone? a 4K monitor? a window dragged to any width?) and the **content** (client names, and *how
> many* matters, come from a database). Print design had a fixed page; the web doesn't. So instead of hard-coding
> a `width`, you write **rules that adapt** — *grow* into extra space, *shrink* when cramped, *wrap* to a new
> line when there's no room. Flexbox is exactly that: you describe the behavior, the browser computes the pixels
> for whatever screen and content actually show up. (`min-width`/`max-width` then keep that flexibility from
> going to unreadable extremes.) That shift — **from a fixed layout to a system that adapts** — is the whole
> mindset of responsive design.

> 🎛️ **Play with it live:** the [App Brewery flexbox playground](https://appbrewery.github.io/flex-layout/)
> lets you toggle `justify-content`, `flex-wrap`, `align-items`, and `align-content` and watch the boxes rearrange
> instantly — the fastest way to build intuition for the properties below.

`styles.css` also has a `.row` rule — the page's **second demo** (below the grid) uses it, so you can see the
same cards as a flex row:

```css
.row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
.row .card { flex: 1 1 180px; }
```

- `display: flex` lays children out in a **row**.
- `justify-content` spaces them along the row (`space-between`, `center`, `flex-start`).
- `flex-wrap: wrap` lets items drop to a new line instead of overflowing.
- `flex: 1 1 180px` = grow, shrink, ideal width 180px.

### 3a · `flex-direction` — row *or* column

`display: flex` defaults to a **row** (left → right), but that's just the default. One property,
`flex-direction`, flips the axis — this is the "or column" half of flexbox:

```css
.row    { display: flex; flex-direction: row; }            /* default → → left to right */
.stack  { display: flex; flex-direction: column; }         /* ↓ top to bottom          */
.row-r  { display: flex; flex-direction: row-reverse; }    /* ← → right to left        */
.stack-r{ display: flex; flex-direction: column-reverse; } /* ↑ bottom to top          */
```

`styles.css` has a `.stack` (column) version — the page's **third demo** uses it, so you can see the very same
cards run **top to bottom** instead of across, right below the row.

**The key idea — main axis vs cross axis.** Flex has two axes, and `flex-direction` decides which is which:

| `flex-direction` | Main axis (what `justify-content` controls) | Cross axis (what `align-items` controls) |
|---|---|---|
| `row` (default) | horizontal ← → | vertical ↑ ↓ |
| `column` | vertical ↑ ↓ | horizontal ← → |

So the *same* `justify-content: center` **centers horizontally** in a row but **vertically** in a column —
because it always follows the main axis. This trips everyone up once; after that it's second nature.

> **Gotcha:** `...-reverse` only flips *visual* order, not the HTML/DOM order — so keyboard and screen-reader
> users still move through the original source order. Use it for looks, not to fix real ordering.

### 3b · `flex-basis` — the *starting size* before growing or shrinking

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

#### The sizing ladder — who wins when several sizes disagree

You can set an item's size in *four* ways, and they don't fight randomly — there's a clear pecking order.
From **weakest to strongest** (each one overrides the ones before it):

> **content width  <  `width`  <  `flex-basis`  <  `min-width` / `max-width`**

Read it as: start from the content's natural size, and let each stronger rung *override* the last.

1. **Content width** — with nothing specified, an item is as wide as its content needs (the text inside). This
   is the fallback everything else builds on.
2. **`width`** — set an explicit `width` and it **overrides** the content size: the box is that width whether
   the content is bigger or smaller.
3. **`flex-basis`** — inside a flex container, a `flex-basis` *length* **beats `width`** and becomes the item's
   starting size. (`flex-basis: auto` is the one exception — it means "I have no opinion, fall back to `width`,
   then content." That's why `auto` sits *below* a real `flex-basis` on the ladder.)
4. **`min-width` / `max-width`** — these are the **final clamps** and win over *everything above*, including
   `flex-basis` and even the grow/shrink math. Whatever size flexbox computes, it's then squeezed to stay
   **≥ `min-width`** and **≤ `max-width`**. A `max-width` can shrink an item below its basis; a `min-width` can
   hold it above, no matter how hard flex-shrink pushes.

```css
.item {
  width: 200px;        /* rung 2 — overridden below in a flex row              */
  flex-basis: 300px;   /* rung 3 — this wins over width → item starts at 300px */
  max-width: 250px;    /* rung 4 — final clamp → item can never exceed 250px   */
}
/* Final: starts from 300px (basis), then clamped down to 250px (max-width). width:200px is ignored. */
```

> 💡 **The famous gotcha lives here.** Flex items have `min-width: auto` by default, and `auto` resolves to
> *their content size* — a rung-4 clamp. That's why a flex item often **refuses to shrink below its content**
> (long text or a wide image blows out the layout) even with `flex-shrink: 1`. The fix is to *lower* the clamp:
> set `min-width: 0` on the item so shrink can actually take effect.

### 3c · `order` — rearrange items *without* touching the HTML

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

### 3d · `flex-wrap` — `wrap` vs `nowrap` (does the row break onto new lines?)

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
> columns, that's what **CSS Grid** (section 4) is for.

**Flex is for one dimension (a row *or* column); grid is for two (rows *and* columns).**

> **Legal analogy:** flex is arranging exhibits **side by side on a table**; grid is a **full page layout**
> with rows and columns.

> 🔀 **See them head-to-head:** the [App Brewery grid-vs-flexbox tool](https://appbrewery.github.io/grid-vs-flexbox/)
> shows the same content laid out both ways, so you can feel *when* the 1-D flex model or the 2-D grid model is
> the right pick.

## 4 · Grid — rows and columns (what's in the file)

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

### 4a · The grid vocabulary: rows, columns, tracks & cells

Grid has a small, spreadsheet-like vocabulary. Learn these five words and the rest of grid reads easily. In the
map below, the numbers `①②③④` are the **grid lines**, the boxes are **cells**, and one shaded lane is a **track**:

```
   column lines →  ①        ②        ③        ④
                   ┌────────┬────────┬────────┐
   row line ① →    │  cell  │  cell  │  cell  │   ← row track 1
                   ├────────┼────────┼────────┤
   row line ② →    │  cell  │  cell  │  cell  │   ← row track 2
                   └────────┴────────┴────────┘
                   └── column track 1 ──┘
                        (gap = the space between two tracks)
```

- **Column** — a **vertical** lane of cells. `grid-template-columns` defines the columns (how many, how wide).
- **Row** — a **horizontal** lane of cells. `grid-template-rows` defines the rows (how many, how tall).
- **Track** — the general word for **one row *or* one column** — a single lane. When you write
  `grid-template-columns: 1fr 1fr 1fr`, you're creating and sizing **three column tracks**; `2fr 1fr` is two.
  "Track" is just what you call a row or column when you don't care which direction you mean.
- **Grid line** — the **numbered dividing lines** *between and around* the tracks. A grid with 3 columns has
  **4** vertical grid lines (①–④): line ① is the left edge, line ④ the right. Lines are how you place an item
  precisely — e.g. `grid-column: 1 / 3` means "span **from line 1 to line 3**" (covering the first two cells).
  Counting trips people up: **N tracks always have N + 1 lines.**
- **Cell** — the **intersection of one row and one column**: the smallest box in the grid, exactly like a
  spreadsheet cell. By default, each grid item (each `.card`) flows into the next available cell.

> 🧩 **How it fits together:** **grid lines** frame the **tracks** (rows and columns) you size with
> `grid-template-*`; the tracks cross to form **cells**; your items land in the cells; and **`gap`** is the
> spacing *between* tracks. In `.board`, `repeat(auto-fit, minmax(180px, 1fr))` makes a **variable number of
> column tracks**, grid adds as many **row tracks** as it needs, and each card sits in one **cell**.

> 🔬 **See it colored-in, live:** open [`grid-anatomy.html`](grid-anatomy.html) in your browser — it renders a
> real grid with the **grid lines numbered**, one **column track** and one **row track** highlighted, a single
> **cell** called out, and the **gaps** shaded, so every term above has a picture.

### 4b · The `fr` unit — fractional ratios (`1fr`, `2fr`, …)

That `1fr` is a unit you haven't seen before. **`fr` = "fraction of the leftover space."** Unlike `px` (a
fixed size) or `%` (a fraction of the *parent*), `fr` splits up **whatever space is left** after fixed sizes
and gaps are subtracted — and the **numbers are just a ratio**.

```css
/* Three columns that split the row 1 : 2 : 1 */
grid-template-columns: 1fr 2fr 1fr;
```

Here the space is divided into `1 + 2 + 1 = 4` shares: the middle column gets **2 shares (twice as wide)**,
the outer two get **1 share each**. So `2fr` isn't "2 pixels" or "200px" — it's **twice as wide as a `1fr`**,
whatever the screen size. Resize the window and the *ratio* stays 1:2:1 while the actual pixels change. A few
reads:

| `grid-template-columns` | Meaning |
|---|---|
| `1fr 1fr 1fr` | three **equal** columns (same as `repeat(3, 1fr)`) |
| `2fr 1fr` | two columns, the first **twice as wide** as the second |
| `1fr 1fr 1fr 1fr` | four equal columns — the classic 12-col grid is just `fr` shares |
| `250px 1fr` | a **fixed** 250px sidebar + a column that takes **all the rest** |

That last row is the everyday power move: mix a fixed `px` with `fr`, and `fr` absorbs whatever's left — no
math, no percentages that don't quite add up. (In `minmax(180px, 1fr)`, the `1fr` is doing exactly this: each
column can grow to fill its share of leftover space, but never gets narrower than 180px.)

> 🔗 **You already met this idea in flexbox.** `fr` ratios are the grid twin of **`flex-grow`** ratios: a
> column with `2fr` next to `1fr` takes twice the leftover space — just like an item with `flex-grow: 2` next
> to `flex-grow: 1`. Same "shares of what's left" concept, one for grid columns, one for flex items.

### 4c · `grid-template-rows` — the *other* axis

`grid-template-columns` sizes the **columns** (the horizontal tracks). Its twin, **`grid-template-rows`**,
sizes the **rows** (the vertical tracks) — same syntax, same units (`px`, `fr`, `auto`, `minmax`, `repeat`),
just the up/down direction.

You may have noticed `.board` never sets rows and still works. That's because grid **auto-creates rows** for
you as content wraps — these are *implicit* rows, sized to their content. You only reach for
`grid-template-rows` when you want to **control the heights** yourself. The classic case is a whole-page
"app shell":

```css
.app {
  display: grid;
  grid-template-rows: 60px 1fr 40px;   /* header | main | footer */
  min-height: 100vh;                   /* fill the screen top to bottom */
}
```

- `60px` — a fixed-height **header** row.
- `1fr` — the **main** area takes *all the leftover vertical space* (same `fr` idea, now vertical).
- `40px` — a fixed-height **footer** row.

Resize the window taller/shorter and the header and footer stay put while the middle grows or shrinks — the
vertical version of what `fr` did for columns. A few more row patterns:

| `grid-template-rows` | Meaning |
|---|---|
| `100px 100px` | two rows, each exactly 100px tall |
| `auto 1fr auto` | header & footer hug their content; middle fills the rest |
| `repeat(3, 1fr)` | three equal-height rows |
| `minmax(80px, auto)` | a row at least 80px tall that can grow with its content |

> 💡 **Rows and columns together = true 2-D.** Setting *both* `grid-template-columns` and
> `grid-template-rows` is what makes grid two-dimensional — you're defining a real matrix of cells. (For the
> *implicit* rows grid creates automatically, `grid-auto-rows: 120px` sets their height — handy for a card
> grid where you want every row the same height.)

### 4d · Placing items across cells — `grid-column` / `grid-row` (and `grid-area`)

So far every card has dropped into **one** cell automatically. But sometimes you want an item to **span
several cells** — a "featured" card twice as wide, a header stretching the full width. You do that by telling
the item which **grid lines** to start and end on (this is where §4a's line numbers pay off).

Two longhand properties name those lines:

```css
.featured {
  grid-column-start: 1;   /* begin at vertical grid line 1 */
  grid-column-end:   3;   /* end at vertical grid line 3   */
}
/* → the item now covers the two cells between lines 1 and 3 */
```

Remember: **lines**, not columns. In a 3-column grid the lines are 1–4, so `start: 1` / `end: 3` spans the
first *two* columns (line 1 → line 3).

The **vertical** direction has an identical pair, **`grid-row-start`** / **`grid-row-end`**, that works off the
**horizontal** grid lines the same way:

```css
.tall {
  grid-row-start: 1;   /* begin at horizontal grid line 1 */
  grid-row-end:   3;   /* end at horizontal grid line 3   */
}
/* → the item now spans the two rows between lines 1 and 3 (twice as tall) */
```

Use the two pairs **together** to place an item into a specific rectangle of cells — e.g. columns 1→3 *and*
rows 1→3 makes a 2×2 block in the top-left corner.

**The per-axis shorthands** collapse each pair into `start / end`:

```css
.featured {
  grid-column: 1 / 3;   /* = grid-column-start: 1; grid-column-end: 3; */
  grid-row:    1 / 3;   /* = grid-row-start: 1;    grid-row-end: 3;    */
}
```

**`grid-area` — the all-in-one shorthand.** One property sets **all four** lines at once. The order is
`row-start / column-start / row-end / column-end` (row values first, "top / left / bottom / right"):

```css
.featured {
  grid-area: 1 / 1 / 3 / 3;   /* rows 1→3, columns 1→3 → the 2×2 top-left block */
  /* identical to:
     grid-row-start: 1; grid-column-start: 1; grid-row-end: 3; grid-column-end: 3; */
}
```

So there are three levels of the same idea — pick whichever reads best:

| Level | Example | Sets |
|---|---|---|
| Longhand (4 props) | `grid-row-start: 1; grid-column-start: 1; …` | one line each |
| Per-axis shorthand | `grid-column: 1 / 3;` + `grid-row: 1 / 3;` | one axis each |
| `grid-area` | `grid-area: 1 / 1 / 3 / 3;` | **all four** lines |

> ⚠️ **Watch the order.** `grid-area`'s four numbers are `row-start / col-start / row-end / col-end` — rows
> first, *not* the "column then row" order you might expect from writing `grid-column` before `grid-row`. When
> in doubt, the per-axis `grid-column` / `grid-row` pair is harder to get wrong. *(`grid-area` can also take a
> **named** area instead of line numbers — that pairs with `grid-template-areas`, a nice next step once you're
> comfortable here.)*

**`span` — count instead of counting lines.** If you don't want to work out the end line, say how many tracks
to cover with the `span` keyword:

```css
.featured { grid-column: 1 / span 2; }  /* start at line 1, cover 2 columns */
.wide     { grid-column: span 2; }      /* cover 2 columns from wherever I land */
```

| Declaration | Meaning |
|---|---|
| `grid-column: 1 / 3` | start at line 1, end at line 3 → spans **2** columns |
| `grid-column: 1 / span 2` | start at line 1, span **2** columns (same result) |
| `grid-column: span 2` | span 2 columns starting at the item's natural spot |
| `grid-column: 1 / -1` | line 1 to the **last** line → span the **full width** (`-1` counts from the end) |

> 💡 **The full-width trick:** `grid-column: 1 / -1` makes an item stretch across **every** column no matter
> how many there are — perfect for a section header or a "no results" row sitting above a card grid.

### Where flexbox does this instead

Flexbox has no line-based placement — items just flow along the one axis. Its nearest equivalents are
**`order`** (§3c) to move an item and **`flex-basis`/`flex-grow`** (§3b) to size it. Precise "start here, span
that many cells" placement is a **grid-only** superpower, and the main reason to reach for grid over flex when
a layout is genuinely 2-D.

---

## ✍️ Your turn

1. **Compare the three layouts:** the page already shows the same cards as a **grid**, a **flex row**, and a
   **flex column**. Open `index.html`, then drag the window narrow and watch the grid and the row re-flow while
   the column just stays stacked.
2. **Center in the column:** in the `.stack` rule, add `align-items: center;` and watch the cards center
   **horizontally** — the cross axis in a column.
3. **Play with `flex-basis`:** in the `.row .card` rule, change `flex: 1 1 180px` to `flex: 1` (basis `0`) —
   the cards become perfectly equal widths no matter their text. Then try `flex: none` — each card shrinks to
   just fit its own content and stops growing.
4. **Reorder without touching HTML:** with `class="row"`, add `.row .card:last-child { order: -1; }` to
   `styles.css` — the last card jumps to the **front** of the row, even though it's still last in the HTML.
5. **See `wrap` vs `nowrap`:** in `.row`, change `flex-wrap: wrap` to `flex-wrap: nowrap` and drag the window
   narrow — the cards shrink into slivers and then overflow instead of dropping to new lines. Switch it back to
   `wrap` to restore the responsive re-flow.
6. **Try `fr` ratios:** on `.board`, replace the whole `grid-template-columns` value with `2fr 1fr 1fr` — the
   first column becomes **twice as wide** as the other two, and the ratio holds as you resize. Then try
   `250px 1fr` for a fixed sidebar + a flexible main column.
7. Back on the grid (`class="board"`), change `minmax(180px, 1fr)` to `minmax(120px, 1fr)` — more, narrower
   columns.
8. **Set row heights:** on `.board`, add `grid-auto-rows: 140px;` — every card row becomes the same height,
   even cards with less text. That's `grid-template-rows`' idea applied to the rows grid makes automatically.
9. **Span an item across cells:** add `.board .card:first-child { grid-column: 1 / -1; }` to `styles.css` — the
   first card now stretches across **every** column (a full-width banner) while the rest stay in the grid. Try
   `grid-column: span 2;` instead to make it cover just two columns.
10. In `.card`, add `text-align: center;` and see every card's content center.

<details><summary>✅ What to expect</summary>

With `row`, cards sit in a spaced row that wraps on narrow screens. With `stack`, they run top-to-bottom, and
`align-items: center` narrows and centers them horizontally. `flex: 1` (basis `0`) makes every card an equal
width regardless of content, while `flex: none` sizes each card to its own text. `order: -1` visually moves the
last card to the front while the HTML stays put. `flex-wrap: nowrap` keeps everything on one line so cards
shrink then overflow; `wrap` lets them re-flow onto new lines. `2fr 1fr 1fr` makes the first column twice as
wide as the others (a fixed 1:2 ratio); `250px 1fr` pins a sidebar and lets the rest flex. With smaller
`minmax`, more columns fit per row. `grid-auto-rows: 140px` makes every card row the same height.
`grid-column: 1 / -1` on the first card makes it span the full width (a banner); `span 2` covers two columns.
`text-align: center` centers the card text. Flex/grid properties go on the **container** (except item-placement
like `grid-column`, which goes on the **item**); if nothing changes, make sure you edited the right class.
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
6. On the sizing ladder, what beats a `flex-basis` length? *(`min-width`/`max-width` — the final clamps)*
7. A flex item won't shrink below its long text even with `flex-shrink: 1`. Why, and the fix? *(default
   `min-width: auto` = content size; set `min-width: 0`)*
8. In `grid-template-columns: 2fr 1fr`, how wide is the first column vs the second? *(twice as wide — `fr` is a
   ratio of leftover space)*
9. What does `grid-template-rows` control, and when do you need it? *(the row heights / vertical tracks — when
   you want to set them yourself instead of the content-sized rows grid makes automatically)*
10. A grid has 4 columns. How many vertical **grid lines** does it have, and what's a **cell**? *(5 lines —
    N tracks ⇒ N+1 lines; a cell is one row × one column, the smallest box)*
11. What does `grid-column: 1 / -1` do, and what's the longhand for `grid-column: 1 / 3`? *(spans the full
    width — line 1 to the last line; longhand is `grid-column-start: 1; grid-column-end: 3`)*

## ➡️ Next — [04-anatomy-of-an-artifact](../04-anatomy-of-an-artifact/)
You can structure, style, and lay out a page. Next we zoom out to the **whole file** Claude hands you —
`<head>`, `<style>`, `<script>` — and a **playbook** for what's safe to change. It's the bridge into Week 4.

## 📖 Reference
- **Interactive flexbox playground** (App Brewery): https://appbrewery.github.io/flex-layout/ — flip
  `justify-content`, `flex-wrap`, `align-items`, and `align-content` and watch the items move in real time.
- **Grid vs flexbox, side by side** (App Brewery): https://appbrewery.github.io/grid-vs-flexbox/ — the same
  content laid out both ways, to build intuition for when each is the right tool.
- MDN — Flexbox: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
- MDN — Grids: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids

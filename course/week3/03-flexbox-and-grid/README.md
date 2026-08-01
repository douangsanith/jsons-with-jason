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

## 2 · Grid — rows and columns (what's in the file)

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

## 3 · Flexbox — a single row

`styles.css` also has a `.row` rule (unused until you switch to it):

```css
.row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
.row .card { flex: 1 1 180px; }
```

- `display: flex` lays children out in a **row**.
- `justify-content` spaces them along the row (`space-between`, `center`, `flex-start`).
- `flex-wrap: wrap` lets items drop to a new line instead of overflowing.
- `flex: 1 1 180px` = grow, shrink, ideal width 180px.

**Flex is for one dimension (a row *or* column); grid is for two (rows *and* columns).**

> **Legal analogy:** flex is arranging exhibits **side by side on a table**; grid is a **full page layout**
> with rows and columns.

---

## ✍️ Your turn

1. **Switch grid → flex:** in `index.html`, change `<div class="board">` to `<div class="row">`, save,
   refresh. Same cards, laid out by flexbox. Resize the window to see wrapping.
2. Back on the grid (`class="board"`), change `minmax(180px, 1fr)` to `minmax(120px, 1fr)` — more, narrower
   columns.
3. In `.card`, add `text-align: center;` and see every card's content center.

<details><summary>✅ What to expect</summary>

With `row`, cards sit in a spaced row that wraps on narrow screens. With smaller `minmax`, more columns fit
per row. `text-align: center` centers the card text. Flex/grid properties go on the **container**; if nothing
changes, make sure you edited the container's class, not the `.card`.
</details>

## 📝 Recap
- **Normal flow** stacks block elements; layout tools override it.
- **Flexbox** = 1-D (a row): `display: flex`, `gap`, `justify-content`, `flex-wrap`.
- **Grid** = 2-D: `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(...))`.
- Both go on the **container**; `gap` spaces items; auto-fit/wrap makes it **responsive**.

## 🧠 Check yourself
1. Does `display: flex` go on the container or the items? *(container)*
2. Flex vs grid — when each? *(one dimension vs two)*
3. What does `repeat(auto-fit, minmax(180px, 1fr))` do? *(responsive columns in one line)*

## ➡️ Next — [04-anatomy-of-an-artifact](../04-anatomy-of-an-artifact/)
You can structure, style, and lay out a page. Next we zoom out to the **whole file** Claude hands you —
`<head>`, `<style>`, `<script>` — and a **playbook** for what's safe to change. It's the bridge into Week 4.

## 📖 Reference
- MDN — Flexbox: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
- MDN — Grids: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids

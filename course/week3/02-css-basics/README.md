# Week 3 · Day 2 — CSS basics: making the artifact look good

*Same page, new coat of paint. CSS is how a bare HTML page becomes a dashboard.*

**You'll ship:** [`index.html`](index.html) styled by an external [`styles.css`](styles.css) — colors,
spacing, borders — using the `class` hooks from Lesson 1.

> 👉 **Open [`index.html`](index.html) in your browser.** Then edit `styles.css`, save, and **refresh** to
> see each change. (Structure in `index.html` never changes today — only the stylesheet.)

---

## 🎯 Objectives
- Explain what **CSS** is and the three ways to apply it (inline, `<style>`, external file).
- Write **selectors** — by tag, by `.class`, by `#id`.
- Use the **box model** — `padding`, `border`, `margin`.
- Set **colors, fonts, spacing, and rounded corners**.

## ⚖️ Why it matters
Structure (HTML) and style (CSS) are deliberately separate: **90% of "make it look like ours" changes are
CSS-only** — brand colors, spacing, a cleaner table — with no change to the HTML. That separation is what
lets you re-skin a Claude artifact fast.

> **Legal analogy:** if HTML is the *content* of a document, CSS is the firm's **formatting standard** —
> letterhead, fonts, margins — applied without rewriting a word.

---

## 1 · What CSS is, and where it lives

A CSS **rule** is a **selector** plus a `{ property: value; }` block:

```css
h1 { color: #1e3a8a; }     /* every <h1> turns navy */
```

Three places CSS can live:
- **Inline** — `style="color: teal;"` on one element (quick, doesn't scale).
- **`<style>` block** — rules inside the page (what Claude usually emits).
- **External file** — `<link rel="stylesheet" href="styles.css">` (the production norm — what we use here).

We link an external `styles.css` because it's the cleanest: structure in one file, style in another.

## 2 · Selectors — tag, `.class`, `#id`

- **`h1`** — every `<h1>`.
- **`.subtitle`** — every element with `class="subtitle"` (a **dot** = class).
- **`#footer`** — the element with `id="footer"` (a **hash** = id; ids are unique).

Look at `styles.css`: `.mi-dashboard`, `.subtitle`, `table.matters`, `.disclaimer` all target the hooks you
found in Lesson 1. **The core move: change the look by targeting classes, not by editing structure.**

## 3 · The box model — `padding`, `border`, `margin`

Every element is a **box** with three layers of spacing:
- **`padding`** — space *inside* the box (content → border).
- **`border`** — the line around the box.
- **`margin`** — space *outside* the box (box → neighbors).

In `styles.css`, `.mi-dashboard` uses all three (`padding: 20px`, `border`, `margin: 24px auto`) plus
`border-radius` to become a rounded **card**. Cards are the building block of every dashboard.

> **Legal analogy:** the box model is a document's **margins and indents** — padding is whitespace inside a
> text box, margin is the gap to the next block.

## 4 · Colors, spacing, and a clean table

Skim `styles.css` and match each rule to what you see:
- `color` / `background` set text and fill colors (hex codes like `#1e3a8a`).
- `font-family` sets the typeface; `font-size` the size.
- `border-collapse: collapse` + `padding` turn the raw table into a tidy one.
- `tbody tr:hover { background: … }` highlights a row when you point at it — **hover over a row in the browser.**

---

## ✍️ Your turn — edit `styles.css` only

1. Change the `<h1>` color from navy `#1e3a8a` to teal `#0f766e`.
2. Give the header cells more room: change `padding: 8px 10px;` (on `th, td`) to `padding: 12px 10px;`.
3. Add a subtle brand bar — a new rule:
   ```css
   .mi-dashboard { border-top: 4px solid #1e3a8a; }
   ```

<details><summary>✅ What to expect</summary>

The title turns teal, the table rows get taller, and a colored bar sits across the top of the card. If a
change doesn't apply, check: dot for class vs hash for id, every declaration ends with `;`, and sizes have
units (`12px`, not `12`).
</details>

## 📝 Recap
- **CSS** styles HTML via rules: `selector { property: value; }`.
- Apply it **inline**, in a **`<style>`** block, or an **external file** (best).
- **Selectors:** `tag`, `.class`, `#id`.
- **Box model:** `padding` (inside) · `border` · `margin` (outside) → a **card**.

## 🧠 Check yourself
1. What symbol starts a **class** selector vs an **id** selector? *(`.` vs `#`)*
2. Difference between `padding` and `margin`? *(inside vs outside the box)*
3. Why keep CSS in a separate file from the HTML? *(structure vs style separation; reuse)*

## ➡️ Next — [03-flexbox-and-grid](../03-flexbox-and-grid/)
You can style a page; next you'll **arrange** it — matter **cards** in a responsive row and grid with
`display: flex` and `display: grid`.

## 📖 Reference
- MDN — CSS first steps: https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps
- MDN — The box model: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model

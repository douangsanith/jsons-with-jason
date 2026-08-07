# Week 3 · Day 4 — Anatomy of a Claude artifact

*Zoom out from tags to the whole file. What are all the parts Claude hands you — and which are safe to change?*

**You'll ship:** a complete, **self-contained** [`matter-intelligence.html`](matter-intelligence.html) —
structure + style + a working bit of script — and a **modification playbook** for editing artifacts safely.
It also puts **Day 3's layout tools to work**: **flexbox** rows for the header and toolbar, and a responsive
**CSS grid** of summary tiles.

> 👉 **Open [`matter-intelligence.html`](matter-intelligence.html) and click "Show active only."** This time
> the JavaScript actually runs (it's a real browser, not a notebook) — the table filters, the count updates,
> and the **grid of summary tiles recalculates**. Now **resize the window** and watch the tiles reflow from
> 4-up to 2-up to 1-up (that's the grid) while the header/toolbar keep their ends apart (that's flexbox).

> 📝 **Learning copy:** [`matter-intelligence.annotated.html`](matter-intelligence.annotated.html) is the same
> self-contained file with comments walking through every layer — the flexbox/grid CSS, the `data-active`
> attributes, and every line of the `<script>`. Read that to learn; use the clean file to build.

---

## 🎯 Objectives
- Read the **full document skeleton**: `<!DOCTYPE html>`, `<head>`, `<body>`.
- Explain what lives in **`<head>`** (title, `<style>`) vs **`<body>`** (content), and what a `<script>` does.
- Understand **self-contained** artifacts (inline CSS/JS, data URIs) and **escaping** (`&amp;`).
- Apply a **modification playbook**: safe edits vs. developer edits.

## ⚖️ Why it matters
A Claude artifact arrives as **one self-contained file** — HTML, CSS, and JavaScript all inlined so it "just
works." To productionize it, open the file and know **what each part is** and **what you can touch**. Change
the wrong thing (the script logic) and it breaks; change the right things (text, colors, data) and you've
shipped an update.

---

## 1 · The self-contained file — one document, everything inline

Open the file in your editor. Top to bottom, it's four parts:

```html
<!DOCTYPE html>          <!-- "this is modern HTML" -->
<html lang="en">
  <head> … </head>       <!-- metadata + <style>  (not shown on the page) -->
  <body> …               <!-- everything you see -->
    <script> … </script> <!-- behavior; runs in the browser -->
  </body>
</html>
```

Everything it needs — styles and script — is **inlined**, so the single file runs anywhere with no
dependencies. That's why a Claude artifact is one `.html` you can just double-click.

## 2 · `<head>` vs `<body>`

- **`<head>`** — *metadata*: `<title>` (the browser-tab name), `<meta>` (encoding, mobile viewport), and the
  `<style>` block. None of it renders on the page directly.
- **`<body>`** — everything visible: the header, toolbar, table, footer.

**Editing rule of thumb:** brand/layout → `<head>`'s `<style>`; content → `<body>`.

> 🔁 **Day 3 in the wild.** The `<style>` here reuses the exact patterns you learned in
> [`03-flexbox-and-grid/`](../03-flexbox-and-grid/): `.page-head`/`.toolbar` are **flexbox** rows
> (`display: flex; justify-content: space-between`), and `.stats` is a responsive **grid**
> (`grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`). Same tools, now inside a real artifact.

## 3 · The `<script>` — behavior

Near the end of `<body>` is a `<script>`: the JavaScript that makes the page *do* something. In this file it
wires the button's **click** to code that hides non-active rows and updates the count. You clicked it and it
worked — that's an **event handler**, the heart of every interactive artifact. (JavaScript is Week 4's whole
topic; today just recognize the block and know it runs in the browser.)

## 4 · Self-contained tricks: data URIs & escaping

- **Data URIs** — an image embedded *as text* inline: `<img src="data:image/png;base64,iVBOR…">`. No separate
  file — the bytes live in the HTML. (That's why Claude artifacts never have missing images.)
- **Escaping** — to show characters that mean something in HTML, write **entities**: `&amp;` → `&`,
  `&lt;` → `<`, `&gt;` → `>`. Notice the Cedar Holdings row uses `M&amp;A` to display "M&A".

## 5 · The modification playbook

Sort every requested change into one bucket:

| ✅ Safe to change yourself | ⚠️ Change carefully | 🧑‍💻 Hand to a developer |
|---|---|---|
| Text & labels in `<body>` | Colors/spacing in `<style>` | Logic inside `<script>` |
| The data in a table/list | Layout (`flex`/`grid`) values | Anything with `fetch`/APIs |
| The `<title>` | Adding a new card/section | Build tooling / dependencies |

**Rule of thumb:** content and styling are yours; **program logic (the `<script>`) is where Week 4 starts.**

---

## ✍️ Your turn — make edits in each bucket

1. ✅ **Safe:** change the `<title>` to `Matters — Q3`, and change the "Litigation" cell to `Litigation · Active`.
2. ⚠️ **Careful:** in the `<style>`, change `h1 { color: #1e3a8a; }` to your firm's color.
3. ⚠️ **Layout (Day 3):** in `.stats`, change `minmax(150px, 1fr)` to `minmax(220px, 1fr)` and refresh —
   the tiles need more room, so fewer fit per row. Then try `justify-content: center` on `.toolbar`.
4. 🧑‍💻 **Logic (read, don't fear):** in the `<script>`, find where it sets the button text and change
   `'Show all'` to `'Show every matter'`. Refresh and click — you just edited behavior.

<details><summary>✅ What to expect</summary>

The tab title changes, the practice-area cell reads "Litigation · Active," the heading recolors, the summary
tiles get wider (fewer per row), and the toggle button now says "Show every matter" after you click it. If the
button stops working, you likely broke a quote or removed a `;` in the `<script>` — undo and try a smaller edit.
</details>

## 📝 Recap
- A Claude artifact is **one self-contained file**: `<!DOCTYPE html>` › `<head>` (title, `<style>`) › `<body>`
  (content, `<script>`).
- **`<head>`** = metadata/brand; **`<body>`** = what you see; **`<script>`** = behavior (runs in the browser).
- **Layout** comes from Day 3: **flexbox** for the header/toolbar rows, responsive **grid** for the tiles.
- **Self-contained** via inline CSS/JS and **data URIs**; special characters use **escaping** (`&amp;`).
- The **playbook**: text/data ✅ · styling/layout ⚠️ · `<script>`/APIs 🧑‍💻.

## 🧠 Check yourself
1. What's the difference between `<head>` and `<body>` content?
2. What makes an artifact "self-contained"?
3. From the playbook, which edits are safe vs. developer work?

## ➡️ Next — Week 4: [JavaScript & React](../../week4/)
You've mastered the structure/style/layout of an artifact. **Week 4** brings it to life: **JavaScript**
(that `<script>` in depth), then **React** components, and finally porting an artifact into a real
**Vite + TypeScript** project you build and run.

## 📖 Reference
- MDN — The document `<head>`: https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML
- MDN — Data URLs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs

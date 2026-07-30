# Week 3 · Day 1 — HTML structure: reading a Claude artifact

*The fastest way to learn HTML isn't a blank page — it's reading the page Claude already wrote you.*

**You'll ship:** the ability to open [`matter-intelligence.html`](matter-intelligence.html), understand
**every tag**, and modify it — the first tangible piece of the *Matter Intelligence* UI.

> 👉 **Open [`matter-intelligence.html`](matter-intelligence.html) in your browser now** (double-click it),
> and keep it side-by-side with this lesson and the file in your editor.

---

## 🎯 Objectives
- Explain what **HTML** is and what an **element** (tag) is.
- Read **opening/closing tags, content, and nesting** — and see a page as a **tree**.
- Identify **attributes** (`href`, `class`, `id`) and what they do.
- Recognize the **semantic structure tags** Claude uses (`header`, `main`, `section`, `table`, `ul`, `footer`).
- **Modify** a Claude HTML artifact and see the change in the browser.

## ⚖️ Why it matters
Your team keeps asking Claude for artifacts — a dashboard, a matter viewer — and Claude hands back **HTML**.
To productionize one, you must **read and change the code**: swap the data, fix a label, adjust the title.
That reading skill is this whole week, and it starts with structure.

---

## 1 · HTML is made of elements (tags)

An **element** is content wrapped in **tags**: an opening tag `<p>`, the content, and a closing tag `</p>`.
The tag name says *what kind of thing* this is. Headings run `<h1>` (biggest) to `<h6>` (smallest); `<p>` is a
paragraph.

```html
<h1>Matter Intelligence</h1>
<p>A dashboard for our active matters.</p>
```

> **Legal analogy:** a tag is a **labeled field on a form** — `<p>…</p>` says "this part is a paragraph,"
> the way a form labels a box "Client Name."

## 2 · Elements nest into a tree

Elements sit inside other elements. In our file, each `<tr>` (table row) contains `<td>` (data cells), and
the `<ul>` contains `<li>` items. Indentation shows the nesting. The browser sees the whole page as a **tree**
— the **DOM** (Document Object Model):

```
header
├─ h1            "Matter Intelligence"
└─ p             "Active matters overview…"
main
├─ section
│  ├─ h2         "Top active matters"
│  └─ table → thead (tr → th×4) + tbody (tr×3 → td×4)
└─ section
   ├─ h2         "Notes"
   └─ ul → li×2   (one li contains an <a> link)
footer
└─ p             "Not legal advice…"
```

> **Legal analogy:** the DOM is a **document outline** — articles containing sections containing clauses.

## 3 · Attributes add information

An **attribute** lives in the opening tag as `name="value"`. In our file:
- `<a href="https://example.com/docket">` — `href` is *where the link goes*.
- `<html lang="en">` — declares the page language.

`class` and `id` are the attributes you'll use most next lesson (to style and find elements). **Attribute
values go in quotes.**

## 4 · The tags Claude uses to structure a page

Open `matter-intelligence.html` and find each one:

| Tag | Meaning |
|---|---|
| `<header>` | top banner (title, intro) |
| `<main>` | the primary content |
| `<section>` | a grouped chunk of content |
| `<table>` / `<tr>` / `<th>` / `<td>` | table / row / header cell / data cell |
| `<ul>` / `<li>` | bulleted list / list item |
| `<footer>` | bottom notes / disclaimer |

## 5 · Reading a Claude artifact — the 3 questions

When Claude hands you HTML, read it by asking:
1. **What are the regions?** Scan for `<header>`/`<main>`/`<section>`/`<footer>` — that's the outline.
2. **Where's the data?** Find the `<table>`/`<ul>` — that's what you'll swap for real matters.
3. **What's a hook?** Note `id`/`class`/`href` — what you (or a developer) grab to style or wire up.

**Outline → data → hooks.** That's the whole skill.

---

## ✍️ Your turn — edit the file

Open `matter-intelligence.html` in your editor, make these changes, then **refresh the browser**:

1. Change the `<h1>` from `Matter Intelligence` to `Matter Dashboard`.
2. Add a new table row (keep the `<td>` count at 4):
   ```html
   <tr><td>M-1003</td><td>Cedar Holdings</td><td>M&amp;A</td><td>$131,200.00</td></tr>
   ```
   *(`&amp;` is how you write a literal `&` in HTML — more on escaping in Lesson 4.)*
3. Add a third note: `<li>Updated weekly.</li>`.

<details><summary>✅ What it should look like</summary>

The heading reads **Matter Dashboard**, the table has **four** matters (Cedar Holdings shows "M&A"), and the
Notes list has **three** items. If the page breaks, check that every tag you added has a matching closing tag
and the same number of `<td>` cells as the header row.
</details>

## 📝 Recap
- **HTML** describes a page with **elements**: `<tag>content</tag>`.
- Elements **nest** into a **tree** (the DOM); **attributes** (`href`, `class`, `id`) add info and hooks.
- Claude structures pages with **semantic tags** (`header`/`main`/`section`/`table`/`ul`/`footer`).
- You read an artifact by **outline → data → hooks**, then modify it.

## 🧠 Check yourself
1. What are the three parts of a typical element? *(open tag, content, close tag)*
2. Where does an attribute go, and how is it written? *(inside the opening tag, `name="value"`)*
3. Which tag makes a bulleted list, which makes each item? *(`<ul>`, `<li>`)*

## ➡️ Next — [02-css-basics](../02-css-basics/)
The page works but looks plain. Next we add **CSS** to style it — using the `class`/`id` hooks — with a real
external `styles.css`.

## 📖 Reference
- MDN — Intro to HTML: https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML
- MDN — HTML element reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element

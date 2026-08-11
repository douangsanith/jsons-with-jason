# Week 3 — HTML & CSS: reading Claude's markup

The web track, taught in **real files you open in a browser** — no notebooks. The whole week is built
around one skill: **reading and modifying the HTML/CSS that Claude produces**, so your team can take an
artifact from "neat demo" to "something we ship."

Everything here is a coffee-free, matters-themed **Matter Intelligence** page you'll grow across the week.

## How to view these lessons

Each lesson is a folder with a short `README.md` (the lesson) and real files. To see a page:

- **Easiest:** double-click the `.html` file — it opens in your default browser.
- **From a terminal:** `open 01-html-structure/matter-intelligence.html` (macOS).
- **Live-reload (optional):** from a lesson folder run `python3 -m http.server` and visit
  `http://localhost:8000` — the page reloads when you refresh after an edit.

No install, no keys, no internet required for Week 3. Just a browser and a text editor (VS Code is great).

## Lessons

| Day | Folder | Topic | You'll build |
|---|---|---|---|
| **Mon** | [`01-html-structure/`](01-html-structure/) | HTML structure, semantic tags, the DOM tree | read & modify a Claude HTML artifact |
| **Tue** | [`02-css-basics/`](02-css-basics/) | selectors, the box model, an external stylesheet | style the page with `styles.css` |
| **Thu** | [`03-flexbox-and-grid/`](03-flexbox-and-grid/) | flexbox rows + responsive CSS grid | a responsive matters dashboard |
| **Fri** | [`04-anatomy-of-an-artifact/`](04-anatomy-of-an-artifact/) | the self-contained file (head/body/script), data URIs, escaping | a shippable artifact + a "safe-edit" playbook |

## Why layout looks the way it does (a little history)

Modern CSS makes columns easy — `display: flex` or `display: grid` plus a `gap`. It wasn't always so. For
~15 years (roughly 2000–2016) there **was no layout system**, so people faked columns with tools built for
other jobs:

- **`float`** — meant for wrapping text around images; abused for columns, and it made containers **collapse
  to zero height** unless you pasted in a **clearfix** hack.
- **`display: inline-block`** — laid items out like words, so the **whitespace between your HTML tags became
  real gaps** that broke your math.
- **`.col` frameworks** (Bootstrap, 960.gs) — hid the float hacks behind class names like `col-md-4`, at the
  cost of a rigid 12-column model and a big CSS file.

**Flexbox (2013)** and **Grid (2017)** were the first properties *designed for layout*, which is why things
that used to take hacks (gaps, vertical centering, equal-height columns) are now one line. Day 3 tells the
full story with code — and [`03-flexbox-and-grid/float-demo.html`](03-flexbox-and-grid/float-demo.html) lets
you watch the old `float` problem break and get fixed in the browser.

## The two ideas that carry the whole week

1. **Read any artifact as _outline → data → hooks_.** Find the regions (`header`/`main`/`section`/`footer`),
   then the data (`<table>`/`<ul>`), then the hooks (`id`/`class`) you'll style or wire up.
2. **The modification playbook** (Lesson 4): text & data are ✅ safe to change yourself; colors/layout are
   ⚠️ careful; program logic (`<script>`) and APIs are 🧑‍💻 developer territory — which is exactly where
   **Week 4 (JavaScript)** picks up, before **Week 5** rebuilds the page in React.

> Synthetic data only — never put real client or privileged data in a teaching file.
> Not legal advice — a lawyer reviews any AI output that will be relied upon.

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

## The two ideas that carry the whole week

1. **Read any artifact as _outline → data → hooks_.** Find the regions (`header`/`main`/`section`/`footer`),
   then the data (`<table>`/`<ul>`), then the hooks (`id`/`class`) you'll style or wire up.
2. **The modification playbook** (Lesson 4): text & data are ✅ safe to change yourself; colors/layout are
   ⚠️ careful; program logic (`<script>`) and APIs are 🧑‍💻 developer territory — which is exactly where
   **Week 4 (JavaScript & React)** picks up.

> Synthetic data only — never put real client or privileged data in a teaching file.
> Not legal advice — a lawyer reviews any AI output that will be relied upon.

# Week 4 — JavaScript fundamentals

The web track continues in **real files** — no notebooks. Week 3 you learned to *read* the HTML and CSS Claude
writes. This week you learn the third language: the one that makes a page **do** something.

Everything builds toward one moment on Thursday, when Week 3's static **Matter Intelligence** dashboard starts
filtering as you type — and toward Week 5, where React takes over the tedious half of that job.

## Lessons

| Day | Folder | Topic | You'll build |
|---|---|---|---|
| **Mon** | [`01-values-and-functions/`](01-values-and-functions/) | `const`/`let`, types, objects, functions, arrow functions | `node matters.js` — a matter summary line |
| **Tue** | [`02-arrays-and-objects/`](02-arrays-and-objects/) | arrays of objects, `filter`/`map`/`reduce`, `sort`, chaining | `node matters-report.js` — a billing report |
| **Thu** | [`03-dom-and-events/`](03-dom-and-events/) | the DOM, `getElementById`, `addEventListener`, `render()` | an **interactive** matters dashboard |
| **Fri** | [`04-modules-and-async/`](04-modules-and-async/) | `import`/`export`, destructuring, spread, `?.`, `async`/`await` | a modular script fed by a fake API |

Each lesson is a folder with a `README.md` (the lesson) and the real files it teaches. Every code file also ships
as a `.annotated.js` / `.annotated.html` twin with a plain-English comment on nearly every line — **read the
annotated one to learn, use the clean one to build.** Both produce identical output.

## The TypeScript thread

Days 1, 2 and 4 each carry a **`.ts` twin** of the day's script — the *same program*, with types:

| Day | File | Adds |
|---|---|---|
| **Mon** | [`01-values-and-functions/matters.ts`](01-values-and-functions/matters.ts) | annotations (`: string`), a `type`, unions, inference |
| **Tue** | [`02-arrays-and-objects/matters-report.ts`](02-arrays-and-objects/matters-report.ts) | `Matter[]`, inferred callbacks, `Matter \| undefined` |
| **Fri** | [`04-modules-and-async/main.ts`](04-modules-and-async/main.ts) + [`types.ts`](04-modules-and-async/types.ts) | a shared type module, `Promise<Matter[]>`, optional fields |

Run them exactly like the `.js` files — `node matters.ts` — and the output is byte-for-byte identical. **This
needs Node 22.18 or newer and nothing else**; Node strips the types and runs what's left. Day 3 has no `.ts` twin
on purpose (typing raw DOM lookups is noise; the lesson says why).

Meeting types here, on plain values and arrays, is far easier than meeting them for the first time wrapped in
JSX. By Week 5 you'll already know what `Matter[]` means — that day can then teach what's actually new: typed
props, and a build that refuses to ship a mistake.

## What you need

- **Node.js** for Days 1, 2 and 4 (`node --version` to check; install from [nodejs.org](https://nodejs.org)).
  **Version 22.18 or newer** if you want to run the `.ts` files; the `.js` files work on anything.
- **A browser** for Day 3 — just double-click the `.html` file.
- **Python 3** for Day 4's browser demo (`python3 -m http.server`), already on every Mac.

No installs, no keys, no internet. The one `npm install` in this course arrives next week.

## How to view these lessons

- **Terminal lessons (Days 1, 2, 4):** `node matters.js` from inside the day's folder.
- **Browser lessons (Day 3):** double-click the `.html` file, or `open 03-dom-and-events/dashboard.html`.
- **Day 4 is the exception** — ES modules must be served over HTTP, so run `python3 -m http.server` from that
  folder and visit `http://localhost:8000`. Double-clicking that page will not work, and the lesson explains why.

## The through-line

Day 1 gives you **one** matter. Day 2 makes it a **list**, and introduces the `map` that does all the work from
here on. Day 3 puts that list **on a page** and lets a user change what's shown. Day 4 tidies the result into
**modules** and teaches the shorthand — destructuring, spread, `?.`, `await` — that React code is written in.

> **The one line to carry into Week 5:** `matters.map(...)` — turning a list of data into a list of somethings.
> On Thursday each item becomes a string of HTML. Next Monday, each becomes a `<MatterCard />`.

**Next (Week 5):** [React + Vite + TypeScript](../week5/) — the same dashboard, rebuilt as components, then fed
by a real `fetch` over HTTP.

> Synthetic data only — never put real client or privileged data in a teaching file.
> Not legal advice — a lawyer reviews any AI output that will be relied upon.

# Week 4 — JavaScript fundamentals

The web track continues in **real files** — no notebooks. Week 3 you learned to *read* the HTML and CSS Claude
writes. This week you learn the third language: the one that makes a page **do** something.

Everything builds toward one moment on Thursday, when Week 3's static **Matter Intelligence** dashboard starts
filtering as you type — and toward Week 5, where React takes over the tedious half of that job.

## Lessons

| Day | Folder | Topic | You'll build |
|---|---|---|---|
| **Mon** | [`01-values-and-functions/`](01-values-and-functions/) | `const`/`let`, types, objects, functions, arrow functions | `node matters.js` — a matter summary line |
| **Tue** | [`02-arrays-and-objects/`](02-arrays-and-objects/) | arrays of objects, `filter`/`map`/`reduce`, `sort`, chaining, loops | `node matters-report.js` — a billing report |
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
- **To poke at any terminal lesson interactively:** run `node` on its own and use `.load` — see
  [The Node REPL](#the-node-repl--a-scratchpad-for-trying-things) below.

## The Node REPL — a scratchpad for trying things

Run `node` with **no filename** and you get a prompt instead of a program. That prompt is the **REPL**, which
stands for **Read–Eval–Print Loop** — it *reads* the line you type, *evaluates* it, *prints* the result, and
*loops* round for the next one. It's the fastest way to answer "what does this actually do?" without editing a
file and re-running it.

```
$ node
Welcome to Node.js v22.23.1.
> 2 + 2
4
> "Acme Corp".toUpperCase()
'ACME CORP'
> [10, 20, 30].filter((n) => n > 15)
[ 20, 30 ]
```

Notice it prints the **value** of every line, not just what you `console.log`. That's the "Print" in REPL, and
it's why the REPL is better than a file for poking at a single expression.

### `.load` — pull a lesson file into your session

Lines starting with a dot are commands to the REPL itself, not JavaScript. The useful one here is `.load`:

```
> .load matters.js
```

That runs the whole file **in your current session**, so all its output appears *and* every `const` and function
it defined stays available to play with:

```
> matter.client
'Acme Corp'
> feeNote(2500)
'$2500.00 billed to date'
> statusLabel(matter)
'Active'
```

This is a genuinely good way to work through Days 1, 2 and 4: `node matters.js` shows you the output, then
`.load matters.js` lets you take the pieces apart. The commands worth knowing:

| Command | Does |
|---|---|
| `.load <file>` | run a `.js` file in this session, keeping its variables |
| `.editor` | multi-line paste mode — `Ctrl-D` to run, `Ctrl-C` to cancel |
| `.break` | abandon a half-typed multi-line expression |
| `.help` | list every dot-command |
| `.exit` | leave (or `Ctrl-D`, or `Ctrl-C` twice) |

### ⚠️ `.load` does not work on the `.ts` files

```
> .load matters-report.ts
Uncaught SyntaxError: Unexpected identifier 'Matter'
```

Not your mistake — a documented Node limitation. `node matters-report.ts` works because Node's **module loader**
strips the types out of the file before running it. `.load` bypasses the module loader entirely; it just feeds
the file's text to the REPL, which only speaks plain JavaScript and trips over the first `: string` it meets.
[Node's own docs](https://nodejs.org/api/typescript.html) say it plainly: *"TypeScript syntax is unsupported in
the REPL."*

> **This is worth understanding rather than working around**, because it's the whole point of types in one
> sentence: **types are a layer that gets removed before any code runs.** The REPL sits underneath that layer.
> Same reason your browser can't run a `.ts` file either — and the reason Week 5 needs a build step.

To explore a `.ts` file interactively, `.load` its `.js` twin instead — the logic is identical.

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

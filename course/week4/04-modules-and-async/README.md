# Week 4 · Day 4 — Modules & async: the JavaScript React is written in

*Everything today is something you'll meet in the first ten lines of a React file. Imports at the top,
destructured values, spread instead of edit-in-place, `?.` for data that might not be there, and `await` for data
that hasn't arrived yet.*

**You'll ship:** a script split into three **modules** ([`main.js`](main.js), [`matters-data.js`](matters-data.js),
[`format.js`](format.js)) that loads its matters from a fake API — and handles the failure when one isn't found.

> 👉 **Run today's code two ways:**
> ```bash
> node main.js                # simplest
> python3 -m http.server      # then open http://localhost:8000
> ```
> The browser page prints the same lines onto the page, so you don't need DevTools — though
> **⌥⌘I → Console** shows them too.
>
> ⚠️ **This is the one lesson that will not work by double-clicking the HTML file.** See section 2 for why.

> 📝 **Annotated copies:** [`main.annotated.js`](main.annotated.js),
> [`matters-data.annotated.js`](matters-data.annotated.js), [`format.annotated.js`](format.annotated.js) and
> [`index.annotated.html`](index.annotated.html). They import each other, so you can run the whole annotated set:
> `node main.annotated.js`, or visit `http://localhost:8000/index.annotated.html`.

> 🧩 **TypeScript twin:** [`main.ts`](main.ts) + [`types.ts`](types.ts) — section 7. Run it with `node main.ts`.

---

## 🎯 Objectives
- Split code into **modules** with `export` / `import` — and tell a **named** export from a **default** one.
- **Destructure** objects and arrays, rename fields, and supply defaults.
- Use **spread** (`...`) to copy-and-extend instead of modifying in place.
- Survive missing data with **optional chaining** (`?.`) and **nullish coalescing** (`??`).
- Handle data that arrives later with **Promises**, **`async`/`await`**, and **`try`/`catch`**.
- Put the **`Matter` type in its own module** and read `Promise<Matter[]>` — the exact shape Week 5 uses.

## ⚖️ Why it matters
When you open a React component on Monday, the first thing you'll see is a stack of `import` lines, and the first
thing inside the function will be `({ matter })` — a destructured prop. If those look like noise, React looks like
magic. After today they'll look like Thursday's code, tidied up.

---

## 1 · Modules — one file, one job

Thursday's `dashboard.js` held data, formatting and rendering in one file. That's fine at 60 lines and miserable
at 600. A **module** is just a file that decides what leaves it:

```js
// format.js — hands out four helpers
export const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// matters-data.js — hands out one main thing, plus some extras
export const firm = "Rivera & Associates";
const matters = [ /* ... */ ];
export default matters;
```

```js
// main.js — takes what it needs
import matters, { firm, fetchMatters } from "./matters-data.js";
import { money, statusLabel } from "./format.js";
```

| Export | Written | Imported | Per file |
|---|---|---|---|
| **named** | `export const money = …` | `import { money } from …` — **braces**, name must match | as many as you like |
| **default** | `export default matters` | `import matters from …` — **no braces**, you pick the name | at most one |

Anything without `export` stays private to its file. That's the real benefit: a module has a small front door and
a lot of things you never have to think about.

> **Legal analogy:** a module is a **practice group**. It publishes what it will take on (the exports) and keeps
> its internal working papers to itself.

> **Common pitfalls ⚠️** — in the browser, the `"./"` and the `".js"` are both **required**.
> `import { money } from "format"` fails; `from "./format.js"` works.

## 2 · Why this lesson needs a server

Double-click `index.html` and it opens as `file:///…`. A module script has to **fetch** each imported file, and
browsers refuse to do that over `file://` — so nothing loads. Serving the folder over HTTP fixes it:

```bash
python3 -m http.server      # then http://localhost:8000
```

That's the same command from [Week 3](../../week3/README.md), now doing real work. (Node needs its own hint: the
three-line [`package.json`](package.json) here exists solely so `"type": "module"` tells Node these `.js` files
use `import`/`export`. Week 5's Vite project has the same line.)

## 3 · Destructuring — unpacking values

```js
const { client, billed, area } = matters[0];   // by NAME, from an object
const [first, second, ...others] = matters;    // by POSITION, from an array
```

Two refinements you'll see constantly:

```js
const { id: matterId, currency = "USD" } = matters[0];
//       ^ rename       ^ default when the key is missing
```

`...others` is the **rest** pattern — "everything I haven't already named." And a React component's props are
destructured exactly this way: `function MatterCard({ matter })`.

## 4 · Spread — copy, don't edit

```js
const withNew = [...matters, newMatter];              // a NEW array
const closed  = { ...matters[0], active: false };     // copy, then override
```

`...` unpacks everything from the original into a fresh array or object. For objects, **later keys win**, so
listing `active: false` afterwards overrides the copied value.

Compare `matters.push(newMatter)`, which changes the original array. This distinction stops being stylistic on
Monday: **React only re-renders when you hand it a new value**, so `...` is how you update state. Thursday's
`[...matters].sort(...)` was the same instinct.

## 5 · `?.` and `??` — data that might not be there

Not every matter in `matters-data.js` has a `lead`. Plain `m.lead.name` **crashes** on those rows:

```js
export const leadName = (m) => m.lead?.name ?? "Unassigned";
```

- **`?.`** — if the left side is `null`/`undefined`, stop and produce `undefined` rather than throwing.
- **`??`** — supply a fallback, but **only** for `null`/`undefined`.

> **Go Deeper 🔧** — use `??` rather than `||` for defaults. `||` also fires on `0` and `""`, so
> `m.billed || "n/a"` quietly turns a genuine **$0 balance** into `"n/a"`. `??` leaves the zero alone.

## 6 · Promises and `async`/`await`

Real data arrives *later*. A **Promise** is an object standing in for a value that isn't ready:

```js
export function fetchMatters(delayMs = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(matters), delayMs));
}
```

`async`/`await` lets you read that top-to-bottom anyway:

```js
async function main() {
  console.log("fetching…");
  const rows = await fetchMatters();     // pause here; continue when it resolves
  console.log(`got ${rows.length} matters`);
}
```

`await` pauses *this function* without freezing the page. And a promise has two exits — success and failure — so
failure is handled with the ordinary `try`/`catch`:

```js
try {
  await fetchMatter("M-9999");          // rejects
} catch (err) {
  console.log(`handled: ${err.message}`);
} finally {
  console.log("done.");                 // runs either way — e.g. "stop the spinner"
}
```

> **Common pitfalls ⚠️** — forget the `await` and `rows` is the **Promise itself**, so `rows.length` is
> `undefined`. If a value mysteriously prints as `Promise { <pending> }`, you missed an `await`.

## 7 · In TypeScript — a shared type, and a typed promise

Run the typed twin, [`main.ts`](main.ts):

```bash
node main.ts
```

Days 1 and 2 each had to redeclare `type Matter` at the top of the script. **Now that you have modules, it can
live in one file** — [`types.ts`](types.ts) — and everything else imports it:

```ts
// types.ts
export type Matter = {
  id: string;
  billed: number;
  lead?: { name: string; email?: string };   // `?` = optional
};

// main.ts
import type { Matter } from "./types.ts";
```

`import type` brings in a **shape, not a value** — it vanishes entirely at runtime. And that `types.ts` is doing
precisely the job of Week 5's `matter-app/src/types.ts`. You've just built the pattern the whole React app rests
on.

Two payoffs land today specifically:

```ts
function fetchMatters(delayMs: number = 400): Promise<Matter[]> { … }

const rows: Matter[] = await fetchMatters();   // await unwraps Promise<Matter[]> → Matter[]
```

- **`Promise<Matter[]>`** reads as "a promise of an array of Matter." The signature tells you what you'll get
  *and* that you'll have to wait for it — the `await` you forgot is now a type error, not a mystery.
- **`lead?:` is optional**, so `m.lead?.name` has type `string | undefined`. The `?? "Unassigned"` turns it back
  into a plain `string`. TypeScript won't let you skip that step — section 5's crash becomes impossible.

> **Go Deeper 🔧** — in the `catch`, `err` has type **`unknown`**, not `Error`. TypeScript makes you prove what it
> is before using it: `err instanceof Error ? err.message : String(err)`. Anything can be thrown in JavaScript, so
> this is honest rather than pedantic — and it's the same line you'll write in Week 5's `fetch`.

**Everything above is what React code is made of.** That's the whole point of today.

---

## ✍️ Your turn

**In `format.js`:**
1. Add and export `leadEmail(m)` returning the lead's email or `"—"`, using `?.` and `??`.

**In `main.js`:**
2. Destructure `{ client, area }` from the **last** matter (`matters[matters.length - 1]`) and log them.
3. Build `withRaise` — a copy of `matters[0]` with `billed` increased by 1000 — using spread, then log both the
   original and the copy to prove the original didn't change.
4. Add a `try`/`catch` around a `fetchMatter("M-0000")` call and log your own message.

**In `matters-data.js`:**
5. Make `fetchMatters` reject when `delayMs` is negative, then trigger it from `main.js` and catch it.

<details><summary>✅ What it should look like</summary>

```js
// 1 — format.js
export const leadEmail = (m) => m.lead?.email ?? "—";

// 2 — main.js
const { client: lastClient, area: lastArea } = matters[matters.length - 1];
console.log(lastClient, lastArea);                       // Fairhaven Ltd Real Estate

// 3
const withRaise = { ...matters[0], billed: matters[0].billed + 1000 };
console.log(matters[0].billed, "->", withRaise.billed);  // 42750.5 -> 43750.5

// 5 — matters-data.js
export function fetchMatters(delayMs = 400) {
  return new Promise((resolve, reject) => {
    if (delayMs < 0) return reject(new Error("delayMs must be >= 0"));
    setTimeout(() => resolve(matters), delayMs);
  });
}
```
If the browser page stays blank, you're almost certainly on `file://` — start `python3 -m http.server` and reload
from `http://localhost:8000`. If Node says *"Cannot use import statement outside a module"*, the
[`package.json`](package.json) with `"type": "module"` isn't in the folder you ran from.
</details>

## 📝 Recap
- **Modules**: `export` what leaves the file; **named** exports use braces, the one **default** export doesn't.
- Module scripts need **`http://`** — hence `python3 -m http.server`.
- **Destructuring** unpacks objects by name and arrays by position; supports renaming, defaults and `...rest`.
- **Spread** copies-and-extends instead of mutating — the habit React depends on.
- **`?.`** survives missing fields; **`??`** supplies a fallback without swallowing `0` or `""`.
- **`async`/`await`** reads later-arriving data top-to-bottom; **`try`/`catch`/`finally`** handles the failure.

## 🧠 Check yourself
1. Which import needs braces, and why? *(named exports — the name is part of the contract; the default export
   has none, so you choose it)*
2. What does `{ ...matter, active: false }` produce? *(a brand-new object, identical except `active` — the
   original is untouched)*
3. Why prefer `?? "n/a"` over `|| "n/a"` on a billed amount? *(`||` would replace a real `0` with `"n/a"`)*

## ➡️ Next — [Week 5: React + Vite + TypeScript](../../week5/)
You've now built a dashboard by hand: find the elements, wire the events, re-render everything, glue the strings.
Monday you'll hand all of that to **React** — you change the data, and the page updates itself. Every piece of
today's syntax shows up on the first page.

## 📖 Reference
- MDN — JavaScript modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- MDN — Destructuring assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
- MDN — Using promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
- MDN — Optional chaining: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

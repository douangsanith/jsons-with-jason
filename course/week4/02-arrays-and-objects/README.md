# Week 4 · Day 2 — Arrays & the three methods that build every UI

*One matter is a value. A **list** of matters is a dashboard. Today you learn the three array methods —
`filter`, `map`, `reduce` — that do essentially all the work in every React app you will ever read.*

**You'll ship:** a billing report ([`matters-report.js`](matters-report.js)) that counts, totals, ranks and
groups a list of matters — and a reusable `report()` function.

> 👉 **Run today's code in a terminal:**
> ```bash
> node matters-report.js
> ```
> Read the output next to the file. Every `console.log` in the script maps to one line you'll see.

> 📝 **Two copies of the file:** [`matters-report.js`](matters-report.js) is the clean version;
> [`matters-report.annotated.js`](matters-report.annotated.js) is the same script with a plain-English comment on
> nearly every line, including a step-by-step walk through `reduce`. Both print identical output.

> 🧩 **And a TypeScript twin:** [`matters-report.ts`](matters-report.ts) — the same program with types, for
> section 6. Run it with `node matters-report.ts`.

---

## 🎯 Objectives
- Read an **array of objects** — the shape of every CSV, database table and API response.
- Use **`filter`** (keep some rows), **`map`** (transform every row), and **`reduce`** (collapse to one value).
- **`sort`** safely, and know why you must copy the array first.
- **Chain** methods into a pipeline you can read top to bottom.
- Group rows with `reduce` into an object — the JavaScript twin of a pandas `groupby`.
- Read **`Matter[]`** and see how TypeScript checks a whole pipeline without you annotating it.

## ⚖️ Why it matters
The single most important line in this entire week is `matters.map(...)`. Turning a list of **data** into a list
of **somethings** is how a table gets rows, how a dashboard gets cards, and — in Week 5 — how React renders
`<MatterCard>` components. Everything else today supports that one move.

---

## 1 · An array of objects

```js
const matters = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp",      area: "Contracts",  billed: 18500.0, active: true },
  // ...
];

matters.length        // 6
matters[0].client     // "Brightline LLC"  — indexes start at ZERO
```

Same keys on every object, one object per row. If you've seen a spreadsheet, you've seen this.

> **Legal analogy:** the array is the **matter docket**; each object is one **line on the docket**, and the keys
> are the column headings.

## 2 · The three methods

These are the ones to memorize. Yesterday's arrow functions are what you pass to each:

| JavaScript | Does | pandas / Python twin |
|---|---|---|
| `matters.filter(m => m.active)` | keep matching rows → **shorter array** | `df[df.active]` |
| `matters.map(m => m.client)` | transform each row → **same-length array** | `[m.client for m in matters]` |
| `matters.reduce((s, m) => s + m.billed, 0)` | collapse to **one value** | `df.billed.sum()` |

Three things worth pinning down:

- **`filter` and `map` never modify the original.** They hand back a new array. That's why chaining is safe.
- **`map` always returns the same number of items** it was given. If you wanted fewer, you wanted `filter`.
- **The `0` in `reduce` is the starting value** — the running total before any row is added. Change it to `100`
  and every total is $100 higher. Forgetting it is the classic `reduce` bug.

## 3 · `sort` — and the trap

```js
const byBilled = [...matters].sort((a, b) => b.billed - a.billed);
```

Unlike `filter` and `map`, **`sort` rearranges the array in place** — it damages the original. `[...matters]` is
the **spread** operator making a copy first. Get in the habit; the bug it prevents ("why is my list in a weird
order now?") is genuinely hard to spot later.

The comparison `(a, b) => b.billed - a.billed` returns a positive or negative number. `b - a` is **descending**
(biggest first); `a - b` is ascending.

> **Common pitfalls ⚠️** — a bare `.sort()` with no comparison sorts as **text**, so `[10, 9, 100]` becomes
> `[10, 100, 9]`. Always pass a comparison function for numbers.

## 4 · Chaining — a pipeline you read top to bottom

```js
const activeTop3 = matters
  .filter((m) => m.active)                      // keep the open ones
  .sort((a, b) => b.billed - a.billed)          // biggest first
  .slice(0, 3)                                  // take the top three
  .map((m) => `${m.client} ($${m.billed.toFixed(2)})`);  // label them
```

Because each step returns a new array, you can hang the next one off it. `.slice(0, 3)` takes items 0, 1 and 2 —
the end index is **not** included.

Three more you'll reach for: `some` (true if **at least one** row passes), `every` (true only if **all** do), and
`find` (returns the first matching **item**, not an array).

> **Common pitfalls ⚠️** — inside `find`, write `m.id === "M-1004"`. One `=` **assigns**; three `===` **compares**.
> This is the single most common typo in JavaScript.

## 5 · Grouping with `reduce`

`reduce` isn't only for numbers. Start with an empty **object** instead of `0` and you get a group-by:

```js
const byArea = matters.reduce((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc;
}, {});
// → { Litigation: 42750.5, Contracts: 18500, ... }
```

`(acc[m.area] || 0)` means "whatever's already there, or `0` the first time we see this area." And because the
body uses `{ }` braces, you must `return acc` yourself so the next round receives it.

> **Go Deeper 🔧** — `Object.entries(byArea)` turns that object into `[["Litigation", 42750.5], ...]` so you can
> loop it. The `for (const [area, amount] of ...)` line unpacks each pair into two names at once — that's
> **destructuring**, and it's Friday's topic.

**Remember the shape of the pipeline: filter → sort → map.** You'll write it a hundred times.

## 6 · The same program, in TypeScript

Open [`matters-report.ts`](matters-report.ts) beside the `.js` and run it — identical output again:

```bash
node matters-report.ts
```

Yesterday types described **one** matter. Today one annotation describes **six**:

```ts
const matters: Matter[] = [ … ];   // "an array of Matter"
```

That `[]` suffix is the most common type you'll ever write, because web data is almost always a list of records.
And from that single annotation, TypeScript works out the rest of the file on its own:

```ts
const active = matters.filter((m) => m.active);          // Matter[]
const labels = matters.map((m) => `${m.id} — ${m.client}`); // string[]
const total  = matters.reduce((sum, m) => sum + m.billed, 0); // number
```

**Notice `(m)` has no type on it.** It doesn't need one — TypeScript knows `matters` is `Matter[]`, so `m` must be
a `Matter`. That's **inference**, and it's why real TypeScript isn't cluttered with annotations. It also means
your editor autocompletes `.client` after `m.`, and flags `.clientt` on the spot. Day to day, that autocomplete
is worth more than the error catching.

### 6a · The one place types change the code

Compare this line in the two files:

```js
matters.find((m) => m.id === "M-1004").client          // .js — works by luck
```
```ts
const found: Matter | undefined = matters.find((m) => m.id === "M-1004");
found ? found.client : "not found"                      // .ts — the check is forced
```

`find` might find nothing, so its type is **`Matter | undefined`**. TypeScript refuses to let you read `.client`
off it until you've handled the empty case. The JavaScript version only works because we happen to know M-1004
exists — change that id to one that doesn't and it crashes. **This is the class of bug types are for.**

> **Go Deeper 🔧** — `Record<string, number>` in the group-by means "an object with string keys and number
> values". The angle brackets pass a type as an argument, the same way parentheses pass a value. You'll meet the
> notation again next week as `useState<Matter[]>`.

---

## ✍️ Your turn — edit `matters-report.js`
1. Log the number of **closed** matters (`filter` on `m.active === false`).
2. `map` the matters to an array of just `client` names and log it.
3. Compute the total billed for **active matters only** — filter first, then reduce.
4. Build `areaCounts`: an object of **how many matters** are in each practice area (same `reduce` pattern as
   `byArea`, but add `1` instead of `m.billed`).
5. Add an `averageBilled` line to the `report()` function.

<details><summary>✅ What it should look like</summary>

```js
// 1
console.log("closed:", matters.filter((m) => !m.active).length);          // 2
// 2
console.log(matters.map((m) => m.client));
// 3
console.log(matters.filter((m) => m.active).reduce((s, m) => s + m.billed, 0).toFixed(2));  // 98350.50
// 4
const areaCounts = matters.reduce((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + 1;
  return acc;
}, {});
// 5  (inside report(), after totalBilled)
`Average:      $${(totalBilled / rows.length).toFixed(2)}`
```
`!m.active` is the shorter way to write `m.active === false` — `!` means "not". If a total comes out as
`NaN` ("not a number"), you're adding a field that doesn't exist — check the spelling of `m.billed`.
</details>

## 📝 Recap
- Web data is an **array of objects**; `matters[0]` is the first row, `.length` is the count.
- **`filter`** keeps rows, **`map`** transforms every row, **`reduce`** collapses to one value.
- `filter`/`map` return **new** arrays; **`sort` mutates**, so copy with `[...arr]` first.
- **Chain** them — `filter → sort → map` is the pipeline you'll write constantly.
- `reduce` starting from `{}` is a **group-by**; use `===` for comparison, never `=`.
- **`map` is how React renders lists.** That's the bridge to Week 5.

## 🧠 Check yourself
1. If `matters` has 6 rows, how many does `matters.map(...)` return? *(always 6 — use `filter` for fewer)*
2. What is the `0` at the end of `reduce`? *(the starting value of the running total)*
3. Why write `[...matters].sort(...)` instead of `matters.sort(...)`? *(`sort` reorders in place; the spread
   copies so the original is safe)*

## ➡️ Next — [03-dom-and-events](../03-dom-and-events/)
So far the output lands in a terminal. Thursday you put it **on a page**: `map` a list of matters into HTML,
drop it into the browser, and wire a search box and a toggle to re-render it. That's Week 3's static dashboard,
made live.

## 📖 Reference
- MDN — Array methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- MDN — `Array.prototype.reduce`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
- MDN — Sorting arrays: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

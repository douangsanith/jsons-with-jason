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
> section 8 — plus [`matters-report.annotated.ts`](matters-report.annotated.ts). Run either with
> `node matters-report.ts`. All four files print identical output.

---

## 🎯 Objectives
- Read an **array of objects** — the shape of every CSV, database table and API response.
- Use **`filter`** (keep some rows), **`map`** (transform every row), and **`reduce`** (collapse to one value).
- **`sort`** safely, and know why you must copy the array first.
- **Chain** methods into a pipeline you can read top to bottom.
- Translate the **Python comprehension** you already know into the JavaScript pipeline.
- Group rows with `reduce` into an object — the JavaScript twin of a pandas `groupby`.
- Recognise **`for...of`**, the classic **`for`**, and **`while`** — and know which of the three you'd ever write.
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

| JavaScript | Does | pandas twin |
|---|---|---|
| `matters.filter(m => m.active)` | keep matching rows → **shorter array** | `df[df.active]` |
| `matters.map(m => m.client)` | transform each row → **same-length array** | `df.client` / `df.apply(...)` |
| `matters.reduce((s, m) => s + m.billed, 0)` | collapse to **one value** | `df.billed.sum()` |

Three things worth pinning down:

- **`filter` and `map` never modify the original.** They hand back a new array. That's why chaining is safe.
- **`map` always returns the same number of items** it was given. If you wanted fewer, you wanted `filter`.
- **The `0` in `reduce` is the starting value** — the running total before any row is added. Change it to `100`
  and every total is $100 higher. Forgetting it is the classic `reduce` bug.

The pandas column is the closest *analogy*; the next section is the closest *translation* — plain Python lists
and dicts, line for line.

## 3 · Coming from Python

You already write this code every day — you just spell it with a **comprehension**. JavaScript has no
comprehension syntax. `filter`, `map` and `reduce` **are** the comprehension, broken into three named pieces you
snap together.

```python
# Python — one bracket does filtering, transforming and (with sum) collapsing
active  = [m for m in matters if m["active"]]
clients = [m["client"] for m in matters]
total   = sum(m["billed"] for m in matters)
```
```js
// JavaScript — the same three moves, one named method each
const active  = matters.filter((m) => m.active);
const clients = matters.map((m) => m.client);
const total   = matters.reduce((sum, m) => sum + m.billed, 0);
```

### 3a · The full translation table

| You want | Python | JavaScript |
|---|---|---|
| keep some rows | `[m for m in ms if m["active"]]` | `ms.filter((m) => m.active)` |
| transform each row | `[m["client"] for m in ms]` | `ms.map((m) => m.client)` |
| both at once | `[m["client"] for m in ms if m["active"]]` | `ms.filter((m) => m.active).map((m) => m.client)` |
| add up a column | `sum(m["billed"] for m in ms)` | `ms.reduce((s, m) => s + m.billed, 0)` |
| count matches | `len([m for m in ms if m["active"]])` | `ms.filter((m) => m.active).length` |
| first match | `next((m for m in ms if m["id"] == "M-1004"), None)` | `ms.find((m) => m.id === "M-1004")` |
| any / all | `any(...)` / `all(...)` | `ms.some(...)` / `ms.every(...)` |
| sort by a column | `sorted(ms, key=lambda m: m["billed"], reverse=True)` | `[...ms].sort((a, b) => b.billed - a.billed)` |
| group by a column | `defaultdict(float)` + a `for` loop | `ms.reduce((acc, m) => …, {})` |
| the callback itself | `lambda m: m["billed"]` | `(m) => m.billed` |

Python's functional trio exists too — `filter(lambda m: m["active"], ms)` — but nobody writes it, and it reads
**inside-out**: `list(map(f, filter(g, ms)))` runs right to left. The JavaScript chain runs **left to right, in
the order you read it**. That's the one genuine ergonomic win, and it's why section 5 chains four steps without
becoming unreadable.

### 3b · Five differences that will bite you

1. **Fields use a dot, not a key.** `m["client"]` in Python; `m.client` in JavaScript. A JS object is closer to a
   Python *object* than a Python *dict* — even though it was built from what looks like dict literal syntax.
2. **A typo'd key is silent.** `m["clientt"]` raises `KeyError` in Python. `m.clientt` in JavaScript is just
   `undefined` — no error, and it flows downstream until a total comes out `NaN`. This is the single biggest
   adjustment coming from Python.
3. **Nothing is lazy.** Python's `map`/`filter` hand back iterators you have to `list()`. JavaScript's hand back a
   **real array every time** — so `.length` works immediately and the next `.map` has something to hang off. The
   price is a new array per step, which is irrelevant at UI sizes.
4. **`reduce` is the everyday tool, not a `functools` curiosity.** There is no `sum()` in JavaScript, no
   `Counter`, no `groupby`. `reduce` fills all three roles, so you'll see it far more often than you ever saw
   `functools.reduce`. The `0` at the end is exactly `sum(..., start)`'s start value.
5. **`sort` takes a comparator, not a `key=`.** Python asks *what to sort by*; JavaScript asks *how two rows
   compare* — return a negative number, zero, or a positive one. `b.billed - a.billed` is `reverse=True`.

> **Legal analogy:** the comprehension is one paragraph doing three jobs at once. The JavaScript chain is the
> same argument split into numbered clauses — longer on the page, but each clause is separately reviewable.

> **Go Deeper 🔧** — `lambda` and `=>` are the same idea with different limits. A `lambda` is capped at a single
> expression, which is why Python needs a named `def` the moment logic grows. A JS arrow just grows a `{ }` body
> with as many statements as you like — so the callback never has to move out of the pipeline.

## 4 · `sort` — and the trap

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

## 5 · Chaining — a pipeline you read top to bottom

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

## 6 · Grouping with `reduce`

**The job, in one sentence:** turn a list of matters into **one total per practice area**.

```js
// in — a list of three matters
[{ area: "Litigation", billed: 42750.5 },
 { area: "Contracts",  billed: 18500 },
 { area: "Litigation", billed: 5000 }]

// out — one entry per area
{ Litigation: 47750.5, Contracts: 18500 }
```

Notice Litigation appears **twice** in the list and **once** in the summary, with the two bills added together.
That adding-as-you-go is the whole idea. Everything below is just the machinery for it.

### The only new thing

You've already used `reduce` to collapse a list to **one number**. The single new idea here is that the thing
you're building up can be an **object** instead of a number. Same method, different starting value:

```js
matters.reduce((sum, m) => sum + m.billed, 0)    // start at 0    → build a number
matters.reduce((acc, m) => { … },            {}) // start at { }  → build an object
```

### Watch it build, one matter at a time

Using the three-matter list from above:

```js
const byArea = matters.reduce((acc, m) => {
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  return acc;
}, {});
```

| Round | matter | `acc[m.area]` was | `acc` after this round |
|---|---|---|---|
| **start** | — | — | `{}` |
| 1 | Litigation, 42750.5 | nothing → use `0` | `{ Litigation: 42750.5 }` |
| 2 | Contracts, 18500 | nothing → use `0` | `{ Litigation: 42750.5, Contracts: 18500 }` |
| 3 | Litigation, 5000 | **42750.5** → add to it | `{ Litigation: 47750.5, Contracts: 18500 }` |

**Round 3 is the one that matters.** Litigation already had a total, so `acc[m.area]` found `42750.5` and added
`5000` to it. Rounds 1 and 2 had nothing there yet — and reading a key that doesn't exist gives `undefined`, not
an error (that's [§3b's silent-typo behavior](#3b--five-differences-that-will-bite-you) working *for* you here).
You can't add to `undefined`, so `|| 0` supplies a `0` to start from.

That's all `(acc[m.area] || 0)` is: **"the total so far, or zero if this is the first one."**

### Two rules that trip everyone up

1. **You must `return acc`.** The moment the body uses `{ }` braces, nothing is returned automatically — and
   whatever you return becomes the `acc` for the next round. Forget it and round 2 receives `undefined`.
2. **`{}` at the end is the starting value**, exactly like the `0` in `reduce((sum, m) => …, 0)`. Same slot, same
   job.

### The Python you'd write instead

```python
by_area = defaultdict(float)
for m in matters:
    by_area[m["area"]] += m["billed"]
```

Same three parts, rearranged: `defaultdict(float)` is the `{}` seed, `by_area` is `acc`, and `|| 0` does the job
of the default factory. JavaScript has no `defaultdict`, so `(acc[key] || 0)` — read it as `dict.get(key, 0)` — is
the idiom you'll see everywhere.

> **Heads up 📄** — run this on the real [`matters-report.js`](matters-report.js) data and **every area appears
> exactly once**, so no total ever combines. That's the data, not a bug in the code — six matters, six different
> practice areas. To see the accumulation actually happen, group by something that repeats, like `m.active`
> (four open, two closed). Exercise 4 does exactly that.

> **Go Deeper 🔧** — `Object.entries(byArea)` turns that object into `[["Litigation", 47750.5], ...]` so you can
> loop it. The `for (const [area, amount] of ...)` line unpacks each pair into two names at once — that's
> **destructuring**, and it's Friday's topic.

**Remember the shape of the pipeline: filter → sort → map.** You'll write it a hundred times.

## 7 · Loops, and why we mostly don't write them

You may have noticed something odd: this is an entire lesson about processing a list, and there hasn't been a
single loop. That isn't an oversight. `filter`/`map`/`reduce` **are** how modern JavaScript walks a list, which is
why they came first. But loops still exist, Claude still writes them, and one of them does a job the three methods
genuinely cannot.

### 7a · `for...of` — the one to actually use

```js
for (const m of matters) {
  console.log(`${m.id} — ${m.client}`);
}
```

That's Python's `for m in matters` with two spelling changes: **`of`** instead of `in`, and a `const` in front of
the loop variable. `const` is correct even though `m` is a different matter each pass — every iteration gets its
own fresh `m`, so nothing is ever reassigned.

Reach for it when you're **doing something to the outside world** rather than producing a new list. The tell is
whether you care about the return value:

| You want | Use |
|---|---|
| a **new list** built from the old one | `map` |
| a **shorter** list | `filter` |
| one **value** built from the whole list | `reduce` |
| to **do something** for each row, producing nothing | `for...of` |

> **Common pitfalls ⚠️** — **`for...in` is not Python's `for ... in`.** `for (const m in matters)` hands you the
> *indexes as strings* — `"0"`, `"1"`, `"2"` — not the matters. It's built for object keys, and it is the nastiest
> false friend in the language for someone arriving from Python. If you mean "each item", it is always **`of`**.

### 7b · The classic `for` — read it, don't write it

```js
for (let i = 0; i < matters.length; i++) {
  console.log(matters[i].client);
}
```

Three clauses separated by semicolons: **start** at `i = 0`, **keep going** while `i < matters.length`, and
**step** with `i++` (add one) each pass. You'll meet it in older code, in Stack Overflow answers, and in anything
written by someone whose first language had C in its ancestry.

It's `for i in range(len(matters))` — which you already know is the un-Pythonic way to do it. Same verdict here.
Even when you genuinely need the position, `for (const [i, m] of matters.entries())` says it better. And this is
the exact loop that carries [Day 1's `var` closure bug](../01-values-and-functions/README.md) — one more reason
it's a reading skill, not a writing habit.

### 7c · `while` — the one loop nothing replaces

Every method so far needs to know how many items it's walking **before it starts**. `while` is what you use when
that number depends on something you only learn **during** the loop:

```js
// "How many matters will an $80,000 retainer cover?" — you can't know without checking
let remaining = 80000;
let covered = 0;

while (covered < matters.length && matters[covered].billed <= remaining) {
  remaining -= matters[covered].billed;
  covered++;
}

console.log(`${covered} matters covered, $${remaining.toFixed(2)} left over`);
// → 3 matters covered, $8949.50 left over  — M-1003 at $131,200 is what stops it
```

Change one `billed` figure in the data and the answer changes. No `map` can express that, because `map` commits to
running exactly six times before it looks at anything.

Two ways a `while` loop goes wrong, and both are worth recognising on sight:

- **The infinite loop.** If nothing in the body moves the condition toward `false`, it never ends. Here that's
  `covered++`; delete it and the loop runs forever. In Node you'll need `Ctrl+C`; in a browser tab, the whole page
  freezes. **Every `while` needs a line in its body that changes the thing being tested.**
- **Running off the end.** That `covered < matters.length &&` guard isn't decoration. Once the retainer outlasts
  the list, `matters[6]` is `undefined` and reading `.billed` off it crashes. Note the **order**: `&&` stops at the
  first false test, so checking the bound first means the second half never runs on a row that isn't there.

> **Legal analogy:** `for...of` is reading every page of a file you've already got in front of you — the length is
> known before you start. `while` is working through the intake pile: you take the next one, and the only way to
> find out whether you're finished is to look.

### 7d · The whole translation table

| Python | JavaScript |
|---|---|
| `for m in matters:` | `for (const m of matters)` |
| `for i in range(len(ms)):` | `for (let i = 0; i < ms.length; i++)` |
| `for i, m in enumerate(ms):` | `for (const [i, m] of ms.entries())` |
| `for k, v in d.items():` | `for (const [k, v] of Object.entries(d))` |
| `while cond:` | `while (cond)` |
| `break` / `continue` | `break` / `continue` — identical |

`break` and `continue` behave exactly as they do in Python, and they point at the **real** limit of the three
methods: **you cannot stop a `map` halfway.** It will visit all six rows even after you've found what you were
looking for. When you need to bail out early, that's `find`/`some` (which already stop at the first match), or a
genuine loop.

> **Go Deeper 🔧** — `matters.forEach((m) => console.log(m.client))` is the method-shaped `for...of`, and you'll
> see it constantly. It returns `undefined`, so nothing chains off it. Prefer `for...of` when the body does
> anything **async**: `await` inside a `forEach` does not pause the loop the way you'd expect, and it's a bug
> that produces no error at all. That's Friday's topic.

## 8 · The same program, in TypeScript

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

### 8a · The one place types change the code

Compare this line in the two files:

```js
matters.find((m) => m.id === "M-1004").client          // .js — works by luck
```
```ts
const found: Matter | undefined = matters.find((m) => m.id === "M-1004");
found ? found.client : "not found"                      // .ts — the check is forced
```

`find` might find nothing, so its type is **`Matter | undefined`** — that's `Optional[Matter]`, and the vertical
bar is `typing.Union`. TypeScript refuses to let you read `.client` off it until you've handled the empty case. The JavaScript version only works because we happen to know M-1004
exists — change that id to one that doesn't and it crashes. **This is the class of bug types are for.**

> **Go Deeper 🔧** — `Record<string, number>` in the group-by means "an object with string keys and number
> values". The angle brackets pass a type as an argument, the same way parentheses pass a value. You'll meet the
> notation again next week as `useState<Matter[]>`.

---

## ✍️ Your turn — edit `matters-report.js`
1. Log the number of **closed** matters (`filter` on `m.active === false`).
2. `map` the matters to an array of just `client` names and log it.
3. Compute the total billed for **active matters only** — filter first, then reduce.
4. Build `statusCounts`: an object of **how many matters are open vs closed** (same `reduce` pattern as `byArea`,
   but add `1` instead of `m.billed`). Unlike practice area, this one really does group — you should see `4` and
   `2`, not a row of `1`s.
5. Add an `averageBilled` line to the `report()` function.
6. Print one line per matter with a **`for...of`** loop, then do the same with `map` + `join("\n")`. Same output,
   two shapes — decide which you'd rather read.
7. Change `for (const m of matters)` to `for (const m in matters)` and log `m`. See what you actually get.
8. Write the retainer `while` loop from section 7c, then raise the retainer to `300000` and run it again — big
   enough to cover every matter, which is the case the bounds guard exists for.

<details><summary>✅ What it should look like</summary>

```js
// 1
console.log("closed:", matters.filter((m) => !m.active).length);          // 2
// 2
console.log(matters.map((m) => m.client));
// 3
console.log(matters.filter((m) => m.active).reduce((s, m) => s + m.billed, 0).toFixed(2));  // 98350.50
// 4
const statusCounts = matters.reduce((acc, m) => {
  const key = m.active ? "open" : "closed";   // a readable key instead of true/false
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
console.log(statusCounts);                    // { open: 4, closed: 2 }
// 5  (inside report(), after totalBilled)
`Average:      $${(totalBilled / rows.length).toFixed(2)}`
```
```js
// 6
for (const m of matters) console.log(`${m.id} — ${m.client}`);
console.log(matters.map((m) => `${m.id} — ${m.client}`).join("\n"));
// 7
for (const m in matters) console.log(m);      // "0" "1" "2" "3" "4" "5"  ← indexes, as strings
// 8  — at 300000 the retainer outlasts the list
let remaining = 300000, covered = 0;
while (covered < matters.length && matters[covered].billed <= remaining) {
  remaining -= matters[covered].billed;
  covered++;
}
console.log(covered, remaining.toFixed(2));   // 6  55399.50
```
`!m.active` is the shorter way to write `m.active === false` — `!` means "not". If a total comes out as
`NaN` ("not a number"), you're adding a field that doesn't exist — check the spelling of `m.billed`.

In (8), `covered < matters.length` is the half of the condition doing the work now — without it, the loop reaches
`matters[6]`, which is `undefined`, and crashes on `.billed`. Delete the guard once to see it.
</details>

## 📝 Recap
- Web data is an **array of objects**; `matters[0]` is the first row, `.length` is the count.
- **`filter`** keeps rows, **`map`** transforms every row, **`reduce`** collapses to one value.
- Those three **are the comprehension you'd write in Python**, split apart and chained left to right — and
  `m.client` never raises `KeyError`, it just goes `undefined`.
- `filter`/`map` return **new** arrays; **`sort` mutates**, so copy with `[...arr]` first.
- **Chain** them — `filter → sort → map` is the pipeline you'll write constantly.
- `reduce` starting from `{}` is a **group-by**; use `===` for comparison, never `=`.
- **Loops exist but rarely earn their place.** `for...of` for side effects, classic `for` to read only, and
  **`while`** for the one case nothing else covers: repeating an unknown number of times.
- **`map` is how React renders lists.** That's the bridge to Week 5.

## 🧠 Check yourself
1. If `matters` has 6 rows, how many does `matters.map(...)` return? *(always 6 — use `filter` for fewer)*
2. What is the `0` at the end of `reduce`? *(the starting value of the running total)*
3. Why write `[...matters].sort(...)` instead of `matters.sort(...)`? *(`sort` reorders in place; the spread
   copies so the original is safe — it's `sorted(ms)` vs `ms.sort()` in Python)*
4. Rewrite `[m["client"] for m in matters if m["active"]]` in JavaScript. *(`matters.filter((m) => m.active).map((m) => m.client)`
   — filter first, then map)*
5. What does `m.clientt` do in JavaScript, and what would `m["clientt"]` do in Python? *(`undefined` and no
   error, versus an immediate `KeyError`)*
6. What does `for (const m in matters)` give you? *(the indexes `"0"`–`"5"` as strings, not the matters — you
   wanted `of`)*
7. When is `while` the right choice over `map`? *(when the number of repetitions depends on something you only
   discover as the loop runs — `map` commits to the length up front)*

## ➡️ Next — [03-dom-and-events](../03-dom-and-events/)
So far the output lands in a terminal. Thursday you put it **on a page**: `map` a list of matters into HTML,
drop it into the browser, and wire a search box and a toggle to re-render it. That's Week 3's static dashboard,
made live.

## 📖 Reference
- MDN — Array methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- MDN — `Array.prototype.reduce`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
- MDN — Sorting arrays: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

# Week 4 · Day 1 — Values & functions: JavaScript's building blocks

*HTML is the structure, CSS is the look — JavaScript is the **behavior**. Before a page can do anything, you
need the four things every script is made of: values, objects, functions, and a way to print.*

**You'll ship:** a runnable script ([`matters.js`](matters.js)) that turns one matter record into a formatted
summary line — and a `describe()` function you'll reuse all week.

> 👉 **Run today's code in a terminal:**
> ```bash
> node matters.js
> ```
> Node is JavaScript outside the browser — install it from [nodejs.org](https://nodejs.org) if `node --version`
> comes back empty. Keep the file open in your editor next to the output.

> 📝 **Two copies of the file:** [`matters.js`](matters.js) is the clean version;
> [`matters.annotated.js`](matters.annotated.js) is the same script with a plain-English comment on nearly every
> line. Read the annotated one to learn; use the clean one to build. Run it the same way:
> `node matters.annotated.js` — the output is identical.

> 🧩 **There's a third file today:** [`matters.ts`](matters.ts) — the *same program in TypeScript*, for section 6.
> Run it with `node matters.ts`. Ignore it until you get there.

---

## 🎯 Objectives
- Declare values with **`const`** and **`let`**, know which to reach for, and know why **`var`** is retired.
- Recognize the four everyday **types**: `string`, `number`, `boolean`, `null`.
- Build and read an **object** — the shape of a single matter record.
- Write both a **`function`** and an **arrow function** (`=>`), and return a value from each.
- Use **template literals** (`` `${...}` ``) to build a formatted line of text.
- Read a **type annotation** and say what TypeScript adds to the same program.

## ⚖️ Why it matters
Every Claude artifact you opened in Week 3 had a `<script>` block, and you were told to leave it alone. This week
you stop leaving it alone. But a script is not magic — it's a handful of named values and small functions doing
one thing each. Today you learn to read those, so that by Friday you can change them with confidence.

---

## 1 · `const` and `let`

```js
const firm = "Rivera & Associates";
let openMatters = 3;
openMatters = openMatters - 1;   // fine — it's `let`
```

**`const`** means the name will never be pointed at a different value. **`let`** means it will. Reach for `const`
by default and switch to `let` only when you actually reassign — it tells the next reader (and Claude) what's
meant to move.

> **Legal analogy:** `const` is a **defined term** in a contract — "Company" means the same thing on every page.
> `let` is a **running balance** on an invoice: the same label, a changing number.

One catch worth knowing now: `const` freezes the **name**, not the contents. You can't swap the whole object, but
you can absolutely change a field inside it (`matter.area = "..."` works on a `const matter`).

### 1a · What about `var`?

You'll see **`var`** in older code, in Stack Overflow answers, and occasionally in what Claude writes when it's
imitating older sources. It still works and always will — the web doesn't break old pages. But it is **obsolete
by convention**: since `let` and `const` arrived in 2015, there is no situation where `var` is the better choice.
Four reasons, in the order you're likely to get bitten:

| Problem | `var` | `let` / `const` |
|---|---|---|
| **Ignores blocks** — a `var` inside `if { }` leaks to the whole function | leaks out | stays in the `{ }` |
| **Hoisting** — used before it's declared | silently `undefined` | clear `ReferenceError` |
| **Silent redeclaration** — `var fee = 100; var fee = 250;` | no complaint | refuses |
| **Loops + callbacks** | one shared variable | a fresh one each pass |

That last one is the bug that made the change urgent:

```js
const withVar = [], withLet = [];
for (var i = 0; i < 3; i++) withVar.push(() => i);
for (let j = 0; j < 3; j++) withLet.push(() => j);

withVar.map((f) => f());   // [3, 3, 3]   😖  one shared `i`, and the loop finished
withLet.map((f) => f());   // [0, 1, 2]   ✅  a fresh `j` per iteration
```

**Rule: use `const`, reach for `let` when you reassign, and never write `var`.** Read it, don't write it.

> **Legal analogy:** `var` is the **old form of the agreement** — still enforceable, still in the filing cabinet,
> but nobody drafts on it any more because of a known ambiguity in clause 4.

## 2 · The four types you'll actually use

| Type | Example | It is |
|---|---|---|
| `string` | `"Acme Corp"` | text, in quotes |
| `number` | `18500.0` | any number — JavaScript has **no separate int/float** |
| `boolean` | `true` / `false` | a yes/no flag |
| `null` | `null` | deliberately empty (a matter with no close date) |

`typeof someValue` tells you which one you've got. That one-liner resolves most "why is my math coming out as
`"185001"`?" bugs — you had a string where you expected a number.

## 3 · Template literals — JavaScript's f-string

```js
console.log(`Firm: ${firm}`);
```

**Backticks**, not quotes. Anything inside `${...}` is evaluated and dropped into the text. You'll see this
everywhere, including inside the HTML that JavaScript generates on Thursday.

## 4 · Objects — one matter as one value

```js
const matter = {
  id: "M-1001",
  client: "Acme Corp",
  area: "Contracts",
  billed: 18500.0,
  active: true,
};

matter.id            // "M-1001"   — dot access
matter["client"]     // "Acme Corp" — bracket access, same thing
```

An object groups related fields under labels. Dot access is what you'll read 95% of the time; bracket access
matters when the key itself is stored in a variable.

> **Legal analogy:** an object is a **completed intake form** — the keys are the printed field labels
> (`Client`, `Practice Area`, `Amount Billed`) and the values are what someone wrote in.

## 5 · Functions — and the arrow form React uses

Two spellings of the same idea:

```js
function feeNote(amount) {
  return `$${amount.toFixed(2)} billed to date`;
}

const statusLabel = (m) => (m.active ? "Active" : "Closed");
```

The second is an **arrow function**. With no curly braces, its single expression is returned automatically. Add
braces and you must write `return` yourself — **forgetting that `return` is the most common arrow-function bug**,
because the function silently hands back nothing.

`m.active ? "Active" : "Closed"` is a **ternary**: an if/else that produces a value rather than running
statements. React code is full of them, so get comfortable now.

> **Go Deeper 🔧** — Arrow functions also treat `this` differently from `function`, which is why they became the
> default in modern code. You won't need `this` in this course, so we'll leave that there.

Finally, a **default parameter** supplies a fallback when the caller passes nothing:

```js
const greetLead = (name = "team") => `Prepared for ${name}.`;
greetLead("Jason");   // "Prepared for Jason."
greetLead();          // "Prepared for team."
```

## 6 · The same program, in TypeScript

Open [`matters.ts`](matters.ts) beside `matters.js` and run it:

```bash
node matters.ts
```

**Identical output.** Every line of logic is the same. The only additions are **type annotations** — and that is
genuinely all TypeScript is: JavaScript, plus notes about what shape things are.

```ts
type Matter = {
  id: string;
  billed: number;          // a NUMBER, so arithmetic is safe
  closedOn: string | null; // EITHER a date string OR nothing
};

const firm: string = "Rivera & Associates";
function feeNote(amount: number): string { … }
//                       ^ input          ^ what comes back
```

Three things to take from it:

- **A `type` names a shape once**, and you reuse it: `const matter: Matter = {…}`. Miss a field or put a string
  where a number belongs, and your editor tells you immediately.
- **You mostly don't annotate.** TypeScript *infers*: `const client = "Acme Corp"` is already known to be a
  string. Annotate at the **edges** — function parameters and data arriving from outside. Good TypeScript looks
  mostly untyped.
- **`string | null` is a union** — "either a date or nothing." TypeScript then makes you handle both cases.

> **Legal analogy:** the type is the **blank intake form** — it fixes which fields exist and what may go in each.
> The JavaScript object is one **completed** form. The form doesn't do the work; it stops you filing nonsense.

**Why now, and why this matters more than it looks:** every artifact Claude gives you as `.tsx` is written this
way, and Week 5's React components are typed from the first line. Meeting `: string` here, on a two-line
function, is far easier than meeting it for the first time wrapped in JSX.

> **Common pitfalls ⚠️ — `node matters.ts` does NOT check your types.** Node simply *deletes* the annotations and
> runs the JavaScript underneath. Change `billed` to `"18500"` with quotes: VS Code shows a red squiggle
> immediately, and `node matters.ts` runs it anyway. Three different things do three different jobs:
>
> | Where | What it does |
> |---|---|
> | **Your editor** | flags the mistake as you type — no setup at all |
> | **`node file.ts`** | strips the types and runs regardless |
> | **`npm run build`** | *refuses* — the real enforcement, in Week 5 Day 3 |

> **Go Deeper 🔧** — running `.ts` directly needs **Node 22.18 or newer** (`node --version`). On older versions
> the same file needs a compiler step, which is exactly the job Vite does for you next week.

---

## ✍️ Your turn — edit `matters.js`
1. Add a `leadAttorney` field to the `matter` object and include it in the `describe()` output.
2. Write an arrow function `isBigMatter(m)` that returns `true` when `m.billed` is over `10000`, and log the
   result for `matter`.
3. Change `matter.active` to `false`, re-run `node matters.js`, and confirm the status flips to `Closed`.
4. Give `feeNote` a second parameter, `currency = "USD"`, and print it after the amount.
5. **In [`matters.ts`](matters.ts):** add `leadAttorney: string` to the `Matter` type. Save, and watch your
   editor underline the `const matter: Matter = {…}` below — it's now missing a required field. Add it.
6. **In [`matters.ts`](matters.ts):** change `billed` to `"18500"` (with quotes). Note the editor's error, then
   run `node matters.ts` anyway and watch it run. Undo it.

<details><summary>✅ What it should look like</summary>

```js
// 1
const matter = { id: "M-1001", /* ... */ leadAttorney: "R. Rivera" };
const describe = (m) => `${m.id} · ${m.client} · ${m.area} · ${statusLabel(m)} · ${m.leadAttorney}`;
// 2
const isBigMatter = (m) => m.billed > 10000;
console.log(isBigMatter(matter)); // true
// 4
function feeNote(amount, currency = "USD") {
  return `$${amount.toFixed(2)} ${currency} billed to date`;
}
```
```ts
// 5 — matters.ts
type Matter = { /* ... */ leadAttorney: string };
const matter: Matter = { /* ... */ leadAttorney: "R. Rivera" };
```
If Node prints `undefined` where you expected text, you almost certainly wrote a `{ }` arrow function and left
out the `return`. If it prints `[object Object]`, you logged the whole object where you meant one field.

For (6) the editor underlines the object with `Type 'string' is not assignable to type 'number'` — and
`node matters.ts` runs it anyway, straight into a **runtime crash**:
`TypeError: amount.toFixed is not a function`. That's the argument for types in one line: the editor knew
before you ran it, and nothing stopped you shipping it.
</details>

## 📝 Recap
- **`const`** by default, **`let`** only when you reassign, **never `var`**; `const` freezes the name, not the
  contents.
- Four types carry everything: **`string`**, **`number`**, **`boolean`**, **`null`**.
- **Template literals** (`` `${...}` ``) build text; **objects** (`{ key: value }`) group one record's fields.
- **Functions** return values; the **arrow** form (`=>`) auto-returns a single expression, and needs an explicit
  `return` once you add braces.
- A **ternary** (`cond ? a : b`) is an if/else that produces a value.
- **TypeScript is the same JavaScript plus annotations** — `: string`, `: number`, `type Matter = {…}`. Your
  editor checks them; `node file.ts` strips them and runs anyway.

## 🧠 Check yourself
1. When would you pick `let` over `const`? *(only when you reassign the name)*
2. Why does `matter.area = "..."` work on a `const matter`? *(`const` protects the binding, not the fields)*
3. What does `(m) => m.billed > 10000` return, and what happened to the word `return`?
   *(a boolean; a brace-less arrow returns its expression automatically)*
4. If `node matters.ts` runs a file with a type error in it, what was the point? *(the editor caught it as you
   typed — and Week 5's `npm run build` refuses to build it at all)*

## ➡️ Next — [02-arrays-and-objects](../02-arrays-and-objects/)
One matter is a start; a dashboard needs a **list** of them. Tomorrow you'll meet arrays and the three methods —
`filter`, `map`, `reduce` — that do all the work in every React app you'll ever read.

## 📖 Reference
- MDN — JavaScript first steps: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting
- MDN — Template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
- MDN — Arrow functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

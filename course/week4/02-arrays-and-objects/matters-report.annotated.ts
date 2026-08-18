// Week 4 · Day 2 — the TypeScript version, annotated.
// Run it with:   node matters-report.annotated.ts
//
// Read this beside matters-report.annotated.js. The logic is identical, statement
// for statement — same filters, same reduce, same output. What types add today is
// that the compiler knows what's INSIDE the array, so it can check every step of
// every pipeline for you without you annotating the steps.

// The shape of one row. Day 1 introduced this; here it describes six of them.
// Note there's no `closedOn` and no `lead` — each day's type describes only what
// that day's data actually has. Day 4 is where the shape moves into its own file
// so it can stop being redeclared like this.
type Matter = {
  id: string;
  client: string;
  area: string;
  billed: number;
  active: boolean;
};

// --- Matter[] means "an array of Matter" ---
// The `[]` suffix is how you say "a list of these". It is the most common type
// you'll ever write, because web data is almost always an array of records.
//
// This one annotation checks all six rows. Misspell a key, drop a field, or quote
// a number, and the editor points at the offending row immediately. More usefully,
// it's what makes every `.filter`/`.map`/`.reduce` below type-check for free.
const matters: Matter[] = [
  { id: "M-1002", client: "Brightline LLC", area: "Litigation", billed: 42750.5, active: true },
  { id: "M-1001", client: "Acme Corp", area: "Contracts", billed: 18500.0, active: true },
  { id: "M-1004", client: "Dovetail Inc", area: "Employment", billed: 9800.0, active: true },
  { id: "M-1003", client: "Cedar Holdings", area: "M&A", billed: 131200.0, active: false },
  { id: "M-1005", client: "Everline Group", area: "IP", billed: 27300.0, active: true },
  { id: "M-1006", client: "Fairhaven Ltd", area: "Real Estate", billed: 15050.0, active: false },
];

// `.length` on an array is always a number — nothing special here.
console.log("count:", matters.length);
// Because the array is typed, your editor autocompletes `.client` the moment you
// type `matters[0].` — and flags `.clientt` instantly. That autocomplete is the
// real day-to-day benefit of types, more than the error catching. You stop
// looking things up.
//
// One honest caveat: TypeScript does NOT check that index 0 exists. `matters[0]`
// is typed `Matter`, not `Matter | undefined`, even on an empty array. Array
// bounds are one of the few places the type system takes your word for it.
console.log("first client:", matters[0].client);

// --- No annotations needed inside filter/map/reduce ---
// Notice `(m)` has no type on it and doesn't need one. TypeScript knows `matters`
// is `Matter[]`, so `m` must be a `Matter`. That's INFERENCE doing the work, and
// it's the reason well-typed code isn't buried in annotations.
//
// `.filter` always returns the same type it received — filtering a `Matter[]`
// gives a `Matter[]`, never a smaller shape. So the `: Matter[]` here is
// redundant, and written only to make the flow visible.
const active: Matter[] = matters.filter((m) => m.active);
console.log("active:", active.length);

// `.map`'s result type follows the arrow function's RETURN type. This one returns
// a template literal, so the result is `string[]` — a list of strings, not
// matters. That transformation is tracked automatically: change the arrow to
// return `m.billed` and `labels` silently becomes `number[]`, and the `: string[]`
// annotation is what would catch it.
const labels: string[] = matters.map((m) => `${m.id} — ${m.client}`);
console.log("labels:", labels);

// `.reduce`'s type comes from the STARTING VALUE. `0` is a number, so `sum` is a
// number and `total` is a number. Which is exactly why forgetting that `0` breaks
// things: with no starting value TypeScript can't work out what you're building,
// and you get an error instead of the silent NaN the .js version produces.
const total: number = matters.reduce((sum, m) => sum + m.billed, 0);
// Legal because `total` is a number. On a string, `.toFixed` doesn't exist.
console.log("total billed:", total.toFixed(2));

// `[...matters]` copies first, because `.sort` MUTATES the array it's given —
// without the spread, this line would reorder `matters` itself and every later
// line would see the new order. The types don't help you here at all: sorting in
// place is perfectly type-correct, just usually wrong. Worth remembering that
// types catch shape errors, not logic errors.
const byBilled: Matter[] = [...matters].sort((a, b) => b.billed - a.billed);
console.log("top matter:", byBilled[0].id, byBilled[0].client);

// --- Chaining keeps its types the whole way down ---
// Matter[] -> filter -> Matter[] -> sort -> Matter[] -> slice -> Matter[] ->
// map -> string[]. Four steps, one annotation at the end, and every intermediate
// step checked. Hover over any link in the chain in VS Code and it tells you
// exactly what you're holding at that point — the single most useful trick for
// debugging a pipeline that isn't doing what you expect.
//
// No `[...matters]` needed this time: `.filter` already returned a new array, so
// `.sort` is mutating that temporary rather than the original.
const activeTop3: string[] = matters
  .filter((m) => m.active)
  .sort((a, b) => b.billed - a.billed)
  .slice(0, 3)
  .map((m) => `${m.client} ($${m.billed.toFixed(2)})`);

console.log("top 3 active:", activeTop3);

// `.some` and `.every` return a plain boolean regardless of what's in the array —
// they answer a question about the array rather than transforming it.
console.log("any over 100k?", matters.some((m) => m.billed > 100000)); // boolean
console.log("all billed?", matters.every((m) => m.billed > 0)); // boolean

// --- The best example of types earning their keep ---
// `.find` might not find anything, so its return type is `Matter | undefined` — a
// union. TypeScript will NOT let you write `found.client` directly, because
// `found` might be undefined and that would crash at runtime.
//
// Look at the same line in the .js version: it reads `.find(...).client` with no
// check at all, and works only because we happen to know M-1004 exists. Change
// the id to one that doesn't and the .js version crashes while this one refuses to
// compile. Same bug, caught two hours earlier.
const found: Matter | undefined = matters.find((m) => m.id === "M-1004");
// The ternary is the check TypeScript demanded. Inside the truthy branch, `found`
// is NARROWED from `Matter | undefined` to just `Matter`, so `.client` is legal.
// Narrowing is TypeScript following your control flow — it's why an `if` is often
// all a union needs.
console.log("find M-1004:", found ? found.client : "not found");

// --- Record<string, number> ---
// Reads as "an object whose keys are strings and whose values are numbers". The
// angle brackets pass TYPES as arguments — like function arguments, but for
// shapes. You'll meet the same syntax as `useState<Matter[]>` in Week 5.
//
// `reduce<Record<string, number>>(...)` tells reduce what it's accumulating,
// because a bare `{}` at the end is ambiguous: on its own TypeScript infers the
// accumulator as `{}`, and then `acc[m.area] = ...` is an error because `{}` has
// no properties. Passing the type explicitly is the fix. This is one of the few
// places where TypeScript genuinely needs your help.
const byArea: Record<string, number> = matters.reduce<Record<string, number>>((acc, m) => {
  // `(acc[m.area] || 0)` handles the first time each area is seen. Note `||`
  // rather than `??` — for counters they behave the same, since the only falsy
  // number here would be 0 and adding 0 changes nothing.
  acc[m.area] = (acc[m.area] || 0) + m.billed;
  // reduce needs the accumulator back on every pass. Forget this `return` and you
  // get `undefined` next time round — a mistake types DO catch here, because
  // returning nothing doesn't match `Record<string, number>`.
  return acc;
}, {});

console.log("\nBilled by practice area:");
// `Object.entries` gives `[string, number][]` — an array of pairs — so the array
// destructuring `[area, amount]` types both names for you. `amount` is known to be
// a number, which is what makes `.toFixed(2)` legal below.
for (const [area, amount] of Object.entries(byArea)) {
  console.log(`  ${area.padEnd(14)} $${amount.toFixed(2)}`);
}

// --- The artifact, with a signature that documents itself ---
// `(rows: Matter[]): string` says everything a caller needs: hand me a list of
// matters, get back a string. No need to read the body, no need to guess.
//
// Note the parameter is `rows`, not `matters` — the function works on whatever
// it's given rather than reaching for the outer variable. That's what makes it
// reusable, and the type is what makes the promise credible.
const report = (rows: Matter[]): string => {
  const activeRows = rows.filter((m) => m.active);
  const totalBilled = rows.reduce((s, m) => s + m.billed, 0);
  // `[0]` again takes your word for it — on an empty `rows` this is `undefined` at
  // runtime and `top.client` crashes, with no complaint from the compiler. If this
  // were real code you'd guard it. Types are not a substitute for thinking about
  // empty inputs.
  const top = [...rows].sort((a, b) => b.billed - a.billed)[0];
  // Building an array of lines and joining them keeps the shape of the output
  // visible. Every element is a string, so `.join` gives a string, which matches
  // the `: string` return type.
  return [
    `Matters:      ${rows.length} (${activeRows.length} active)`,
    `Total billed: $${totalBilled.toFixed(2)}`,
    `Largest:      ${top.client} — $${top.billed.toFixed(2)}`,
  ].join("\n");
};

console.log("\n" + report(matters));

// 👉 In Week 5 this exact `Matter` type moves into its own file, and every React
//    component agrees with it: matter-app/src/types.ts. The type you just read is
//    the one the whole application is built on.

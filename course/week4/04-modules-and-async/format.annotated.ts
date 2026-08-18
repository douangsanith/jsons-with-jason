// Week 4 · Day 4 — the formatting module, annotated.
// Read this beside format.ts, and beside format.annotated.js. Compare all three:
// the JavaScript and the TypeScript have the SAME logic, line for line. Every
// difference you find is a type annotation.

// `import type` (rather than plain `import`) says "I only want the shape." It is
// erased entirely before this file runs — there is no `types.js` at runtime and
// there doesn't need to be one. Plain `import` would also work here, but `import
// type` documents the intent and guarantees no runtime dependency is created.
// The "./" and the ".ts" are both required, exactly as in the .js version.
import type { Matter } from "./types.annotated.ts";

// --- Annotating a function: inputs, then output ---
// `(n: number)` types the parameter. `: string` after the parens types the RETURN
// value. Together they are the function's contract: hand me a number, get back a
// string. A caller never has to read the body to use this correctly.
//
// The return type is optional — TypeScript can infer `string` from
// `.toLocaleString()`. Writing it anyway is a deliberate choice: it makes the
// compiler check the BODY against your intent, so if you later returned a number
// by accident, the error lands here rather than at some distant call site.
export const money = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// `m: Matter` is the payoff of having a shared type. This function accepts a full
// matter and nothing else — pass it a string, or an object missing `active`, and
// your editor objects as you type. And because `active` is declared `boolean` and
// NOT optional, `m.active` is guaranteed to exist. No defensive check needed.
export const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

// --- The line where types earn their keep ---
// `lead` is optional in the Matter type, so `m.lead` is
// `{ name: string; email?: string } | undefined`.
//
// Writing `m.lead.name` here is a COMPILE ERROR: "'m.lead' is possibly
// 'undefined'". TypeScript will not let you do the thing that crashes.
//
// So: `m.lead?.name` short-circuits to `undefined` when `lead` is absent, giving
// `string | undefined`. Then `?? "Unassigned"` collapses that union back down to
// a plain `string` — which is precisely what the `: string` return type promised.
// Read the two operators as a pair: `?.` may produce undefined, `??` removes it.
//
// Compare this with the same line in format.annotated.js. Identical code. The
// difference is that the JS version is correct because we happened to write it
// carefully, and the TS version is correct because it could not have compiled
// otherwise. That is the entire value proposition of TypeScript in one line.
export const leadName = (m: Matter): string => m.lead?.name ?? "Unassigned";

// This function calls the three above it. Each returns `string`, so the template
// literal is safe and the `: string` return type checks out. Note that `line`
// never annotates anything internally — it doesn't need to. Types flow through
// calls automatically, which is why well-typed code isn't cluttered with
// annotations: you annotate at the EDGES, and inference handles the middle.
export const line = (m: Matter): string =>
  `${m.id} · ${m.client} · ${statusLabel(m)} · ${money(m.billed)} · ${leadName(m)}`;

// 👉 Four tiny exported functions, one imported type, no logic of its own. This
//    is what a good module looks like, and it is the shape every file in Week 5's
//    matter-app/src/ takes.

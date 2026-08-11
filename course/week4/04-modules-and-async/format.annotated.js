// ANNOTATED VERSION — same module as format.js, with teaching comments.
// Read this one to learn; use the clean format.js to build.
//
// Week 4 · Day 4 — the formatting module.
// Small, boring, reusable. Exactly what a module should be: four one-line helpers,
// each exported by name, none of them knowing anything about the rest of the app.

// Yesterday's money formatter, now living somewhere every file can reach it.
export const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Day 1's ternary, exported.
export const statusLabel = (m) => (m.active ? "Active" : "Closed");

// --- The two operators worth the whole file ---
// `m.lead?.name`  — OPTIONAL CHAINING. Plain `m.lead.name` CRASHES when `lead` is
//   missing ("cannot read property 'name' of undefined"). The `?.` says: if the
//   thing on the left is null/undefined, stop and produce `undefined` instead of
//   throwing. Essential for data that arrives from somewhere else.
//
// `?? "Unassigned"` — NULLISH COALESCING. Supplies a fallback, but ONLY when the
//   left side is null or undefined. Its older cousin `||` also fires on 0 and "",
//   which quietly turns a real $0 into your fallback. Prefer `??`.
export const leadName = (m) => m.lead?.name ?? "Unassigned";

// Helpers composing other helpers — the payoff of keeping them small.
export const line = (m) =>
  `${m.id} · ${m.client} · ${statusLabel(m)} · ${money(m.billed)} · ${leadName(m)}`;

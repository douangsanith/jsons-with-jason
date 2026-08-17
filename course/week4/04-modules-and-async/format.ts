// Week 4 · Day 4 — the formatting module, in TypeScript.
// Small, boring, reusable. Exactly what a module should be.

// `import type` brings in a SHAPE, not a value — it disappears at runtime.
import type { Matter } from "./types.ts";

export const money = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const statusLabel = (m: Matter): string => (m.active ? "Active" : "Closed");

// `m.lead?.name` is `string | undefined`; `??` turns it back into a plain string,
// which is what the `: string` return type promises.
export const leadName = (m: Matter): string => m.lead?.name ?? "Unassigned";

export const line = (m: Matter): string =>
  `${m.id} · ${m.client} · ${statusLabel(m)} · ${money(m.billed)} · ${leadName(m)}`;

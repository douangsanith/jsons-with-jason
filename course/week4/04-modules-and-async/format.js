// Week 4 · Day 4 — the formatting module.
// Small, boring, reusable. Exactly what a module should be.

export const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const statusLabel = (m) => (m.active ? "Active" : "Closed");

// Optional chaining (?.) and the nullish operator (??) do the work here:
// if `lead` is missing, don't crash — fall back to "Unassigned".
export const leadName = (m) => m.lead?.name ?? "Unassigned";

export const line = (m) =>
  `${m.id} · ${m.client} · ${statusLabel(m)} · ${money(m.billed)} · ${leadName(m)}`;

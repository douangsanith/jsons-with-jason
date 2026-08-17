// Week 4 · Day 4 — the shared type, annotated.
// Read this beside types.ts. Same file, every line explained.
//
// This file exports NOTHING that exists at runtime. Compile it and you get an
// empty file — a type is a note to the compiler and to the next human, and
// nothing more. That is worth sitting with, because it explains why `import type`
// (over in main.annotated.ts) can vanish without breaking anything.

// `export` makes this type importable from other files. Without it, the type
// would be private to this module and `import type { Matter }` would fail.
// `type Name = { ... }` names a shape. Your own types are Capitalised by
// convention; the built-ins (string, number, boolean) are lowercase.
export type Matter = {
  // Each line is `key: type`. Note the SEMICOLONS — this is a type literal, not
  // an object literal, so it takes `;` between members rather than `,`. (Commas
  // are also accepted, which is a common source of confusion. Pick one.)
  id: string;
  client: string;
  area: string;
  // `number` covers both 42750.5 and 9800 — JavaScript has no separate int type,
  // so TypeScript has no separate int type either. Money as a float is fine for
  // a lesson; real billing systems store integer cents to dodge rounding.
  billed: number;
  active: boolean;
  // The `?` marks an OPTIONAL field, and it changes the type of `lead` to
  // `{ name: string; email?: string } | undefined`. That union is the whole
  // point: TypeScript now REFUSES to let you write `m.lead.name`, because
  // `undefined.name` would crash. It forces you to reach for `?.` instead —
  // which is exactly what format.annotated.ts does in leadName.
  //
  // Types nest freely. This one is written INLINE rather than pulled out as its
  // own `type Lead = {...}`. Inline is fine for a shape used once; name it when
  // two files need to agree on it.
  //
  // `email?` is optional INSIDE an already-optional field: M-1004's lead has a
  // name but no email. So `m.lead?.email` is `string | undefined` too, and needs
  // its own `??` fallback — see the last console.log in main.annotated.ts.
  lead?: { name: string; email?: string };
};

// 👉 Optional (`lead?: X`) and nullable (`lead: X | null`) are NOT the same
//    thing. Optional means the key may be absent; nullable means the key is
//    there holding null. Day 1's `closedOn: string | null` was the second kind.
//    APIs love to send `null`, so you will meet both — often on one object.

---
name: verify-before-assuming
description: Three checks before trusting an assumption about code. Use before reusing, inlining, changing or deleting a function; when testing a condition built from || or &&; when writing or reviewing an entry point that wires tested pieces together (Fastify app, Vercel Function, web root).
---

## Find every caller first

Before calling, inlining, changing or deleting a function, grep its name and read every result.

- A helper you are about to call may already run inside another function you call. Estimator validated the same input twice this way.
- A function that looks private may have other callers or its own tests. Treat it as shared.

Done when you can name every caller.

## Isolate each side of `||` and `&&`

A test where every part of the condition agrees can't tell `||` from `&&`. For each part, write one case where only that part is true (or false) and the rest are normal.

Example: `!isActive || !isVerified` rejects a Prepper. Test an inactive verified Prepper and an active unverified one, not only one who is both.

## Test the wiring, not just the parts

Pieces tested on their own don't prove the entry point assembles them. Ask: which test imports the real entry point (the app the Vercel Function exports, the web root with its router and query client) and drives it? If none, add one.

---
name: count-consumers-before-building
description: Count real consumers before building a general mechanism (generator, registry, config layer, variant prop, shared component, "X so it can Y"). Use when starting a stage, when a plan step describes a capability rather than a screen or route, or when about to write code whose job is to serve other code.
---

A plan describing a capability is not evidence anything needs it.

1. Grep `docs/stages.md`, `docs/features/`, `CONTEXT.md` and the wireframes board for the routes and screens that use it.
2. State the count and name each consumer: "two consumers: W6 code step, W9 checkout".
3. Zero: the step is speculative. Raise it with Rachel.
4. One or two: write the specific version at each site.
5. Build the general version only when the specific ones would repeat each other.

Example: estimator's plan said "sprites become components so they recolour". It produced a generator and 30 files. The spec had one recoloured sprite. All of it was deleted for plain `.svg` imports plus one special case.

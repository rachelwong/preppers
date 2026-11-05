- When writing something intended for human consumption, (comment, commit message, reply to prompt) use as few words as possible. Pick every word meticulously to reduce the volume to a strict minimum. Be down to the point. Less is more. Use Australian spelling.

- Avoid magic numbers and strings by extracting recurring or meaningful values into descriptive constants (const) or enums. Keep self-explanatory, one-off values inline to avoid clutter. If a value comes from a spec (e.g. HTTP 200 OK), use a constant regardless.

- When generating plans, use succinct mechanical list of steps. Do not describe code. Provide code snippet when asked or if appropriate.

- Keep function names short. Less than 30 characters.

- Don't make functions too small or shallow that do very little work. No single-use helpers, constants or types that add no clarity. No wrappers that only pass values through.

- Keep code flat and plain: early returns, no more than two levels of nesting.

- Use enums or constants instead of booleans for function parameters.

- Let the reader of the code breathe. Add empty lines between logical blocks of code.

- Comment only blocks that are complex or hold vital business logic. Say _what_ and _why_, briefly. Use examples when possible. Propose ASCII drawings to explain complete systems.

- Treat visibility changes as a breaking design shift. Don't `export` a function, constant or type unless another module needs it. Ask before exporting something that wasn't exported.

- Don't touch blocks of code unrelated to the feature you implement. e.g. Don't add comments to a block of code if you did not create it or modify it. As much as possible try to minimize the number of changed lines when implementing a feature.

- Always use {}, even on a one-line "if" statement.

- Strictly adhere to the layered boundary hierarchy: each layer may only communicate with its immediate neighbor directly below it. Never "punch holes" through layers (e.g., controllers or UI components must never directly call database queries, raw hardware drivers, or low-level network clients; always route through the intermediate service/abstraction layer). Layers, top to bottom:
  - `api`: routes → services → db (Drizzle).
  - `web`: routes/components → hooks → `src/api` client.

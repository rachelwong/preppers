---
name: separate-views-from-routing
description: Routes decide which screen shows; views render the data they get. Use when a web component picks between sibling screens by a status value, when deciding whether a state deserves its own route, or when a route file computes display content.
---

- A view never holds a switch or lookup choosing between sibling screens. That is a routing decision: give each screen its own TanStack route, or redirect in `beforeLoad`.
- A route never builds display content. It loads data and picks the view.
- Test: if a status value selects a whole screen, it belongs to the router. If it changes part of one screen (a badge, a button), it belongs to the view.

Example: `/orders/$id` showing pending, paid or cancelled details is one view with a status badge. A cancelled checkout sending the buyer back to the cart is a redirect, not a branch inside the checkout view.

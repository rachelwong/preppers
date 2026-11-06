---
name: readable-conditionals
description: Conditionals read in one pass. Use when writing or reviewing a ternary, a && / || / ?? chain, a !(...) group, or a one-liner that needs a second read.
---

- One ternary per expression. Each part is a plain value or name.
- A compound condition, negated group or inline object moves into a named `const` first.
- Three or more outcomes: an `if`/early-return function, not a chain.

```ts
// Before
const label = !(order.paid && !order.refunded) ? 'Unpaid' : order.handedOver ? 'Completed' : 'Paid'

// After
function orderLabel(order: Order) {
  if (!order.paid || order.refunded) {
    return 'Unpaid'
  }

  if (order.handedOver) {
    return 'Completed'
  }

  return 'Paid'
}
```

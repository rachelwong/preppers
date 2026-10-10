# 0012 — shadcn/ui as the base design system

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

The web app needs buttons, forms, dialogs, tables and a consistent look. Building these from scratch is slow and easy to get wrong for keyboard and screen reader users.

## Options

1. Hand-built components with plain CSS — full control, but a lot of work and accessibility to get right.
2. A packaged component library (for example MUI) — fast, but styling is harder to change and it adds a large dependency.
3. shadcn/ui on Tailwind CSS — components are copied into our repo and built on Radix primitives.

## Decision

Option 3. Components live in `web/src/components/ui/`. Theme colours, spacing and radius are CSS variables in one place.

## Consequences

- The components are our code, so we can change them.
- Radix gives keyboard and screen reader behaviour out of the box.
- Forms and tables fit React Hook Form and TanStack Table.
- Adds Tailwind CSS to the web app.
- Stage: 0.4.

# 0004 — Vercel hosting from one monorepo

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Hobby project on free tiers, with the web app, API and docs in one repo.

## Options

1. Vercel web + Render API — Render free sleeps after 15 minutes idle.
2. Vercel web + Fly.io or Railway API — no lasting free tier for new accounts.
3. Vercel for both, two projects from one repo — free, no long sleeps, one domain.
4. Google Cloud Run for the API — always-free tier, needs a card and Docker.

## Decision

Option 3. Two Vercel projects (`web`, `api`) from one repo. Each app has its own dependencies (see ADR 0009). The web project rewrites `/api/*` to the api project. Supabase cloud for the database. Cloud Run is the backup.

## Consequences

- Cookies stay first-party; no CORS in the browser.
- The API runs as a function: no in-memory state, no background workers. Scheduled jobs use Supabase `pg_cron` calling `/api/jobs/*`.
- Vercel Hobby is personal, non-commercial use only. Move to Pro before taking real money.
- Supabase free pauses after 7 days idle; a weekly GitHub Actions ping prevents it.
- Stages: 1.6, 8.1, 8.3. Guide: https://vercel.com/docs/monorepos

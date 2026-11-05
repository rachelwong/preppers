# 0015 — Open-source and free maps and places

- **Status:** accepted
- **Date:** 2026-11-05

## Problem

The app needs suburb and postcode search, street address entry, positions for distance search and a map pin. Google Maps needs a card and isn't open source. This is a hobby proof of concept: it must stay free and need little upkeep.

## Options

1. Google Maps and Geocoding: best data, needs a card.
2. A local table of Australian suburbs from an open dataset: no outside calls, but data to load and maintain.
3. Photon (open source, public, fair use) and LocationIQ (free key, about 5,000 a day) as its fallback, with answers saved; Leaflet with OpenStreetMap tiles for the map.

## Decision

Option 3.

- Suburb and postcode search, on submit only: saved answer (`geocode_cache`), then Photon, then LocationIQ. The position goes in the URL.
- Street addresses (Prepper pickup, buyer delivery): suggestions from Photon, then LocationIQ.
- Map: Leaflet with OpenStreetMap tiles, suburb-level pin.
- "Use my location": the browser.

## Consequences

- No card and no data upkeep.
- Photon has no SLA; LocationIQ has a daily cap and needs a visible attribution link. Saved answers, on-submit search and suggestions that wait for 3 characters and a pause keep calls low.
- OpenStreetMap house numbers are patchy in places; a typed address with its suburb's position still works.
- Saved answers expire as the providers' terms require. Confirm LocationIQ's free plan includes autocomplete before 2.3.
- Stages: 2.3, 3.3, 3.4, 5.1.

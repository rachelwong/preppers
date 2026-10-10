# PlaceLookup

## Fields

| Field | Type | Key | Rules |
| --- | --- | --- | --- |
| query | text | PK | normalised: trimmed, lowercase, e.g. `4000` or `west end qld` |
| lat | numeric |  | from Google Geocoding |
| lng | numeric |  | from Google Geocoding |
| label | text |  | Google's formatted name, e.g. "Brisbane City QLD 4000" |
| createdAt | timestamptz |  |  |

## Links

None. It's a cache of buyer searches, so the same suburb or postcode isn't geocoded twice.

- **Does:** turns a buyer's suburb or postcode into a point for distance search.
- **Checks:** Australia only (Geocoding `components=country:AU`); no match returns 422; rows older than 90 days are refreshed.
- **Built in:** 3.3
- [Back to data model](../../plan/06-data-model.md)

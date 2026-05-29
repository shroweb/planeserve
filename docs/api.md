# PlaneServe API

PlaneServe exposes a first-party JSON API under `/api/v1`. The current build is
mock-backed so the frontend and admin tools can integrate immediately; the same
contract can later be wired to Postgres, Supabase, supplier feeds, and payment
providers.

## Principles

- Users can request any aircraft part, even if it is not already known.
- Known parts come from aircraft profiles, alternate part numbers, supplier
  feeds, and historical AOG requests.
- Availability is treated as intelligence, not a hard catalogue constraint.
- Admin workflow owns the final sourcing, quote, paperwork, and fulfilment
  state.

## Endpoints

| Method  | Path                              | Purpose                                     |
| ------- | --------------------------------- | ------------------------------------------- |
| `GET`   | `/api/v1`                         | API index and endpoint list                 |
| `GET`   | `/api/v1/health`                  | Service health check                        |
| `GET`   | `/api/v1/me`                      | Current mocked member profile               |
| `GET`   | `/api/v1/aircraft`                | List enrolled aircraft                      |
| `GET`   | `/api/v1/aircraft/:id`            | Get one aircraft profile                    |
| `POST`  | `/api/v1/aircraft`                | Enrol an aircraft                           |
| `GET`   | `/api/v1/parts/search`            | Search known/requestable parts intelligence |
| `GET`   | `/api/v1/aog-requests`            | List AOG/parts requests                     |
| `GET`   | `/api/v1/aog-requests/:id`        | Get one request                             |
| `POST`  | `/api/v1/aog-requests`            | Submit a new AOG/parts request              |
| `PATCH` | `/api/v1/aog-requests/:id/status` | Update request status                       |
| `GET`   | `/api/v1/admin/overview`          | Admin operating snapshot                    |

## Parts Search

`GET /api/v1/parts/search?q=hydraulic&registration=G-HRTB`

The response returns matches from:

- `aircraft-profile`: common parts stored against an enrolled aircraft
- `alternate-part-number`: known alternates for that aircraft or system
- `historical-request`: parts previously requested through PlaneServe

Every result includes `requestable: true`. If there are no matches, the user
should still be allowed to submit an AOG request with a free-text part number,
description, aircraft details, and supporting documents.

## Create AOG Request

`POST /api/v1/aog-requests`

```json
{
  "aircraftId": "ac_learjet_35a",
  "location": "EGKB Biggin Hill",
  "affectedSystem": "Hydraulic pump assembly",
  "partNumber": "6608503-1",
  "issueDescription": "Left system pressure dropped after taxi.",
  "urgency": "Aircraft grounded",
  "attachments": ["tech-log.pdf", "part-photo.jpg"]
}
```

The API calculates a mock `priorityScore`, adds `priorityReasons`, and creates
a document checklist for the admin workflow.

## Future Data Sources

The API should eventually be backed by:

- Postgres tables for aircraft, requests, parts, suppliers, RFQs, quotes, and
  documents
- supplier CSV/API/SFTP inventory feeds
- historical quote and fulfilment data
- admin-entered alternates and supplier capability notes
- real auth and row-level access controls

This keeps PlaneServe from depending on a mythical complete parts catalogue
while still building a useful part intelligence layer over time.

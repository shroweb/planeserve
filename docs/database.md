# PlaneServe Database Tables

The app uses Better Auth for `user`, `session`, `account`, and verification tables.

PlaneServe product tables live in `src/lib/db/schema.ts`:

- `profiles`: app profile, company, phone, role, admin flag for each auth user.
- `aircraft`: enrolled aircraft records and mock subscription status.
- `aog_requests`: operational AOG support requests.
- `aog_request_attachments`: uploaded filename/storage metadata for AOG files.
- `aog_status_events`: status history/audit trail for each AOG request.
- `subscriptions`: mock billing subscription records per aircraft.
- `invoices`: mock paid invoice rows for local billing views.
- `admin_notes`: future admin notes against customers, aircraft, or AOG requests.

Local setup:

```bash
npm run db:setup
```

Demo accounts after seeding:

- Member: `demo@planeserve.aero` / `planeserve-demo`
- Admin: `admin@planeserve.aero` / `planeserve-admin`

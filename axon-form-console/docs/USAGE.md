# Axon Form Console — Usage Guide

This guide walks through using Axon Form Console end to end: standing up the stack, logging in, building a form, and exporting it as Axon JSON for the Flutter runtime. It reflects the latest changes on `main`, including auto-seeded PocketBase superuser accounts and the new **Phone Number** field type.

## 1. What it is

Axon Form Console is the web authoring app for Axon Form. It lets admins:

- Create, update, and delete forms
- Create and order form pages
- Add and configure form fields (including the new Phone Number field)
- Configure field options (dropdown, radio, multi-select, address, phone number country codes)
- Configure validation rules
- Configure conditional show/hide logic between fields and pages
- Import and export Axon JSON

Data is stored in PocketBase; the console exports form definitions as Axon JSON consumed by the Flutter runtime.

## 2. Start the stack

### Option A — Docker Compose (recommended)

From the `axon-form-console` directory:

```bash
cp .env.example .env
docker compose up
```

`.env.example` now includes two groups of variables:

```env
#
# Pocketbase Config
#
VITE_POCKETBASE_URL=
VITE_POCKETBASE_PORT=

#
# Pocketbase Superuser (auto-seeded on container start)
#
PB_SUPERUSER_EMAIL=admin@axon.local
PB_SUPERUSER_PASSWORD=changeme123456
```

`PB_SUPERUSER_EMAIL` / `PB_SUPERUSER_PASSWORD` are new — `compose.yaml` now passes them into the `db` service's environment, and `Dockerfile.pb` copies in `pocketbase/entrypoint.sh` as the container `ENTRYPOINT`. On boot, the entrypoint:

1. Applies migrations in `pocketbase/pb_migrations` (schema is created automatically on a fresh `pb_data` volume — no manual import).
2. If both superuser env vars are set, runs `pocketbase superuser upsert` to create or reset that account. If either var is missing, it logs a message and skips seeding.
3. Execs `pocketbase serve --http=0.0.0.0:8080`.

This starts two services:

- PocketBase backend: `http://localhost:8080`
- Console frontend: `http://localhost:5173`

### Option B — Frontend only (PocketBase already running elsewhere)

```bash
cd axon-form-console
# create .env with:
#   VITE_POCKETBASE_URL=http://127.0.0.1
#   VITE_POCKETBASE_PORT=8080
npm install
npm run dev
```

Open `http://localhost:5173`. Make sure a superuser exists (`docker compose up db`, or `./pocketbase superuser upsert <email> <password>` manually).

## 3. Log in

Go to `http://localhost:5173` and sign in with your PocketBase superuser credentials — by default:

```text
email:    admin@axon.local
password: changeme123456
```

If you change `PB_SUPERUSER_PASSWORD` in `.env` later, restart just the `db` service to re-seed it:

```bash
docker compose up -d --build db
```

Lost access to `.env`? Reset the password directly in the running container:

```bash
docker compose exec db /pb/pocketbase superuser upsert <email> <newpassword>
```

This overwrites the password in place with no data loss.

## 4. Create a form

1. From the form list, click **Create Form** and give it a name/description.
2. Open the form to reach the form detail view, which lists its pages.

## 5. Add pages

1. Inside a form, use **Create Page** to add a page.
2. Reorder pages as needed — the runtime renders pages in this order.
3. Open a page to enter its detail/graph view, where fields, options, validations, and conditions live.

## 6. Add fields to a page

From a page's graph view, add an input node and pick a field type. Supported field types:

| Label | Value | Has configurable options |
|---|---|---|
| Text | `text` | |
| Number | `number` | |
| Date | `date` | |
| Multi Select | `multi_select` | ✓ |
| Radio | `radio` | ✓ |
| Dropdown | `dropdown` | ✓ |
| Address Dropdown | `address_dropdown` | ✓ |
| Checkbox | `checkbox` | |
| File | `file` | |
| Password | `password` | |
| **Phone Number** | `phone_number` | ✓ *(new)* |

**Phone Number** is the newest addition. Like the other options-based field types (multi-select, radio, dropdown, address dropdown), it supports an attached options list — used for configuring things like selectable country/dial codes — via the same "has options" edge as the rest of that group.

For each field, set its label, key/name, and any type-specific settings in the field's form panel.

## 7. Configure field options

For option-bearing field types (dropdown, radio, multi-select, address dropdown, phone number), open the field's options editor and add the selectable values (label + value pairs, or address/phone-code entries where applicable).

## 8. Configure validation rules

Attach validation rules to a field via the validation edge. Available rule types:

- `required` — field must have a value
- `email` — must be a valid email address
- `min_length` / `max_length` — string length bounds
- `pattern` — must match a regex
- `min` / `max` — numeric bounds

Multiple rules can be attached to the same field.

## 9. Configure conditional logic

Use condition groups to show/hide fields or pages based on other fields' values.

1. Create a condition group and choose how its conditions combine: `and`, `or`, or `nor`.
2. Add one or more conditions, each comparing a source field against a value using an expression:
   `equal`, `not_equal`, `more_than`, `less_than`, `more_than_or_equal`, `less_than_or_equal`,
   `contains`, `starts_with`, `ends_with`, `duration_less_than`, `duration_more_than`.
3. Attach the condition group to the target field or page via a `shows` edge so it's shown/hidden when the group evaluates true.

## 10. Import / export Axon JSON

- **Export**: from the form detail view, export the form definition as Axon JSON — this is the format the Flutter runtime consumes.
- **Import**: import an existing Axon JSON file to recreate/edit a form definition in the console instead of building it from scratch. (A sample export, `210726-khmereid-passport-request-on-behalf-form.json`, is checked in at the repo root for reference.)

## 11. Recap: end-to-end flow

1. `docker compose up` (superuser auto-seeded from `.env`).
2. Log in at `http://localhost:5173`.
3. Create a form.
4. Add and order pages.
5. On each page, add fields (including the new Phone Number type where needed).
6. Configure options for option-bearing fields.
7. Attach validation rules.
8. Wire up conditional show/hide logic between fields/pages.
9. Export as Axon JSON for the Flutter runtime (or import an existing JSON to keep editing).

# Axon Form Console

Axon Form Console is the web authoring application for Axon Form. It lets admins create and manage dynamic form definitions, pages, fields, options, validation rules, and conditional logic. The console stores data in PocketBase and can export form definitions as Axon JSON for use by the Flutter runtime.

## Features

- Create, update, and delete forms.
- Create and order form pages.
- Add and configure form fields.
- Configure field options for dropdown, radio, multi-select, and address fields.
- Configure validation rules.
- Configure conditional show/hide logic.
- Import and export Axon JSON.
- Authenticate with a PocketBase superuser account.

## Tech Stack

- React
- TypeScript
- Vite
- PocketBase
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS

## Prerequisites

For Docker setup:

- Docker
- Docker Compose

For local frontend development without Docker:

- Node.js
- npm
- A running PocketBase instance

## Run With Docker Compose

From the console directory, copy the example env file and adjust it if you want non-default credentials:

```bash
cd axon-form-console
cp .env.example .env
```

Then start the stack:

```bash
docker compose up
```

This starts two services:

- PocketBase backend: `http://localhost:8080`
- Axon Form Console frontend: `http://localhost:5173`

On startup, PocketBase automatically:

- Applies the schema in `pocketbase/pb_migrations`, so all collections exist on a fresh/empty `pb_data` volume — no manual schema import needed, even on a brand-new machine.
- Seeds (or resets) the superuser account using `PB_SUPERUSER_EMAIL` / `PB_SUPERUSER_PASSWORD` from `.env` (see `pocketbase/entrypoint.sh`), so there's no separate PocketBase setup-wizard step.

Defaults (from `.env.example`):

```text
email:    admin@axon.local
password: changeme123456
```

Open the frontend console at `http://localhost:5173` and log in with those credentials (or whatever you set in `.env`). Change them for anything beyond local development.

## Resetting the Superuser Password

If you change `PB_SUPERUSER_PASSWORD` in `.env`, restart just the `db` service and the entrypoint script will reset the account's password on boot:

```bash
docker compose up -d --build db
```

If you've lost access to `.env` entirely (or need to recover without restarting), shell into the running container and upsert the superuser manually:

```bash
docker compose exec db /pb/pocketbase superuser upsert <email> <newpassword>
```

This works even if the account already exists — it overwrites the password in place, no data loss.

## Manual Frontend Setup

If you want to run only the frontend locally, first create a `.env` file in `axon-form-console`:

```env
VITE_POCKETBASE_URL=http://127.0.0.1
VITE_POCKETBASE_PORT=8080
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

Make sure PocketBase is already running and that a superuser account has been created (run `docker compose up db` first, or create one manually with `./pocketbase superuser upsert <email> <password>`).

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

From the console directory:

```bash
cd axon-form-console
docker compose up
```

This starts two services:

- PocketBase backend: `http://localhost:8080`
- Axon Form Console frontend: `http://localhost:5173`

## First-Time PocketBase Setup

When PocketBase starts for the first time, the terminal prints a setup link like this:

```text
http://0.0.0.0:8080/_/#/pbinstal/...
```

Open that link in your browser, or replace `0.0.0.0` with `localhost`:

```text
http://localhost:8080/_/#/pbinstal/...
```

Use the PocketBase setup page to create the first superuser account.

After the superuser account is created:

1. Open the frontend console at `http://localhost:5173`.
2. Log in using the same superuser email and password.
3. Start creating and managing forms.

The frontend uses PocketBase superuser authentication, so the console cannot be used until this account exists.

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

Make sure PocketBase is already running and that a superuser account has been created.

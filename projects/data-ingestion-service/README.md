# Data Ingestion Service

Data Ingestion Service — Fetch paginated JSON from `data-provider-service`, apply heavy transformations, and batch insert into PostgreSQL.

---

## Features

- Fetches data in pages (configurable `PAGE_LIMIT`)
- Heavy data cleaning & transformation (name normalization, tokenization, city normalization, type safety)
- Batch inserts with `ON CONFLICT (id) DO UPDATE`
- Runs daily via `node-cron`
- Manual run mode for testing

---

## Quickstart

1. Copy `.env.example` → `.env` and update values (DB credentials, provider URL).
2. Initialize database:
   - Create database: `createdb etl_db` (or via pgAdmin)
   - Run SQL: `psql -d etl_db -f db/init.sql`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Test run once (recommended):
   ```bash
   ETL_RUN_ONCE=1 npm run run-once
   ```
5. Start scheduled service:
   ```bash
   npm start
   ```
   This will run ETL immediately at startup and then daily according to `CRON_SCHEDULE`.

---

## Important Environment Variables (see .env.example)

- `PROVIDER_URL` — URL of the data provider (http://localhost:4000/data)
- `PAGE_LIMIT` — how many records to request per page from provider
- `BATCH_SIZE` — how many records to insert per DB chunk
- `CRON_SCHEDULE` — cron expression for daily runs

---

## Schema (db/init.sql)

See `db/init.sql` for the table schema.

---

## Notes

This project does sequential page fetching to avoid overwhelming the provider. If faster ingestion is needed, we can add concurrency control, retries, and rate limiting.

For production, run with PM2 or systemd and monitor logs.

---

## How to Run Locally (Summary)

1. Copy `.env.example` → `.env`, update DB credentials (and ensure `PROVIDER_URL` points to your running `data-provider-service`).
2. From `Nodejs_Projects/projects/data-ingestion-service/`:
   ```bash
   npm install
   createdb etl_db   # if not exists
   psql -d etl_db -f db/init.sql
   ETL_RUN_ONCE=1 npm run run-once   # test run
   npm start                         # start scheduler (runs daily)
   ```
   For production use, run `npm start` under PM2 or systemd to ensure long-lived process.

---

## Production Recommendations & Improvements

- Use a job queue (BullMQ, RabbitMQ) for concurrency and retries.
- Use bulk COPY for extremely large inserts (faster than parameterized INSERT).
- Add observability: metrics, alerts, structured logs.
- Add idempotency keys and checkpoints so you can resume failed runs (store last processed page).
- Add retries with exponential backoff when fetch or DB fails.
- Add schema migrations (Flyway, Liquibase, or node-pg-migrate).

# Cloudflare Development

`just setup` installs dependencies, starts the local database and applies migrations. `just start` runs the app and `just build` creates the Cloudflare build output. `just check` uses Bun's linter, formatter and type checker; `bun run types` generates the Worker bindings in `.cloudflare/types`.

`just deploy` builds the Worker, applies database migrations, and uploads every key in `.env` as a secret with the deployment. A failed migration stops the upload. To select another file, run `just environment=production deploy` for `.env.production`. Keep `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in the process environment, outside the selected file. GitHub Actions creates `.env` from Production values and runs `just deploy`, without a separate migration step. The deploy recipe sets `CI=true` for its migration call so local Docker is skipped even when deploying from a developer machine; the selected file supplies the database URL.

## Local Database

[`compose.yml`](../../compose.yml) runs Postgres 17 on port 5432 and a Neon HTTP proxy on port 4444. `just start` and `just migrate` start both containers, and `just decompose` stops them. `just setup` stops them after migrating unless run as `just setup prerun`. When the `DATABASE_URL` host is `db.localtest.me`, [`src/lib/database/index.ts`](../../src/lib/database/index.ts) sends queries to the local proxy instead of Neon. Set `CI=true` to skip Docker entirely.

Change the schema in [`src/lib/database/schema.ts`](../../src/lib/database/schema.ts), run `bun run db:generate` to add a migration to `migrations/`, and apply it with `just migrate`.

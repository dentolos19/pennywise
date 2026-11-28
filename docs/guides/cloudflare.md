# Cloudflare Development

Worker bindings and secrets are declared in [`cloudflare.config.ts`](../../cloudflare.config.ts). `bun run types` generates their types in `.cloudflare/types`, and runs after every install.

## Deployment

`just deploy` builds the Worker, applies database migrations, and uploads every key in `.env` as a secret with the deployment. A failed migration stops the upload. To select another file, run `just environment=production deploy` for `.env.production`. Keep `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in the process environment, outside the selected file. GitHub Actions creates `.env` from Production values and runs `just deploy`, without a separate migration step. The deploy recipe sets `CI=true` for its migration call so local Docker is skipped even when deploying from a developer machine; the selected file supplies the database URL.

`NEXT_PUBLIC_APP_URL` is read at build time and inlined into the client bundle, so set it before `just build` or `just deploy`.

## Local Database

[`compose.yml`](../../compose.yml) runs Postgres 17 on port 5432 and a Neon HTTP proxy on port 4444. `just start` and `just migrate` start both containers, and `just decompose` stops them. `just setup` stops them after migrating. When the `DATABASE_URL` host is `db.localtest.me`, [`src/lib/database/index.ts`](../../src/lib/database/index.ts) sends queries to the local proxy instead of Neon. Set `CI=true` to skip Docker entirely.

Change the schema in [`src/lib/database/schema.ts`](../../src/lib/database/schema.ts), run `bun run db:generate` to add a migration to `migrations/`, and apply it with `just migrate`.

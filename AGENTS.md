# Agent Instructions

Pennywise is a financial literacy app for teenagers with lessons, a rewards shop, a community feed, an AI assistant, and an expense tracker. It was built for Code Overflow 2024 and now runs on Cloudflare Workers.

## Commands

- `just setup`: Install dependencies, start the local database, apply migrations, and stop the database. Use `just setup prerun` to leave it running.
- `just start`: Start the local database and run the development server.
- `just build`: Create the Cloudflare build output.
- `just check`: Lint, format, and type check with Bun.
- `just test`: Run the Bun tests in `tests/`.
- `just migrate`: Apply Drizzle migrations to the database in `DATABASE_URL`.
- `just compose` and `just decompose`: Start and stop the local Docker database.
- `just deploy`: Build, migrate the production database, and deploy the Worker.

## Stack

Vinext (Next.js App Router on Vite) on Cloudflare Workers, React 19, MUI with Tailwind CSS, Drizzle ORM on Neon Postgres, Better Auth, the AI SDK with OpenRouter, and Bun.

## Rules

- Define the database schema in [`src/lib/database/schema.ts`](src/lib/database/schema.ts) and generate migrations into `migrations/` with `bun run db:generate`.
- Declare Worker bindings and secrets in [`cloudflare.config.ts`](cloudflare.config.ts), and list each secret in `.env.template`.
- Server actions must resolve the user with `requireUserId` from [`src/lib/auth.ts`](src/lib/auth.ts) and check ownership before changing a record.

## Documentation

- [Product Specifications](PRODUCT.md).
- [Design System](DESIGN.md).
- [Documentation Guidelines](docs/README.md).
- [Cloudflare Development](docs/guides/cloudflare.md).

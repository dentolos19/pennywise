# Agent Instructions

Pennywise is a financial literacy app for teenagers with lessons, a rewards shop, a community feed, an AI assistant, and an expense tracker. It was built for Code Overflow 2024 and now runs on Cloudflare Workers.

## Commands

- `just setup`: Install dependencies, start the local database, apply migrations, and stop the database.
- `just install`: Install dependencies from the lockfile.
- `just start`: Start the local database and run the development server on port 3000.
- `just compose`: Start the local Docker database.
- `just decompose`: Stop the local Docker database.
- `just build`: Create the Cloudflare build output.
- `just check`: Lint, format, and type check with Bun.
- `just test`: Run the Bun tests in `tests/`.
- `just migrate`: Apply Drizzle migrations to the database in `DATABASE_URL`.
- `just deploy`: Build, migrate the production database, and deploy the Worker. Set `environment=production` to use `.env.production`.

## Stack

Vinext (Next.js App Router on Vite) on Cloudflare Workers, React 19, MUI with Tailwind CSS, Drizzle ORM on Neon Postgres, Better Auth, the AI SDK with OpenRouter, and Bun.

## Rules

- Keep the Next.js App Router code on Vinext and MUI instead of migrating to TanStack Start and shadcn/ui. See [0001](docs/decisions/0001-vinext-and-mui.md).
- Define the database schema in [`src/lib/database/schema.ts`](src/lib/database/schema.ts) and generate migrations into `migrations/` with `bun run db:generate`.
- Declare Worker bindings and secrets in [`cloudflare.config.ts`](cloudflare.config.ts), and list each secret in `.env.template`.
- Server actions must resolve the user with `requireUserId` from [`src/lib/auth.ts`](src/lib/auth.ts) and check ownership before changing a record.

## Documentation

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)

# 0001. Vinext and MUI

- Status: Accepted
- Date: 2026-11-28

## Context

Pennywise was built in 2024 as a Next.js App Router app with MUI. It now runs on Cloudflare Workers. The conventions prefer TanStack Start with shadcn/ui for new TypeScript web apps.

## Decision

Keep the Next.js App Router code and run it with Vinext on Vite through the `cf` CLI, and keep MUI with Tailwind CSS as the UI framework. Migrating to TanStack Start and shadcn/ui would mean rewriting every route and component without changing the product.

## Consequences

- Routes, layouts, and server actions follow Next.js conventions in `src/app/`, and imports from `next/*` resolve through Vinext.
- UI work follows MUI patterns described in [`DESIGN.md`](../../DESIGN.md).
- `cf` stays pinned to `1.0.0-beta.26` with the matching `@cloudflare/vite-plugin` beta, so update them together.

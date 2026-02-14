setup:
    bun install
    just migrate

start:
    bun run dev

check:
    bun run check

migrate:
    bun run db:migrate

set dotenv-load

setup mode="": install compose
    just --no-deps migrate
    if [ "{{ mode }}" != "prerun" ]; then just decompose; fi

install:
    bun install --frozen-lockfile

start: compose
    bun run dev

compose:
    if [ "${CI:-false}" != "true" ]; then docker compose up --detach --wait; fi

decompose:
    if [ "${CI:-false}" != "true" ]; then docker compose down; fi

build:
    bun run build

check:
    bun run check

test:
    bun test

migrate: compose
    bun run db:migrate

deploy: install
    #!/usr/bin/env bash
    set -euo pipefail
    secrets=(
        BETTER_AUTH_SECRET
        BETTER_AUTH_URL
        DATABASE_URL
        OPENROUTER_API_KEY
        OPENROUTER_MODEL
        OPENROUTER_REFERER
        OPENROUTER_TITLE
    )
    for secret in "${secrets[@]}"; do if [[ -z "${!secret:-}" ]]; then echo "Missing secret value: $secret" >&2; exit 1; fi; done
    node -e 'process.stdout.write(JSON.stringify(Object.fromEntries(process.argv.slice(1).map((name) => [name, process.env[name]]))))' "${secrets[@]}" | bun wrangler secret bulk
    bun run deploy

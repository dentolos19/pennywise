set dotenv-load

setup mode="": install
    just compose
    just migrate
    if [ "{{ mode }}" != "prerun" ]; then just decompose; fi

install:
    bun install --frozen-lockfile

start: compose
    bun run dev

compose:
    docker compose up --detach --wait

decompose:
    docker compose down

build:
    bun run build

check:
    bun run check

migrate:
    bun run db:migrate

deploy:
    #!/usr/bin/env bash
    set -euo pipefail
    names=(
        BETTER_AUTH_SECRET
        BETTER_AUTH_URL
        DATABASE_URL
        OPENROUTER_API_KEY
        OPENROUTER_MODEL
        OPENROUTER_REFERER
        OPENROUTER_TITLE
    )
    for name in "${names[@]}"; do if [[ -z "${!name:-}" ]]; then echo "Missing worker secret value: $name" >&2; exit 1; fi; done
    node -e 'process.stdout.write(JSON.stringify(Object.fromEntries(process.argv.slice(1).map((name) => [name, process.env[name]]))))' "${names[@]}" | bun wrangler secret bulk
    bun run deploy

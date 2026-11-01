set dotenv-load
set dotenv-filename := dotenv_file
set dotenv-override

environment := ""
dotenv_file := if environment == "" { ".env" } else { ".env." + environment }

setup mode="": install compose
    just --no-deps environment={{ quote(environment) }} migrate
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
    bun lint --fix && bun fmt && bun check --no-script

test:
    bun test

migrate: compose
    bun run db:migrate

deploy: install build
    #!/usr/bin/env bash
    set -euo pipefail
    test -f {{ quote(dotenv_file) }}
    CI=true just environment={{ quote(environment) }} migrate
    bun run deploy --prebuilt --secrets-file {{ quote(dotenv_file) }}

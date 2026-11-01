import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "pennywise",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-01",
    observability: {
      logs: { enabled: true },
      traces: { enabled: true },
      issues: { enabled: true },
    },
    domains: ["pennywise.dennise.me"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
      BETTER_AUTH_SECRET: bindings.secret(),
      BETTER_AUTH_URL: bindings.secret(),
      DATABASE_URL: bindings.secret(),
      OPENROUTER_API_KEY: bindings.secret(),
      OPENROUTER_MODEL: bindings.secret(),
      OPENROUTER_REFERER: bindings.secret(),
      OPENROUTER_TITLE: bindings.secret(),
    },
  }),
});

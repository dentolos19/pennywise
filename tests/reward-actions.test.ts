import { expect, test } from "bun:test";

// Isolate module mocks so they cannot affect the other test files.
test("reward actions enforce authentication, catalog values and atomic balances", () => {
  const result = Bun.spawnSync([process.execPath, "run", "tests/fixtures/reward-actions.ts"]);
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  expect(result.exitCode).toBe(0);
});

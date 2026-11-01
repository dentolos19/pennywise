import { strict as assert } from "node:assert";
import { mock } from "bun:test";
import { PgDialect } from "drizzle-orm/pg-core";

const dialect = new PgDialect();
let currentUser: string | null = "member-1";
let found = true;
let writes = 0;
let setQuery: { sql: string; params: unknown[] };
let whereQuery: { sql: string; params: unknown[] };
mock.module("../../src/lib/auth", () => ({
  requireUserId: async () => {
    if (!currentUser) throw new Error("Unauthorized");
    return currentUser;
  },
}));
mock.module("../../src/lib/database", () => ({
  getDatabase: () => ({
    update: () => ({
      set(values: { points: Parameters<PgDialect["sqlToQuery"]>[0] }) {
        setQuery = dialect.sqlToQuery(values.points);
        return {
          where(predicate: Parameters<PgDialect["sqlToQuery"]>[0]) {
            whereQuery = dialect.sqlToQuery(predicate);
            return {
              returning: async () => {
                writes++;
                return found ? [{ points: 1000 }] : [];
              },
            };
          },
        };
      },
    }),
  }),
}));
const { completeLessonAction } = await import("../../src/app/(platform)/learn/actions");
const { redeemItemAction } = await import("../../src/app/(platform)/shop/actions");
await completeLessonAction("lv1", [2, 2, 0, 1, 1]);
assert.match(setQuery!.sql, /"points"\s*\+/);
assert.deepEqual(setQuery!.params, [1000]);
assert.ok(whereQuery!.params.includes("member-1"));
await assert.rejects(completeLessonAction("lv1", [2, 2, 0, 1, 0]));
assert.equal(writes, 1);
await redeemItemAction("$15 Shopping Voucher");
assert.match(setQuery!.sql, /"points"\s*-/);
assert.deepEqual(setQuery!.params, [9000]);
assert.match(whereQuery!.sql, /"points"\s*>=/);
assert.ok(whereQuery!.params.includes("member-1"));
assert.ok(whereQuery!.params.includes(9000));
found = false;
await assert.rejects(redeemItemAction("$15 Shopping Voucher"), /Insufficient points/);
currentUser = null;
await assert.rejects(completeLessonAction("lv1", [2, 2, 0, 1, 1]), /Unauthorized/);
assert.equal(writes, 3);
console.log("Reward actions enforce authentication, catalog values and atomic balance predicates.");

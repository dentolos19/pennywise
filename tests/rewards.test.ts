import { expect, test } from "bun:test";

import { itemCost, lessonReward } from "@/lib/rewards";

test("lesson awards use the catalog and require every correct answer", () => {
  expect(lessonReward("lv1", [2, 2, 0, 1, 1])).toBe(1000);
  expect(() => lessonReward("lv1", [2, 2, 0, 1, 0])).toThrow();
  expect(() => lessonReward("lv1", [2, 2, 0, 1])).toThrow();
  expect(() => lessonReward("lv1", [2, 2, 0, 1, "1"])).toThrow();
  expect(() => lessonReward("missing", [2, 2, 0, 1, 1])).toThrow();
});

test("redemption costs come from the catalog", () => {
  expect(itemCost("$15 Shopping Voucher")).toBe(9000);
  expect(() => itemCost("Unknown reward")).toThrow();
});

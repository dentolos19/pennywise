"use server";

import { and, eq, gte, sql } from "drizzle-orm";

import { requireUserId } from "@/lib/auth";
import { getDatabase } from "@/lib/database";
import { user } from "@/lib/database/schema";
import { itemCost } from "@/lib/rewards";

export async function redeemItemAction(name: string) {
  const userId = await requireUserId("You must be logged in to redeem items.");
  const cost = itemCost(name);
  const [updated] = await getDatabase()
    .update(user)
    .set({ points: sql`${user.points} - ${cost}` })
    .where(and(eq(user.id, userId), gte(user.points, cost)))
    .returning({ points: user.points });
  if (!updated) throw new Error("Insufficient points.");
  return updated.points;
}

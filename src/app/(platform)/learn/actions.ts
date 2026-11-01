"use server";

import { eq, sql } from "drizzle-orm";

import { requireUserId } from "@/lib/auth";
import { getDatabase } from "@/lib/database";
import { user } from "@/lib/database/schema";
import { lessonReward } from "@/lib/rewards";

export async function completeLessonAction(id: string, answers: number[]) {
  const userId = await requireUserId("You must be logged in to complete lessons.");
  const reward = lessonReward(id, answers);
  const [updated] = await getDatabase()
    .update(user)
    .set({ points: sql`${user.points} + ${reward}` })
    .where(eq(user.id, userId))
    .returning({ points: user.points });
  if (!updated) throw new Error("User not found.");
  return updated.points;
}

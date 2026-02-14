import { eq, desc } from "drizzle-orm";

import { getDatabaseClient } from "@/lib/database";
import { expense } from "@/lib/database/schema";

export type Expense = typeof expense.$inferSelect;
export type NewExpense = typeof expense.$inferInsert;

export async function createExpense(
  userId: string,
  data: { name: string; description?: string; date: Date; cost: number; quantity: number; tags?: string[] },
) {
  const database = getDatabaseClient();
  const [created] = await database
    .insert(expense)
    .values({
      name: data.name,
      description: data.description,
      date: data.date,
      cost: data.cost,
      quantity: data.quantity,
      tags: data.tags,
      userId,
    })
    .returning();
  return created;
}

export async function getExpense(expenseId: string) {
  const database = getDatabaseClient();
  const [result] = await database.select().from(expense).where(eq(expense.id, expenseId));
  return result;
}

export async function getExpenses(userId: string) {
  const database = getDatabaseClient();
  const results = await database.select().from(expense).where(eq(expense.userId, userId)).orderBy(desc(expense.date));
  return results;
}

export async function updateExpense(
  expenseId: string,
  data: Partial<{ name: string; description: string; date: Date; cost: number; quantity: number; tags: string[] }>,
) {
  const database = getDatabaseClient();
  const [updated] = await database.update(expense).set(data).where(eq(expense.id, expenseId)).returning();
  return updated;
}

export async function deleteExpense(expenseId: string) {
  const database = getDatabaseClient();
  await database.delete(expense).where(eq(expense.id, expenseId));
}

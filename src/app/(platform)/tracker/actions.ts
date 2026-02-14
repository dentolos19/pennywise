"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense, type Expense } from "@/lib/expenses";

type ExpenseInput = {
  name: string;
  description?: string;
  date: Date;
  cost: number;
  quantity: number;
  tags?: string[];
};

async function requireUserId() {
  const session = await auth.api.getSession({ headers: headers() });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be logged in to manage expenses.");
  }

  return userId;
}

async function requireOwnedExpense(expenseId: string, userId: string): Promise<Expense> {
  const expense = await getExpense(expenseId);

  if (!expense || expense.userId !== userId) {
    throw new Error("Expense not found.");
  }

  return expense;
}

export async function getExpensesAction() {
  const userId = await requireUserId();
  return getExpenses(userId);
}

export async function getExpenseAction(expenseId: string) {
  const userId = await requireUserId();
  return requireOwnedExpense(expenseId, userId);
}

export async function createExpenseAction(data: ExpenseInput) {
  const userId = await requireUserId();
  return createExpense(userId, data);
}

export async function updateExpenseAction(expenseId: string, data: Partial<ExpenseInput>) {
  const userId = await requireUserId();
  await requireOwnedExpense(expenseId, userId);
  return updateExpense(expenseId, data);
}

export async function deleteExpenseAction(expenseId: string) {
  const userId = await requireUserId();
  await requireOwnedExpense(expenseId, userId);
  await deleteExpense(expenseId);
}

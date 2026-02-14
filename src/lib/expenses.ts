import { collectionIds, databaseIds, databases } from "@/lib/integrations/appwrite/main";
import { Expense, ExpenseDocument, ExpenseDocumentSchema } from "@/lib/integrations/appwrite/types";
import { ID, Query } from "appwrite";

export async function createExpense(userId: string, data: Omit<Expense, "user">) {
  const doc = await databases.createDocument(databaseIds.main, collectionIds.expenses, ID.unique(), {
    ...data,
    user: userId,
  });
  return ExpenseDocumentSchema.parse(doc) as ExpenseDocument;
}

export async function getExpense(expenseId: string) {
  const doc = await databases.getDocument(databaseIds.main, collectionIds.expenses, expenseId);
  return ExpenseDocumentSchema.parse(doc) as ExpenseDocument;
}

export async function getExpenses(userId: string) {
  const res = await databases.listDocuments(databaseIds.main, collectionIds.expenses, [
    Query.equal("user", userId),
    Query.orderDesc("date"),
  ]);
  return res.documents.map((doc) => ExpenseDocumentSchema.parse(doc) as ExpenseDocument);
}

export async function updateExpense(expenseId: string, data: Partial<Omit<Expense, "user">>) {
  const res = await databases.updateDocument(databaseIds.main, collectionIds.expenses, expenseId, data);
  return ExpenseDocumentSchema.parse(res) as ExpenseDocument;
}

export async function deleteExpense(expenseId: string) {
  await databases.deleteDocument(databaseIds.main, collectionIds.expenses, expenseId);
}

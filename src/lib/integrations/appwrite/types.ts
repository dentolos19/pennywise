import { Models } from "appwrite";
import { z } from "zod";

export type User = Models.User<UserPrefs>;

export type UserPrefs = Models.Preferences & {
  monthlyBudget?: number;
  geminiApiKey?: string;
};

export type UserInfo = z.infer<typeof UserInfoSchema>;
export type UserInfoDocument = z.infer<typeof UserInfoDocumentSchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostDocument = z.infer<typeof PostDocumentSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
export type ExpenseDocument = z.infer<typeof ExpenseDocumentSchema>;

export const DocumentSchema = z.object({
  $id: z.string(),
  $databaseId: z.string(),
  $collectionId: z.string(),
  $createdAt: z.coerce.date(),
  $updatedAt: z.coerce.date(),
});

export const UserInfoSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  points: z.number(),
});

export const UserInfoDocumentSchema = UserInfoSchema.merge(DocumentSchema);

export const PostSchema = z.object({
  content: z.string(),
  mediaUrl: z.string().nullish(),
  user: UserInfoDocumentSchema.nullish(),
});

export const PostDocumentSchema = PostSchema.merge(DocumentSchema);

export const ExpenseSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  date: z.coerce.date(),
  cost: z.number(),
  quantity: z.number(),
  tags: z.array(z.string()).nullish(),
  user: UserInfoDocumentSchema.nullish(),
});

export const ExpenseDocumentSchema = ExpenseSchema.merge(DocumentSchema);

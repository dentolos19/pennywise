import { eq, desc } from "drizzle-orm";

import { getDatabaseClient } from "@/lib/database";
import { post } from "@/lib/database/schema";

export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;

export async function createPost(userId: string, data: { content: string; mediaUrl?: string }) {
  const database = getDatabaseClient();
  const [created] = await database
    .insert(post)
    .values({
      content: data.content,
      mediaUrl: data.mediaUrl,
      userId,
    })
    .returning();
  return created;
}

export async function getPost(postId: string) {
  const database = getDatabaseClient();
  const [result] = await database.select().from(post).where(eq(post.id, postId));
  return result;
}

export async function getPostsWithUser(postId: string) {
  const database = getDatabaseClient();
  const [result] = await database.query.post.findFirst({
    where: eq(post.id, postId),
    with: { user: true },
  });
  return result;
}

export async function getPosts() {
  const database = getDatabaseClient();
  const results = await database.select().from(post).orderBy(desc(post.createdAt));
  return results;
}

export async function getPostsWithUsers() {
  const database = getDatabaseClient();
  const results = await database.query.post.findMany({
    orderBy: [desc(post.createdAt)],
    with: { user: true },
  });
  return results;
}

export async function updatePost(postId: string, data: Partial<{ content: string; mediaUrl: string }>) {
  const database = getDatabaseClient();
  const [updated] = await database.update(post).set(data).where(eq(post.id, postId)).returning();
  return updated;
}

export async function deletePost(postId: string) {
  const database = getDatabaseClient();
  await database.delete(post).where(eq(post.id, postId));
}

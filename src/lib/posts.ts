import { eq, desc } from "drizzle-orm";

import { getDatabase } from "@/lib/database";
import { post } from "@/lib/database/schema";

export type Post = typeof post.$inferSelect;
export type PostWithUser = Awaited<ReturnType<typeof getPostsWithUsers>>[number];

export async function createPost(userId: string, data: { content: string; mediaUrl?: string }) {
  const database = getDatabase();
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
  const database = getDatabase();
  const [result] = await database.select().from(post).where(eq(post.id, postId));
  return result;
}

export async function getPostsWithUsers() {
  const database = getDatabase();
  const results = await database.query.post.findMany({
    orderBy: [desc(post.createdAt)],
    with: { user: { columns: { id: true, name: true } } },
  });
  return results;
}

export async function updatePost(postId: string, data: Partial<{ content: string; mediaUrl: string }>) {
  const database = getDatabase();
  const [updated] = await database.update(post).set(data).where(eq(post.id, postId)).returning();
  return updated;
}

export async function deletePost(postId: string) {
  const database = getDatabase();
  await database.delete(post).where(eq(post.id, postId));
}

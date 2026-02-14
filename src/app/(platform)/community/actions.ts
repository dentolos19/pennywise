"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { createPost, deletePost, getPost, getPostsWithUsers, updatePost, type Post } from "@/lib/posts";

type PostInput = {
  content: string;
  mediaUrl?: string;
};

async function requireUserId() {
  const session = await auth.api.getSession({ headers: headers() });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be logged in to manage posts.");
  }

  return userId;
}

async function requireOwnedPost(postId: string, userId: string): Promise<Post> {
  const post = await getPost(postId);

  if (!post || post.userId !== userId) {
    throw new Error("Post not found.");
  }

  return post;
}

export async function getPostsWithUsersAction() {
  return getPostsWithUsers();
}

export async function getPostAction(postId: string) {
  return getPost(postId);
}

export async function createPostAction(data: PostInput) {
  const userId = await requireUserId();
  return createPost(userId, data);
}

export async function updatePostAction(postId: string, data: Partial<PostInput>) {
  const userId = await requireUserId();
  await requireOwnedPost(postId, userId);
  return updatePost(postId, data);
}

export async function deletePostAction(postId: string) {
  const userId = await requireUserId();
  await requireOwnedPost(postId, userId);
  await deletePost(postId);
}

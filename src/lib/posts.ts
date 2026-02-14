import { collectionIds, databaseIds, databases } from "@/lib/integrations/appwrite/main";
import { Post, PostDocument, PostDocumentSchema } from "@/lib/integrations/appwrite/types";
import { ID, Query } from "appwrite";

export async function createPost(userId: string, data: Omit<Post, "user">) {
  const res = await databases.createDocument(databaseIds.main, collectionIds.posts, ID.unique(), {
    ...data,
    user: userId,
  });
  return PostDocumentSchema.parse(res) as PostDocument;
}

export async function getPost(postId: string) {
  const res = await databases.getDocument(databaseIds.main, collectionIds.posts, postId);
  return PostDocumentSchema.parse(res) as PostDocument;
}

export async function getPosts() {
  const res = await databases.listDocuments(databaseIds.main, collectionIds.posts, [Query.orderDesc("$createdAt")]);
  console.log(res);
  return res.documents.map((doc) => PostDocumentSchema.parse(doc) as PostDocument);
}

export async function updatePost(postId: string, data: Partial<Omit<Post, "user">>) {
  const res = await databases.updateDocument(databaseIds.main, collectionIds.posts, postId, data);
  return PostDocumentSchema.parse(res) as PostDocument;
}

export async function deletePost(postId: string) {
  await databases.deleteDocument(databaseIds.main, collectionIds.posts, postId);
}

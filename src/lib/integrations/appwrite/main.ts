import { Account, Client, Databases } from "appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("66d2ee3e003d049162cc");

export const account = new Account(client);
export const databases = new Databases(client);

export const databaseIds = {
  main: "66d5a7e3001ddbc47159",
};

export const collectionIds = {
  posts: "66d5bbbb001fc2f3918a",
  users: "66d5bd85001d40306522",
  expenses: "66d71c260023a6441068",
};

export const bucketId = {
  media: "66d685070011273f6826",
};

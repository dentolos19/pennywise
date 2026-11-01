import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "cloudflare:workers";
import { headers } from "next/headers";

import { getDatabase } from "@/lib/database";

function createAuth() {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(getDatabase(), { provider: "pg" }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        description: {
          type: "string",
          required: false,
        },
        points: {
          type: "number",
          required: false,
          defaultValue: 0,
          input: false,
        },
        monthlyBudget: {
          type: "number",
          required: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
  });
}

export type AppAuth = ReturnType<typeof createAuth>;

let _auth: AppAuth | null = null;

export function getAuth() {
  if (_auth) return _auth;

  const instance = createAuth();
  _auth = instance;
  return instance;
}

export async function requireUserId(message: string) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error(message);
  return userId;
}

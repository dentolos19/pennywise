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

function getAuth() {
  if (_auth) return _auth;

  const instance = createAuth();
  _auth = instance;
  return instance;
}

// Proxy that lazily initializes the auth instance
// The `has` trap is needed so `"handler" in auth` works (used by toNextJsHandler)
// The `apply` trap is needed so `auth(request)` works as a fallback
const authTarget = function () {} as unknown as AppAuth;
export const auth = new Proxy(authTarget, {
  has(_target, prop) {
    const instance = getAuth();
    return prop in instance;
  },
  apply(_target, _thisArg, args) {
    const instance = getAuth();
    return (instance as any)(...args);
  },
  get(_target, prop, _receiver) {
    const instance = getAuth();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export type Session = AppAuth["$Infer"]["Session"];

export async function requireUserId(message: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error(message);
  return userId;
}

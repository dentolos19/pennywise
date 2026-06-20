import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "@/lib/database/schema";

let _auth: ReturnType<typeof betterAuth> | null = null;

function getAuth() {
  if (_auth) return _auth;

  // Lazy import to avoid build-time database connection
  const { neon } = require("@neondatabase/serverless");
  const { drizzle } = require("drizzle-orm/neon-http");

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle({ client: sql, schema });

  _auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
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

  return _auth;
}

// Proxy that lazily initializes the auth instance
// The `has` trap is needed so `"handler" in auth` works (used by toNextJsHandler)
// The `apply` trap is needed so `auth(request)` works as a fallback
const authTarget = function () {} as unknown as ReturnType<typeof betterAuth>;
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

export type Session = ReturnType<typeof betterAuth>["$Infer"]["Session"];

import * as schema from "@/lib/database/schema";

let _db: ReturnType<typeof import("drizzle-orm/neon-http").drizzle> | null = null;

export function getDatabase() {
  if (_db) return _db;

  const { neon } = require("@neondatabase/serverless");
  const { drizzle } = require("drizzle-orm/neon-http");

  const sql = neon(process.env.DATABASE_URL!);
  _db = drizzle({ client: sql, schema });
  return _db;
}

export function getDatabaseClient() {
  return getDatabase();
}

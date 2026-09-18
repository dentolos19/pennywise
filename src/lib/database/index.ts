import { neon, neonConfig } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/lib/database/schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDatabase() {
  if (_db) return _db;

  if (new URL(env.DATABASE_URL).hostname === "db.localtest.me") {
    neonConfig.fetchEndpoint = "http://db.localtest.me:4444/sql";
  }
  const sql = neon(env.DATABASE_URL);
  const database = drizzle({ client: sql, schema });
  _db = database;
  return database;
}

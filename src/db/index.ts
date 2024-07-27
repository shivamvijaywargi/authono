import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import * as schema from "./schema";

const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite, {
  schema,
  logger: true,
});

// export const connection = sqlite(env.DATABASE_URL, {
//   max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
//   onnotice: env.DB_SEEDING ? () => {} : undefined,
// });

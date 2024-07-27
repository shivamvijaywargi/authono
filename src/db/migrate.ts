import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import config from "../../drizzle.config";
import { db } from "./index";

await migrate(db, { migrationsFolder: config.out! });

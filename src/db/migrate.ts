import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { closeConnection, db } from "./index";

migrate(db, { migrationsFolder: "./migrations" });

closeConnection();

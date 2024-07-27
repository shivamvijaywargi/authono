import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import config from "../../drizzle.config";
import { closeConnection, db } from "./index";

migrate(db, { migrationsFolder: config.out! });

closeConnection();

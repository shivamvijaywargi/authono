import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const permissionSchema = sqliteTable(
  "permissions",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    action: text("action").notNull(), // e.g. create, read, update, delete
    entity: text("entity").notNull(), // e.g. user, role, etc..,
    access: text("access").notNull(), // e.g. own or any
    description: text("description"),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    unq: unique().on(table.action, table.entity, table.access),
  })
);

export default permissionSchema;

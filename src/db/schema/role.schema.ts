import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import userSchema from "./user.schema";
import permissionSchema from "./permission.schema";

const roleSchema = sqliteTable("roles", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  name: text("name").notNull().unique(),
  description: text("description"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
});

export const roleRelations = relations(roleSchema, ({ many }) => ({
  users: many(userSchema),
  permissions: many(permissionSchema),
}));

export default roleSchema;

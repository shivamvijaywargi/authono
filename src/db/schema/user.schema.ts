import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import roleSchema from "./role.schema";
import sessionSchema from "./session.schema";
import connectionSchema from "./connection.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const userSchema = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
});

export const userRelations = relations(userSchema, ({ many }) => ({
  roles: many(roleSchema),
  sessions: many(sessionSchema),
  connections: many(connectionSchema),
}));

export default userSchema;

export const insertUserSchema = createInsertSchema(userSchema);
export const selectUserSchema = createSelectSchema(userSchema);

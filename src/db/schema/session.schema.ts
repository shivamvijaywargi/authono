import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import userSchema from "./user.schema";

const sessionSchema = sqliteTable(
  "sessions",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),

    expirationDate: text("expiration_date").notNull(),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at"),

    userId: text("user_id")
      .notNull()
      .references(() => userSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      sessions_user_id_idx: index("sessions_user_id_idx").on(table.userId),
    };
  }
);

export const sessionRelations = relations(sessionSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [sessionSchema.userId],
    references: [userSchema.id],
  }),
}));

export default sessionSchema;

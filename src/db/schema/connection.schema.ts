import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import userSchema from "./user.schema";

const connectionSchema = sqliteTable(
  "connections",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),

    providerName: text("provider_name").notNull(),
    providerId: text("provider_id").notNull(),

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
  (table) => ({
    unq: unique().on(table.providerName, table.providerId),
  })
);

export const connectionRelations = relations(connectionSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [connectionSchema.userId],
    references: [userSchema.id],
  }),
}));

export default connectionSchema;

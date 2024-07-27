import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import userSchema from "./user.schema";
import { relations } from "drizzle-orm";

const passwordSchema = sqliteTable("passwords", {
  userId: text("user_id")
    .primaryKey()
    .notNull()
    .references(() => userSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  hash: text("hash").notNull(),
});

export const passwordRelations = relations(passwordSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [passwordSchema.userId],
    references: [userSchema.id],
  }),
}));

export default passwordSchema;

import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import userSchema from "./user.schema";
import roleSchema from "./role.schema";
import { relations } from "drizzle-orm";

const userToRoleSchema = sqliteTable("user_to_role", {
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  roleId: text("role_id")
    .notNull()
    .references(() => roleSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const roleRelations = relations(userToRoleSchema, ({ one }) => ({
  roles: one(roleSchema, {
    fields: [userToRoleSchema.roleId],
    references: [roleSchema.id],
  }),
  users: one(userSchema, {
    fields: [userToRoleSchema.userId],
    references: [userSchema.id],
  }),
}));

export default userToRoleSchema;

import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import permissionSchema from "./permission.schema";
import roleSchema from "./role.schema";
import { relations } from "drizzle-orm";

const permissionToRoleSchema = sqliteTable("permission_to_roles", {
  permissionId: text("permission_id")
    .notNull()
    .references(() => permissionSchema.id, {
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

export const permissionToRoleRelations = relations(
  permissionToRoleSchema,
  ({ one }) => ({
    permissions: one(permissionSchema, {
      fields: [permissionToRoleSchema.permissionId],
      references: [permissionSchema.id],
    }),
    roles: one(roleSchema, {
      fields: [permissionToRoleSchema.roleId],
      references: [roleSchema.id],
    }),
  })
);

export default permissionToRoleSchema;

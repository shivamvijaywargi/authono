import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const verificationSchema = sqliteTable(
  "verifications",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),

    type: text("type").notNull(), // Type of verification e.g. Email or Phone
    target: text("target").notNull(), // The thing we are trying to verify e.g. Email of Phone
    secret: text("secret").notNull(), // The secret key used to generate the OTP
    algorithm: text("algorithm").notNull(), // The algorithm used to generate the otp
    digits: int("digits").notNull(), // The number of digits in the otp
    period: int("period").notNull(), // The number of seconds the OTP is valid for
    charSet: text("char_set").notNull(), // The valid characters for the OTP

    expiresAt: text("expires_at").notNull(), // When it is safe to delete the verification

    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at"),
  },
  (table) => ({
    unq: unique().on(table.type, table.target),
  })
);

export default verificationSchema;

import { z } from "zod";
import { insertUserSchema } from "../../db/schema/user.schema";

const createUserSchema = insertUserSchema.extend({
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .max(36, "Password must be at most 36 characters long"),
});

export default { createUserSchema };

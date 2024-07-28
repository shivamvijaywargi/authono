import { z } from "zod";

const bodySchema = z.object({
  name: z.string().optional(),
  username: z.string(),
  email: z.string().email(),
});

const createUserSchema = bodySchema;

export default { createUserSchema };

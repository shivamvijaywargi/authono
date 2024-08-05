import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, or } from "drizzle-orm";
import { hash } from "bcrypt";

import { db } from "../../db";
import { passwordSchema, userSchema } from "../../db/schema";
import authValidations from "./auth.validations";

const authRoutes = new Hono();

authRoutes.post(
  "/register",
  zValidator("json", authValidations.createUserSchema),
  async (c) => {
    const { email, name, username, password } = c.req.valid("json");

    const existingUser = await db.query.userSchema.findFirst({
      where: or(eq(userSchema.email, email), eq(userSchema.username, username)),
    });

    if (existingUser) {
      return c.json({ success: false, message: "User already exists" }, 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(userSchema)
        .values({
          email,
          username,
          name,
        })
        .returning()
        .get();

      await tx.insert(passwordSchema).values({
        hash: hashedPassword,
        userId: newUser.id,
      });

      return newUser;
    });

    return c.json(
      {
        success: true,
        data: user,
      },
      201
    );
  }
);

authRoutes.post("/", (c) => c.json("create an author", 201));

authRoutes.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { authRoutes };

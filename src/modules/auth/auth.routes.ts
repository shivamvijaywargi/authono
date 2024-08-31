import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, or } from "drizzle-orm";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

import { db } from "../../db";
import { passwordSchema, sessionSchema, userSchema } from "../../db/schema";
import authValidations from "./auth.validations";
import env from "../../env";

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

authRoutes.post(
  "/login",
  zValidator("json", authValidations.loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .innerJoin(passwordSchema, eq(userSchema.id, passwordSchema.userId))
      .get();

    if (!user || !user?.passwords) {
      return c.json(
        {
          success: false,
          message: "Invalid email and password or user not found",
        },
        401
      );
    }

    const passwordMatch = await compare(password, user.passwords.hash);

    if (!passwordMatch) {
      return c.json(
        { success: false, message: "Invalid email or password" },
        400
      );
    }

    const token = await sign(
      {
        id: user.users.id,
        email: user.users.email,
        username: user.users.username,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await db.insert(sessionSchema).values({
      userId: user.users.id,
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      id: user.users.id,
    });

    return c.json({ success: true, data: { token } }, 200);
  }
);

authRoutes.post("/", (c) => c.json("create an author", 201));

authRoutes.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { authRoutes };

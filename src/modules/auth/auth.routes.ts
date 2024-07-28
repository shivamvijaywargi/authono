import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import authValidations from "./auth.validations";
import { db } from "../../db";
import { userSchema } from "../../db/schema";
import { insertUserSchema } from "../../db/schema/user.schema";

const authRoutes = new Hono();

authRoutes.post(
  "/register",
  zValidator("json", insertUserSchema),
  async (c) => {
    const { email, name, username } = c.req.valid("json");

    const user = await db
      .insert(userSchema)
      .values({ email, name, username })
      .returning()
      .get();

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

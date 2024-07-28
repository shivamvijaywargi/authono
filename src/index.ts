import { Hono } from "hono";
import { logger } from "hono/logger";

import { authRoutes } from "./modules/auth/auth.routes";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/auth", authRoutes);

// global routes
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `Route not found ${c.req.path}`,
    },
    404
  );
});

app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof Error) {
    if (err.name === "SQLiteError") {
      return c.json(
        {
          success: false,
          message: err.message,
        },
        500
      );
    }
  }

  return c.json(
    {
      success: false,
      message: "Interal Server Error",
    },
    500
  );
});

export default {
  port: 5511,
  fetch: app.fetch,
};

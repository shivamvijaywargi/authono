import { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";

import { authRoutes } from "./modules/auth/auth.routes";
import { logger } from "./middlewares/logger.middleware";

const app = new Hono();

app.use(honoLogger());

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
  logger.error(err);

  if (err instanceof Error) {
    if (err.name === "SQLiteError") {
      return c.json(
        {
          success: false,
          message: err.message,
        },
        500 // TODO: Change this as per the error type
      );
    }

    return c.json(
      {
        success: false,
        message: err.message,
      },
      500
    );
  }

  return c.json(
    {
      success: false,
      message: "Interal Server Error",
    },
    500
  );
});

logger.info(`Server running on http://localhost:5511`);

export default {
  port: 5511,
  fetch: app.fetch,
};

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  dialect: "sqlite",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
});

import { $ } from "bun";

import { logger } from "../middlewares/logger.middleware";

async function clean() {
  // Remove the 'dist' directory and its contents
  await $`rm -rf dist`;

  // You can add more cleaning tasks here
  // For example, remove all .log files:
  // await $`rm *.log`;

  logger.info("Cleaning complete!");
}

clean();

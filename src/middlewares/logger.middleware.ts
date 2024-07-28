import path from "path";
import fs from "fs";

import pino from "pino";

import { REDACTED_FIELDS } from "../utils/constants";

function getLogFilename(type = "combined") {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const logDir = path.join(process.cwd(), "logs");

  // Ensure the logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return path.join(logDir, `${type}-${year}-${month}-${day}.log`);
}

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: getLogFilename("combined"), mkdir: true },
    },
    {
      level: "error",
      target: "pino/file",
      options: { destination: getLogFilename("error"), mkdir: true },
    },
    {
      target: "pino-pretty",
      // options: {
      //   colorize: true,
      // },
    },
  ],
});

export const logger = pino(
  {
    name: "authono",
    level: "debug",
    formatters: {
      bindings: (bindings) => {
        return {
          node_version: process.version,
          service: "Auth Hono",
        };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: REDACTED_FIELDS,
      censor: "[PINO REDACTED]",
    },
  },
  transport
);

// Error handling
process.on("uncaughtException", (error) => {
  logger.fatal(error, "Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise }, "Unhandled Rejection");
});

// Function to update log files
function updateLogFiles() {
  const newCombinedFile = getLogFilename("combined");
  const newErrorFile = getLogFilename("error");

  transport.targets.forEach((target: any) => {
    if (target.target === "pino/file") {
      target.options.destination = target.options.destination.includes("error")
        ? newErrorFile
        : newCombinedFile;
    }
  });

  logger.info(
    `Log files rotated: Combined - ${newCombinedFile}, Error - ${newErrorFile}`
  );
}

// Function to schedule next midnight
function scheduleNextMidnight() {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day
    0, // at 00:00:00 hours
    0,
    0
  );
  const msToMidnight = night.getTime() - now.getTime();

  setTimeout(() => {
    updateLogFiles();
    scheduleNextMidnight(); // Schedule the next one
  }, msToMidnight);
}

// Initial update and scheduling
// updateLogFiles();
scheduleNextMidnight();

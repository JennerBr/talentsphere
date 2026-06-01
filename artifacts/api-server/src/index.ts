import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "@workspace/db/migrate";
import path from "path";
import { fileURLToPath } from "url";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(__dirname, "../../../lib/db/migrations");

runMigrations(migrationsFolder)
  .then(() => {
    logger.info("Database migrations applied and verified successfully");
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err: unknown) => {
    logger.error({ err }, "Failed to run or verify database migrations — server will not start");
    process.exit(1);
  });

/**
 * CLI entry point for migration verification.
 * Invoke via: tsx ./src/verify-migrations-cli.ts
 *
 * Separated from verify-migrations.ts so that the exported function can be
 * safely imported by other modules (including bundled server code) without
 * triggering an automatic CLI invocation at module load time.
 */

import { verifyMigrations } from "./verify-migrations.js";
import { fileURLToPath } from "url";
import path from "path";

const migrationsFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations",
);

verifyMigrations(migrationsFolder).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});

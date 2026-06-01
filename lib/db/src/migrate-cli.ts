/**
 * CLI entry point for running migrations with the before/after guard.
 * Invoke via: tsx ./src/migrate-cli.ts
 *
 * Separated from migrate.ts so that the exported runMigrations() function can
 * be safely imported by other modules (including bundled server code) without
 * triggering an automatic invocation at module load time.
 *
 * This replaces the previous pattern of:
 *   drizzle-kit migrate --config ./drizzle.config.ts && tsx ./src/verify-migrations-cli.ts
 *
 * The before/after guard inside runMigrations() catches silent skips at the
 * moment they occur — not in a separate post-run verification step.
 */

import { runMigrations } from "./migrate.js";
import { fileURLToPath } from "url";
import path from "path";

const migrationsFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations",
);

runMigrations(migrationsFolder).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});

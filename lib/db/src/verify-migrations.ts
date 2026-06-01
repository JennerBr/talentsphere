/**
 * Post-migrate verification.
 *
 * drizzle-kit has a known silent-skip behaviour: it can report
 * "[✓] migrations applied successfully!" even when a migration file was not
 * actually executed against the database (e.g. due to a hash mismatch or an
 * out-of-order entry in the journal). This module catches that gap by comparing
 * the number of journal entries against the number of rows recorded in the
 * drizzle.__drizzle_migrations tracking table and throws when they disagree.
 *
 * Exported as a callable function so it can be used both as a standalone CLI
 * script (see verify-migrations-cli.ts) and from the API server startup.
 */

import pg from "pg";
import { readFileSync } from "fs";
import path from "path";

const { Pool } = pg;

interface Journal {
  entries: Array<{ idx: number; when: number; tag: string }>;
}

/**
 * Verify that all journal migrations have been applied to the database.
 *
 * @param migrationsFolder - Absolute path to the migrations directory
 *   (the one containing `meta/_journal.json`).
 * @throws {Error} If any migration is missing or timestamps are out of order.
 */
export async function verifyMigrations(migrationsFolder: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
  const journal: Journal = JSON.parse(readFileSync(journalPath, "utf-8"));
  const expectedCount = journal.entries.length;

  for (let i = 0; i < journal.entries.length - 1; i++) {
    const curr = journal.entries[i];
    const next = journal.entries[i + 1];
    if (curr.when >= next.when) {
      throw new Error(
        [
          "",
          "╔══════════════════════════════════════════════════╗",
          "║       OUT-OF-ORDER MIGRATION TIMESTAMPS          ║",
          "╚══════════════════════════════════════════════════╝",
          "",
          `  Entry [${curr.idx}] "${curr.tag}": when=${curr.when}`,
          `  Entry [${next.idx}] "${next.tag}": when=${next.when}`,
          "",
          "  Journal timestamps must be strictly ascending but entry",
          `  [${next.idx}] has a timestamp that is not greater than entry [${curr.idx}].`,
          "  This can cause drizzle-kit to silently skip migrations.",
          "  Fix the timestamps in lib/db/migrations/meta/_journal.json",
          "  so that each entry's `when` is greater than the previous.",
          "",
        ].join("\n"),
      );
    }
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    let appliedCount: number;

    try {
      const result = await pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM drizzle.__drizzle_migrations`,
      );
      appliedCount = parseInt(result.rows[0].count, 10);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Could not query drizzle.__drizzle_migrations: ${message}\n` +
          "The migration tracking table may not exist — has the first migration ever been run?",
      );
    }

    if (appliedCount !== expectedCount) {
      throw new Error(
        [
          "",
          "╔══════════════════════════════════════════════════╗",
          "║         MIGRATION VERIFICATION FAILED            ║",
          "╚══════════════════════════════════════════════════╝",
          "",
          `  Journal entries : ${expectedCount}`,
          `  Applied in DB   : ${appliedCount}`,
          `  Missing         : ${expectedCount - appliedCount}`,
          "",
          "  One or more migrations were silently skipped by drizzle-kit.",
          "  Run: SELECT hash FROM drizzle.__drizzle_migrations;",
          "  Compare against lib/db/migrations/meta/_journal.json to find the gap.",
          "  Then run: pnpm --filter @workspace/scripts repair-migrations",
          "  See lib/db/MIGRATIONS.md for background and remediation steps.",
          "",
        ].join("\n"),
      );
    }

    console.log(
      `✓ Migration verification passed — ${appliedCount} of ${expectedCount} migrations applied.`,
    );
  } finally {
    await pool.end();
  }
}

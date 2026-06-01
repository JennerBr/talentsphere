import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { readFileSync } from "fs";
import path from "path";

const { Pool } = pg;

interface Journal {
  entries: Array<{ idx: number; when: number; tag: string }>;
}

/**
 * Apply pending migrations and verify the result.
 *
 * Guard strategy:
 *   0. Read the journal and verify that all `when` timestamps are strictly
 *      ascending. Out-of-order timestamps (from clock skew or manual edits)
 *      cause drizzle-kit to silently skip migrations — catching this before
 *      opening a pool means startup fails fast with a clear message.
 *   1. Open a single pool and query the tracking table for the before-count
 *      (may be 0 on first run).
 *   2. Compute pending = expectedTotal - beforeCount.
 *   3. Run drizzle migrate().
 *   4. Query the tracking table again for the after-count.
 *   5. Throw if (afterCount - beforeCount) !== pending, or if afterCount !== expectedTotal.
 *
 * A single pool is used for both the before and after queries so no duplicate
 * connections are opened.
 *
 * @param migrationsFolder - Absolute path to the migrations directory
 *   (the one containing `meta/_journal.json`).
 * @throws {Error} If timestamps are out of order, any migration is silently
 *   skipped, or the tracking table count does not match the journal.
 */
export async function runMigrations(migrationsFolder: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
  const journal: Journal = JSON.parse(readFileSync(journalPath, "utf-8"));
  const expectedTotal = journal.entries.length;

  // --- Step 0: verify journal timestamps are strictly ascending ---------------
  // Clock-skew or manual edits can produce out-of-order `when` values which
  // cause drizzle-kit to silently skip migrations. Catch this at boot time
  // before any pool is opened so startup fails fast with a clear message.
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
    // --- Step 1: snapshot the before-count -----------------------------------
    let beforeCount = 0;
    try {
      const result = await pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM drizzle.__drizzle_migrations`,
      );
      beforeCount = parseInt(result.rows[0].count, 10);
    } catch {
      // The tracking table does not exist yet — this is the first ever migration.
      beforeCount = 0;
    }

    const pendingCount = expectedTotal - beforeCount;

    if (pendingCount < 0) {
      throw new Error(
        [
          "",
          "╔══════════════════════════════════════════════════╗",
          "║          UNEXPECTED MIGRATION STATE              ║",
          "╚══════════════════════════════════════════════════╝",
          "",
          `  Journal entries  : ${expectedTotal}`,
          `  Applied in DB    : ${beforeCount}`,
          "",
          "  The database has MORE tracking rows than the journal has entries.",
          "  This should never happen. Check for manual edits to the journal",
          "  or orphaned rows in drizzle.__drizzle_migrations.",
          "",
        ].join("\n"),
      );
    }

    if (pendingCount === 0) {
      console.log(
        `✓ No pending migrations — all ${expectedTotal} journal entries already applied.`,
      );
    } else {
      console.log(
        `  Applying ${pendingCount} pending migration(s) ` +
          `(${beforeCount} of ${expectedTotal} already applied)…`,
      );
    }

    // --- Step 2: run drizzle migrate ----------------------------------------
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder });

    // --- Step 3: snapshot the after-count ------------------------------------
    const afterResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM drizzle.__drizzle_migrations`,
    );
    const afterCount = parseInt(afterResult.rows[0].count, 10);
    const actualApplied = afterCount - beforeCount;

    // --- Step 4: guard -------------------------------------------------------
    if (actualApplied !== pendingCount || afterCount !== expectedTotal) {
      throw new Error(
        [
          "",
          "╔══════════════════════════════════════════════════╗",
          "║     MIGRATION GUARD FAILED — SILENT SKIP         ║",
          "╚══════════════════════════════════════════════════╝",
          "",
          `  Journal entries  : ${expectedTotal}`,
          `  Before migrate   : ${beforeCount} applied`,
          `  Expected pending : ${pendingCount}`,
          `  Actually applied : ${actualApplied}  (after − before)`,
          `  After migrate    : ${afterCount} applied`,
          "",
          "  drizzle reported success but the tracking table did not grow by",
          "  the expected number of entries. One or more migrations were",
          "  silently skipped — their SQL was NOT executed against the database.",
          "",
          "  Possible causes:",
          "    • Out-of-order or duplicate `when` timestamps in _journal.json",
          "    • Hash mismatch between the migration file and the journal entry",
          "    • Manual edits to migration files after they were committed",
          "",
          "  Run: SELECT hash FROM drizzle.__drizzle_migrations;",
          "  Compare against lib/db/migrations/meta/_journal.json to find the gap.",
          "  Then run: pnpm --filter @workspace/scripts repair-migrations",
          "  See lib/db/MIGRATIONS.md for background and remediation steps.",
          "",
        ].join("\n"),
      );
    }

    console.log(
      `✓ Migration guard passed — ${afterCount} of ${expectedTotal} migrations applied` +
        (pendingCount > 0 ? ` (${actualApplied} new).` : "."),
    );
  } finally {
    await pool.end();
  }
}

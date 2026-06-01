/**
 * repair-migrations.ts
 *
 * Detects and repairs migrations that were silently skipped by drizzle-kit.
 * Compares the journal entries in lib/db/migrations/meta/_journal.json against
 * the rows in drizzle.__drizzle_migrations, then applies any missing SQL files
 * and inserts the corresponding tracking rows.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts repair-migrations
 */

import pg from "pg";
import { readFileSync } from "fs";
import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface Journal {
  entries: JournalEntry[];
}

interface AppliedMigration {
  hash: string;
  created_at: string;
}

async function repairMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set.");
    process.exit(1);
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = path.resolve(
    __dirname,
    "../../lib/db/migrations",
  );
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");

  const journal: Journal = JSON.parse(readFileSync(journalPath, "utf-8"));
  const expectedEntries = journal.entries;

  console.log(`Journal has ${expectedEntries.length} entries.`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    let applied: AppliedMigration[] = [];

    try {
      const result = await pool.query<AppliedMigration>(
        `SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at`,
      );
      applied = result.rows;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `ERROR: Could not query drizzle.__drizzle_migrations: ${message}`,
      );
      console.error(
        "The migration tracking table may not exist — has the first migration ever been run?",
      );
      process.exit(1);
    }

    console.log(`Database tracking table has ${applied.length} entries.`);

    if (applied.length === expectedEntries.length) {
      console.log("✓ No missing migrations detected. Nothing to repair.");
      return;
    }

    // Build a set of applied hashes for quick lookup.
    // drizzle stores the tag as the hash value in its tracking table.
    const appliedHashes = new Set(applied.map((r) => r.hash));

    const missing = expectedEntries.filter(
      (entry) => !appliedHashes.has(entry.tag),
    );

    if (missing.length === 0) {
      console.log(
        "✓ All journal entries are tracked (count mismatch may be due to extra rows). Nothing to repair.",
      );
      return;
    }

    console.log(`\nFound ${missing.length} missing migration(s):`);
    for (const entry of missing) {
      console.log(`  [${entry.idx}] ${entry.tag}`);
    }

    console.log("\nApplying missing migrations...\n");

    for (const entry of missing) {
      const sqlFile = path.join(migrationsFolder, `${entry.tag}.sql`);
      let sql: string;

      try {
        sql = readFileSync(sqlFile, "utf-8");
      } catch {
        console.error(
          `ERROR: Migration file not found: ${sqlFile}`,
        );
        process.exit(1);
      }

      // Split on drizzle's statement-breakpoint marker and execute each statement.
      const statements = sql
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      console.log(`  Applying [${entry.idx}] ${entry.tag} (${statements.length} statement(s))...`);

      for (const statement of statements) {
        await pool.query(statement);
      }

      // Insert the tracking row so drizzle considers this migration applied.
      await pool.query(
        `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
        [entry.tag, entry.when],
      );

      console.log(`  ✓ Applied and tracked: ${entry.tag}`);
    }

    console.log(`\n✓ Repair complete — ${missing.length} migration(s) applied.`);
    console.log(
      "Run `pnpm --filter @workspace/db verify` to confirm all migrations are now applied.",
    );
  } finally {
    await pool.end();
  }
}

repairMigrations().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Unhandled error during migration repair: ${message}`);
  process.exit(1);
});

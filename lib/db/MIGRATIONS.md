# Database Migrations

## How migrations work

Migrations live in `lib/db/migrations/` and are tracked in two places:

1. **`migrations/meta/_journal.json`** — the source-of-truth list of every migration file that has been generated with `drizzle-kit generate`.
2. **`drizzle.__drizzle_migrations` (PostgreSQL table)** — the runtime record of every migration that has actually been executed against the database.

Running `pnpm --filter @workspace/db migrate` will:
1. Read the journal to determine how many migrations are expected in total.
2. Query the tracking table for the **before-count** (the number already applied).
3. Compute **pending** = expectedTotal − beforeCount.
4. Call drizzle's programmatic `migrate()` to apply any pending migrations.
5. Query the tracking table for the **after-count**.
6. Assert that `afterCount − beforeCount === pending` AND `afterCount === expectedTotal`.
   If either check fails, the command exits non-zero with a detailed error message.
7. Run `verify-migrations.ts` which additionally:
   - Asserts that every consecutive pair of journal `when` timestamps is strictly ascending.
   - Confirms the DB tracking row count equals the journal entry count.

## The before/after migration guard (primary safety net)

The guard is implemented inside `runMigrations()` in `lib/db/src/migrate.ts`. It wraps
the drizzle `migrate()` call and compares the tracking-table row count before and after
execution. This means:

- If drizzle reports success but skips a migration (no SQL executed, no tracking row
  inserted), the guard catches the discrepancy immediately and throws before the process
  exits.
- If drizzle inserts fewer tracking rows than expected (e.g. due to a hash mismatch or
  out-of-order `when` timestamp), the guard throws with a diagnostic message naming the
  expected vs actual counts.
- The same `runMigrations()` function is used by both the `migrate` CLI script and the
  API server startup, so the guard runs in both contexts.

The before/after check is the **root guard** — it fires at the moment of the migrate
call, not in a separate post-run step.

## The silent-skip bug (why the guard exists)

`drizzle-kit migrate` was observed reporting `[✓] migrations applied successfully!` even
though migration `0002_rename_employee_to_member` had **not** been executed — the SQL
never ran and no tracking row was inserted. The root cause is a known drizzle-kit
behaviour: when it cannot match a migration file to a journal entry (e.g. due to a hash
mismatch or an out-of-order `when` timestamp) it silently treats the file as already
applied rather than returning an error.

The before/after guard closes this gap by asserting that the number of new tracking rows
matches the number of journal entries that were pending before the call.

## Common commands

| Task | Command |
|---|---|
| Generate a new migration after schema changes | `pnpm --filter @workspace/db generate` |
| Apply pending migrations + verify | `pnpm --filter @workspace/db migrate` |
| Verify applied count without migrating | `pnpm --filter @workspace/db verify` |

## Diagnosing a guard failure

If `migrate` exits with "MIGRATION GUARD FAILED — SILENT SKIP":

1. Check which migrations the database knows about:
   ```sql
   SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at;
   ```
2. Compare the `hash` values against the `tag` fields in `migrations/meta/_journal.json`.
3. Identify the missing entry and apply the corresponding `.sql` file manually if needed:
   ```sh
   psql "$DATABASE_URL" -f lib/db/migrations/<missing>.sql
   ```
4. Then insert a tracking row so drizzle considers it applied:
   ```sql
   INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
   VALUES ('<tag>', extract(epoch from now()) * 1000);
   ```
5. Re-run `pnpm --filter @workspace/db verify` to confirm.

## Timestamp ordering caution

Each journal entry has a `when` timestamp (Unix milliseconds). drizzle-kit uses these
values to determine ordering and decide which migrations have already been applied.
**Entries must be strictly ascending** — if any entry has a `when` value smaller than a
preceding entry, drizzle-kit treats it as already processed and silently skips it, even
if the corresponding SQL has never been run against the database.

### Rules to follow

1. **Never manually edit a `when` timestamp** without verifying that the resulting
   sequence remains strictly increasing (`idx 0 < idx 1 < idx 2 < …`). If you must fix
   an out-of-order timestamp, set it to `max(existing timestamps) + 1` per additional
   entry.

2. **Always generate migrations from a single authoritative environment** — CI or a
   developer machine with an accurate system clock. Machines with clock skew (e.g. a VM
   whose clock drifted into the past) will produce `when` values that are smaller than
   already-committed entries, triggering the silent-skip.

3. **After any manual journal edit, run `pnpm --filter @workspace/db verify`** to confirm
   the applied count in the database still matches the journal entry count and that
   timestamps remain strictly ascending.

### Background: what happened

In May 2026, migrations `0002_rename_employee_to_member` and `0003_org_members_junction`
were generated with timestamps from May 2025 (~`1748131200000` and `1748217600000`),
while the earlier entries `0000` and `0001` already carried timestamps of
~`1779713253258` and `1779713254258` (also May 2026 but generated earlier in that
session). drizzle-kit's ordering logic saw idx=2 and idx=3 as "older than already-applied
entries" and silently skipped them. The fix was to update those two `when` values to
`1779713255258` and `1779713256258` — one millisecond apart and strictly greater than
idx=1.

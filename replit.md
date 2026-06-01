# Talent Sphere

_Manage your team´s performance_

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm run db:generate` — generate a new migration file after editing the schema (alias for `pnpm --filter @workspace/db run generate`)
- `pnpm run db:migrate` — apply pending migrations without restarting the server (alias for `pnpm --filter @workspace/db run migrate`)
- Required env: `DATABASE_URL` — Postgres connection string

## Schema change workflow

1. Edit the schema in `lib/db/src/schema/`
2. Run `pnpm run db:generate` — this calls `drizzle-kit generate` and writes a new SQL migration file to `lib/db/migrations/`
3. Commit the generated migration file alongside the schema change
4. Run `pnpm run db:migrate` to apply pending migrations immediately, or restart the API server — it also runs pending migrations automatically on startup via `lib/db/src/migrate.ts`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

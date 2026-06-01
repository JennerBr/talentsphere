ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "teams_url" text;
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "slack_url" text;
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "webex_url" text;

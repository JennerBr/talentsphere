CREATE TABLE IF NOT EXISTS "invitations" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" integer NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "invited_email" text NOT NULL,
  "invited_by_member_id" integer NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "role" text,
  "token" varchar NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  "status" text NOT NULL DEFAULT 'pending',
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now()
);

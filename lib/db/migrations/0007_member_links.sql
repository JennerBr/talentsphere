CREATE TABLE IF NOT EXISTS "member_links" (
  "id" serial PRIMARY KEY,
  "member_id" integer NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "platform" text NOT NULL,
  "handle" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

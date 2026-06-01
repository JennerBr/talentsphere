-- Allow free-text (custom) hobbies on member profiles without polluting the
-- global hobbies catalog.
--
-- Changes:
--   1. Drop the composite primary key (member_id, hobby_id).
--   2. Add a serial id column and make it the new primary key.
--   3. Make hobby_id nullable (still references hobbies catalog when set).
--   4. Add custom_name text column (used instead of hobby_id for free hobbies).
--   5. Add CHECK: at least one of hobby_id or custom_name must be non-null.

ALTER TABLE "member_hobbies" DROP CONSTRAINT "member_hobbies_member_id_hobby_id_pk";
--> statement-breakpoint
ALTER TABLE "member_hobbies" ADD COLUMN "id" serial NOT NULL;
--> statement-breakpoint
ALTER TABLE "member_hobbies" ALTER COLUMN "hobby_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "member_hobbies" ADD COLUMN "custom_name" text;
--> statement-breakpoint
ALTER TABLE "member_hobbies" ADD PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "member_hobbies" ADD CONSTRAINT "member_hobbies_has_hobby_or_custom" CHECK (hobby_id IS NOT NULL OR custom_name IS NOT NULL);

CREATE TABLE IF NOT EXISTS "hobby_categories" (
"id" serial PRIMARY KEY NOT NULL,
"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hobbies" ADD COLUMN IF NOT EXISTS "category_id" integer;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'hobbies_category_id_hobby_categories_id_fk'
  ) THEN
    ALTER TABLE "hobbies" ADD CONSTRAINT "hobbies_category_id_hobby_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."hobby_categories"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;
END $$;

-- Add phone and linkedin columns to members
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "linkedin" text;

-- Create hobbies catalog
CREATE TABLE IF NOT EXISTS "hobbies" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL
);

-- Create member_hobbies junction
CREATE TABLE IF NOT EXISTS "member_hobbies" (
  "member_id" integer NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "hobby_id" integer NOT NULL REFERENCES "hobbies"("id") ON DELETE CASCADE,
  CONSTRAINT "member_hobbies_member_id_hobby_id_pk" PRIMARY KEY ("member_id", "hobby_id")
);

-- Create functions catalog
CREATE TABLE IF NOT EXISTS "functions" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL
);

-- Create member_functions junction
CREATE TABLE IF NOT EXISTS "member_functions" (
  "member_id" integer NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "function_id" integer NOT NULL REFERENCES "functions"("id") ON DELETE CASCADE,
  CONSTRAINT "member_functions_member_id_function_id_pk" PRIMARY KEY ("member_id", "function_id")
);

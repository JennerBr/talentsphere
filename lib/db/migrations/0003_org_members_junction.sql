CREATE TABLE "organization_members" (
	"member_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"role" text,
	"position_id" integer,
	CONSTRAINT "organization_members_member_id_organization_id_pk" PRIMARY KEY("member_id","organization_id")
);
--> statement-breakpoint
INSERT INTO "organization_members" ("member_id", "organization_id", "role", "position_id")
SELECT id, organizacao_id, role, position_id
FROM "members"
WHERE organizacao_id IS NOT NULL;
--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "organizacao_id";
--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "role";
--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "position_id";

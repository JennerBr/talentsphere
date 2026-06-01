-- Rename organizations table to teams
ALTER TABLE "organizations" RENAME TO "teams";

-- Rename organization_members table to team_members
ALTER TABLE "organization_members" RENAME TO "team_members";

-- Rename organization_id column in team_members to team_id
ALTER TABLE "team_members" RENAME COLUMN "organization_id" TO "team_id";

-- Update primary key constraint on team_members
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "organization_members_member_id_organization_id_pk";
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_id_team_id_pk" PRIMARY KEY ("member_id", "team_id");

-- Drop old foreign keys and recreate for team_members
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "organization_members_member_id_members_id_fk";
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "organization_members_organization_id_organizations_id_fk";
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;

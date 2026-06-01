ALTER TABLE "employees" RENAME TO "members";
--> statement-breakpoint
ALTER TABLE "employee_skills" RENAME TO "member_skills";
--> statement-breakpoint
ALTER TABLE "member_skills" RENAME COLUMN "employee_id" TO "member_id";
--> statement-breakpoint
ALTER TABLE "project_stakeholders" RENAME COLUMN "employee_id" TO "member_id";
--> statement-breakpoint
ALTER TABLE "kudos" RENAME COLUMN "employee_id" TO "member_id";

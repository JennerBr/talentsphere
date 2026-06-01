CREATE TABLE IF NOT EXISTS "absence_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"description" text,
	"type" text,
	"icon" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "action_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"icone_name" text,
	"cor" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"level" text,
	"desired" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"seniority" text,
	"project" text,
	"turma" text,
	"skills" text[],
	"email" text,
	"avatar" text,
	"birthday" text,
	"contract_date" text,
	"available_kudos" integer DEFAULT 5,
	"organizacao_id" integer,
	"position_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kudos" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type_id" text,
	"message" text,
	"from_name" text,
	"date" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kudos_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"cnpj" text,
	"status" text DEFAULT 'Ativo'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"chairs" integer DEFAULT 1 NOT NULL,
	"allocated" integer DEFAULT 0 NOT NULL,
	"parent_id" integer,
	"organizacao_id" integer NOT NULL,
	"created_by" text,
	"created_at" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_stakeholders" (
	"project_id" integer NOT NULL,
	"employee_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organizacao_id" integer,
	"objective" text,
	"clients" text,
	"tools" text[],
	"team" text,
	"start_date" text,
	"end_date" text,
	"rating" integer DEFAULT 0,
	"status" text,
	"observation" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"niveis" integer DEFAULT 3,
	"tipo_grafico" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

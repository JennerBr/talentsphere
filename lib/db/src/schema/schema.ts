import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  cnpj: text("cnpj"),
  status: text("status").default("Ativo"),
  allowedDomains: text("allowed_domains").array(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  chairs: integer("chairs").notNull().default(1),
  allocated: integer("allocated").notNull().default(0),
  parentId: integer("parent_id"),
  organizacaoId: integer("organizacao_id").notNull(),
  createdBy: text("created_by"),
  createdAt: text("created_at"),
});

export const insertPositionSchema = createInsertSchema(positions).omit({ id: true });
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name"),
  seniority: text("seniority"),
  project: text("project"),
  turma: text("turma"),
  skills: text("skills").array(),
  email: text("email"),
  avatar: text("avatar"),
  birthday: text("birthday"),
  contractDate: text("contract_date"),
  availableKudos: integer("available_kudos").default(5),
  phone: text("phone"),
  linkedin: text("linkedin"),
  teamsUrl: text("teams_url"),
  slackUrl: text("slack_url"),
  webexUrl: text("webex_url"),
});

export const insertMemberSchema = createInsertSchema(members).omit({ id: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

export const teamMembers = pgTable(
  "team_members",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    role: text("role"),
    positionId: integer("position_id"),
  },
  (table) => [primaryKey({ columns: [table.memberId, table.teamId] })],
);

export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizacaoId: integer("organizacao_id"),
  objective: text("objective"),
  clients: text("clients"),
  tools: text("tools").array(),
  team: text("team"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  rating: integer("rating").default(0),
  status: text("status"),
  observation: text("observation"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const projectStakeholders = pgTable("project_stakeholders", {
  projectId: integer("project_id").notNull(),
  memberId: integer("member_id").notNull(),
});

export const absenceTypes = pgTable("absence_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
  description: text("description"),
  type: text("type"),
  icon: text("icon"),
});

export const insertAbsenceTypeSchema = createInsertSchema(absenceTypes).omit({ id: true });
export type InsertAbsenceType = z.infer<typeof insertAbsenceTypeSchema>;
export type AbsenceType = typeof absenceTypes.$inferSelect;

export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  niveis: integer("niveis").default(3),
  tipoGrafico: text("tipo_grafico"),
});

export const insertSkillCategorySchema = createInsertSchema(skillCategories).omit({ id: true });
export type InsertSkillCategory = z.infer<typeof insertSkillCategorySchema>;
export type SkillCategory = typeof skillCategories.$inferSelect;

export const memberSkills = pgTable("member_skills", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  name: text("name").notNull(),
  type: text("type"),
  level: text("level"),
  desired: text("desired"),
});

export const insertMemberSkillSchema = createInsertSchema(memberSkills).omit({ id: true });
export type InsertMemberSkill = z.infer<typeof insertMemberSkillSchema>;
export type MemberSkill = typeof memberSkills.$inferSelect;

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => skillCategories.id, { onDelete: "set null" }),
  icon: text("icon"),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const kudosTypes = pgTable("kudos_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  description: text("description"),
});

export const insertKudosTypeSchema = createInsertSchema(kudosTypes);
export type InsertKudosType = z.infer<typeof insertKudosTypeSchema>;
export type KudosType = typeof kudosTypes.$inferSelect;

export const kudos = pgTable("kudos", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  typeId: text("type_id"),
  message: text("message"),
  fromName: text("from_name"),
  date: text("date"),
});

export const insertKudosSchema = createInsertSchema(kudos).omit({ id: true });
export type InsertKudos = z.infer<typeof insertKudosSchema>;
export type Kudos = typeof kudos.$inferSelect;

export const logTypes = pgTable("log_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
  description: text("description"),
});

export const insertLogTypeSchema = createInsertSchema(logTypes).omit({ id: true });
export type InsertLogType = z.infer<typeof insertLogTypeSchema>;
export type LogType = typeof logTypes.$inferSelect;

export const actionTypes = pgTable("action_types", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  iconeName: text("icone_name"),
  cor: text("cor"),
});

export const insertActionTypeSchema = createInsertSchema(actionTypes).omit({ id: true });
export type InsertActionType = z.infer<typeof insertActionTypeSchema>;
export type ActionType = typeof actionTypes.$inferSelect;

export const hobbyCategories = pgTable("hobby_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertHobbyCategorySchema = createInsertSchema(hobbyCategories).omit({ id: true });
export type InsertHobbyCategory = z.infer<typeof insertHobbyCategorySchema>;
export type HobbyCategory = typeof hobbyCategories.$inferSelect;

export const hobbies = pgTable("hobbies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => hobbyCategories.id, { onDelete: "set null" }),
  icon: text("icon"),
});

export const insertHobbySchema = createInsertSchema(hobbies).omit({ id: true });
export type InsertHobby = z.infer<typeof insertHobbySchema>;
export type Hobby = typeof hobbies.$inferSelect;

export const memberHobbies = pgTable("member_hobbies", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  hobbyId: integer("hobby_id").references(() => hobbies.id, { onDelete: "cascade" }),
  customName: text("custom_name"),
});

export const insertMemberHobbySchema = createInsertSchema(memberHobbies).omit({ id: true });
export type InsertMemberHobby = z.infer<typeof insertMemberHobbySchema>;
export type MemberHobby = typeof memberHobbies.$inferSelect;

export const functions = pgTable("functions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertFunctionSchema = createInsertSchema(functions).omit({ id: true });
export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type MemberFunction = typeof functions.$inferSelect;

export const memberFunctions = pgTable(
  "member_functions",
  {
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    functionId: integer("function_id")
      .notNull()
      .references(() => functions.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.memberId, table.functionId] })],
);

export const insertMemberFunctionSchema = createInsertSchema(memberFunctions);
export type InsertMemberFunction = z.infer<typeof insertMemberFunctionSchema>;

export const memberLinks = pgTable("member_links", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  platform: text("platform").notNull(),
  handle: text("handle"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMemberLinkSchema = createInsertSchema(memberLinks).omit({ id: true, createdAt: true });
export type InsertMemberLink = z.infer<typeof insertMemberLinkSchema>;
export type MemberLink = typeof memberLinks.$inferSelect;

export const invitations = pgTable("invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  invitedEmail: text("invited_email").notNull(),
  invitedByMemberId: integer("invited_by_member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  role: text("role"),
  token: varchar("token").notNull().unique().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({ id: true, token: true, createdAt: true });
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Invitation = typeof invitations.$inferSelect;

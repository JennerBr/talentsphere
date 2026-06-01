import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useCompany } from "@/lib/company-context";

const BASE = "/api";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function useApiClient() {
  const { getToken } = useAuth();
  const { selectedOrg } = useCompany();

  async function fetchJson<T>(path: string): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (selectedOrg) headers["X-Team-Id"] = String(selectedOrg.id);
    const res = await fetch(`${BASE}${path}`, { headers });
    if (res.status === 401) throw new UnauthorizedError(await res.text());
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  async function mutateJson<T>(
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (selectedOrg) headers["X-Team-Id"] = String(selectedOrg.id);
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) throw new UnauthorizedError(await res.text());
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return { fetchJson, mutateJson };
}

export interface ApiTeam {
  id: number;
  name: string;
  logo: string | null;
  cnpj: string | null;
  status: string | null;
  allowedDomains: string[] | null;
}

export interface ApiInvitation {
  id: string;
  teamId: number;
  invitedEmail: string;
  invitedByMemberId: number;
  invitedByName: string | null;
  role: string | null;
  token: string;
  status: string;
  expiresAt: string;
  createdAt: string | null;
  inviteUrl: string;
}

export interface InviteBatchResult {
  email: string;
  token: string | null;
  inviteUrl: string | null;
  valid: boolean;
  reason: string | null;
}

export interface PublicInvite {
  id: string;
  invitedEmail: string;
  invitedByName: string | null;
  orgName: string;
  role: string | null;
  status: string;
  expiresAt: string;
  token: string;
}

export interface ApiPosition {
  id: number;
  name: string;
  chairs: number;
  allocated: number;
  parentId: number | null;
  organizacaoId: number;
  createdBy: string | null;
  createdAt: string | null;
}

export interface ApiMember {
  id: number;
  name: string;
  fullName: string | null;
  role: string | null;
  seniority: string | null;
  project: string | null;
  turma: string | null;
  skills: string[] | null;
  email: string | null;
  avatar: string | null;
  birthday: string | null;
  contractDate: string | null;
  availableKudos: number | null;
  organizacaoId: number | null;
  positionId: number | null;
  phone: string | null;
  linkedin: string | null;
  teamsUrl: string | null;
  slackUrl: string | null;
  webexUrl: string | null;
  organizations?: Array<{ id: number; name: string; logo: string | null }>;
}

export interface ApiHobby {
  id: number;
  name: string;
  categoryId: number | null;
  categoryName?: string | null;
  icon?: string | null;
}

export interface ApiMemberHobby {
  id: number | null;
  name: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  icon?: string | null;
  customName?: string | null;
}

export interface ApiHobbyCategory {
  id: number;
  name: string;
}

export interface ApiMemberFunctionItem {
  id: number;
  name: string;
}

export interface ApiProject {
  id: number;
  name: string;
  organizacaoId: number | null;
  objective: string | null;
  clients: string | null;
  tools: string[] | null;
  team: string | null;
  startDate: string | null;
  endDate: string | null;
  rating: number | null;
  status: string | null;
  observation: string | null;
  stakeholders: number[];
}

export interface ApiAbsenceType {
  id: number;
  name: string;
  color: string | null;
  description: string | null;
  type: string | null;
  icon: string | null;
}

export interface ApiSkillCategory {
  id: number;
  nome: string;
  descricao: string | null;
  niveis: number | null;
  tipoGrafico: string | null;
}

export interface ApiSkill {
  id: number;
  name: string;
  categoryId: number | null;
  icon: string | null;
}

export interface ApiMemberSkill {
  id: number;
  memberId: number;
  name: string;
  type: string | null;
  level: string | null;
  desired: string | null;
}

export interface ApiKudosType {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
}

export interface ApiKudos {
  id: number;
  memberId: number;
  typeId: string | null;
  message: string | null;
  fromName: string | null;
  date: string | null;
}

export interface ApiLogType {
  id: number;
  name: string;
  color: string | null;
  description: string | null;
}

export interface ApiActionType {
  id: number;
  nome: string;
  iconeName: string | null;
  cor: string | null;
}

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useCurrentMember() {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useQuery<ApiMember>({
    queryKey: ["current-member", selectedOrg?.id],
    queryFn: () => fetchJson<ApiMember>("/auth/me"),
    staleTime: 60_000,
    retry: false,
  });
}

export function useTeams() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiTeam[]>({
    queryKey: ["/api/teams"],
    queryFn: () => fetchJson<ApiTeam[]>("/teams"),
  });
}

export function usePositions(organizacaoId?: number | string) {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  const effectiveOrgId = organizacaoId ?? selectedOrg?.id;
  const qs = effectiveOrgId ? `?organizacao_id=${effectiveOrgId}` : "";
  return useQuery<ApiPosition[]>({
    queryKey: ["/api/positions", effectiveOrgId],
    queryFn: () => fetchJson<ApiPosition[]>(`/positions${qs}`),
  });
}

export function useMembers() {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useQuery<ApiMember[]>({
    queryKey: ["/api/members", selectedOrg?.id],
    queryFn: () => fetchJson<ApiMember[]>("/members"),
  });
}

export function useMember(id: number) {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useQuery<ApiMember>({
    queryKey: ["/api/members", id, selectedOrg?.id],
    queryFn: () => fetchJson<ApiMember>(`/members/${id}`),
    enabled: !!id,
  });
}

export function useMemberSkills(memberId: number) {
  const { fetchJson } = useApiClient();
  return useQuery<ApiMemberSkill[]>({
    queryKey: ["/api/members", memberId, "skills"],
    queryFn: () => fetchJson<ApiMemberSkill[]>(`/members/${memberId}/skills`),
    enabled: !!memberId,
  });
}

export function useMemberKudos(memberId: number) {
  const { fetchJson } = useApiClient();
  return useQuery<ApiKudos[]>({
    queryKey: ["/api/members", memberId, "kudos"],
    queryFn: () => fetchJson<ApiKudos[]>(`/members/${memberId}/kudos`),
    enabled: !!memberId,
  });
}

export function useHobbies() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiHobby[]>({
    queryKey: ["/api/hobbies"],
    queryFn: () => fetchJson<ApiHobby[]>("/hobbies"),
  });
}

export function useHobbyCategories() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiHobbyCategory[]>({
    queryKey: ["/api/hobby-categories"],
    queryFn: () => fetchJson<ApiHobbyCategory[]>("/hobby-categories"),
  });
}

export function useCreateHobby() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiHobby, Error, { name: string; categoryId?: number | null; icon?: string | null }>({
    mutationFn: (data) => mutateJson("POST", "/hobbies", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/hobbies"] }); },
  });
}

export function useUpdateHobby() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiHobby, Error, { id: number; name: string; categoryId?: number | null; icon?: string | null }>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/hobbies/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/hobbies"] }); },
  });
}

export function useDeleteHobby() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/hobbies/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/hobbies"] }); },
  });
}

export function useCreateHobbyCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiHobbyCategory, Error, { name: string }>({
    mutationFn: (data) => mutateJson("POST", "/hobby-categories", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/hobby-categories"] }); },
  });
}

export function useUpdateHobbyCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiHobbyCategory, Error, { id: number; name: string }>({
    mutationFn: ({ id, name }) => mutateJson("PUT", `/hobby-categories/${id}`, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/hobby-categories"] });
      qc.invalidateQueries({ queryKey: ["/api/hobbies"] });
    },
  });
}

export function useDeleteHobbyCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/hobby-categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/hobby-categories"] }); },
  });
}

export function useMemberHobbies(memberId: number) {
  const { fetchJson } = useApiClient();
  return useQuery<ApiMemberHobby[]>({
    queryKey: ["/api/members", memberId, "hobbies"],
    queryFn: () => fetchJson<ApiMemberHobby[]>(`/members/${memberId}/hobbies`),
    enabled: !!memberId,
  });
}

export interface UpdateMemberHobbiesInput {
  ids: number[];
  customNames: string[];
}

export function useUpdateMemberHobbies(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberHobby[], Error, UpdateMemberHobbiesInput>({
    mutationFn: (input) => mutateJson("PUT", `/members/${memberId}/hobbies`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "hobbies"] });
    },
  });
}

export function useFunctions() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiMemberFunctionItem[]>({
    queryKey: ["/api/functions"],
    queryFn: () => fetchJson<ApiMemberFunctionItem[]>("/functions"),
  });
}

export function useMemberFunctions(memberId: number) {
  const { fetchJson } = useApiClient();
  return useQuery<ApiMemberFunctionItem[]>({
    queryKey: ["/api/members", memberId, "functions"],
    queryFn: () => fetchJson<ApiMemberFunctionItem[]>(`/members/${memberId}/functions`),
    enabled: !!memberId,
  });
}

export function useUpdateMemberFunctions(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberFunctionItem[], Error, number[]>({
    mutationFn: (functionIds) => mutateJson("PUT", `/members/${memberId}/functions`, { functionIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "functions"] });
    },
  });
}

export function useProjects() {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useQuery<ApiProject[]>({
    queryKey: ["/api/projects", selectedOrg?.id],
    queryFn: () => fetchJson<ApiProject[]>("/projects"),
  });
}

export function useAbsenceTypes() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiAbsenceType[]>({
    queryKey: ["/api/absence-types"],
    queryFn: () => fetchJson<ApiAbsenceType[]>("/absence-types"),
  });
}

export function useSkillCategories() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiSkillCategory[]>({
    queryKey: ["/api/skill-categories"],
    queryFn: () => fetchJson<ApiSkillCategory[]>("/skill-categories"),
  });
}

export function useKudosTypes() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiKudosType[]>({
    queryKey: ["/api/kudos-types"],
    queryFn: () => fetchJson<ApiKudosType[]>("/kudos-types"),
  });
}

export function useLogTypes() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiLogType[]>({
    queryKey: ["/api/log-types"],
    queryFn: () => fetchJson<ApiLogType[]>("/log-types"),
  });
}

export function useActionTypes() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiActionType[]>({
    queryKey: ["/api/action-types"],
    queryFn: () => fetchJson<ApiActionType[]>("/action-types"),
  });
}

// ─── Team mutations ───────────────────────────────────────────────────────────

type TeamInput = Omit<ApiTeam, "id">;

export function useCreateTeam() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiTeam, Error, TeamInput>({
    mutationFn: (data) => mutateJson("POST", "/teams", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/teams"] }); },
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiTeam, Error, { id: number } & Partial<TeamInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/teams/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/teams"] }); },
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/teams/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/teams"] }); },
  });
}

// ─── Position mutations ───────────────────────────────────────────────────────

type PositionInput = Omit<ApiPosition, "id">;

export function useCreatePosition() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiPosition, Error, PositionInput>({
    mutationFn: (data) => mutateJson("POST", "/positions", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/positions"] }); },
  });
}

export function useUpdatePosition() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiPosition, Error, { id: number } & Partial<PositionInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/positions/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/positions"] }); },
  });
}

export function useDeletePosition() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/positions/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/positions"] }); },
  });
}

// ─── Member mutations ─────────────────────────────────────────────────────────

type MemberInput = Omit<ApiMember, "id" | "organizations">;

export function useCreateMember() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMember, Error, MemberInput>({
    mutationFn: (data) => mutateJson("POST", "/members", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/members"] }); },
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMember, Error, { id: number } & Partial<MemberInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/members/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/members"] }); },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/members/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/members"] }); },
  });
}

export function useRemoveMemberFromTeam() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useMutation<void, Error, { memberId: number; teamId: number }>({
    mutationFn: ({ memberId, teamId }) =>
      mutateJson("DELETE", `/members/${memberId}/teams/${teamId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", selectedOrg?.id] });
    },
  });
}

export interface LinkMemberByEmailInput {
  email: string;
  role?: string;
  positionId?: number | null;
}

export function useLinkMemberByEmail() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMember, Error, LinkMemberByEmailInput>({
    mutationFn: (data) => mutateJson("POST", "/members/link-by-email", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/members"] }); },
  });
}

// ─── Member skill mutations ───────────────────────────────────────────────────

export interface MemberSkillInput {
  name: string;
  type?: string;
  level?: string;
  desired?: string;
}

export function useAddMemberSkill(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberSkill, Error, MemberSkillInput>({
    mutationFn: (data) => mutateJson("POST", `/members/${memberId}/skills`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "skills"] });
    },
  });
}

export function useDeleteMemberSkill(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (skillId) => mutateJson("DELETE", `/members/${memberId}/skills/${skillId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "skills"] });
    },
  });
}

export function useUpdateMemberSkills(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberSkill[], Error, Array<{ name: string; type: string | null }>>({
    mutationFn: (skills) => mutateJson("PUT", `/members/${memberId}/skills`, { skills }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "skills"] });
    },
  });
}

// ─── Project mutations ────────────────────────────────────────────────────────

type ProjectInput = Omit<ApiProject, "id">;

export function useCreateProject() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiProject, Error, ProjectInput>({
    mutationFn: (data) => mutateJson("POST", "/projects", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/projects"] }); },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiProject, Error, { id: number } & Partial<ProjectInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/projects/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/projects"] }); },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/projects/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/projects"] }); },
  });
}

// ─── Absence type mutations ───────────────────────────────────────────────────

type AbsenceTypeInput = Omit<ApiAbsenceType, "id">;

export function useCreateAbsenceType() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiAbsenceType, Error, AbsenceTypeInput>({
    mutationFn: (data) => mutateJson("POST", "/absence-types", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/absence-types"] }); },
  });
}

export function useUpdateAbsenceType() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiAbsenceType, Error, { id: number } & Partial<AbsenceTypeInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/absence-types/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/absence-types"] }); },
  });
}

export function useDeleteAbsenceType() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/absence-types/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/absence-types"] }); },
  });
}

// ─── Skills catalog ───────────────────────────────────────────────────────────

export function useSkills() {
  const { fetchJson } = useApiClient();
  return useQuery<ApiSkill[]>({
    queryKey: ["/api/skills"],
    queryFn: () => fetchJson<ApiSkill[]>("/skills"),
  });
}

type SkillInput = Omit<ApiSkill, "id">;

export function useCreateSkill() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiSkill, Error, SkillInput>({
    mutationFn: (data) => mutateJson("POST", "/skills", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skills"] }); },
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiSkill, Error, { id: number } & Partial<SkillInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/skills/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skills"] }); },
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/skills/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skills"] }); },
  });
}

// ─── Skill category mutations ─────────────────────────────────────────────────

type SkillCategoryInput = Omit<ApiSkillCategory, "id">;

export function useCreateSkillCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiSkillCategory, Error, SkillCategoryInput>({
    mutationFn: (data) => mutateJson("POST", "/skill-categories", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skill-categories"] }); },
  });
}

export function useUpdateSkillCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiSkillCategory, Error, { id: number } & Partial<SkillCategoryInput>>({
    mutationFn: ({ id, ...data }) => mutateJson("PUT", `/skill-categories/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skill-categories"] }); },
  });
}

export function useDeleteSkillCategory() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => mutateJson("DELETE", `/skill-categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/skill-categories"] }); },
  });
}

// ─── Member Links ─────────────────────────────────────────────────────────────

export interface ApiMemberLink {
  id: number;
  memberId: number;
  url: string;
  platform: string;
  handle: string | null;
  sortOrder: number;
  createdAt: string | null;
}

export function useMemberLinks(memberId: number) {
  const { fetchJson } = useApiClient();
  return useQuery<ApiMemberLink[]>({
    queryKey: ["/api/members", memberId, "links"],
    queryFn: () => fetchJson<ApiMemberLink[]>(`/members/${memberId}/links`),
    enabled: !!memberId,
  });
}

export function useAddMemberLink(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberLink, Error, { url: string }>({
    mutationFn: (data) => mutateJson("POST", `/members/${memberId}/links`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "links"] });
    },
  });
}

export function useDeleteMemberLink(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<void, Error, number>({
    mutationFn: (linkId) => mutateJson("DELETE", `/members/${memberId}/links/${linkId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId, "links"] });
    },
  });
}

export function useReorderMemberLinks(memberId: number) {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  return useMutation<ApiMemberLink[], Error, number[]>({
    mutationFn: (ids) => mutateJson("PATCH", `/members/${memberId}/links/reorder`, { ids }),
    onSuccess: (data) => {
      qc.setQueryData(["/api/members", memberId, "links"], data);
    },
  });
}

// ─── Member avatar upload ─────────────────────────────────────────────────────

export function useUploadMemberAvatar(memberId: number) {
  const qc = useQueryClient();
  const { getToken } = useAuth();
  const { selectedOrg } = useCompany();

  return useMutation<{ avatarUrl: string }, Error, File>({
    mutationFn: async (file) => {
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Tipo de arquivo inválido. Use .jpg, .png ou .webp");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Arquivo muito grande. Tamanho máximo: 5 MB");
      }

      const token = await getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (selectedOrg) headers["X-Team-Id"] = String(selectedOrg.id);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${BASE}/members/${memberId}/avatar`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (res.status === 401) throw new Error("Não autorizado");
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try { msg = JSON.parse(text).error ?? text; } catch { /* noop */ }
        throw new Error(msg);
      }
      return res.json() as Promise<{ avatarUrl: string }>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/members", memberId] });
      qc.invalidateQueries({ queryKey: ["/api/members"] });
      qc.invalidateQueries({ queryKey: ["current-member"] });
    },
  });
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export function usePendingInvites() {
  const { fetchJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useQuery<ApiInvitation[]>({
    queryKey: ["/api/invites", selectedOrg?.id],
    queryFn: () => fetchJson<ApiInvitation[]>("/invites"),
    enabled: !!selectedOrg,
  });
}

export function useBatchInvite() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useMutation<InviteBatchResult[], Error, { emails: string[]; role?: string }>({
    mutationFn: (data) => mutateJson("POST", "/invites/batch", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/invites", selectedOrg?.id] });
    },
  });
}

export function useCancelInvite() {
  const qc = useQueryClient();
  const { mutateJson } = useApiClient();
  const { selectedOrg } = useCompany();
  return useMutation<void, Error, string>({
    mutationFn: (id) => mutateJson("DELETE", `/invites/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/invites", selectedOrg?.id] });
    },
  });
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingInput {
  orgName: string;
  employeeName: string;
}

export interface OnboardingResult {
  organization: ApiTeam;
  member: ApiMember;
}

export function useOnboarding() {
  const qc = useQueryClient();
  const { getToken } = useAuth();
  return useMutation<OnboardingResult, Error, OnboardingInput>({
    mutationFn: async (data) => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${BASE}/onboarding`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (res.status === 401) throw new UnauthorizedError(await res.text());
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json() as Promise<OnboardingResult>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["current-member"] });
      qc.invalidateQueries({ queryKey: ["/api/teams"] });
      qc.invalidateQueries({ queryKey: ["/api/members"] });
    },
  });
}

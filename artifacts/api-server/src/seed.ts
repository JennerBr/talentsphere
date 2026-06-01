import { db } from "@workspace/db";
import {
  teams,
  positions,
  members,
  teamMembers,
  projects,
  projectStakeholders,
  absenceTypes,
  skillCategories,
  memberSkills,
  kudosTypes,
  kudos,
  logTypes,
  actionTypes,
} from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.execute(sql`TRUNCATE TABLE
    action_types, log_types, kudos, kudos_types,
    member_skills, skill_categories, absence_types,
    project_stakeholders, projects, team_members, members,
    positions, teams
    RESTART IDENTITY CASCADE`);

  const teamRows = await db
    .insert(teams)
    .values([
      { name: "Tech Corp", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format", cnpj: "12.345.678/0001-90", status: "Ativo" },
      { name: "Inova Systems", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&auto=format", cnpj: "98.765.432/0001-10", status: "Ativo" },
      { name: "InovaTech", logo: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=100&h=100&fit=crop&auto=format", cnpj: "11.222.333/0001-44", status: "Ativo" },
    ])
    .returning();
  console.log(`  ✓ ${teamRows.length} teams`);

  await db.execute(sql`INSERT INTO positions (id, name, chairs, allocated, parent_id, organizacao_id, created_by, created_at) VALUES
    (1,  'Presidência - CEO',                      1, 1, NULL, 1, 'Admin Sistema',  '2023-01-10T10:00:00Z'),
    (2,  'Diretoria Executiva - Diretor Executivo', 1, 1,    1, 1, 'Admin Sistema',  '2023-01-10T10:05:00Z'),
    (3,  'Diretoria Financeira - CFO',              1, 1,    1, 1, 'Admin Sistema',  '2023-01-10T10:10:00Z'),
    (4,  'Tesouraria - Tesoureiro Chefe',           1, 1,    3, 1, 'João Silva',     '2023-02-15T14:30:00Z'),
    (5,  'Analista Financeiro',                     2, 2,    4, 1, 'João Silva',     '2023-02-15T14:35:00Z'),
    (6,  'Analista Contábil',                       2, 1,    4, 1, 'João Silva',     '2023-02-15T14:40:00Z'),
    (7,  'Engenharia Financeira',                   1, 1,    4, 1, 'Maria Costa',    '2023-06-20T09:15:00Z'),
    (8,  'Diretoria de TI - CIO',                  1, 1,    1, 1, 'Admin Sistema',  '2023-01-10T10:15:00Z'),
    (9,  'Sistemas ERP - Coordenador',             1, 1,    8, 1, 'Pedro Mendes',   '2023-03-05T11:20:00Z'),
    (10, 'Líder BU Finanças',                       1, 2,    9, 1, 'Pedro Mendes',   '2023-03-05T11:25:00Z'),
    (11, 'Desenvolvedor',                           2, 1,    9, 1, 'Pedro Mendes',   '2023-03-05T11:30:00Z'),
    (12, 'Diretoria de RH - CHRO',                 1, 1,    1, 1, 'Admin Sistema',  '2023-01-10T10:20:00Z'),
    (13, 'Recrutador',                              5, 3,   12, 1, 'Ana Souza',      '2023-04-12T16:45:00Z'),
    (101,'Presidência - Presidente',               1, 1, NULL, 2, 'Admin Sistema',  '2023-01-10T10:00:00Z'),
    (102,'Diretoria Comercial - Diretor',          1, 1,  101, 2, 'Admin Sistema',  '2023-01-10T10:05:00Z'),
    (103,'Vendedor',                               10,12,  102, 2, 'Lucas Ferreira', '2023-05-22T13:10:00Z'),
    (201,'Diretoria Geral - Sócio Diretor',        1, 1, NULL, 3, 'Admin Sistema',  '2023-01-10T10:00:00Z'),
    (202,'Inovação - Gerente',                     1, 1,  201, 3, 'Fernando Ruiz',  '2023-08-14T15:20:00Z')
  `);
  console.log("  ✓ 18 positions");

  const emps = await db
    .insert(members)
    .values([
      { name: "João Silva",     seniority: "Pleno",       project: "Projeto Alpha", turma: "Turma 1", skills: ["React","TypeScript"],      email: "joao.silva@exemplo.com",    avatar: "https://i.pravatar.cc/150?u=João Silva",    birthday: "1990-05-15", contractDate: "2023-01-15", availableKudos: 5 },
      { name: "Maria Costa",    seniority: "Sênior",      project: "Projeto Beta",  turma: "Turma 1", skills: ["Node.js","Python"],         email: "maria.costa@exemplo.com",   avatar: "https://i.pravatar.cc/150?u=Maria Costa",   birthday: "1988-08-22", contractDate: "2021-04-10", availableKudos: 5 },
      { name: "Carlos Santos",  seniority: "Júnior",      project: "Projeto Alpha", turma: "Turma 2", skills: ["Cypress","Jest"],           email: "carlos.santos@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Carlos Santos", birthday: "1995-11-05", contractDate: "2022-09-01", availableKudos: 5 },
      { name: "Ana Souza",      seniority: "Pleno",       project: "Projeto Gamma", turma: "Turma 1", skills: ["Figma","Research"],         email: "ana.souza@exemplo.com",     avatar: "https://i.pravatar.cc/150?u=Ana Souza",     birthday: "1992-03-10", contractDate: "2023-11-20", availableKudos: 5 },
      { name: "Pedro Mendes",   seniority: "Especialista",project: "Projeto Beta",  turma: "Turma 3", skills: ["AWS","Docker"],             email: "pedro.mendes@exemplo.com",  avatar: "https://i.pravatar.cc/150?u=Pedro Mendes",  birthday: "1985-07-30", contractDate: "2020-02-15", availableKudos: 5 },
      { name: "Lucas Ferreira", seniority: "Júnior",      project: "Projeto Gamma", turma: "Turma 2", skills: ["Vue","CSS"],                email: "lucas.ferreira@exemplo.com",avatar: "https://i.pravatar.cc/150?u=Lucas Ferreira",birthday: "1998-01-20", contractDate: "2024-01-05", availableKudos: 5 },
      { name: "Juliana Lima",   seniority: "Pleno",       project: "Projeto Alpha", turma: "Turma 3", skills: ["Java","Spring"],            email: "juliana.lima@exemplo.com",  avatar: "https://i.pravatar.cc/150?u=Juliana Lima",  birthday: "1991-09-12", contractDate: "2022-06-15", availableKudos: 5 },
      { name: "Rafael Gomes",   seniority: "Sênior",      project: "Projeto Beta",  turma: "Turma 1", skills: ["React Native","Swift"],     email: "rafael.gomes@exemplo.com",  avatar: "https://i.pravatar.cc/150?u=Rafael Gomes",  birthday: "1989-12-05", contractDate: "2021-10-01", availableKudos: 5 },
      { name: "Beatriz Alves",  seniority: "Especialista",project: "Projeto Delta", turma: "Turma 2", skills: ["Python","SQL"],             email: "beatriz.alves@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Beatriz Alves", birthday: "1987-04-18", contractDate: "2019-08-20", availableKudos: 5 },
      { name: "Fernando Ruiz",  seniority: "Sênior",      project: "Projeto Delta", turma: "Turma 3", skills: ["Scrum","Agile"],            email: "fernando.ruiz@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Fernando Ruiz", birthday: "1986-10-25", contractDate: "2020-11-10", availableKudos: 5 },
    ])
    .returning();
  console.log(`  ✓ ${emps.length} members`);

  await db.insert(teamMembers).values([
    { memberId: emps[0].id, teamId: teamRows[0].id, role: "Frontend",        positionId: null },
    { memberId: emps[1].id, teamId: teamRows[0].id, role: "Backend",         positionId: null },
    { memberId: emps[2].id, teamId: teamRows[0].id, role: "QA Analyst",      positionId: null },
    { memberId: emps[3].id, teamId: teamRows[0].id, role: "UX/UI",           positionId: null },
    { memberId: emps[4].id, teamId: teamRows[0].id, role: "DevOps",          positionId: null },
    { memberId: emps[5].id, teamId: teamRows[1].id, role: "Frontend",        positionId: null },
    { memberId: emps[6].id, teamId: teamRows[0].id, role: "Backend",         positionId: null },
    { memberId: emps[7].id, teamId: teamRows[0].id, role: "Mobile",          positionId: null },
    { memberId: emps[8].id, teamId: teamRows[2].id, role: "Data Science",    positionId: null },
    { memberId: emps[9].id, teamId: teamRows[2].id, role: "Product Manager", positionId: null },
    { memberId: emps[8].id, teamId: teamRows[0].id, role: "Data Science",    positionId: null },
  ]);
  console.log("  ✓ team_members links");

  await db.insert(projects).values([
    { name: "Projeto Alpha (Q1)", organizacaoId: teamRows[0].id, objective: "Desenvolver novo portal do cliente", clients: "Acme Corp, Tech Solutions", tools: ["React","Node.js","PostgreSQL"], team: "João Silva, Maria Costa, Pedro Mendes", startDate: "2024-01-15", endDate: "2024-04-10", rating: 5, status: "Em andamento", observation: "Entrega superou as expectativas do cliente em termos de performance." },
    { name: "Migração Cloud",      organizacaoId: teamRows[0].id, objective: "Migrar infraestrutura legada para AWS",   clients: "Inova Systems",             tools: ["AWS","Docker","Terraform"],       team: "Pedro Mendes, Carlos Santos",          startDate: "2024-03-01", endDate: null,         rating: 4, status: "Planejamento",  observation: "Fase de planejamento concluída com sucesso." },
    { name: "App Mobile V2",       organizacaoId: teamRows[1].id, objective: "Lançar versão 2.0 do aplicativo móvel",  clients: "Tech Corp",                 tools: ["React Native","Swift","Kotlin"],  team: "Rafael Gomes, Ana Souza",              startDate: "2023-06-10", endDate: "2023-12-20", rating: 5, status: "Concluído",     observation: "Aplicativo lançado nas lojas com ótima aceitação." },
    { name: "Projeto Gamma",       organizacaoId: teamRows[0].id, objective: "Redesign da plataforma interna",        clients: "Internal",                  tools: ["Vue","CSS","Figma"],              team: "Ana Souza, Lucas Ferreira",            startDate: "2024-02-10", endDate: null,         rating: 0, status: "Em andamento", observation: "" },
    { name: "Projeto Delta",       organizacaoId: teamRows[2].id, objective: "Implementar pipeline de Data Science",  clients: "Data Analytics Dept",       tools: ["Python","SQL","Scrum"],           team: "Beatriz Alves, Fernando Ruiz",         startDate: "2024-01-05", endDate: null,         rating: 0, status: "Em andamento", observation: "" },
  ]);
  console.log("  ✓ 5 projects");

  await db.insert(projectStakeholders).values([
    { projectId: 1, memberId: emps[0].id }, { projectId: 1, memberId: emps[2].id }, { projectId: 1, memberId: emps[6].id },
    { projectId: 2, memberId: emps[1].id }, { projectId: 2, memberId: emps[4].id }, { projectId: 2, memberId: emps[7].id },
    { projectId: 3, memberId: emps[3].id }, { projectId: 3, memberId: emps[5].id },
    { projectId: 4, memberId: emps[3].id }, { projectId: 4, memberId: emps[5].id },
    { projectId: 5, memberId: emps[8].id }, { projectId: 5, memberId: emps[9].id },
  ]);
  console.log("  ✓ 12 project stakeholders");

  await db.insert(absenceTypes).values([
    { name: "Férias",                        color: "blue",   description: "Período de descanso anual remunerado.",              type: "ferias",               icon: "Plane" },
    { name: "Licença Médica",                color: "red",    description: "Ausência justificada por motivos de saúde.",         type: "licenca_medica",       icon: "Stethoscope" },
    { name: "Folga Compensatória",           color: "green",  description: "Folga concedida por horas extras trabalhadas.",      type: "folga",                icon: "Coffee" },
    { name: "Licença Maternidade/Paternidade",color:"purple", description: "Licença legal para nascimento ou adoção.",           type: "licenca_paternidade",  icon: "Baby" },
    { name: "Outro",                         color: "amber",  description: "Outros tipos de ausência justificada ou não.",       type: "outro",                icon: "Info" },
  ]);
  console.log("  ✓ 5 absence types");

  await db.insert(skillCategories).values([
    { nome: "Hard Skill", descricao: "Habilidades técnicas e específicas", niveis: 3, tipoGrafico: "barras" },
    { nome: "Soft Skill", descricao: "Habilidades comportamentais",        niveis: 3, tipoGrafico: "radar" },
    { nome: "Idioma",     descricao: "Línguas estrangeiras",               niveis: 5, tipoGrafico: "barras" },
  ]);
  console.log("  ✓ 3 skill categories");

  await db.insert(memberSkills).values([
    { memberId: emps[0].id, name: "React",                 type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[0].id, name: "TypeScript",            type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[0].id, name: "Comunicação",           type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[0].id, name: "Liderança",             type: "Soft Skill", level: "Básico",        desired: "Intermediário" },
    { memberId: emps[0].id, name: "Trabalho em Equipe",    type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[0].id, name: "Gestão de Tempo",       type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[0].id, name: "Resiliência",           type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[0].id, name: "Adaptabilidade",        type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[0].id, name: "Criatividade",          type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[0].id, name: "Inteligência Emocional",type: "Soft Skill", level: "Básico",        desired: "Intermediário" },
    { memberId: emps[0].id, name: "Inglês",                type: "Idioma",     level: "Nível 3",       desired: "Nível 5" },

    { memberId: emps[1].id, name: "Node.js",               type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Python",                type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Mentoria",              type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Arquitetura",           type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Inteligência Emocional",type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Negociação",            type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[1].id, name: "Visão Sistêmica",       type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Comunicação Assertiva", type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[1].id, name: "Resolução de Conflitos",type: "Soft Skill", level: "Intermediário", desired: "Avançado" },

    { memberId: emps[2].id, name: "Cypress",               type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Jest",                  type: "Hard Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[2].id, name: "Atenção aos Detalhes",  type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Proatividade",          type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[2].id, name: "Organização",           type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Comunicação Escrita",   type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Colaboração",           type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Pensamento Analítico",  type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[2].id, name: "Gestão do Estresse",    type: "Soft Skill", level: "Intermediário", desired: "Avançado" },

    { memberId: emps[3].id, name: "Figma",                 type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Research",              type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Empatia",               type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Criatividade",          type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Resolução de Problemas",type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Pensamento Crítico",    type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Facilitação",           type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[3].id, name: "Storytelling",          type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[3].id, name: "Adaptabilidade",        type: "Soft Skill", level: "Avançado",      desired: "Avançado" },

    { memberId: emps[4].id, name: "AWS",                   type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[4].id, name: "Docker",                type: "Hard Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[4].id, name: "Kubernetes",            type: "Hard Skill", level: "Intermediário", desired: "Avançado" },
    { memberId: emps[4].id, name: "Liderança",             type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[4].id, name: "Comunicação",           type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[4].id, name: "Gestão de Projetos",    type: "Soft Skill", level: "Avançado",      desired: "Avançado" },
    { memberId: emps[4].id, name: "Inglês",                type: "Idioma",     level: "Nível 5",       desired: "Nível 5" },
  ]);
  console.log("  ✓ member skills");

  await db.insert(kudosTypes).values([
    { id: "code_rescue",   name: "Code Rescue",   icon: "⚡", description: "Para quem ajudou a resolver um bug crítico ou destravar um deploy." },
    { id: "mentor_mind",   name: "Mentor Mind",   icon: "🧠", description: "Para quem compartilhou conhecimento (conecta com a Meta Skill de Learnability)." },
    { id: "full_support",  name: "Full Support",  icon: "🤝", description: "Focado em colaboração e empatia (Power Skills)." },
    { id: "protagonismo",  name: "Protagonismo",  icon: "🚀", description: "Para quem tomou a frente de uma situação difícil." },
  ]);
  console.log("  ✓ 4 kudos types");

  await db.insert(kudos).values([
    { memberId: emps[0].id, typeId: "code_rescue",  message: "Me salvou naquele bug do React!",              fromName: "Maria Costa",   date: "2024-05-01" },
    { memberId: emps[1].id, typeId: "mentor_mind",  message: "A aula sobre microsserviços foi excelente.",   fromName: "Carlos Santos", date: "2024-04-15" },
    { memberId: emps[2].id, typeId: "full_support", message: "Sempre ajudando a equipe a encontrar os cenários de teste.", fromName: "João Silva", date: "2024-05-02" },
    { memberId: emps[3].id, typeId: "protagonismo", message: "Tomou a frente nas entrevistas com os clientes.", fromName: "Pedro Mendes", date: "2024-04-20" },
  ]);
  console.log("  ✓ 4 kudos");

  await db.insert(logTypes).values([
    { name: "Feedback Positivo",      color: "green",  description: "Reconhecimento por um bom trabalho ou atitude." },
    { name: "Ponto de Atenção",       color: "amber",  description: "Algo que precisa ser melhorado ou observado." },
    { name: "Alinhamento de Meta",    color: "blue",   description: "Discussão sobre objetivos e resultados chave (OKRs)." },
    { name: "Plano de Carreira",      color: "purple", description: "Conversa sobre desenvolvimento profissional e PDI." },
    { name: "Acompanhamento (Follow-up)", color: "slate", description: "Checagem de rotina de uma tarefa ou projeto." },
  ]);
  console.log("  ✓ 5 log types");

  await db.insert(actionTypes).values([
    { nome: "Dar Mérito",              iconeName: "Star",      cor: "text-yellow-600 bg-yellow-100" },
    { nome: "Colocar a disposição",    iconeName: "Shuffle",   cor: "text-blue-600 bg-blue-100" },
    { nome: "Feedback positivo",       iconeName: "ThumbsUp",  cor: "text-green-600 bg-green-100" },
    { nome: "Feedback negativo",       iconeName: "ThumbsDown",cor: "text-red-600 bg-red-100" },
  ]);
  console.log("  ✓ 4 action types");

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

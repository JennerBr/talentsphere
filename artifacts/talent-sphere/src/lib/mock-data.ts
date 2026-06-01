export const MOCK_KUDOS_TYPES = [
  { id: "code_rescue", name: "Code Rescue", icon: "⚡", description: "Para quem ajudou a resolver um bug crítico ou destravar um deploy." },
  { id: "mentor_mind", name: "Mentor Mind", icon: "🧠", description: "Para quem compartilhou conhecimento (conecta com a Meta Skill de Learnability)." },
  { id: "full_support", name: "Full Support", icon: "🤝", description: "Focado em colaboração e empatia (Power Skills)." },
  { id: "protagonismo", name: "Protagonismo", icon: "🚀", description: "Para quem tomou a frente de uma situação difícil." }
];

export const MOCK_USERS = [
  { id: 1, name: "João Silva", role: "Frontend", seniority: "Pleno", project: "Projeto Alpha", turma: "Turma 1", skills: ["React", "TypeScript"], email: "joao.silva@exemplo.com", avatar: "https://i.pravatar.cc/150?u=João Silva", birthday: "1990-05-15", contractDate: "2023-01-15", availableKudos: 5, kudos: [{ id: 1, typeId: "code_rescue", message: "Me salvou naquele bug do React!", from: "Maria Costa", date: "2024-05-01" }] },
  { id: 2, name: "Maria Costa", role: "Backend", seniority: "Sênior", project: "Projeto Beta", turma: "Turma 1", skills: ["Node.js", "Python"], email: "maria.costa@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Maria Costa", birthday: "1988-08-22", contractDate: "2021-04-10", kudos: [{ id: 2, typeId: "mentor_mind", message: "A aula sobre microsserviços foi excelente.", from: "Carlos Santos", date: "2024-04-15" }] },
  { id: 3, name: "Carlos Santos", role: "QA Analyst", seniority: "Júnior", project: "Projeto Alpha", turma: "Turma 2", skills: ["Cypress", "Jest"], email: "carlos.santos@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Carlos Santos", birthday: "1995-11-05", contractDate: "2022-09-01", kudos: [{ id: 3, typeId: "full_support", message: "Sempre ajudando a equipe a encontrar os cenários de teste.", from: "João Silva", date: "2024-05-02" }] },
  { id: 4, name: "Ana Souza", role: "UX/UI", seniority: "Pleno", project: "Projeto Gamma", turma: "Turma 1", skills: ["Figma", "Research"], email: "ana.souza@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Ana Souza", birthday: "1992-03-10", contractDate: "2023-11-20", kudos: [{ id: 4, typeId: "protagonismo", message: "Tomou a frente nas entrevistas com os clientes.", from: "Pedro Mendes", date: "2024-04-20" }] },
  { id: 5, name: "Pedro Mendes", role: "DevOps", seniority: "Especialista", project: "Projeto Beta", turma: "Turma 3", skills: ["AWS", "Docker"], email: "pedro.mendes@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Pedro Mendes", birthday: "1985-07-30", contractDate: "2020-02-15", kudos: [] },
  { id: 6, name: "Lucas Ferreira", role: "Frontend", seniority: "Júnior", project: "Projeto Gamma", turma: "Turma 2", skills: ["Vue", "CSS"], email: "lucas.ferreira@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Lucas Ferreira", birthday: "1998-01-20", contractDate: "2024-01-05", kudos: [] },
  { id: 7, name: "Juliana Lima", role: "Backend", seniority: "Pleno", project: "Projeto Alpha", turma: "Turma 3", skills: ["Java", "Spring"], email: "juliana.lima@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Juliana Lima", birthday: "1991-09-12", contractDate: "2022-06-15", kudos: [] },
  { id: 8, name: "Rafael Gomes", role: "Mobile", seniority: "Sênior", project: "Projeto Beta", turma: "Turma 1", skills: ["React Native", "Swift"], email: "rafael.gomes@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Rafael Gomes", birthday: "1989-12-05", contractDate: "2021-10-01", kudos: [] },
  { id: 9, name: "Beatriz Alves", role: "Data Science", seniority: "Especialista", project: "Projeto Delta", turma: "Turma 2", skills: ["Python", "SQL"], email: "beatriz.alves@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Beatriz Alves", birthday: "1987-04-18", contractDate: "2019-08-20", kudos: [] },
  { id: 10, name: "Fernando Ruiz", role: "Product Manager", seniority: "Sênior", project: "Projeto Delta", turma: "Turma 3", skills: ["Scrum", "Agile"], email: "fernando.ruiz@exemplo.com", avatar: "https://i.pravatar.cc/150?u=Fernando Ruiz", birthday: "1986-10-25", contractDate: "2020-11-10", kudos: [] },
];

export const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Projeto Alpha (Q1)",
    organizacao_id: 1,
    objective: "Desenvolver novo portal do cliente",
    clients: "Acme Corp, Tech Solutions",
    tools: ["React", "Node.js", "PostgreSQL"],
    team: "João Silva, Maria Costa, Pedro Mendes",
    stakeholders: [1, 3, 7],
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 3, 10),
    rating: 5,
    status: "Em andamento",
    observation: "Entrega superou as expectativas do cliente em termos de performance."
  },
  {
    id: 2,
    name: "Migração Cloud",
    organizacao_id: 1,
    objective: "Migrar infraestrutura legada para AWS",
    clients: "Inova Systems",
    tools: ["AWS", "Docker", "Terraform"],
    team: "Pedro Mendes, Carlos Santos",
    stakeholders: [2, 5, 8],
    startDate: new Date(2024, 2, 1),
    endDate: null,
    rating: 4,
    status: "Planejamento",
    observation: "Fase de planejamento concluída com sucesso."
  },
  {
    id: 3,
    name: "App Mobile V2",
    organizacao_id: 2,
    objective: "Lançar versão 2.0 do aplicativo móvel",
    clients: "Tech Corp",
    tools: ["React Native", "Swift", "Kotlin"],
    team: "Rafael Gomes, Ana Souza",
    stakeholders: [4, 6],
    startDate: new Date(2023, 5, 10),
    endDate: new Date(2023, 11, 20),
    rating: 5,
    status: "Concluído",
    observation: "Aplicativo lançado nas lojas com ótima aceitação."
  },
  {
    id: 4,
    name: "Projeto Gamma",
    organizacao_id: 1,
    objective: "Redesign da plataforma interna",
    clients: "Internal",
    tools: ["Vue", "CSS", "Figma"],
    team: "Ana Souza, Lucas Ferreira",
    stakeholders: [4, 6],
    startDate: new Date(2024, 1, 10),
    endDate: null,
    rating: 0,
    status: "Em andamento",
    observation: ""
  },
  {
    id: 5,
    name: "Projeto Delta",
    organizacao_id: 3,
    objective: "Implementar pipeline de Data Science",
    clients: "Data Analytics Dept",
    tools: ["Python", "SQL", "Scrum"],
    team: "Beatriz Alves, Fernando Ruiz",
    stakeholders: [9, 10],
    startDate: new Date(2024, 0, 5),
    endDate: null,
    rating: 0,
    status: "Em andamento",
    observation: ""
  }
];

export const MOCK_POSITIONS = [
  { id: 1, name: "Presidência - CEO", chairs: 1, allocated: 1, parent_id: null, organizacao_id: 1, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:00:00Z" },
  { id: 2, name: "Diretoria Executiva - Diretor Executivo", chairs: 1, allocated: 1, parent_id: 1, organizacao_id: 1, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:05:00Z" },
  { id: 3, name: "Diretoria Financeira - CFO", chairs: 1, allocated: 1, parent_id: 1, organizacao_id: 1, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:10:00Z" },
  { id: 4, name: "Tesouraria - Tesoureiro Chefe", chairs: 1, allocated: 1, parent_id: 3, organizacao_id: 1, createdBy: "João Silva", createdAt: "2023-02-15T14:30:00Z" },
  { id: 5, name: "Analista Financeiro", chairs: 2, allocated: 2, parent_id: 4, organizacao_id: 1, createdBy: "João Silva", createdAt: "2023-02-15T14:35:00Z" },
  { id: 6, name: "Analista Contábil", chairs: 2, allocated: 1, parent_id: 4, organizacao_id: 1, createdBy: "João Silva", createdAt: "2023-02-15T14:40:00Z" },
  { id: 7, name: "Engenharia Financeira", chairs: 1, allocated: 1, parent_id: 4, organizacao_id: 1, createdBy: "Maria Costa", createdAt: "2023-06-20T09:15:00Z" },
  { id: 8, name: "Diretoria de TI - CIO", chairs: 1, allocated: 1, parent_id: 1, organizacao_id: 1, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:15:00Z" },
  { id: 9, name: "Sistemas ERP - Coordenador", chairs: 1, allocated: 1, parent_id: 8, organizacao_id: 1, createdBy: "Pedro Mendes", createdAt: "2023-03-05T11:20:00Z" },
  { id: 10, name: "Líder BU Finanças", chairs: 1, allocated: 2, parent_id: 9, organizacao_id: 1, createdBy: "Pedro Mendes", createdAt: "2023-03-05T11:25:00Z" },
  { id: 11, name: "Desenvolvedor", chairs: 2, allocated: 1, parent_id: 9, organizacao_id: 1, createdBy: "Pedro Mendes", createdAt: "2023-03-05T11:30:00Z" },
  { id: 12, name: "Diretoria de RH - CHRO", chairs: 1, allocated: 1, parent_id: 1, organizacao_id: 1, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:20:00Z" },
  { id: 13, name: "Recrutador", chairs: 5, allocated: 3, parent_id: 12, organizacao_id: 1, createdBy: "Ana Souza", createdAt: "2023-04-12T16:45:00Z" },
  
  { id: 101, name: "Presidência - Presidente", chairs: 1, allocated: 1, parent_id: null, organizacao_id: 2, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:00:00Z" },
  { id: 102, name: "Diretoria Comercial - Diretor", chairs: 1, allocated: 1, parent_id: 101, organizacao_id: 2, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:05:00Z" },
  { id: 103, name: "Vendedor", chairs: 10, allocated: 12, parent_id: 102, organizacao_id: 2, createdBy: "Lucas Ferreira", createdAt: "2023-05-22T13:10:00Z" },
  
  { id: 201, name: "Diretoria Geral - Sócio Diretor", chairs: 1, allocated: 1, parent_id: null, organizacao_id: 3, createdBy: "Admin Sistema", createdAt: "2023-01-10T10:00:00Z" },
  { id: 202, name: "Inovação - Gerente", chairs: 1, allocated: 1, parent_id: 201, organizacao_id: 3, createdBy: "Fernando Ruiz", createdAt: "2023-08-14T15:20:00Z" },
];

export const MOCK_ABSENCE_TYPES = [
  { id: 1, name: "Férias", color: "blue", description: "Período de descanso anual remunerado.", type: "ferias", icon: "Plane" },
  { id: 2, name: "Licença Médica", color: "red", description: "Ausência justificada por motivos de saúde.", type: "licenca_medica", icon: "Stethoscope" },
  { id: 3, name: "Folga Compensatória", color: "green", description: "Folga concedida por horas extras trabalhadas.", type: "folga", icon: "Coffee" },
  { id: 4, name: "Licença Maternidade/Paternidade", color: "purple", description: "Licença legal para nascimento ou adoção.", type: "licenca_paternidade", icon: "Baby" },
  { id: 5, name: "Outro", color: "amber", description: "Outros tipos de ausência justificada ou não.", type: "outro", icon: "Info" },
];

export const MOCK_SKILL_CATEGORIES = [
  { id: 1, nome: "Hard Skill", descricao: "Habilidades técnicas e específicas", niveis: 3, tipoGrafico: "barras" },
  { id: 2, nome: "Soft Skill", descricao: "Habilidades comportamentais", niveis: 3, tipoGrafico: "radar" },
  { id: 3, nome: "Idioma", descricao: "Línguas estrangeiras", niveis: 5, tipoGrafico: "barras" }
];

export const MOCK_SKILLS_DETAIL = {
  1: [
    { name: "React", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "TypeScript", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Comunicação", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Liderança", type: "Soft Skill", level: "Básico", desired: "Intermediário" },
    { name: "Trabalho em Equipe", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Gestão de Tempo", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Resiliência", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Adaptabilidade", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Criatividade", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Inteligência Emocional", type: "Soft Skill", level: "Básico", desired: "Intermediário" },
    { name: "Inglês", type: "Idioma", level: "Nível 3", desired: "Nível 5" }
  ],
  2: [
    { name: "Node.js", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Python", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Mentoria", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Arquitetura", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Inteligência Emocional", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Negociação", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Visão Sistêmica", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Comunicação Assertiva", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Resolução de Conflitos", type: "Soft Skill", level: "Intermediário", desired: "Avançado" }
  ],
  3: [
    { name: "Cypress", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Jest", type: "Hard Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Atenção aos Detalhes", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Proatividade", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Organização", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Comunicação Escrita", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Colaboração", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Pensamento Analítico", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Gestão do Estresse", type: "Soft Skill", level: "Intermediário", desired: "Avançado" }
  ],
  4: [
    { name: "Figma", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Research", type: "Hard Skill", level: "Avançado", desired: "Avançado" },
    { name: "Empatia", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Criatividade", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Resolução de Problemas", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Pensamento Crítico", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Facilitação", type: "Soft Skill", level: "Intermediário", desired: "Avançado" },
    { name: "Storytelling", type: "Soft Skill", level: "Avançado", desired: "Avançado" },
    { name: "Adaptabilidade", type: "Soft Skill", level: "Avançado", desired: "Avançado" }
  ],
};
const fs = require('fs');
const file = 'client/src/pages/manager-mobility.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const initialDisponiveis = [
  { id: 1, maker: "Carlos Santos", date: new Date(2024, 4, 1), reason: "Fim do projeto atual", requester: "Alexandre Líder" }
];`,
  `const initialDisponiveis = [
  { 
    id: 1, 
    maker: "Carlos Santos", 
    date: new Date(2024, 4, 1), 
    reason: "Fim do projeto atual", 
    requester: "Alexandre Líder",
    location: "São Paulo, SP - Pinheiros",
    role: "Desenvolvedor Frontend Senior",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    english: "Avançado",
    seniority: "Senior"
  },
  { 
    id: 2, 
    maker: "Ana Silva", 
    date: new Date(2024, 5, 15), 
    reason: "Redução de escopo da squad", 
    requester: "Alexandre Líder",
    location: "Campinas, SP - Cambuí",
    role: "UX/UI Designer",
    skills: ["Figma", "Design System", "User Research", "Prototyping"],
    english: "Intermediário",
    seniority: "Pleno"
  }
];`
);

content = content.replace(
  `{disponiveis.map(disp => (
                <Card key={disp.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{disp.maker}</CardTitle>
                          <CardDescription>
                            Disponível a partir de: <strong className="text-foreground">{format(disp.date, "dd/MM/yyyy")}</strong>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>`,
  `{disponiveis.map(disp => (
                <Card key={disp.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{disp.maker}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="font-normal">{disp.role}</Badge>
                            <span>•</span>
                            <span className="text-foreground">Disponível a partir de: <strong>{format(disp.date, "dd/MM/yyyy")}</strong></span>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm mt-2">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Localização</span>
                        <span className="font-medium">{disp.location}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Senioridade</span>
                        <span className="font-medium">{disp.seniority}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Inglês</span>
                        <span className="font-medium">{disp.english}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-muted-foreground">Habilidades</span>
                      <div className="flex flex-wrap gap-1.5">
                        {disp.skills && disp.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="font-normal text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>`
);

fs.writeFileSync(file, content);
console.log('updated');

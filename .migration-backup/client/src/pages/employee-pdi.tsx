import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MOCK_USERS, MOCK_SKILL_CATEGORIES, MOCK_SKILLS_DETAIL } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { Target, Users, BookOpen, GraduationCap, Calendar, UserCircle, Briefcase, Award, ArrowRight, Clock } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function EmployeePDI() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1); // Current user
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(2);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  
  // New Skill States
  const [newSkillType, setNewSkillType] = useState("Hard Skill");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDesired, setNewSkillDesired] = useState("Básico");
  const [newSkillDate, setNewSkillDate] = useState("2025-12-31");
  
  // Mock data states
  const [pdiStatus, setPdiStatus] = useState("ativo");
  const [targetRole, setTargetRole] = useState("Desenvolvedor");
  const [targetFunction, setTargetFunction] = useState("Arquitetura de Software");

  const currentUser = MOCK_USERS.find(u => u.id === selectedUserId) || MOCK_USERS[0];
  const currentMentor = MOCK_USERS.find(u => u.id === selectedMentorId);

  const [userSkills, setUserSkills] = useState(MOCK_SKILLS_DETAIL[1]);

  useEffect(() => {
    setUserSkills(MOCK_SKILLS_DETAIL[selectedUserId as keyof typeof MOCK_SKILLS_DETAIL] || MOCK_SKILLS_DETAIL[1]);
  }, [selectedUserId]);

  // In a real app, we would filter by direct reports or mentees.
  // Showing same turma + self as "allowed"
  const allowedUsersToSelect = MOCK_USERS.filter(u => u.turma === currentUser.turma || u.id === currentUser.id);
  const hasReports = allowedUsersToSelect.length > 1;

  const getLevelValue = (level: string) => {
    if (level === "Básico") return 1;
    if (level === "Intermediário") return 2;
    if (level === "Avançado") return 3;
    if (level.startsWith("Nível ")) return parseInt(level.replace("Nível ", "")) || 0;
    return 0;
  };

  const getCategoryLevels = (type: string) => {
    if (type === "Idioma") return 5;
    return 3;
  };

  const renderSkillBadge = (level: string | number, maxLevels: number = 3) => {
    let activeBars = 0;
    if (typeof level === 'number') {
      activeBars = level;
    } else {
      const levelMap: Record<string, number> = {
        "Nenhum": 0,
        "Básico": 1,
        "Intermediário": 2,
        "Avançado": 3,
      };
      if (levelMap[level] !== undefined) {
        activeBars = levelMap[level];
      } else if (String(level).startsWith("Nível ")) {
        activeBars = parseInt(String(level).replace("Nível ", ""));
      } else {
        activeBars = parseInt(String(level)) || 0;
      }
    }

    return (
      <div className="flex items-center gap-1" title={String(level)}>
        {Array.from({ length: maxLevels }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-4 rounded-full transition-colors ${i < activeBars ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plano de Desenvolvimento Individual (PDI)</h1>
          </div>
          <div className="flex items-center gap-3">
            <Select value={pdiStatus} onValueChange={setPdiStatus} disabled={pdiStatus === "aprovado"}>
              <SelectTrigger className="w-40 font-medium bg-card">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${pdiStatus === 'ativo' ? 'bg-green-500' : pdiStatus === 'aprovado' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Informações Atuais */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-2 border-primary/10 shadow-sm">
              <CardHeader className="pb-3 bg-primary/5 border-b border-primary/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    Team Member
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-md mb-4">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <div className="flex flex-col items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Início: 15/01/2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Tempo de empresa: 1 ano e 3 meses</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Habilidades Atuais</p>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 p-1.5 rounded">Hard Skills</p>
                    {userSkills
                      .filter(s => s.type === "Hard Skill")
                      .map((skill, i) => (
                      <div key={`hs-${i}`} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0 px-1">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        {renderSkillBadge(skill.level, getCategoryLevels(skill.type))}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 p-1.5 rounded">Soft Skills</p>
                    {userSkills
                      .filter(s => s.type === "Soft Skill")
                      .map((skill, i) => (
                      <div key={`ss-${i}`} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0 px-1">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        {renderSkillBadge(skill.level, getCategoryLevels(skill.type))}
                      </div>
                    ))}
                  </div>

                  {userSkills.filter(s => s.type === "Idioma").length > 0 && (
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 p-1.5 rounded">Idiomas</p>
                      {userSkills
                        .filter(s => s.type === "Idioma")
                        .map((skill, i) => (
                        <div key={`id-${i}`} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0 px-1">
                          <span className="font-medium text-foreground">{skill.name}</span>
                          {renderSkillBadge(skill.level, getCategoryLevels(skill.type))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                    Mentor do PDI
                  </CardTitle>
                  <Dialog open={isMentorModalOpen} onOpenChange={setIsMentorModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {currentMentor ? "Trocar" : "Selecionar"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Selecionar Mentor</DialogTitle>
                        <DialogDescription>Escolha quem irá apoiar o talento neste ciclo.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-2 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div 
                          onClick={() => { setSelectedMentorId(null); setIsMentorModalOpen(false); }}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:border-destructive hover:bg-destructive/5 cursor-pointer transition-colors text-destructive font-medium"
                        >
                          Remover Mentor Atual
                        </div>
                        {MOCK_USERS.filter(u => u.id !== currentUser.id).map(u => (
                          <div 
                            key={u.id} 
                            onClick={() => { setSelectedMentorId(u.id); setIsMentorModalOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${u.id === selectedMentorId ? 'bg-primary/10 border-primary' : 'hover:border-primary/50'}`}
                          >
                            <Avatar>
                              <AvatarImage src={u.avatar} />
                              <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.role} • {u.seniority}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                {currentMentor ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                        <AvatarImage src={currentMentor.avatar} />
                        <AvatarFallback>{currentMentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-base">{currentMentor.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm text-muted-foreground">{currentMentor.role}</p>
                          <Badge variant="secondary" className="font-normal text-[10px]">{currentMentor.seniority}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Especialidades do Mentor</p>
                      <div className="space-y-2">
                        {(MOCK_SKILLS_DETAIL[currentMentor.id as keyof typeof MOCK_SKILLS_DETAIL] || MOCK_SKILLS_DETAIL[2]).map((skill, i) => (
                           <div key={`mentor-skill-${i}`} className="flex items-center justify-between">
                             <span className="text-xs font-medium">{skill.name}</span>
                             {renderSkillBadge(skill.level, getCategoryLevels(skill.type))}
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                    <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Nenhum mentor definido</p>
                    <p className="text-xs mt-1">Selecione um mentor para apoiar o desenvolvimento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Meta e Lacunas */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-2 border-primary/20 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10 pl-8">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-primary" />
                  Meta de Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Status Atual */}
                  <div className="flex-1 w-full space-y-6 bg-muted/20 p-6 rounded-xl border">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="h-2 w-2 rounded-full bg-slate-400" />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Status Atual</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Cargo Atual</label>
                        <Select disabled defaultValue={currentUser.role}>
                          <SelectTrigger className="h-10 bg-muted text-muted-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={currentUser.role}>{currentUser.role}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Funções Atuais</label>
                        <Input 
                          disabled
                          value="Desenvolvimento, Manutenção" 
                          className="h-10 bg-muted text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seta Indicativa */}
                  <div className="hidden md:flex flex-col justify-center items-center h-full pt-16">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Objetivo (Desejado) */}
                  <div className="flex-1 w-full space-y-6 bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-sm relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
                    <div className="flex items-center gap-2 pb-2 border-b border-primary/10">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Objetivo (Desejado)</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground uppercase">Cargo Desejado</label>
                        <Select value={targetRole} onValueChange={setTargetRole}>
                          <SelectTrigger className="h-10 bg-background shadow-sm focus:ring-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Desenvolvedor">Desenvolvedor</SelectItem>
                            <SelectItem value="Analista de Qualidade">Analista de Qualidade</SelectItem>
                            <SelectItem value="Designer">Designer</SelectItem>
                            <SelectItem value="Líder Técnico">Líder Técnico</SelectItem>
                            <SelectItem value="Product Manager">Product Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground uppercase">Funções Desejadas</label>
                        <Input 
                          value={targetFunction} 
                          onChange={(e) => setTargetFunction(e.target.value)} 
                          className="h-10 bg-background shadow-sm"
                          placeholder="Ex: Arquitetura, Liderança de Time..." 
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-6 w-6 text-indigo-500" />
                  Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[30%]">Habilidade</TableHead>
                      <TableHead>Nível Atual</TableHead>
                      <TableHead>Nível Desejado</TableHead>
                      <TableHead className="w-[20%]">Data Alvo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableCell colSpan={4} className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-2 border-y">
                        Gráfico Geral
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {MOCK_SKILL_CATEGORIES.map(category => {
                            const categorySkills = userSkills
                              .filter(s => s.type === category.nome)
                              .map(s => ({
                                ...s,
                                numericLevel: getLevelValue(s.level)
                              }));
                              
                            if (categorySkills.length === 0) return null;

                            return (
                              <div key={category.id} className="space-y-4">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{category.nome}</h3>
                                <div className="h-[250px] w-full border rounded-md p-2">
                                  {category.tipoGrafico === "barras" ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={categorySkills} layout="vertical" margin={{ top: 20, right: 20, left: 20, bottom: 25 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis 
                                          type="number"
                                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} 
                                          axisLine={false} 
                                          tickLine={false} 
                                          tickCount={category.niveis + 1} 
                                          domain={[0, category.niveis]} 
                                        />
                                        <YAxis 
                                          dataKey="name" 
                                          type="category"
                                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} 
                                          axisLine={false} 
                                          tickLine={false} 
                                        />
                                        <Tooltip
                                          cursor={{fill: 'transparent'}}
                                          content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                              return (
                                                <div className="bg-background border rounded-md shadow-md p-2">
                                                  <p className="font-medium text-sm">{payload[0].payload.name}</p>
                                                  <p className="text-xs text-muted-foreground">Nível: {payload[0].payload.level}</p>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }}
                                        />
                                        <Bar dataKey="numericLevel" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} maxBarSize={20} />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={categorySkills}>
                                        <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
                                        <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, category.niveis]} tick={false} axisLine={false} />
                                        <Tooltip
                                          content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                              return (
                                                <div className="bg-background border rounded-md shadow-md p-2">
                                                  <p className="font-medium text-sm">{payload[0].payload.name}</p>
                                                  <p className="text-xs text-muted-foreground">Nível: {payload[0].payload.level}</p>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }}
                                        />
                                        <Radar name={category.nome} dataKey="numericLevel" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                                      </RadarChart>
                                    </ResponsiveContainer>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableCell colSpan={4} className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-2 border-y">
                        Hard Skills
                      </TableCell>
                    </TableRow>
                    {userSkills
                      .filter(s => s.type === "Hard Skill")
                      .map((skill, i) => (
                      <TableRow key={`hard-${i}`}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell>{renderSkillBadge(skill.level, getCategoryLevels(skill.type))}</TableCell>
                        <TableCell>
                          <Select defaultValue={skill.desired}>
                            <SelectTrigger className="h-9 px-2 justify-center w-max min-w-[4rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: getCategoryLevels(skill.type) }).map((_, idx) => {
                                const levelNum = idx + 1;
                                const levelStr = getCategoryLevels(skill.type) === 3 
                                  ? ["Básico", "Intermediário", "Avançado"][idx]
                                  : `Nível ${levelNum}`;

                                return (
                                  <SelectItem key={levelStr} value={levelStr} className="justify-center">
                                    {renderSkillBadge(levelNum, getCategoryLevels(skill.type))}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="date" className="h-9 text-sm" defaultValue="2025-12-31" />
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableCell colSpan={4} className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-2 mt-2 border-y">
                        Soft Skills
                      </TableCell>
                    </TableRow>
                    {userSkills
                      .filter(s => s.type === "Soft Skill")
                      .map((skill, i) => (
                      <TableRow key={`soft-${i}`}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell>{renderSkillBadge(skill.level, getCategoryLevels(skill.type))}</TableCell>
                        <TableCell>
                          <Select defaultValue={skill.desired}>
                            <SelectTrigger className="h-9 px-2 justify-center w-max min-w-[4rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: getCategoryLevels(skill.type) }).map((_, idx) => {
                                const levelNum = idx + 1;
                                const levelStr = getCategoryLevels(skill.type) === 3 
                                  ? ["Básico", "Intermediário", "Avançado"][idx]
                                  : `Nível ${levelNum}`;

                                return (
                                  <SelectItem key={levelStr} value={levelStr} className="justify-center">
                                    {renderSkillBadge(levelNum, getCategoryLevels(skill.type))}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="date" className="h-9 text-sm" defaultValue="2025-06-30" />
                        </TableCell>
                      </TableRow>
                    ))}

                    {userSkills.filter(s => s.type === "Idioma").length > 0 && (
                      <>
                        <TableRow className="bg-muted/10 hover:bg-muted/10">
                          <TableCell colSpan={4} className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-2 mt-2 border-y">
                            Idiomas
                          </TableCell>
                        </TableRow>
                        {userSkills
                          .filter(s => s.type === "Idioma")
                          .map((skill, i) => (
                          <TableRow key={`id-${i}`}>
                            <TableCell className="font-medium">{skill.name}</TableCell>
                            <TableCell>{renderSkillBadge(skill.level, getCategoryLevels(skill.type))}</TableCell>
                            <TableCell>
                              <Select defaultValue={skill.desired}>
                                <SelectTrigger className="h-9 px-2 justify-center w-max min-w-[4rem]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: getCategoryLevels(skill.type) }).map((_, idx) => {
                                    const levelNum = idx + 1;
                                    const levelStr = getCategoryLevels(skill.type) === 3 
                                      ? ["Básico", "Intermediário", "Avançado"][idx]
                                      : `Nível ${levelNum}`;

                                    return (
                                      <SelectItem key={levelStr} value={levelStr} className="justify-center">
                                        {renderSkillBadge(levelNum, getCategoryLevels(skill.type))}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input type="date" className="h-9 text-sm" defaultValue="2025-06-30" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
                <div className="p-4 border-t bg-muted/5">
                  <Dialog open={isAddSkillModalOpen} onOpenChange={setIsAddSkillModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5">
                        + Adicionar Habilidade ao PDI
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Habilidade ao PDI</DialogTitle>
                        <DialogDescription>Selecione uma habilidade para desenvolver neste ciclo de PDI.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold">Tipo de Habilidade</label>
                          <Select value={newSkillType} onValueChange={setNewSkillType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hard Skill">Hard Skill</SelectItem>
                              <SelectItem value="Soft Skill">Soft Skill</SelectItem>
                              <SelectItem value="Idioma">Idioma</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">Nome da Habilidade</label>
                          <Input placeholder="Ex: AWS, Negociação..." value={newSkillName} onChange={e => setNewSkillName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">Nível Desejado</label>
                          <Select value={newSkillDesired} onValueChange={setNewSkillDesired}>
                            <SelectTrigger className="w-max min-w-[4rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: getCategoryLevels(newSkillType) }).map((_, idx) => {
                                const levelNum = idx + 1;
                                const levelStr = getCategoryLevels(newSkillType) === 3 
                                  ? ["Básico", "Intermediário", "Avançado"][idx]
                                  : `Nível ${levelNum}`;

                                return (
                                  <SelectItem key={levelStr} value={levelStr} className="justify-center">
                                    {renderSkillBadge(levelNum, getCategoryLevels(newSkillType))}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">Data Alvo</label>
                          <Input type="date" value={newSkillDate} onChange={e => setNewSkillDate(e.target.value)} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddSkillModalOpen(false)}>Cancelar</Button>
                        <Button 
                          disabled={!newSkillName.trim()}
                          onClick={() => {
                            setUserSkills([...userSkills, { name: newSkillName, type: newSkillType, level: "Nenhum", desired: newSkillDesired }]);
                            setIsAddSkillModalOpen(false);
                            setNewSkillName("");
                          }}
                        >
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
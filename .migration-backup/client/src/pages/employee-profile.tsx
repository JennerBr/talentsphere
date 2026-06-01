import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Cake, Linkedin, Award, Briefcase, Heart, Building2, Calendar, Camera, Bike, Book, ChefHat, Gamepad2, Music, Plane, Dumbbell, Zap, Clock, ShieldAlert, Sparkles, Send, Filter, CheckCircle2, Circle, MessageSquare, Plus, EyeOff, GripHorizontal, Slack } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS, MOCK_USERS, MOCK_SKILL_CATEGORIES, MOCK_SKILLS_DETAIL, MOCK_KUDOS_TYPES } from "@/lib/mock-data";
import { MOCK_COMPANIES } from "@/lib/company-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
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
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Tooltip as TooltipRecharts
} from "recharts";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MOCK_ACTION_TYPES } from "./admin-action-types";
import { MOCK_LOG_TYPES } from "./admin-log-types";

function SortableCard({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: isDragging ? 'relative' : 'static',
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className={`relative group h-full ${isDragging ? 'ring-2 ring-primary/50 rounded-lg shadow-2xl opacity-90 bg-card' : ''}`}>
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-background/80 p-1.5 rounded-md border backdrop-blur-sm shadow-sm"
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        {children}
      </div>
    </div>
  );
}

// Mock data for manager actions
const MOCK_PAST_ACTIONS = [
  { id: 1, typeId: 1, typeName: "Dar Mérito", date: "2024-04-15", createdBy: "Gestor Atual", description: "Atingiu todas as metas do trimestre com antecedência." },
  { id: 2, typeId: 3, typeName: "Feedback positivo", date: "2024-03-10", createdBy: "Gestor Atual", description: "Comunicação excepcional durante a crise com o cliente." }
];

const MOCK_PAST_LOGBOOKS = [
  { id: 1, title: "Alinhamento de Carreira", date: "2024-04-20", daysAgo: 17, type: "Plano de Carreira", status: "ok", annotations: "Conversamos sobre os próximos passos para a promoção. Foco em melhorar a comunicação." },
  { id: 2, title: "Feedback Projeto Alpha", date: "2024-04-30", daysAgo: 7, type: "Feedback Positivo", status: "ok", annotations: "Excelente entrega no projeto Alpha. O cliente ficou muito satisfeito." },
  { id: 3, title: "Follow-up Semanal", date: "2024-05-05", daysAgo: 2, type: "Acompanhamento (Follow-up)", status: "pendente", annotations: "Verificar o status da task X. Ainda faltam alguns testes." },
];

const MOCK_DELIVERY_DATA = [
  { month: "Jan", points: 45, bugs: 2, teamAverage: 50 },
  { month: "Fev", points: 52, bugs: 1, teamAverage: 51 },
  { month: "Mar", points: 48, bugs: 3, teamAverage: 55 },
  { month: "Abr", points: 61, bugs: 0, teamAverage: 53 },
  { month: "Mai", points: 55, bugs: 2, teamAverage: 58 },
  { month: "Jun", points: 65, bugs: 1, teamAverage: 60 },
  { month: "Jul", points: 72, bugs: 2, teamAverage: 62 },
  { month: "Ago", points: 68, bugs: 1, teamAverage: 65 },
  { month: "Set", points: 75, bugs: 0, teamAverage: 68 },
  { month: "Out", points: 80, bugs: 2, teamAverage: 70 },
  { month: "Nov", points: 78, bugs: 1, teamAverage: 75 },
  { month: "Dez", points: 85, bugs: 0, teamAverage: 80 }
];

export default function EmployeeProfile() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString || window.location.search);
  const employeeId = parseInt(searchParams.get('id') || '1');
  
  const currentUser = MOCK_USERS[0];
  const user = MOCK_USERS.find(u => u.id === employeeId) || MOCK_USERS[0];

  const userSkillsDetail = MOCK_SKILLS_DETAIL[user.id as keyof typeof MOCK_SKILLS_DETAIL] || MOCK_SKILLS_DETAIL[1];

  const getLevelValue = (level: string) => {
    if (level === "Básico") return 1;
    if (level === "Intermediário") return 2;
    if (level === "Avançado") return 3;
    if (level.startsWith("Nível ")) return parseInt(level.replace("Nível ", "")) || 0;
    return 0;
  };

  const isInMyTeam = user.turma === currentUser.turma || user.project === currentUser.project;
  const [actionType, setActionType] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [showPending, setShowPending] = useState(true);
  const [showOk, setShowOk] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<string>("");
  const [logContent, setLogContent] = useState<string>("");
  const [logStatus, setLogStatus] = useState<string>("pendente");

  const [isKudosModalOpen, setIsKudosModalOpen] = useState(false);
  const [selectedKudosType, setSelectedKudosType] = useState<string>("");
  const [kudosMessage, setKudosMessage] = useState<string>("");

  const brainDominanceData = [
    { name: 'Experimental', value: 35, fill: 'var(--color-chart-1)' },
    { name: 'Analítico', value: 25, fill: 'var(--color-chart-2)' },
    { name: 'Prático', value: 15, fill: 'var(--color-chart-3)' },
    { name: 'Interpessoal', value: 25, fill: 'var(--color-chart-4)' },
  ];

  const [leftCards, setLeftCards] = useState(['info', 'skills', 'hobbies', 'dominance', 'pdi']);
  const [rightCards, setRightCards] = useState(['delivery', 'experiences', 'organizations', 'logbook', isInMyTeam ? 'actions' : null].filter(Boolean) as string[]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndLeft = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setLeftCards((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEndRight = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setRightCards((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredLogbooks = MOCK_PAST_LOGBOOKS.filter(log => {
    if (log.status === "pendente" && showPending) return true;
    if (log.status === "ok" && showOk) return true;
    return false;
  });

  const userProjects = MOCK_PROJECTS.filter(p => 
    p.team.includes(user.name.split(' ')[0]) || 
    (p.stakeholders && p.stakeholders.includes(user.id))
  );

  const getDaysToBirthday = (birthdayStr: string) => {
    const today = new Date();
    const birthDate = new Date(birthdayStr);
    
    // Set the birthday to the current year
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If the birthday has already passed this year, set it to next year
    if (nextBirthday < today && nextBirthday.toDateString() !== today.toDateString()) {
      nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getHobbyIcon = (hobby: string) => {
    const h = hobby.toLowerCase();
    if (h.includes("fotografia") || h.includes("foto")) return <Camera className="h-5 w-5" />;
    if (h.includes("ciclismo") || h.includes("bike")) return <Bike className="h-5 w-5" />;
    if (h.includes("leitura") || h.includes("livro")) return <Book className="h-5 w-5" />;
    if (h.includes("cozinhar") || h.includes("culinária") || h.includes("gastronomia")) return <ChefHat className="h-5 w-5" />;
    if (h.includes("game") || h.includes("jogo") || h.includes("videogame")) return <Gamepad2 className="h-5 w-5" />;
    if (h.includes("música") || h.includes("violão") || h.includes("cantar")) return <Music className="h-5 w-5" />;
    if (h.includes("viagem") || h.includes("viajar")) return <Plane className="h-5 w-5" />;
    if (h.includes("esporte") || h.includes("futebol") || h.includes("academia")) return <Dumbbell className="h-5 w-5" />;
    return <Heart className="h-5 w-5" />;
  };

  // In a real app, we would fetch data based on the ID. For now, use mock.
  const profile = {
    name: user.name,
    email: user.email,
    phone: "(11) 98888-8888",
    role: "Engenheiro de Software", // Cargo
    seniority: user.seniority,
    department: user.turma,
    birthday: "1990-05-15",
    linkedin: `linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '')}`,
    avatarUrl: user.avatar,
    hobbies: ["Fotografia", "Ciclismo", "Leitura de Ficção Científica", "Cozinhar"],
    functions: ["Desenvolvimento Frontend", "Mentoria", "Code Review"],
    skills: user.skills.map(s => ({ name: s, level: "Avançado" })),
    companies: [
      { 
        companyId: "1", 
        companyName: MOCK_COMPANIES[0].name, 
        companyLogo: MOCK_COMPANIES[0].logo,
        position: "Desenvolvedor Frontend",
        department: "Squad A - Varejo",
        leader: "Alexandre Líder",
        status: "Ativo"
      },
      { 
        companyId: "3", 
        companyName: MOCK_COMPANIES[2].name, 
        companyLogo: MOCK_COMPANIES[2].logo,
        position: "Consultor Técnico",
        department: "Inovação",
        leader: "Roberto Martins",
        status: "Ativo"
      }
    ],
    projects: userProjects.map(p => {
      const company = MOCK_COMPANIES.find(c => c.id === p.organizacao_id?.toString());
      return {
        id: p.id.toString(),
        name: p.name,
        companyName: company?.name || MOCK_COMPANIES[0].name,
        companyLogo: company?.logo || MOCK_COMPANIES[0].logo,
        role: p.team.includes(user.name.split(' ')[0]) ? "Membro da Equipe" : "Stakeholder",
        period: `${p.startDate?.toLocaleDateString('pt-BR')} - ${p.endDate ? p.endDate.toLocaleDateString('pt-BR') : 'Presente'}`,
        description: p.objective,
        skillsUsed: p.tools
      };
    })
  };

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil Profissional</h1>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Info Básica */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndLeft}>
            <SortableContext items={leftCards} strategy={rectSortingStrategy}>
              <div className="space-y-6">
                {leftCards.map((cardId) => (
                  <SortableCard key={cardId} id={cardId}>
                    {cardId === 'info' && (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg mb-4">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="text-4xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Dialog open={isKudosModalOpen} onOpenChange={setIsKudosModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="icon" 
                        className="absolute bottom-4 right-0 rounded-full h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white shadow-md border-2 border-background z-10"
                        title="Doar Kudos"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-xl">
                          <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-amber-500" />
                            Doar Kudos
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1.5 bg-amber-50 border-amber-200 text-amber-700 font-bold px-3 py-1">
                            <Heart className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {currentUser.availableKudos || 5} disponíveis
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Reconheça o bom trabalho de {profile.name}. Todos os reconhecimentos são anônimos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="grid grid-cols-2 gap-4">
                          {MOCK_KUDOS_TYPES.map(kudos => (
                            <div 
                              key={kudos.id}
                              onClick={() => {
                                if (selectedKudosType === kudos.id) {
                                  setSelectedKudosType("");
                                  currentUser.availableKudos = (currentUser.availableKudos || 5) + 1;
                                } else {
                                  if (selectedKudosType) {
                                    // Switch type without changing balance
                                    setSelectedKudosType(kudos.id);
                                  } else {
                                    // New selection, decrease balance
                                    if ((currentUser.availableKudos || 5) > 0) {
                                      setSelectedKudosType(kudos.id);
                                      currentUser.availableKudos = (currentUser.availableKudos || 5) - 1;
                                    }
                                  }
                                }
                              }}
                              className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${selectedKudosType === kudos.id ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 dark:bg-amber-500/10 scale-[1.02]' : 'bg-card hover:bg-muted/50 hover:border-amber-200'}`}
                            >
                              <span className="text-4xl mb-2">{kudos.icon}</span>
                              <span className="font-bold text-center text-sm">{kudos.name}</span>
                            </div>
                          ))}
                        </div>
                        {selectedKudosType && (
                          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-center italic text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
                            "{MOCK_KUDOS_TYPES.find(k => k.id === selectedKudosType)?.description}"
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          if (selectedKudosType) {
                            currentUser.availableKudos = (currentUser.availableKudos || 5) + 1;
                            setSelectedKudosType("");
                          }
                          setIsKudosModalOpen(false);
                        }}>Cancelar</Button>
                        <Button 
                          className="bg-amber-500 hover:bg-amber-600 text-white" 
                          disabled={!selectedKudosType}
                          onClick={() => {
                            setIsKudosModalOpen(false);
                            setSelectedKudosType("");
                            // Em um cenário real, aqui seria feita a requisição para salvar o Kudos
                          }}
                        >
                          Enviar Kudos
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {user.kudos && user.kudos.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 -mt-2 mb-3 z-10">
                    {MOCK_KUDOS_TYPES.map(kType => {
                      const count = user.kudos!.filter(k => k.typeId === kType.id).length;
                      if (count === 0) return null;
                      return (
                        <TooltipProvider key={kType.id}>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shadow-sm cursor-help hover:bg-amber-100 transition-colors">
                                <span className="text-lg leading-none">{kType.icon}</span>
                                <span className="font-bold text-sm text-amber-700">{count}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="font-semibold">{kType.name}</p>
                              <p className="text-xs text-muted-foreground">{count} {count === 1 ? 'recebido' : 'recebidos'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                )}

                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-primary font-medium">{profile.role}</p>
                  <Badge variant="secondary" className="font-normal">{profile.seniority}</Badge>
                </div>
                
                <div className="mt-3 mb-2 flex flex-wrap justify-center gap-1.5">
                  {profile.functions.map((f, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-muted/30">{f}</Badge>
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm mt-2">{profile.department}</p>
                
              <div className="w-full mt-6 space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Cake className="h-4 w-4 shrink-0" />
                  <div className="flex items-center gap-2">
                    <span>
                      {new Date(profile.birthday).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </span>
                    {(() => {
                      const daysToBirthday = getDaysToBirthday(profile.birthday);
                      if (daysToBirthday <= 30 && daysToBirthday >= 0) {
                        return (
                          <Badge variant="default" className="text-[10px] h-5 bg-primary text-primary-foreground ml-1">
                            {daysToBirthday === 0 ? "É hoje! 🎉" : `Faltam ${daysToBirthday} dia${daysToBirthday > 1 ? 's' : ''} 🎂`}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground pl-7 text-xs -mt-2">
                  <span>Ano: {new Date(profile.birthday).getFullYear()}</span>
                  <span>•</span>
                  <span>{(() => {
                    const today = new Date();
                    const birthDate = new Date(profile.birthday);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return `${age} anos`;
                  })()}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline font-medium">
                      {profile.email}
                    </a>
                    <div className="flex items-center gap-1 ml-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://teams.microsoft.com/l/chat/0/0?users=${profile.email}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[#464EB8] hover:bg-[#464EB8]/10 p-1.5 rounded-md transition-colors flex items-center justify-center"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 16c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm-2.5-2.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zM16 17c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z"/>
                                <path d="M8 14c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm-2.5-2.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zM8 15c-2.33 0-7 1.17-7 3.5V20h10.25c-.16-.48-.25-1-.25-1.5v-1.5c0-.53.13-1.04.34-1.5H8z" opacity="0.6"/>
                              </svg>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chamar no Teams</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`slack://user?id=${profile.email}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[#E01E5A] hover:bg-[#E01E5A]/10 p-1.5 rounded-md transition-colors flex items-center justify-center"
                            >
                              <Slack className="w-4 h-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chamar no Slack</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-green-600" />
                  <a 
                    href={`https://wa.me/55${profile.phone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Linkedin className="h-4 w-4 shrink-0 text-blue-500" />
                  <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                    {profile.linkedin.split('/').pop()}
                  </a>
                </div>
              </div>
              </CardContent>
            </Card>
                    )}

                    {cardId === 'skills' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Habilidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {MOCK_SKILL_CATEGORIES.map(category => {
                    const categorySkills = userSkillsDetail
                      .filter(s => s.type === category.nome)
                      .map(s => ({
                        ...s,
                        numericLevel: getLevelValue(s.level)
                      }));
                      
                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category.id} className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{category.nome}</h3>
                        <div className="h-[250px] w-full">
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
                              <TooltipRecharts
                                cursor={{fill: 'transparent'}}
                                content={({ active, payload }: any) => {
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
                              <TooltipRecharts
                                content={({ active, payload }: any) => {
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
              </CardContent>
            </Card>
                    )}

                    {cardId === 'hobbies' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Hobbies & Interesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.hobbies.map((hobby, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="p-3 bg-rose-500/10 text-rose-600 rounded-full hover:bg-rose-500/20 transition-colors cursor-help border border-rose-500/20 shadow-sm">
                          {getHobbyIcon(hobby)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{hobby}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
                    )}

                    {cardId === 'dominance' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Dominância Cerebral
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brainDominanceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="currentColor" className="fill-primary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
                    )}

                    {cardId === 'pdi' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-500" />
                  PDI - Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">Comunicação Assertiva</span>
                      <span className="text-muted-foreground">75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">Liderança Técnica</span>
                      <span className="text-muted-foreground">40%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => setLocation(`/employee-pdi?id=${user.id}`)}>
                    Ver PDI Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
                    )}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Coluna Direita: Experiências, Organizações, Logbook */}
          <div className="md:col-span-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndRight}>
              <SortableContext items={rightCards} strategy={rectSortingStrategy}>
                <div className="space-y-6">
                  {rightCards.map((cardId) => (
                    <SortableCard key={cardId} id={cardId}>
                      {cardId === 'delivery' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Entregas (Story Points)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DELIVERY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      />
                      <TooltipRecharts
                        content={({ active, payload, label }: any) => {
                          if (active && payload && payload.length) {
                            const userPoints = payload.find((p: any) => p.dataKey === 'points');
                            const teamAvg = payload.find((p: any) => p.dataKey === 'teamAverage');
                            const bugs = userPoints?.payload?.bugs;

                            return (
                              <div className="bg-background border rounded-md shadow-md p-3 min-w-[200px]">
                                <p className="font-semibold mb-2">{label}</p>
                                <div className="space-y-2">
                                  {userPoints && (
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-sm font-medium">Colaborador</span>
                                      </div>
                                      <span className="text-sm font-bold text-primary">{userPoints.value} pts</span>
                                    </div>
                                  )}
                                  {teamAvg && (
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Média do Time</span>
                                      </div>
                                      <span className="text-sm font-bold text-muted-foreground">{teamAvg.value} pts</span>
                                    </div>
                                  )}
                                  {bugs !== undefined && (
                                    <p className="text-xs text-red-500 font-medium pt-2 border-t mt-1">
                                      Bugs reportados: {bugs}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="teamAverage" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fillOpacity={0} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="points" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPoints)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
                      )}

                      {cardId === 'experiences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Experiências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {profile.projects.map((project, index) => (
                    <div key={project.id} className="relative">
                      <div className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {project.companyLogo && (
                              <div className="h-6 w-6 rounded overflow-hidden border shrink-0">
                                <img src={project.companyLogo} alt={project.companyName} className="h-full w-full object-cover" />
                              </div>
                            )}
                            <h3 className="text-lg font-bold text-foreground">
                              {project.name}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1 sm:mt-0 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {project.period}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-medium">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{project.companyName}</span>
                        </div>
                        
                        <p className="font-medium text-primary mb-3">{project.role}</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Habilidades Aplicadas</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.skillsUsed.map((skill, sIdx) => (
                              <Badge key={sIdx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                    )}

                    {cardId === 'organizations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-6 w-6 text-primary" />
                  Organizações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader className="hidden md:table-header-group">
                      <TableRow>
                        <TableHead className="w-[60px]"></TableHead>
                        <TableHead>Posição / Cargo</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Líder</TableHead>
                        <TableHead className="text-right">Anos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="block md:table-row-group">
                      {profile.companies.map((company, index) => (
                        <TableRow key={index} className="flex flex-wrap md:table-row border-b last:border-b-0">
                          <TableCell className="w-[80px] md:w-[60px] flex justify-center pt-4 md:table-cell">
                            <TooltipProvider>
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center">
                                    {company.companyLogo ? (
                                      <div className="h-10 w-10 md:h-8 md:w-8 rounded overflow-hidden border cursor-help shadow-sm">
                                        <img src={company.companyLogo} alt={company.companyName} className="h-full w-full object-cover" />
                                      </div>
                                    ) : (
                                      <div className="h-10 w-10 md:h-8 md:w-8 rounded bg-muted flex items-center justify-center border cursor-help shadow-sm">
                                        <Building2 className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>{company.companyName}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="w-[calc(100%-80px)] md:w-auto md:table-cell pb-2 pt-4 md:py-4">
                            <div className="md:hidden text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Posição / Cargo</div>
                            <div className="font-medium text-base md:text-sm text-foreground">{company.position}</div>
                          </TableCell>
                          <TableCell className="w-[calc(100%-80px)] ml-[80px] md:ml-0 md:w-auto md:table-cell py-2 md:py-4 md:pl-4">
                            <div className="md:hidden text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Departamento</div>
                            <div className="text-sm text-foreground/90">{company.department}</div>
                          </TableCell>
                          <TableCell className="w-[calc(50%-40px)] ml-[80px] md:ml-0 md:w-auto md:table-cell py-2 pb-4 md:py-4 md:pl-4">
                            <div className="md:hidden text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Líder</div>
                            <div className="text-sm text-foreground/90">{company.leader}</div>
                          </TableCell>
                          <TableCell className="w-[calc(50%-40px)] md:w-auto md:table-cell py-2 pb-4 md:py-4 pr-4 md:text-right flex flex-col items-end md:items-stretch justify-start md:justify-center">
                            <div className="md:hidden text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold text-right">Anos</div>
                            <span className="text-sm font-semibold whitespace-nowrap bg-muted/60 text-foreground px-2.5 py-1 rounded-md">{index === 0 ? "2+" : "0+"}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
                    )}
            
                    {cardId === 'logbook' && (
            <>
            {/* Histórico de Logbook */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Logbook
                  </CardTitle>
                </div>
                <div className="flex items-center gap-6 bg-muted/50 px-4 py-2 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-pending" 
                      checked={showPending} 
                      onCheckedChange={(checked) => setShowPending(checked === true)} 
                    />
                    <Label htmlFor="filter-pending" className="text-sm font-medium cursor-pointer mb-0">Pendentes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-ok" 
                      checked={showOk} 
                      onCheckedChange={(checked) => setShowOk(checked === true)} 
                    />
                    <Label htmlFor="filter-ok" className="text-sm font-medium cursor-pointer mb-0">Concluídos</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                    {filteredLogbooks.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-start sm:items-center gap-4 w-full">
                          {log.status === "ok" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-amber-500 shrink-0" />
                          )}
                          <div className="w-full">
                            <div className="flex items-center justify-between gap-2 mb-1 w-full">
                              <p className="font-medium">{log.title}</p>
                              <Badge variant="outline" className="text-[10px] font-normal shrink-0">
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground/80 mb-2">{log.annotations}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                              <span>•</span>
                              <span>Há {log.daysAgo} dias</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {filteredLogbooks.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed bg-muted/20">
                      Nenhum log encontrado com este status.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            </>
                    )}

                    {cardId === 'actions' && isInMyTeam && (
            <>
            {/* Manager Only Actions Area */}
              <Card className="border-amber-900/50 bg-[#2D1A00]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    Histórico de Ações
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center cursor-help">
                          <EyeOff className="h-4 w-4 text-amber-500/70" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Somente o gestor pode ver esse card</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_PAST_ACTIONS.map(action => {
                      const typeInfo = MOCK_ACTION_TYPES.find(t => t.id === action.typeId) || MOCK_ACTION_TYPES[0];
                      return (
                        <div key={action.id} className="p-4 rounded-lg border border-amber-200/50 bg-card shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded flex items-center justify-center ${typeInfo.cor}`}>
                                {typeInfo.icone}
                              </div>
                              <span className="font-semibold">{action.typeName}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground font-medium gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(action.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          <p className="text-xs text-muted-foreground font-medium">Registrado por: {action.createdBy}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
                    )}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Floating Action Buttons for Manager */}
        {isInMyTeam && (
          <div className="fixed bottom-8 right-8 flex items-end gap-4 z-50">
            <Button 
              size="lg" 
              onClick={() => setIsLogModalOpen(true)}
              className="h-14 px-6 rounded-full shadow-xl shadow-primary/20 gap-2 text-base font-semibold"
            >
              <Plus className="h-5 w-5" />
              Logbook
            </Button>

            <div className="flex flex-col items-end gap-3">
              {isFabOpen && (
                <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
                  {MOCK_ACTION_TYPES.map(type => (
                    <Button 
                      key={type.id}
                      onClick={() => { 
                        setActionType(type.id.toString()); 
                        setIsActionModalOpen(true); 
                        setIsFabOpen(false); 
                      }}
                      className="bg-muted text-foreground hover:bg-muted-foreground/20 shadow-md border border-border rounded-full px-4 py-2 h-auto flex items-center gap-3 justify-end"
                    >
                      <span className="font-medium">{type.nome}</span>
                      <div className={`p-1.5 rounded-full flex items-center justify-center h-8 w-8 ${type.cor}`}>
                        {type.icone}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              <Button 
                size="lg" 
                onClick={() => setIsFabOpen(!isFabOpen)}
                className="h-14 px-6 rounded-full shadow-xl shadow-primary/20 gap-2 text-base font-semibold"
              >
                {isFabOpen ? <Plus className="h-5 w-5 rotate-45 transition-transform" /> : <Zap className="h-5 w-5" />}
                {isFabOpen ? "Fechar" : "Nova Ação"}
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Ação</DialogTitle>
              <DialogDescription>
                Registre uma ação de gestão para o perfil de {profile.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Tipo de Ação</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de ação..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ACTION_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center justify-center h-5 w-5 rounded ${type.cor}`}>
                            {type.icone}
                          </span>
                          {type.nome}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Descrição / Motivo</Label>
                <Textarea 
                  autoFocus
                  placeholder="Descreva o motivo desta ação, detalhes importantes, próximos passos..." 
                  className="min-h-[120px]"
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Clock className="h-4 w-4" />
                Hoje, {new Date().toLocaleDateString('pt-BR')}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancelar</Button>
                <Button disabled={!actionType || !actionDescription.trim()} onClick={() => setIsActionModalOpen(false)}>
                  Salvar Ação
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Registro de Logbook</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Anotações</Label>
                <Textarea 
                  placeholder="Escreva aqui os principais pontos discutidos, acordos e próximos passos..." 
                  className="min-h-[150px] resize-y text-base"
                  value={logContent}
                  onChange={(e) => setLogContent(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Status da Ação</Label>
                <RadioGroup 
                  value={logStatus} 
                  onValueChange={setLogStatus} 
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pendente" id="r-pendente" />
                    <Label htmlFor="r-pendente" className="font-normal cursor-pointer">Pendente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ok" id="r-ok" />
                    <Label htmlFor="r-ok" className="font-normal cursor-pointer">Concluído</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border border-dashed">
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Título (Gerado por IA)
                  </Label>
                  <Input 
                    placeholder="Será gerado após salvar..." 
                    className="bg-background/50 italic text-muted-foreground"
                    readOnly
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    Tipo de Log
                  </Label>
                  <Select value={logType} onValueChange={setLogType}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_LOG_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new" className="text-primary font-medium focus:text-primary">
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar novo tipo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {logType === 'new' && (
                    <Input 
                      placeholder="Nome do novo tipo de log" 
                      className="mt-2"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <Button disabled={!logContent.trim()} className="gap-2" onClick={() => setIsLogModalOpen(false)}>
                <Send className="h-4 w-4" />
                Salvar Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

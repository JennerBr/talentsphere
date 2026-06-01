import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Cake, Linkedin, Award, Briefcase, Heart, Building2, Calendar, Camera, Bike, Book, BookOpen, ChefHat, Gamepad2, Music, Plane, Dumbbell, Zap, Clock, ShieldAlert, Sparkles, Send, Filter, CheckCircle2, Circle, MessageSquare, Plus, EyeOff, GripHorizontal, Slack, Github, Youtube, Twitter, Facebook, Link2, X, Trash2, Settings, Code2, Coffee, Flower2, Dog, Fish, Mountain, Globe, Mic, Film, Trophy, Leaf, Waves, Car, Tv, Headphones, Swords, Brush, PawPrint, Palette, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { useMembers, useProjects, useTeams, useSkillCategories, useMemberSkills, useSkills, useUpdateMemberSkills, useKudosTypes, useMemberKudos, useActionTypes, useLogTypes, useCurrentMember, useMemberHobbies, useMemberFunctions, useHobbies, useHobbyCategories, useFunctions, useUpdateMember, useUpdateMemberHobbies, useUpdateMemberFunctions, useMemberLinks, useAddMemberLink, useDeleteMemberLink, useReorderMemberLinks, useUploadMemberAvatar, type ApiMemberLink } from "@/lib/use-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useRef } from "react";
import { SkillIcon } from "@/lib/skill-icon";
import { AvatarCropModal } from "@/components/avatar-crop-modal";
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
import { ThumbsUp, ThumbsDown, Shuffle, Star as StarIcon } from "lucide-react";

function SortableCard({ id, children, className, onEdit, isEditing }: { id: string, children: React.ReactNode, className?: string, onEdit?: () => void, isEditing?: boolean }) {
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
      <div className={`relative group h-full rounded-lg ${isDragging ? 'ring-2 ring-primary/50 shadow-2xl opacity-90 bg-card' : ''} ${isEditing ? 'ring-2 ring-primary shadow-md' : ''}`}>
        {isEditing && (
          <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-t-lg z-20">
            <Settings className="h-3 w-3" />
            Editando...
          </div>
        )}
        <div 
          {...attributes} 
          {...listeners} 
          className={`absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-background/80 p-1.5 rounded-md border backdrop-blur-sm shadow-sm ${isEditing ? 'top-8 right-4' : 'top-4 right-4'}`}
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        {onEdit && !isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1.5 rounded-md border backdrop-blur-sm shadow-sm hover:bg-background"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function SortableLinkItem({ link, meta, canEdit, onDelete }: {
  link: ApiMemberLink;
  meta: { label: string; color: string; icon: React.ReactNode };
  canEdit: boolean;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className="relative flex flex-col items-center gap-1 group">
      {canEdit && (
        <div {...attributes} {...listeners} className="absolute -top-1 -left-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background rounded-full p-0.5 shadow-sm">
          <GripHorizontal className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted shrink-0 hover:opacity-80 transition-opacity" style={{ color: meta.color }}>
          {meta.icon}
        </div>
        <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[48px] truncate">{meta.label}</span>
      </a>
      {canEdit && (
        <button
          onClick={onDelete}
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full bg-background shadow-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
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

function isManagerRole(role: string | null | undefined): boolean {
  return !!(role && /manager|diretor|director|admin/i.test(role));
}

export default function MemberProfile() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { data: currentEmployee, isLoading: isAuthLoading, isError: isAuthError } = useCurrentMember();

  const currentUserIsManager = isManagerRole(currentEmployee?.role);
  const queryId = new URLSearchParams(search).get("id");
  const requestedId = queryId ? Number(queryId) : null;
  const employeeId = currentUserIsManager && requestedId
    ? requestedId
    : (currentEmployee?.id ?? 0);

  const { data: employees = [] } = useMembers();
  const { data: projects = [] } = useProjects();
  const { data: teams = [] } = useTeams();
  const { data: skillCategories = [] } = useSkillCategories();
  const { data: userSkillsDetail = [] } = useMemberSkills(employeeId);
  const { data: allSkills = [] } = useSkills();
  const { data: kudosTypes = [] } = useKudosTypes();
  const { data: userKudosList = [] } = useMemberKudos(employeeId);
  const { data: actionTypesData = [] } = useActionTypes();
  const { data: logTypesData = [] } = useLogTypes();
  const { data: memberHobbiesList = [] } = useMemberHobbies(employeeId);
  const { data: memberFunctionsList = [] } = useMemberFunctions(employeeId);
  const { data: allHobbies = [] } = useHobbies();
  const { data: hobbyCategories = [] } = useHobbyCategories();
  const { data: allFunctions = [] } = useFunctions();
  const updateMemberMutation = useUpdateMember();
  const updateHobbiesMutation = useUpdateMemberHobbies(employeeId);
  const updateFunctionsMutation = useUpdateMemberFunctions(employeeId);
  const updateMemberSkillsMutation = useUpdateMemberSkills(employeeId);
  const { data: memberLinksList = [] } = useMemberLinks(employeeId);
  const addLinkMutation = useAddMemberLink(employeeId);
  const deleteLinkMutation = useDeleteMemberLink(employeeId);
  const reorderLinksMutation = useReorderMemberLinks(employeeId);
  const uploadAvatarMutation = useUploadMemberAvatar(employeeId);

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSeniority, setEditSeniority] = useState("");
  const [editTurma, setEditTurma] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editTeamsUrl, setEditTeamsUrl] = useState("");
  const [editSlackUrl, setEditSlackUrl] = useState("");
  const [editWebexUrl, setEditWebexUrl] = useState("");
  const [editHobbyIds, setEditHobbyIds] = useState<number[]>([]);
  const [editCustomHobbyNames, setEditCustomHobbyNames] = useState<string[]>([]);
  const [editFunctionIds, setEditFunctionIds] = useState<number[]>([]);
  const [editSkillNames, setEditSkillNames] = useState<string[]>([]);
  const [editCustomSkillInput, setEditCustomSkillInput] = useState("");
  const [editCustomHobbyInput, setEditCustomHobbyInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [availableKudos, setAvailableKudos] = useState(5);
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
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkDragItems, setLinkDragItems] = useState<number[]>([]);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [leftCards, setLeftCards] = useState(['info', 'skills', 'hobbies', 'dominance', 'pdi']);
  const [rightCards, setRightCards] = useState<string[]>(['links', 'delivery', 'experiences', 'teams', 'logbook', 'actions']);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Carregando perfil...</div>
      </div>
    );
  }

  if (isAuthError || !currentEmployee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Conta não vinculada</p>
          <p className="text-muted-foreground text-sm">Seu login não está associado a nenhum registro de membro. Contate o administrador.</p>
        </div>
      </div>
    );
  }

  const isViewingOtherProfile = requestedId !== null && requestedId !== currentEmployee.id;
  if (!currentUserIsManager && isViewingOtherProfile) {
    return (
      <AppLayout role="employee" userName={currentEmployee.name} userTitle={currentEmployee.role ?? ""}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto px-4">
          <div className="rounded-full bg-muted p-5">
            <ShieldAlert className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Acesso restrito</h2>
            <p className="text-muted-foreground">
              Apenas gestores podem visualizar o perfil de outros membros. Você só tem acesso ao seu próprio perfil.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setLocation("/profile")}>
              Ver meu perfil
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Ir para o início
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const ACTION_ICON_MAP: Record<string, React.ReactNode> = {
    "Dar Mérito": <StarIcon className="h-4 w-4" />,
    "Colocar a disposição": <Shuffle className="h-4 w-4" />,
    "Feedback positivo": <ThumbsUp className="h-4 w-4" />,
    "Feedback negativo": <ThumbsDown className="h-4 w-4" />,
  };
  const ACTION_COR_MAP: Record<string, string> = {
    yellow: "text-yellow-600 bg-yellow-100",
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
  };

  const currentUser = employees[0];
  const user = employees.find(u => u.id === employeeId) ?? employees[0];

  const getLevelValue = (level: string) => {
    if (level === "Básico") return 1;
    if (level === "Intermediário") return 2;
    if (level === "Avançado") return 3;
    if (level.startsWith("Nível ")) return parseInt(level.replace("Nível ", "")) || 0;
    return 0;
  };

  const isInMyTeam = !!currentUser && !!user && (user.turma === currentUser.turma || user.project === currentUser.project);

  const brainDominanceData = [
    { name: 'Experimental', value: 35, fill: 'var(--color-chart-1)' },
    { name: 'Analítico', value: 25, fill: 'var(--color-chart-2)' },
    { name: 'Prático', value: 15, fill: 'var(--color-chart-3)' },
    { name: 'Interpessoal', value: 25, fill: 'var(--color-chart-4)' },
  ];

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

  const userProjects = user ? projects.filter(p =>
    (p.team ?? "").includes(user.name.split(' ')[0]) ||
    (p.stakeholders && p.stakeholders.includes(user.id))
  ) : [];

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

  const HOBBY_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries([
    ["Heart", Heart], ["Camera", Camera], ["Bike", Bike], ["BookOpen", BookOpen],
    ["ChefHat", ChefHat], ["Gamepad2", Gamepad2], ["Music", Music], ["Plane", Plane],
    ["Dumbbell", Dumbbell], ["Code2", Code2], ["Coffee", Coffee], ["Flower2", Flower2],
    ["Dog", Dog], ["Fish", Fish], ["Mountain", Mountain], ["Globe", Globe],
    ["Mic", Mic], ["Film", Film], ["Trophy", Trophy], ["Leaf", Leaf],
    ["Waves", Waves], ["Car", Car], ["Tv", Tv], ["Star", StarIcon],
    ["Headphones", Headphones], ["Swords", Swords], ["Brush", Brush],
    ["PawPrint", PawPrint], ["Palette", Palette],
  ]);

  const renderHobbyIcon = (iconName?: string | null) => {
    const Icon: LucideIcon = (iconName && HOBBY_ICON_MAP[iconName]) ? HOBBY_ICON_MAP[iconName] : Heart;
    return <Icon className="h-4 w-4" />;
  };

  if (!user) {
    return (
      <AppLayout role="employee" userName="" userTitle="">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </AppLayout>
    );
  }

  const canEdit = !!currentEmployee && (
    currentEmployee.id === employeeId ||
    (currentUserIsManager && !!employees.find(e => e.id === employeeId))
  );

  const handleStartEdit = (cardId: string) => {
    setEditFullName(user.fullName ?? "");
    setEditEmail(user.email ?? "");
    setEditRole(user.role ?? "");
    setEditSeniority(user.seniority ?? "");
    setEditTurma(user.turma ?? "");
    setEditBirthday(user.birthday ?? "");
    setEditPhone(user.phone ?? "");
    setEditLinkedin(user.linkedin ?? "");
    setEditTeamsUrl(user.teamsUrl ?? "");
    setEditSlackUrl(user.slackUrl ?? "");
    setEditWebexUrl(user.webexUrl ?? "");
    setEditHobbyIds(memberHobbiesList.filter(h => h.id !== null).map(h => h.id as number));
    setEditCustomHobbyNames(memberHobbiesList.filter(h => h.customName != null).map(h => h.customName as string));
    setEditFunctionIds(memberFunctionsList.map(f => f.id));
    setEditSkillNames(userSkillsDetail.map(s => s.name));
    setEditCustomSkillInput("");
    setEditCustomHobbyInput("");
    setEditingCardId(cardId);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMemberMutation.mutateAsync({
        id: employeeId,
        fullName: editFullName || null,
        email: editEmail || undefined,
        ...(currentUserIsManager ? { role: editRole || undefined } : {}),
        seniority: editSeniority || undefined,
        turma: editTurma || undefined,
        birthday: editBirthday || undefined,
        phone: editPhone || undefined,
        linkedin: editLinkedin || undefined,
        teamsUrl: editTeamsUrl || null,
        slackUrl: editSlackUrl || null,
        webexUrl: editWebexUrl || null,
      });
      setEditingCardId(null);
    } catch {
      // errors surfaced via mutation state if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHobbies = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateHobbiesMutation.mutateAsync({ ids: editHobbyIds, customNames: editCustomHobbyNames }),
        updateFunctionsMutation.mutateAsync(editFunctionIds),
      ]);
      setEditingCardId(null);
    } catch {
      // errors surfaced via mutation state if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSkills = async () => {
    setIsSaving(true);
    try {
      await updateMemberSkillsMutation.mutateAsync(
        editSkillNames.map(name => {
          const catalogSkill = allSkills.find(s => s.name === name);
          const catName = catalogSkill?.categoryId != null
            ? skillCategories.find(c => c.id === catalogSkill.categoryId)?.nome ?? null
            : (userSkillsDetail.find(s => s.name === name)?.type ?? null);
          return { name, type: catName };
        })
      );
      setEditingCardId(null);
    } catch {
      // errors surfaced via mutation state if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomSkill = () => {
    const name = editCustomSkillInput.trim();
    if (!name) return;
    if (!editSkillNames.includes(name)) {
      setEditSkillNames(prev => [...prev, name]);
    }
    setEditCustomSkillInput("");
  };

  const handleAddCustomHobby = () => {
    const name = editCustomHobbyInput.trim();
    if (!name) return;
    if (!editCustomHobbyNames.includes(name)) {
      setEditCustomHobbyNames(prev => [...prev, name]);
    }
    setEditCustomHobbyInput("");
  };

  const toggleSkill = (name: string) => {
    setEditSkillNames(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleHobby = (id: number) => {
    setEditHobbyIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleFunction = (id: number) => {
    setEditFunctionIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const profile = {
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    seniority: user.seniority,
    department: user.turma,
    birthday: user.birthday,
    linkedin: user.linkedin,
    teamsUrl: user.teamsUrl,
    slackUrl: user.slackUrl,
    webexUrl: user.webexUrl,
    avatarUrl: user.avatar,
    hobbies: memberHobbiesList,
    functions: memberFunctionsList,
    skills: userSkillsDetail.map(s => ({ name: s.name, level: s.level })),
    companies: [
      { 
        companyId: "1", 
        companyName: teams[0]?.name ?? "Empresa",
        companyLogo: teams[0]?.logo ?? "",
        position: "Desenvolvedor Frontend",
        department: "Squad A - Varejo",
        leader: "Alexandre Líder",
        status: "Ativo"
      },
      { 
        companyId: "3", 
        companyName: teams[2]?.name ?? "Empresa",
        companyLogo: teams[2]?.logo ?? "",
        position: "Consultor Técnico",
        department: "Inovação",
        leader: "Roberto Martins",
        status: "Ativo"
      }
    ],
    projects: userProjects.map(p => {
      const company = teams.find(o => o.id === p.organizacaoId);
      return {
        id: p.id.toString(),
        name: p.name,
        companyName: company?.name ?? teams[0]?.name ?? "Empresa",
        companyLogo: company?.logo ?? teams[0]?.logo ?? "",
        role: (p.team ?? "").includes(user?.name.split(' ')[0] ?? "") ? "Membro da Equipe" : "Stakeholder",
        period: `${p.startDate ? new Date(p.startDate).toLocaleDateString('pt-BR') : '-'} - ${p.endDate ? new Date(p.endDate).toLocaleDateString('pt-BR') : 'Presente'}`,
        description: p.objective,
        skillsUsed: p.tools
      };
    })
  };

  return (
    <AppLayout role="employee" userName={currentEmployee.name} userTitle={currentEmployee.role ?? ""}>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <div>
          {canEdit && editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                className="text-2xl font-bold h-10 max-w-sm"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    updateMemberMutation.mutate({ id: employeeId, name: titleDraft || undefined });
                    setEditingTitle(false);
                  } else if (e.key === 'Escape') {
                    setEditingTitle(false);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  updateMemberMutation.mutate({ id: employeeId, name: titleDraft || undefined });
                  setEditingTitle(false);
                }}
              >
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingTitle(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <h1
              className={`text-3xl font-bold tracking-tight ${canEdit ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
              onClick={() => {
                if (canEdit) {
                  setTitleDraft(profile.name);
                  setEditingTitle(true);
                }
              }}
              title={canEdit ? 'Clique para editar o nome' : undefined}
            >
              {profile.name}
            </h1>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Info Básica */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndLeft}>
            <SortableContext items={leftCards} strategy={rectSortingStrategy}>
              <div className="space-y-6">
                {leftCards.map((cardId) => (
                  <SortableCard key={cardId} id={cardId} onEdit={canEdit && ['info', 'links', 'hobbies', 'skills'].includes(cardId) ? () => handleStartEdit(cardId) : undefined} isEditing={editingCardId === cardId}>
                    {cardId === 'info' && (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`relative group/avatar mb-4 ${canEdit ? 'cursor-pointer' : ''}`}
                    onClick={() => canEdit && !uploadAvatarMutation.isPending && avatarFileInputRef.current?.click()}
                  >
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage src={profile.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-4xl">
                        {uploadAvatarMutation.isPending
                          ? <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          : profile.name.substring(0, 2).toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                    {uploadAvatarMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                        <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {canEdit && !uploadAvatarMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAvatarUploadError(null);
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                          setCropImageSrc(reader.result as string);
                        });
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  {avatarUploadError && (
                    <p className="text-xs text-destructive text-center mb-2 -mt-2 max-w-[150px]">{avatarUploadError}</p>
                  )}
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
                            {availableKudos} disponíveis
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Reconheça o bom trabalho de {profile.name}. Todos os reconhecimentos são anônimos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="grid grid-cols-2 gap-4">
                          {kudosTypes.map(kudos => (
                            <div 
                              key={kudos.id}
                              onClick={() => {
                                if (selectedKudosType === kudos.id) {
                                  setSelectedKudosType("");
                                  setAvailableKudos(prev => prev + 1);
                                } else {
                                  if (selectedKudosType) {
                                    setSelectedKudosType(kudos.id);
                                  } else {
                                    if (availableKudos > 0) {
                                      setSelectedKudosType(kudos.id);
                                      setAvailableKudos(prev => prev - 1);
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
                            "{kudosTypes.find(k => k.id === selectedKudosType)?.description}"
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          if (selectedKudosType) {
                            setAvailableKudos(prev => prev + 1);
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
                
                {userKudosList.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 -mt-2 mb-3 z-10">
                    {kudosTypes.map(kType => {
                      const count = userKudosList.filter(k => k.typeId === kType.id).length;
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

                {editingCardId === 'info' ? (
                  <div className="w-full space-y-3 text-left">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Nome completo</Label>
                      <Input value={editFullName} onChange={e => setEditFullName(e.target.value)} placeholder="Ex: João da Silva Souza" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">E-mail</Label>
                      <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="nome@empresa.com" className="h-8 text-sm" />
                    </div>
                    {currentUserIsManager && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Cargo (somente gestores)</Label>
                        <Input value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="Ex: Engenheiro de Software" className="h-8 text-sm" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Senioridade</Label>
                      <Input value={editSeniority} onChange={e => setEditSeniority(e.target.value)} placeholder="Ex: Pleno, Sênior" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Turma / Departamento</Label>
                      <Input value={editTurma} onChange={e => setEditTurma(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Aniversário</Label>
                      <Input type="date" value={editBirthday} onChange={e => setEditBirthday(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Telefone / WhatsApp</Label>
                      <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="(11) 99999-9999" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">LinkedIn (somente o handle, ex: joao-silva)</Label>
                      <Input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="joao-silva" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Teams (URL completa)</Label>
                      <Input value={editTeamsUrl} onChange={e => setEditTeamsUrl(e.target.value)} placeholder="https://teams.microsoft.com/..." className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Slack (URL completa)</Label>
                      <Input value={editSlackUrl} onChange={e => setEditSlackUrl(e.target.value)} placeholder="https://app.slack.com/..." className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Webex (URL completa)</Label>
                      <Input value={editWebexUrl} onChange={e => setEditWebexUrl(e.target.value)} placeholder="https://webex.com/..." className="h-8 text-sm" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleSave} disabled={isSaving} className="flex-1">
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSaving} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                {profile.fullName && (
                  <p className="text-sm text-muted-foreground mt-0.5">{profile.fullName}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-1">
                  {profile.role && <p className="text-primary font-medium">{profile.role}</p>}
                  {profile.seniority && <Badge variant="secondary" className="font-normal">{profile.seniority}</Badge>}
                </div>
                
                {profile.functions.length > 0 && (
                  <div className="mt-3 mb-2 flex flex-wrap justify-center gap-1.5">
                    {profile.functions.map((f) => (
                      <Badge key={f.id} variant="outline" className="text-xs bg-muted/30">{f.name}</Badge>
                    ))}
                  </div>
                )}
                
                {profile.department && <p className="text-muted-foreground text-sm mt-2">{profile.department}</p>}
                
              <div className="w-full mt-6 space-y-3 text-sm text-left">
                {profile.birthday && (
                  <>
                  <div className="flex items-center gap-3 text-muted-foreground">
                  <Cake className="h-4 w-4 shrink-0" />
                  <div className="flex items-center gap-2">
                    <span>
                      {new Date(profile.birthday).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </span>
                    {(() => {
                      const daysToBirthday = getDaysToBirthday(profile.birthday!);
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
                    const birthDate = new Date(profile.birthday!);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return `${age} anos`;
                  })()}</span>
                </div>
                  </>
                )}
                {profile.email && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline font-medium">
                      {profile.email}
                    </a>
                  </div>
                </div>
                )}
                {profile.phone && (
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
                )}
                {(profile.linkedin || profile.teamsUrl || profile.slackUrl || profile.webexUrl) && (
                <div className="flex flex-wrap gap-2">
                  {profile.linkedin && (
                    <a
                      href={`https://www.linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted shrink-0 hover:opacity-80 transition-opacity" style={{ color: '#0A66C2' }}>
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[48px] truncate">LinkedIn</span>
                    </a>
                  )}
                  {profile.teamsUrl && (
                    <a
                      href={profile.teamsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted shrink-0 hover:opacity-80 transition-opacity" style={{ color: '#464EB8' }}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 16c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm-2.5-2.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zM16 17c-2.33 0-7 1.17-7 3.5V22h14v-1.5c0-2.33-4.67-3.5-7-3.5z"/>
                          <path d="M8 14c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm-2.5-2.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zM8 15c-2.33 0-7 1.17-7 3.5V20h10.25c-.16-.48-.25-1-.25-1.5v-1.5c0-.53.13-1.04.34-1.5H8z" opacity="0.6"/>
                        </svg>
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[48px] truncate">Teams</span>
                    </a>
                  )}
                  {profile.slackUrl && (
                    <a
                      href={profile.slackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted shrink-0 hover:opacity-80 transition-opacity" style={{ color: '#E01E5A' }}>
                        <Slack className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[48px] truncate">Slack</span>
                    </a>
                  )}
                  {profile.webexUrl && (
                    <a
                      href={profile.webexUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted shrink-0 hover:opacity-80 transition-opacity" style={{ color: '#00BCF2' }}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[48px] truncate">Webex</span>
                    </a>
                  )}
                </div>
                )}
              </div>
                  </>
                )}
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
                {editingCardId === 'skills' ? (
                  <div className="space-y-3">
                    {allSkills.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma habilidade no catálogo. Acesse o painel admin para cadastrar habilidades.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const catGroups = skillCategories.map(cat => ({
                            id: cat.id,
                            name: cat.nome,
                            skills: allSkills.filter(s => s.categoryId === cat.id),
                          })).filter(g => g.skills.length > 0);
                          const uncategorized = allSkills.filter(s => s.categoryId === null || !skillCategories.some(c => c.id === s.categoryId));
                          if (uncategorized.length > 0) catGroups.push({ id: -1, name: "Outros", skills: uncategorized });
                          return catGroups.map(group => (
                            <div key={group.id} className="space-y-1">
                              <Label className="text-xs text-muted-foreground">{group.name}</Label>
                              <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/20">
                                {group.skills.map(s => (
                                  <Badge
                                    key={s.id}
                                    variant={editSkillNames.includes(s.name) ? "default" : "outline"}
                                    className="cursor-pointer text-xs gap-1 items-center"
                                    onClick={() => toggleSkill(s.name)}
                                  >
                                    <SkillIcon name={s.name} fallback={s.icon || "⚙️"} size={12} />
                                    {s.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                        {editSkillNames.filter(n => !allSkills.some(s => s.name === n)).length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Adicionadas manualmente</Label>
                            <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/20">
                              {editSkillNames.filter(n => !allSkills.some(s => s.name === n)).map(name => (
                                <Badge
                                  key={name}
                                  variant="default"
                                  className="cursor-pointer text-xs"
                                  onClick={() => toggleSkill(name)}
                                >
                                  {name} ×
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Habilidade não está no catálogo?</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o nome e pressione Enter..."
                          value={editCustomSkillInput}
                          className="text-sm"
                          onChange={e => setEditCustomSkillInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomSkill(); } }}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomSkill} disabled={!editCustomSkillInput.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleSaveSkills} disabled={isSaving} className="flex-1">
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSaving} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {skillCategories.map(category => {
                      const categorySkills = userSkillsDetail
                        .filter(s => s.type === category.nome)
                        .map(s => ({ ...s, numericLevel: getLevelValue(s.level ?? "") }));
                      if (categorySkills.length === 0) return null;
                      return (
                        <div key={category.id} className="space-y-4">
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{category.nome}</h3>
                          <div className="h-[250px] w-full">
                            {category.tipoGrafico === "barras" ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categorySkills} layout="vertical" margin={{ top: 20, right: 20, left: 20, bottom: 25 }}>
                                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                                  <XAxis type="number" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickCount={(category.niveis ?? 3) + 1} domain={[0, category.niveis ?? 3]} />
                                  <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                                  <TooltipRecharts cursor={{fill: 'transparent'}} content={({ active, payload }: any) => active && payload?.length ? <div className="bg-background border rounded-md shadow-md p-2"><p className="font-medium text-sm">{payload[0].payload.name}</p><p className="text-xs text-muted-foreground">Nível: {payload[0].payload.level}</p></div> : null} />
                                  <Bar dataKey="numericLevel" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} maxBarSize={20} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={categorySkills}>
                                  <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
                                  <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, category.niveis ?? 3]} tick={false} axisLine={false} />
                                  <TooltipRecharts content={({ active, payload }: any) => active && payload?.length ? <div className="bg-background border rounded-md shadow-md p-2"><p className="font-medium text-sm">{payload[0].payload.name}</p><p className="text-xs text-muted-foreground">Nível: {payload[0].payload.level}</p></div> : null} />
                                  <Radar name={category.nome} dataKey="numericLevel" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                                </RadarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {userSkillsDetail.filter(s => !skillCategories.some(c => c.nome === s.type)).length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Outras</h3>
                        <div className="flex flex-wrap gap-2">
                          {userSkillsDetail.filter(s => !skillCategories.some(c => c.nome === s.type)).map(s => (
                            <Badge key={s.id} variant="secondary" className="text-sm px-3 py-1 gap-1.5 items-center">
                              <SkillIcon name={s.name} size={14} />
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {userSkillsDetail.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada.</p>
                    )}
                  </div>
                )}
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
                {editingCardId === 'hobbies' ? (
                  <div className="space-y-3">
                    {allHobbies.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum hobby cadastrado. Acesse o painel admin para adicionar hobbies.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const categoryGroups = hobbyCategories.map(cat => ({
                            id: cat.id,
                            name: cat.name,
                            hobbies: allHobbies.filter(h => h.categoryId === cat.id),
                          })).filter(g => g.hobbies.length > 0);
                          const uncategorized = allHobbies.filter(h => h.categoryId === null || !hobbyCategories.some(c => c.id === h.categoryId));
                          if (uncategorized.length > 0) {
                            categoryGroups.push({ id: -1, name: "Outros", hobbies: uncategorized });
                          }
                          return categoryGroups.map(group => (
                            <div key={group.id} className="space-y-1">
                              <Label className="text-xs text-muted-foreground">{group.name}</Label>
                              <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/20">
                                {group.hobbies.map(h => (
                                  <Badge
                                    key={h.id}
                                    variant={editHobbyIds.includes(h.id) ? "default" : "outline"}
                                    className="cursor-pointer text-xs gap-1"
                                    onClick={() => toggleHobby(h.id)}
                                  >
                                    {renderHobbyIcon(h.icon)}
                                    {h.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                    {allFunctions.length > 0 && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Funções</Label>
                        <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/20">
                          {allFunctions.map(f => (
                            <Badge
                              key={f.id}
                              variant={editFunctionIds.includes(f.id) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => toggleFunction(f.id)}
                            >
                              {f.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Hobby não está no catálogo?</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o nome e pressione Enter..."
                          value={editCustomHobbyInput}
                          className="text-sm"
                          onChange={e => setEditCustomHobbyInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomHobby(); } }}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomHobby} disabled={!editCustomHobbyInput.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {editCustomHobbyNames.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {editCustomHobbyNames.map(name => (
                            <Badge key={name} variant="secondary" className="gap-1 text-xs pr-1">
                              {name}
                              <button
                                type="button"
                                onClick={() => setEditCustomHobbyNames(prev => prev.filter(n => n !== name))}
                                className="ml-0.5 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleSaveHobbies} disabled={isSaving} className="flex-1">
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSaving} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum hobby cadastrado.</p>
                    )}
                    {profile.hobbies.map((hobby) => (
                      <Badge key={hobby.customName ?? String(hobby.id)} variant="secondary" className="gap-1.5 text-sm px-3 py-1">
                        {renderHobbyIcon(hobby.customName ? null : (hobby.icon ?? null))}
                        {hobby.name ?? hobby.customName}
                      </Badge>
                    ))}
                  </div>
                )}
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
                    <SortableCard key={cardId} id={cardId} onEdit={canEdit && cardId === 'links' ? () => handleStartEdit(cardId) : undefined} isEditing={editingCardId === cardId}>
                      {cardId === 'links' && (() => {
                      const CANONICAL_PLATFORMS = [
                        'github','discord','spotify','youtube','telegram','instagram','x','facebook','tiktok'
                      ] as const;
                      type PlatformKey = typeof CANONICAL_PLATFORMS[number] | 'linkedin' | 'teams' | 'slack' | 'webex' | 'generic';

                      const PLATFORM_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
                        linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: <Linkedin className="h-[26px] w-[26px]" /> },
                        github: { label: 'GitHub', color: '#333', icon: <Github className="h-[26px] w-[26px]" /> },
                        discord: { label: 'Discord', color: '#5865F2', icon: (
                          <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.08.114 18.1.134 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                        )},
                        spotify: { label: 'Spotify', color: '#1DB954', icon: (
                          <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        )},
                        youtube: { label: 'YouTube', color: '#FF0000', icon: <Youtube className="h-[26px] w-[26px]" /> },
                        x: { label: 'X', color: '#000', icon: <Twitter className="h-[26px] w-[26px]" /> },
                        telegram: { label: 'Telegram', color: '#26A5E4', icon: (
                          <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        )},
                        instagram: { label: 'Instagram', color: '#E1306C', icon: (
                          <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                          </svg>
                        )},
                        facebook: { label: 'Facebook', color: '#1877F2', icon: <Facebook className="h-[26px] w-[26px]" /> },
                        tiktok: { label: 'TikTok', color: '#000', icon: (
                          <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.23 8.23 0 0 0 4.82 1.55V6.79a4.85 4.85 0 0 1-1.05-.1z"/>
                          </svg>
                        )},
                        generic: { label: 'Link', color: '#666', icon: <Link2 className="h-[26px] w-[26px]" /> },
                      };

                      const usedPlatforms = new Set(memberLinksList.map(l => l.platform));
                      const pendingPlatforms = CANONICAL_PLATFORMS.filter(p => !usedPlatforms.has(p));

                      const sortedLinks = [...memberLinksList].sort((a, b) => a.sortOrder - b.sortOrder);

                      const linkSensors = sensors;

                      const handleLinkDragEnd = (event: any) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;
                        const oldIndex = sortedLinks.findIndex(l => l.id === active.id);
                        const newIndex = sortedLinks.findIndex(l => l.id === over.id);
                        if (oldIndex < 0 || newIndex < 0) return;
                        const reordered = arrayMove(sortedLinks, oldIndex, newIndex);
                        reorderLinksMutation.mutate(reordered.map(l => l.id));
                      };

                      const handleAddLink = async () => {
                        if (!newLinkUrl.trim()) return;
                        setIsAddingLink(false);
                        await addLinkMutation.mutateAsync({ url: newLinkUrl.trim() });
                        setNewLinkUrl("");
                      };

                      return (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Link2 className="h-5 w-5 text-primary" />
                              Links Pessoais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {sortedLinks.length === 0 && editingCardId !== 'links' && (
                              <p className="text-sm text-muted-foreground">Nenhum link cadastrado.</p>
                            )}

                            {sortedLinks.length > 0 && (
                              <DndContext sensors={linkSensors} collisionDetection={closestCenter} onDragEnd={handleLinkDragEnd}>
                                <SortableContext items={sortedLinks.map(l => l.id)} strategy={rectSortingStrategy}>
                                  <div className="flex flex-wrap gap-2">
                                    {sortedLinks.map((link) => {
                                      const meta = PLATFORM_META[link.platform] ?? PLATFORM_META.generic;
                                      return (
                                        <SortableLinkItem
                                          key={link.id}
                                          link={link}
                                          meta={meta}
                                          canEdit={canEdit && editingCardId === 'links'}
                                          onDelete={() => deleteLinkMutation.mutate(link.id)}
                                        />
                                      );
                                    })}
                                  </div>
                                </SortableContext>
                              </DndContext>
                            )}

                            {canEdit && editingCardId === 'links' && (
                              <>
                                {isAddingLink ? (
                                  <div className="flex gap-2 mt-2">
                                    <Input
                                      autoFocus
                                      value={newLinkUrl}
                                      onChange={e => setNewLinkUrl(e.target.value)}
                                      placeholder="https://github.com/usuario"
                                      className="h-8 text-sm flex-1"
                                      onKeyDown={e => { if (e.key === 'Enter') handleAddLink(); if (e.key === 'Escape') { setIsAddingLink(false); setNewLinkUrl(""); } }}
                                    />
                                    <Button size="sm" onClick={handleAddLink} disabled={addLinkMutation.isPending} className="h-8 px-3">
                                      {addLinkMutation.isPending ? '...' : 'Adicionar'}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => { setIsAddingLink(false); setNewLinkUrl(""); }} className="h-8 px-2">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-1 h-8 text-xs"
                                    onClick={() => setIsAddingLink(true)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Adicionar link
                                  </Button>
                                )}

                                {pendingPlatforms.length > 0 && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wide font-medium">Plataformas pendentes</p>
                                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                                      {pendingPlatforms.map(p => {
                                        const meta = PLATFORM_META[p];
                                        if (!meta) return null;
                                        return (
                                          <button
                                            key={p}
                                            className="flex flex-col items-center gap-1 min-w-[44px] opacity-50 hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                              setIsAddingLink(true);
                                              setNewLinkUrl(`https://${p === 'x' ? 'x.com' : p === 'telegram' ? 't.me' : `${p}.com`}/`);
                                            }}
                                          >
                                            <div
                                              className="p-2 rounded-full bg-muted flex items-center justify-center"
                                              style={{ color: meta.color }}
                                            >
                                              {meta.icon}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{meta.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-2 mt-1 border-t">
                                  <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                                    Fechar
                                  </Button>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })()}

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
                                        <span className="text-sm font-medium">Membro</span>
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
                            {(project.skillsUsed ?? []).map((skill, sIdx) => (
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

                    {cardId === 'teams' && (
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
                      const typeInfo = actionTypesData.find(t => t.id === action.typeId);
                      const corClass = ACTION_COR_MAP[typeInfo?.cor ?? "blue"] ?? "text-blue-600 bg-blue-100";
                      const icon = ACTION_ICON_MAP[typeInfo?.nome ?? ""] ?? <Zap className="h-4 w-4" />;
                      return (
                        <div key={action.id} className="p-4 rounded-lg border border-amber-200/50 bg-card shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded flex items-center justify-center ${corClass}`}>
                                {icon}
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
                  {actionTypesData.map(type => (
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
                      <div className={`p-1.5 rounded-full flex items-center justify-center h-8 w-8 ${ACTION_COR_MAP[type.cor ?? "blue"] ?? "text-blue-600 bg-blue-100"}`}>
                        {ACTION_ICON_MAP[type.nome] ?? <Zap className="h-4 w-4" />}
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
                    {actionTypesData.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center justify-center h-5 w-5 rounded ${ACTION_COR_MAP[type.cor ?? "blue"] ?? "text-blue-600 bg-blue-100"}`}>
                            {ACTION_ICON_MAP[type.nome] ?? <Zap className="h-4 w-4" />}
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
                      {logTypesData.map(type => (
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

      <AvatarCropModal
        imageSrc={cropImageSrc}
        isUploading={uploadAvatarMutation.isPending}
        onClose={() => setCropImageSrc(null)}
        onConfirm={async (croppedFile) => {
          try {
            await uploadAvatarMutation.mutateAsync(croppedFile);
            setCropImageSrc(null);
          } catch (err) {
            setAvatarUploadError(err instanceof Error ? err.message : "Erro ao fazer upload");
            setCropImageSrc(null);
          }
        }}
      />
    </AppLayout>
  );
}

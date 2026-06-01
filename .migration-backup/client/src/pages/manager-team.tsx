import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { useCompany } from "@/lib/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Check, ChevronDown, ChevronRight, Clock, UserPlus, Mail, Network, Plus, CheckCircle2, UserCog, User, Users, MessageCircle, Linkedin, Cake, CalendarDays, ListTodo, HandCoins, Handshake, ArrowDownToDot, ArrowUpFromDot, Slack, Hash, Video, Link as LinkIcon, Info } from "lucide-react";
import { toast } from "sonner";

type Member = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'pending';
  managerId: string | null;
  isMe?: boolean;
  birthday?: string;
  linkedin?: string;
  whatsapp?: string;
  slack?: string;
  teams?: string;
  discord?: string;
  emailContact?: string;
  lastOneOnOne?: string;
  tasksOwedToThem?: number;
  tasksOwedToMe?: number;
  invitedBy?: string;
  communicationMethod1?: string;
  communicationLink1?: string;
  communicationMethod2?: string;
  communicationLink2?: string;
  linkedinAddedBy?: string;
};

export default function ManagerTeam() {
  const { selectedCompany } = useCompany();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: "me", name: "Alexandre Líder", email: "alexandre@organizacao.com", role: "Squad A", status: "active", managerId: null, isMe: true, birthday: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), whatsapp: "5511999999999", slack: "U123456" },
    { id: "sub1", name: "Maria Costa", email: "maria@organizacao.com", role: "Projeto X", status: "active", managerId: "me", birthday: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(), lastOneOnOne: "2 dias atrás", tasksOwedToThem: 2, tasksOwedToMe: 1, invitedBy: "Alexandre Líder", whatsapp: "5511888888888", linkedin: "mariacosta" }
  ]);

  // Form state
  const [relation, setRelation] = useState<string>("subordinate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Radar Form State
  const [radarEmail, setRadarEmail] = useState<string>("");
  const [radarPhone, setRadarPhone] = useState<string>("");
  const [radarBirthdayDay, setRadarBirthdayDay] = useState<string>("");
  const [radarBirthdayMonth, setRadarBirthdayMonth] = useState<string>("");
  const [radarBirthdayYear, setRadarBirthdayYear] = useState<string>("");
  const [radarMethod1, setRadarMethod1] = useState<string>("");
  const [radarLink1, setRadarLink1] = useState<string>("");
  const [radarMethod2, setRadarMethod2] = useState<string>("");
  const [radarLink2, setRadarLink2] = useState<string>("");
  const [radarLinkedin, setRadarLinkedin] = useState<string>("");

  const [isEditingRadar, setIsEditingRadar] = useState(false);

  
  
  // Need to fix this component to use useLocation hook
  // When a member is selected, navigate to the employee profile page with the member ID
  const [, setLocation] = useLocation();
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      setLocation('/profile');
    } else {
      setLocation(`/profile?id=${member.id}`);
    }
  };

  const handleSaveRadar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const isNewLinkedin = radarLinkedin && radarLinkedin !== selectedMember.linkedin;

    let birthdayIso = undefined;
    if (radarBirthdayDay && radarBirthdayMonth) {
      const year = radarBirthdayYear || "1904"; // Use 1904 as placeholder for no year (leap year)
      const month = radarBirthdayMonth.padStart(2, '0');
      const day = radarBirthdayDay.padStart(2, '0');
      birthdayIso = `${year}-${month}-${day}T12:00:00Z`;
    }

    setMembers(members.map(m => 
      m.id === selectedMember.id ? {
        ...m,
        email: radarEmail,
        phone: radarPhone,
        birthday: birthdayIso,
        communicationMethod1: radarMethod1,
        communicationLink1: radarLink1,
        communicationMethod2: radarMethod2,
        communicationLink2: radarLink2,
        linkedin: radarLinkedin,
        linkedinAddedBy: isNewLinkedin ? "Você" : m.linkedinAddedBy
      } : m
    ));
    
    toast.success("Profile atualizado com sucesso!");
    setSelectedMember(null);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = Math.random().toString(36).substr(2, 9);
    const newMember: Member = {
      id: newId,
      name,
      email,
      phone,
      role: relation === 'manager' ? "Team Leader" : relation === 'peer' ? "Team Mate" : "Team Member",
      status: "pending",
      managerId: null
    };

    let updatedMembers = [...members];
    const me = members.find(m => m.isMe);

    if (relation === "manager") {
      newMember.managerId = null;
      // Change my manager to this new person
      updatedMembers = updatedMembers.map(m => m.isMe ? { ...m, managerId: newId } : m);
      
      // If I had peers (same manager as me previously), should they move?
      // For simplicity, if I had no manager, anyone else who had no manager and isn't me becomes peer under new manager
      if (!me?.managerId) {
        updatedMembers = updatedMembers.map(m => m.managerId === null && m.id !== newId ? { ...m, managerId: newId } : m);
      }
    } else if (relation === "peer") {
      newMember.managerId = me?.managerId || null;
    } else if (relation === "subordinate") {
      newMember.managerId = me?.id || null;
    }

    updatedMembers.push(newMember);
    setMembers(updatedMembers);
    
    toast.success("Convite enviado com sucesso!", {
      description: `Um e-mail foi enviado para ${email}.`
    });
    
    setIsInviteOpen(false);
    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setRelation("subordinate");
  };

  // Build tree
  const buildTree = (managerId: string | null = null): any[] => {
    return members
      .filter(m => m.managerId === managerId)
      .map(m => ({ ...m, children: buildTree(m.id) }));
  };

  // Find root node(s)
  // Usually there's one root (managerId === null)
  const treeData = buildTree(null);

  return (
    <AppLayout role="manager" userName="Alexandre Líder" userTitle="Tech Manager / Squad A">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Estruturas</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex text-muted-foreground hover:text-white border-border hover:bg-muted bg-transparent">
              <Plus className="mr-1.5 h-4 w-4" />
              Nova Estrutura
            </Button>
          </div>
        </div>

        <Card className="border-border shadow-sm overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="flex flex-col w-full">
              {/* Header row for context */}
              <div className="flex items-center p-3 border-b border-border bg-background text-xs font-semibold text-primary uppercase tracking-wider pl-12">
                <div className="flex-1">Talento</div>
                <div className="w-48 hidden sm:block">Projeto Atual</div>
                <div className="w-32 hidden md:block text-right pr-4">Ações</div>
              </div>
              
              {/* Tree rendering */}
              <div className="py-2">
                {treeData.length > 0 ? (
                  treeData.map((node, idx) => (
                    <OrgNode key={node.id} node={node} level={0} indexStr={`${idx + 1}`} onSelectMember={handleSelectMember} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">Nenhum membro encontrado.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-white">
              {relation === 'manager' ? 'Adicionar Team Leader' : 
               relation === 'peer' ? 'Adicionar Team Mate' : 
               'Adicionar Team Member'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground flex flex-col gap-1">
              <span>Preencha os dados abaixo para enviar o convite.</span>
              <span className="font-medium text-primary">Organização: {selectedCompany.name}</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nome Completo *</Label>
                <Input className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" required placeholder="Ex: Ana Silva" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">E-mail *</Label>
                <Input className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" type="email" placeholder="ana@organizacao.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Telefone (Opcional)</Label>
                <Input className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="border-border text-muted-foreground hover:bg-muted hover:text-white bg-transparent" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                <Mail className="mr-2 h-4 w-4" /> Enviar Convite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        {isFabOpen && (
          <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <Button 
              onClick={() => { setRelation("manager"); setIsInviteOpen(true); setIsFabOpen(false); }}
              className="bg-muted text-foreground hover:bg-muted-foreground/20 shadow-md border border-border rounded-full px-4 py-2 h-auto flex items-center gap-3 justify-end"
            >
              <span className="font-medium">Team Leader</span>
              <div className="bg-primary/20 text-primary p-1.5 rounded-full">
                <UserCog className="h-4 w-4" />
              </div>
            </Button>
            <Button 
              onClick={() => { setRelation("peer"); setIsInviteOpen(true); setIsFabOpen(false); }}
              className="bg-muted text-foreground hover:bg-muted-foreground/20 shadow-md border border-border rounded-full px-4 py-2 h-auto flex items-center gap-3 justify-end"
            >
              <span className="font-medium">Team Mate</span>
              <div className="bg-primary/20 text-primary p-1.5 rounded-full">
                <Users className="h-4 w-4" />
              </div>
            </Button>
            <Button 
              onClick={() => { setRelation("subordinate"); setIsInviteOpen(true); setIsFabOpen(false); }}
              className="bg-muted text-foreground hover:bg-muted-foreground/20 shadow-md border border-border rounded-full px-4 py-2 h-auto flex items-center gap-3 justify-end"
            >
              <span className="font-medium">Team Member</span>
              <div className="bg-primary/20 text-primary p-1.5 rounded-full">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </div>
        )}
        <Button 
          size="icon"
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground transition-all duration-200"
        >
          {isFabOpen ? <Plus className="h-6 w-6 rotate-45 transition-transform" /> : <Edit2 className="h-6 w-6 transition-transform" />}
        </Button>
      </div>
    </AppLayout>
  );
}

// Helper to render communication icons
const renderCommunicationIcon = (method?: string, link?: string, buttonClass = "h-8 w-8", iconClass = "h-4 w-4") => {
  if (!method || !link) return null;
  
  const iconProps = { className: iconClass };
  let Icon = LinkIcon;
  let colorClass = "text-muted-foreground hover:text-muted-foreground hover:bg-muted";
  let title = "Link";

  switch (method) {
    case 'whatsapp':
      Icon = MessageCircle;
      colorClass = "text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10";
      title = "WhatsApp";
      break;
    case 'slack':
      Icon = Slack;
      colorClass = "text-purple-500 hover:text-purple-400 hover:bg-purple-500/10";
      title = "Slack";
      break;
    case 'teams':
      Icon = Video;
      colorClass = "text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10";
      title = "Teams";
      break;
    case 'discord':
      Icon = Hash;
      colorClass = "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10";
      title = "Discord";
      break;
    case 'email':
      Icon = Mail;
      colorClass = "text-rose-500 hover:text-rose-400 hover:bg-rose-500/10";
      title = "E-mail";
      break;
  }

  return (
    <Button 
      key={`${method}-${link}`}
      variant="ghost" 
      size="icon" 
      className={`${buttonClass} rounded-full ${colorClass}`} 
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
      }}
    >
      <Icon {...iconProps} />
    </Button>
  );
};

// Recursive Component for the Tree Node
function OrgNode({ node, level, indexStr, onSelectMember }: { node: any, level: number, indexStr: string, onSelectMember: (member: Member) => void }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  
  const getDaysToBirthday = (birthdayIso?: string) => {
    if (!birthdayIso) return null;
    const birthday = new Date(birthdayIso);
    const today = new Date();
    
    // Set both to same year to compare dates
    birthday.setFullYear(today.getFullYear());
    
    // If birthday has passed this year, look at next year
    if (birthday.getTime() < today.getTime()) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = Math.abs(birthday.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysToBirthday = getDaysToBirthday(node.birthday);
  const showBirthday = daysToBirthday !== null && daysToBirthday <= 30;

  return (
    <div className="flex flex-col relative">
      {/* Visual hierarchy lines */}
      {level > 0 && (
        <div 
          className="absolute border-l-2 border-b-2 border-border rounded-bl-lg"
          style={{ 
            left: `${level * 2}rem`, 
            top: 0, 
            height: '2rem', 
            width: '1rem' 
          }}
        />
      )}
      {level > 0 && hasChildren && expanded && (
        <div 
          className="absolute border-l-2 border-border"
          style={{ 
            left: `${level * 2}rem`, 
            top: '2rem', 
            bottom: 0, 
          }}
        />
      )}

      <div 
        className={`flex items-center p-2 sm:p-3 border-b border-border hover:bg-muted/50 transition-colors group bg-card cursor-pointer`}
        style={{ paddingLeft: `${level * 2 + 1}rem` }}
        onClick={(e) => {
          // Prevent opening if clicking expand/collapse
          if ((e.target as HTMLElement).closest('button')) return;
          onSelectMember(node);
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Collapse/Expand button */}
          <div className="w-5 flex justify-center z-10 bg-card rounded-full">
            {hasChildren ? (
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="p-0.5 bg-muted border border-border shadow-sm hover:bg-muted-foreground/20 rounded-md text-muted-foreground"
              >
                {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            ) : (
              <div className="w-4 h-4 rounded-full border border-border bg-muted" />
            )}
          </div>
          
          <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 border-2 ${node.isMe ? 'border-primary' : 'border-border'} ${node.status === 'pending' ? 'border-dotted border-primary' : ''} shadow-sm`}>
            <AvatarFallback className={node.isMe ? 'bg-primary/20 text-primary font-bold' : 'bg-muted text-muted-foreground'}>
              {node.name.substring(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col truncate py-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base truncate ${node.isMe ? 'text-primary font-bold' : 'text-foreground font-semibold'}`}>
                {node.status === 'pending' ? node.name : node.name}
              </span>
              {node.isMe && (
                <Badge variant="secondary" className="text-[10px] h-5 bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 shrink-0">
                  Você
                </Badge>
              )}
            </div>
            
            {(showBirthday || (node.lastOneOnOne && (node.role === 'Team Leader' || node.role === 'Team Member')) || (node.tasksOwedToThem && node.tasksOwedToThem > 0) || (node.tasksOwedToMe && node.tasksOwedToMe > 0)) && (
              <div className="flex flex-wrap items-center gap-2 mt-1.5 w-full">
                {showBirthday && (
                  <Badge variant="outline" className="text-xs h-6 bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1.5 px-2.5 shrink-0 font-medium">
                    <Cake className="h-3.5 w-3.5" /> {daysToBirthday}d
                  </Badge>
                )}
                {node.lastOneOnOne && (node.role === 'Team Leader' || node.role === 'Team Member') && (
                  <Badge variant="outline" className="text-xs h-6 bg-orange-500/10 text-orange-400 border-orange-500/20 gap-1.5 px-2.5 shrink-0 font-medium">
                    <CalendarDays className="h-3.5 w-3.5" /> {node.lastOneOnOne}
                  </Badge>
                )}
                {node.tasksOwedToThem && node.tasksOwedToThem > 0 && (
                  <Badge variant="outline" className="text-xs h-6 bg-primary/10 text-primary/80 border-primary/20 gap-1.5 px-2.5 shrink-0 font-medium" title={`Devo ${node.tasksOwedToThem} tasks`}>
                    <HandCoins className="h-3.5 w-3.5 text-primary rotate-180" /> -{node.tasksOwedToThem}
                  </Badge>
                )}
                {node.tasksOwedToMe && node.tasksOwedToMe > 0 && (
                  <Badge variant="outline" className="text-xs h-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 px-2.5 shrink-0 font-medium" title={`Me deve ${node.tasksOwedToMe} tasks`}>
                    <HandCoins className="h-3.5 w-3.5 text-emerald-500" /> +{node.tasksOwedToMe}
                  </Badge>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1 sm:hidden">
              {node.role}
            </div>
          </div>
        </div>

        <div className="w-48 hidden sm:block shrink-0 px-2">
          <span className="text-sm text-muted-foreground">{node.role}</span>
        </div>
        
        <div className="w-32 hidden md:flex shrink-0 items-center justify-end gap-1 pr-4">
          {renderCommunicationIcon(node.communicationMethod1, node.communicationLink1)}
          {renderCommunicationIcon(node.communicationMethod2, node.communicationLink2)}
          
          {node.linkedin && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full" 
              title="LinkedIn"
              onClick={(e) => {
                e.stopPropagation();
                window.open(node.linkedin.startsWith('http') ? node.linkedin : `https://${node.linkedin}`, '_blank');
              }}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="flex flex-col relative z-0">
          {node.children.map((child: any, idx: number) => (
            <OrgNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              indexStr={`${indexStr}.${idx + 1}`}
              onSelectMember={onSelectMember}
            />
          ))}
        </div>
      )}
    </div>
  );
}

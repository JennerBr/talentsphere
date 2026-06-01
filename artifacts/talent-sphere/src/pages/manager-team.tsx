import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { useCompany } from "@/lib/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Edit2, Check, ChevronDown, ChevronRight, UserPlus, Mail, Plus,
  UserCog, User, Users, MessageCircle, Linkedin, Cake, CalendarDays,
  HandCoins, Slack, Hash, Video, Link as LinkIcon, UserMinus,
  Copy, CheckCheck, X, XCircle, Clock, Send, ChevronUp
} from "lucide-react";
import { useMembers, useCurrentMember, useTeams, useRemoveMemberFromTeam, usePendingInvites, useBatchInvite, useCancelInvite } from "@/lib/use-data";
import type { ApiInvitation, InviteBatchResult } from "@/lib/use-data";
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
  communicationMethod1?: string;
  communicationLink1?: string;
  communicationMethod2?: string;
  communicationLink2?: string;
  lastOneOnOne?: string;
  tasksOwedToThem?: number;
  tasksOwedToMe?: number;
};

type ParsedEmail = {
  email: string;
  domainOk: boolean;
  reason: string | null;
};

type InviteCardState = ParsedEmail & {
  result?: InviteBatchResult;
  copied?: boolean;
};

function parseEmailsFromText(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex) ?? [];
  return [...new Set(found.map(e => e.toLowerCase()))];
}

function validateDomain(email: string, allowedDomains: string[] | null | undefined): { ok: boolean; reason: string | null } {
  if (!allowedDomains || allowedDomains.length === 0) return { ok: true, reason: null };
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const normalized = allowedDomains.map(d => d.replace(/^@/, "").toLowerCase());
  if (normalized.includes(domain)) return { ok: true, reason: null };
  return { ok: false, reason: `Domínio @${domain} não permitido` };
}

export default function ManagerTeam() {
  const { selectedOrg } = useCompany();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [showPendingInvites, setShowPendingInvites] = useState(false);

  const removeMemberFromTeam = useRemoveMemberFromTeam();
  const batchInvite = useBatchInvite();
  const cancelInvite = useCancelInvite();

  const { data: apiMembers = [] } = useMembers();
  const { data: currentMember } = useCurrentMember();
  const { data: pendingInvites = [], refetch: refetchInvites } = usePendingInvites();
  const { data: teams = [] } = useTeams();
  const currentTeam = teams.find(t => t.id === selectedOrg?.id);
  const teamAllowedDomains = currentTeam?.allowedDomains ?? null;

  const members: Member[] = apiMembers.map((m) => ({
    id: String(m.id),
    name: m.name,
    email: m.email ?? "",
    role: m.role ?? "",
    status: "active" as const,
    managerId: null,
    isMe: currentMember ? m.id === currentMember.id : false,
    birthday: m.birthday ?? undefined,
  }));

  const [, setLocation] = useLocation();
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      setLocation('/profile');
    } else {
      setLocation(`/profile?id=${member.id}`);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !selectedOrg) return;
    const memberId = Number(memberToRemove.id);
    if (isNaN(memberId)) {
      toast.error("Não é possível remover este membro: ID inválido.");
      setMemberToRemove(null);
      return;
    }
    try {
      await removeMemberFromTeam.mutateAsync({ memberId, teamId: selectedOrg.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao remover membro.";
      toast.error(`Falha ao remover ${memberToRemove.name}: ${message}`);
      setMemberToRemove(null);
      return;
    }
    toast.success(`${memberToRemove.name} removido do team.`);
    setMemberToRemove(null);
  };

  const buildTree = (managerId: string | null = null): any[] => {
    return members
      .filter(m => m.managerId === managerId)
      .map(m => ({ ...m, children: buildTree(m.id) }));
  };

  const treeData = buildTree(null);

  const handleCancelInvite = async (id: string, email: string) => {
    try {
      await cancelInvite.mutateAsync(id);
      toast.success(`Convite para ${email} cancelado.`);
    } catch {
      toast.error("Falha ao cancelar convite.");
    }
  };

  const handleCopyInviteLink = (inviteUrl: string, email: string) => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast.success(`Link copiado para ${email}!`);
    });
  };

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
              <div className="flex items-center p-3 border-b border-border bg-background text-xs font-semibold text-primary uppercase tracking-wider pl-12">
                <div className="flex-1">Talento</div>
                <div className="w-48 hidden sm:block">Projeto Atual</div>
                <div className="w-32 hidden md:block text-right pr-4">Ações</div>
              </div>
              <div className="py-2">
                {treeData.length > 0 ? (
                  treeData.map((node, idx) => (
                    <OrgNode key={node.id} node={node} level={0} indexStr={`${idx + 1}`} onSelectMember={handleSelectMember} onRemoveMember={setMemberToRemove} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">Nenhum membro encontrado.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Invites Section */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-amber-500" />
                Convites Pendentes
                {pendingInvites.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-400 border-none text-xs">
                    {pendingInvites.length}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white"
                onClick={() => setShowPendingInvites(!showPendingInvites)}
              >
                {showPendingInvites ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {showPendingInvites && (
            <CardContent className="pt-0">
              {pendingInvites.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum convite pendente.</p>
              ) : (
                <div className="space-y-2">
                  {pendingInvites.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{inv.invitedEmail}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">por {inv.invitedByName ?? "desconhecido"}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{inv.role ?? "Membro"}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            Expira {new Date(inv.expiresAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          title="Copiar link"
                          onClick={() => handleCopyInviteLink(inv.inviteUrl, inv.invitedEmail)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          title="Cancelar convite"
                          onClick={() => handleCancelInvite(inv.id, inv.invitedEmail)}
                          disabled={cancelInvite.isPending}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Remove from org confirmation dialog */}
      <Dialog open={!!memberToRemove} onOpenChange={(open) => { if (!open) setMemberToRemove(null); }}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-white">Remover da organização</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tem certeza que deseja remover <span className="font-semibold text-foreground">{memberToRemove?.name}</span> desta organização? O perfil do membro não será excluído do sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" className="border-border text-muted-foreground hover:bg-muted hover:text-white bg-transparent" onClick={() => setMemberToRemove(null)}>Cancelar</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveMember}
              disabled={removeMemberFromTeam.isPending}
            >
              <UserMinus className="mr-2 h-4 w-4" /> Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BatchInviteDialog
        open={isInviteOpen}
        onClose={() => { setIsInviteOpen(false); refetchInvites(); }}
        allowedDomains={teamAllowedDomains}
        batchInvite={batchInvite}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        {isFabOpen && (
          <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <Button
              onClick={() => { setIsInviteOpen(true); setIsFabOpen(false); }}
              className="bg-muted text-foreground hover:bg-muted-foreground/20 shadow-md border border-border rounded-full px-4 py-2 h-auto flex items-center gap-3 justify-end"
            >
              <span className="font-medium">Convidar por e-mail</span>
              <div className="bg-primary/20 text-primary p-1.5 rounded-full">
                <Mail className="h-4 w-4" />
              </div>
            </Button>
          </div>
        )}
        <Button
          size="icon"
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground transition-all duration-200"
        >
          {isFabOpen ? <Plus className="h-6 w-6 rotate-45 transition-transform" /> : <UserPlus className="h-6 w-6 transition-transform" />}
        </Button>
      </div>
    </AppLayout>
  );
}

// ─── Batch Invite Dialog ──────────────────────────────────────────────────────

function BatchInviteDialog({
  open,
  onClose,
  allowedDomains,
  batchInvite,
}: {
  open: boolean;
  onClose: () => void;
  allowedDomains: string[] | null | undefined;
  batchInvite: ReturnType<typeof useBatchInvite>;
}) {
  const [emailsText, setEmailsText] = useState("");
  const [cards, setCards] = useState<InviteCardState[]>([]);
  const [inviteRole, setInviteRole] = useState("Membro");
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setEmailsText("");
    setCards([]);
    setInviteRole("Membro");
    setSent(false);
    onClose();
  };

  const handleParseEmails = () => {
    const emails = parseEmailsFromText(emailsText);
    if (emails.length === 0) return;
    const newCards: InviteCardState[] = emails.map(email => {
      const { ok, reason } = validateDomain(email, allowedDomains);
      return { email, domainOk: ok, reason };
    });
    setCards(newCards);
  };

  const removeCard = (email: string) => {
    setCards(prev => prev.filter(c => c.email !== email));
  };

  const handleSendAll = async () => {
    const validEmails = cards.filter(c => c.domainOk && !c.result).map(c => c.email);
    if (validEmails.length === 0) return;

    try {
      const results = await batchInvite.mutateAsync({ emails: validEmails, role: inviteRole });
      setSent(true);
      setCards(prev =>
        prev.map(card => {
          const res = results.find(r => r.email === card.email);
          return res ? { ...card, result: res } : card;
        })
      );
      const succeeded = results.filter(r => r.valid).length;
      toast.success(`${succeeded} convite(s) gerado(s) com sucesso!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar convites.";
      toast.error(msg);
    }
  };

  const handleCopyLink = (card: InviteCardState) => {
    const url = card.result?.inviteUrl ?? "";
    navigator.clipboard.writeText(url).then(() => {
      setCards(prev => prev.map(c => c.email === card.email ? { ...c, copied: true } : c));
      setTimeout(() => {
        setCards(prev => prev.map(c => c.email === card.email ? { ...c, copied: false } : c));
      }, 2000);
    });
  };

  const validCount = cards.filter(c => c.domainOk).length;
  const invalidCount = cards.filter(c => !c.domainOk).length;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-[560px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Convidar membros
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cole os e-mails abaixo (separados por vírgula, ponto-e-vírgula ou quebra de linha).
            {allowedDomains && allowedDomains.length > 0 && (
              <span className="block mt-1 text-xs">
                Domínios aceitos: {allowedDomains.map(d => `@${d.replace(/^@/, "")}`).join(", ")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!sent && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">E-mails dos convidados</Label>
              <Textarea
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 min-h-[80px] font-mono text-sm"
                placeholder={"joao@empresa.com\nmaria@empresa.com, pedro@empresa.com"}
                value={emailsText}
                onChange={e => setEmailsText(e.target.value)}
                onBlur={handleParseEmails}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-white hover:bg-muted bg-transparent"
                onClick={handleParseEmails}
                disabled={!emailsText.trim()}
              >
                Analisar e-mails
              </Button>
            </div>
          )}

          {cards.length > 0 && (
            <div className="space-y-2">
              {!sent && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {validCount > 0 && <span className="text-green-400">{validCount} válido(s)</span>}
                    {invalidCount > 0 && <span className="text-destructive">{invalidCount} inválido(s)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Papel:</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="h-7 text-xs w-32 border-border bg-background text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Membro">Membro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                {cards.map((card) => (
                  <div
                    key={card.email}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                      card.result
                        ? card.result.valid
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-destructive/30 bg-destructive/5"
                        : card.domainOk
                        ? "border-border bg-background"
                        : "border-destructive/30 bg-destructive/5"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{card.email}</p>
                      {(card.reason ?? card.result?.reason) && (
                        <p className="text-xs text-destructive">{card.result?.reason ?? card.reason}</p>
                      )}
                      {card.result?.valid && !card.result.reason && (
                        <p className="text-xs text-green-400">Convite gerado!</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {card.result?.valid && card.result.inviteUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 rounded-full transition-colors ${card.copied ? "text-green-400 bg-green-400/10" : "text-primary hover:bg-primary/10"}`}
                          title="Copiar link"
                          onClick={() => handleCopyLink(card)}
                        >
                          {card.copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      )}
                      {!card.result && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => removeCard(card.email)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {!card.result && card.domainOk && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                      {!card.result && !card.domainOk && (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-border text-muted-foreground hover:bg-muted hover:text-white bg-transparent"
            onClick={handleClose}
          >
            {sent ? "Fechar" : "Cancelar"}
          </Button>
          {!sent && validCount > 0 && (
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              onClick={handleSendAll}
              disabled={batchInvite.isPending}
            >
              {batchInvite.isPending ? (
                <>Gerando...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Convidar {validCount} {validCount === 1 ? "pessoa" : "pessoas"}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Communication icon helper ────────────────────────────────────────────────

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

// ─── Org tree node ────────────────────────────────────────────────────────────

function OrgNode({ node, level, indexStr, onSelectMember, onRemoveMember }: { node: any, level: number, indexStr: string, onSelectMember: (member: Member) => void, onRemoveMember: (member: Member) => void }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const getDaysToBirthday = (birthdayIso?: string) => {
    if (!birthdayIso) return null;
    const birthday = new Date(birthdayIso);
    const today = new Date();
    birthday.setFullYear(today.getFullYear());
    if (birthday.getTime() < today.getTime()) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = Math.abs(birthday.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysToBirthday = getDaysToBirthday(node.birthday);
  const showBirthday = daysToBirthday !== null && daysToBirthday <= 30;

  return (
    <div className="flex flex-col relative">
      {level > 0 && (
        <div
          className="absolute border-l-2 border-b-2 border-border rounded-bl-lg"
          style={{ left: `${level * 2}rem`, top: 0, height: '2rem', width: '1rem' }}
        />
      )}
      {level > 0 && hasChildren && expanded && (
        <div
          className="absolute border-l-2 border-border"
          style={{ left: `${level * 2}rem`, top: '2rem', bottom: 0 }}
        />
      )}

      <div
        className={`flex items-center p-2 sm:p-3 border-b border-border hover:bg-muted/50 transition-colors group bg-card cursor-pointer`}
        style={{ paddingLeft: `${level * 2 + 1}rem` }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          onSelectMember(node);
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
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

          <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 border-2 ${node.isMe ? 'border-primary' : 'border-border'} shadow-sm`}>
            <AvatarFallback className={node.isMe ? 'bg-primary/20 text-primary font-bold' : 'bg-muted text-muted-foreground'}>
              {node.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col truncate py-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base truncate ${node.isMe ? 'text-primary font-bold' : 'text-foreground font-semibold'}`}>
                {node.name}
              </span>
              {node.isMe && (
                <Badge variant="secondary" className="text-[10px] h-5 bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 shrink-0">
                  Você
                </Badge>
              )}
            </div>

            {(showBirthday || (node.tasksOwedToThem && node.tasksOwedToThem > 0) || (node.tasksOwedToMe && node.tasksOwedToMe > 0)) && (
              <div className="flex flex-wrap items-center gap-2 mt-1.5 w-full">
                {showBirthday && (
                  <Badge variant="outline" className="text-xs h-6 bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1.5 px-2.5 shrink-0 font-medium">
                    <Cake className="h-3.5 w-3.5" /> {daysToBirthday}d
                  </Badge>
                )}
                {node.tasksOwedToThem > 0 && (
                  <Badge variant="outline" className="text-xs h-6 bg-primary/10 text-primary/80 border-primary/20 gap-1.5 px-2.5 shrink-0 font-medium">
                    <HandCoins className="h-3.5 w-3.5 text-primary rotate-180" /> -{node.tasksOwedToThem}
                  </Badge>
                )}
                {node.tasksOwedToMe > 0 && (
                  <Badge variant="outline" className="text-xs h-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 px-2.5 shrink-0 font-medium">
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
                window.open(`https://www.linkedin.com/in/${node.linkedin}`, '_blank');
              }}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          )}

          {!node.isMe && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover da organização"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMember(node);
              }}
            >
              <UserMinus className="h-4 w-4" />
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
              onRemoveMember={onRemoveMember}
            />
          ))}
        </div>
      )}
    </div>
  );
}

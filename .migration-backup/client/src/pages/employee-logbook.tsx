import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_USERS } from "@/lib/mock-data";
import { useState } from "react";
import { MOCK_LOG_TYPES } from "./admin-log-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Send, Clock, UserIcon, Sparkles, Search, Plus, Filter, CheckCircle2, Circle, MessageSquare } from "lucide-react";
import { StudentSelectorModal } from "@/components/shared/student-selector-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "wouter";

// Mock data for past logbooks
const MOCK_PAST_LOGBOOKS = [
  { id: 1, title: "Alinhamento de Carreira", date: "2024-04-20", daysAgo: 17, type: "Plano de Carreira", status: "ok", annotations: "Conversamos sobre os próximos passos para a promoção. Foco em melhorar a comunicação." },
  { id: 2, title: "Feedback Projeto Alpha", date: "2024-04-30", daysAgo: 7, type: "Feedback Positivo", status: "ok", annotations: "Excelente entrega no projeto Alpha. O cliente ficou muito satisfeito." },
  { id: 3, title: "Follow-up Semanal", date: "2024-05-05", daysAgo: 2, type: "Acompanhamento (Follow-up)", status: "pendente", annotations: "Verificar o status da task X. Ainda faltam alguns testes." },
];

export default function EmployeeLogbook() {
  const currentUser = MOCK_USERS[0]; // João Silva
  const [selectedMateId, setSelectedMateId] = useState<string>("");
  const [logType, setLogType] = useState<string>("");
  const [logContent, setLogContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "ok">("todos");

  const selectedMate = MOCK_USERS.find(u => u.id.toString() === selectedMateId);

  const getRelationship = (mateId: string) => {
    if (!mateId) return "";
    const mate = MOCK_USERS.find(u => u.id.toString() === mateId);
    if (!mate) return "";
    
    // Simple logic for mockup
    if (mate.id === 1) return "Você";
    if (mate.turma === currentUser.turma) return "Team Mate (Colega de Equipe)";
    // Assuming some roles are higher up
    if (mate.role.includes("Manager") || mate.role.includes("Director")) return "Team Leader (Líder)";
    return "Team Member (Membro de outra equipe)";
  };

  const filteredLogbooks = MOCK_PAST_LOGBOOKS.filter(log => {
    if (filterStatus === "todos") return true;
    return log.status === filterStatus;
  });

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registro de Logbook</h1>
          </div>
          <Link href="/admin/log-types">
            <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Tipos de Log</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Team Member</Label>
                  {!selectedMate ? (
                    <StudentSelectorModal 
                      onSelect={(id) => setSelectedMateId(id.toString())}
                      trigger={
                        <Button variant="outline" className="w-full justify-start h-12 text-muted-foreground">
                          <Search className="mr-2 h-4 w-4" />
                          Buscar talento...
                        </Button>
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={selectedMate.avatar} />
                          <AvatarFallback>{selectedMate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{selectedMate.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedMate.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedMateId("")} className="text-muted-foreground hover:text-foreground">
                        Alterar
                      </Button>
                    </div>
                  )}

                  {selectedMate && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs text-muted-foreground mb-1">Relação:</p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                        {getRelationship(selectedMateId)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-start sm:items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Histórico de Logbook</CardTitle>
                  <CardDescription>
                    {selectedMateId ? `Registros com ${selectedMate?.name}` : 'Selecione um team member para ver o histórico'}
                  </CardDescription>
                </div>
                {selectedMateId && (
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Registro
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Novo Registro</DialogTitle>
                        <DialogDescription>Classifique e detalhe a conversa com {selectedMate?.name}</DialogDescription>
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
                            <Label className="flex items-center gap-1.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                              Tipo de Log (Calculado por IA)
                            </Label>
                            <Select value={logType} onValueChange={setLogType}>
                              <SelectTrigger className="bg-background/50 italic text-muted-foreground">
                                <SelectValue placeholder="Será classificado após salvar..." />
                              </SelectTrigger>
                              <SelectContent>
                                {MOCK_LOG_TYPES.map(type => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{new Date().toLocaleDateString('pt-BR')}</span>
                        </div>
                        <Button disabled={!logContent.trim()} className="gap-2" onClick={() => setIsModalOpen(false)}>
                          <Send className="h-4 w-4" />
                          Salvar Log
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedMateId ? (
                  <div className="flex items-center justify-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                    <div className="flex flex-col items-center text-center max-w-sm">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-bold text-lg">Selecione um participante</p>
                      <p className="text-sm text-muted-foreground mt-2">Escolha a pessoa no painel lateral para visualizar o histórico de logbook com ela.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Últimos Registros</h3>
                      <Select value={filterStatus} onValueChange={(value: "todos"|"pendente"|"ok") => setFilterStatus(value)}>
                        <SelectTrigger className="w-[160px] h-8">
                          <Filter className="h-3 w-3 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Filtrar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os registros</SelectItem>
                          <SelectItem value="pendente">Apenas pendentes</SelectItem>
                          <SelectItem value="ok">Concluídos (OK)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <TooltipProvider>
                        {filteredLogbooks.map((log) => (
                          <Tooltip key={log.id} delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                  {log.status === "ok" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-amber-500 shrink-0" />
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium">{log.title}</p>
                                      <Badge variant="outline" className="text-[10px] font-normal">
                                        {log.type}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                                      <span>•</span>
                                      <span>Há {log.daysAgo} dias</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start" className="max-w-sm p-4 text-sm leading-relaxed shadow-xl">
                              <p className="font-semibold text-xs uppercase text-muted-foreground mb-2">Anotações do Log</p>
                              <p>{log.annotations}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                      
                      {filteredLogbooks.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed bg-muted/20">
                          Nenhum log encontrado com este status.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
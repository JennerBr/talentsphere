import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Users, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

// Mock data
const initialVagas = [
  { id: 1, title: "Desenvolvedor Frontend Senior", project: "Novo Portal", skills: "React, TypeScript, Tailwind", status: "Aguardando Recrutamento", requester: "Alexandre Líder" },
  { id: 2, title: "Engenheiro de Dados Pleno", project: "Migração Cloud", skills: "Python, AWS, Snowflake", status: "Aguardando Mais Informações", requester: "Alexandre Líder" },
];

const initialDisponiveis = [
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
];

export default function ManagerMobility() {
  const [vagas, setVagas] = useState(initialVagas);
  const [disponiveis, setDisponiveis] = useState(initialDisponiveis);
  
  const [isVagaOpen, setIsVagaOpen] = useState(false);
  const [isDispOpen, setIsDispOpen] = useState(false);

  const [newVaga, setNewVaga] = useState({ title: "", project: "", skills: "", description: "" });
  const [newDisp, setNewDisp] = useState({ maker: "", reason: "", date: undefined as Date | undefined });

  const handleSaveVaga = () => {
    if (newVaga.title) {
      setVagas([
        { 
          id: Date.now(), 
          ...newVaga, 
          status: "Aguardando Recrutamento",
          requester: "Alexandre Líder"
        },
        ...vagas
      ]);
      setIsVagaOpen(false);
      setNewVaga({ title: "", project: "", skills: "", description: "" });
    }
  };

  const handleSaveDisp = () => {
    if (newDisp.maker) {
      setDisponiveis([
        {
          id: Date.now(),
          maker: newDisp.maker,
          reason: newDisp.reason,
          date: newDisp.date || new Date(),
          requester: "Alexandre Líder",
          location: "A definir",
          role: "Não especificado",
          skills: [],
          english: "Não avaliado",
          seniority: "A definir"
        },
        ...disponiveis
      ]);
      setIsDispOpen(false);
      setNewDisp({ maker: "", reason: "", date: undefined });
    }
  };

  return (
    <AppLayout role="manager" userName="Alexandre Líder" userTitle="Tech Manager / Squad A">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações</h1>
        </div>

        <Tabs defaultValue="vagas" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="vagas">Vagas Abertas</TabsTrigger>
            <TabsTrigger value="disponiveis">Talentos Disponíveis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vagas" className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vagas Solicitadas</h2>
              
              <Dialog open={isVagaOpen} onOpenChange={setIsVagaOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" /> Criar Vaga</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Nova Vaga</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes para solicitar um novo Talento ao recrutamento.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Título da Vaga</Label>
                      <Input 
                        value={newVaga.title} 
                        onChange={e => setNewVaga({...newVaga, title: e.target.value})} 
                        placeholder="Ex: Desenvolvedor Backend Senior" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Projeto de Destino</Label>
                      <Input 
                        value={newVaga.project} 
                        onChange={e => setNewVaga({...newVaga, project: e.target.value})} 
                        placeholder="Ex: App Mobile V2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Skills Necessárias</Label>
                      <Input 
                        value={newVaga.skills} 
                        onChange={e => setNewVaga({...newVaga, skills: e.target.value})} 
                        placeholder="Ex: Node.js, AWS, Microsserviços" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição e Detalhes Adicionais</Label>
                      <Textarea 
                        value={newVaga.description} 
                        onChange={e => setNewVaga({...newVaga, description: e.target.value})} 
                        placeholder="Informações adicionais para o recrutador..." 
                        className="h-20"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsVagaOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveVaga}>Salvar no Banco de Dados</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {vagas.map(vaga => (
                <Card key={vaga.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vaga.title}</CardTitle>
                      </div>
                      <Badge 
                        variant={vaga.status === "Aguardando Recrutamento" ? "secondary" : "destructive"}
                      >
                        {vaga.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm"><strong>Skills:</strong> {vaga.skills}</p>
                      <p className="text-xs text-muted-foreground">Solicitado por: {vaga.requester}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disponiveis" className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Talentos Sendo Disponibilizados</h2>
              
              <Dialog open={isDispOpen} onOpenChange={setIsDispOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary"><UserMinus className="mr-2 h-4 w-4" /> Informar Disponibilidade</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disponibilizar Talento</DialogTitle>
                    <DialogDescription>
                      Informe o recrutamento/administração sobre a disponibilidade futura de um Talento do seu time.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome do Talento</Label>
                      <Input 
                        value={newDisp.maker} 
                        onChange={e => setNewDisp({...newDisp, maker: e.target.value})} 
                        placeholder="Nome do colaborador" 
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <Label>Data Prevista de Disponibilidade</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !newDisp.date && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newDisp.date ? format(newDisp.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newDisp.date}
                            onSelect={(date) => setNewDisp({...newDisp, date: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo da Disponibilização</Label>
                      <Textarea 
                        value={newDisp.reason} 
                        onChange={e => setNewDisp({...newDisp, reason: e.target.value})} 
                        placeholder="Ex: Fim do projeto, redução de escopo, etc." 
                        className="h-20"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDispOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveDisp}>Salvar no Banco de Dados</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {disponiveis.map(disp => (
                <Card key={disp.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{disp.maker}</CardTitle>
                            {disp.role && <Badge variant="outline" className="font-normal">{disp.role}</Badge>}
                            {disp.role && <span>•</span>}
                            <span className="text-foreground">Disponível a partir de: <strong>{format(disp.date, "dd/MM/yyyy")}</strong></span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm mt-2">
                      {disp.location && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Localização</span>
                          <span className="font-medium">{disp.location}</span>
                        </div>
                      )}
                      {disp.english && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Inglês</span>
                          <span className="font-medium">{disp.english}</span>
                        </div>
                      )}
                    </div>
                    
                    {disp.skills && disp.skills.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm text-muted-foreground">Habilidades</span>
                        <div className="flex flex-wrap gap-1.5">
                          {disp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="font-normal text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-3 bg-muted/50 rounded-md mt-4">
                      <p className="text-sm font-medium">Motivo da Disponibilização:</p>
                      <p className="text-sm text-muted-foreground">{disp.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
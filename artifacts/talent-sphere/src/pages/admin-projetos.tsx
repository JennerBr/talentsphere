import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProjects, useMembers, useTeams, useCreateProject, useUpdateProject, useDeleteProject, ApiProject } from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormState {
  name: string;
  clients: string;
  startDate: string;
  status: string;
  organizacaoId: string;
}

const emptyForm = (): ProjectFormState => ({
  name: "",
  clients: "",
  startDate: "",
  status: "planejamento",
  organizacaoId: "",
});

export default function AdminProjetos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<ApiProject | null>(null);
  const [form, setForm] = useState<ProjectFormState>(emptyForm());

  const { data: projects = [] } = useProjects();
  const { data: employees = [] } = useMembers();
  const { data: teams = [] } = useTeams();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm());
    setIsCreateOpen(true);
  };

  const openEdit = (project: ApiProject) => {
    setEditProject(project);
    setForm({
      name: project.name,
      clients: project.clients ?? "",
      startDate: project.startDate ?? "",
      status: project.status ?? "planejamento",
      organizacaoId: project.organizacaoId?.toString() ?? "",
    });
  };

  const handleSave = () => {
    const basePayload = {
      name: form.name,
      clients: form.clients || null,
      startDate: form.startDate || null,
      status: form.status || null,
      organizacaoId: form.organizacaoId ? Number(form.organizacaoId) : null,
    };

    if (editProject) {
      updateProject.mutate(
        { id: editProject.id, ...basePayload },
        {
          onSuccess: () => {
            setEditProject(null);
            toast({ title: "Projeto atualizado com sucesso." });
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar projeto", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createProject.mutate(
        { ...basePayload, stakeholders: [], objective: null, tools: null, team: null, endDate: null, rating: 0, observation: null },
        {
          onSuccess: () => {
            setIsCreateOpen(false);
            setForm(emptyForm());
            toast({ title: "Projeto criado com sucesso." });
          },
          onError: (err) => {
            toast({ title: "Erro ao criar projeto", description: err.message, variant: "destructive" });
          },
        }
      );
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Excluir o projeto "${name}"?`)) return;
    deleteProject.mutate(id, {
      onSuccess: () => { toast({ title: "Projeto excluído." }); },
      onError: (err) => { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); },
    });
  };

  const isSaving = createProject.isPending || updateProject.isPending;

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Nome do Projeto</Label>
        <Input
          placeholder="Ex: Migração Cloud V2"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Cliente / Área Requisitante</Label>
        <Input
          placeholder="Ex: Financeiro"
          value={form.clients}
          onChange={e => setForm(f => ({ ...f, clients: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Início</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="Em andamento">Em Andamento</SelectItem>
              <SelectItem value="pausado">Pausado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Projeto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Projeto</DialogTitle>
                  <DialogDescription>Crie um novo projeto para alocação de talentos.</DialogDescription>
                </DialogHeader>
                {renderForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={!form.name || isSaving}>
                    {isSaving ? "Salvando..." : "Salvar Projeto"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={!!editProject} onOpenChange={open => { if (!open) setEditProject(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Projeto</DialogTitle>
                <DialogDescription>Atualize os dados do projeto.</DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditProject(null)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={!form.name || isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Projeto"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Stakeholders</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => {
                  const team = teams.find(o => o.id === item.organizacaoId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {team?.logo ? (
                            <div className="h-6 w-6 rounded border overflow-hidden shrink-0">
                              <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded border bg-muted flex items-center justify-center shrink-0">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-sm font-medium">{team?.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.clients}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {item.stakeholders?.map(id => {
                            const emp = employees.find(u => u.id === id);
                            if (!emp) return null;
                            return (
                              <Avatar key={id} className="h-8 w-8 border-2 border-background" title={emp.name}>
                                <AvatarImage src={emp.avatar ?? undefined} />
                                <AvatarFallback>{emp.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {(!item.stakeholders || item.stakeholders.length === 0) && (
                            <span className="text-xs text-muted-foreground ml-2">Nenhum</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.startDate ? new Date(item.startDate).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === 'Em andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            item.status === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => handleDelete(item.id, item.name)}
                            disabled={deleteProject.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search, Plus, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { SkillIcon } from "@/lib/skill-icon";
import {
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  useSkillCategories,
  type ApiSkill,
  type ApiSkillCategory,
} from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";

function suggestSkillIcon(name: string): string {
  const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/react|vue|angular|svelte|next|nuxt|solid/.test(n)) return "⚛️";
  if (/typescript|ts\b/.test(n)) return "🔷";
  if (/javascript|js\b/.test(n)) return "🟨";
  if (/python/.test(n)) return "🐍";
  if (/java(?!script)/.test(n)) return "☕";
  if (/go\b|golang/.test(n)) return "🔵";
  if (/rust/.test(n)) return "🦀";
  if (/ruby/.test(n)) return "💎";
  if (/swift|ios/.test(n)) return "🍎";
  if (/kotlin|android/.test(n)) return "🤖";
  if (/php/.test(n)) return "🐘";
  if (/c\+\+|cpp/.test(n)) return "⚙️";
  if (/sql|postgres|mysql|mongo|redis|firebase|database|banco/.test(n)) return "🗄️";
  if (/docker|kubernetes|k8s|helm/.test(n)) return "🐳";
  if (/aws|azure|gcp|cloud|nuvem/.test(n)) return "☁️";
  if (/git|github|gitlab|bitbucket/.test(n)) return "📦";
  if (/html/.test(n)) return "🌐";
  if (/css|tailwind|bootstrap|sass|scss/.test(n)) return "🎨";
  if (/figma|sketch|xd|photoshop|illustrator/.test(n)) return "🖌️";
  if (/design|ux|ui/.test(n)) return "🎨";
  if (/node|bun|deno|express|fastify/.test(n)) return "💚";
  if (/lider|gestao|management|gerencia/.test(n)) return "👥";
  if (/comunica/.test(n)) return "💬";
  if (/excel|sheets|planilha|office|word|powerpoint/.test(n)) return "📊";
  if (/ingles|english|espanhol|spanish|frances|french|aleman|german|japones|mandarin|idioma/.test(n)) return "🗣️";
  if (/analise|analysis|data|dados|bi|power/.test(n)) return "📈";
  if (/seguranca|security|cyber/.test(n)) return "🔒";
  if (/agile|scrum|kanban|sprint/.test(n)) return "🏃";
  if (/test|jest|cypress|selenium|qa/.test(n)) return "🧪";
  if (/devops|ci\b|cd\b|pipeline|jenkins/.test(n)) return "🔄";
  if (/machine|learning|ml\b|ia\b|neural|deep/.test(n)) return "🤖";
  if (/api|rest|graphql|grpc/.test(n)) return "🔗";
  if (/linux|ubuntu|debian|fedora|bash|shell/.test(n)) return "🐧";
  return "⚙️";
}

interface FormState {
  nome: string;
  categoryId: string;
  icon: string;
}

const emptyForm = (): FormState => ({ nome: "", categoryId: "none", icon: "⚙️" });

export default function AdminHabilidades() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<ApiSkill | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const { data: allSkills = [] } = useSkills();
  const { data: categories = [] } = useSkillCategories();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const { toast } = useToast();

  useEffect(() => {
    if (form.nome && !editSkill) {
      setForm(f => ({ ...f, icon: suggestSkillIcon(f.nome) }));
    }
  }, [form.nome, editSkill]);

  const openCreate = () => {
    setForm(emptyForm());
    setIsCreateOpen(true);
  };

  const openEdit = (skill: ApiSkill) => {
    setEditSkill(skill);
    setForm({
      nome: skill.name,
      categoryId: skill.categoryId != null ? String(skill.categoryId) : "none",
      icon: skill.icon ?? suggestSkillIcon(skill.name),
    });
  };

  const handleSave = () => {
    const payload = {
      name: form.nome,
      categoryId: form.categoryId !== "none" ? Number(form.categoryId) : null,
      icon: form.icon || null,
    };

    if (editSkill) {
      updateSkill.mutate(
        { id: editSkill.id, ...payload },
        {
          onSuccess: () => {
            setEditSkill(null);
            toast({ title: "Habilidade atualizada." });
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createSkill.mutate(payload, {
        onSuccess: () => {
          setIsCreateOpen(false);
          setForm(emptyForm());
          toast({ title: "Habilidade criada." });
        },
        onError: (err) => {
          toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Excluir a habilidade "${name}"?`)) return;
    deleteSkill.mutate(id, {
      onSuccess: () => { toast({ title: "Habilidade excluída." }); },
      onError: (err) => { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); },
    });
  };

  const isSaving = createSkill.isPending || updateSkill.isPending;

  const filteredSkills = allSkills.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (catId: number | null) => {
    if (catId == null) return null;
    return categories.find(c => c.id === catId)?.nome ?? null;
  };

  const getCategoryBadgeVariant = (nome: string | null): "default" | "secondary" | "outline" => {
    if (!nome) return "outline";
    if (nome.toLowerCase().includes("hard")) return "default";
    if (nome.toLowerCase().includes("soft")) return "secondary";
    return "outline";
  };

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Nome da Habilidade</Label>
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 shrink-0" title="Ícone detectado automaticamente">
            <SkillIcon name={form.nome || ""} fallback={form.icon || "⚙️"} size={22} />
          </div>
          <Input
            placeholder="Ex: React, Liderança, AWS..."
            value={form.nome}
            className="flex-1"
            onChange={e => {
              const nome = e.target.value;
              setForm(f => ({ ...f, nome, icon: suggestSkillIcon(nome) }));
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">O ícone oficial é detectado automaticamente pelo nome.</p>
      </div>
      <div className="space-y-2">
        <Label>Ícone (emoji fallback)</Label>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Ex: ⚛️"
            value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
          />
          <span className="text-xl w-8 text-center shrink-0">{form.icon || "⚙️"}</span>
        </div>
        <p className="text-xs text-muted-foreground">Usado como fallback quando nenhum logo oficial é encontrado.</p>
      </div>
      <div className="space-y-2">
        <Label>Tipo de Habilidade</Label>
        <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem categoria</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Habilidades</h1>
          <Link href="/admin/habilidades/tipos">
            <Button variant="outline"><Wrench className="w-4 h-4 mr-2" /> Tipos de Habilidades</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar habilidades..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nova Habilidade</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Habilidade</DialogTitle>
                  <DialogDescription>Adicione uma habilidade ao catálogo da organização.</DialogDescription>
                </DialogHeader>
                {renderForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={!form.nome || isSaving}>
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={!!editSkill} onOpenChange={open => { if (!open) setEditSkill(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Habilidade</DialogTitle>
                <DialogDescription>Atualize os dados da habilidade.</DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditSkill(null)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={!form.nome || isSaving}>
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      {allSkills.length === 0 ? "Nenhuma habilidade cadastrada. Clique em \"Nova Habilidade\" para começar." : "Nenhuma habilidade encontrada."}
                    </TableCell>
                  </TableRow>
                )}
                {filteredSkills.map(item => {
                  const catName = getCategoryName(item.categoryId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <SkillIcon name={item.name} fallback={item.icon || suggestSkillIcon(item.name)} size={20} />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {catName ? (
                          <Badge variant={getCategoryBadgeVariant(catName)}>{catName}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
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
                            disabled={deleteSkill.isPending}
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

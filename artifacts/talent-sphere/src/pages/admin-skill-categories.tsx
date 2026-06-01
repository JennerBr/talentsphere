import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search, Plus, Wrench, Brain, Languages, Award, BarChart3, Radar } from "lucide-react";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";
import {
  useSkillCategories,
  useCreateSkillCategory,
  useUpdateSkillCategory,
  useDeleteSkillCategory,
  ApiSkillCategory,
} from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";

function getCategoryIcon(nome: string) {
  if (nome === "Hard Skill") return <Wrench className="h-4 w-4" />;
  if (nome === "Soft Skill") return <Brain className="h-4 w-4" />;
  return <Languages className="h-4 w-4" />;
}

interface FormState {
  nome: string;
  descricao: string;
  niveis: number[];
  tipoGrafico: string;
}

const emptyForm = (): FormState => ({
  nome: "",
  descricao: "",
  niveis: [3],
  tipoGrafico: "barras",
});

export default function AdminSkillCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: fetchedCategories = [] } = useSkillCategories();
  const [categories, setCategories] = useState<Array<ApiSkillCategory & { icone: React.ReactNode }>>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ApiSkillCategory | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const createSkillCategory = useCreateSkillCategory();
  const updateSkillCategory = useUpdateSkillCategory();
  const deleteSkillCategory = useDeleteSkillCategory();
  const { toast } = useToast();

  useEffect(() => {
    setCategories(fetchedCategories.map(c => ({ ...c, icone: getCategoryIcon(c.nome) })));
  }, [fetchedCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const openCreate = () => {
    setForm(emptyForm());
    setIsCreateOpen(true);
  };

  const openEdit = (cat: ApiSkillCategory) => {
    setEditCategory(cat);
    setForm({
      nome: cat.nome,
      descricao: cat.descricao ?? "",
      niveis: [cat.niveis ?? 3],
      tipoGrafico: cat.tipoGrafico ?? "barras",
    });
  };

  const handleSave = () => {
    const payload = {
      nome: form.nome,
      descricao: form.descricao || null,
      niveis: form.niveis[0],
      tipoGrafico: form.tipoGrafico || null,
    };

    if (editCategory) {
      updateSkillCategory.mutate(
        { id: editCategory.id, ...payload },
        {
          onSuccess: () => {
            setEditCategory(null);
            toast({ title: "Tipo de habilidade atualizado." });
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createSkillCategory.mutate(payload, {
        onSuccess: () => {
          setIsCreateOpen(false);
          setForm(emptyForm());
          toast({ title: "Tipo de habilidade criado." });
        },
        onError: (err) => {
          toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: number, nome: string) => {
    if (!confirm(`Excluir o tipo "${nome}"?`)) return;
    deleteSkillCategory.mutate(id, {
      onSuccess: () => { toast({ title: "Tipo de habilidade excluído." }); },
      onError: (err) => { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); },
    });
  };

  const isSaving = createSkillCategory.isPending || updateSkillCategory.isPending;

  const filteredCategories = categories.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Nome do Tipo</Label>
        <Input
          placeholder="Ex: Hard Skill"
          value={form.nome}
          onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input
          placeholder="Ex: Habilidades técnicas"
          value={form.descricao}
          onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Quantidade de Níveis</Label>
          <span className="font-medium px-2 py-1 bg-muted rounded-md text-sm">{form.niveis[0]}</span>
        </div>
        <Slider
          value={form.niveis}
          max={5}
          min={1}
          step={1}
          onValueChange={v => setForm(f => ({ ...f, niveis: v }))}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">Isso define quantas barras de progresso serão exibidas para este tipo de habilidade no PDI.</p>
      </div>
      <div className="space-y-2">
        <Label>Tipo de Gráfico</Label>
        <Select value={form.tipoGrafico} onValueChange={v => setForm(f => ({ ...f, tipoGrafico: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de gráfico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="barras">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Barras (Progresso)
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-muted-foreground" />
                Radar (Teia de aranha)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tipos de Habilidades</h1>
          </div>
          <Link href="/admin/habilidades">
            <Button variant="outline"><Award className="w-4 h-4 mr-2" /> Habilidades</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tipo..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Tipo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Tipo de Habilidade</DialogTitle>
                  <DialogDescription>Crie uma nova categoria de habilidades.</DialogDescription>
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

          {/* Edit dialog */}
          <Dialog open={!!editCategory} onOpenChange={open => { if (!open) setEditCategory(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Tipo de Habilidade</DialogTitle>
                <DialogDescription>Atualize os dados do tipo.</DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditCategory(null)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={!form.nome || isSaving}>
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-16">Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Gráfico</TableHead>
                    <TableHead>Níveis</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext items={filteredCategories} strategy={verticalListSortingStrategy}>
                    {filteredCategories.map(item => (
                      <SortableTableRow key={item.id} id={item.id}>
                        <TableCell>
                          <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            {item.icone}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{item.descricao}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.tipoGrafico === "barras" ? <BarChart3 className="h-4 w-4 text-muted-foreground" /> : <Radar className="h-4 w-4 text-muted-foreground" />}
                            <span className="capitalize">{item.tipoGrafico}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 w-4 rounded-full ${i < (item.niveis ?? 3) ? 'bg-primary' : 'bg-muted'}`}
                              />
                            ))}
                            <span className="ml-2 text-xs text-muted-foreground font-medium">{item.niveis}</span>
                          </div>
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
                              onClick={() => handleDelete(item.id, item.nome)}
                              disabled={deleteSkillCategory.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </SortableTableRow>
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

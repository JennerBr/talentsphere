import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag, CalendarClock, Plane, Stethoscope, Coffee, Baby, Info, CalendarOff, Clock, HeartPulse } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useAbsenceTypes,
  useCreateAbsenceType,
  useUpdateAbsenceType,
  useDeleteAbsenceType,
  ApiAbsenceType,
} from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";

const ICONS_MAP: Record<string, React.ElementType> = {
  Plane,
  Stethoscope,
  Coffee,
  Baby,
  Info,
  CalendarOff,
  Clock,
  HeartPulse
};

interface FormState {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const emptyForm = (): FormState => ({
  name: "",
  description: "",
  icon: "Info",
  color: "blue",
});

export default function AdminAbsenceTypes() {
  const { data: fetchedAbsenceTypes = [] } = useAbsenceTypes();
  const [absenceTypes, setAbsenceTypes] = useState<typeof fetchedAbsenceTypes>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ApiAbsenceType | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const createAbsenceType = useCreateAbsenceType();
  const updateAbsenceType = useUpdateAbsenceType();
  const deleteAbsenceType = useDeleteAbsenceType();
  const { toast } = useToast();

  useEffect(() => {
    setAbsenceTypes(fetchedAbsenceTypes);
  }, [fetchedAbsenceTypes]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAbsenceTypes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      green: "bg-green-100 text-green-800 border-green-300",
      amber: "bg-amber-100 text-amber-800 border-amber-300",
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
      slate: "bg-slate-100 text-slate-800 border-slate-300",
      red: "bg-red-100 text-red-800 border-red-300",
    };
    return map[color] || map.slate;
  };

  const openCreate = () => {
    setForm(emptyForm());
    setIsCreateOpen(true);
  };

  const openEdit = (item: ApiAbsenceType) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      icon: item.icon ?? "Info",
      color: item.color ?? "blue",
    });
  };

  const handleSave = () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      icon: form.icon || null,
      color: form.color || null,
      type: null,
    };

    if (editItem) {
      updateAbsenceType.mutate(
        { id: editItem.id, ...payload },
        {
          onSuccess: () => {
            setEditItem(null);
            toast({ title: "Tipo de ausência atualizado." });
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createAbsenceType.mutate(payload, {
        onSuccess: () => {
          setIsCreateOpen(false);
          setForm(emptyForm());
          toast({ title: "Tipo de ausência criado." });
        },
        onError: (err) => {
          toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Excluir o tipo "${name}"?`)) return;
    deleteAbsenceType.mutate(id, {
      onSuccess: () => { toast({ title: "Tipo de ausência excluído." }); },
      onError: (err) => { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); },
    });
  };

  const isSaving = createAbsenceType.isPending || updateAbsenceType.isPending;

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          placeholder="Ex: Licença Luto"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input
          placeholder="Breve explicação sobre quando usar este tipo..."
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Ícone</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.keys(ICONS_MAP).map(iconName => {
            const IconComponent = ICONS_MAP[iconName];
            return (
              <div
                key={iconName}
                onClick={() => setForm(f => ({ ...f, icon: iconName }))}
                className={`p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors ${form.icon === iconName ? 'bg-primary/10 border-primary text-primary' : 'bg-card text-muted-foreground'}`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Cor de Identificação</Label>
        <div className="flex gap-3 mt-2">
          {["green", "amber", "blue", "purple", "slate", "red", "rose"].map(color => (
            <div
              key={color}
              onClick={() => setForm(f => ({ ...f, color }))}
              className={`h-8 w-8 rounded-full cursor-pointer ring-offset-2 hover:ring-2 ${form.color === color ? 'ring-2 ring-primary' : 'border'} ${getColorClass(color)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tipos de Ausência</h1>
          </div>

          <div className="flex gap-4">
            <Link href="/ausencias">
              <Button variant="outline"><CalendarClock className="w-4 h-4 mr-2" /> Ausências</Button>
            </Link>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Tipo de Ausência</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Tipo de Ausência</DialogTitle>
                  <DialogDescription>Crie uma nova categoria para classificação de ausências.</DialogDescription>
                </DialogHeader>
                {renderForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={!form.name || isSaving}>
                    {isSaving ? "Salvando..." : "Salvar Categoria"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit dialog */}
        <Dialog open={!!editItem} onOpenChange={open => { if (!open) setEditItem(null); }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Tipo de Ausência</DialogTitle>
              <DialogDescription>Atualize os dados do tipo.</DialogDescription>
            </DialogHeader>
            {renderForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!form.name || isSaving}>
                {isSaving ? "Salvando..." : "Salvar Categoria"}
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
                  <TableHead>Identificador</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={absenceTypes} strategy={verticalListSortingStrategy}>
                  {absenceTypes.map(item => {
                    const IconComponent = ICONS_MAP[item.icon || "Info"] || Tag;
                    return (
                      <SortableTableRow key={item.id} id={item.id}>
                        <TableCell>
                          <Badge variant="outline" className={getColorClass(item.color ?? "")}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {item.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
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
                              disabled={deleteAbsenceType.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </SortableTableRow>
                    );
                  })}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </Card>
      </div>
    </AppLayout>
  );
}

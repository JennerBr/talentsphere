import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Search, Plus, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";
import { useHobbyCategories, useCreateHobbyCategory, useUpdateHobbyCategory, useDeleteHobbyCategory } from "@/lib/use-data";

type EditingCategory = { id: number; name: string };

export default function AdminHobbyCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [localOrder, setLocalOrder] = useState<number[] | null>(null);
  const [editing, setEditing] = useState<EditingCategory | null>(null);

  const { data: categories = [], isLoading, isError } = useHobbyCategories();
  const createCategory = useCreateHobbyCategory();
  const updateCategory = useUpdateHobbyCategory();
  const deleteCategory = useDeleteHobbyCategory();

  const orderedCategories = localOrder
    ? localOrder.map((id) => categories.find((c) => c.id === id)).filter(Boolean) as typeof categories
    : categories;

  const filtered = orderedCategories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentOrder = localOrder ?? categories.map((c) => c.id);
      const oldIndex = currentOrder.indexOf(Number(active.id));
      const newIndex = currentOrder.indexOf(Number(over.id));
      setLocalOrder(arrayMove(currentOrder, oldIndex, newIndex));
    }
  };

  async function handleCreate() {
    if (!newName.trim()) return;
    await createCategory.mutateAsync({ name: newName.trim() });
    setNewName("");
    setCreateOpen(false);
  }

  async function handleUpdate() {
    if (!editing || !editing.name.trim()) return;
    await updateCategory.mutateAsync({ id: editing.id, name: editing.name.trim() });
    setEditing(null);
  }

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Hobby</h1>
          <Link href="/admin/hobbies">
            <Button variant="outline"><Gamepad2 className="w-4 h-4 mr-2" /> Hobbies</Button>
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Tipo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Tipo de Hobby</DialogTitle>
                  <DialogDescription>Crie uma nova categoria de hobbies.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Tipo</Label>
                    <Input
                      placeholder="Ex: Esportes Radicais"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreate} disabled={createCategory.isPending || !newName.trim()}>
                    {createCategory.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading && <p className="text-muted-foreground text-sm">Carregando tipos...</p>}
          {isError && <p className="text-destructive text-sm">Erro ao carregar tipos de hobby.</p>}

          {!isLoading && !isError && (
            <div className="rounded-md border">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          {searchTerm ? "Nenhum tipo encontrado." : "Nenhum tipo cadastrado ainda."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <SortableContext items={filtered.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        {filtered.map((item) => (
                          <SortableTableRow key={item.id} id={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                  onClick={() => setEditing({ id: item.id, name: item.name })}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                                  onClick={() => deleteCategory.mutate(item.id)}
                                  disabled={deleteCategory.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </SortableTableRow>
                        ))}
                      </SortableContext>
                    )}
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Hobby</DialogTitle>
            <DialogDescription>Altere o nome da categoria.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Tipo</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateCategory.isPending || !editing?.name.trim()}>
              {updateCategory.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Search, Plus, ActivitySquare, ThumbsUp, ThumbsDown, Shuffle, Star } from "lucide-react";
import { useState, ReactNode } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { useActionTypes } from "@/lib/use-data";

const ICON_MAP: Record<string, ReactNode> = {
  "Dar Mérito": <Star className="h-4 w-4" />,
  "Colocar a disposição": <Shuffle className="h-4 w-4" />,
  "Feedback positivo": <ThumbsUp className="h-4 w-4" />,
  "Feedback negativo": <ThumbsDown className="h-4 w-4" />,
};

const COR_MAP: Record<string, string> = {
  "yellow": "text-yellow-600 bg-yellow-100",
  "blue": "text-blue-600 bg-blue-100",
  "green": "text-green-600 bg-green-100",
  "red": "text-red-600 bg-red-100",
};

export default function AdminActionTypes() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: actionTypesData = [] } = useActionTypes();
  const [orderedIds, setOrderedIds] = useState<number[]>([]);

  const categories = orderedIds.length > 0
    ? orderedIds.map(id => actionTypesData.find(a => a.id === id)).filter(Boolean) as typeof actionTypesData
    : actionTypesData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedIds((prev) => {
        const ids = prev.length > 0 ? prev : categories.map(c => c.id);
        const oldIndex = ids.indexOf(active.id as number);
        const newIndex = ids.indexOf(over.id as number);
        return arrayMove(ids, oldIndex, newIndex);
      });
    }
  };

  const renderTableActions = () => (
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Ação</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar tipo..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Tipo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Tipo de Ação</DialogTitle>
                  <DialogDescription>Crie uma nova categoria de ação para gestores.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Tipo</Label>
                    <Input placeholder="Ex: Promover" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                    {categories.map(item => (
                      <SortableTableRow key={item.id} id={item.id}>
                        <TableCell>
                          <div className={`h-8 w-8 rounded flex items-center justify-center ${COR_MAP[item.cor ?? ""] ?? "text-gray-600 bg-gray-100"}`}>
                            {ICON_MAP[item.nome] ?? <ActivitySquare className="h-4 w-4" />}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{renderTableActions()}</TableCell>
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

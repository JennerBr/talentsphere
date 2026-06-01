import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Search, Plus, Palette, Activity, Heart, Monitor, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";

const mockHobbyCategories = [
  { id: 1, nome: "Esportes", icone: <Activity className="h-4 w-4" /> },
  { id: 2, nome: "Artes & Cultura", icone: <Palette className="h-4 w-4" /> },
  { id: 3, nome: "Gastronomia", icone: <Heart className="h-4 w-4" /> },
  { id: 4, nome: "Tecnologia", icone: <Monitor className="h-4 w-4" /> }
];

export default function AdminHobbyCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(mockHobbyCategories);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tipos de Hobby</h1>
          </div>
          <Link href="/admin/hobbies">
            <Button variant="outline"><Gamepad2 className="w-4 h-4 mr-2" /> Hobbies</Button>
          </Link>
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
                  <DialogTitle>Cadastrar Tipo de Hobby</DialogTitle>
                  <DialogDescription>Crie uma nova categoria de hobbies.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Tipo</Label>
                    <Input placeholder="Ex: Esportes Radicais" />
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
                          <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            {item.icone}
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
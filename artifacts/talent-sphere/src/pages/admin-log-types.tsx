import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag, MessageSquare } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";
import { useLogTypes } from "@/lib/use-data";

export default function AdminLogTypes() {
  const [selectedColor, setSelectedColor] = useState("blue");
  const { data: logTypesData = [] } = useLogTypes();
  const [orderedIds, setOrderedIds] = useState<number[]>([]);

  const logTypes = orderedIds.length > 0
    ? orderedIds.map(id => logTypesData.find(l => l.id === id)).filter(Boolean) as typeof logTypesData
    : logTypesData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedIds((prev) => {
        const ids = prev.length > 0 ? prev : logTypes.map(l => l.id);
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

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      green: "bg-green-100 text-green-800 border-green-300",
      amber: "bg-amber-100 text-amber-800 border-amber-300",
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
      slate: "bg-slate-100 text-slate-800 border-slate-300",
      red: "bg-red-100 text-red-800 border-red-300",
      rose: "bg-rose-100 text-rose-800 border-rose-300",
    };
    return map[color] || map.slate;
  };

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tipos de Log</h1>
          </div>
          
          <div className="flex gap-4">
            <Link href="/logbook">
              <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Logbook</Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Tipo de Log</Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Tipo de Log</DialogTitle>
                <DialogDescription>Crie uma nova categoria para classificação de interações.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input placeholder="Ex: Avaliação de Desempenho" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input placeholder="Breve explicação sobre quando usar este tipo..." />
                </div>
                <div className="space-y-2">
                  <Label>Cor de Identificação</Label>
                  <div className="flex gap-3 mt-2">
                    {["green", "amber", "blue", "purple", "slate", "red", "rose"].map(color => (
                      <div 
                        key={color} 
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full cursor-pointer border-2 transition-all ${getColorClass(color)} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary border-transparent' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Categoria</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>

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
                <SortableContext items={logTypes} strategy={verticalListSortingStrategy}>
                  {logTypes.map(item => (
                    <SortableTableRow key={item.id} id={item.id}>
                      <TableCell>
                        <Badge variant="outline" className={getColorClass(item.color ?? "")}>
                          <Tag className="h-3 w-3 mr-1" />
                          {item.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.description}</TableCell>
                      <TableCell>{renderTableActions()}</TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </Card>
      </div>
    </AppLayout>
  );
}

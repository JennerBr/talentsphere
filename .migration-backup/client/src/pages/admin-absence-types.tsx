import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag, CalendarClock, Plane, Stethoscope, Coffee, Baby, Info, CalendarOff, Clock, HeartPulse, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MOCK_ABSENCE_TYPES } from "@/lib/mock-data";
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

export default function AdminAbsenceTypes() {
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIcon, setSelectedIcon] = useState("Info");
  const [absenceTypes, setAbsenceTypes] = useState(MOCK_ABSENCE_TYPES);

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
    };
    return map[color] || map.slate;
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Tipo de Ausência</Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Tipo de Ausência</DialogTitle>
                <DialogDescription>Crie uma nova categoria para classificação de ausências.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input placeholder="Ex: Licença Luto" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input placeholder="Breve explicação sobre quando usar este tipo..." />
                </div>
                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.keys(ICONS_MAP).map(iconName => {
                      const IconComponent = ICONS_MAP[iconName];
                      return (
                        <div 
                          key={iconName}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedIcon === iconName ? 'bg-primary/10 border-primary text-primary' : 'bg-card text-muted-foreground'}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor de Identificação</Label>
                  <div className="flex gap-3 mt-2">
                    {["green", "amber", "blue", "purple", "slate", "red", "rose"].map(color => (
                      <div 
                        key={color} 
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full cursor-pointer ring-offset-2 hover:ring-2 ${selectedColor === color ? 'ring-2 ring-primary' : 'border'} ${getColorClass(color)}`}
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
                <SortableContext items={absenceTypes} strategy={verticalListSortingStrategy}>
                  {absenceTypes.map(item => {
                    const IconComponent = ICONS_MAP[item.icon || "Info"] || Tag;
                    return (
                      <SortableTableRow key={item.id} id={item.id}>
                        <TableCell>
                          <Badge variant="outline" className={getColorClass(item.color)}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {item.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
                        <TableCell>{renderTableActions()}</TableCell>
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

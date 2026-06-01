import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search, Plus, Wrench, Brain, Languages, Award, BarChart3, Radar } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTableRow } from "@/components/ui/sortable-table-row";
import { Link } from "wouter";
import { MOCK_SKILL_CATEGORIES } from "@/lib/mock-data";

const mockSkillCategories = MOCK_SKILL_CATEGORIES.map(c => ({
  ...c,
  icone: c.nome === "Hard Skill" ? <Wrench className="h-4 w-4" /> : c.nome === "Soft Skill" ? <Brain className="h-4 w-4" /> : <Languages className="h-4 w-4" />
}));

export default function AdminSkillCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(mockSkillCategories);
  const [newNiveis, setNewNiveis] = useState([3]);
  const [newTipoGrafico, setNewTipoGrafico] = useState("barras");

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
              <Input placeholder="Buscar tipo..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Tipo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Tipo de Habilidade</DialogTitle>
                  <DialogDescription>Crie uma nova categoria de habilidades.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Tipo</Label>
                    <Input placeholder="Ex: Hard Skill" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input placeholder="Ex: Habilidades técnicas" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Quantidade de Níveis</Label>
                      <span className="font-medium px-2 py-1 bg-muted rounded-md text-sm">{newNiveis[0]}</span>
                    </div>
                    <Slider 
                      defaultValue={[3]} 
                      max={5} 
                      min={1} 
                      step={1} 
                      onValueChange={setNewNiveis}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">Isso define quantas barras de progresso serão exibidas para este tipo de habilidade no PDI.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Gráfico</Label>
                    <Select value={newTipoGrafico} onValueChange={setNewTipoGrafico}>
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
                    <TableHead className="w-16">Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Gráfico</TableHead>
                    <TableHead>Níveis</TableHead>
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
                                className={`h-2 w-4 rounded-full ${i < item.niveis ? 'bg-primary' : 'bg-muted'}`}
                              />
                            ))}
                            <span className="ml-2 text-xs text-muted-foreground font-medium">{item.niveis}</span>
                          </div>
                        </TableCell>
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
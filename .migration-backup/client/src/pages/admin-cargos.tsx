import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Route } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const mockCargos = [
  { id: 1, titulo: "Desenvolvedor", trilha: "Técnica (Y)" },
  { id: 2, titulo: "Analista de Qualidade", trilha: "Técnica (Y)" },
  { id: 3, titulo: "Designer", trilha: "Técnica (Y)" },
  { id: 4, titulo: "Líder Técnico", trilha: "Gestão" }
];

export default function AdminCargos() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [cargoTitle, setCargoTitle] = useState("");
  const [cargoTrilha, setCargoTrilha] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Cargos</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cargos..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation('/admin/trilhas')}>
                <Route className="w-4 h-4 mr-2" /> 
                Gerenciar Trilhas
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Novo Cargo</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Cargo</DialogTitle>
                    <DialogDescription>Adicione um novo cargo ao plano de carreira.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Título do Cargo <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: Desenvolvedor" 
                        value={cargoTitle}
                        onChange={e => setCargoTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trilha <span className="text-red-500">*</span></Label>
                      <Select value={cargoTrilha} onValueChange={setCargoTrilha}>
                        <SelectTrigger><SelectValue placeholder="Selecione a trilha..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Técnica (Y)</SelectItem>
                          <SelectItem value="man">Gestão</SelectItem>
                          <SelectItem value="op">Operacional</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Cada cargo deve obrigatoriamente pertencer a uma trilha.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button disabled={!cargoTitle || !cargoTrilha} onClick={() => setIsDialogOpen(false)}>Salvar Cargo</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCargos.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.titulo}</TableCell>
                    <TableCell>{item.trilha}</TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
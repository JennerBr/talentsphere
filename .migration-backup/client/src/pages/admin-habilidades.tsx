import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Wrench, Brain, Languages } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const mockHabilidades = [
  { id: 1, nome: "React", categoria: "Hard Skill", funcoesId: [1], icon: <Wrench className="h-4 w-4" /> },
  { id: 2, nome: "Node.js", categoria: "Hard Skill", funcoesId: [2], icon: <Wrench className="h-4 w-4" /> },
  { id: 3, nome: "Python", categoria: "Hard Skill", funcoesId: [2, 3], icon: <Wrench className="h-4 w-4" /> },
  { id: 4, nome: "Liderança", categoria: "Soft Skill", funcoesId: [], icon: <Brain className="h-4 w-4" /> },
  { id: 5, nome: "Inglês", categoria: "Idioma", funcoesId: [1, 2, 3], icon: <Languages className="h-4 w-4" /> }
];

export default function AdminHabilidades() {
  const [searchTerm, setSearchTerm] = useState("");
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
          <h1 className="text-3xl font-bold tracking-tight">Habilidades</h1>
          <Link href="/admin/habilidades/tipos">
            <Button variant="outline"><Wrench className="w-4 h-4 mr-2" /> Tipos de Habilidades</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar habilidades..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Habilidade</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Habilidade</DialogTitle>
                  <DialogDescription>Adicione skills (hard ou soft) ao catálogo da organizacao.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da Habilidade</Label>
                    <Input placeholder="Ex: React, Liderança, AWS..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria (Tipo de Habilidade)</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hard">Hard Skill</SelectItem>
                        <SelectItem value="soft">Soft Skill</SelectItem>
                        <SelectItem value="idioma">Idioma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Habilidade</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Uso (Funções Associadas)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHabilidades.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {item.icon}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      <Badge variant={item.categoria === "Hard Skill" ? "default" : item.categoria === "Soft Skill" ? "secondary" : "outline"}>
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.funcoesId.length} função(ões)</TableCell>
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
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Camera, Dumbbell, ChefHat, Gamepad2, Heart, Palette } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const mockHobbies = [
  { id: 1, nome: "Futebol", categoria: "Esportes", icon: <Dumbbell className="h-4 w-4" /> },
  { id: 2, nome: "Fotografia", categoria: "Artes & Cultura", icon: <Camera className="h-4 w-4" /> },
  { id: 3, nome: "Culinária", categoria: "Gastronomia", icon: <ChefHat className="h-4 w-4" /> },
  { id: 4, nome: "Videogames", categoria: "Tecnologia", icon: <Gamepad2 className="h-4 w-4" /> }
];

export default function AdminHobbies() {
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
          <h1 className="text-3xl font-bold tracking-tight">Hobbies</h1>
          <Link href="/admin/hobbies/tipos">
            <Button variant="outline"><Palette className="w-4 h-4 mr-2" /> Tipos de Hobby</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar hobbies..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Hobby</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Hobby</DialogTitle>
                  <DialogDescription>Adicione interesses para enriquecer os perfis dos colaboradores.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Hobby</Label>
                    <Input placeholder="Ex: Tocar Violão, Futebol..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria (Tipo de Hobby)</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esportes">Esportes</SelectItem>
                        <SelectItem value="artes">Artes & Cultura</SelectItem>
                        <SelectItem value="gastronomia">Gastronomia</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ícone (Lucide)</Label>
                    <Input placeholder="Ex: Camera, Gamepad2..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Hobby</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ícone</TableHead>
                  <TableHead>Hobby</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHobbies.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {item.icon}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell><Badge variant="secondary">{item.categoria}</Badge></TableCell>
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
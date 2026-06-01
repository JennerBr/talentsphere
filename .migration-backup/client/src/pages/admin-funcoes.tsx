import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";

const mockHabilidades = [
  { id: 1, nome: "React" },
  { id: 2, nome: "Node.js" },
  { id: 3, nome: "Python" }
];

const mockFuncoes = [
  { id: 1, nome: "Desenvolvedor Front-end", departamento: "Engenharia", habilidades: ["React", "TypeScript", "CSS"] },
  { id: 2, nome: "Desenvolvedor Back-end", departamento: "Engenharia", habilidades: ["Node.js", "Python", "SQL"] },
  { id: 3, nome: "Engenheiro de Dados", departamento: "Dados", habilidades: ["Python", "SQL", "Spark"] },
  { id: 4, nome: "UX Designer", departamento: "Produto", habilidades: ["Figma", "Research", "Prototipagem"] }
];

export default function AdminFuncoes() {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar funções..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Função</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Função</DialogTitle>
                  <DialogDescription>Mapeie os papéis e especialidades da organizacao.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da Função</Label>
                    <Input placeholder="Ex: Desenvolvedor Front-end" />
                  </div>
                  <div className="space-y-2">
                    <Label>Departamento/Área</Label>
                    <Input placeholder="Ex: Engenharia de Software" />
                  </div>
                  <div className="space-y-2">
                    <Label>Habilidades Relacionadas (Mapeamento)</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione habilidades..." /></SelectTrigger>
                      <SelectContent>
                        {mockHabilidades.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Isso ajuda a fazer o match entre talentos e vagas no sistema.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Função</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Habilidades Core</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFuncoes.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{item.departamento}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.habilidades.map(hab => (
                          <Badge key={hab} variant="outline" className="text-xs">{hab}</Badge>
                        ))}
                      </div>
                    </TableCell>
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
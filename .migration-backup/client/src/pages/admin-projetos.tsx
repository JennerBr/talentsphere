import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_PROJECTS, MOCK_USERS } from "@/lib/mock-data";
import { MOCK_COMPANIES } from "@/lib/company-context";

export default function AdminProjetos() {
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar projetos..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Projeto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Projeto</DialogTitle>
                  <DialogDescription>Crie um novo projeto para alocação de talentos.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Projeto</Label>
                    <Input placeholder="Ex: Migração Cloud V2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cliente / Área Requisitante</Label>
                    <Input placeholder="Ex: Financeiro" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Início</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue="planejamento">
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejamento">Planejamento</SelectItem>
                          <SelectItem value="andamento">Em Andamento</SelectItem>
                          <SelectItem value="pausado">Pausado</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Projeto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Stakeholders</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PROJECTS.map(item => {
                  const company = MOCK_COMPANIES.find(c => c.id === item.organizacao_id?.toString()) || MOCK_COMPANIES[0];
                  return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {company.logo ? (
                          <div className="h-6 w-6 rounded border overflow-hidden shrink-0">
                            <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded border bg-muted flex items-center justify-center shrink-0">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.clients}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {item.stakeholders?.map(id => {
                          const user = MOCK_USERS.find(u => u.id === id);
                          if (!user) return null;
                          return (
                            <Avatar key={id} className="h-8 w-8 border-2 border-background" title={user.name}>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {(!item.stakeholders || item.stakeholders.length === 0) && (
                          <span className="text-xs text-muted-foreground ml-2">Nenhum</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.startDate ? item.startDate.toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === 'Em andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.status === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

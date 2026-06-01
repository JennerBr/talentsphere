import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTeams, useDeleteTeam } from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrganizações() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: teams = [] } = useTeams();
  const deleteTeam = useDeleteTeam();
  const { toast } = useToast();

  const filtered = teams.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.cnpj ?? "").includes(searchTerm)
  );

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Excluir o team "${name}"? Esta ação não pode ser desfeita.`)) return;
    deleteTeam.mutate(id, {
      onSuccess: () => { toast({ title: "Team excluído." }); },
      onError: (err) => { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); },
    });
  };

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar teams..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setLocation("/admin/organizacoes/nova")}><Plus className="w-4 h-4 mr-2" /> Novo Team</Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome do Team</TableHead>
                  <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Business Units</TableHead>
                  <TableHead className="hidden md:table-cell">Domínios Permitidos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.logo && <img src={item.logo} alt={`Logo ${item.name}`} className="w-8 h-8 rounded border object-cover" />}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">—</TableCell>
                    <TableCell className="hidden md:table-cell">—</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{item.status ?? "Ativo"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => setLocation(`/admin/organizacoes/${item.id}`)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deleteTeam.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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

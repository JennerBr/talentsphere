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
import { useLocation } from "wouter";

const mockOrganizações = [
  { 
    id: 1, 
    nome: "Tech Corp", 
    cnpj: "12.345.678/0001-90", 
    dominios: ["@techcorp.com.br", "@tc.com"], 
    businessUnits: ["Varejo", "Atacado"],
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format",
    status: "Ativo" 
  },
  { 
    id: 2, 
    nome: "Inova Systems", 
    cnpj: "98.765.432/0001-10", 
    dominios: ["@inova.com.br"], 
    businessUnits: ["Digital"],
    logo: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=100&h=100&fit=crop&auto=format",
    status: "Ativo" 
  }
];

export default function AdminOrganizações() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const renderTableActions = () => (
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/organizacoes/1')} className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
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
          <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar organizacoes..." className="pl-8" />
            </div>
            <Button onClick={() => setLocation("/admin/organizacoes/nova")}><Plus className="w-4 h-4 mr-2" /> Nova Organização</Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome da Organização</TableHead>
                  <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Business Units</TableHead>
                  <TableHead className="hidden md:table-cell">Domínios Permitidos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrganizações.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={item.logo} alt={`Logo ${item.nome}`} className="w-8 h-8 rounded border object-cover" />
                        <span className="font-medium">{item.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {item.businessUnits.map(bu => (
                          <Badge key={bu} variant="outline" className="text-xs">{bu}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {item.dominios.map(d => (
                          <Badge key={d} variant="secondary" className="text-xs font-normal">{d}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{item.status}</Badge></TableCell>
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
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, CheckCircle2, Clock, CalendarClock } from "lucide-react";
import { useState } from "react";
import { MOCK_USERS } from "@/lib/mock-data";
import { Link } from "wouter";

const ABSENCE_TYPES = [
  { id: "ferias", label: "Férias" },
  { id: "licenca_medica", label: "Licença Médica" },
  { id: "folga", label: "Folga Compensatória" },
  { id: "licenca_paternidade", label: "Licença Paternidade/Maternidade" },
  { id: "outro", label: "Outro" }
];

const MOCK_ABSENCES = [
  { id: 1, userId: 1, type: "ferias", startDate: "2024-07-01", endDate: "2024-07-15", status: "aprovado", approvedDate: "2024-06-15" },
  { id: 2, userId: 3, type: "licenca_medica", startDate: "2024-05-10", endDate: "2024-05-12", status: "aprovado", approvedDate: "2024-05-10" },
  { id: 3, userId: 1, type: "folga", startDate: "2024-08-20", endDate: "2024-08-21", status: "aguardando", approvedDate: null },
];

export default function AbsenceManagement() {
  const [isGestor, setIsGestor] = useState(true); // Toggle para simular visão

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Ausências</h1>
          </div>
          
          <div className="flex gap-4">
            <Link href="/admin/absence-types">
              <Button variant="outline"><CalendarClock className="w-4 h-4 mr-2" /> Tipos de Ausência</Button>
            </Link>
            <Button variant="outline" onClick={() => setIsGestor(!isGestor)}>
              Simular como {isGestor ? "Liderado" : "Gestor"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Ausência</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Ausência</DialogTitle>
                  <DialogDescription>
                    Informe o período e motivo da ausência.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {isGestor && (
                    <div className="space-y-2">
                      <Label>Colaborador</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o colaborador" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_USERS.map(user => (
                            <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Tipo de Ausência</Label>
                    <Select defaultValue="ferias">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {ABSENCE_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Inicial</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Final</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo / Observações</Label>
                    <Input placeholder="Detalhes adicionais se necessário..." />
                  </div>
                  {isGestor && (
                    <div className="space-y-2 border-t pt-4 mt-2">
                      <Label className="text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Data de Autorização
                      </Label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Registrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Autorização</TableHead>
                {isGestor && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ABSENCES.filter(a => isGestor ? true : a.userId === 1).map(absence => {
                const user = MOCK_USERS.find(u => u.id === absence.userId);
                const type = ABSENCE_TYPES.find(t => t.id === absence.type)?.label;
                const startDateStr = new Date(absence.startDate).toLocaleDateString('pt-BR');
                const endDateStr = new Date(absence.endDate).toLocaleDateString('pt-BR');
                
                return (
                  <TableRow key={absence.id}>
                    <TableCell className="font-medium">{user?.name}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {startDateStr} a {endDateStr}
                      </div>
                    </TableCell>
                    <TableCell>
                      {absence.status === 'aprovado' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Aprovado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Aguardando
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {absence.approvedDate ? (
                        <span className="text-sm">{new Date(absence.approvedDate).toLocaleDateString('pt-BR')}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Pendente
                        </span>
                      )}
                    </TableCell>
                    {isGestor && (
                      <TableCell className="text-right">
                        {absence.status === 'aguardando' && (
                          <Button variant="outline" size="sm" className="h-8">
                            Aprovar
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}

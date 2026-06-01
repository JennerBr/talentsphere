import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function EmployeeDashboard() {
  const brainDominanceData = [
    { name: 'Experimental', value: 35, fill: 'var(--color-chart-1)' },
    { name: 'Analítico', value: 25, fill: 'var(--color-chart-2)' },
    { name: 'Prático', value: 15, fill: 'var(--color-chart-3)' },
    { name: 'Interpessoal', value: 25, fill: 'var(--color-chart-4)' },
  ];

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Radar (Farol)</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">Grade: PL3</Badge>
            <Badge variant="outline" className="px-3 py-1 border-primary/30 text-primary">Próximo Ciclo: Out/2024</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1 border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Resumo do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Motivadores (Drivers)</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Autonomia</Badge>
                  <Badge>Propósito</Badge>
                  <Badge>Especialização Técnica</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Personalidade (Jung)</p>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div><span className="text-muted-foreground block text-xs">Energia</span> Extrovertido</div>
                  <div><span className="text-muted-foreground block text-xs">Informação</span> Intuitivo</div>
                  <div><span className="text-muted-foreground block text-xs">Decisão</span> Racional</div>
                  <div><span className="text-muted-foreground block text-xs">Estilo</span> Multifocado</div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">Dominância Cerebral</p>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brainDominanceData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={80} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                        {
                          brainDominanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Objetivos do PDI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Melhorar Comunicação (Apresentação)</span>
                        <span className="text-muted-foreground">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Ação: Realizar 2 tech talks no Q2.</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Certificação AWS Solutions Architect</span>
                        <span className="text-muted-foreground">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Ação: Estudar 4h/semana e agendar prova para Junho.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
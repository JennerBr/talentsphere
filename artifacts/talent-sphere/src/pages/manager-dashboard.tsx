import { AppLayout } from "@/components/layout/app-layout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2,
  Mic,
  Send
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ManagerDashboard() {
  const teamStats = [
    { label: "Total no Time", value: "12", icon: Users, trend: "+2 neste semestre" },
    { label: "Média de Entregas", value: "8.5", icon: TrendingUp, trend: "+0.3 vs último ciclo" },
    { label: "Feedbacks Pendentes", value: "3", icon: AlertCircle, trend: "Ação necessária", alert: true },
    { label: "1:1s na Semana", value: "4", icon: MessageSquare, trend: "Dentro do planejado" },
  ];

  const recentLogbooks = [
    { id: 1, name: "João Silva", type: "Elogio", date: "Hoje", desc: "Excelente entrega no Projeto Alpha. Prazo e qualidade superados." },
    { id: 2, name: "Maria Costa", type: "Correção", date: "Ontem", desc: "Atraso no report semanal. Necessário alinhar gestão de tempo." },
    { id: 3, name: "Carlos Santos", type: "1:1", date: "Segunda", desc: "Alinhamento de PDI. Foco em Power Skills (Comunicação)." },
  ];

  return (
    <AppLayout role="manager" userName="Alexandre Líder" userTitle="Tech Manager / Squad A">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className={stat.alert ? "border-destructive/50 shadow-sm shadow-destructive/10" : ""}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.alert ? 'text-destructive' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 ${stat.alert ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Chat Interface */}
          <Card className="lg:col-span-2 border-primary/20 shadow-md shadow-primary/5">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    Assistente de Gestão (IA)
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mic className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                    <p>Olá, Alexandre! Como posso ajudar na gestão do seu time hoje?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Quem conhece React?</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Ver 9box da Maria</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Registrar elogio pro João</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                    Qual foi a nota de entrega do João no Projeto 3?
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white">
                    A
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mic className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                    <p>No <strong>Projeto Alpha (3)</strong>, João Silva obteve nota <strong>9.2</strong>.</p>
                    <p className="mt-1"><strong>Pontos Fortes:</strong> Qualidade técnica, proatividade.</p>
                    <p><strong>A desenvolver:</strong> Comunicação com o cliente.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-background mt-auto">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="shrink-0 rounded-full h-10 w-10">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Input 
                    placeholder="Digite sua pergunta ou comando para o logbook..." 
                    className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1"
                  />
                  <Button size="icon" className="shrink-0 rounded-full h-10 w-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Dica: Envie áudio para registrar anotações de 1:1 rapidamente.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Atividades Recentes (Logbook)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLogbooks.map(log => (
                  <div key={log.id} className="flex gap-3 items-start relative pb-4 last:pb-0">
                    <div className="absolute left-[15px] top-6 bottom-0 w-px bg-border last:hidden" />
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 
                      ${log.type === 'Elogio' ? 'bg-green-100 text-green-600' : 
                        log.type === 'Correção' ? 'bg-primary/20 text-primary' : 'bg-blue-100 text-blue-600'}`}>
                      {log.type === 'Elogio' ? <TrendingUp className="h-4 w-4" /> : 
                       log.type === 'Correção' ? <AlertCircle className="h-4 w-4" /> : 
                       <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{log.name}</p>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{log.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{log.desc}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs h-8">Ver todo o logbook</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Próximos 1:1s</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/150?u=Maria@exemplo.com" />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Maria Costa</p>
                      <p className="text-xs text-muted-foreground">Amanhã, 14:00</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="h-7 text-xs">Preparar Pauta</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/150?u=Carlos@exemplo.com" />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Carlos Santos</p>
                      <p className="text-xs text-muted-foreground">Qui, 10:00</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Ver PDI</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
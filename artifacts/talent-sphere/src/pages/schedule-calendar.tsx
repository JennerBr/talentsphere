import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMembers, useAbsenceTypes } from "@/lib/use-data";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Video, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Cake, Briefcase, Plane, Stethoscope, Coffee, Baby, CalendarOff, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const ICONS_MAP: Record<string, React.ElementType> = {
  Plane,
  Stethoscope,
  Coffee,
  Baby,
  Info,
  CalendarOff,
  Clock,
  HeartPulse
};

// Mock data for schedules
const MOCK_EVENTS = [
  { id: 1, title: "Reunião de Alinhamento 1:1", date: new Date(), type: "1:1", time: "10:00 - 11:00", attendees: [1, 2], platform: "Google Meet" },
  { id: 2, title: "Review do Projeto Alpha", date: new Date(), type: "projeto", time: "14:00 - 15:30", attendees: [1, 3, 5], platform: "Zoom" },
  { id: 3, title: "Treinamento de Liderança", date: new Date(new Date().setDate(new Date().getDate() + 1)), type: "treinamento", time: "09:00 - 12:00", attendees: [1, 4], platform: "Presencial" },
  { id: 4, title: "Reunião de Feedback", date: new Date(new Date().setDate(new Date().getDate() - 1)), type: "1:1", time: "16:00 - 16:30", attendees: [2, 6], platform: "Google Meet" },
  { id: 5, title: "Apresentação de Resultados", date: new Date(new Date().setDate(new Date().getDate() + 2)), type: "geral", time: "10:00 - 11:30", attendees: [1, 2, 3, 4, 5, 6], platform: "Teams" },
];

const MOCK_ABSENCES = [
  { id: 1, userId: 2, type: "ferias", label: "Férias", date: new Date() },
  { id: 2, userId: 3, type: "licenca_medica", label: "Licença Médica", date: new Date() },
  { id: 3, userId: 4, type: "folga", label: "Folga", date: new Date(new Date().setDate(new Date().getDate() + 2)) },
  { id: 4, userId: 5, type: "outro", label: "Treinamento Externo", date: new Date(new Date().setDate(new Date().getDate() + 5)) },
  { id: 5, userId: 2, type: "ferias", label: "Férias", date: new Date(new Date().setDate(new Date().getDate() + 1)) },
  { id: 6, userId: 4, type: "folga", label: "Folga", date: new Date() },
];

export const getAbsenceColorClass = (color: string) => {
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    amber: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    blue: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    purple: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    slate: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800",
    red: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    rose: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  };
  return map[color] || map.slate;
};

export default function ScheduleCalendar() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: employees = [] } = useMembers();
  const { data: absenceTypes = [] } = useAbsenceTypes();
  
  const [selectedUser, setSelectedUser] = useState<string>("1");

  const directReports = employees.filter(u => u.turma === employees.find(user => user.id.toString() === selectedUser)?.turma && u.id.toString() !== selectedUser);
  const relevantUserIds = [parseInt(selectedUser), ...directReports.map(u => u.id)];

  const filteredEvents = MOCK_EVENTS.filter(event => 
    event.attendees.some(att => relevantUserIds.includes(att)) &&
    isSameDay(event.date, selectedDate)
  );

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <AppLayout role="employee" userName="João Silva" userTitle="Engenheiro de Software Pleno">
      <div className="space-y-6 w-full max-w-full px-2 sm:px-6 pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário da Equipe</h1>
          </div>
          
          <div className="w-full sm:w-72">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pessoa" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader className="pb-4 flex flex-row items-center justify-between border-b bg-card">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <Button variant="outline" onClick={today}>
                  Hoje
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-7 border-b bg-muted/20">
                  {weekDays.map(day => (
                    <div key={day} className="py-4 text-center font-bold text-sm text-foreground border-r last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-fr">
                  {calendarDays.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);
                    const isDayToday = isToday(day);
                    
                    const dayAbsences = MOCK_ABSENCES.filter(a => 
                      isSameDay(a.date, day) && relevantUserIds.includes(a.userId)
                    );
                    
                    const dayBirthdays = employees.filter(u => {
                      if (!u.birthday) return false;
                      const [, m, d] = u.birthday.split('-');
                      return parseInt(m) === day.getMonth() + 1 && parseInt(d) === day.getDate() && relevantUserIds.includes(u.id);
                    });

                    const dayAnniversaries = employees.filter(u => {
                      if (!u.contractDate) return false;
                      const [, m, d] = u.contractDate.split('-');
                      return parseInt(m) === day.getMonth() + 1 && parseInt(d) === day.getDate() && relevantUserIds.includes(u.id);
                    });

                    return (
                      <div 
                        key={day.toString()} 
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "min-h-[200px] sm:min-h-[220px] p-2 sm:p-3 border-r border-b cursor-pointer transition-all relative flex flex-col gap-2",
                          !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                          isSelected && "bg-primary/5 ring-2 ring-primary ring-inset z-10 shadow-sm",
                          !isSelected && "hover:bg-muted/50",
                          dayIdx % 7 === 6 && "border-r-0"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "text-sm sm:text-base font-bold h-8 w-8 flex items-center justify-center rounded-full",
                            isDayToday && "bg-primary text-primary-foreground shadow-md",
                            isSelected && !isDayToday && "bg-foreground text-background",
                            !isDayToday && !isSelected && !isCurrentMonth && "text-muted-foreground/50",
                            !isDayToday && !isSelected && isCurrentMonth && "text-foreground"
                          )}>
                            {format(day, 'd')}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                          {dayAbsences.map(absence => {
                            const user = employees.find(u => u.id === absence.userId);
                            if (!user) return null;
                            
                            const absenceType = absenceTypes.find(t => t.type === absence.type) || absenceTypes.find(t => t.type === "outro") || absenceTypes[0];
                            if (!absenceType) return null;
                            const colorClass = getAbsenceColorClass(absenceType.color ?? "slate");
                            const IconComponent = ICONS_MAP[absenceType.icon ?? "Info"] || Info;
                            
                            return (
                              <div 
                                key={absence.id} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation("/ausencias");
                                }}
                                className={cn(
                                  "text-xs leading-tight py-1.5 pr-2 pl-4 rounded-md border font-medium flex items-center justify-between shadow-sm hover:shadow-md hover:ring-1 transition-all cursor-pointer relative ml-[14px] mb-1 group",
                                  colorClass
                                )}
                                title={`${user.name} - ${absenceType.name}`}
                              >
                                <Avatar className="h-[26px] w-[26px] shrink-0 border-2 border-background shadow-sm absolute -left-3.5 z-10">
                                  <AvatarImage src={user.avatar ?? undefined} />
                                  <AvatarFallback className="text-[9px]">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1"></div>
                                <IconComponent className="h-4 w-4 shrink-0 opacity-80 group-hover:hidden" />
                                <span className="hidden group-hover:block text-[9px] uppercase tracking-wider font-bold opacity-100 truncate ml-1 text-right">
                                  {absenceType.name}
                                </span>
                              </div>
                            );
                          })}
                          
                          {dayBirthdays.map(user => (
                            <div 
                              key={`bd-${user.id}`}
                              className="text-xs leading-tight py-1.5 pr-2 pl-4 rounded-md border font-medium flex items-center shadow-sm hover:shadow-md hover:ring-1 transition-all cursor-pointer relative ml-[14px] mb-1 bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800"
                              title={`${user.name} - Aniversário`}
                            >
                              <Avatar className="h-[26px] w-[26px] shrink-0 border-2 border-background shadow-sm absolute -left-3.5 z-10">
                                <AvatarImage src={user.avatar ?? undefined} />
                                <AvatarFallback className="text-[9px]">{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] uppercase tracking-wider font-bold opacity-90 truncate w-full text-center flex items-center justify-center gap-1">
                                Aniversário <Cake className="h-3 w-3 inline" />
                              </span>
                            </div>
                          ))}
                          {dayAnniversaries.map(user => (
                            <div 
                              key={`ann-${user.id}`}
                              className="text-xs leading-tight py-1.5 pr-2 pl-4 rounded-md border font-medium flex items-center shadow-sm hover:shadow-md hover:ring-1 transition-all cursor-pointer relative ml-[14px] mb-1 bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                              title={`${user.name} - Aniversário de Empresa`}
                            >
                              <Avatar className="h-[26px] w-[26px] shrink-0 border-2 border-background shadow-sm absolute -left-3.5 z-10">
                                <AvatarImage src={user.avatar ?? undefined} />
                                <AvatarFallback className="text-[9px]">{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] uppercase tracking-wider font-bold opacity-90 truncate w-full text-center flex items-center justify-center gap-1">
                                Tempo de Casa <Briefcase className="h-3 w-3 inline" />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-3 bg-muted/10 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Equipe Direta Ativa no Filtro
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={employees.find(u => u.id.toString() === selectedUser)?.avatar ?? ""} />
                      <AvatarFallback>VO</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">Você</span>
                      <span className="text-xs text-muted-foreground">{employees.find(u => u.id.toString() === selectedUser)?.name}</span>
                    </div>
                  </div>
                  
                  {directReports.map(report => (
                    <div key={report.id} className="flex items-center gap-3 px-4 py-2 rounded-full border bg-card shadow-sm">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={report.avatar ?? undefined} />
                        <AvatarFallback>{report.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{report.name}</span>
                        <span className="text-xs text-muted-foreground">{report.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b bg-muted/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Clock className="h-5 w-5 text-primary" />
                    Agenda de Programações
                  </CardTitle>
                  <p className="text-sm font-semibold text-primary capitalize px-3 py-1 bg-primary/10 rounded-full">
                    {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <div key={event.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl hover:border-primary/40 transition-colors bg-card shadow-sm">
                        <div className="flex sm:flex-col items-center sm:items-start justify-start min-w-[100px] shrink-0 sm:border-r sm:pr-4">
                          <span className="font-bold text-foreground text-lg tracking-tight">{event.time.split(' - ')[0]}</span>
                          <span className="text-sm text-muted-foreground sm:mt-1 ml-2 sm:ml-0">até {event.time.split(' - ')[1]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-base">{event.title}</h4>
                            <Badge variant={event.type === '1:1' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                              {event.type}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                              <Video className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground">{event.platform}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <div className="flex -space-x-2 ml-1">
                                {event.attendees.map(attId => {
                                  const attUser = employees.find(u => u.id === attId);
                                  if (!attUser) return null;
                                  return (
                                    <Avatar key={attId} className="h-8 w-8 border-2 border-background shadow-sm" title={attUser.name}>
                                      <AvatarImage src={attUser.avatar ?? undefined} />
                                      <AvatarFallback>{attUser.name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-muted/10 rounded-xl border-2 border-dashed">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-foreground">Agenda Livre</p>
                        <p className="text-sm text-muted-foreground mt-1">Não há eventos marcados para os usuários do filtro nesta data.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legenda de Cores no Rodapé */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border mt-6">
            <span className="text-sm font-semibold flex items-center gap-1.5 mr-2">
              <Info className="h-4 w-4" /> Legenda:
            </span>
            {absenceTypes.map(type => (
              <div key={type.id} className={cn("px-2.5 py-1 rounded text-xs font-medium border shadow-sm", getAbsenceColorClass(type.color ?? "slate"))}>
                {type.name}
              </div>
            ))}
            <div className="px-2.5 py-1 rounded text-xs font-medium border shadow-sm bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800 flex items-center gap-1">
              <Cake className="h-3 w-3" /> Aniversários
            </div>
            <div className="px-2.5 py-1 rounded text-xs font-medium border shadow-sm bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> Tempo de Casa
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

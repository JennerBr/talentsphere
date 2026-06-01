import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, ChevronRight, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";
import { useMembers } from "@/lib/use-data";

interface StudentSelectorModalProps {
  onSelect?: (studentId: number) => void;
  trigger?: React.ReactNode;
}

export function StudentSelectorModal({ onSelect, trigger }: StudentSelectorModalProps = {}) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { data: employees = [] } = useMembers();
  
  // Get unique values for filters
  const allProjects = Array.from(new Set(employees.map(s => s.project).filter(Boolean))) as string[];
  const allTurmas = Array.from(new Set(employees.map(s => s.turma).filter(Boolean))) as string[];

  const handleStudentClick = (studentId: number) => {
    setOpen(false);
    if (onSelect) {
      onSelect(studentId);
    } else {
      setLocation(`/profile?id=${studentId}`);
    }
  };

  const filteredStudents = employees.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.role ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedFilter) {
      if (allProjects.includes(selectedFilter)) return student.project === selectedFilter;
      if (allTurmas.includes(selectedFilter)) return student.turma === selectedFilter;
    }
    
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="shrink-0" title="Acesso Rápido: Talentos">
            <GraduationCap className="h-4 w-4 text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Acesso Rápido: Talentos</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 overflow-hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar talento por nome ou cargo..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0" title="Busca Avançada">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2">
              <Badge 
                variant={selectedFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedFilter(null)}
              >
                Todos
              </Badge>
              
              <div className="w-px h-5 bg-border mx-1 self-center" />
              
              {allTurmas.map(turma => (
                <Badge 
                  key={turma}
                  variant={selectedFilter === turma ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter(selectedFilter === turma ? null : turma)}
                >
                  {turma}
                </Badge>
              ))}
              
              <div className="w-px h-5 bg-border mx-1 self-center" />
              
              {allProjects.map(project => (
                <Badge 
                  key={project}
                  variant={selectedFilter === project ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedFilter(selectedFilter === project ? null : project)}
                >
                  {project}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Quick Access Row inside Modal */}
          <div className="w-full border-y py-3 bg-muted/20">
            <ScrollArea className="w-full">
              <div className="flex w-max space-x-3 pb-2 pt-1 px-1">
                {employees.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleStudentClick(student.id)}
                    className="flex flex-col items-center gap-1 group transition-transform hover:-translate-y-1"
                    style={{ width: '64px' }}
                  >
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-transparent group-hover:border-primary transition-colors shadow-sm">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${student.name}`} />
                      <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-medium leading-tight text-center line-clamp-1 w-full mt-1">
                      {student.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 -mx-4 px-4 h-[40vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pb-4">
              {filteredStudents.map(student => (
                <div 
                  key={student.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => handleStudentClick(student.id)}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${student.name}`} />
                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.turma} • {student.project}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  Nenhum talento encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

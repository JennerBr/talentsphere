import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut, Building2, Network, Briefcase, Wrench, FileCode2, Gamepad2, CalendarClock, CalendarDays, Award, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SidebarProps {
  role: "manager" | "employee";
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ role, className, onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  const isDualRole = userEmail === "jenner.lopes@institutojef.org.br";
  // const showManagerLinks = role === "manager" || isDualRole;
  const showManagerLinks = true; // Liberado por padrão temporariamente

  const managerLinks = [
    { href: "/manager", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/manager/team", label: "Equipe", icon: Users },
    { href: "/manager/mobility", label: "Movimentações", icon: Users },
  ];

  const adminLinks = [
    { href: "/admin/organizacoes", label: "Organizações", icon: Building2 },
    { href: "/admin/posicoes", label: "Departamentos", icon: Network },
    { href: "/admin/cargos", label: "Cargos", icon: Briefcase },
    { href: "/admin/funcoes", label: "Funções", icon: FileCode2 },
    { href: "/admin/habilidades", label: "Habilidades", icon: Award },
    { href: "/admin/hobbies", label: "Hobbies", icon: Gamepad2 },
    { href: "/admin/action-types", label: "Tipos de Ações", icon: FileCode2 },
  ];

  const employeeLinks = [
    { href: "/profile", label: "Perfil", icon: UserCircle },
    { href: "/pdi", label: "Meu PDI", icon: BookOpen },
    { href: "/ausencias", label: "Ausências", icon: CalendarClock },
    { href: "/calendar", label: "Calendário", icon: CalendarDays },
    { href: "/projetos", label: "Projetos", icon: Briefcase },
  ];

  return (
    <div className={cn("flex flex-col w-64 border-r bg-card h-full shrink-0", className)}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <Network className="h-5 w-5 text-primary-foreground" />
          </div>
          TalentSphere
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4 pb-4">
        {[...employeeLinks, ...managerLinks].map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (link.href !== "/manager" && location.startsWith(link.href));
          const isExactActive = link.href === "/manager" ? location === link.href : isActive;
          
          return (
            <Link key={link.href} href={link.href}>
              <a
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isExactActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            </Link>
          );
        })}

        <div className="my-4 border-t border-border/50 pt-4" />
        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu Admin
        </div>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
          const isExactActive = link.href === "/admin" ? location === "/admin" : isActive;
          
          return (
            <Link key={link.href} href={link.href}>
              <a
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isExactActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link href="/login">
          <a 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => localStorage.removeItem("userEmail")}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </a>
        </Link>
      </div>
    </div>
  );
}

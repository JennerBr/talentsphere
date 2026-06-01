const fs = require('fs');

const filePath = 'client/src/components/layout/sidebar.tsx';

const newContent = `import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut } from "lucide-react";
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
  const showManagerLinks = role === "manager" || isDualRole;

  const managerLinks = [
    { href: "/manager", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/manager/team", label: "Meu Time", icon: Users },
    { href: "/manager/chat", label: "Assistente IA", icon: MessageSquare },
    { href: "/manager/logbook", label: "Logbook & 1:1", icon: BookOpen },
    { href: "/manager/mobility", label: "Movimentações", icon: Users },
  ];

  const employeeLinks = [
    { href: "/employee", label: "Meu Radar", icon: LayoutDashboard },
    { href: "/employee/projects", label: "Meus Projetos", icon: BookOpen },
    { href: "/employee/pdi", label: "Meu PDI", icon: BookOpen },
    { href: "/employee/logbook", label: "Histórico 1:1", icon: MessageSquare },
  ];

  return (
    <div className={cn("flex flex-col w-64 border-r bg-card h-full shrink-0", className)}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-sm">TS</span>
          </div>
          TalentSphere
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        <div className="px-3 mb-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu de Talentos
        </div>
        {employeeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (link.href !== "/employee" && location.startsWith(link.href));
          const isExactActive = link.href === "/employee" ? location === "/employee" : isActive;
          
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
                data-testid={\`nav-link-\${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}\`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            </Link>
          );
        })}

        {showManagerLinks && (
          <>
            <div className="my-4 border-t border-border/50 pt-4" />
            <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu do Gestor
            </div>
            {managerLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || (link.href !== "/manager" && location.startsWith(link.href));
              const isExactActive = link.href === "/manager" ? location === "/manager" : isActive;
              
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
                    data-testid={\`nav-link-\${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}\`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </Link>
              );
            })}
          </>
        )}
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
`;

fs.writeFileSync(filePath, newContent);
console.log("Updated Sidebar successfully");

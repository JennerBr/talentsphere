const fs = require('fs');
const file = 'client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut } from "lucide-react";`,
  `import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut, Settings } from "lucide-react";`
);

content = content.replace(
  `  const managerLinks = [
    { href: "/manager", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/manager/team", label: "Meu Time", icon: Users },
    { href: "/manager/chat", label: "Assistente IA", icon: MessageSquare },
    { href: "/manager/logbook", label: "Logbook & 1:1", icon: BookOpen },
    { href: "/manager/mobility", label: "Movimentações", icon: Users },
  ];`,
  `  const managerLinks = [
    { href: "/manager", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/manager/team", label: "Meu Time", icon: Users },
    { href: "/manager/chat", label: "Assistente IA", icon: MessageSquare },
    { href: "/manager/logbook", label: "Logbook & 1:1", icon: BookOpen },
    { href: "/manager/mobility", label: "Movimentações", icon: Users },
  ];

  const adminLinks = [
    { href: "/admin", label: "Painel Admin", icon: Settings },
  ];`
);

content = content.replace(
  `        {showManagerLinks && (
          <>
            <div className="my-4 border-t border-border/50 pt-4" />
            <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu do Gestor
            </div>`,
  `        {showManagerLinks && (
          <>
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-4",
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
            
            <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu do Gestor
            </div>`
);

fs.writeFileSync(file, content);
console.log('updated sidebar');

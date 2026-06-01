const fs = require('fs');
const file = 'client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const newNav = `<nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
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
      </nav>`;

content = content.replace(/<nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">[\s\S]*?<\/nav>/, newNav);

fs.writeFileSync(file, content);
console.log('fixed sidebar');

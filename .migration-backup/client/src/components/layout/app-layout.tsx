import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
  role: "manager" | "employee";
  userName?: string;
  userTitle?: string;
}

export function AppLayout({ children, role, userName, userTitle }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  const isDualRole = userEmail === "jenner.lopes@institutojef.org.br";
  const currentName = userEmail === "jenner.lopes@institutojef.org.br" ? "Jenner Lopes" : (userEmail === "jenner70@gmail.com" ? "Jenner Talento" : userName || "Usuário");
  const currentTitle = isDualRole ? (role === "manager" ? "Tech Manager / Squad A" : "Desenvolvedor Frontend") : (userEmail === "jenner70@gmail.com" ? "Talento JEF" : userTitle || "Cargo");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar role={role} className="hidden md:flex h-screen sticky top-0" />
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <Sidebar role={role} className="flex h-full w-full border-none" onNavigate={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Header 
          userName={currentName} 
          userTitle={currentTitle} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

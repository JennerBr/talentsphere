import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState, useRef, useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCurrentMember } from "@/lib/use-data";
import { useSwipeNavigation } from "@/lib/use-swipe-navigation";
import { SwipeNavIndicator } from "@/components/layout/swipe-nav-indicator";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: React.ReactNode;
  role: "manager" | "employee";
  userName?: string;
  userTitle?: string;
}

const SWIPEABLE_PAGES = [
  { href: "/profile", label: "Perfil" },
  { href: "/pdi", label: "Meu PDI" },
  { href: "/ausencias", label: "Ausências" },
  { href: "/calendar", label: "Calendário" },
  { href: "/projetos", label: "Projetos" },
  { href: "/manager", label: "Visão Geral" },
  { href: "/manager/team", label: "Equipe" },
  { href: "/manager/mobility", label: "Movimentações" },
];

export function AppLayout({ children, role, userName, userTitle }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: currentMember } = useCurrentMember();
  const [, navigate] = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const currentName = currentMember?.name ?? userName ?? "Usuário";
  const currentTitle = currentMember?.role ?? userTitle ?? "Cargo";

  const handleNavigate = useCallback(
    (href: string) => {
      navigate(href);
    },
    [navigate]
  );

  const { hintDirection, hintLabel, progress } = useSwipeNavigation(
    mainRef,
    SWIPEABLE_PAGES,
    handleNavigate
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar role={role} className="hidden md:flex h-screen sticky top-0" />

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
        <main ref={mainRef} className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
        <SwipeNavIndicator
          direction={hintDirection}
          label={hintLabel}
          progress={progress}
        />
      </div>
    </div>
  );
}

import { Bell, Menu, Users, Building2, ChevronDown, Wallet, Heart } from "lucide-react";
import { StudentSelectorModal } from "@/components/shared/student-selector-modal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCompany, MOCK_COMPANIES } from "@/lib/company-context";
import { MOCK_USERS, MOCK_KUDOS_TYPES } from "@/lib/mock-data";

interface HeaderProps {
  userName: string;
  userTitle: string;
  onMenuClick?: () => void;
}

export function Header({ userName, userTitle, onMenuClick }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { selectedCompany, setSelectedCompany } = useCompany();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  const isDualRole = userEmail === "jenner.lopes@institutojef.org.br";
  const isManagerView = location.startsWith("/manager");
  
  // Use mock user 1 as the current logged in user for kudos display
  const currentUser = MOCK_USERS[0];
  const userKudos = currentUser.kudos || [];

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setLocation("/login");
  };

  const handleSwitchView = () => {
    if (isManagerView) {
      setLocation("/profile");
    } else {
      setLocation("/manager");
    }
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-3 md:px-6 shrink-0 gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden shrink-0" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 p-0 sm:w-auto sm:px-2 sm:gap-2 flex shrink-0 justify-center items-center hover:bg-muted/50">
              {selectedCompany.logo ? (
                <div className="h-8 w-8 rounded overflow-hidden shrink-0">
                  <img src={selectedCompany.logo} alt={selectedCompany.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
              )}
              <span className="text-base font-semibold hidden sm:inline-block">{selectedCompany.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Selecionar Organização</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MOCK_COMPANIES.map(company => (
              <DropdownMenuItem 
                key={company.id} 
                onClick={() => setSelectedCompany(company)}
                className="gap-2 cursor-pointer"
              >
                {company.logo ? (
                  <div className="h-6 w-6 rounded overflow-hidden">
                    <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                )}
                <span>{company.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-amber-500 hover:text-amber-600 hover:bg-amber-100/50" title="Kudos Wallet">
              <Wallet className="h-5 w-5" />
              {userKudos.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {userKudos.length}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-amber-500" />
                Minha Wallet de Kudos
              </DialogTitle>
              <DialogDescription>
                Reconhecimentos que você recebeu da equipe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {userKudos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <Heart className="h-8 w-8 text-muted mb-2" />
                  <p>Você ainda não recebeu kudos.</p>
                </div>
              ) : (
                userKudos.map(kudo => {
                  const kudoType = MOCK_KUDOS_TYPES.find(t => t.id === kudo.typeId);
                  return (
                    <div key={kudo.id} className="p-3 border rounded-lg bg-card shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl" title={kudoType?.name}>{kudoType?.icon}</span>
                        <span className="font-semibold text-sm">{kudoType?.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{new Date(kudo.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-foreground/90 italic mb-2">"{kudo.message}"</p>
                      <p className="text-xs text-muted-foreground font-medium text-right">- {kudo.from}</p>
                    </div>
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>

        <StudentSelectorModal />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button 
          variant="ghost" 
          className="flex items-center gap-3 pl-2 pr-0 hover:bg-transparent"
          onClick={() => setLocation("/manager/team")}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs text-muted-foreground mt-1">{userTitle}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
        </Button>
      </div>
    </header>
  );
}

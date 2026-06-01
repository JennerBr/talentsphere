import { Bell, Menu, Users, Building2, ChevronDown, Wallet, Heart } from "lucide-react";
import { StudentSelectorModal } from "@/components/shared/student-selector-modal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useCompany } from "@/lib/company-context";
import { useMembers, useKudosTypes, useMemberKudos, useCurrentMember } from "@/lib/use-data";
import { useClerk } from "@clerk/react";
import { useEffect } from "react";

interface HeaderProps {
  userName: string;
  userTitle: string;
  onMenuClick?: () => void;
}

export function Header({ userName, userTitle, onMenuClick }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { signOut } = useClerk();
  const { selectedOrg, setSelectedOrg, availableOrgs, setAvailableOrgs } = useCompany();
  const { data: members = [] } = useMembers();
  const { data: kudosTypes = [] } = useKudosTypes();
  const { data: currentMember } = useCurrentMember();
  const { data: userKudos = [] } = useMemberKudos(currentMember?.id ?? 0);

  useEffect(() => {
    if (currentMember?.organizations && currentMember.organizations.length > 0) {
      setAvailableOrgs(currentMember.organizations);
    }
  }, [currentMember?.organizations, setAvailableOrgs]);

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  const showSwitcher = availableOrgs.length > 1;

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

        {showSwitcher ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 p-0 sm:w-auto sm:px-2 sm:gap-2 flex shrink-0 justify-center items-center hover:bg-muted/50">
                {selectedOrg?.logo ? (
                  <div className="h-8 w-8 rounded overflow-hidden shrink-0">
                    <img src={selectedOrg.logo} alt={selectedOrg.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                )}
                <span className="text-base font-semibold hidden sm:inline-block">{selectedOrg?.name ?? "Team"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Selecionar Team</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableOrgs.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className="gap-2 cursor-pointer"
                >
                  {org.logo ? (
                    <div className="h-6 w-6 rounded overflow-hidden">
                      <img src={org.logo} alt={org.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                  )}
                  <span>{org.name}</span>
                  {selectedOrg?.id === org.id && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 px-2">
            {selectedOrg?.logo ? (
              <div className="h-8 w-8 rounded overflow-hidden shrink-0">
                <img src={selectedOrg.logo} alt={selectedOrg.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
            )}
            <span className="text-base font-semibold hidden sm:inline-block">{selectedOrg?.name ?? "TalentSphere"}</span>
          </div>
        )}
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
                  const kudoType = kudosTypes.find(t => t.id === kudo.typeId);
                  return (
                    <div key={kudo.id} className="p-3 border rounded-lg bg-card shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl" title={kudoType?.name}>{kudoType?.icon}</span>
                        <span className="font-semibold text-sm">{kudoType?.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{kudo.date ? new Date(kudo.date).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                      <p className="text-sm text-foreground/90 italic mb-2">"{kudo.message}"</p>
                      <p className="text-xs text-muted-foreground font-medium text-right">- {kudo.fromName}</p>
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

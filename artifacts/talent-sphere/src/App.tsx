import { useEffect, useRef } from "react";
import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompanyProvider } from "@/lib/company-context";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import NotFound from "@/pages/not-found";
import OnboardingPage from "@/pages/onboarding";
import { useCurrentMember, UnauthorizedError } from "@/lib/use-data";
import { toast } from "@/hooks/use-toast";

import InviteAcceptPage from "@/pages/invite-accept";
import ManagerDashboard from "@/pages/manager-dashboard";
import ManagerTeam from "@/pages/manager-team";
import ManagerMobility from "@/pages/manager-mobility";
import MemberProfile from "@/pages/member-profile";
import MemberPDI from "@/pages/member-pdi";

import AdminOrganizações from "@/pages/admin-organizacoes";
import AdminOrganizaçãoForm from "@/pages/admin-organizacao-form";
import AdminPosicoes from "@/pages/admin-posicoes";
import AdminCargos from "@/pages/admin-cargos";
import AdminTrilhas from "@/pages/admin-trilhas";
import AdminFuncoes from "@/pages/admin-funcoes";
import AdminHabilidades from "@/pages/admin-habilidades";
import AdminSkillCategories from "@/pages/admin-skill-categories";
import AdminProjetos from "@/pages/admin-projetos";
import AdminHobbies from "@/pages/admin-hobbies";
import AdminHobbyCategories from "@/pages/admin-hobby-categories";
import AdminLogTypes from "@/pages/admin-log-types";
import AdminAbsenceTypes from "@/pages/admin-absence-types";
import AdminActionTypes from "@/pages/admin-action-types";
import AbsenceManagement from "@/pages/absence-management";
import ScheduleCalendar from "@/pages/schedule-calendar";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#F59E0B",
    colorForeground: "#dbeafe",
    colorMutedForeground: "#97a8be",
    colorDanger: "#f04040",
    colorBackground: "#030b1f",
    colorInput: "#1d2d45",
    colorInputForeground: "#dbeafe",
    colorNeutral: "#1d2d45",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0e1a36] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#1d2d45]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#dbeafe]",
    headerSubtitle: "text-[#97a8be]",
    socialButtonsBlockButtonText: "text-[#dbeafe]",
    formFieldLabel: "text-[#dbeafe]",
    footerActionLink: "text-[#F59E0B]",
    footerActionText: "text-[#97a8be]",
    dividerText: "text-[#97a8be]",
    identityPreviewEditButton: "text-[#F59E0B]",
    formFieldSuccessText: "text-green-400",
    alertText: "text-[#dbeafe]",
    logoBox: "mb-2",
    logoImage: "h-12 w-12",
    socialButtonsBlockButton: "border-[#1d2d45] bg-[#1d2d45] hover:bg-[#243651]",
    formButtonPrimary: "bg-[#F59E0B] text-[#030b1f] hover:bg-[#d97706]",
    formFieldInput: "bg-[#1d2d45] border-[#1d2d45] text-[#dbeafe]",
    footerAction: "bg-transparent",
    dividerLine: "bg-[#1d2d45]",
    alert: "bg-[#1d2d45]",
    otpCodeFieldInput: "bg-[#1d2d45] border-[#1d2d45] text-[#dbeafe]",
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function MemberGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { isError, isSuccess, isFetching } = useCurrentMember();

  useEffect(() => {
    if (isSuccess || isFetching) return;
    if (isError) {
      setLocation("/onboarding");
    }
  }, [isError, isSuccess, isFetching, setLocation]);

  return <>{children}</>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function SessionExpiryHandler() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const handledRef = useRef(false);

  useEffect(() => {
    function handleUnauthorized() {
      if (handledRef.current) return;
      handledRef.current = true;
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, entre novamente.",
        variant: "destructive",
      });
      qc.clear();
      setLocation("/sign-in");
      setTimeout(() => { handledRef.current = false; }, 3000);
    }

    const queryUnsub = qc.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.action.type === "error" &&
        event.action.error instanceof UnauthorizedError
      ) {
        handleUnauthorized();
      }
    });

    const mutationUnsub = qc.getMutationCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.mutation?.state.status === "error" &&
        event.mutation.state.error instanceof UnauthorizedError
      ) {
        handleUnauthorized();
      }
    });

    return () => {
      queryUnsub();
      mutationUnsub();
    };
  }, [qc, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/login" component={() => <Redirect to="/sign-in" />} />
      <Route path="/onboarding" component={() => <AuthGuard><OnboardingPage /></AuthGuard>} />
      <Route path="/" component={() => (
        <>
          <Show when="signed-in"><Redirect to="/profile" /></Show>
          <Show when="signed-out"><Redirect to="/sign-in" /></Show>
        </>
      )} />

      <Route path="/manager" component={() => <AuthGuard><MemberGuard><ManagerDashboard /></MemberGuard></AuthGuard>} />
      <Route path="/manager/team" component={() => <AuthGuard><MemberGuard><ManagerTeam /></MemberGuard></AuthGuard>} />
      <Route path="/manager/mobility" component={() => <AuthGuard><MemberGuard><ManagerMobility /></MemberGuard></AuthGuard>} />

      <Route path="/admin" component={() => <Redirect to="/admin/organizacoes" />} />
      <Route path="/admin/organizacoes" component={() => <AuthGuard><MemberGuard><AdminOrganizações /></MemberGuard></AuthGuard>} />
      <Route path="/admin/organizacoes/:id" component={() => <AuthGuard><MemberGuard><AdminOrganizaçãoForm /></MemberGuard></AuthGuard>} />
      <Route path="/admin/posicoes" component={() => <AuthGuard><MemberGuard><AdminPosicoes /></MemberGuard></AuthGuard>} />
      <Route path="/admin/cargos" component={() => <AuthGuard><MemberGuard><AdminCargos /></MemberGuard></AuthGuard>} />
      <Route path="/admin/trilhas" component={() => <AuthGuard><MemberGuard><AdminTrilhas /></MemberGuard></AuthGuard>} />
      <Route path="/admin/funcoes" component={() => <AuthGuard><MemberGuard><AdminFuncoes /></MemberGuard></AuthGuard>} />
      <Route path="/admin/habilidades/tipos" component={() => <AuthGuard><MemberGuard><AdminSkillCategories /></MemberGuard></AuthGuard>} />
      <Route path="/admin/habilidades" component={() => <AuthGuard><MemberGuard><AdminHabilidades /></MemberGuard></AuthGuard>} />
      <Route path="/admin/hobbies/tipos" component={() => <AuthGuard><MemberGuard><AdminHobbyCategories /></MemberGuard></AuthGuard>} />
      <Route path="/admin/hobbies" component={() => <AuthGuard><MemberGuard><AdminHobbies /></MemberGuard></AuthGuard>} />
      <Route path="/admin/log-types" component={() => <AuthGuard><MemberGuard><AdminLogTypes /></MemberGuard></AuthGuard>} />
      <Route path="/admin/absence-types" component={() => <AuthGuard><MemberGuard><AdminAbsenceTypes /></MemberGuard></AuthGuard>} />
      <Route path="/admin/action-types" component={() => <AuthGuard><MemberGuard><AdminActionTypes /></MemberGuard></AuthGuard>} />

      <Route path="/invite/:token" component={() => <InviteAcceptPage />} />

      <Route path="/radar" component={() => <AuthGuard><MemberGuard><MemberProfile /></MemberGuard></AuthGuard>} />
      <Route path="/profile" component={() => <AuthGuard><MemberGuard><MemberProfile /></MemberGuard></AuthGuard>} />
      <Route path="/pdi" component={() => <AuthGuard><MemberGuard><MemberPDI /></MemberGuard></AuthGuard>} />
      <Route path="/ausencias" component={() => <AuthGuard><MemberGuard><AbsenceManagement /></MemberGuard></AuthGuard>} />
      <Route path="/calendar" component={() => <AuthGuard><MemberGuard><ScheduleCalendar /></MemberGuard></AuthGuard>} />
      <Route path="/projetos" component={() => <AuthGuard><MemberGuard><AdminProjetos /></MemberGuard></AuthGuard>} />

      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Bem-vindo ao TalentSphere",
            subtitle: "Acesse a plataforma de desenvolvimento de talentos",
          },
        },
        signUp: {
          start: {
            title: "Criar conta",
            subtitle: "Comece sua jornada de desenvolvimento",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <SessionExpiryHandler />
        <CompanyProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CompanyProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

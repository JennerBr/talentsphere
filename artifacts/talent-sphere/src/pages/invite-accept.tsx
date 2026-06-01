import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth, SignIn } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Building2, UserCheck } from "lucide-react";

const BASE = "/api";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
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
    socialButtonsBlockButton: "border-[#1d2d45] bg-[#1d2d45] hover:bg-[#243651]",
    formButtonPrimary: "bg-[#F59E0B] text-[#030b1f] hover:bg-[#d97706]",
    formFieldInput: "bg-[#1d2d45] border-[#1d2d45] text-[#dbeafe]",
    footerAction: "bg-transparent",
    dividerLine: "bg-[#1d2d45]",
  },
};

type PublicInvite = {
  id: string;
  invitedEmail: string;
  invitedByName: string | null;
  orgName: string;
  role: string | null;
  status: string;
  expiresAt: string;
};

type PageState = "loading" | "invite-info" | "signing-in" | "accepting" | "accepted" | "error";

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [invite, setInvite] = useState<PublicInvite | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [showSignIn, setShowSignIn] = useState(false);
  const hasAccepted = pageState === "accepted";

  useEffect(() => {
    if (!token) {
      setFetchError("Token inválido.");
      setPageState("error");
      return;
    }
    fetch(`${BASE}/invites/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Convite inválido ou não encontrado");
        }
        return res.json() as Promise<PublicInvite>;
      })
      .then((data) => {
        setInvite(data);
        setPageState("invite-info");
      })
      .catch((e: Error) => {
        setFetchError(e.message);
        setPageState("error");
      });
  }, [token]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !invite || hasAccepted || pageState === "accepting") return;
    if (invite.status !== "pending") return;

    setPageState("accepting");
    getToken().then(async (authToken) => {
      try {
        const res = await fetch(`${BASE}/invites/${token}/accept`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Falha ao aceitar convite");
        }
        setPageState("accepted");
        setTimeout(() => setLocation("/profile"), 2000);
      } catch (e: any) {
        setAcceptError(e.message);
        setPageState("invite-info");
      }
    });
  }, [isLoaded, isSignedIn, invite, token, hasAccepted, pageState, getToken, setLocation]);

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-border bg-card">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-bold text-foreground">Convite inválido</h1>
            <p className="text-muted-foreground">{fetchError}</p>
            <Button variant="outline" onClick={() => setLocation("/sign-in")}>
              Ir para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invite && invite.status !== "pending") {
    const statusMessages: Record<string, string> = {
      accepted: "Este convite já foi aceito.",
      cancelled: "Este convite foi cancelado.",
      expired: "Este convite expirou. Peça um novo convite ao remetente.",
    };
    const msg = statusMessages[invite.status] ?? "Este convite não está mais válido.";
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-border bg-card">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <XCircle className="h-12 w-12 text-amber-500 mx-auto" />
            <h1 className="text-xl font-bold text-foreground">Convite indisponível</h1>
            <p className="text-muted-foreground">{msg}</p>
            <Button variant="outline" onClick={() => setLocation("/sign-in")}>
              Ir para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-5">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Você entrou em <strong className="text-foreground">{invite?.orgName}</strong>. Redirecionando...
          </p>
          <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (pageState === "accepting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Aceitando convite...</p>
        </div>
      </div>
    );
  }

  const inviteUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border bg-card">
          <CardContent className="pt-8 pb-6 space-y-5">
            <div className="flex justify-center">
              <div className="rounded-full bg-amber-500/10 p-4">
                <Building2 className="h-10 w-10 text-amber-500" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">{invite?.invitedByName ?? "Alguém"}</span> te convidou para
              </p>
              <h1 className="text-2xl font-bold text-primary">{invite?.orgName}</h1>
              <p className="text-muted-foreground text-sm">
                como <span className="font-medium text-foreground">{invite?.role ?? "Membro"}</span>
              </p>
            </div>
            <div className="rounded-md bg-muted/40 border border-border px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">Convite para:</p>
              <p className="text-sm font-medium text-foreground">{invite?.invitedEmail}</p>
            </div>
          </CardContent>
        </Card>

        {acceptError && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {acceptError}
          </div>
        )}

        {!isLoaded && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {isLoaded && !isSignedIn && !showSignIn && (
          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => setShowSignIn(true)}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Entrar para aceitar
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Não tem conta? Você pode criar uma ao entrar.
            </p>
          </div>
        )}

        {isLoaded && !isSignedIn && showSignIn && (
          <SignIn
            routing="hash"
            fallbackRedirectUrl={inviteUrl}
            signUpFallbackRedirectUrl={inviteUrl}
            signUpUrl={`${basePath}/sign-up`}
            appearance={clerkAppearance}
          />
        )}
      </div>
    </div>
  );
}

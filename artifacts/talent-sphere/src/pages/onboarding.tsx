import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding, useCurrentMember } from "@/lib/use-data";
import { Building2, User, CheckCircle2, ArrowRight, Loader2, UserCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";

const BASE = "/api";

type Step = "welcome" | "org" | "member" | "done" | "invite-accept" | "invite-done";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { getToken } = useAuth();
  const qc = useQueryClient();

  const inviteToken = new URLSearchParams(search).get("invite");

  const [step, setStep] = useState<Step>(inviteToken ? "invite-accept" : "welcome");
  const [orgName, setOrgName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [orgError, setOrgError] = useState("");
  const [empError, setEmpError] = useState("");
  const [inviteInfo, setInviteInfo] = useState<{ orgName: string; role: string | null; invitedByName: string | null } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const { mutate: runOnboarding, isPending, error: mutationError } = useOnboarding();
  const { isSuccess: memberLoaded } = useCurrentMember();

  useEffect(() => {
    if (step === "done" && memberLoaded) {
      setLocation("/profile");
    }
  }, [step, memberLoaded, setLocation]);

  useEffect(() => {
    if (!inviteToken) return;
    fetch(`${BASE}/invites/${inviteToken}`)
      .then(async res => {
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? "Convite inválido");
        }
        return res.json();
      })
      .then(data => {
        setInviteInfo({ orgName: data.orgName, role: data.role, invitedByName: data.invitedByName });
      })
      .catch(e => {
        setInviteError(e.message);
      });
  }, [inviteToken]);

  function handleOrgNext() {
    if (!orgName.trim()) {
      setOrgError("Por favor, informe o nome da organização.");
      return;
    }
    setOrgError("");
    setStep("member");
  }

  function handleSubmit() {
    if (!memberName.trim()) {
      setEmpError("Por favor, informe seu nome completo.");
      return;
    }
    setEmpError("");
    runOnboarding(
      { orgName: orgName.trim(), employeeName: memberName.trim() },
      {
        onSuccess: async () => {
          setStep("done");
          await qc.refetchQueries({ queryKey: ["current-member"] });
        },
      }
    );
  }

  async function handleInviteAccept() {
    if (!inviteToken) return;
    setIsAccepting(true);
    setInviteError(null);
    try {
      const authToken = await getToken();
      const res = await fetch(`${BASE}/invites/${inviteToken}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Falha ao aceitar convite");
      }
      await qc.refetchQueries({ queryKey: ["current-member"] });
      setStep("invite-done");
      setTimeout(() => setLocation("/profile"), 2000);
    } catch (e: any) {
      setInviteError(e.message);
    } finally {
      setIsAccepting(false);
    }
  }

  const steps = inviteToken
    ? (["invite-accept", "invite-done"] as Step[])
    : (["welcome", "org", "member", "done"] as Step[]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">

        {/* ─── Invite flow ─── */}

        {step === "invite-accept" && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <div className="rounded-full bg-amber-100 dark:bg-amber-500/10 p-5">
                <Building2 className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            {inviteInfo ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-base">
                  <span className="font-semibold text-foreground">{inviteInfo.invitedByName ?? "Alguém"}</span> te convidou para
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-primary">{inviteInfo.orgName}</h1>
                {inviteInfo.role && (
                  <p className="text-muted-foreground text-sm">como <span className="font-medium text-foreground">{inviteInfo.role}</span></p>
                )}
              </div>
            ) : inviteError ? (
              <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight text-destructive">Convite inválido</h1>
                <p className="text-muted-foreground text-sm">{inviteError}</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              </div>
            )}

            {inviteInfo && !inviteError && (
              <>
                {inviteError && (
                  <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">{inviteError}</p>
                )}
                <Button
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  onClick={handleInviteAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Aceitando...</>
                  ) : (
                    <><UserCheck className="mr-2 h-5 w-5" /> Aceitar e entrar</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Ao aceitar, sua conta será vinculada a esta organização.
                </p>
              </>
            )}

            {!inviteInfo && !inviteError && (
              <p className="text-muted-foreground text-sm">Carregando informações do convite...</p>
            )}

            {inviteError && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { setStep("welcome"); }}
              >
                Criar nova organização
              </Button>
            )}
          </div>
        )}

        {step === "invite-done" && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-500/10 p-5">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Bem-vindo!</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Você entrou em <strong>{inviteInfo?.orgName}</strong>. Redirecionando...
              </p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          </div>
        )}

        {/* ─── Normal onboarding flow ─── */}

        {step === "welcome" && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <div className="rounded-full bg-amber-100 dark:bg-amber-500/10 p-5">
                <Building2 className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao TalentSphere</h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Seu login ainda não está vinculado a nenhum membro. Vamos criar sua organização e seu perfil agora — leva menos de um minuto.
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              onClick={() => setStep("org")}
            >
              Criar minha organização
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === "org" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-amber-100 dark:bg-amber-500/10 p-2">
                  <Building2 className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Passo 1 de 2</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Nome da organização</h2>
              <p className="text-muted-foreground text-sm">
                Como se chama a empresa ou time que você vai gerenciar?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgName">Nome da organização</Label>
              <Input
                id="orgName"
                placeholder="Ex: Acme Corp, Minha Startup..."
                value={orgName}
                onChange={(e) => { setOrgName(e.target.value); setOrgError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleOrgNext()}
                autoFocus
              />
              {orgError && <p className="text-sm text-destructive">{orgError}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("welcome")}>
                Voltar
              </Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                onClick={handleOrgNext}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "member" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-amber-100 dark:bg-amber-500/10 p-2">
                  <User className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Passo 2 de 2</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Seus dados</h2>
              <p className="text-muted-foreground text-sm">
                Como você quer aparecer no sistema?
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Nome completo</Label>
                <Input
                  id="memberName"
                  placeholder="Ex: Maria Silva"
                  value={memberName}
                  onChange={(e) => { setMemberName(e.target.value); setEmpError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
                {empError && <p className="text-sm text-destructive">{empError}</p>}
              </div>
            </div>

            {mutationError && (
              <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
                {mutationError.message.includes("409")
                  ? "Já existe um membro vinculado a este e-mail."
                  : "Erro ao criar perfil. Tente novamente."}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("org")} disabled={isPending}>
                Voltar
              </Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    Concluir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-500/10 p-5">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Tudo pronto!</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Sua organização <strong>{orgName}</strong> foi criada com sucesso. Entrando no sistema...
              </p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 pt-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-6 bg-amber-500"
                  : i < steps.indexOf(step)
                  ? "w-3 bg-amber-300"
                  : "w-3 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

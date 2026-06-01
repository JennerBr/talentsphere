import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Image as ImageIcon, Network } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { OrgChart } from "@/components/shared/org-chart";
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  usePositions,
} from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrganizaçãoForm() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const orgId = params.id === "nova" ? null : Number(params.id);

  const { data: teams = [] } = useTeams();
  const { data: allPositions = [] } = usePositions();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [logo, setLogo] = useState("");
  const [dominios, setDominios] = useState<string[]>([]);
  const [newDominio, setNewDominio] = useState("");
  const [bus, setBus] = useState<string[]>([]);
  const [newBu, setNewBu] = useState("");

  useEffect(() => {
    if (orgId && teams.length > 0) {
      const team = teams.find(o => o.id === orgId);
      if (team) {
        setName(team.name);
        setCnpj(team.cnpj ?? "");
        setStatus(team.status ?? "Ativo");
        setLogo(team.logo ?? "");
        setDominios(team.allowedDomains ?? []);
      }
    }
  }, [orgId, teams]);

  const orgPositions = orgId
    ? allPositions
        .filter(p => p.organizacaoId === orgId)
        .map(p => ({
          id: p.id,
          name: p.name,
          chairs: p.chairs,
          allocated: p.allocated,
          parent_id: p.parentId,
          organizacao_id: p.organizacaoId,
          createdBy: p.createdBy ?? "",
          createdAt: p.createdAt ?? "",
        }))
    : [];

  const addDominio = () => {
    const d = newDominio.trim();
    if (d && !dominios.includes(d)) {
      setDominios([...dominios, d]);
      setNewDominio("");
    }
  };

  const removeDominio = (dom: string) => {
    setDominios(dominios.filter(d => d !== dom));
  };

  const addBu = () => {
    if (newBu && !bus.includes(newBu)) {
      setBus([...bus, newBu]);
      setNewBu("");
    }
  };

  const removeBu = (bu: string) => {
    setBus(bus.filter(b => b !== bu));
  };

  const isSaving = createTeam.isPending || updateTeam.isPending;

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "O nome é obrigatório.", variant: "destructive" });
      return;
    }

    const payload = {
      name: name.trim(),
      cnpj: cnpj || null,
      status: status || "Ativo",
      logo: logo || null,
      allowedDomains: dominios.length > 0 ? dominios : null,
    };

    if (orgId) {
      updateTeam.mutate(
        { id: orgId, ...payload },
        {
          onSuccess: () => {
            toast({ title: "Team atualizado com sucesso." });
            setLocation("/admin/organizacoes");
          },
          onError: (err) => {
            toast({ title: "Erro ao atualizar team", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createTeam.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Team criado com sucesso." });
          setLocation("/admin/organizacoes");
        },
        onError: (err) => {
          toast({ title: "Erro ao criar team", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/organizacoes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {orgId ? "Editar Team" : "Novo Team"}
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Dados Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Fantasia</Label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Tech Corp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input
                        value={cnpj}
                        onChange={e => setCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Logo do Team</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="h-40 w-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative group">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-10 w-10 opacity-30" />
                        <span className="text-xs text-center">Sem logo</span>
                      </div>
                    )}
                  </div>
                  <div className="w-full space-y-1">
                    <Label className="text-xs text-muted-foreground">URL da imagem</Label>
                    <Input
                      value={logo}
                      onChange={e => setLogo(e.target.value)}
                      placeholder="https://..."
                      className="text-xs"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Recomendado: 400x400px (PNG ou JPG)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Units</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da BU (ex: Varejo, Digital)"
                    value={newBu}
                    onChange={(e) => setNewBu(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addBu()}
                  />
                  <Button type="button" onClick={addBu} variant="secondary">Adicionar</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {bus.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma BU cadastrada.</p>}
                  {bus.map(bu => (
                    <Badge key={bu} variant="secondary" className="px-3 py-1.5 text-sm font-normal flex items-center gap-2">
                      {bu}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeBu(bu)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domínios Permitidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Se configurados, somente e-mails destes domínios poderão ser convidados. Deixe vazio para aceitar qualquer domínio.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: empresa.com.br"
                    value={newDominio}
                    onChange={(e) => setNewDominio(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addDominio()}
                  />
                  <Button type="button" onClick={addDominio} variant="secondary">Adicionar</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {dominios.length === 0 && <p className="text-sm text-muted-foreground">Nenhum domínio cadastrado (qualquer e-mail permitido).</p>}
                  {dominios.map(d => (
                    <Badge key={d} variant="secondary" className="px-3 py-1.5 text-sm font-normal flex items-center gap-2">
                      @{d.replace(/^@/, "")}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeDominio(d)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {orgId && orgPositions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Estrutura do Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrgChart data={orgPositions} organizacaoId={orgId ?? undefined} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8 pb-10">
          <Button variant="outline" onClick={() => setLocation("/admin/organizacoes")}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Team"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowLeft, Trash2, X, Image as ImageIcon, Network } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { OrgChart } from "@/components/shared/org-chart";
import { MOCK_POSITIONS } from "@/lib/mock-data";

export default function AdminOrganizaçãoForm() {
  const [, setLocation] = useLocation();
  const [dominios, setDominios] = useState<string[]>(["@techcorp.com.br", "@tc.com"]);
  const [newDominio, setNewDominio] = useState("");
  
  const [bus, setBus] = useState<string[]>(["Varejo", "Atacado"]);
  const [newBu, setNewBu] = useState("");

  const addDominio = () => {
    if (newDominio && !dominios.includes(newDominio)) {
      setDominios([...dominios, newDominio]);
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

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/organizacoes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Organização</h1>
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
                    <Input defaultValue="Tech Corp" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input defaultValue="12.345.678/0001-90" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue="ativo">
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
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
                  <CardTitle>Logo da Organização</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="h-40 w-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&auto=format" alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
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
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: @organizacao.com.br" 
                    value={newDominio}
                    onChange={(e) => setNewDominio(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addDominio()}
                  />
                  <Button type="button" onClick={addDominio} variant="secondary">Adicionar</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {dominios.length === 0 && <p className="text-sm text-muted-foreground">Nenhum domínio cadastrado.</p>}
                  {dominios.map(d => (
                    <Badge key={d} variant="secondary" className="px-3 py-1.5 text-sm font-normal flex items-center gap-2">
                      {d}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeDominio(d)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pb-10">
          <Button variant="outline" onClick={() => setLocation("/admin/organizacoes")}>Cancelar</Button>
          <Button onClick={() => setLocation("/admin/organizacoes")}>Salvar Organização</Button>
        </div>
      </div>
    </AppLayout>
  );
}
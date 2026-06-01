const fs = require('fs');

const formContent = `import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowLeft, Trash2, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminEmpresaForm() {
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
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/empresas")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Empresa</h1>
            <p className="text-muted-foreground mt-1">Crie ou edite as informações detalhadas da empresa.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais</CardTitle>
                <CardDescription>Informações básicas de identificação</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Business Units</CardTitle>
                <CardDescription>Unidades de negócio (departamentos/áreas) associadas a esta empresa</CardDescription>
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
                <div className="flex flex-col gap-2 mt-4">
                  {bus.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma BU cadastrada.</p>}
                  {bus.map(bu => (
                    <div key={bu} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                      <span className="font-medium text-sm">{bu}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeBu(bu)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domínios Permitidos</CardTitle>
                <CardDescription>Colaboradores que entrarem com estes e-mails serão vinculados automaticamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: @empresa.com.br" 
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo da Empresa</CardTitle>
                <CardDescription>Imagem de identificação visual</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="h-40 w-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&auto=format" alt="Logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Logo
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Recomendado: 400x400px (PNG ou JPG)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pb-10">
          <Button variant="outline" onClick={() => setLocation("/admin/empresas")}>Cancelar</Button>
          <Button onClick={() => setLocation("/admin/empresas")}>Salvar Empresa</Button>
        </div>
      </div>
    </AppLayout>
  );
}`;

fs.writeFileSync('client/src/pages/admin-empresa-form.tsx', formContent);

// UPDATE EMPRESAS LIST PAGE TO REMOVE DIALOG AND USE LINK
let listContent = fs.readFileSync('client/src/pages/admin-empresas.tsx', 'utf8');
listContent = listContent.replace(
  `import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon } from "lucide-react";\nimport { useState } from "react";`, 
  `import { Plus, Pencil, Trash2, Search } from "lucide-react";\nimport { useState } from "react";\nimport { useLocation } from "wouter";`
);

listContent = listContent.replace(
  `export default function AdminEmpresas() {\n  const [searchTerm, setSearchTerm] = useState("");`,
  `export default function AdminEmpresas() {\n  const [, setLocation] = useLocation();\n  const [searchTerm, setSearchTerm] = useState("");`
);

// Update renderTableActions to use navigation for editing
listContent = listContent.replace(
  `      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
        <Pencil className="h-4 w-4" />
      </Button>`,
  `      <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/empresas/1')} className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
        <Pencil className="h-4 w-4" />
      </Button>`
);

// Replace Dialog with simple button
const dialogSection = `            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Empresa</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Empresa</DialogTitle>
                  <DialogDescription>Adicione uma nova empresa ao sistema.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Logo da Empresa</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Fazer Upload
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome Fantasia</Label>
                    <Input placeholder="Ex: Tech Corp SA" />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Units</Label>
                    <Input placeholder="Ex: Varejo, Digital, Atacado (separados por vírgula)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Domínios Permitidos</Label>
                    <Input placeholder="Ex: @empresa.com.br, @filial.com (separados por vírgula)" />
                    <p className="text-xs text-muted-foreground">E-mails com estes domínios serão vinculados automaticamente a esta empresa.</p>
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
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Empresa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>`;

listContent = listContent.replace(dialogSection, `            <Button onClick={() => setLocation("/admin/empresas/nova")}><Plus className="w-4 h-4 mr-2" /> Nova Empresa</Button>`);

fs.writeFileSync('client/src/pages/admin-empresas.tsx', listContent);

// UPDATE APP.TSX
let appContent = fs.readFileSync('client/src/App.tsx', 'utf8');
appContent = appContent.replace(
  `import AdminEmpresas from "@/pages/admin-empresas";`,
  `import AdminEmpresas from "@/pages/admin-empresas";\nimport AdminEmpresaForm from "@/pages/admin-empresa-form";`
);
appContent = appContent.replace(
  `<Route path="/admin/empresas" component={AdminEmpresas} />`,
  `<Route path="/admin/empresas" component={AdminEmpresas} />\n      <Route path="/admin/empresas/:id" component={AdminEmpresaForm} />`
);
fs.writeFileSync('client/src/App.tsx', appContent);

console.log('done');

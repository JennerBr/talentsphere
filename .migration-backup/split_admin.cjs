const fs = require('fs');

const commonImports = `import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";`;

const renderTableActions = `  const renderTableActions = () => (
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );`;

// EMPRESAS
const empresasFile = `client/src/pages/admin-empresas.tsx`;
const empresasContent = `${commonImports}

const mockEmpresas = [
  { id: 1, nome: "Tech Corp", cnpj: "12.345.678/0001-90", status: "Ativo" },
  { id: 2, nome: "Inova Systems", cnpj: "98.765.432/0001-10", status: "Ativo" }
];

export default function AdminEmpresas() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground mt-1">Gerencie as empresas cadastradas no sistema.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar empresas..." className="pl-8" />
            </div>
            <Dialog>
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
                    <Label>Nome Fantasia</Label>
                    <Input placeholder="Ex: Tech Corp SA" />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input placeholder="00.000.000/0000-00" />
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
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome da Empresa</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmpresas.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{item.status}</Badge></TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(empresasFile, empresasContent);

// BUSINESS UNITS
const buFile = `client/src/pages/admin-bu.tsx`;
const buContent = `${commonImports}

const mockEmpresas = [
  { id: 1, nome: "Tech Corp" },
  { id: 2, nome: "Inova Systems" }
];

const mockBusinessUnits = [
  { id: 1, nome: "Varejo", empresaId: 1, empresaNome: "Tech Corp", diretor: "Carlos Silva" },
  { id: 2, nome: "Atacado", empresaId: 1, empresaNome: "Tech Corp", diretor: "Ana Paula" },
  { id: 3, nome: "Digital", empresaId: 2, empresaNome: "Inova Systems", diretor: "Marcos Santos" }
];

export default function AdminBU() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Units</h1>
          <p className="text-muted-foreground mt-1">Gerencie as unidades de negócio vinculadas às empresas.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar business units..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Business Unit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Business Unit</DialogTitle>
                  <DialogDescription>Crie uma nova unidade de negócio associada a uma empresa.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da BU</Label>
                    <Input placeholder="Ex: Varejo Digital" />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa Pai</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                      <SelectContent>
                        {mockEmpresas.map(emp => <SelectItem key={emp.id} value={emp.id.toString()}>{emp.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Diretor Responsável</Label>
                    <Input placeholder="Nome do diretor" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Business Unit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Diretor(a)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBusinessUnits.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{item.empresaNome}</TableCell>
                    <TableCell>{item.diretor}</TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(buFile, buContent);

// CARGOS
const cargosFile = `client/src/pages/admin-cargos.tsx`;
const cargosContent = `${commonImports}

const mockCargos = [
  { id: 1, titulo: "Desenvolvedor Junior", nivel: "Junior", trilha: "Técnica" },
  { id: 2, titulo: "Desenvolvedor Pleno", nivel: "Pleno", trilha: "Técnica" },
  { id: 3, titulo: "Desenvolvedor Senior", nivel: "Senior", trilha: "Técnica" },
  { id: 4, titulo: "Tech Lead", nivel: "Especialista", trilha: "Gestão" }
];

export default function AdminCargos() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cargos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os cargos e trilhas de carreira.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cargos..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Cargo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Cargo</DialogTitle>
                  <DialogDescription>Adicione um novo cargo ao plano de carreira.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Título do Cargo</Label>
                    <Input placeholder="Ex: Desenvolvedor Senior" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nível</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Nível" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jr">Junior</SelectItem>
                          <SelectItem value="pl">Pleno</SelectItem>
                          <SelectItem value="sr">Senior</SelectItem>
                          <SelectItem value="esp">Especialista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Trilha</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Trilha" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Técnica (Y)</SelectItem>
                          <SelectItem value="man">Gestão</SelectItem>
                          <SelectItem value="op">Operacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Cargo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCargos.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.titulo}</TableCell>
                    <TableCell><Badge variant="secondary">{item.nivel}</Badge></TableCell>
                    <TableCell>{item.trilha}</TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(cargosFile, cargosContent);

// FUNÇÕES
const funcoesFile = `client/src/pages/admin-funcoes.tsx`;
const funcoesContent = `${commonImports}

const mockHabilidades = [
  { id: 1, nome: "React" },
  { id: 2, nome: "Node.js" },
  { id: 3, nome: "Python" }
];

const mockFuncoes = [
  { id: 1, nome: "Desenvolvedor Front-end", departamento: "Engenharia", habilidades: ["React", "TypeScript", "CSS"] },
  { id: 2, nome: "Desenvolvedor Back-end", departamento: "Engenharia", habilidades: ["Node.js", "Python", "SQL"] },
  { id: 3, nome: "Engenheiro de Dados", departamento: "Dados", habilidades: ["Python", "SQL", "Spark"] },
  { id: 4, nome: "UX Designer", departamento: "Produto", habilidades: ["Figma", "Research", "Prototipagem"] }
];

export default function AdminFuncoes() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
          <p className="text-muted-foreground mt-1">Gerencie os papéis e especialidades da empresa.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar funções..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Função</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Função</DialogTitle>
                  <DialogDescription>Mapeie os papéis e especialidades da empresa.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da Função</Label>
                    <Input placeholder="Ex: Desenvolvedor Front-end" />
                  </div>
                  <div className="space-y-2">
                    <Label>Departamento/Área</Label>
                    <Input placeholder="Ex: Engenharia de Software" />
                  </div>
                  <div className="space-y-2">
                    <Label>Habilidades Relacionadas (Mapeamento)</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione habilidades..." /></SelectTrigger>
                      <SelectContent>
                        {mockHabilidades.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Isso ajuda a fazer o match entre talentos e vagas no sistema.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Função</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Habilidades Core</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFuncoes.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{item.departamento}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.habilidades.map(hab => (
                          <Badge key={hab} variant="outline" className="text-xs">{hab}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(funcoesFile, funcoesContent);

// HABILIDADES
const habilidadesFile = `client/src/pages/admin-habilidades.tsx`;
const habilidadesContent = `${commonImports}

const mockHabilidades = [
  { id: 1, nome: "React", categoria: "Hard Skill", funcoesId: [1] },
  { id: 2, nome: "Node.js", categoria: "Hard Skill", funcoesId: [2] },
  { id: 3, nome: "Python", categoria: "Hard Skill", funcoesId: [2, 3] },
  { id: 4, nome: "Liderança", categoria: "Soft Skill", funcoesId: [] }
];

export default function AdminHabilidades() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habilidades</h1>
          <p className="text-muted-foreground mt-1">Gerencie o catálogo de hard skills e soft skills.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar habilidades..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Nova Habilidade</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Habilidade</DialogTitle>
                  <DialogDescription>Adicione skills (hard ou soft) ao catálogo da empresa.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da Habilidade</Label>
                    <Input placeholder="Ex: React, Liderança, AWS..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hard">Hard Skill (Técnica)</SelectItem>
                        <SelectItem value="soft">Soft Skill (Comportamental)</SelectItem>
                        <SelectItem value="idioma">Idioma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Habilidade</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Uso (Funções Associadas)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHabilidades.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      <Badge variant={item.categoria === "Hard Skill" ? "default" : "secondary"}>
                        {item.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.funcoesId.length} função(ões)</TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(habilidadesFile, habilidadesContent);

// PROJETOS
const projetosFile = `client/src/pages/admin-projetos.tsx`;
const projetosContent = `${commonImports}

const mockProjetos = [
  { id: 1, nome: "Novo Portal E-commerce", status: "Em andamento", cliente: "Tech Corp", dataInicio: "01/01/2024" },
  { id: 2, nome: "Migração Cloud", status: "Planejamento", cliente: "Inova Systems", dataInicio: "15/03/2024" },
  { id: 3, nome: "App Mobile V2", status: "Concluído", cliente: "Tech Corp", dataInicio: "10/06/2023" }
];

export default function AdminProjetos() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os projetos para alocação de talentos.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar projetos..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Projeto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Projeto</DialogTitle>
                  <DialogDescription>Crie um novo projeto para alocação de talentos.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Projeto</Label>
                    <Input placeholder="Ex: Migração Cloud V2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cliente / Área Requisitante</Label>
                    <Input placeholder="Ex: Financeiro" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Início</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue="planejamento">
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejamento">Planejamento</SelectItem>
                          <SelectItem value="andamento">Em Andamento</SelectItem>
                          <SelectItem value="pausado">Pausado</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Projeto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProjetos.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{item.cliente}</TableCell>
                    <TableCell>{item.dataInicio}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === 'Em andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.status === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(projetosFile, projetosContent);

// HOBBIES
const hobbiesFile = `client/src/pages/admin-hobbies.tsx`;
const hobbiesContent = `${commonImports}

const mockHobbies = [
  { id: 1, nome: "Futebol", categoria: "Esportes" },
  { id: 2, nome: "Fotografia", categoria: "Artes" },
  { id: 3, nome: "Culinária", categoria: "Gastronomia" },
  { id: 4, nome: "Videogames", categoria: "Entretenimento" }
];

export default function AdminHobbies() {
  const [searchTerm, setSearchTerm] = useState("");
${renderTableActions}

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hobbies</h1>
          <p className="text-muted-foreground mt-1">Gerencie os hobbies e interesses dos colaboradores.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar hobbies..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Novo Hobby</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Hobby</DialogTitle>
                  <DialogDescription>Adicione interesses para enriquecer os perfis dos colaboradores.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Hobby</Label>
                    <Input placeholder="Ex: Tocar Violão, Futebol..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esportes">Esportes</SelectItem>
                        <SelectItem value="artes">Artes & Cultura</SelectItem>
                        <SelectItem value="gastronomia">Gastronomia</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Hobby</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hobby</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHobbies.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell><Badge variant="secondary">{item.categoria}</Badge></TableCell>
                    <TableCell>{renderTableActions()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}`;
fs.writeFileSync(hobbiesFile, hobbiesContent);

// UPDATE APP.TSX
let appContent = fs.readFileSync('client/src/App.tsx', 'utf8');

appContent = appContent.replace(`import AdminDashboard from "@/pages/admin-dashboard";`, `import AdminEmpresas from "@/pages/admin-empresas";
import AdminBU from "@/pages/admin-bu";
import AdminCargos from "@/pages/admin-cargos";
import AdminFuncoes from "@/pages/admin-funcoes";
import AdminHabilidades from "@/pages/admin-habilidades";
import AdminProjetos from "@/pages/admin-projetos";
import AdminHobbies from "@/pages/admin-hobbies";`);

appContent = appContent.replace(`<Route path="/admin" component={AdminDashboard} />`, `<Route path="/admin" component={() => <Redirect to="/admin/empresas" />} />
      <Route path="/admin/empresas" component={AdminEmpresas} />
      <Route path="/admin/bu" component={AdminBU} />
      <Route path="/admin/cargos" component={AdminCargos} />
      <Route path="/admin/funcoes" component={AdminFuncoes} />
      <Route path="/admin/habilidades" component={AdminHabilidades} />
      <Route path="/admin/projetos" component={AdminProjetos} />
      <Route path="/admin/hobbies" component={AdminHobbies} />`);

fs.writeFileSync('client/src/App.tsx', appContent);

// UPDATE SIDEBAR.TSX
let sidebarContent = fs.readFileSync('client/src/components/layout/sidebar.tsx', 'utf8');

sidebarContent = sidebarContent.replace(`import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut, Settings } from "lucide-react";`, `import { LayoutDashboard, Users, MessageSquare, BookOpen, UserCircle, LogOut, Building2, Network, Briefcase, Wrench, FileCode2, Gamepad2 } from "lucide-react";`);

sidebarContent = sidebarContent.replace(`  const adminLinks = [
    { href: "/admin", label: "Painel Admin", icon: Settings },
  ];`, `  const adminLinks = [
    { href: "/admin/empresas", label: "Empresas", icon: Building2 },
    { href: "/admin/bu", label: "Business Units", icon: Network },
    { href: "/admin/cargos", label: "Cargos", icon: Briefcase },
    { href: "/admin/funcoes", label: "Funções", icon: FileCode2 },
    { href: "/admin/habilidades", label: "Habilidades", icon: Wrench },
    { href: "/admin/projetos", label: "Projetos", icon: Briefcase },
    { href: "/admin/hobbies", label: "Hobbies", icon: Gamepad2 },
  ];`);

fs.writeFileSync('client/src/components/layout/sidebar.tsx', sidebarContent);

// DELETE OLD ADMIN DASHBOARD
try {
  fs.unlinkSync('client/src/pages/admin-dashboard.tsx');
} catch(e) {}

console.log('done');

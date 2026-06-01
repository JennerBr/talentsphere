const fs = require('fs');
const file = 'client/src/pages/admin-empresas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const mockEmpresas = [
  { id: 1, nome: "Tech Corp", cnpj: "12.345.678/0001-90", dominios: ["@techcorp.com.br", "@tc.com"], status: "Ativo" },
  { id: 2, nome: "Inova Systems", cnpj: "98.765.432/0001-10", dominios: ["@inova.com.br"], status: "Ativo" }
];`,
  `const mockEmpresas = [
  { 
    id: 1, 
    nome: "Tech Corp", 
    cnpj: "12.345.678/0001-90", 
    dominios: ["@techcorp.com.br", "@tc.com"], 
    businessUnits: ["Varejo", "Atacado"],
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format",
    status: "Ativo" 
  },
  { 
    id: 2, 
    nome: "Inova Systems", 
    cnpj: "98.765.432/0001-10", 
    dominios: ["@inova.com.br"], 
    businessUnits: ["Digital"],
    logo: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=100&h=100&fit=crop&auto=format",
    status: "Ativo" 
  }
];`
);

content = content.replace(
  `import { Plus, Pencil, Trash2, Search } from "lucide-react";`,
  `import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon } from "lucide-react";`
);

content = content.replace(
  `                  <div className="space-y-2">
                    <Label>Nome Fantasia</Label>`,
  `                  <div className="space-y-2">
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
                    <Label>Nome Fantasia</Label>`
);

content = content.replace(
  `                  <div className="space-y-2">
                    <Label>Domínios Permitidos</Label>`,
  `                  <div className="space-y-2">
                    <Label>Business Units</Label>
                    <Input placeholder="Ex: Varejo, Digital, Atacado (separados por vírgula)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Domínios Permitidos</Label>`
);

content = content.replace(
  `                  <TableHead>Domínios Permitidos</TableHead>
                  <TableHead>Status</TableHead>`,
  `                  <TableHead>Business Units</TableHead>
                  <TableHead>Domínios Permitidos</TableHead>
                  <TableHead>Status</TableHead>`
);

content = content.replace(
  `                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>{item.nome}</TableCell>`,
  `                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={item.logo} alt={\`Logo \${item.nome}\`} className="w-8 h-8 rounded border object-cover" />
                        <span className="font-medium">{item.nome}</span>
                      </div>
                    </TableCell>`
);

content = content.replace(
  `                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">`,
  `                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.businessUnits.map(bu => (
                          <Badge key={bu} variant="outline" className="text-xs">{bu}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">`
);

fs.writeFileSync(file, content);
console.log('updated empresas');

const fs = require('fs');
const file = 'client/src/pages/admin-empresas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const mockEmpresas = [
  { id: 1, nome: "Tech Corp", cnpj: "12.345.678/0001-90", status: "Ativo" },
  { id: 2, nome: "Inova Systems", cnpj: "98.765.432/0001-10", status: "Ativo" }
];`,
  `const mockEmpresas = [
  { id: 1, nome: "Tech Corp", cnpj: "12.345.678/0001-90", dominios: ["@techcorp.com.br", "@tc.com"], status: "Ativo" },
  { id: 2, nome: "Inova Systems", cnpj: "98.765.432/0001-10", dominios: ["@inova.com.br"], status: "Ativo" }
];`
);

content = content.replace(
  `                  <div className="space-y-2">
                    <Label>Status</Label>`,
  `                  <div className="space-y-2">
                    <Label>Domínios Permitidos</Label>
                    <Input placeholder="Ex: @empresa.com.br, @filial.com (separados por vírgula)" />
                    <p className="text-xs text-muted-foreground">E-mails com estes domínios serão vinculados automaticamente a esta empresa.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>`
);

content = content.replace(
  `                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>`,
  `                  <TableHead>CNPJ</TableHead>
                  <TableHead>Domínios Permitidos</TableHead>
                  <TableHead>Status</TableHead>`
);

content = content.replace(
  `                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{item.status}</Badge></TableCell>`,
  `                    <TableCell>{item.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.dominios.map(d => (
                          <Badge key={d} variant="secondary" className="text-xs font-normal">{d}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{item.status}</Badge></TableCell>`
);

fs.writeFileSync(file, content);
console.log('updated empresas');

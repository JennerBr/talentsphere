const fs = require('fs');
const file = 'client/src/pages/manager-mobility.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `                    <div className="ml-13 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">Motivo:</p>
                      <p className="text-sm text-muted-foreground">{disp.reason}</p>
                    </div>`,
  `                    <div className="p-3 bg-muted/50 rounded-md mt-4">
                      <p className="text-sm font-medium">Motivo da Disponibilização:</p>
                      <p className="text-sm text-muted-foreground">{disp.reason}</p>
                    </div>`
);

fs.writeFileSync(file, content);
console.log('updated');

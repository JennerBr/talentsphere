const fs = require('fs');
const file = 'client/src/pages/manager-mobility.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `{disp.skills && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm text-muted-foreground">Habilidades</span>
                        <div className="flex flex-wrap gap-1.5">
                          {disp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="font-normal text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}`,
  `{disp.skills && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm text-muted-foreground">Habilidades</span>
                        <div className="flex flex-wrap gap-1.5">
                          {disp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="font-normal text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>`
);

fs.writeFileSync(file, content);
console.log('updated');

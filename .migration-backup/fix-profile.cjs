const fs = require('fs');
const content = fs.readFileSync('client/src/pages/employee-profile.tsx', 'utf8');
const oldStr = `                <div className="w-full mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Cake className="h-4 w-4 shrink-0" />
                    <span>
                      {new Date(profile.birthday).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Linkedin className="h-4 w-4 shrink-0" />
                    <a href={\`https://\${profile.linkedin}\`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                      {profile.linkedin.split('/').pop()}
                    </a>
                  </div>
                </div>`;
const newStr = `              <div className="w-full mt-6 space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Cake className="h-4 w-4 shrink-0" />
                  <span>
                    {new Date(profile.birthday).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Linkedin className="h-4 w-4 shrink-0" />
                  <a href={\`https://\${profile.linkedin}\`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                    {profile.linkedin.split('/').pop()}
                  </a>
                </div>
              </div>`;
fs.writeFileSync('client/src/pages/employee-profile.tsx', content.replace(oldStr, newStr));

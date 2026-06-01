const fs = require('fs');
const file = 'client/src/pages/manager-mobility.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  const handleSaveDisp = () => {
    if (newDisp.maker) {
      setDisponiveis([
        {
          id: Date.now(),
          maker: newDisp.maker,
          reason: newDisp.reason,
          date: newDisp.date || new Date(),
          requester: "Alexandre Líder"
        },`,
  `  const handleSaveDisp = () => {
    if (newDisp.maker) {
      setDisponiveis([
        {
          id: Date.now(),
          maker: newDisp.maker,
          reason: newDisp.reason,
          date: newDisp.date || new Date(),
          requester: "Alexandre Líder",
          location: "A definir",
          role: "Não especificado",
          skills: [],
          english: "Não avaliado",
          seniority: "A definir"
        },`
);

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
                    )}
                  </CardContent>
                    <div className="p-3 bg-muted/50 rounded-md mt-4">
                      <p className="text-sm font-medium">Motivo da Disponibilização:</p>
                      <p className="text-sm text-muted-foreground">{disp.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}`,
  `{disp.skills && disp.skills.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm text-muted-foreground">Habilidades</span>
                        <div className="flex flex-wrap gap-1.5">
                          {disp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="font-normal text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-3 bg-muted/50 rounded-md mt-4">
                      <p className="text-sm font-medium">Motivo da Disponibilização:</p>
                      <p className="text-sm text-muted-foreground">{disp.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}`
);

fs.writeFileSync(file, content);
console.log('fixed');

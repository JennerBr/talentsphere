const fs = require('fs');
let content = fs.readFileSync('client/src/pages/employee-profile.tsx', 'utf8');

// Replace the projects array with the correctly formatted JSX
const oldProjectsStr = `                  {profile.projects.map((project, index) => (
                    <div key={project.id} className="relative pl-8 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                      <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      
                      <div className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-1 group" onClick={() => setLocation('/employee/projects')}>
                            {project.name}
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1 sm:mt-0">
                            <Calendar className="h-3 w-3" />
                            {project.period}
                          </div>
                        </div>
                        
                        <p className="font-medium text-primary/80 mb-3">{project.role}</p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {project.description}
                        </p>
                        
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Habilidades Aplicadas</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skillsUsed.map((skill, sIdx) => (
                              <Badge key={sIdx} variant="outline" className="bg-primary/5">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}`;

const newProjectsStr = `                  {profile.projects.map((project, index) => (
                    <div key={project.id} className="relative pl-8 before:absolute before:left-0 before:ml-[11px] before:top-6 before:h-[calc(100%+32px)] before:w-0.5 before:bg-border last:before:hidden">
                      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 shadow-sm">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </div>
                      
                      <div className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-1 group" onClick={() => setLocation('/employee/projects')}>
                            {project.name}
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1 sm:mt-0 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {project.period}
                          </div>
                        </div>
                        
                        <p className="font-medium text-primary mb-3">{project.role}</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Habilidades Aplicadas</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.skillsUsed.map((skill, sIdx) => (
                              <Badge key={sIdx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}`;

content = content.replace(oldProjectsStr, newProjectsStr);
fs.writeFileSync('client/src/pages/employee-profile.tsx', content);

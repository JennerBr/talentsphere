import os

filepath = 'client/src/pages/employee-profile.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Left Column
old1 = """        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Info Básica */}
          <div className="space-y-6">
            <Card>"""
new1 = """        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Info Básica */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndLeft}>
            <SortableContext items={leftCards} strategy={rectSortingStrategy}>
              <div className="space-y-6">
                {leftCards.map((cardId) => (
                  <SortableCard key={cardId} id={cardId}>
                    {cardId === 'info' && (
                      <Card>"""
if old1 in content:
    content = content.replace(old1, new1)
else:
    print("old1 not found")

old2 = """              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />"""
new2 = """              </CardContent>
            </Card>
                    )}

                    {cardId === 'skills' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />"""
if old2 in content:
    content = content.replace(old2, new2)
else:
    print("old2 not found")

old3 = """              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />"""
new3 = """              </CardContent>
            </Card>
                    )}

                    {cardId === 'hobbies' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />"""
if old3 in content:
    content = content.replace(old3, new3)
else:
    print("old3 not found")

old4 = """              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />"""
new4 = """              </CardContent>
            </Card>
                    )}

                    {cardId === 'powerskills' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />"""
if old4 in content:
    content = content.replace(old4, new4)
else:
    print("old4 not found")

old5 = """              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Histórico e Projetos */}
          <div className="md:col-span-2 space-y-6">
            <Card>"""
new5 = """              </CardContent>
            </Card>
                    )}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Coluna Direita: Histórico e Projetos */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndRight}>
            <SortableContext items={rightCards} strategy={rectSortingStrategy}>
              <div className="md:col-span-2 space-y-6">
                {rightCards.map((cardId) => (
                  <SortableCard key={cardId} id={cardId}>
                    {cardId === 'experiences' && (
            <Card>"""
if old5 in content:
    content = content.replace(old5, new5)
else:
    print("old5 not found")

old6 = """              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-6 w-6 text-primary" />
                  Organizações"""
new6 = """              </CardContent>
            </Card>
                    )}

                    {cardId === 'organizations' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-6 w-6 text-primary" />
                  Organizações"""
if old6 in content:
    content = content.replace(old6, new6)
else:
    print("old6 not found")

old7 = """              </CardContent>
            </Card>
            
            {/* Histórico de Logbook */}
            <Card>"""
new7 = """              </CardContent>
            </Card>
                    )}
            
                    {cardId === 'logbook' && (
            {/* Histórico de Logbook */}
            <Card>"""
if old7 in content:
    content = content.replace(old7, new7)
else:
    print("old7 not found")

old8 = """              </CardContent>
            </Card>

            {/* Manager Only Actions Area */}
            {isInMyTeam && (
              <Card className="border-amber-900/50 bg-[#2D1A00]">"""
new8 = """              </CardContent>
            </Card>
                    )}

                    {cardId === 'actions' && isInMyTeam && (
            {/* Manager Only Actions Area */}
              <Card className="border-amber-900/50 bg-[#2D1A00]">"""
if old8 in content:
    content = content.replace(old8, new8)
else:
    print("old8 not found")

old9 = """                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Floating Action Buttons for Manager */}"""
new9 = """                </CardContent>
              </Card>
                    )}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Floating Action Buttons for Manager */}"""
if old9 in content:
    content = content.replace(old9, new9)
else:
    print("old9 not found")

with open(filepath, 'w') as f:
    f.write(content)

print("Patching complete.")

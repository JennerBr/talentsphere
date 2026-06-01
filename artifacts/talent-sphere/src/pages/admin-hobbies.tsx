import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, Search, Palette, Heart, Camera, Bike, BookOpen, ChefHat, Gamepad2,
  Music, Plane, Dumbbell, Code2, Coffee, Flower2, Dog, Fish, Mountain, Globe, Mic, Film,
  Trophy, Leaf, Waves, Car, Tv, Star, Headphones, Swords, Brush, PawPrint, type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useHobbies, useHobbyCategories, useCreateHobby, useUpdateHobby, useDeleteHobby } from "@/lib/use-data";

const HOBBY_ICON_OPTIONS: { name: string; Icon: LucideIcon }[] = [
  { name: "Heart", Icon: Heart },
  { name: "Camera", Icon: Camera },
  { name: "Bike", Icon: Bike },
  { name: "BookOpen", Icon: BookOpen },
  { name: "ChefHat", Icon: ChefHat },
  { name: "Gamepad2", Icon: Gamepad2 },
  { name: "Music", Icon: Music },
  { name: "Plane", Icon: Plane },
  { name: "Dumbbell", Icon: Dumbbell },
  { name: "Code2", Icon: Code2 },
  { name: "Coffee", Icon: Coffee },
  { name: "Flower2", Icon: Flower2 },
  { name: "Dog", Icon: Dog },
  { name: "Fish", Icon: Fish },
  { name: "Mountain", Icon: Mountain },
  { name: "Globe", Icon: Globe },
  { name: "Mic", Icon: Mic },
  { name: "Film", Icon: Film },
  { name: "Trophy", Icon: Trophy },
  { name: "Leaf", Icon: Leaf },
  { name: "Waves", Icon: Waves },
  { name: "Car", Icon: Car },
  { name: "Tv", Icon: Tv },
  { name: "Star", Icon: Star },
  { name: "Headphones", Icon: Headphones },
  { name: "Swords", Icon: Swords },
  { name: "Brush", Icon: Brush },
  { name: "PawPrint", Icon: PawPrint },
  { name: "Palette", Icon: Palette },
];

function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-muted/20 max-h-40 overflow-y-auto">
      {HOBBY_ICON_OPTIONS.map(({ name, Icon }) => (
        <button
          key={name}
          type="button"
          title={name}
          onClick={() => onChange(name)}
          className={`p-2 rounded-md transition-colors ${value === name ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function HobbyIconDisplay({ iconName }: { iconName?: string | null }) {
  const entry = HOBBY_ICON_OPTIONS.find(o => o.name === iconName);
  const Icon = entry?.Icon ?? Heart;
  return <Icon className="h-4 w-4 text-muted-foreground" />;
}

type EditingHobby = { id: number; name: string; categoryId: string; icon: string };

export default function AdminHobbies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<string>("");
  const [newIcon, setNewIcon] = useState<string>("");

  const [editing, setEditing] = useState<EditingHobby | null>(null);

  const { data: hobbies = [], isLoading, isError } = useHobbies();
  const { data: categories = [] } = useHobbyCategories();
  const createHobby = useCreateHobby();
  const updateHobby = useUpdateHobby();
  const deleteHobby = useDeleteHobby();

  const filtered = hobbies.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreate() {
    if (!newName.trim()) return;
    await createHobby.mutateAsync({
      name: newName.trim(),
      categoryId: newCategoryId ? Number(newCategoryId) : null,
      icon: newIcon || null,
    });
    setNewName("");
    setNewCategoryId("");
    setNewIcon("");
    setCreateOpen(false);
  }

  async function handleUpdate() {
    if (!editing || !editing.name.trim()) return;
    await updateHobby.mutateAsync({
      id: editing.id,
      name: editing.name.trim(),
      categoryId: editing.categoryId && editing.categoryId !== "none" ? Number(editing.categoryId) : null,
      icon: editing.icon || null,
    });
    setEditing(null);
  }

  function openEdit(item: { id: number; name: string; categoryId?: number | null; icon?: string | null }) {
    setEditing({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId ? String(item.categoryId) : "",
      icon: item.icon ?? "",
    });
  }

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Hobbies</h1>
          <Link href="/admin/hobbies/tipos">
            <Button variant="outline"><Palette className="w-4 h-4 mr-2" /> Tipos de Hobby</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar hobbies..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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
                    <Input
                      placeholder="Ex: Tocar Violão, Futebol..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria (Tipo de Hobby)</Label>
                    <Select value={newCategoryId} onValueChange={setNewCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Ícone
                      {newIcon && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
                          — <HobbyIconDisplay iconName={newIcon} /> {newIcon}
                        </span>
                      )}
                    </Label>
                    <IconPicker value={newIcon} onChange={setNewIcon} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreate} disabled={createHobby.isPending || !newName.trim()}>
                    {createHobby.isPending ? "Salvando..." : "Salvar Hobby"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading && <p className="text-muted-foreground text-sm">Carregando hobbies...</p>}
          {isError && <p className="text-destructive text-sm">Erro ao carregar hobbies.</p>}

          {!isLoading && !isError && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hobby</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        {searchTerm ? "Nenhum hobby encontrado." : "Nenhum hobby cadastrado ainda."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <HobbyIconDisplay iconName={item.icon} />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.categoryName
                            ? <Badge variant="secondary">{item.categoryName}</Badge>
                            : <span className="text-muted-foreground text-sm">—</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                              onClick={() => openEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                              onClick={() => deleteHobby.mutate(item.id)}
                              disabled={deleteHobby.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Hobby</DialogTitle>
            <DialogDescription>Altere o nome, categoria ou ícone do hobby.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Hobby</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria (Tipo de Hobby)</Label>
                <Select
                  value={editing.categoryId}
                  onValueChange={(v) => setEditing({ ...editing, categoryId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Sem categoria" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem categoria</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Ícone
                  {editing.icon && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
                      — <HobbyIconDisplay iconName={editing.icon} /> {editing.icon}
                    </span>
                  )}
                </Label>
                <IconPicker value={editing.icon} onChange={(name) => setEditing({ ...editing, icon: name })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateHobby.isPending || !editing?.name.trim()}>
              {updateHobby.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

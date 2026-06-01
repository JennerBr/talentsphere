import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useMembers,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition,
} from "@/lib/use-data";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface OrgPosition {
  id: number;
  name: string;
  chairs: number;
  allocated?: number;
  parent_id: number | null;
  organizacao_id?: number;
  children?: OrgPosition[];
  _totalChairs?: number;
  _totalAllocated?: number;
  createdBy?: string;
  createdAt?: string;
}

interface OrgChartProps {
  data: OrgPosition[];
  organizacaoId?: number;
}

export function OrgChart({ data, organizacaoId }: OrgChartProps) {
  const [positions, setPositions] = useState<OrgPosition[]>(data);
  const { data: allMembers = [] } = useMembers();

  const employees = useMemo(
    () => allMembers.filter(e => e.organizacaoId?.toString() === (organizacaoId?.toString() ?? e.organizacaoId?.toString())),
    [allMembers, organizacaoId]
  );

  const employeeCountByPosition = useMemo(() => {
    const counts = new Map<number, number>();
    for (const emp of allMembers) {
      if (emp.positionId !== null && emp.positionId !== undefined) {
        counts.set(emp.positionId, (counts.get(emp.positionId) ?? 0) + 1);
      }
    }
    return counts;
  }, [allMembers]);
  const [editingPosition, setEditingPosition] = useState<OrgPosition | null>(null);
  const [addingToPosition, setAddingToPosition] = useState<OrgPosition | null>(null);
  const [viewingPosition, setViewingPosition] = useState<OrgPosition | null>(null);

  // Edit form state (controlled)
  const [editName, setEditName] = useState("");
  const [editChairs, setEditChairs] = useState(1);
  const [editParentId, setEditParentId] = useState<string>("none");

  // Add form state
  const [newSection, setNewSection] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newChairs, setNewChairs] = useState(1);

  const createPosition = useCreatePosition();
  const updatePosition = useUpdatePosition();
  const deletePosition = useDeletePosition();
  const { toast } = useToast();

  // Initialize with all parent nodes expanded
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const allParentIds = new Set<number>();
    data.forEach(item => {
      if (item.parent_id !== null) {
        allParentIds.add(item.parent_id);
      }
    });
    return allParentIds;
  });

  // Build tree from flat data
  const buildTree = (flatData: OrgPosition[]): OrgPosition[] => {
    const dataMap = new Map<number, OrgPosition>();
    const roots: OrgPosition[] = [];

    flatData.forEach(item => {
      const realAllocated = employeeCountByPosition.get(item.id) ?? item.allocated ?? 0;
      dataMap.set(item.id, { ...item, allocated: realAllocated, children: [] });
    });

    flatData.forEach(item => {
      const node = dataMap.get(item.id)!;
      if (item.parent_id === null) {
        roots.push(node);
      } else {
        const parent = dataMap.get(item.parent_id);
        if (parent) {
          parent.children!.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    const calculateTotals = (node: OrgPosition) => {
      let totalChairs = node.chairs;
      let totalAllocated = node.allocated || 0;
      if (node.children) {
        node.children.forEach(child => {
          calculateTotals(child);
          totalChairs += child._totalChairs || 0;
          totalAllocated += child._totalAllocated || 0;
        });
      }
      node._totalChairs = totalChairs;
      node._totalAllocated = totalAllocated;
    };

    roots.forEach(calculateTotals);
    return roots;
  };

  const tree = useMemo(() => buildTree(positions), [positions, employeeCountByPosition]);

  const flattenTree = (nodes: OrgPosition[], level = 0): (OrgPosition & { level: number })[] => {
    let result: (OrgPosition & { level: number })[] = [];
    for (const node of nodes) {
      result.push({ ...node, level });
      if (expandedIds.has(node.id) && node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1));
      }
    }
    return result;
  };

  const visibleNodes = useMemo(() => flattenTree(tree), [tree, expandedIds]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openEdit = (node: OrgPosition) => {
    setEditingPosition(node);
    setEditName(node.name);
    setEditChairs(node.chairs);
    setEditParentId(node.parent_id?.toString() ?? "none");
  };

  const handleSave = () => {
    if (!editingPosition) return;
    const orgId = editingPosition.organizacao_id ?? organizacaoId;
    if (!orgId) {
      toast({ title: "Organização não identificada.", variant: "destructive" });
      return;
    }
    updatePosition.mutate(
      {
        id: editingPosition.id,
        name: editName,
        chairs: editChairs,
        parentId: editParentId === "none" ? null : Number(editParentId),
        organizacaoId: orgId,
      },
      {
        onSuccess: (updated) => {
          setPositions(prev =>
            prev.map(p => p.id === updated.id
              ? { ...p, name: updated.name, chairs: updated.chairs, parent_id: updated.parentId }
              : p
            )
          );
          setEditingPosition(null);
          toast({ title: "Posição atualizada." });
        },
        onError: (err) => {
          toast({ title: "Erro ao atualizar posição", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!editingPosition) return;
    if (!confirm(`Excluir a posição "${editingPosition.name}"?`)) return;
    deletePosition.mutate(editingPosition.id, {
      onSuccess: () => {
        setPositions(prev => prev.filter(p => p.id !== editingPosition.id));
        setEditingPosition(null);
        toast({ title: "Posição excluída." });
      },
      onError: (err) => {
        toast({ title: "Erro ao excluir posição", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleAdd = () => {
    const orgId = addingToPosition?.organizacao_id ?? organizacaoId;
    if (!orgId) {
      toast({ title: "Organização não identificada.", variant: "destructive" });
      return;
    }
    const positionName = newSection
      ? `${newSection} - ${newRole}`
      : newRole;

    createPosition.mutate(
      {
        name: positionName,
        chairs: newSection ? 0 : newChairs,
        allocated: 0,
        parentId: addingToPosition?.id ?? null,
        organizacaoId: orgId,
        createdBy: null,
        createdAt: null,
      },
      {
        onSuccess: (created) => {
          setPositions(prev => [
            ...prev,
            {
              id: created.id,
              name: created.name,
              chairs: created.chairs,
              allocated: created.allocated,
              parent_id: created.parentId,
              organizacao_id: created.organizacaoId,
            },
          ]);
          setAddingToPosition(null);
          setNewSection("");
          setNewRole("");
          setNewChairs(1);
          toast({ title: "Posição adicionada." });
        },
        onError: (err) => {
          toast({ title: "Erro ao adicionar posição", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const isSaving = updatePosition.isPending || createPosition.isPending;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full bg-card border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[50%] font-semibold">Departamento / Cargo</TableHead>
              <TableHead className="text-center font-semibold">Cadeiras</TableHead>
              <TableHead className="text-center font-semibold">Alocados</TableHead>
              <TableHead className="text-center font-semibold">Vagas</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleNodes.map((node) => {
              const hasChildren = node.children && node.children.length > 0;
              const isExpanded = expandedIds.has(node.id);
              const diff = (node._totalChairs || 0) - (node._totalAllocated || 0);
              const isPositive = diff > 0;

              return (
                <TableRow
                  key={node.id}
                  className={cn("group transition-colors cursor-pointer", node.level === 0 ? "bg-muted/10" : "")}
                  onClick={() => setViewingPosition(node)}
                >
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center gap-2"
                          style={{ paddingLeft: `${node.level * 1.5}rem` }}
                        >
                          {hasChildren ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(node.id);
                              }}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                          ) : (
                            <div className="w-5 h-5" />
                          )}
                          <span className="truncate">
                            {node.name.includes(" - ") ? (
                              <>
                                <span className={cn(hasChildren ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                                  {node.name.split(" - ")[0]}
                                </span>
                                <span className="text-muted-foreground font-normal">
                                  {" - "}{node.name.split(" - ").slice(1).join(" - ")}
                                </span>
                              </>
                            ) : (
                              <span className={cn(hasChildren ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                                {node.name}
                              </span>
                            )}
                          </span>
                          {node.createdBy && (
                            <Info className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </TooltipTrigger>
                      {node.createdBy && (
                        <TooltipContent side="right" className="text-xs">
                          <p>Criado por: <span className="font-semibold">{node.createdBy}</span></p>
                          {node.createdAt && (
                            <p className="text-muted-foreground">
                              em {format(new Date(node.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    {hasChildren ? (
                      <span className="font-semibold text-foreground">{node._totalChairs}</span>
                    ) : (
                      <span className="text-muted-foreground font-medium">{node.chairs}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {hasChildren ? (
                      <span className="font-semibold text-foreground">{node._totalAllocated}</span>
                    ) : (
                      <span className="text-muted-foreground font-medium">{node.allocated}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {diff !== 0 ? (
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center justify-center min-w-[2rem]",
                        isPositive ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                      )}>
                        {isPositive ? `+${diff}` : diff}
                      </span>
                    ) : (
                      <span className="text-muted-foreground opacity-50">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingToPosition(node);
                          setNewSection("");
                          setNewRole("");
                          setNewChairs(1);
                        }}
                        title="Adicionar sub-posição"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(node);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {visibleNodes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhuma posição encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingPosition} onOpenChange={(open) => !open && setEditingPosition(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Posição</DialogTitle>
          </DialogHeader>
          {editingPosition && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome (Seção - Cargo)</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chairs">Quantidade de Cadeiras Previstas</Label>
                <Input
                  id="chairs"
                  type="number"
                  min="1"
                  value={editChairs}
                  onChange={e => setEditChairs(Number(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent_id">Posição Pai (Reporta a)</Label>
                <Select value={editParentId} onValueChange={setEditParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma (Nível C-Level/Diretoria)</SelectItem>
                    {positions
                      .filter(p => p.id !== editingPosition.id)
                      .map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="destructive"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={handleDelete}
              disabled={deletePosition.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditingPosition(null)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!editName || isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add sub-position dialog */}
      <Dialog open={!!addingToPosition} onOpenChange={(open) => !open && setAddingToPosition(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Posição</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Adicionando sob: <span className="font-semibold text-foreground">{addingToPosition?.name}</span>
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new_section">Seção (Opcional)</Label>
              <Input
                id="new_section"
                placeholder="Ex: Comercial, TI, Vendas..."
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Se preenchido, criará um novo nível de seção.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new_role">Cargo</Label>
              <Input
                id="new_role"
                placeholder="Ex: Analista Sênior, Desenvolvedor..."
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
            </div>
            {!newSection && (
              <div className="grid gap-2">
                <Label htmlFor="new_chairs">Quantidade de Cadeiras</Label>
                <Input
                  id="new_chairs"
                  type="number"
                  min="1"
                  value={newChairs}
                  onChange={(e) => setNewChairs(parseInt(e.target.value) || 1)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingToPosition(null)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={!newRole || createPosition.isPending}>
              {createPosition.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View position occupants dialog */}
      <Dialog open={!!viewingPosition} onOpenChange={(open) => !open && setViewingPosition(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="truncate pr-4">{viewingPosition?.name}</DialogTitle>
            {viewingPosition && (() => {
              const posEmployees = allMembers.filter(e => e.positionId === viewingPosition.id);
              return (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">{posEmployees.length}</span> pessoa(s) alocada(s) de <span className="font-semibold text-foreground">{viewingPosition.chairs || 0}</span> cadeira(s) diretas previstas
                </p>
              );
            })()}
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {viewingPosition && (() => {
              const posEmployees = allMembers.filter(e => e.positionId === viewingPosition.id);
              if (posEmployees.length === 0) {
                return (
                  <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20 flex flex-col items-center">
                    <Users className="h-8 w-8 mb-2 text-muted-foreground/50" />
                    <p>Nenhuma pessoa alocada.</p>
                  </div>
                );
              }
              return posEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={emp.avatar ?? undefined} />
                      <AvatarFallback>{emp.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{emp.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {[emp.role, emp.seniority].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = "/profile"}>Ver Perfil</Button>
                </div>
              ));
            })()}
          </div>
          <DialogFooter className="sm:justify-between flex-row-reverse sm:flex-row">
            <Button variant="ghost" onClick={() => setViewingPosition(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

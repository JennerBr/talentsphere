import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { OrgChart } from "@/components/shared/org-chart";
import { useCompany } from "@/lib/company-context";
import { useMemo } from "react";
import { usePositions } from "@/lib/use-data";

export default function AdminPosicoes() {
  const { selectedOrg } = useCompany();
  const { data: allPositions = [] } = usePositions();

  const filteredPositions = useMemo(() => {
    return allPositions
      .map(p => ({
        id: p.id,
        name: p.name,
        chairs: p.chairs,
        allocated: p.allocated,
        parent_id: p.parentId,
        organizacao_id: p.organizacaoId,
        createdBy: p.createdBy ?? "",
        createdAt: p.createdAt ?? "",
      }));
  }, [allPositions]);

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          {selectedOrg?.logo && (
            <div className="h-16 w-16 rounded overflow-hidden border shadow-sm">
              <img src={selectedOrg.logo} alt={selectedOrg.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departamentos - {selectedOrg?.name ?? ""}</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Estrutura Organizacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPositions.length > 0 ? (
              <OrgChart data={filteredPositions} key={selectedOrg?.id} />
            ) : (
              <div className="p-12 text-center text-muted-foreground border rounded-lg bg-muted/20">
                Nenhuma posição cadastrada para esta organizacao.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

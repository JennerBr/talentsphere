import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { OrgChart } from "@/components/shared/org-chart";
import { MOCK_POSITIONS } from "@/lib/mock-data";
import { useCompany } from "@/lib/company-context";
import { useMemo } from "react";

export default function AdminPosicoes() {
  const { selectedCompany } = useCompany();
  
  const filteredPositions = useMemo(() => {
    return MOCK_POSITIONS.filter(p => p.organizacao_id.toString() === selectedCompany.id);
  }, [selectedCompany.id]);

  return (
    <AppLayout role="manager" userName="Admin Sistema" userTitle="Administrador Global">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          {selectedCompany.logo && (
            <div className="h-16 w-16 rounded overflow-hidden border shadow-sm">
              <img src={selectedCompany.logo} alt={selectedCompany.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departamentos - {selectedCompany.name}</h1>
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
              <OrgChart data={filteredPositions} key={selectedCompany.id} />
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
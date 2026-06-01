import React, { createContext, useContext, useState, useEffect } from "react";

export interface OrgOption {
  id: number;
  name: string;
  logo: string | null;
}

type CompanyContextType = {
  selectedOrg: OrgOption | null;
  setSelectedOrg: (org: OrgOption) => void;
  availableOrgs: OrgOption[];
  setAvailableOrgs: (orgs: OrgOption[]) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const STORAGE_KEY = "talent_sphere_active_org_id";

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [availableOrgs, setAvailableOrgs] = useState<OrgOption[]>([]);
  const [selectedOrg, setSelectedOrgState] = useState<OrgOption | null>(null);

  useEffect(() => {
    if (availableOrgs.length === 0) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedId = stored ? Number(stored) : null;
    const match = storedId ? availableOrgs.find((o) => o.id === storedId) : null;
    setSelectedOrgState(match ?? availableOrgs[0]);
  }, [availableOrgs]);

  function setSelectedOrg(org: OrgOption) {
    setSelectedOrgState(org);
    localStorage.setItem(STORAGE_KEY, String(org.id));
  }

  return (
    <CompanyContext.Provider value={{ selectedOrg, setSelectedOrg, availableOrgs, setAvailableOrgs }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}

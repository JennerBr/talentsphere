import React, { createContext, useContext, useState } from "react";

export const MOCK_COMPANIES = [
  { id: "1", name: "Tech Corp", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format" },
  { id: "2", name: "Global Industries", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&auto=format" },
  { id: "3", name: "InovaTech", logo: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=100&h=100&fit=crop&auto=format" }
];

type CompanyContextType = {
  selectedCompany: typeof MOCK_COMPANIES[0];
  setSelectedCompany: (company: typeof MOCK_COMPANIES[0]) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState(MOCK_COMPANIES[0]);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>
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
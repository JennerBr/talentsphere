#!/bin/bash
sed -i 's|import { Header } from "@/components/layout/header";|import { Header } from "@/components/layout/header";\nimport { useEffect, useState } from "react";|g' client/src/components/layout/app-layout.tsx

cat << 'INNER_EOF' > client/src/components/layout/app-layout.tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  role: "manager" | "employee";
  userName?: string;
  userTitle?: string;
}

export function AppLayout({ children, role, userName, userTitle }: AppLayoutProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  const isDualRole = userEmail === "jenner.lopes@institutojef.org.br";
  const currentName = userEmail === "jenner.lopes@institutojef.org.br" ? "Jenner Lopes" : (userEmail === "jenner70@gmail.com" ? "Jenner Aluno" : userName || "Usuário");
  const currentTitle = isDualRole ? (role === "manager" ? "Tech Manager / Squad A" : "Desenvolvedor Frontend") : (userEmail === "jenner70@gmail.com" ? "Aluno JEF" : userTitle || "Cargo");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar role={role} className="hidden md:flex h-screen sticky top-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={currentName} userTitle={currentTitle} />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
INNER_EOF

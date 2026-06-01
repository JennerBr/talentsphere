const fs = require('fs');

const filePath = 'client/src/components/layout/app-layout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
content = content.replace(
  'import { useEffect, useState } from "react";',
  'import { useEffect, useState } from "react";\nimport { Sheet, SheetContent } from "@/components/ui/sheet";'
);

// Update interface
content = content.replace(
  'export function AppLayout({ children, role, userName, userTitle }: AppLayoutProps) {',
  'export function AppLayout({ children, role, userName, userTitle }: AppLayoutProps) {\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);'
);

// Update return statement
const oldReturn = `    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar role={role} className="hidden md:flex h-screen sticky top-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={currentName} userTitle={currentTitle} />
        <main className="flex-1 p-4 md:p-8 overflow-auto">`;

const newReturn = `    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar role={role} className="hidden md:flex h-screen sticky top-0" />
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <Sidebar role={role} className="flex h-full w-full border-none" onNavigate={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Header 
          userName={currentName} 
          userTitle={currentTitle} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-auto">`;

content = content.replace(oldReturn, newReturn);

fs.writeFileSync(filePath, content);
console.log("Updated AppLayout successfully");

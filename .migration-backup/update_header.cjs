const fs = require('fs');

const filePath = 'client/src/components/layout/header.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update imports
content = content.replace(
  'import { Bell, Search } from "lucide-react";',
  'import { Bell, Search, Menu } from "lucide-react";'
);

// Update interface
content = content.replace(
  'interface HeaderProps {\n  userName: string;\n  userTitle: string;\n}',
  'interface HeaderProps {\n  userName: string;\n  userTitle: string;\n  onMenuClick?: () => void;\n}'
);

// Update component signature
content = content.replace(
  'export function Header({ userName, userTitle }: HeaderProps) {',
  'export function Header({ userName, userTitle, onMenuClick }: HeaderProps) {'
);

// Add menu button
const oldHeaderStart = '    <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0">\n      <div className="flex-1 flex items-center gap-4">\n        <div className="relative w-96 hidden md:block">';

const newHeaderStart = `    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden -ml-2" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        
        <div className="relative w-full max-w-sm hidden md:block">`;

content = content.replace(oldHeaderStart, newHeaderStart);

fs.writeFileSync(filePath, content);
console.log("Updated Header successfully");

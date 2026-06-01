const fs = require('fs');

const filePath = 'client/src/components/layout/sidebar.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'const showManagerLinks = role === "manager" || isDualRole;',
  '// const showManagerLinks = role === "manager" || isDualRole;\n  const showManagerLinks = true; // Liberado por padrão temporariamente'
);

fs.writeFileSync(filePath, content);
console.log("Updated Sidebar visibility successfully");

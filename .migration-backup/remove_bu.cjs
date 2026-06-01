const fs = require('fs');

// UPDATE APP.TSX
let appContent = fs.readFileSync('client/src/App.tsx', 'utf8');
appContent = appContent.replace(`import AdminBU from "@/pages/admin-bu";\n`, ``);
appContent = appContent.replace(`      <Route path="/admin/bu" component={AdminBU} />\n`, ``);
fs.writeFileSync('client/src/App.tsx', appContent);

// UPDATE SIDEBAR.TSX
let sidebarContent = fs.readFileSync('client/src/components/layout/sidebar.tsx', 'utf8');
sidebarContent = sidebarContent.replace(`    { href: "/admin/bu", label: "Business Units", icon: Network },\n`, ``);
fs.writeFileSync('client/src/components/layout/sidebar.tsx', sidebarContent);

// DELETE BU FILE
try {
  fs.unlinkSync('client/src/pages/admin-bu.tsx');
} catch(e) {}

console.log('done');

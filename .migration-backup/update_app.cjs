const fs = require('fs');
const file = 'client/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(
  `import EmployeeProjects from "@/pages/employee-projects";`,
  `import EmployeeProjects from "@/pages/employee-projects";
import AdminDashboard from "@/pages/admin-dashboard";`
);

// Add route
content = content.replace(
  `      <Route path="/manager/mobility" component={ManagerMobility} />`,
  `      <Route path="/manager/mobility" component={ManagerMobility} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />`
);

fs.writeFileSync(file, content);
console.log('updated app.tsx');

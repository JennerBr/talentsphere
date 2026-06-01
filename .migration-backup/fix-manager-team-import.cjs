const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

// The error is because we inserted `import { useLocation } from "wouter";` inside the component body
// Let's move it to the top and fix the handleSelectMember function

// 1. Remove the import from inside the component
content = content.replace(/import \{ useLocation \} from "wouter";/g, '');

// 2. Add it to the top imports if not there
if (!content.includes('import { useLocation }')) {
  content = content.replace('import { useState } from "react";', 'import { useState } from "react";\\nimport { useLocation } from "wouter";');
}

// 3. Fix handleSelectMember
const oldHandleSelectMember = `  // Need to fix this component to use useLocation hook
  // When a member is selected, navigate to the employee profile page with the member ID
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      window.location.href = '/employee/profile';
    } else {
      window.location.href = \\\`/employee/profile?id=\${member.id}\\\`;
    }
  };`;

const newHandleSelectMember = `  const [, setLocation] = useLocation();
  // When a member is selected, navigate to the employee profile page with the member ID
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      setLocation('/employee/profile');
    } else {
      setLocation(\`/employee/profile?id=\${member.id}\`);
    }
  };`;

content = content.replace(oldHandleSelectMember, newHandleSelectMember);
fs.writeFileSync('client/src/pages/manager-team.tsx', content);

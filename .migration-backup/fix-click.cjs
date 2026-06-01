const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

// Replace the old handleSelectMember definition with the correct wouter location hook
const newContent = content.replace(
  `  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      window.location.href = '/employee/profile';
    } else {
      window.location.href = \\\`/employee/profile?id=\${member.id}\\\`;
    }
  };`,
  `  const [, setLocation] = useLocation();
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      setLocation('/employee/profile');
    } else {
      setLocation(\`/employee/profile?id=\${member.id}\`);
    }
  };`
);

fs.writeFileSync('client/src/pages/manager-team.tsx', newContent);

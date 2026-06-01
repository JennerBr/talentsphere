const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

const oldFn = `  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      window.location.href = '/employee/profile';
    } else {
      window.location.href = \`/employee/profile?id=\${member.id}\`;
    }
  };`;

const newFn = `  const [, setLocation] = useLocation();
  const handleSelectMember = (member: Member) => {
    if (member.id === 'me') {
      setLocation('/employee/profile');
    } else {
      setLocation(\`/employee/profile?id=\${member.id}\`);
    }
  };`;

content = content.replace(oldFn, newFn);
fs.writeFileSync('client/src/pages/manager-team.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

// The issue might be that in OrgNode, it's expecting an a-tag or something else.
// Wait, in OrgNode onClick we have:
// onClick={(e) => {
//   if ((e.target as HTMLElement).closest('button')) return;
//   onSelectMember(node);
// }}
// The node.id is what we need to pass

// We should check what onSelectMember is receiving in OrgNode.
console.log("Checking if handleSelectMember exists correctly...");
const match = content.match(/const handleSelectMember = \([^)]*\) => \{[^}]+\};/s);
console.log(match ? "Found!" : "Not found!");

// Let's rewrite it just to be absolutely sure
const newHandle = `  const [, setLocation] = useLocation();
  const handleSelectMember = (member: Member) => {
    if (!member || !member.id) return;
    if (member.id === 'me') {
      setLocation('/employee/profile');
    } else {
      setLocation(\`/employee/profile?id=\${member.id}\`);
    }
  };`;

content = content.replace(/  const \[, setLocation\] = useLocation\(\);\s+const handleSelectMember = \(member: Member\) => \{[\s\S]*?\};\s+/, newHandle + '\n\n');

fs.writeFileSync('client/src/pages/manager-team.tsx', content);

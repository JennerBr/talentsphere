const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

// The click handler in OrgNode needs to be updated to ensure it's triggering properly
const oldClick = `        onClick={(e) => {
          // Prevent opening if clicking expand/collapse
          if ((e.target as HTMLElement).closest('button')) return;
          onSelectMember(node);
        }}`;

const newClick = `        onClick={(e) => {
          // Prevent opening if clicking expand/collapse
          if ((e.target as HTMLElement).closest('button')) return;
          onSelectMember(node);
        }}`;

// Let's check what handleSelectMember actually is
const handleSelectMatch = content.match(/const handleSelectMember = \([^)]+\) => \{[^}]+\};/);
if (handleSelectMatch) {
  console.log("Current handleSelectMember:", handleSelectMatch[0]);
} else {
  // Try another regex if it spans multiple lines
  const handleSelectMatch2 = content.match(/const handleSelectMember = [\s\S]*?\n  \};/);
  if (handleSelectMatch2) {
    console.log("Current handleSelectMember:", handleSelectMatch2[0]);
  }
}


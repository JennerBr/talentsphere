const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

content = content.replace(
  /<OrgNode key=\{node\.id\} node=\{node\} level=\{0\} indexStr=\{`\$\{idx \+ 1\}`\} onSelectMember=\{setSelectedMember\} \/>/g,
  '<OrgNode key={node.id} node={node} level={0} indexStr={`${idx + 1}`} onSelectMember={handleSelectMember} />'
);

fs.writeFileSync('client/src/pages/manager-team.tsx', content);

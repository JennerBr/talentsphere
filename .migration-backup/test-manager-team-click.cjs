const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');

// The issue might be the useLocation call inside the main component vs a nested hook.
// Or maybe the onClick of the item is calling something else.
const orgNodeCall = content.match(/<OrgNode[^>]+onSelectMember=\{[^}]+\}/g);
console.log("OrgNode usage:", orgNodeCall);

const clickHandler = content.match(/onClick=\{\(e\)[^}]+\}\}/g);
console.log("onClick handlers:", clickHandler.slice(0, 3));

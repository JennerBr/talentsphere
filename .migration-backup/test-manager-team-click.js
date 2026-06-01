const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');
const match = content.match(/onSelectMember=\{(.*?)\}/g);
console.log(match);

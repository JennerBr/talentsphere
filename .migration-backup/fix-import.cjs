const fs = require('fs');
let content = fs.readFileSync('client/src/pages/manager-team.tsx', 'utf8');
content = content.replace('import { useState } from "react";\\nimport { useLocation } from "wouter";', 'import { useState } from "react";\nimport { useLocation } from "wouter";');
fs.writeFileSync('client/src/pages/manager-team.tsx', content);

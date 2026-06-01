const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const oldClick = `  const handleStudentClick = (studentId: number) => {
    setOpen(false);
    setLocation(\\\`/manager/team?student=\\\${studentId}\\\`);
  };`;
  
  const oldClick2 = `  const handleStudentClick = (studentId: number) => {
    // Navigate to a student specific view (mocking it by going to team with query or just dashboard)
    // In a real app this would go to /manager/team?student=\\$\\{studentId\\}
    setLocation(\\\`/manager/team?student=\\\${studentId}\\\`);
  };`;

  const newClick = `  const handleStudentClick = (studentId: number) => {
    if (typeof setOpen === 'function') setOpen(false);
    setLocation(\`/employee/profile?id=\${studentId}\`);
  };`;

  let updated = false;
  if (content.includes('setLocation(`/manager/team?student=${studentId}`)')) {
    content = content.replace(/setLocation\(`\/manager\/team\?student=\$\{studentId\}`\);/g, 'setLocation(`/employee/profile?id=${studentId}`);');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}

updateFile('client/src/components/shared/student-selector.tsx');
updateFile('client/src/components/shared/student-selector-modal.tsx');

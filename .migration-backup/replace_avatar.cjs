const fs = require('fs');
const content = fs.readFileSync('client/src/components/layout/header.tsx', 'utf8');
const oldStr = `          <Avatar className="h-9 w-9 border">
            <AvatarImage src={\`https://i.pravatar.cc/150?u=\${userEmail || 'default@example.com'}\`} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>`;
const newStr = `          <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>`;
fs.writeFileSync('client/src/components/layout/header.tsx', content.replace(oldStr, newStr));

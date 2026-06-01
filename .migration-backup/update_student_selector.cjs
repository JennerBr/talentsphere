const fs = require('fs');

const filePath = 'client/src/components/shared/student-selector.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '<DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">',
  '<DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 m-0 border-0 flex flex-col rounded-none sm:rounded-none">'
);

content = content.replace(
  '<DialogHeader>',
  '<DialogHeader className="p-6 pb-2">'
);

content = content.replace(
  '<div className="flex flex-col gap-4 py-4 overflow-hidden">',
  '<div className="flex flex-col gap-4 py-4 px-6 overflow-hidden flex-1">'
);

content = content.replace(
  '<ScrollArea className="w-full whitespace-nowrap pb-2">',
  '<div className="w-full">'
);

content = content.replace(
  '<div className="flex gap-2">',
  '<div className="flex flex-wrap gap-2 pb-2">'
);

content = content.replaceAll(
  '<div className="w-px h-5 bg-border mx-1 self-center" />',
  '<div className="w-px h-5 bg-border mx-1 self-center hidden sm:block" />'
);

content = content.replace(
  '<ScrollBar orientation="horizontal" />\n              </ScrollArea>',
  '</div>'
);

content = content.replace(
  '<ScrollArea className="flex-1 -mx-4 px-4 h-[40vh]">',
  '<ScrollArea className="flex-1 -mx-6 px-6 h-full">'
);

content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pb-4">',
  '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">'
);

fs.writeFileSync(filePath, content);
console.log("Updated successfully");

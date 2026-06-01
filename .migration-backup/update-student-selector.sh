#!/bin/bash
sed -i 's|<ScrollArea className="w-full">|<div className="w-full">|g' client/src/components/shared/student-selector.tsx

sed -i 's|<div className="flex w-max space-x-4 pb-4 pt-1 px-1">|<div className="flex flex-wrap gap-2 sm:gap-4 justify-start pt-1 px-1">|g' client/src/components/shared/student-selector.tsx

sed -i 's|className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"|className="flex flex-col items-center gap-1 group transition-transform hover:-translate-y-1"|g' client/src/components/shared/student-selector.tsx

sed -i 's|style={{ width: '"'"'72px'"'"' }}|style={{ width: '"'"'64px'"'"' }}|g' client/src/components/shared/student-selector.tsx

sed -i 's|className="h-14 w-14 border-2 border-transparent group-hover:border-primary transition-colors shadow-sm"|className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-transparent group-hover:border-primary transition-colors shadow-sm"|g' client/src/components/shared/student-selector.tsx

sed -i 's|className="text-\[11px\] font-medium leading-tight text-center line-clamp-2 w-full mt-1"|className="text-\[10px\] sm:text-\[11px\] font-medium leading-tight text-center line-clamp-2 w-full mt-1"|g' client/src/components/shared/student-selector.tsx

sed -i 's|<br/>|<br className="hidden sm:block"/>|g' client/src/components/shared/student-selector.tsx

sed -i 's|<span className="text-muted-foreground font-normal">{student.name.split('"'"' '"'"')\[1\]}</span>|<span className="text-muted-foreground font-normal hidden sm:inline"> {student.name.split('"'"' '"'"')\[1\]}</span>|g' client/src/components/shared/student-selector.tsx

sed -i 's|</ScrollArea>|</div\>|g' client/src/components/shared/student-selector.tsx

sed -i '/<ScrollBar orientation="horizontal" \/>/d' client/src/components/shared/student-selector.tsx

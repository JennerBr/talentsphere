#!/bin/bash
# Need to put back the ScrollArea closing tag and ScrollBar for the upper part
sed -i 's|</div\>|</ScrollArea>|g' client/src/components/shared/student-selector.tsx

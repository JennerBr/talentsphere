#!/bin/bash

# Fix manager-chat.tsx
sed -i 's|import { AppLayout } from "@/components/layout/app-layout";\nimport { StudentSelector } from "@/components/shared/student-selector";|import { AppLayout } from "@/components/layout/app-layout";\nimport { StudentSelector } from "@/components/shared/student-selector";|g' client/src/pages/manager-chat.tsx

# The previous replacement in manager-chat.tsx might not have worked correctly due to the exact structure.
# Let's use a simpler approach
sed -i '/import { AppLayout }/a import { StudentSelector } from "@/components/shared/student-selector";' client/src/pages/manager-chat.tsx
# Remove duplicate if exists
awk '!seen[$0]++' client/src/pages/manager-chat.tsx > temp.tsx && mv temp.tsx client/src/pages/manager-chat.tsx

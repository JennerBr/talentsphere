#!/bin/bash

# Update manager-dashboard.tsx
sed -i 's|import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";|import { StudentSelector } from "@/components/shared/student-selector";\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";|g' client/src/pages/manager-dashboard.tsx

sed -i 's|<div className="space-y-6 max-w-6xl mx-auto">|<div className="space-y-6 max-w-6xl mx-auto">\n        <StudentSelector />|g' client/src/pages/manager-dashboard.tsx

# Update manager-team.tsx
sed -i 's|import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|import { StudentSelector } from "@/components/shared/student-selector";\nimport { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|g' client/src/pages/manager-team.tsx

sed -i 's|<div className="space-y-6 max-w-6xl mx-auto">|<div className="space-y-6 max-w-6xl mx-auto">\n        <StudentSelector />|g' client/src/pages/manager-team.tsx

# Update manager-logbook.tsx
sed -i 's|import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|import { StudentSelector } from "@/components/shared/student-selector";\nimport { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|g' client/src/pages/manager-logbook.tsx

sed -i 's|<div className="space-y-6 max-w-6xl mx-auto">|<div className="space-y-6 max-w-6xl mx-auto">\n        <StudentSelector />|g' client/src/pages/manager-logbook.tsx

# Update manager-mobility.tsx
sed -i 's|import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|import { StudentSelector } from "@/components/shared/student-selector";\nimport { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";|g' client/src/pages/manager-mobility.tsx

sed -i 's|<div className="space-y-6 max-w-6xl mx-auto">|<div className="space-y-6 max-w-6xl mx-auto">\n        <StudentSelector />|g' client/src/pages/manager-mobility.tsx

# Update manager-chat.tsx
sed -i 's|import { AppLayout } from "@/components/layout/app-layout";|import { AppLayout } from "@/components/layout/app-layout";\nimport { StudentSelector } from "@/components/shared/student-selector";|g' client/src/pages/manager-chat.tsx

sed -i 's|<div className="flex flex-col h-\[calc(100vh-8rem)\] max-w-5xl mx-auto gap-4">|<div className="max-w-5xl mx-auto mb-4">\n        <StudentSelector />\n      </div>\n      <div className="flex flex-col h-\[calc(100vh-14rem)\] max-w-5xl mx-auto gap-4">|g' client/src/pages/manager-chat.tsx


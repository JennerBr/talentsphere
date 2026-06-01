#!/bin/bash
sed -i 's|import { Bell, Search } from "lucide-react";|import { Bell, Search } from "lucide-react";\nimport { StudentSelectorModal } from "@/components/shared/student-selector-modal";|g' client/src/components/layout/header.tsx

sed -i 's|<Button variant="ghost" size="icon" className="relative">|<StudentSelectorModal />\n        <Button variant="ghost" size="icon" className="relative">|g' client/src/components/layout/header.tsx

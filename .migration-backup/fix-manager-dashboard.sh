#!/bin/bash
sed -i 's|import { StudentSelector } from "@/components/shared/student-selector";||g' client/src/pages/manager-dashboard.tsx
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-dashboard.tsx

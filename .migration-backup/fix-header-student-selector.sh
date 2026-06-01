#!/bin/bash
sed -i 's|<StudentSelectorModal \/>|{isManagerView \&\& <StudentSelectorModal />}|g' client/src/components/layout/header.tsx

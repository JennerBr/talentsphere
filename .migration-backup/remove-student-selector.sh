#!/bin/bash
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-dashboard.tsx
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-team.tsx
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-logbook.tsx
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-mobility.tsx
sed -i '/<StudentSelector \/>/d' client/src/pages/manager-chat.tsx

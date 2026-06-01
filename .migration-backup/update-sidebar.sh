#!/bin/bash
sed -i '/<Link href="\/employee\/profile">/d' client/src/components/layout/sidebar.tsx
sed -i '/<a className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors"/,+6d' client/src/components/layout/sidebar.tsx

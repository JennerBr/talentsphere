#!/bin/bash
find client/src -type f -name "*.tsx" -exec sed -i 's|https://api.dicebear.com/7.x/avataaars/svg?seed=\([^"]*\)|https://i.pravatar.cc/150?u=\1@exemplo.com|g' {} +

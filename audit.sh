#!/bin/bash

echo "=== PROJECT AUDIT REPORT ==="
echo ""

echo "1. CHECKING ENVIRONMENT VARIABLES..."
if [ -f ".env.development.local" ]; then
  echo "   ✓ .env.development.local exists"
  grep -o "NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_ANON_KEY\|SUPABASE_SERVICE_ROLE_KEY\|DATABASE_URL\|RESEND_API_KEY" .env.development.local | sort | uniq
else
  echo "   ✗ .env.development.local missing"
fi

echo ""
echo "2. CHECKING DEPENDENCIES..."
if grep -q "@supabase/supabase-js" package.json; then
  echo "   ✓ Supabase JS client installed"
fi
if grep -q "@supabase/ssr" package.json; then
  echo "   ✓ Supabase SSR installed"
fi
if grep -q "drizzle-orm" package.json; then
  echo "   ✓ Drizzle ORM installed"
fi
if grep -q "resend" package.json; then
  echo "   ✓ Resend email client installed"
fi

echo ""
echo "3. CHECKING AUTH FILES..."
test -f "lib/auth-client.ts" && echo "   ✓ lib/auth-client.ts" || echo "   ✗ lib/auth-client.ts missing"
test -f "lib/supabase/server.ts" && echo "   ✓ lib/supabase/server.ts" || echo "   ✗ lib/supabase/server.ts missing"
test -f "providers/auth-provider.tsx" && echo "   ✓ providers/auth-provider.tsx" || echo "   ✗ providers/auth-provider.tsx missing"

echo ""
echo "4. CHECKING DATABASE FILES..."
test -f "lib/db/schema.ts" && echo "   ✓ lib/db/schema.ts" || echo "   ✗ lib/db/schema.ts missing"
test -f "lib/db/index.ts" && echo "   ✓ lib/db/index.ts" || echo "   ✗ lib/db/index.ts missing"
test -f "migrations/001_create_tables.sql" && echo "   ✓ migrations/001_create_tables.sql" || echo "   ✗ migrations/001_create_tables.sql missing"

echo ""
echo "5. CHECKING SERVER ACTIONS..."
test -f "app/actions/profile-actions.ts" && echo "   ✓ app/actions/profile-actions.ts" || echo "   ✗ missing"
test -f "app/actions/resume-actions.ts" && echo "   ✓ app/actions/resume-actions.ts" || echo "   ✗ missing"
test -f "app/actions/analytics-actions.ts" && echo "   ✓ app/actions/analytics-actions.ts" || echo "   ✗ missing"
test -f "app/actions/notification-actions.ts" && echo "   ✓ app/actions/notification-actions.ts" || echo "   ✗ missing"
test -f "app/actions/email-notification-actions.ts" && echo "   ✓ app/actions/email-notification-actions.ts" || echo "   ✗ missing"

echo ""
echo "6. CHECKING EMAIL SERVICE..."
test -f "lib/email/email-service.ts" && echo "   ✓ lib/email/email-service.ts" || echo "   ✗ missing"

echo ""
echo "7. CHECKING LAYOUT FILES..."
test -f "app/layout.tsx" && echo "   ✓ app/layout.tsx (root)" || echo "   ✗ missing"
test -f "app/(dashboard)/layout.tsx" && echo "   ✓ app/(dashboard)/layout.tsx (dashboard)" || echo "   ✗ missing"

echo ""
echo "=== END AUDIT ==="

# Code Quality Analysis Report - APPChanthana

**Date:** 2025-10-05
**Agent:** code-quality-specialist
**Duration:** 15 minutes
**Score:** 6.5/10

## Executive Summary

Analysis of 43 TypeScript/React files (43,182 lines) revealed:
- 3 CRITICAL files exceeding 2,500 lines
- 157 type safety violations (`any` usage)
- 322 console.log statements
- 4 major code duplications
- Significant refactoring opportunities

## Critical Issues

### 1. Mega Files (3,527-2,917 lines)

**app/admin/commandes/page.tsx** - 3,527 lines
- Contains 4+ large components in single file
- QuickActionButtons, OrderDetailsModal, AddDishModal, MainOrdersList
- Action: Split into `app/admin/commandes/components/` directory

**hooks/useSupabaseData.ts** - 2,917 lines  
- God hook with 34 hook exports, 31 array operations
- Action: Split into domain hooks (useOrders, usePlats, useClients, useExtras)

**app/admin/clients/[id]/orders/page.tsx** - 3,210 lines
- Complex nested order management logic
- Action: Extract composable components and hooks

### 2. Type Safety Crisis (157 `any` types)

Hot spots:
- `hooks/useSupabaseData.ts`: 45 occurrences
- `app/admin/commandes/page.tsx`: 22 occurrences
- `lib/announcements.ts`: 16 occurrences

Example problematic pattern:
```typescript
// Current (unsafe)
if ((detail as any).extras_db) {
  prixUnitaire = (detail as any).extras_db.prix || 0;
}

// Should be:
type DetailWithExtras = DetailCommande & { 
  extras_db?: Extra; 
  plats_db?: Plat 
}
```

### 3. Code Duplication (4x price calculation)

Price calculation logic repeated 4 times:
- `useSupabaseData.ts:688-703`
- `useSupabaseData.ts:821-843`  
- `useSupabaseData.ts:993-1004`
- `useSupabaseData.ts:1907-1918`

Should extract to: `lib/pricing.ts: calculateOrderPrice(details)`

## Anti-Patterns Detected

### Props Drilling (12 occurrences)
```typescript
// BAD: Passing toast through 4+ levels
function OrderDetailsModal({ toast }: { toast: any }) {
  return <SubComponent toast={toast} />
}

// GOOD: Use hook directly
function OrderDetailsModal() {
  const { toast } = useToast()
}
```

### Console Statements (322 occurrences)
```typescript
// BAD: console.log everywhere
console.log("Error:", error)

// GOOD: Use logger utility
import { logger } from '@/lib/logger'
logger.error("Error:", error)
```

## Quality Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| File Size (max) | 3,527 | <500 | FAIL |
| `any` types | 157 | 0 | FAIL |
| Console logs | 322 | 0 | FAIL |
| Files >1000 lines | 7 | 0 | FAIL |
| TypeScript strict | YES | YES | PASS |
| React Query usage | YES | YES | PASS |

## Recommendations Priority

### CRITICAL (12-16 hours each)

1. **Split useSupabaseData.ts**
   - Create: `hooks/useOrders.ts` (~600 lines)
   - Create: `hooks/usePlats.ts` (~400 lines)
   - Create: `hooks/useClients.ts` (~300 lines)
   - Create: `hooks/useExtras.ts` (~200 lines)

2. **Refactor app/admin/commandes/page.tsx**
   - Extract: `components/admin/commandes/QuickActions.tsx`
   - Extract: `components/admin/commandes/OrderDetails.tsx`
   - Extract: `components/admin/commandes/AddDish.tsx`
   - Extract: `components/admin/commandes/OrderList.tsx`

### HIGH (8-12 hours)

3. **Type Safety Cleanup**
   - Replace 157 `any` with proper types
   - Create union types for Supabase joins
   - Add type guards for runtime validation

4. **Extract Utilities**
   - `lib/pricing.ts`: Price calculation logic
   - `lib/order-utils.ts`: Order enrichment
   - `hooks/useInvalidateQueries.ts`: Cache invalidation

### MEDIUM (4-6 hours)

5. **Replace console.log**
   - Use existing `lib/logger.ts` (322 replacements)
   - Add production error tracking (Sentry)

6. **Create Reusable Components**
   - `StatusBadge.tsx`: Order status visualization
   - `DateFilter.tsx`: Date range filtering
   - `PriceDisplay.tsx`: Formatted price display

## Technical Debt

### TODO Comments (13 found)
- `hooks/useSupabaseNotifications.ts`: 7 TODOs (notifications table missing)
- `hooks/useSupabaseData.ts`: 5 TODOs (plats_rupture_dates table missing)
- `lib/supabase.ts`: RLS enrichment implementation
- `components/ErrorBoundary.tsx`: Sentry integration

### Missing Database Tables
- `notifications` table (7 dependent features)
- `plats_rupture_dates` table (5 dependent features)
- RPC function: `is_plat_available_on_date`

## Quality Gates Status

PASSING:
- TypeScript strict mode enabled
- React Query for state management
- Supabase type generation
- Component-based architecture
- Custom hooks pattern

FAILING:
- File size limits (>500 lines)
- Type safety (157 `any` types)
- Code duplication (4x price calc)
- Props drilling pattern
- Console.log in production

## Estimated Refactoring Effort

| Priority | Tasks | Effort |
|----------|-------|--------|
| CRITICAL | 2 major refactors | 24-32 hours |
| HIGH | 2 improvements | 16-24 hours |
| MEDIUM | 2 cleanups | 8-12 hours |
| **TOTAL** | **6 tasks** | **48-68 hours** |

## Next Steps

1. Start with `useSupabaseData.ts` split (highest impact)
2. Refactor `app/admin/commandes/page.tsx` (user-facing)
3. Type safety cleanup (parallel with above)
4. Extract utilities and remove duplication
5. Replace console.log with logger
6. Create missing database tables

---

Report generated by code-quality-specialist agent

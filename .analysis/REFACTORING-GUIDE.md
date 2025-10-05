# Refactoring Implementation Guide

**Project:** APPChanthana  
**Based on:** Code Quality Analysis 2025-10-05  
**Estimated Total Effort:** 48-68 hours

## Phase 1: Critical Refactoring (24-32 hours)

### Task 1.1: Split useSupabaseData.ts (12-16 hours)

**Current State:** 2,917 lines, 34 hooks

**Target Structure:**
- hooks/useOrders.ts (~600 lines)
- hooks/usePlats.ts (~400 lines)
- hooks/useClients.ts (~300 lines)
- hooks/useExtras.ts (~200 lines)
- hooks/useEvenements.ts (~200 lines)

### Task 1.2: Refactor app/admin/commandes/page.tsx (16-20 hours)

**Current State:** 3,527 lines

**Target Structure:**
- page.tsx (~200 lines)
- components/QuickActions.tsx
- components/OrderList.tsx
- components/OrderDetails/
- components/AddDish/

## Phase 2: High Priority (16-24 hours)

### Task 2.1: Eliminate any Types (8-12 hours)

Fix 157 occurrences across:
- hooks/useSupabaseData.ts: 45 occurrences
- app/admin/commandes/page.tsx: 22 occurrences
- lib/announcements.ts: 16 occurrences

### Task 2.2: Extract Utilities (4-8 hours)

Create:
- lib/pricing.ts (price calculation)
- lib/order-utils.ts (order enrichment)
- hooks/useInvalidateQueries.ts (cache management)

## Phase 3: Medium Priority (8-12 hours)

### Task 3.1: Replace console.log (4-6 hours)

Replace 322 console statements with lib/logger.ts

### Task 3.2: Create Reusable Components (4-6 hours)

Create:
- components/shared/StatusBadge.tsx
- components/shared/DateFilter.tsx
- components/shared/PriceDisplay.tsx

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Largest file | 3,527 | <500 |
| any types | 157 | 0 |
| Console logs | 322 | 0 |
| Quality score | 6.5/10 | 8.5/10 |

---

Start implementing with Phase 1 critical tasks.

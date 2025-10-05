# Code Quality Metrics Dashboard

## Overview

```
Project: APPChanthana
Files Analyzed: 43
Total Lines: 43,182
Quality Score: 6.5/10
```

## File Size Distribution

```
CRITICAL (>2500 lines): 3 files
┣━ app/admin/commandes/page.tsx         ████████████████████ 3,527 lines
┣━ app/admin/clients/[id]/orders/page   ███████████████████  3,210 lines  
┗━ hooks/useSupabaseData.ts             █████████████████    2,917 lines

HIGH (1000-2500 lines): 4 files
┣━ app/modifier-commande/[id]/page.tsx  ████████  1,430 lines
┣━ app/admin/plats/page.tsx             ████████  1,378 lines
┣━ app/commander/page.tsx               ████████  1,324 lines
┗━ lib/database.types.ts                ████████  1,240 lines (auto-generated)

MEDIUM (500-1000 lines): 6 files
┣━ app/profil/page.tsx                  ████  1,114 lines
┣━ app/admin/clients/[id]/events        ████    732 lines
┣━ app/admin/statistiques/page.tsx      ████    721 lines
┗━ ... (3 more)
```

## Type Safety Issues

```
Total 'any' Types: 157

Hot Spots:
hooks/useSupabaseData.ts        ████████████████  45 (28.7%)
app/admin/commandes/page.tsx    █████████         22 (14.0%)
lib/announcements.ts            ████████          16 (10.2%)
app/historique/page.tsx         ██                 4 (2.5%)
Others                          ████████████████  70 (44.6%)
```

## Code Duplication

```
Pattern: Price Calculation (4 occurrences)
┣━ useSupabaseData.ts:688   ████
┣━ useSupabaseData.ts:821   ████
┣━ useSupabaseData.ts:993   ████
┗━ useSupabaseData.ts:1907  ████

Pattern: QueryClient Invalidation (41 occurrences)
████████████████████████████████████████  All files

Pattern: Order Enrichment (3 occurrences)
┣━ useSupabaseData.ts:680   ████
┣━ useSupabaseData.ts:855   ████
┗━ useSupabaseData.ts:1029  ████
```

## Anti-Patterns

```
Props Drilling (12 occurrences)
┣━ toast prop: 8 occurrences  ████████
┗━ router prop: 4 occurrences ████

Large Components (7 files >1000 lines)
████████████████████████████  Needs refactoring

Console Statements (322 total)
████████████████████████████████████████  Production code
```

## Technical Debt

```
TODO Comments: 13
┣━ useSupabaseNotifications.ts  ███████  7 TODOs
┣━ useSupabaseData.ts          █████    5 TODOs
┗━ Others                      █        1 TODO

Missing Database Tables:
┣━ notifications          [BLOCKED: 7 features]
┗━ plats_rupture_dates    [BLOCKED: 5 features]
```

## Refactoring Effort

```
CRITICAL Priority (24-32 hours)
┣━ Split useSupabaseData.ts      ████████████████  16h
┗━ Refactor commandes/page.tsx   ████████████████  16h

HIGH Priority (16-24 hours)
┣━ Eliminate any types           ████████████      12h
┗━ Extract utilities             ████████          8h

MEDIUM Priority (8-12 hours)
┣━ Replace console.log           ██████            6h
┗━ Reusable components           ████              4h

TOTAL: 48-68 hours ████████████████████████████████████████
```

## Quality Gates

```
PASSING ✅
┣━ TypeScript strict mode
┣━ React Query usage
┣━ Supabase type generation
┗━ Custom hooks pattern

FAILING ❌
┣━ File size limits (>500 lines)
┣━ Type safety (157 any types)
┣━ Code duplication (4x)
┣━ Props drilling (12 occurrences)
┗━ Console.log (322 statements)
```

## Top 10 Files by Line Count

| Rank | File | Lines | Status |
|------|------|-------|--------|
| 1 | app/admin/commandes/page.tsx | 3,527 | 🔴 CRITICAL |
| 2 | app/admin/clients/[id]/orders/page.tsx | 3,210 | 🔴 CRITICAL |
| 3 | hooks/useSupabaseData.ts | 2,917 | 🔴 CRITICAL |
| 4 | app/modifier-commande/[id]/page.tsx | 1,430 | 🟡 HIGH |
| 5 | app/admin/plats/page.tsx | 1,378 | 🟡 HIGH |
| 6 | app/commander/page.tsx | 1,324 | 🟡 HIGH |
| 7 | lib/database.types.ts | 1,240 | 🟢 OK (auto) |
| 8 | app/profil/page.tsx | 1,114 | 🟡 MEDIUM |
| 9 | app/admin/clients/[id]/events/page.tsx | 732 | 🟡 MEDIUM |
| 10 | app/admin/statistiques/page.tsx | 721 | 🟡 MEDIUM |

## Complexity Breakdown

```
Cyclomatic Complexity:
┣━ High (>20): 8 functions
┣━ Medium (10-20): 24 functions
┗━ Low (<10): Majority

Hook Density:
┣━ useSupabaseData.ts: 34 hooks exported
┣━ useEffect calls: 21 total
┗━ React Query hooks: Extensive usage

Array Operations:
┣━ map/filter/reduce: 31 in useSupabaseData.ts
┗━ Nested operations: 12 (3+ levels)
```

## Code Health Score

```
Overall: 6.5/10

Architecture:     7/10  ███████
Type Safety:      4/10  ████
Code Organization: 5/10  █████
Duplication:      5/10  █████
Best Practices:   7/10  ███████
Performance:      8/10  ████████
```

## Recommendations Priority Matrix

```
        │ HIGH IMPACT
        │
URGENT  │ ┏━━━━━━━━━━━━━━━━━┓
        │ ┃ Split mega files┃ ← START HERE
        │ ┗━━━━━━━━━━━━━━━━━┛
        │ ┌─────────────────┐
        │ │ Type safety fix │
        │ └─────────────────┘
────────┼──────────────────────────
NOT     │ ┌─────────────────┐
URGENT  │ │ Extract utils   │
        │ └─────────────────┘
        │        LOW IMPACT
```

---

**Generated:** 2025-10-05  
**Agent:** code-quality-specialist  
**Next Review:** After critical refactoring

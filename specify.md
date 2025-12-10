# Feature Specification: Iterate 1 - Technical Debt (Phase 8)

**Version**: 1.0 (Phase 8 Focus)
**Status**: Planned
**Context**: Cleanup iteration to improve code quality and maintainability without affecting features.

## 1. Objective

Execute **Phase 8: Dette Technique** from `road.md`. Focus on removing development artifacts (`console.log`), resolving high-priority technical TODOs, and fixing strict type errors (`any`).

## 2. Scope & Requirements

### A. Remove Console Logs

**Rule**: Remove all `console.log` entries listed in `road.md` that were used for debugging.
**Targets**:

- `hooks/useSupabaseData.ts`: ~17 instances (lines 204-354).
- `app/admin/commandes/page.tsx`: Line 2938 (`🔍 DEBUG - Extras...`).
- `hooks/usePWAInstalled.ts`: Lines 57, 68, 72.
- `hooks/useRealtimeNotifications.ts`: Lines 25, 51, 84.

### B. Fix TypeScript `any`

**Rule**: Replace `any` with specific types to ensure type safety.
**Targets**:

- `app/actions/commandes.ts`: `updateData: any` -> `Partial<CommandeUpdateInput>`.
- `app/actions/evenements.ts`: `updateData: any` -> `Partial<EvenementUpdateInput>`.
- `app/actions/notifications.ts`: `quietHoursData: any` -> `QuietHoursConfig`.
- `app/admin/commandes/page.tsx`: `router: any, toast: any` -> `AppRouterInstance`, `ReturnType<typeof useToast>`.

### C. Clean Unused Imports

**Rule**: Identify and remove unused imports across the project.
**Method**: Use `eslint` or manual review during file editing.

## 3. Non-Goals

- No new features.
- No UI changes.
- No database schema changes.

## 4. Verification

- **Build**: `npm run build` must pass without TypeScript errors.
- **Lint**: `npm run lint` should show reduced warnings.
- **Runtime**: Application must start (`npm run dev`) and key flows (Admin Orders) must work without regressions.

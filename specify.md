# Feature Specification: Iterate 2 - UX Improvements (Phase 2)

**Version**: 1.1 (UX Focus)
**Status**: In Progress
**Context**: Implementation of missing UX features from `road.md` Sections D, E, and F.

## 1. Objective

Enhance user experience on History, Order Tracking, and Edit Order pages by adding navigation, documentation, and safety features.

## 2. Scope & Requirements

### A. Page Historique Complet (`/historique/complet`)

**Source**: `road.md` Section D - "Tâches Restantes"

- **Pagination**: Implement pagination using `nuqs` to synchronize state with the URL.
- **Filters**: Implement filtering capabilities (Search command, Statut, Date) similar to the main history page.
- **Goal**: Provide a dedicated view for the full order history, separating it from the "Active/Recent" view on the main page.

### B. Page Suivi de Commande (`/suivi-commande/[id]`)

**Source**: `road.md` Section E - "Tâches Restantes"

- **Invoice Download**: Integrate the `BoutonTelechargerFacture` component.
- **Condition**: Button must only appear when the order status is "Récupérée" (Completed).
- **Placement**: Prominently displayed, likely near the Total or Order Summary.

### C. Page Modifier Commande (`/modifier-commande/[id]`)

**Source**: `road.md` Section F - "Tâches Restantes"

- **Save Confirmation Dialog**: Implement an `AlertDialog` triggered by the "Sauvegarder" button.
- **Content**:
  - Display a summary of changes (Old Total vs. New Total).
  - Show the calculated price difference (positive or negative).
  - Display the change in item count.
  - **Warning**: Explicitly state that saving will reset the order status to "En attente de confirmation".
- **Action**: Clicking "Confirmer" executes the save logic (`sauvegarderModifications`).

## 3. Verification

- **Historique**: Verify `?page=x` and filter parameters update the URL and list.
- **Suivi**: Verify PDF downloads correctly for completed orders.
- **Modifier**: Verify dialog appears on save, shows correct math, and prevents accidental submission.

# Phase 1 - Backend Architecture Analysis
**Agent**: Backend Architect
**Date**: 2025-10-05
**Duration**: 15 minutes
**Project**: APPChanthana (Thai Restaurant Management System)

---

## Executive Summary

L'application APPChanthana utilise une architecture backend moderne basée sur **Supabase 2.58.0** avec authentification hybride **Firebase + Supabase**. Le système comprend **9 tables**, **32 hooks CRUD** type-safe avec TanStack Query, et un système de validation Zod robuste.

**⚠️ ÉTAT ACTUEL**: RLS temporairement désactivé pour développement - **doit être réactivé avant production**.

---

## 1. Supabase Configuration

### Architecture Singleton Pattern
```typescript
// lib/supabase.ts - Instance unique globale
let globalSupabaseInstance: SupabaseClient<Database> | null = null;

const createSingletonSupabaseClient = () => {
  if (globalSupabaseInstance) return globalSupabaseInstance;
  // ... création instance unique
}
```

### Configuration Technique
- **Version**: Supabase 2.58.0
- **Flow Type**: PKCE (Proof Key for Code Exchange)
- **Session Management**:
  - `autoRefreshToken: true` (Firebase primary, Supabase needs valid tokens)
  - `persistSession: false` (Firebase handles session)
  - `detectSessionInUrl: false`

### Realtime Configuration
```javascript
realtime: {
  params: {
    eventsPerSecond: 10,
    heartbeatIntervalMs: 30000
  }
}
```

### Custom Headers
```
x-application-name: chanthanathaicook
x-client-version: 2025.1.28
x-architecture: firebase-supabase-hybrid
```

---

## 2. Database Schema (9 Tables)

### Tables Principales

#### 1. **client_db** - Profils Utilisateurs
- **PK**: `idclient`
- **Unique**: `firebase_uid` (sync Firebase Auth)
- **Champs clés**: email, nom, prenom, role, numero_de_telephone
- **Role-based**: admin/client detection via email patterns

#### 2. **plats_db** - Catalogue Plats
- **PK**: `idplats`
- **Champs clés**: plat, prix, photo_du_plat, est_epuise
- **Disponibilité**: lundi_dispo → dimanche_dispo (7 champs)

#### 3. **extras_db** - Suppléments
- **PK**: `idextra`
- **Champs clés**: nom_extra, prix, description, photo_url, actif

#### 4. **commande_db** - Commandes
- **PK**: `idcommande`
- **FK Implicite**: client_r_id → client_db.idclient
- **Statuts**:
  - Commande: En attente de confirmation | Confirmée | En préparation | Prête à récupérer | Récupérée | Annulée
  - Paiement: En attente sur place | Payé sur place | Payé en ligne | Non payé | Payée

#### 5. **details_commande_db** - Lignes Commandes
- **PK**: `iddetails`
- **FK Explicite**:
  - `plat_r → plats_db.idplats`
  - `commande_r → commande_db.idcommande`
- **Type**: 'plat' | 'extra' (gestion hybride plats/extras)

#### 6. **evenements_db** - Événements Traiteur
- **PK**: `idevenements`
- **FK Implicite**: contact_client_r_id → client_db.idclient
- **Champs clés**: nom_evenement, date_evenement, nombre_de_personnes, plats_preselectionnes (array)

### Tables Secondaires
- **activites_flux**: Logs d'activité système
- **listes_courses**: Listes de courses admin
- **articles_liste_courses**: Articles des listes

### Relations Clés
```
client_db.firebase_uid ← Firebase Auth UID (unique identifier)
         ↓
commande_db.client_r_id (many-to-one)
         ↓
details_commande_db.commande_r (many-to-one)
         ↓
plats_db.idplats (many-to-one)
```

---

## 3. CRUD Hooks (32 Total)

### Répartition par Catégorie

#### Client Hooks (5)
- `useClient(firebase_uid)` - Récupérer profil par UID
- `useCreateClient()` - Création profil auto-sync
- `useUpdateClient()` - Mise à jour profil
- `useClients()` - Liste tous clients
- `useSearchClients(searchTerm)` - Recherche clients

#### Plats Hooks (8)
- `usePlats()` - Catalogue complet
- `useCreatePlat()` / `useUpdatePlat()` / `useDeletePlat()`
- `usePlatRuptures(platId)` - Historique ruptures
- `useCreatePlatRupture()` / `useDeletePlatRupture()`
- `useCheckPlatAvailability()` - Vérification dispo

#### Extras Hooks (4)
- `useExtras()` - Catalogue extras
- `useCreateExtra()` / `useUpdateExtra()` / `useDeleteExtra()`

#### Commande Hooks (11)
- `useCommandeById(id, firebase_uid)` - Commande spécifique
- `useCommandesByClient(firebase_uid)` - Commandes client
- `useCommandes(firebase_uid)` - Liste complète
- `useCommandesStats()` - Statistiques
- `useCommandesRealtimeV1()` - **Realtime tracking**
- `useUpdateCommandeV1/V2/Legacy` - ⚠️ Multiples versions à consolider
- `useUpdateCommande()` - Version canonique
- `useCreateCommande()` / `useDeleteCommande()`

#### Détails Hooks (2)
- `useCreateDetailsCommande()` - Ajout ligne commande
- `useDeleteDetailsCommande()` - Suppression ligne

#### Événement Hooks (3)
- `useCreateEvenement()` - Création événement
- `useEvenementById(id)` - Événement spécifique
- `useEvenementsByClient(firebase_uid)` - Événements client

### Cache Strategy

```typescript
// lib/supabase.ts - CACHE_TIMES
export const CACHE_TIMES = {
  PLATS: 1000 * 60 * 15,      // 15 minutes (catalogue stable)
  CLIENTS: 1000 * 60 * 5,     // 5 minutes (profils peu modifiés)
  COMMANDES: 1000 * 60 * 2,   // 2 minutes (données temps réel)
  EVENEMENTS: 1000 * 60 * 10  // 10 minutes (événements)
}
```

### Validation Functions

**Zod Schemas**:
- `clientProfileSchema` - Validation profil complet
- `clientAutoCreateSchema` - Auto-création profil
- `evenementSchema` - Validation événement
- `commandeSchema` - Validation commande
- `detailCommandeSchema` - Validation ligne commande

**Enum Validators**:
- `validateStatutCommande()` - Vérification statuts commande
- `validateStatutPaiement()` - Vérification statuts paiement
- `validateTypeLivraison()` - Vérification types livraison

---

## 4. RLS Status (Row Level Security)

### État Actuel: ⚠️ DÉSACTIVÉ

**Raison**: Développement et tests - RLS bloquait création profils

### Policies Définies (prêtes à activer)

#### Client Policies
```sql
-- Lecture/modification données propres
client_select_own: firebase_uid = auth.jwt() ->> 'sub'
client_update_own: firebase_uid = auth.jwt() ->> 'sub'
client_insert_authenticated: WITH CHECK firebase_uid = auth.jwt() ->> 'sub'
```

#### Commande Policies
```sql
-- Clients voient uniquement leurs commandes
commandes_select_own: client_id IN (SELECT id FROM client_db WHERE firebase_uid = auth.jwt() ->> 'sub')
```

#### Admin Policies
```sql
-- Admin full access
admin_all_access: auth.jwt() ->> 'email' = 'admin@chanthana.com' OR 'contact@chanthana.com'
```

### Tables avec Policies
✅ client_db, plats_db, commande_db, details_commande_db, evenements_db, extras_db, activites_flux, notification_*

### Tables sans Policies
⚠️ listes_courses, articles_liste_courses

### Scripts RLS Disponibles

1. **rls-policies-sql.sql** (296 lignes)
   - Policies complètes pour toutes tables
   - Admin detection via email
   - Rollback commands inclus

2. **fix-rls-details.sql**
   - Policies spécifiques details_commande_db

3. **fix-security-warnings.sql**
   - Hardening sécurité RLS

---

## 5. Realtime Configuration

### Tables avec Realtime
- ✅ **commande_db** - Suivi commandes temps réel
- ✅ **details_commande_db** - Lignes commandes temps réel

### Configuration Database
```sql
-- activate-realtime-supabase.sql
ALTER TABLE commande_db REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;
```

### Subscriptions Actives

#### useCommandesRealtimeV1
```typescript
// hooks/useSupabaseData.ts:1172
export const useCommandesRealtimeV1 = () => {
  useEffect(() => {
    const channel = supabase
      .channel('commandes-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'commande_db'
      }, payload => {
        // Invalidate React Query cache on change
        queryClient.invalidateQueries(['commandes']);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);
};
```

### Scripts Activation Realtime
- `activate-realtime-supabase.sql` - Activation REPLICA IDENTITY
- `activate-realtime.sql` - Legacy script
- `activate-realtime-node.js` - Test connection Node.js
- `test-realtime-connection.js` - Diagnostics connection

---

## 6. Error Handling Architecture

### SupabaseError Class
```typescript
// lib/supabase.ts:95
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}
```

### Error Detection Strategy

#### Empty Error Detection
```typescript
// hooks/useSupabaseData.ts:176
const isEmptyError = !error || (typeof error === 'object' && Object.keys(error).length === 0);

if (isEmptyError) {
  throw new Error('Erreur Supabase inconnue: objet erreur vide. Vérifiez RLS et permissions.');
}
```

#### Specific Error Codes
- **42501** - RLS Policy Violation
- **PGRST116** - Row not found
- **23505** - Unique constraint violation

### Context-Enriched Errors
```typescript
// lib/supabase.ts:103
export const handleSupabaseError = (error: unknown, context: string): never => {
  console.error(`Erreur Supabase dans ${context}:`, error);

  if (error?.code === '42501') {
    throw new SupabaseError(`Permissions insuffisantes pour ${context}`, '42501', error);
  }
  // ... autres codes
}
```

---

## 7. Recommendations

### 🔴 HIGH PRIORITY

#### 1. Re-enable RLS Policies
**Problème**: RLS désactivé = base de données non sécurisée
**Action**:
```bash
# 1. Exécuter dans Supabase SQL Editor
C:\Users\USER\Desktop\APPChanthana\scripts\rls-policies-sql.sql

# 2. Tester avec utilisateur client
# 3. Tester avec utilisateur admin
# 4. Vérifier RLS activé:
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename IN ('client_db', 'commande_db', ...)
AND rowsecurity = true;
```

#### 2. Fix enrichSupabaseContext
**Problème**: Fonction désactivée (lib/supabase.ts:69) - spread operator ne préserve pas méthodes
**Action**:
- Option A: Implémenter enrichissement correct avec Proxy pattern
- Option B: Vérifier si singleton pattern suffit pour RLS (Firebase UID dans JWT)

### 🟡 MEDIUM PRIORITY

#### 3. Improve Empty Error Handling
**Problème**: Objets erreur vides `{}` masquent vraies erreurs (causé par RLS)
**Action**: Activer RLS avec policies correctes → erreurs significatives

#### 4. Review Cache Strategy
**État actuel**: 15min (plats), 5min (clients), 2min (commandes)
**Action**:
- Monitorer cache hit rates
- Ajuster selon patterns utilisateurs réels
- Considérer cache plus court pour plats (ruptures fréquentes?)

### 🟢 LOW PRIORITY

#### 5. Expand Realtime Coverage
**Suggestion**: Ajouter realtime à `evenements_db`, `plats_db` (ruptures)
**Bénéfice**: UX améliorée pour événements et disponibilité plats

#### 6. Consolidate Update Hooks
**Problème**: 3 versions update hooks (V1, V2, Legacy)
**Action**: Migrer vers `useUpdateCommande()` canonique, déprécier anciens

#### 7. Add Foreign Key Constraints
**Problème**: Relations implicites (client_r_id → idclient)
**Action**:
```sql
ALTER TABLE commande_db
ADD CONSTRAINT fk_client
FOREIGN KEY (client_r_id) REFERENCES client_db(idclient);
```

---

## 8. Technical Debt

1. ⚠️ **RLS désactivé** - must re-enable avant production
2. ⚠️ **enrichSupabaseContext disabled** - spread operator issue
3. **Multiple update hook versions** - consolidation nécessaire
4. **Implicit foreign keys** - ajouter contraintes explicites
5. **Empty error objects** - RLS-related, résolu par activation RLS

---

## 9. Strengths (Architecture Moderne)

✅ **Supabase 2.58.0** avec singleton pattern (évite multiple GoTrueClient)
✅ **32 hooks CRUD** complets avec TanStack Query integration
✅ **Type-safe operations** (auto-generated + custom UI types)
✅ **Robust error handling** (context-specific + empty error detection)
✅ **Strategic caching** (CACHE_TIMES optimisés par type données)
✅ **Realtime subscriptions** pour tracking commandes
✅ **Zod validation** pour intégrité données
✅ **Hybrid Firebase + Supabase** bien documenté

---

## 10. Next Steps (Action Plan)

### Immediate (Cette Semaine)
1. ✅ Exécuter `rls-policies-sql.sql` dans Supabase SQL Editor
2. ✅ Tester toutes opérations CRUD avec RLS activé
3. ✅ Vérifier admin access fonctionne (admin@chanthana.com)
4. ✅ Documenter erreurs RLS éventuelles

### Short-term (2 Semaines)
5. Fixer `enrichSupabaseContext` ou valider singleton suffisant
6. Ajouter FK constraints explicites au schéma
7. Consolider update hooks → version canonique unique
8. Tester realtime sur toutes tables concernées

### Medium-term (1 Mois)
9. Étendre realtime à `evenements_db` si besoin UX
10. Monitorer cache performance → ajuster `CACHE_TIMES`
11. Ajouter RLS policies pour `listes_courses` tables
12. Performance audit complet avec Lighthouse

---

## File Locations

**Configuration**:
- `C:\Users\USER\Desktop\APPChanthana\lib\supabase.ts`
- `C:\Users\USER\Desktop\APPChanthana\types\supabase.ts`

**CRUD Hooks**:
- `C:\Users\USER\Desktop\APPChanthana\hooks\useSupabaseData.ts` (2917 lignes)

**RLS Scripts**:
- `C:\Users\USER\Desktop\APPChanthana\scripts\rls-policies-sql.sql`
- `C:\Users\USER\Desktop\APPChanthana\scripts\fix-rls-details.sql`
- `C:\Users\USER\Desktop\APPChanthana\scripts\fix-security-warnings.sql`

**Realtime Scripts**:
- `C:\Users\USER\Desktop\APPChanthana\scripts\activate-realtime-supabase.sql`
- `C:\Users\USER\Desktop\APPChanthana\scripts\test-realtime-connection.js`

---

**Rapport généré par**: Backend Architect Agent
**Durée analyse**: 15 minutes
**Fichiers analysés**: 7
**Lignes de code analysées**: ~3500

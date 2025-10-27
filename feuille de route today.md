# 🎯 Feuille de Route - Session du 26 Octobre 2025

## Objectif Final
**Supprimer TOUS les mélanges Supabase SDK / Firebase Auth**

**Architecture Finale:**
- ✅ Prisma ORM pour TOUTES les données (garde la même base PostgreSQL Supabase)
- ✅ Better Auth pour authentification (supprime Firebase complètement)
- ✅ Supabase Realtime pour live updates (notifications, changements statuts)
- ✅ Supabase Storage pour images (plats, clients)

---

## 🎯 Phase 1: Fixer Erreurs TypeScript Server Actions

### 1.1 Corriger app/actions/commandes.ts
- [ ] Convertir types `bigint` → `number` (idclient, client_r_id)
- [ ] Convertir types `Decimal` → `number` (prix, budget)
- [ ] Convertir `Date` → ISO string (dates commande)
- [ ] Corriger propriété `client_r_id` dans CreateCommandeData
- [ ] **STOP → npm run build → Vérifier 0 erreur commandes.ts**

### 1.2 Corriger app/actions/evenements.ts
- [ ] Convertir types `bigint` → `number` (idevenements, contact_client_r_id)
- [ ] Convertir types `Decimal` → `number` (budget_client, prix_total_devis)
- [ ] Convertir `Date` → ISO string (date_evenement, created_at, updated_at)
- [ ] Ajouter propriétés manquantes CreateEvenementData (type_d_evenement, demandes_speciales_evenement)
- [ ] **STOP → npm run build → Vérifier 0 erreur evenements.ts**

### 1.3 Corriger app/actions/extras.ts
- [ ] Vérifier conversions `Decimal` → `number` (prix)
- [ ] Vérifier conversions `Date` → ISO string (created_at, updated_at)
- [ ] **STOP → npm run build → Vérifier 0 erreur extras.ts**

### 1.4 Validation Build Complet
- [ ] Exécuter `npm run build`
- [ ] Confirmer **0 erreurs TypeScript** dans TOUS les fichiers
- [ ] **STOP → USER VALIDE → Passer Phase 2**

---

## 🔄 Phase 2: Migration Base de Données Complète

### 2.1 Migrer Page Commander
- [ ] Ouvrir `app/commander/page.tsx`
- [ ] Remplacer import `useSupabaseData` → `usePrismaData`
- [ ] Remplacer `usePlats()` → `usePrismaPlats()`
- [ ] **STOP → Test: http://localhost:3000/commander affiche les plats**

### 2.2 Migrer Page Panier
- [ ] Ouvrir `app/panier/page.tsx`
- [ ] Remplacer `useCreateCommande` → `usePrismaCreateCommande`
- [ ] **STOP → Test: Créer commande depuis panier fonctionne**

### 2.3 Migrer Page Historique
- [ ] Ouvrir `app/historique/page.tsx`
- [ ] Remplacer `useCommandes` → `usePrismaCommandes`
- [ ] **STOP → Test: Historique affiche les commandes**

### 2.4 Migrer Page Suivi
- [ ] Ouvrir `app/suivi/page.tsx`
- [ ] Remplacer tous les hooks Supabase → Prisma
- [ ] **STOP → Test: Page suivi fonctionne**

### 2.5 Migrer Page Profil
- [ ] Ouvrir `app/profil/page.tsx`
- [ ] Remplacer `useClient` → `usePrismaClient`
- [ ] Remplacer update hooks → Prisma
- [ ] **STOP → Test: Modifier profil fonctionne**

### 2.6 Migrer Page Événements
- [ ] Ouvrir `app/evenements/page.tsx`
- [ ] Remplacer hooks événements → Prisma
- [ ] **STOP → Test: Créer événement fonctionne**

### 2.7 Migrer Pages Admin (6 pages)
- [ ] `app/admin/page.tsx` → Remplacer tous hooks
- [ ] `app/admin/clients/page.tsx` → usePrismaClients
- [ ] `app/admin/commandes/page.tsx` → usePrismaCommandes
- [ ] `app/admin/plats/page.tsx` → usePrismaPlats
- [ ] `app/admin/statistiques/page.tsx` → Adapter requêtes Prisma
- [ ] `app/admin/courses/page.tsx` → Vérifier hooks
- [ ] **STOP → Test: Chaque page admin fonctionne**

### 2.8 Migrer Pages Modification (4 pages)
- [ ] `app/modifier-commande/[id]/page.tsx` → Prisma
- [ ] `app/modifier-evenement/[id]/page.tsx` → Prisma
- [ ] `app/suivi-commande/[id]/page.tsx` → Prisma
- [ ] `app/suivi-evenement/[id]/page.tsx` → Prisma
- [ ] **STOP → Test: Modifier commande/événement fonctionne**

### 2.9 Migrer Pages Admin Clients (3 pages)
- [ ] `app/admin/clients/[id]/orders/page.tsx` → Prisma
- [ ] `app/admin/clients/[id]/events/page.tsx` → Prisma
- [ ] `app/admin/clients/[id]/stats/page.tsx` → Prisma
- [ ] **STOP → Test: Vue détail client fonctionne**

### 2.10 Supprimer Ancien Code Supabase
- [ ] Supprimer `hooks/useSupabaseData.ts` (2,917 lignes)
- [ ] Supprimer `services/supabaseService.ts`
- [ ] Rechercher imports `useSupabaseData` → Confirmer 0 résultat
- [ ] **STOP → npm run build → Confirmer 0 erreur**

---

## 🔐 Phase 3: Migration Auth Complète (Better Auth)

### 3.1 Supprimer Firebase Auth
- [ ] Supprimer `lib/firebaseConfig.ts`
- [ ] Supprimer `contexts/AuthContext.tsx` (si existe encore)
- [ ] Ouvrir `package.json` → Supprimer dépendance `firebase`
- [ ] Exécuter `npm install` (nettoyer node_modules)
- [ ] **STOP → Rechercher "from firebase" → Confirmer 0 résultat**

### 3.2 Migrer Composants Auth vers Better Auth
- [ ] Rechercher tous imports `AuthContext` ou `getAuth`
- [ ] Remplacer par `useSession` de Better Auth
- [ ] Vérifier `components/PrivateRoute.tsx` utilise Better Auth
- [ ] Vérifier `components/AdminRoute.tsx` utilise Better Auth
- [ ] **STOP → Test: Login/Logout fonctionne**

### 3.3 Migrer Middleware
- [ ] Ouvrir `middleware.ts`
- [ ] Confirmer utilisation `auth.api.getSession()` (pas de cookie direct)
- [ ] Vérifier protection routes: /commander, /panier, /admin/*
- [ ] **STOP → Test: Protection routes fonctionne**

### 3.4 Validation Auth Complète
- [ ] Test: Signup nouveau compte
- [ ] Test: Login avec compte existant
- [ ] Test: Accès page protégée sans login → Redirigé
- [ ] Test: Admin accède /admin → Fonctionne
- [ ] Test: Client accède /admin → Bloqué
- [ ] Rechercher "firebase" dans codebase → **0 résultat**
- [ ] **STOP → USER VALIDE → Passer Phase 4**

---

## ✅ Phase 4: Tests Complets + Documentation

### 4.1 Tests Parcours Client
- [ ] Signup → Login → Commander → Panier → Valider → Historique
- [ ] Voir détail commande
- [ ] Modifier commande
- [ ] Créer événement
- [ ] Modifier profil
- [ ] Upload photo profil (Supabase Storage)

### 4.2 Tests Parcours Admin
- [ ] Login admin
- [ ] Voir liste clients
- [ ] Voir liste commandes
- [ ] Changer statut commande → **Vérifier real-time notification client**
- [ ] Ajouter/Modifier plat (+ upload photo)
- [ ] Voir statistiques

### 4.3 Tests Real-time
- [ ] Admin change statut commande → Client voit notification instantanée
- [ ] Nouvelle commande → Admin voit alerte real-time
- [ ] Vérifier `hooks/useSupabaseNotifications.ts` fonctionne avec Prisma

### 4.4 Nettoyage Final
- [ ] Supprimer fichiers/imports inutilisés
- [ ] Mettre à jour `CLAUDE.md` avec nouvelle architecture
- [ ] Mettre à jour `Brouillon - Plan d'Amélioration.md`
- [ ] Commit final: "feat: Complete migration to Prisma ORM + Better Auth"

---

## 📋 Résultat Final

**Architecture Finale:**
```
┌─────────────────────────────────────────┐
│         Next.js 15 Application          │
├─────────────────────────────────────────┤
│  Auth: Better Auth (lib/auth.ts)        │
│  Data: Prisma ORM (Server Actions)      │
│  Real-time: Supabase Channels           │
│  Storage: Supabase Storage              │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│    PostgreSQL (Supabase hosted)         │
│  - Tables: client_db, commande_db...    │
│  - Auth: user, account, session (BA)    │
└─────────────────────────────────────────┘
```

**Dépendances Supprimées:**
- ❌ Firebase Auth (complètement)
- ❌ Supabase SDK pour données (remplacé par Prisma)
- ✅ Supabase SDK gardé UNIQUEMENT pour: Realtime + Storage

**Bénéfices:**
- ✅ Types TypeScript automatiques partout
- ✅ Erreurs détectées AVANT production
- ✅ Requêtes DB plus rapides (Prisma optimisé)
- ✅ Migrations DB gérées automatiquement
- ✅ Code plus simple et maintenable

---

**Règle d'Or:** Chaque ✅ = STOP → Test utilisateur → Validation → Continue

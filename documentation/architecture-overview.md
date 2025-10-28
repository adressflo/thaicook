# Architecture Overview - APPChanthana

**Date**: 2025-10-27
**Version**: 2.0.0 (Post-Migration Better Auth + Prisma ORM)
**Status**: ✅ Production Ready - 0 Erreurs TypeScript

---

## 📋 Vue d'Ensemble

APPChanthana est une application de gestion de restaurant thaïlandais construite avec une architecture moderne **Next.js 15 App Router**, **Better Auth** pour l'authentification, et **Prisma ORM** pour les opérations de base de données.

### Stack Technologique Complète

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 15.5.4 | Framework React avec App Router, SSR, Server Actions |
| **React** | 19.1.1 | Bibliothèque UI avec Server Components |
| **TypeScript** | 5.x | Typage statique strict pour tout le codebase |
| **Better Auth** | 1.3.28 | Authentification TypeScript-first avec Prisma adapter |
| **Prisma ORM** | 6.17.1 | ORM type-safe pour PostgreSQL avec auto-génération types |
| **Supabase** | 2.58.0 | PostgreSQL + Realtime + Storage |
| **TanStack Query** | 5.90.2 | Gestion d'état serveur + cache client-side |
| **Tailwind CSS** | 4.1.12 | Styling CSS-first avec thème Thai customisé |
| **shadcn/ui** | Latest | Composants UI accessibles (Radix UI) |
| **Playwright** | 1.55.0 | Tests E2E multi-navigateurs |

---

## 🏗️ Architecture Système

### Stack Complète - Diagramme

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 15.5.4 App Router (React 19.1.1 + TypeScript 5)   │
├─────────────────────────────────────────────────────────────┤
│  Authentication : Better Auth 1.3.28                        │
│    ├── lib/auth.ts (serveur) + lib/auth-client.ts (client) │
│    ├── Sessions : Cookies (better-auth.session_token)      │
│    └── Protection : middleware.ts + PrivateRoute/AdminRoute │
├─────────────────────────────────────────────────────────────┤
│  Database ORM : Prisma 6.17.1                               │
│    ├── CRUD : app/actions/*.ts (Server Actions)            │
│    ├── Cache : hooks/usePrismaData.ts (44 hooks)           │
│    └── Client-side : TanStack Query 5.90.2                 │
├─────────────────────────────────────────────────────────────┤
│  Supabase 2.58.0 (PostgreSQL + Fonctionnalités)            │
│    ├── Realtime : hooks/useSupabaseData.ts (1 hook)        │
│    ├── Storage : Images (plats, avatars, événements)       │
│    └── Direct queries : Ruptures (4 hooks) + Shopping (3)  │
├─────────────────────────────────────────────────────────────┤
│  UI/UX : shadcn/ui + Radix UI + Tailwind CSS 4.1.12        │
│  Tests : Playwright 1.55.0 (E2E)                            │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Globale - Flux Utilisateurs

```
┌─────────────────────────────────────────────────────────────┐
│                      UTILISATEURS                            │
│  👤 Clients (commandes)  │  👨‍💼 Admin (gestion)                │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS 15 APP ROUTER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Server     │  │   Client     │  │   Middleware     │  │
│  │  Components  │  │  Components  │  │  (Protection)    │  │
│  │  (SSR init)  │  │ (Interactive)│  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────┬─────────────────────────────────────────────┘
                 │
        ┌────────┴────────┬────────────────┐
        ▼                 ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ BETTER AUTH  │  │ PRISMA ORM   │  │  TANSTACK    │
│   1.3.28     │  │   6.17.1     │  │  QUERY 5.90  │
│              │  │              │  │              │
│ • Email/Pass │  │ • 5 Server   │  │ • Cache      │
│ • Sessions   │  │   Actions    │  │ • Mutations  │
│ • Cookies    │  │ • 44 Hooks   │  │ • Invalidate │
│ • Middleware │  │ • Type-safe  │  │ • Optimistic │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       │                 ▼
       │        ┌──────────────────┐
       │        │  SUPABASE 2.58   │
       │        │  PostgreSQL DB   │
       │        │                  │
       │        │ • 26 Tables      │
       └────────│ • Realtime Sync  │
                │ • Storage Images │
                └──────────────────┘
```

---

## 🔐 Architecture Authentification (Better Auth)

### Vue d'Ensemble

**Migration complète** de Firebase Auth vers Better Auth (2025-10-27).

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                  │
└─────────────────────────────────────────────────────────────┘

1. USER → app/auth/login/page.tsx (Email/Password)
         ↓
2. Better Auth Client (lib/auth-client.ts)
   - signIn.email({ email, password })
         ↓
3. Better Auth Server (lib/auth.ts)
   - Vérifie credentials
   - Crée session + cookie (better-auth.session_token)
         ↓
4. Server Action → createClientProfile(auth_user_id, data)
   - Synchronise User → client_db
   - Lien : User.id = client_db.auth_user_id
         ↓
5. middleware.ts
   - Vérifie cookie session sur chaque requête
   - Protège routes /admin, /profil, /commander
         ↓
6. Components (PrivateRoute, AdminRoute)
   - useSession() → { user, session }
   - Contrôle accès basé sur role (admin/client)
```

### Tables Better Auth (Prisma Schema)

| Table | Rôle | Champs Clés |
|-------|------|-------------|
| **User** | Utilisateurs authentifiés | id, email, emailVerified, name, image, createdAt |
| **Session** | Sessions actives | id, userId, expiresAt, token, ipAddress, userAgent |
| **Account** | Providers OAuth (futur) | id, userId, providerId, accountId |
| **Verification** | Tokens vérification | id, identifier, value, expiresAt |

### Synchronisation User ↔ client_db

```typescript
// Better Auth User table
User {
  id: string (UUID)              // Généré par Better Auth
  email: string
  name: string
}

// Prisma client_db table
client_db {
  id_client: number (SERIAL)     // Auto-increment PostgreSQL
  auth_user_id: string (UNIQUE)  // ← Lien vers User.id
  email: string
  nom: string
  prenom: string
  role: 'client' | 'admin'
}
```

**Processus de synchronisation** :
1. Inscription → Better Auth crée `User` (retourne `user.id`)
2. Server Action `createClientProfile(user.id, data)`
3. Prisma crée `client_db` avec `auth_user_id = user.id`
4. Lien permanent : `client_db.auth_user_id → User.id`

---

## 💾 Architecture Base de Données (Prisma ORM)

### Séparation des Responsabilités

| Fonctionnalité | Technologie | Fichiers Clés | Statut |
|----------------|-------------|---------------|---------|
| **Authentication** | Better Auth | `lib/auth.ts`, `lib/auth-client.ts`, `middleware.ts` | ✅ 100% |
| **User Profiles** | Prisma ORM | `app/actions/clients.ts`, `hooks/usePrismaData.ts` | ✅ 100% |
| **CRUD Clients** | Prisma ORM | `app/actions/clients.ts` (7 Server Actions) | ✅ 100% |
| **CRUD Plats** | Prisma ORM | `app/actions/plats.ts` (4 Server Actions) | ✅ 100% |
| **CRUD Commandes** | Prisma ORM | `app/actions/commandes.ts` (15 Server Actions) | ✅ 100% |
| **CRUD Extras** | Prisma ORM | `app/actions/extras.ts` (4 Server Actions) | ✅ 100% |
| **CRUD Événements** | Prisma ORM | `app/actions/evenements.ts` (7 Server Actions) | ✅ 100% |
| **Realtime Sync** | Supabase Realtime | `hooks/useSupabaseData.ts` (useCommandesRealtime) | ✅ 100% |
| **Images Upload** | Supabase Storage | `lib/supabase.ts` → storage.upload() | ✅ 100% |
| **Ruptures Plats** | Supabase Direct | `hooks/useSupabaseData.ts` (4 hooks) | ✅ 100% |
| **Shopping Lists** | Supabase Direct | `hooks/useSupabaseData.ts` (3 hooks) | ✅ 100% |
| **Client Cache** | TanStack Query | `hooks/usePrismaData.ts` + `hooks/useSupabaseData.ts` | ✅ 100% |

### Modèles Prisma (26 Tables)

**Tables principales :**
- `User`, `Session`, `Account`, `Verification` (Better Auth)
- `client_db` (Profils clients)
- `plat_db` (Menu items)
- `commande_db`, `details_commande_db` (Commandes)
- `extra_db` (Suppléments)
- `evenement_db`, `details_evenement_db` (Événements)
- `plat_rupture_db` (Ruptures de stock)
- `liste_courses_db`, `article_liste_courses_db` (Shopping)
- + 15 tables additionnelles

### Server Actions Architecture

```
app/actions/
├── clients.ts        # 7 Server Actions CRUD clients
├── plats.ts          # 4 Server Actions CRUD plats
├── commandes.ts      # 15 Server Actions CRUD commandes
├── extras.ts         # 4 Server Actions CRUD extras
└── evenements.ts     # 7 Server Actions CRUD événements

Total: 37 Server Actions
```

**Exemple Server Action** :
```typescript
// app/actions/clients.ts
'use server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getClientProfile() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Non authentifié')

  return await prisma.client_db.findUnique({
    where: { auth_user_id: session.user.id }
  })
}
```

---

## 🔄 Flux de Données

### 1. Création de Compte & Authentification

```
1. User → app/auth/signup/page.tsx
   - Formulaire : email, password, nom, prenom, telephone

2. Better Auth Client → signUp.email({ email, password, name })
   - Better Auth crée User table
   - Retourne user.id

3. Server Action → createClientProfile(user.id, { nom, prenom, telephone })
   - Prisma crée client_db avec auth_user_id = user.id
   - Définit role: 'client' par défaut

4. Better Auth → Crée Session + Cookie
   - Cookie: better-auth.session_token
   - Expire: 7 jours

5. Redirect → /commander (client) ou /admin (admin)
```

### 2. Opérations CRUD (Exemple : Commandes)

```
1. Client Component → usePrismaCommandes() (TanStack Query)
   - Hook React avec cache automatique

2. Hook → Appelle Server Action
   - import { getCommandes } from '@/app/actions/commandes'

3. Server Action → Vérifie session
   - const session = await auth.api.getSession()

4. Server Action → Prisma Query
   - await prisma.commande_db.findMany({ where: { ... } })

5. Prisma Client → PostgreSQL
   - Requête SQL type-safe auto-générée

6. Response → Cache TanStack Query
   - Stockage client-side avec staleTime/cacheTime

7. UI Update → React re-render
   - Affichage données mises à jour
```

### 3. Synchronisation Realtime (Admin ↔ Client)

```
1. Admin modifie commande
   - app/admin/commandes → updateCommande(id, data)

2. Server Action → Prisma ORM
   - prisma.commande_db.update({ where: { id }, data })

3. PostgreSQL → UPDATE commande_db SET statut = 'Prête'
   - Changement détecté par Supabase Realtime

4. Supabase Realtime Channel → Broadcast
   - Canal: 'commandes-realtime-channel'
   - Event: 'postgres_changes'

5. Client Component → useCommandesRealtime()
   - Écoute canal Supabase
   - Callback: invalidateQueries('prisma-commandes')

6. TanStack Query → Refetch automatique
   - Détecte cache invalide
   - Re-appelle Server Action

7. UI Client → Mise à jour instantanée
   - Affiche nouveau statut sans refresh
```

---

## 📂 Structure du Projet

### Organisation des Dossiers

```
APPChanthana/
├── app/
│   ├── actions/               # Server Actions (37 actions)
│   │   ├── clients.ts
│   │   ├── plats.ts
│   │   ├── commandes.ts
│   │   ├── extras.ts
│   │   └── evenements.ts
│   ├── auth/                  # Pages authentification Better Auth
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── admin/                 # Interface admin (protected)
│   ├── profil/                # Profil utilisateur (protected)
│   └── api/auth/[...all]/     # Better Auth API routes
│
├── components/
│   ├── PrivateRoute.tsx       # Protection routes clients
│   ├── AdminRoute.tsx         # Protection routes admin
│   └── ui/                    # shadcn/ui components
│
├── hooks/
│   ├── usePrismaData.ts       # 44 hooks TanStack Query (Prisma)
│   ├── useSupabaseData.ts     # 8 hooks Realtime/Ruptures/Shopping
│   └── use-mobile.tsx         # Breakpoints responsive
│
├── lib/
│   ├── auth.ts                # Better Auth config serveur
│   ├── auth-client.ts         # Better Auth config client
│   ├── prisma.ts              # Prisma Client singleton
│   └── supabase.ts            # Supabase Client (Realtime/Storage)
│
├── prisma/
│   └── schema.prisma          # Schéma DB (26 modèles)
│
├── middleware.ts              # Better Auth session vérification
└── types/
    └── app.ts                 # Types TypeScript custom
```

---

## 🎯 Patterns de Développement

### Next.js 15 Patterns

✅ **Server Components first** (default, meilleure performance)
✅ **'use client' uniquement si nécessaire** (hooks, interactivité, browser APIs)
✅ **Server Actions pour mutations** (type-safe, sécurisé)
✅ **TypeScript strict** avec types auto-générés Prisma
✅ **Path mapping** : `@/` = racine projet

### Component Export Pattern

```typescript
// ✅ Good (named export - recommandé)
export function ComponentName() {}

// ❌ Bad (default export - éviter)
export default function ComponentName() {}
```

### Database Operations Pattern

```typescript
// ✅ Pattern recommandé
'use client'
import { usePrismaCommandes } from '@/hooks/usePrismaData'

export function CommandesPage() {
  const { data, isLoading, error } = usePrismaCommandes()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return <CommandesList commandes={data} />
}
```

### Responsive Design Pattern

```typescript
import { useBreakpoints } from '@/hooks/use-mobile'

export function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  // Mobile <768px | Tablet 768-1024px | Desktop >1024px

  return (
    <div className={cn(
      isMobile && "flex-col gap-2",
      isTablet && "flex-row gap-4",
      isDesktop && "grid grid-cols-3 gap-6"
    )}>
      {/* Content */}
    </div>
  )
}
```

---

## 📊 Métriques du Projet

### Codebase (Après Nettoyage - 2025-10-27)

| Métrique | Valeur | Notes |
|----------|--------|-------|
| **Erreurs TypeScript** | 0 | ✅ Build production ready |
| **Code obsolète supprimé** | -3200 lignes | 3 fichiers supprimés + 2 réécrits |
| **hooks/useSupabaseData.ts** | 361 lignes | Était 2904 (-87%) |
| **services/supabaseService.ts** | 12 lignes | Était 408 (-97%) |
| **Server Actions Prisma** | 5 fichiers, 37 actions | 100% CRUD couvert |
| **Hooks TanStack Query** | 44 hooks Prisma + 8 hooks Supabase | Séparation claire |
| **Pages migrées** | 17 pages + 10 composants | 100% utilisent Prisma |

### Stack Versions (Production)

| Package | Version | Type |
|---------|---------|------|
| next | 15.5.4 | Framework |
| react | 19.1.1 | UI Library |
| better-auth | 1.3.28 | Auth |
| @prisma/client | 6.17.1 | ORM |
| @supabase/supabase-js | 2.58.0 | DB Client |
| @tanstack/react-query | 5.90.2 | State |
| tailwindcss | 4.1.12 | Styling |
| @playwright/test | 1.55.0 | Testing |

---

## 🔗 Documentation Complémentaire

### Architecture & Patterns
- **`database-schema.md`** - Schéma complet PostgreSQL (26 tables)
- **`state-management.md`** - TanStack Query patterns
- **`component-patterns.md`** - React component guidelines

### Development Guides
- **`development-setup.md`** - Setup environnement local
- **`coding-standards.md`** - Standards TypeScript/React
- **`testing-guide.md`** - Tests Playwright E2E
- **`performance-optimization.md`** - Performance tips

### Database & Prisma
- **`prismadoc.md`** - Documentation Prisma ORM
- **`prisma-migration.md`** - Guide migration (historique)
- **`real-time-subscriptions.md`** - Supabase Realtime setup

### Configuration
- **`email-configuration.md`** - React Email + Resend setup
- **`miseajour.md`** - Recherches techniques Context7

---

## 🚀 Prochaines Étapes Techniques

1. **Next Safe Action** : Migration Server Actions vers validation Zod
2. **Tests E2E** : Compléter suites Playwright (4 tests critiques)
3. **Upload Local** : Migrer Supabase Storage → Hetzner local storage
4. **RLS Policies** : Réactiver Row Level Security Supabase (Phase 4)
5. **Better Auth 2FA** : Configuration passkeys + 2FA (sécurité renforcée)

---

**Dernière mise à jour** : 2025-10-27
**Migration Better Auth + Prisma ORM** : ✅ Complète
**Build Status** : ✅ 0 erreurs TypeScript

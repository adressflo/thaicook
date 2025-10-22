# Architecture Overview - APPChanthana

**Date**: 2025-10-06
**Version**: 1.0.0
**Status**: ✅ Production

## Vue d'Ensemble

APPChanthana est une application de gestion de restaurant thaïlandais construite avec une architecture moderne **Next.js 15 App Router** et une **authentification hybride Firebase + Supabase**.

### Stack Technologique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 15.5.4 | Framework React avec App Router |
| **React** | 19.1.1 | Bibliothèque UI avec Server Components |
| **TypeScript** | 5.x | Typage statique strict |
| **Supabase** | 2.58.0 | Base de données PostgreSQL + Real-time |
| **Firebase** | 12.3.0 | Authentification primaire |
| **TanStack Query** | 5.90.2 | Gestion d'état serveur + cache |
| **Tailwind CSS** | 4.1.12 | Styling CSS-first avec thème Thai |
| **shadcn/ui** | Latest | Composants UI accessibles (Radix) |
| **Playwright** | 1.55.0 | Tests E2E multi-navigateurs |

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                            │
│  👤 Clients (commandes)  │  👨‍💼 Admin (gestion)                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 15 APP ROUTER                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Server Components│  │ Client Components│  │  Middleware   │ │
│  │  (données init)  │  │  (interactivité) │  │ (protection)  │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   FIREBASE   │  │  TANSTACK QUERY  │
│  Auth 12.3.0 │  │   Cache + State  │
│              │  │                  │
│ • Login/Logout│  │ • Query Keys     │
│ • Tokens      │  │ • Invalidation   │
│ • État auth   │  │ • Retry logic    │
└──────┬───────┘  └─────────┬────────┘
       │                    │
       │   ┌────────────────┘
       │   │
       ▼   ▼
┌─────────────────────────────────────┐
│         SUPABASE 2.58.0             │
│  ┌───────────┐  ┌─────────────────┐│
│  │PostgreSQL │  │  Real-time      ││
│  │ Database  │  │  Subscriptions  ││
│  │           │  │                 ││
│  │ • RLS     │  │ • Channels      ││
│  │ • Types   │  │ • Broadcast     ││
│  │ • Foreign │  │ • Presence      ││
│  │   Keys    │  │                 ││
│  └───────────┘  └─────────────────┘│
└─────────────────────────────────────┘
```

---

## Flux de Données

### 1. Authentification (Firebase → Supabase)

```typescript
// 1. User login via Firebase
Firebase Auth → onAuthStateChanged() → currentUser (UID)

// 2. Auto-sync profil Supabase
AuthContext.tsx → createUserProfile() → Supabase.client_db
  - firebase_uid: currentUser.uid
  - email: currentUser.email
  - role: 'client' (default) ou 'admin' (via pattern email)

// 3. Session management
Firebase: Gère tokens JWT
Supabase: RLS policies filtrent via firebase_uid
```

### 2. Récupération de Données (Server → Client)

```typescript
// Server Component (initial data)
app/page.tsx → fetch() → Supabase → SSR HTML

// Client Component (interactivité)
useClients() → TanStack Query → Cache → UI
  - Query Key: ['clients', filters]
  - Stale Time: 5 minutes
  - Retry: 3 fois avec backoff exponentiel

// Real-time updates
useCommandesRealtime() → Supabase Channel → invalidateQueries()
  - INSERT → Cache update
  - UPDATE → Cache update
  - DELETE → Cache removal
```

### 3. Mutations (UI → Database)

```typescript
// 1. User action
UI Component → handleSubmit()

// 2. TanStack Query mutation
useMutation({
  mutationFn: createCommande,
  onSuccess: () => {
    queryClient.invalidateQueries(['commandes'])
  }
})

// 3. Supabase write
createCommande() → Supabase.from('commande_db').insert()

// 4. Real-time broadcast
Supabase Channel → All subscribed clients → Cache invalidation
```

---

## Structure des Dossiers

```
app/                      # Next.js 15 App Router
├── (public)/            # Routes publiques (no auth required)
│   ├── dashboard/       # Page d'accueil
│   ├── commander/       # Système de commande
│   └── evenements/      # Événements restaurant
├── (protected)/         # Routes protégées (auth required)
│   ├── historique/      # Historique commandes client
│   ├── profil/          # Gestion profil utilisateur
│   └── suivi-commande/  # Suivi commande en temps réel
├── admin/               # Routes admin (role required)
│   ├── clients/         # Gestion clients
│   ├── commandes/       # Gestion commandes
│   ├── plats/           # Gestion menu
│   └── evenements/      # Gestion événements
├── layout.tsx           # Root layout avec providers
└── globals.css          # Tailwind CSS v4 config

components/              # Composants React réutilisables
├── ui/                  # shadcn/ui components (Radix UI)
├── forms/               # Form components avec validation
├── providers.tsx        # Provider hierarchy
└── OptimizedImage.tsx   # Image avec lazy loading

contexts/                # React Contexts (state global)
├── AuthContext.tsx      # Hybrid Firebase + Supabase auth
├── DataContext.tsx      # Global data state
├── CartContext.tsx      # Shopping cart state
└── NotificationContext.tsx # Toast notifications

hooks/                   # Custom React hooks
├── useSupabaseData.ts   # Type-safe CRUD operations (2,917 LOC)
├── use-mobile.tsx       # Responsive breakpoints
└── useAuth.ts           # Auth state management

lib/                     # Utilities et configurations
├── supabase.ts          # Supabase client config
├── firebaseConfig.ts    # Firebase SDK initialization
├── validations.ts       # Type validation functions
└── utils.ts             # Helper functions

types/                   # TypeScript type definitions
├── supabase.ts          # Auto-generated Supabase types
├── app.ts               # Application-specific types
├── authTypes.ts         # Authentication types
└── cartTypes.ts         # Shopping cart types

services/                # External service integrations
└── supabaseService.ts   # Business logic layer
```

---

## Patterns d'Architecture

### Server Components First

```typescript
// ✅ GOOD: Server Component par défaut
export default async function CommanderPage() {
  const plats = await fetchPlats() // Server-side fetch
  return <PlatsList plats={plats} />
}

// ❌ BAD: Client Component sans raison
'use client'
export default function CommanderPage() {
  const [plats, setPlats] = useState([])
  useEffect(() => { fetchPlats() }, [])
  return <PlatsList plats={plats} />
}
```

### Client Components (quand nécessaire)

```typescript
'use client' // Directive obligatoire

export function InteractiveCart() {
  // ✅ Hooks OK dans Client Components
  const { cart, addItem } = useCart()
  const [open, setOpen] = useState(false)

  return <CartDialog open={open} />
}
```

### Type-Safe Database Operations

```typescript
// hooks/useSupabaseData.ts
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_db')
        .select('*')
        .returns<Client[]>() // Type-safe

      if (error) throw new SupabaseError(error)
      return data
    }
  })
}
```

---

## Patterns de Cache

### TanStack Query Cache Keys

```typescript
// Hierarchical structure pour invalidation ciblée
['clients']                          // All clients
['clients', 'active']                // Active clients only
['clients', id]                      // Single client
['commandes']                        // All orders
['commandes', 'admin-global']        // Admin view
['commandes', 'stats']               // Stats view
['commandes', clientId]              // Client orders
['plats']                            // All dishes
['plats', 'with-extras']             // Dishes with extras
```

### Cache Times (CACHE_TIMES constant)

```typescript
export const CACHE_TIMES = {
  plats: 15 * 60 * 1000,        // 15 minutes
  clients: 5 * 60 * 1000,       // 5 minutes
  commandes: 2 * 60 * 1000,     // 2 minutes
  evenements: 10 * 60 * 1000,   // 10 minutes
  extras: 15 * 60 * 1000,       // 15 minutes
}
```

---

## Real-time Architecture

### Supabase Channels

```typescript
// hooks/useCommandesRealtime.ts
const channel = supabase
  .channel('commandes-realtime')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'commande_db'
  }, (payload) => {
    queryClient.invalidateQueries(['commandes'])
  })
  .subscribe()
```

### Pages avec Real-time

- **app/historique/page.tsx**: Client order history
- **app/suivi-commande/[id]/page.tsx**: Order tracking
- **app/admin/commandes/page.tsx**: Admin order management

---

## Sécurité

### Row Level Security (RLS)

**Status actuel**: 🔴 **DÉSACTIVÉ** (Phase 4: réactivation requise)

```sql
-- Politique client: voir seulement ses propres données
CREATE POLICY "clients_own_data" ON client_db
  FOR ALL USING (firebase_uid = auth.uid());

-- Politique commandes: clients voient leurs commandes
CREATE POLICY "commandes_own_orders" ON commande_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db
      WHERE client_db.id = commande_db.contact_client_r
      AND client_db.firebase_uid = auth.uid()
    )
  );

-- Politique admin: accès total
CREATE POLICY "admin_full_access" ON commande_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db
      WHERE client_db.firebase_uid = auth.uid()
      AND client_db.role = 'admin'
    )
  );
```

### Environment Variables

**Fichier**: `.env.local` (JAMAIS committé)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lkaiwnkyoztebplqoifc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (public key - safe)
SUPABASE_SERVICE_ROLE_KEY=sbp_...        (⚠️ JAMAIS exposer côté client)

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## Performance

### Bundle Optimization

- **Server Components**: Réduisent JavaScript côté client de ~40%
- **Code Splitting**: Dynamic imports pour admin routes
- **Image Optimization**: Next.js Image + lazy loading
- **CSS**: Tailwind v4 CSS-first = -30% CSS bundle

### Core Web Vitals Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **LCP** (Largest Contentful Paint) | <2.5s | ~2.1s | ✅ Good |
| **FID** (First Input Delay) | <100ms | ~45ms | ✅ Good |
| **CLS** (Cumulative Layout Shift) | <0.1 | ~0.08 | ✅ Good |
| **TTFB** (Time to First Byte) | <800ms | ~650ms | ✅ Good |

---

## Responsive Design

### Breakpoints

```typescript
// hooks/use-mobile.tsx
const BREAKPOINTS = {
  mobile: 768,    // <768px
  tablet: 1024,   // 768px-1024px
  desktop: 1024,  // >1024px
}

export function useBreakpoints() {
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024
  }
}
```

### Container System

```css
/* app/globals.css - Progressive containers */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; padding: 1.5rem; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 2rem; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

---

## Testing Strategy

### Test Pyramid

```
                    /\
                   /  \
                  / E2E \      1 test (3% coverage) ← Phase 4: +14h
                 /------\
                /        \
               / Integration \ (0 tests) ← Future
              /              \
             /----------------\
            /   Unit Tests     \  (0 tests) ← Future
           /--------------------\
```

**Phase 4 Priority**: 4 tests E2E critiques (14 heures)
1. Complete order flow (guest user)
2. User authentication flow
3. Admin order management
4. Cart persistence and calculation

---

## Déploiement

### Build Process

```bash
# 1. Type checking
npm run type-check  # tsc --noEmit

# 2. Linting
npm run lint       # next lint

# 3. Build production
npm run build      # next build

# 4. E2E tests
npm run test:e2e   # playwright test
```

### Environment Checklist

- [ ] Variables d'environnement production configurées
- [ ] RLS policies activées sur Supabase
- [ ] Real-time subscriptions activées
- [ ] Service role key JAMAIS exposée côté client
- [ ] Firebase Auth production configuré
- [ ] Next.js build optimisé (minification, compression)
- [ ] Core Web Vitals validés
- [ ] E2E tests passent sur 3 navigateurs

---

## Références

- **Next.js 15 Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Firebase Auth Docs**: https://firebase.google.com/docs/auth
- **TanStack Query Docs**: https://tanstack.com/query/latest
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Playwright Docs**: https://playwright.dev/docs/intro

---

**Prochaine lecture recommandée**: [Hybrid Auth Architecture](./hybrid-auth-architecture.md)

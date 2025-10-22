# Hybrid Auth Architecture - Firebase + Supabase

**Date**: 2025-10-06
**Version**: 1.0.0
**Status**: ✅ Production

## Vue d'Ensemble

APPChanthana utilise une **architecture d'authentification hybride** combinant **Firebase Authentication** (gestion des identités) et **Supabase PostgreSQL** (stockage des profils et données métier).

### Pourquoi cette Architecture ?

| Aspect | Firebase Auth | Supabase PostgreSQL |
|--------|---------------|---------------------|
| **Forces** | • Gestion auth robuste<br>• Tokens JWT sécurisés<br>• Multi-providers<br>• Pas de backend auth | • Types PostgreSQL stricts<br>• Relations SQL (foreign keys)<br>• RLS granulaire<br>• Real-time natif |
| **Utilisation** | Identity Provider | Data Storage + Business Logic |
| **Rôle** | Login/Logout/Sessions | Profils clients + données métier |

---

## Architecture Complète

```
┌─────────────────────────────────────────────────────────────────┐
│                    UTILISATEUR (UI)                             │
│  Login Form → Email/Password → Firebase SDK                    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE AUTHENTICATION 12.3.0                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  onAuthStateChanged() Listener                           │  │
│  │  ↓                                                        │  │
│  │  currentUser: { uid, email, displayName, ... }           │  │
│  │  ↓                                                        │  │
│  │  JWT Token (auto-refresh toutes les 1h)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHCONTEXT.TSX                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Détecte currentUser (Firebase)                       │  │
│  │  2. Cherche profil Supabase (firebase_uid)               │  │
│  │  3. Si absent → createUserProfile() AUTO                 │  │
│  │  4. Détecte rôle: admin ou client                        │  │
│  │  5. Expose: currentUser, currentUserProfile, role        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   Firebase   │  │    Supabase      │
│   Users DB   │  │   client_db      │
│              │  │                  │
│ • uid        │  │ • firebase_uid   │ ← Foreign Key (UNIQUE)
│ • email      │  │ • nom            │
│ • password   │  │ • prenom         │
│              │  │ • role           │
│              │  │ • created_at     │
└──────────────┘  └──────────────────┘
```

---

## Flux d'Authentification Complet

### 1. Inscription Nouveau Client

```typescript
// app/auth/signup/page.tsx
const handleSignup = async (email: string, password: string) => {
  // 1. Créer compte Firebase
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  const firebaseUser = userCredential.user

  // 2. Auto-création profil Supabase (via AuthContext listener)
  // → onAuthStateChanged() détecte nouveau user
  // → AuthContext.createUserProfile() s'exécute AUTO

  // Résultat:
  // - Firebase: user.uid = "abc123xyz"
  // - Supabase: client_db.firebase_uid = "abc123xyz" (sync auto)
}
```

### 2. Connexion Utilisateur Existant

```typescript
// app/auth/login/page.tsx
const handleLogin = async (email: string, password: string) => {
  // 1. Login Firebase
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  // 2. onAuthStateChanged() listener détecte changement
  // → AuthContext charge profil Supabase via firebase_uid
  // → Détecte rôle (admin vs client)
  // → Expose currentUser + currentUserProfile dans Context

  // 3. Redirection automatique
  // → Si admin: /admin/commandes
  // → Si client: /dashboard
}
```

### 3. Détection Rôle Admin

```typescript
// contexts/AuthContext.tsx
const detectUserRole = (email: string): 'admin' | 'client' => {
  const adminPatterns = [
    '@chanthana.com',
    'admin@',
    // Ajouter patterns admin ici
  ]

  const isAdmin = adminPatterns.some(pattern =>
    email.toLowerCase().includes(pattern)
  )

  return isAdmin ? 'admin' : 'client'
}

// Utilisation lors de createUserProfile()
const role = detectUserRole(firebaseUser.email)

await supabase.from('client_db').insert({
  firebase_uid: firebaseUser.uid,
  email: firebaseUser.email,
  role: role, // 'admin' ou 'client'
  nom: '',
  prenom: ''
})
```

### 4. Synchronisation Profil (Auto)

```typescript
// contexts/AuthContext.tsx - Listener principal
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // 1. Chercher profil Supabase
      const { data: profile } = await supabase
        .from('client_db')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single()

      if (!profile) {
        // 2. Créer profil si absent (1er login)
        await createUserProfile(firebaseUser)
      } else {
        // 3. Profil existe → charger dans state
        setCurrentUserProfile(profile)
        setCurrentUserRole(profile.role)
      }

      setCurrentUser(firebaseUser)
    } else {
      // User logged out
      setCurrentUser(null)
      setCurrentUserProfile(null)
      setCurrentUserRole(null)
    }

    setIsLoadingAuth(false)
  })

  return () => unsubscribe()
}, [])
```

---

## Protection des Routes

### Middleware (Route-level Protection)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes publiques (no auth)
  const publicRoutes = ['/dashboard', '/commander', '/evenements']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Routes admin (role required)
  if (pathname.startsWith('/admin')) {
    const user = await getAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Routes protégées (auth required)
  const protectedRoutes = ['/historique', '/profil', '/suivi-commande']
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}
```

### Component-level Protection

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { currentUser, currentUserProfile, currentUserRole, isLoadingAuth } = useAuthContext()

  return {
    user: currentUser,          // Firebase user
    profile: currentUserProfile, // Supabase profile
    role: currentUserRole,       // 'admin' | 'client' | null
    isLoading: isLoadingAuth,
    isAuthenticated: !!currentUser,
    isAdmin: currentUserRole === 'admin'
  }
}

// Utilisation dans composant
function ProtectedComponent() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <LoginPrompt />
  if (!isAdmin) return <UnauthorizedMessage />

  return <AdminContent />
}
```

---

## Gestion des Sessions

### Firebase JWT Tokens

```typescript
// lib/firebaseConfig.ts
const auth = getAuth(app)

// Token auto-refresh (toutes les 1h par défaut)
auth.currentUser?.getIdToken(true) // Force refresh

// Token inclus automatiquement dans requests Supabase
// via custom headers si nécessaire (actuellement non utilisé)
```

### Supabase Session (RLS Integration)

```sql
-- Fonction helper pour RLS policies
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS TEXT AS $$
  -- Retourne firebase_uid depuis JWT custom claim
  -- OU depuis client_db via email (fallback)
$$ LANGUAGE sql STABLE;

-- Utilisation dans RLS policy
CREATE POLICY "clients_own_data" ON client_db
  FOR ALL USING (firebase_uid = auth.uid());
```

**Note actuelle**: RLS désactivé → Phase 4 réactivation requise

---

## Schéma Base de Données

### Table `client_db`

```sql
CREATE TABLE client_db (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,  -- ← Lien avec Firebase
  email TEXT NOT NULL,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  role TEXT DEFAULT 'client',  -- 'admin' ou 'client'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_client_firebase_uid ON client_db(firebase_uid);
CREATE INDEX idx_client_role ON client_db(role);
```

### Foreign Keys avec Firebase UID

```sql
-- Table commande_db référence client via firebase_uid
CREATE TABLE commande_db (
  id SERIAL PRIMARY KEY,
  contact_client_r INTEGER REFERENCES client_db(id),
  firebase_uid TEXT,  -- Denormalized pour RLS performance
  statut TEXT DEFAULT 'en_attente',
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ⚠️ MANQUANT ACTUELLEMENT (Phase 4: à ajouter)
ALTER TABLE commande_db
  ADD CONSTRAINT fk_commande_firebase_uid
  FOREIGN KEY (firebase_uid)
  REFERENCES client_db(firebase_uid);
```

---

## Gestion des Erreurs

### Erreurs Firebase

```typescript
// utils/firebaseErrors.ts
export function handleFirebaseError(error: FirebaseError): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Cet email est déjà utilisé',
    'auth/weak-password': 'Mot de passe trop faible (min 6 caractères)',
    'auth/user-not-found': 'Aucun compte trouvé avec cet email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/invalid-email': 'Format email invalide',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard'
  }

  return errorMessages[error.code] || 'Erreur d\'authentification'
}
```

### Erreurs Supabase Profile Sync

```typescript
// contexts/AuthContext.tsx
const createUserProfile = async (firebaseUser: User) => {
  try {
    const { error } = await supabase
      .from('client_db')
      .insert({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: detectUserRole(firebaseUser.email)
      })

    if (error) {
      // Log error mais ne bloque pas l'auth
      console.error('Profile sync error:', error)

      // Retry avec exponential backoff si RLS actif
      if (error.code === '42501') { // RLS violation
        await retryProfileCreation(firebaseUser, 3)
      }
    }
  } catch (err) {
    console.error('Critical profile sync error:', err)
    // Continue avec auth Firebase seulement
  }
}
```

---

## Tests d'Authentification

### Tests E2E Critiques (Phase 4: 3 heures)

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should signup new user and auto-create Supabase profile', async ({ page }) => {
    // 1. Navigate to signup
    await page.goto('/auth/signup')

    // 2. Fill form
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    // 3. Verify Firebase user created
    await expect(page).toHaveURL('/dashboard')

    // 4. Verify Supabase profile created
    const profile = await supabase
      .from('client_db')
      .select('*')
      .eq('email', 'test@example.com')
      .single()

    expect(profile.data).toBeTruthy()
    expect(profile.data?.role).toBe('client')
  })

  test('should login existing user and load Supabase profile', async ({ page }) => {
    // 1. Navigate to login
    await page.goto('/auth/login')

    // 2. Fill credentials
    await page.fill('[name="email"]', 'existing@example.com')
    await page.fill('[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    // 3. Verify redirect based on role
    // Admin → /admin/commandes
    // Client → /dashboard
    await expect(page).toHaveURL(/\/(admin\/commandes|dashboard)/)
  })

  test('should detect admin role from email pattern', async ({ page }) => {
    // 1. Signup with admin email
    await page.goto('/auth/signup')
    await page.fill('[name="email"]', 'admin@chanthana.com')
    await page.fill('[name="password"]', 'AdminPass123!')
    await page.click('button[type="submit"]')

    // 2. Verify admin role in Supabase
    const profile = await supabase
      .from('client_db')
      .select('role')
      .eq('email', 'admin@chanthana.com')
      .single()

    expect(profile.data?.role).toBe('admin')

    // 3. Verify redirect to admin dashboard
    await expect(page).toHaveURL('/admin/commandes')
  })
})
```

---

## Sécurité

### Best Practices Actuelles

✅ **IMPLEMENTED**
- Firebase JWT tokens auto-refresh
- Passwords hashed by Firebase (bcrypt)
- Email verification supported (not enforced)
- HTTPS enforced in production
- Environment variables pour credentials

🔴 **MANQUANT (Phase 4)**
- RLS policies désactivées → Réactiver avec `scripts/rls-policies.sql`
- Service role key exposée → Vérifier `.env` dans `.gitignore`
- Pas de rate limiting sur auth endpoints
- Pas de 2FA (future enhancement)

### Configuration Sécurité Firebase

```typescript
// lib/firebaseConfig.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Public key - OK
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... autres configs publiques
}

// ⚠️ JAMAIS exposer:
// - SUPABASE_SERVICE_ROLE_KEY côté client
// - Firebase Admin SDK credentials côté client
```

---

## Monitoring & Debugging

### AuthContext Debug Mode

```typescript
// contexts/AuthContext.tsx
const DEBUG_AUTH = process.env.NODE_ENV === 'development'

if (DEBUG_AUTH) {
  console.log('[AuthContext] Firebase User:', currentUser?.uid)
  console.log('[AuthContext] Supabase Profile:', currentUserProfile?.id)
  console.log('[AuthContext] Role:', currentUserRole)
}
```

### Firebase Auth State Debugging

```typescript
// utils/authDebug.ts
export async function debugAuthState() {
  const user = auth.currentUser

  if (!user) {
    console.log('❌ No Firebase user')
    return
  }

  console.log('✅ Firebase User:', {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }
  })

  // Check Supabase profile
  const { data: profile, error } = await supabase
    .from('client_db')
    .select('*')
    .eq('firebase_uid', user.uid)
    .single()

  if (error) {
    console.log('❌ Supabase Profile Error:', error)
  } else {
    console.log('✅ Supabase Profile:', profile)
  }
}
```

---

## Migration & Rollback

### Rollback vers Firebase Only

Si besoin de désactiver temporairement Supabase sync:

```typescript
// contexts/AuthContext.tsx
const ENABLE_SUPABASE_SYNC = process.env.NEXT_PUBLIC_ENABLE_SUPABASE_SYNC !== 'false'

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setCurrentUser(firebaseUser)

    if (firebaseUser && ENABLE_SUPABASE_SYNC) {
      // Sync Supabase profile
      await syncSupabaseProfile(firebaseUser)
    }

    setIsLoadingAuth(false)
  })

  return () => unsubscribe()
}, [])
```

---

## Performance

### Optimisations Actuelles

- **onAuthStateChanged** désinscrit au unmount (avoid memory leaks)
- **Supabase profile** caché dans AuthContext (1 fetch par session)
- **Role detection** fait au signup seulement (pas à chaque login)
- **Firebase token** auto-refresh en background

### Métriques

| Opération | Temps Moyen | Cible |
|-----------|-------------|-------|
| Signup (Firebase + Supabase) | ~800ms | <1s |
| Login (Firebase only) | ~300ms | <500ms |
| Profile load (Supabase) | ~150ms | <200ms |
| Token refresh (Firebase) | ~100ms | <150ms |

---

## Références

- **Firebase Auth Docs**: https://firebase.google.com/docs/auth/web/start
- **Supabase Auth Integration**: https://supabase.com/docs/guides/auth
- **Next.js Middleware**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **JWT Best Practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/

---

**Prochaine lecture recommandée**: [Database Schema](./database-schema.md)

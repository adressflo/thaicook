# State Management - APPChanthana

## Vue d'Ensemble

APPChanthana utilise une architecture de state management hybride combinant **TanStack Query 5.90.2** pour l'état serveur et **Context API React** pour l'état UI global.

## Stack de State Management

| Technologie | Version | Rôle |
|-------------|---------|------|
| **TanStack Query** | 5.90.2 | État serveur (cache, mutations, real-time sync) |
| **Context API** | React 19.1.1 | État UI global (auth, cart, notifications) |
| **Supabase Client** | 2.58.0 | Requêtes backend + real-time subscriptions |
| **Firebase Auth** | 12.3.0 | Authentification + JWT tokens |

---

## Architecture de State Management

### Hiérarchie des Providers

```typescript
// components/providers.tsx
<QueryClientProvider client={queryClient}>
  <AuthContextProvider>
    <DataContextProvider>
      <CartContextProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CartContextProvider>
    </DataContextProvider>
  </AuthContextProvider>
</QueryClientProvider>
```

**Ordre d'Initialisation**:
1. **QueryClientProvider** - Cache TanStack Query global
2. **AuthContextProvider** - Firebase Auth + Supabase profiles
3. **DataContextProvider** - Données catalogue (plats, extras, événements)
4. **CartContextProvider** - Panier client avec localStorage
5. **NotificationProvider** - Toasts et notifications UI

---

## TanStack Query 5.90.2 - État Serveur

### Configuration du QueryClient

```typescript
// components/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes par défaut
      cacheTime: 10 * 60 * 1000, // 10 minutes en cache
      refetchOnWindowFocus: true, // Refetch au focus fenêtre
      refetchOnReconnect: true, // Refetch à la reconnexion
      retry: 3, // 3 tentatives avec backoff exponentiel
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1, // 1 seule retry pour mutations
      onError: (error) => {
        console.error('Mutation error:', error)
        toast.error('Une erreur est survenue')
      },
    },
  },
})
```

### Cache Hierarchy - Query Keys

**Structure Hiérarchique** pour invalidation granulaire:

```typescript
// hooks/useSupabaseData.ts - CACHE_TIMES constant
export const CACHE_TIMES = {
  PLATS: 15 * 60 * 1000,      // 15 min (catalogue stable)
  EXTRAS: 15 * 60 * 1000,     // 15 min (catalogue stable)
  CLIENTS: 5 * 60 * 1000,     // 5 min (données dynamiques)
  COMMANDES: 2 * 60 * 1000,   // 2 min (mises à jour fréquentes)
  DETAILS: 2 * 60 * 1000,     // 2 min (détails commandes)
  EVENTS: 10 * 60 * 1000,     // 10 min (événements peu fréquents)
}

// Query Keys Hierarchy
['clients']                           // Tous les clients
['clients', filters]                  // Clients filtrés
['clients', id]                       // Client spécifique
['clients', id, 'orders']             // Commandes d'un client

['commandes']                         // Toutes les commandes
['commandes', filters]                // Commandes filtrées
['commandes', id]                     // Commande spécifique
['commandes', id, 'details']          // Détails d'une commande

['plats']                             // Tous les plats
['plats', category]                   // Plats d'une catégorie
['plats', id]                         // Plat spécifique

['extras']                            // Tous les extras
['extras', platId]                    // Extras pour un plat

['evenements']                        // Tous les événements
['evenements', id]                    // Événement spécifique
```

**Invalidation Granulaire**:

```typescript
// Invalider tous les clients
queryClient.invalidateQueries({ queryKey: ['clients'] })

// Invalider uniquement un client spécifique
queryClient.invalidateQueries({ queryKey: ['clients', clientId] })

// Invalider les commandes d'un client
queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'orders'] })
```

---

## Custom Hooks - useSupabaseData.ts

### Architecture des Hooks

**Type-Safe CRUD Operations** avec validation et error handling:

```typescript
// hooks/useSupabaseData.ts

// ==========================================
// READ OPERATIONS (useQuery)
// ==========================================

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      let query = supabase.from('client_db').select('*')

      if (filters?.role) {
        query = query.eq('role', filters.role)
      }
      if (filters?.search) {
        query = query.or(`nom.ilike.%${filters.search}%,prenom.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw new SupabaseError(error)
      return data
    },
    staleTime: CACHE_TIMES.CLIENTS,
  })
}

export function useCommandes(filters?: CommandeFilters) {
  return useQuery({
    queryKey: ['commandes', filters],
    queryFn: async () => {
      let query = supabase
        .from('commande_db')
        .select(`
          *,
          client:client_db!commande_db_client_r_fkey(id, nom, prenom, email),
          details:details_commande_db(
            *,
            plat:plats_db(nom, prix)
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.clientId) {
        query = query.eq('client_r', filters.clientId)
      }

      const { data, error } = await query
      if (error) throw new SupabaseError(error)
      return data
    },
    staleTime: CACHE_TIMES.COMMANDES,
  })
}

export function usePlats() {
  return useQuery({
    queryKey: ['plats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plats_db')
        .select('*')
        .eq('disponible', true)
        .order('categorie', { ascending: true })

      if (error) throw new SupabaseError(error)
      return data
    },
    staleTime: CACHE_TIMES.PLATS,
  })
}

// ==========================================
// WRITE OPERATIONS (useMutation)
// ==========================================

export function useCreateCommande() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCommande: InsertCommande) => {
      // Validation
      if (!newCommande.client_r) {
        throw new Error('Client ID requis')
      }
      if (!newCommande.details || newCommande.details.length === 0) {
        throw new Error('Au moins un plat requis')
      }

      // Insert commande
      const { data: commande, error: commandeError } = await supabase
        .from('commande_db')
        .insert({
          client_r: newCommande.client_r,
          status: 'en_attente',
          date_commande: new Date().toISOString(),
          total_price: newCommande.total_price,
        })
        .select()
        .single()

      if (commandeError) throw new SupabaseError(commandeError)

      // Insert details
      const detailsWithCommandeId = newCommande.details.map((d) => ({
        ...d,
        commande_r: commande.id,
      }))

      const { error: detailsError } = await supabase
        .from('details_commande_db')
        .insert(detailsWithCommandeId)

      if (detailsError) throw new SupabaseError(detailsError)

      return commande
    },
    onSuccess: () => {
      // Invalidate commandes cache
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
      toast.success('Commande créée avec succès')
    },
    onError: (error) => {
      console.error('Create commande error:', error)
      toast.error('Erreur lors de la création de la commande')
    },
  })
}

export function useUpdateCommande() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<Commande>
    }) => {
      const { data, error } = await supabase
        .from('commande_db')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new SupabaseError(error)
      return data
    },
    onSuccess: (data) => {
      // Invalidate specific commande + list
      queryClient.invalidateQueries({ queryKey: ['commandes', data.id] })
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
      toast.success('Commande mise à jour')
    },
  })
}

export function useDeleteCommande() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete details first (FK constraint)
      const { error: detailsError } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('commande_r', id)

      if (detailsError) throw new SupabaseError(detailsError)

      // Delete commande
      const { error } = await supabase
        .from('commande_db')
        .delete()
        .eq('id', id)

      if (error) throw new SupabaseError(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
      toast.success('Commande supprimée')
    },
  })
}
```

---

## Real-time Synchronization

### Supabase Channels + TanStack Query

**Pattern**: Supabase subscriptions → invalidateQueries()

```typescript
// hooks/useCommandesRealtime.ts
export function useCommandesRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('commandes-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'commande_db',
        },
        (payload) => {
          console.log('Commande change detected:', payload)

          // Invalidate cache to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['commandes'] })

          // Optional: Optimistic UI update
          if (payload.eventType === 'INSERT') {
            toast.info('Nouvelle commande reçue')
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Commande mise à jour')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}

// Usage dans un composant
function AdminCommandes() {
  const { data: commandes, isLoading } = useCommandes()
  useCommandesRealtime() // Auto-refresh on DB changes

  // ...
}
```

**État Actuel**: Real-time **NON ACTIVÉ** (Phase 4 activation prévue)

---

## Context API - État UI Global

### AuthContext - Authentication State

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  currentUser: FirebaseUser | null // Firebase user
  currentUserProfile: ClientDB | null // Supabase profile
  currentUserRole: 'admin' | 'client' | null
  isLoadingAuth: boolean
  isLoadingUserRole: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [currentUserProfile, setCurrentUserProfile] = useState<ClientDB | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'client' | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch Supabase profile
        const { data: profile } = await supabase
          .from('client_db')
          .select('*')
          .eq('firebase_uid', firebaseUser.uid)
          .single()

        if (!profile) {
          // Auto-create profile on first login
          await createUserProfile(firebaseUser)
        } else {
          setCurrentUserProfile(profile)
          setCurrentUserRole(profile.role)
        }

        setCurrentUser(firebaseUser)
      } else {
        setCurrentUser(null)
        setCurrentUserProfile(null)
        setCurrentUserRole(null)
      }

      setIsLoadingAuth(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, currentUserProfile, currentUserRole, isLoadingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthContextProvider')
  return context
}
```

### CartContext - Shopping Cart State

```typescript
// contexts/CartContext.tsx
interface CartItem {
  plat: Plat
  quantity: number
  extras: Extra[]
  prix_total: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (platId: number) => void
  updateQuantity: (platId: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.plat.id === item.plat.id)
      if (existing) {
        return prev.map((i) =>
          i.plat.id === item.plat.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
    toast.success('Ajouté au panier')
  }

  const removeItem = (platId: number) => {
    setItems((prev) => prev.filter((i) => i.plat.id !== platId))
    toast.success('Retiré du panier')
  }

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.prix_total * item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, getTotalPrice, ... }}>
      {children}
    </CartContext.Provider>
  )
}
```

### NotificationContext - Toast Notifications

```typescript
// contexts/NotificationContext.tsx
import { toast as sonnerToast } from 'sonner'

interface NotificationContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    sonnerToast.success(message, { duration: 3000 })
  }

  const showError = (message: string) => {
    sonnerToast.error(message, { duration: 5000 })
  }

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, ... }}>
      {children}
      <Toaster position="top-right" />
    </NotificationContext.Provider>
  )
}
```

---

## State Flow - Diagrammes

### Flux Authentification

```
User Login (Firebase)
  ↓
onAuthStateChanged() listener
  ↓
Fetch Supabase profile (firebase_uid match)
  ↓
Profile exists?
  → YES → Load into AuthContext
  → NO  → Auto-create profile → Load into AuthContext
  ↓
Detect role (admin via email pattern)
  ↓
Update AuthContext state
  ↓
Trigger useAuth() re-renders
```

### Flux Commande (Mutation)

```
User submits order form
  ↓
useCreateCommande() mutation
  ↓
Supabase INSERT (commande_db + details_commande_db)
  ↓
onSuccess callback
  ↓
queryClient.invalidateQueries(['commandes'])
  ↓
TanStack Query refetch
  ↓
UI updates with new data
  ↓
Toast notification
```

### Flux Real-time (Future Phase 4)

```
Admin modifies order status (DB UPDATE)
  ↓
Supabase postgres_changes event
  ↓
Channel subscription callback
  ↓
queryClient.invalidateQueries(['commandes'])
  ↓
Auto-refetch for all useCommandes() hooks
  ↓
Client UI updates in real-time
  ↓
Toast notification (optional)
```

---

## Performance Optimizations

### Optimistic Updates

```typescript
export function useUpdateCommandeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data, error } = await supabase
        .from('commande_db')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update BEFORE server response
    onMutate: async ({ id, status }) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: ['commandes'] })

      // Snapshot current data
      const previous = queryClient.getQueryData(['commandes'])

      // Optimistically update cache
      queryClient.setQueryData(['commandes'], (old: any) =>
        old?.map((c: any) => (c.id === id ? { ...c, status } : c))
      )

      // Return snapshot for rollback
      return { previous }
    },
    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['commandes'], context?.previous)
      toast.error('Erreur lors de la mise à jour')
    },
    // Refetch on success to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    },
  })
}
```

### Selective Refetching

```typescript
// Refetch only stale data
queryClient.invalidateQueries({
  queryKey: ['commandes'],
  refetchType: 'active', // Only refetch active queries
})

// Force refetch all queries
queryClient.invalidateQueries({
  queryKey: ['commandes'],
  refetchType: 'all', // Refetch active + inactive
})
```

### Prefetching

```typescript
// Prefetch data on hover (UX optimization)
const prefetchCommande = (id: number) => {
  queryClient.prefetchQuery({
    queryKey: ['commandes', id],
    queryFn: () => fetchCommandeById(id),
  })
}

// Usage in component
<Link
  href={`/admin/commandes/${commande.id}`}
  onMouseEnter={() => prefetchCommande(commande.id)}
>
  Voir détails
</Link>
```

---

## Error Handling

### Custom SupabaseError Class

```typescript
// lib/supabase.ts
export class SupabaseError extends Error {
  constructor(public originalError: any) {
    super(originalError.message || 'Erreur Supabase')
    this.name = 'SupabaseError'
  }
}

// Usage in hooks
const { data, error } = await supabase.from('commande_db').select('*')
if (error) throw new SupabaseError(error)
```

### Global Error Handling

```typescript
// components/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error instanceof SupabaseError) {
          toast.error(`Erreur base de données: ${error.message}`)
        } else {
          toast.error('Une erreur inattendue est survenue')
        }
        console.error('Mutation error:', error)
      },
    },
  },
})
```

---

## Testing State Management

### Unit Tests (TanStack Query)

```typescript
// hooks/__tests__/useSupabaseData.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClients } from '../useSupabaseData'

describe('useClients', () => {
  it('fetches clients successfully', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useClients(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(5) // Adjust based on fixtures
  })
})
```

### E2E Tests (Playwright)

```typescript
// tests/state-management.spec.ts
test('optimistic update on commande status change', async ({ page }) => {
  await page.goto('/admin/commandes')

  // Change status
  await page.click('[data-testid="commande-1-status"]')
  await page.click('[data-testid="status-en-cours"]')

  // UI should update immediately (optimistic)
  await expect(page.locator('[data-testid="commande-1-badge"]')).toHaveText('En cours')

  // Wait for server confirmation
  await page.waitForTimeout(1000)

  // Status should persist after refetch
  await expect(page.locator('[data-testid="commande-1-badge"]')).toHaveText('En cours')
})
```

---

## Debugging Tools

### React Query DevTools

```typescript
// components/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
```

**Fonctionnalités**:
- Visualiser cache queries en temps réel
- Voir query keys et states (loading, success, error)
- Forcer refetch ou invalider queries manuellement
- Inspecter staleTime et cacheTime

### Browser Console Logging

```typescript
// Debug cache state
console.log(queryClient.getQueryCache().getAll())

// Debug specific query
console.log(queryClient.getQueryData(['commandes']))

// Debug mutations
queryClient.getMutationCache().getAll()
```

---

## Best Practices

### ✅ DO

- **Use TanStack Query** pour toutes les opérations serveur (CRUD)
- **Use Context** uniquement pour l'état UI global (auth, cart, theme)
- **Structure query keys** de manière hiérarchique pour invalidation granulaire
- **Set staleTime** adapté à la nature des données (15min plats, 2min commandes)
- **Implement optimistic updates** pour les mutations critiques (UX)
- **Handle errors** avec try/catch et toast notifications
- **Use custom hooks** pour encapsuler la logique de state management
- **Prefetch data** sur hover pour améliorer UX
- **Test mutations** avec renderHook et waitFor

### ❌ DON'T

- **Ne pas dupliquer** state entre TanStack Query et Context
- **Ne pas utiliser Context** pour les données serveur (cache inefficace)
- **Ne pas oublier** invalidateQueries après mutations
- **Ne pas utiliser** staleTime: 0 (refetch trop fréquent)
- **Ne pas ignorer** les erreurs Supabase (vides souvent)
- **Ne pas hardcoder** query keys (utiliser constantes)
- **Ne pas refetch** manuellement (laisser TanStack Query gérer)

---

## Résumé

APPChanthana utilise une architecture de state management moderne et performante:

- **TanStack Query 5.90.2** pour l'état serveur avec cache intelligent
- **Context API** pour l'état UI global (auth, cart, notifications)
- **Supabase Real-time** (à activer Phase 4) pour synchronisation temps réel
- **Custom hooks** pour encapsulation et réutilisabilité
- **Optimistic updates** pour UX réactive
- **Error handling** robuste avec SupabaseError class

**État Actuel**:
- ✅ TanStack Query configuré et opérationnel
- ✅ Custom hooks CRUD complets dans useSupabaseData.ts
- ✅ Context providers hiérarchie optimale
- ⚠️ Real-time subscriptions non activées (Phase 4)
- ⚠️ Optimistic updates partiellement implémentées

**Prochaines Étapes** (Phase 4):
1. Activer Real-time Supabase sur tables critiques
2. Implémenter optimistic updates manquantes
3. Ajouter prefetching sur navigation critique
4. Tests E2E state management (Playwright)

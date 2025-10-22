# Real-time Subscriptions - APPChanthana

## Overview

APPChanthana utilizes **Supabase Real-time** subscriptions for live data synchronization across connected clients. This enables features like live order updates, admin notifications, and synchronized inventory changes without manual page refreshes.

### Current Implementation Status

- **Phase**: Pre-activation (Phase 4 activation planned)
- **Supabase Version**: 2.58.0 with Real-time support
- **WebSocket Protocol**: Channels-based architecture
- **TanStack Query Integration**: Real-time updates trigger cache invalidation

### Real-time Capabilities

| Feature | Status | Use Case |
|---------|--------|----------|
| **Postgres Changes** | 🟡 Ready | Live database row updates (INSERT, UPDATE, DELETE) |
| **Broadcast** | 🟡 Ready | Client-to-client messaging (admin notifications) |
| **Presence** | 🟡 Ready | Track online users (admin dashboard) |
| **Channel Multiplexing** | ✅ Enabled | Multiple subscriptions over single WebSocket |

---

## Real-time Architecture

### WebSocket Connection Flow

```
Client App → Supabase Client → WebSocket Connection → Supabase Real-time Server
     ↓                                                           ↓
TanStack Query Cache ← Event Handler ← Channel Subscription ← Database Event
```

### Supabase Real-time Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      // Real-time optimizations
      params: {
        eventsPerSecond: 10, // Throttle events to prevent overload
      },
      heartbeatIntervalMs: 30000, // Keep connection alive
      reconnectAfterMs: (tries) => {
        // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
        return Math.min(1000 * Math.pow(2, tries), 30000)
      },
    },
  }
)
```

---

## Real-time Hooks Implementation

### Generic Real-time Subscription Hook

```typescript
// hooks/useRealtimeSubscription.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeSubscriptionOptions<T> {
  /** Query key to invalidate when data changes */
  queryKey: string[]
  /** Database table to subscribe to */
  table: string
  /** Optional filter (e.g., eq.column_name.value) */
  filter?: string
  /** Event types to listen for */
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  /** Callback on event received */
  onEvent?: (payload: RealtimePostgresChangesPayload<T>) => void
  /** Enable/disable subscription */
  enabled?: boolean
}

export function useRealtimeSubscription<T = any>({
  queryKey,
  table,
  filter,
  event = '*',
  onEvent,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    let channel: RealtimeChannel

    // Create channel subscription
    channel = supabase
      .channel(`realtime:${table}${filter ? `:${filter}` : ''}`)
      .on<T>(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log(`[Real-time] ${event} on ${table}:`, payload)

          // Custom callback
          if (onEvent) {
            onEvent(payload)
          }

          // Invalidate TanStack Query cache
          queryClient.invalidateQueries({ queryKey })
        }
      )
      .subscribe((status) => {
        console.log(`[Real-time] Channel status: ${status}`)
      })

    // Cleanup on unmount
    return () => {
      console.log(`[Real-time] Unsubscribing from ${table}`)
      supabase.removeChannel(channel)
    }
  }, [queryKey, table, filter, event, onEvent, enabled, queryClient])
}
```

---

## Real-time Patterns

### Pattern 1: Live Order Updates (Admin Dashboard)

```typescript
// app/admin/dashboard/page.tsx
'use client'

import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { useCommandes } from '@/hooks/useSupabaseData'

export default function AdminDashboardPage() {
  const { data: commandes, isLoading } = useCommandes()

  // ✅ GOOD - Subscribe to all commande changes
  useRealtimeSubscription({
    queryKey: ['commandes'],
    table: 'commande_db',
    event: '*', // Listen to INSERT, UPDATE, DELETE
    onEvent: (payload) => {
      if (payload.eventType === 'INSERT') {
        // Show notification for new order
        toast.success(`Nouvelle commande #${payload.new.id}`)
      } else if (payload.eventType === 'UPDATE') {
        // Show notification for updated order
        toast.info(`Commande #${payload.new.id} mise à jour`)
      }
    },
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <CommandesList commandes={commandes} />
    </div>
  )
}
```

### Pattern 2: Specific Order Status Updates

```typescript
// app/commande/[id]/page.tsx
'use client'

import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { useCommande } from '@/hooks/useSupabaseData'

interface Props {
  params: { id: string }
}

export default function CommandeDetailsPage({ params }: Props) {
  const { data: commande, isLoading } = useCommande(params.id)

  // ✅ GOOD - Subscribe to specific commande updates only
  useRealtimeSubscription({
    queryKey: ['commandes', params.id],
    table: 'commande_db',
    filter: `id=eq.${params.id}`, // Only this commande
    event: 'UPDATE', // Only updates
    onEvent: (payload) => {
      const newStatus = payload.new.status
      const oldStatus = payload.old.status

      if (newStatus !== oldStatus) {
        toast.success(`Statut changé: ${oldStatus} → ${newStatus}`)
      }
    },
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div>
      <h1>Commande #{commande.id}</h1>
      <p>Status: {commande.status}</p>
    </div>
  )
}
```

### Pattern 3: Inventory Updates (Plats Availability)

```typescript
// app/commander/page.tsx
'use client'

import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { usePlats } from '@/hooks/useSupabaseData'

export default function CommanderPage() {
  const { data: plats, isLoading } = usePlats()

  // ✅ GOOD - Subscribe to plats availability changes
  useRealtimeSubscription({
    queryKey: ['plats'],
    table: 'plats_db',
    event: 'UPDATE', // Only when plats updated
    onEvent: (payload) => {
      const wasAvailable = payload.old.disponible
      const isAvailable = payload.new.disponible

      if (wasAvailable && !isAvailable) {
        toast.warning(`${payload.new.nom} n'est plus disponible`)
      } else if (!wasAvailable && isAvailable) {
        toast.success(`${payload.new.nom} est de nouveau disponible`)
      }
    },
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    <div>
      <h1>Commander</h1>
      <PlatsList plats={plats} />
    </div>
  )
}
```

---

## Broadcast Channel Pattern

### Admin-to-Admin Messaging

```typescript
// hooks/useAdminBroadcast.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface BroadcastMessage {
  type: 'notification' | 'alert' | 'update'
  message: string
  from: string
  timestamp: string
}

export function useAdminBroadcast() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Create broadcast channel
    const broadcastChannel = supabase.channel('admin-broadcast')

    // Listen for broadcast messages
    broadcastChannel
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log('[Broadcast] Message received:', payload)
        setMessages((prev) => [...prev, payload.payload as BroadcastMessage])
      })
      .subscribe((status) => {
        console.log('[Broadcast] Channel status:', status)
      })

    setChannel(broadcastChannel)

    return () => {
      supabase.removeChannel(broadcastChannel)
    }
  }, [])

  // Send broadcast message
  const sendMessage = async (message: Omit<BroadcastMessage, 'timestamp'>) => {
    if (!channel) return

    const broadcastMessage: BroadcastMessage = {
      ...message,
      timestamp: new Date().toISOString(),
    }

    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: broadcastMessage,
    })
  }

  return { messages, sendMessage }
}

// Usage in admin component
export function AdminNotifications() {
  const { messages, sendMessage } = useAdminBroadcast()

  const handleSendAlert = () => {
    sendMessage({
      type: 'alert',
      message: 'Nouvelle commande urgente',
      from: 'Admin 1',
    })
  }

  return (
    <div>
      <button onClick={handleSendAlert}>Envoyer Alerte</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            [{msg.type}] {msg.message} - {msg.from}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Presence Pattern

### Track Online Admins

```typescript
// hooks/usePresence.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { RealtimeChannel } from '@supabase/supabase-js'

interface PresenceState {
  user_id: string
  email: string
  role: string
  online_at: string
}

export function usePresence() {
  const { currentUser, currentUserRole } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!currentUser || currentUserRole !== 'admin') return

    // Create presence channel
    const presenceChannel = supabase.channel('admin-presence')

    // Track presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        const users = Object.values(state).flat() as PresenceState[]
        setOnlineUsers(users)
        console.log('[Presence] Online admins:', users)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('[Presence] Admin joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('[Presence] Admin left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user
          await presenceChannel.track({
            user_id: currentUser.uid,
            email: currentUser.email,
            role: currentUserRole,
            online_at: new Date().toISOString(),
          })
        }
      })

    setChannel(presenceChannel)

    return () => {
      presenceChannel.untrack()
      supabase.removeChannel(presenceChannel)
    }
  }, [currentUser, currentUserRole])

  return { onlineUsers }
}

// Usage in admin header
export function AdminHeader() {
  const { onlineUsers } = usePresence()

  return (
    <header>
      <h1>Admin Dashboard</h1>
      <div>
        {onlineUsers.length} admin(s) en ligne:
        {onlineUsers.map((user) => (
          <span key={user.user_id}>{user.email}</span>
        ))}
      </div>
    </header>
  )
}
```

---

## Connection State Management

### Real-time Connection Status Indicator

```typescript
// hooks/useRealtimeStatus.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export function useRealtimeStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    // Monitor real-time connection status
    const channel = supabase.channel('connection-monitor')

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setStatus('connected')
      } else if (status === 'CLOSED') {
        setStatus('disconnected')
      } else {
        setStatus('connecting')
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { status, isConnected: status === 'connected' }
}

// Connection status component
export function RealtimeStatusIndicator() {
  const { status } = useRealtimeStatus()

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn('h-2 w-2 rounded-full', {
          'bg-green-500 animate-pulse': status === 'connected',
          'bg-yellow-500 animate-pulse': status === 'connecting',
          'bg-red-500': status === 'disconnected',
        })}
      />
      <span className="text-xs text-gray-600">
        {status === 'connected' && 'Connecté'}
        {status === 'connecting' && 'Connexion...'}
        {status === 'disconnected' && 'Déconnecté'}
      </span>
    </div>
  )
}
```

---

## TanStack Query Integration

### Optimistic Updates with Real-time Sync

```typescript
// hooks/useSupabaseData.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Commande } from '@/types/app'

export function useUpdateCommandeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('commande_db')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // ✅ GOOD - Optimistic update before server response
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['commandes', id] })

      // Snapshot previous value
      const previousCommande = queryClient.getQueryData<Commande>(['commandes', id])

      // Optimistically update cache
      queryClient.setQueryData<Commande>(['commandes', id], (old) => {
        if (!old) return old
        return { ...old, status }
      })

      // Return snapshot for rollback
      return { previousCommande }
    },

    // ✅ Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousCommande) {
        queryClient.setQueryData(['commandes', variables.id], context.previousCommande)
      }
      toast.error('Erreur lors de la mise à jour du statut')
    },

    // ✅ Real-time subscription will handle final sync
    onSuccess: () => {
      toast.success('Statut mis à jour')
      // Real-time subscription automatically invalidates cache
    },
  })
}
```

---

## Performance Considerations

### Connection Pooling

```typescript
// lib/realtimeManager.ts
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map()

  // ✅ GOOD - Reuse channels instead of creating duplicates
  getOrCreateChannel(channelName: string): RealtimeChannel {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase.channel(channelName)
    this.channels.set(channelName, channel)
    return channel
  }

  removeChannel(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  removeAllChannels() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }
}

export const realtimeManager = new RealtimeManager()
```

### Throttling Real-time Events

```typescript
// hooks/useRealtimeSubscription.ts (throttled version)
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useThrottledRealtimeSubscription<T = any>({
  queryKey,
  table,
  event = '*',
  throttleMs = 1000, // Throttle to max 1 event per second
}: UseRealtimeSubscriptionOptions<T>) {
  const queryClient = useQueryClient()
  const lastInvalidationRef = useRef<number>(0)

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on<T>('postgres_changes', { event, schema: 'public', table }, (payload) => {
        const now = Date.now()

        // ✅ Throttle invalidations
        if (now - lastInvalidationRef.current > throttleMs) {
          console.log(`[Real-time] Invalidating ${table}`)
          queryClient.invalidateQueries({ queryKey })
          lastInvalidationRef.current = now
        } else {
          console.log(`[Real-time] Throttled invalidation for ${table}`)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryKey, table, event, throttleMs, queryClient])
}
```

---

## Testing Real-time Features

### Manual Testing Checklist

- [ ] **Connection Established**: Verify WebSocket connection in browser DevTools (Network > WS)
- [ ] **Event Triggering**: Manually update database row → check if UI updates
- [ ] **Reconnection**: Disable network → re-enable → verify reconnection
- [ ] **Multiple Clients**: Open 2 browser tabs → update in one → verify other updates
- [ ] **Presence**: Login as admin in 2 tabs → verify both show as online
- [ ] **Broadcast**: Send broadcast message → verify all clients receive

### Automated Testing (Playwright)

```typescript
// tests/real-time.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Real-time Subscriptions', () => {
  test('should update order status in real-time', async ({ page, context }) => {
    // Open admin dashboard in first page
    await page.goto('/admin/dashboard')
    await expect(page.locator('[data-testid="commandes-list"]')).toBeVisible()

    // Open new page for making update
    const adminPage2 = await context.newPage()
    await adminPage2.goto('/admin/commandes/1')

    // Update status in second page
    await adminPage2.locator('[data-testid="status-select"]').selectOption('en_preparation')
    await adminPage2.locator('[data-testid="save-button"]').click()

    // Verify first page updates automatically (real-time)
    await expect(
      page.locator('[data-testid="commande-1-status"]')
    ).toHaveText('en_preparation', { timeout: 5000 })
  })
})
```

---

## Common Real-time Patterns

### Pattern: Live Order Dashboard

```typescript
// app/admin/orders/live/page.tsx
'use client'

import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { useCommandes } from '@/hooks/useSupabaseData'
import { useSound } from '@/hooks/useSound'

export default function LiveOrdersPage() {
  const { data: commandes } = useCommandes()
  const { playNotification } = useSound()

  // ✅ Live updates with sound notification
  useRealtimeSubscription({
    queryKey: ['commandes'],
    table: 'commande_db',
    event: 'INSERT',
    onEvent: (payload) => {
      // Play sound for new order
      playNotification()

      // Show toast notification
      toast.success(`Nouvelle commande #${payload.new.id} reçue!`, {
        duration: 5000,
      })
    },
  })

  return (
    <div>
      <h1>Commandes en Direct</h1>
      <div className="grid gap-4">
        {commandes?.map((commande) => (
          <CommandeCard key={commande.id} commande={commande} />
        ))}
      </div>
    </div>
  )
}
```

### Pattern: Real-time Client Notification

```typescript
// app/commande/[id]/status/page.tsx
'use client'

import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { useCommande } from '@/hooks/useSupabaseData'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  params: { id: string }
}

export default function CommandeStatusPage({ params }: Props) {
  const { currentUser } = useAuth()
  const { data: commande } = useCommande(params.id)

  // ✅ Only subscribe if user owns this commande
  useRealtimeSubscription({
    queryKey: ['commandes', params.id],
    table: 'commande_db',
    filter: `id=eq.${params.id}`,
    event: 'UPDATE',
    enabled: currentUser?.uid === commande?.contact_client_r,
    onEvent: (payload) => {
      const newStatus = payload.new.status
      const statusMessages = {
        en_attente: 'Votre commande est en attente de confirmation',
        en_preparation: 'Votre commande est en cours de préparation',
        prete: 'Votre commande est prête!',
        livree: 'Votre commande a été livrée',
      }

      toast.success(statusMessages[newStatus] || `Statut: ${newStatus}`)
    },
  })

  return (
    <div>
      <h1>Suivi de Commande #{params.id}</h1>
      <StatusTimeline status={commande?.status} />
    </div>
  )
}
```

---

## Best Practices

### ✅ DO

- **Throttle events** to prevent excessive cache invalidations (1 event/sec max)
- **Filter subscriptions** to specific rows when possible (`filter: "id=eq.123"`)
- **Unsubscribe on unmount** to prevent memory leaks
- **Use optimistic updates** for better UX before real-time confirmation
- **Monitor connection status** and show indicator to users
- **Implement reconnection logic** with exponential backoff
- **Combine with TanStack Query** for cache invalidation
- **Test real-time features** with multiple browser tabs
- **Log real-time events** in development for debugging

### ❌ AVOID

- **Creating duplicate channels** for the same subscription (use channel pooling)
- **Subscribing to large tables** without filters (causes performance issues)
- **Ignoring connection status** (handle disconnections gracefully)
- **Skipping cleanup** (always remove channels on unmount)
- **Over-invalidating cache** (use specific queryKey paths)
- **Relying solely on real-time** without initial data fetch
- **Subscribing in Server Components** (real-time requires client-side)
- **Broadcasting sensitive data** (always validate permissions)
- **Forgetting error handling** for subscription failures

---

## Performance Metrics

### Real-time Performance Targets

| Metric | Target | Current | Priority |
|--------|--------|---------|----------|
| **Connection Latency** | <500ms | ~300ms | ✅ Good |
| **Event Delivery Time** | <1s | ~500ms | ✅ Good |
| **Reconnection Time** | <5s | ~3s | ✅ Good |
| **Max Concurrent Channels** | 100+ | 50 | 🟡 Acceptable |
| **Payload Size** | <10KB | ~5KB | ✅ Good |

### Monitoring Real-time Performance

```typescript
// lib/realtimeMonitoring.ts
export function monitorRealtimePerformance() {
  const startTime = Date.now()

  supabase
    .channel('performance-monitor')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'commande_db' }, () => {
      const latency = Date.now() - startTime
      console.log(`[Real-time] Event latency: ${latency}ms`)

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'realtime_latency', {
          event_category: 'Real-time Performance',
          value: latency,
        })
      }
    })
    .subscribe()
}
```

---

## Activation Roadmap (Phase 4)

### Step 1: Enable Real-time in Supabase Dashboard

1. Navigate to **Supabase Dashboard** → **Database** → **Replication**
2. Enable replication for tables:
   - `commande_db` ✅
   - `plats_db` ✅
   - `client_db` ✅
   - `evenements_db` ✅
3. Configure RLS policies to work with real-time (see [rls-policies-guide.md](./rls-policies-guide.md))

### Step 2: Activate Subscriptions in Code

```typescript
// contexts/RealtimeContext.tsx (create in Phase 4)
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface RealtimeContextType {
  isConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextType>({ isConnected: false })

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Global real-time connection monitor
    const channel = supabase.channel('global-connection')

    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED')
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <RealtimeContext.Provider value={{ isConnected }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => useContext(RealtimeContext)
```

### Step 3: Add to Provider Hierarchy

```typescript
// app/layout.tsx
import { RealtimeProvider } from '@/contexts/RealtimeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <AuthProvider>
            <DataProvider>
              <RealtimeProvider>{children}</RealtimeProvider>
            </DataProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
```

### Step 4: Test Real-time Features

- [ ] **Commande updates**: Create order → verify admin sees update
- [ ] **Plat availability**: Toggle availability → verify client UI updates
- [ ] **Multi-client sync**: Open 2 tabs → verify both update simultaneously
- [ ] **Reconnection**: Disable network → re-enable → verify reconnection
- [ ] **Performance**: Monitor event latency (<1s target)

---

## Troubleshooting

### Issue: Real-time Events Not Received

**Symptoms**: Database updates don't trigger UI updates

**Diagnosis**:
1. Check WebSocket connection in browser DevTools (Network > WS)
2. Verify channel subscription status (should be `SUBSCRIBED`)
3. Check Supabase replication settings (Database > Replication)
4. Verify RLS policies allow subscription (see [rls-policies-guide.md](./rls-policies-guide.md))

**Solution**:
```typescript
// Add verbose logging
supabase
  .channel('debug-channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'commande_db' }, (payload) => {
    console.log('[Real-time] Event received:', payload)
  })
  .subscribe((status, err) => {
    console.log('[Real-time] Status:', status)
    if (err) console.error('[Real-time] Error:', err)
  })
```

### Issue: Subscription Memory Leak

**Symptoms**: Multiple duplicate subscriptions, increasing memory usage

**Diagnosis**:
1. Check browser DevTools > Memory > Take heap snapshot
2. Search for `RealtimeChannel` instances
3. Verify cleanup in `useEffect` return function

**Solution**:
```typescript
// ✅ ALWAYS cleanup subscriptions
useEffect(() => {
  const channel = supabase.channel('my-channel')
  channel.subscribe()

  return () => {
    console.log('Cleaning up channel')
    supabase.removeChannel(channel) // ✅ Critical!
  }
}, [])
```

### Issue: High Latency (>2s)

**Symptoms**: Real-time events take too long to arrive

**Diagnosis**:
1. Check network conditions (ping Supabase server)
2. Monitor event payload size (should be <10KB)
3. Check number of concurrent channels (should be <50)

**Solution**:
```typescript
// ✅ Reduce payload size by selecting specific columns
supabase
  .channel('optimized-channel')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'commande_db',
      // Only subscribe to status changes (not full row)
    },
    (payload) => {
      console.log('Status changed:', payload.new.status)
    }
  )
  .subscribe()
```

---

## Next Steps

After completing Phase 4 real-time activation:

1. **Monitor Performance**: Track event latency and connection stability
2. **User Feedback**: Collect feedback on real-time experience
3. **Optimize Subscriptions**: Fine-tune filters and throttling
4. **Scale Testing**: Test with 50+ concurrent users
5. **Documentation**: Update this guide with production learnings

---

## Related Documentation

- [Database Schema](./database-schema.md) - Database tables and relationships
- [State Management](./state-management.md) - TanStack Query cache integration
- [RLS Policies Guide](./rls-policies-guide.md) - Security policies for real-time
- [Performance Optimization](./performance-optimization.md) - Real-time performance tuning
- [Hybrid Auth Architecture](./hybrid-auth-architecture.md) - Authentication flow
- [Troubleshooting](./troubleshooting.md) - Common real-time issues

---

**Phase 4 Activation Status**: 🟡 Ready for activation (pending RLS policies + testing)

**Last Updated**: 2025-10-06 (Phase 2 documentation creation)

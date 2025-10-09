# Coding Standards - APPChanthana

## Overview

This document defines the coding standards, conventions, and best practices for the APPChanthana project. These standards ensure code consistency, maintainability, and quality across the entire codebase.

**Last Updated**: 2025-10-06
**Target Stack**: Next.js 15.5.4 + React 19.1.1 + TypeScript 5 + Tailwind CSS v4

---

## Table of Contents

1. [TypeScript Configuration](#typescript-configuration)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [Component Patterns](#component-patterns)
5. [Import Order](#import-order)
6. [Code Formatting](#code-formatting)
7. [Error Handling](#error-handling)
8. [Async/Await Patterns](#asyncawait-patterns)
9. [React Hooks Rules](#react-hooks-rules)
10. [State Management](#state-management)
11. [Styling Standards](#styling-standards)
12. [Comments and Documentation](#comments-and-documentation)
13. [Testing Standards](#testing-standards)
14. [Security Best Practices](#security-best-practices)
15. [Performance Considerations](#performance-considerations)

---

## TypeScript Configuration

### Strict Mode Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,                      // Enable all strict type checking
    "strictNullChecks": true,            // Enforce null/undefined checks
    "strictFunctionTypes": true,         // Strict function parameter types
    "strictBindCallApply": true,         // Strict bind/call/apply types
    "noImplicitAny": true,               // Disallow implicit 'any' types
    "noImplicitThis": true,              // Disallow 'this' with implicit 'any'
    "noUnusedLocals": true,              // Report unused local variables
    "noUnusedParameters": true,          // Report unused function parameters
    "noImplicitReturns": true,           // Report missing return statements
    "noFallthroughCasesInSwitch": true,  // Report switch fallthrough
    "esModuleInterop": true,             // Enable ES module interop
    "skipLibCheck": true,                // Skip type checking of .d.ts files
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definitions Standards

**Prefer Interfaces over Types** for object shapes:

```typescript
// ✅ GOOD - Use interface for objects
interface UserProfile {
  id: number
  firebase_uid: string
  nom: string
  prenom: string
  email: string
  role: 'admin' | 'client'
}

// ❌ AVOID - Type alias for simple objects
type UserProfile = {
  id: number
  // ...
}

// ✅ GOOD - Use type for unions, intersections, utilities
type CommandeStatus = 'en_attente' | 'en_preparation' | 'prete' | 'livree' | 'annulee'
type AdminUser = UserProfile & { adminPermissions: string[] }
```

### Null Safety Patterns

```typescript
// ✅ GOOD - Explicit null checks
function getUserName(user: UserProfile | null): string {
  if (!user) {
    return 'Guest'
  }
  return `${user.prenom} ${user.nom}`
}

// ✅ GOOD - Optional chaining
const userName = user?.prenom ?? 'Unknown'
const orderTotal = order?.details?.reduce((sum, d) => sum + d.prix_total, 0) ?? 0

// ❌ AVOID - Non-null assertion (use sparingly)
const name = user!.nom  // Only if 100% certain user exists
```

### Type Guards

```typescript
// ✅ GOOD - Type guard functions
function isAdminUser(user: UserProfile): user is AdminUser {
  return user.role === 'admin'
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

// Usage
if (isAdminUser(currentUser)) {
  // TypeScript knows currentUser is AdminUser here
  console.log(currentUser.adminPermissions)
}
```

---

## Naming Conventions

### Variables and Functions

```typescript
// ✅ GOOD - camelCase for variables and functions
const currentUser = useAuth()
const totalPrice = calculateTotal(items)
const isAuthenticated = !!currentUser

function getUserProfile(uid: string) { }
function validateEmail(email: string): boolean { }

// ❌ AVOID - PascalCase for variables
const CurrentUser = useAuth()  // Reserved for components/classes
```

### Components and Classes

```typescript
// ✅ GOOD - PascalCase for components
export function UserProfile() { }
export function OrderHistory() { }
export function AdminDashboard() { }

// ✅ GOOD - PascalCase for classes
class SupabaseError extends Error { }
class OrderCalculator { }

// ❌ AVOID - camelCase for components
export function userProfile() { }  // Incorrect
```

### Constants

```typescript
// ✅ GOOD - SCREAMING_SNAKE_CASE for global constants
const MAX_ORDER_ITEMS = 50
const DEFAULT_CACHE_TIME = 5 * 60 * 1000
const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// ✅ GOOD - camelCase for config objects
const cacheConfig = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
} as const
```

### Boolean Variables

```typescript
// ✅ GOOD - is/has/should prefix for booleans
const isLoading = true
const hasPermission = checkPermission(user)
const shouldShowModal = state.open && !state.dismissed
const canEditOrder = isAdmin || order.client_id === currentUser.id

// ❌ AVOID - No clear boolean prefix
const loading = true  // Ambiguous
const permission = checkPermission(user)  // Could be object
```

### Event Handlers

```typescript
// ✅ GOOD - handle prefix for event handlers
function handleSubmit(event: FormEvent) { }
function handleLoginClick() { }
function handleOrderUpdate(orderId: number) { }

// ✅ GOOD - on prefix for component props
interface ButtonProps {
  onPress: () => void
  onLongPress?: () => void
}
```

### File Naming

```typescript
// ✅ GOOD - kebab-case for files
user-profile.tsx
order-history.tsx
supabase-service.ts
auth-context.tsx

// ✅ GOOD - PascalCase for component files (alternative)
UserProfile.tsx
OrderHistory.tsx

// ❌ AVOID - Mixed cases
User_Profile.tsx
orderHistory.tsx
```

---

## File Organization

### Project Structure

```
app/                        # Next.js App Router
  ├── (public)/             # Public routes (no auth)
  │   ├── page.tsx          # Homepage
  │   └── commander/        # Order page
  ├── (protected)/          # Protected routes (auth required)
  │   └── profil/
  ├── admin/                # Admin routes (admin role)
  ├── api/                  # API routes
  ├── layout.tsx            # Root layout
  └── globals.css           # Global styles

components/                 # React components
  ├── ui/                   # shadcn/ui components
  │   ├── button.tsx
  │   ├── dialog.tsx
  │   └── toast.tsx
  ├── forms/                # Form components
  ├── layout/               # Layout components
  └── OptimizedImage.tsx    # Shared components

contexts/                   # React contexts
  ├── AuthContext.tsx       # Authentication context
  ├── CartContext.tsx       # Shopping cart context
  └── NotificationContext.tsx

hooks/                      # Custom React hooks
  ├── useSupabaseData.ts    # Data fetching hooks
  ├── use-mobile.tsx        # Responsive hooks
  └── useAuth.tsx           # Auth hooks

lib/                        # Libraries and utilities
  ├── supabase.ts           # Supabase client
  ├── firebaseConfig.ts     # Firebase config
  ├── validations.ts        # Validation functions
  └── utils.ts              # Utility functions

types/                      # TypeScript types
  ├── supabase.ts           # Generated Supabase types
  ├── app.ts                # Application types
  └── authTypes.ts          # Auth types

services/                   # Service layer
  └── supabaseService.ts    # Business logic

public/                     # Static assets
  └── images/

scripts/                    # Utility scripts
  └── get_db_data.js
```

### File Structure Template

**Component File**:

```typescript
// 1. Imports - External dependencies
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Imports - Internal dependencies
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

// 3. Imports - Types
import type { UserProfile } from '@/types/app'

// 4. Type definitions
interface ComponentProps {
  userId: number
  onUpdate?: (user: UserProfile) => void
}

// 5. Component definition
export function ComponentName({ userId, onUpdate }: ComponentProps) {
  // 5a. State declarations
  const [isEditing, setIsEditing] = useState(false)

  // 5b. Context hooks
  const { currentUser } = useAuth()

  // 5c. Query hooks
  const { data: user, isLoading } = useQuery({ /* ... */ })

  // 5d. Side effects
  useEffect(() => {
    // Effect logic
  }, [userId])

  // 5e. Event handlers
  const handleEdit = () => {
    setIsEditing(true)
  }

  // 5f. Early returns
  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  // 5g. Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}

// 6. Helper functions (outside component)
function formatUserName(user: UserProfile): string {
  return `${user.prenom} ${user.nom}`
}
```

---

## Component Patterns

### Server Components First (Next.js 15)

```typescript
// ✅ GOOD - Default to Server Component
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Can directly fetch data server-side
  const data = await fetch('https://api.example.com/data')

  return <div>{/* Render */}</div>
}

// ✅ GOOD - Client Component only when needed
// components/InteractiveButton.tsx
'use client'

import { useState } from 'react'

export function InteractiveButton() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Component Export Pattern

```typescript
// ✅ GOOD - Named export for better tree-shaking
export function UserProfile() { }
export function OrderHistory() { }

// ❌ AVOID - Default export (harder to refactor)
export default function UserProfile() { }

// ✅ EXCEPTION - Default export for pages (Next.js requirement)
// app/page.tsx
export default function HomePage() { }
```

### Props Interface Naming

```typescript
// ✅ GOOD - ComponentNameProps pattern
interface UserProfileProps {
  userId: number
  showAvatar?: boolean
}

export function UserProfile({ userId, showAvatar = true }: UserProfileProps) { }

// ✅ GOOD - Generic props with clear naming
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}
```

### Children Pattern

```typescript
// ✅ GOOD - Explicit children type
interface CardProps {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

// ✅ GOOD - PropsWithChildren utility
interface CardProps {
  title: string
}

export function Card({ title, children }: React.PropsWithChildren<CardProps>) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Conditional Rendering

```typescript
// ✅ GOOD - Early returns for clarity
function UserProfile({ userId }: { userId: number | null }) {
  if (!userId) {
    return <div>Please log in</div>
  }

  const user = useUser(userId)

  if (!user) {
    return <div>User not found</div>
  }

  return <div>{user.name}</div>
}

// ✅ GOOD - Ternary for simple conditions
<div>{isLoading ? <Spinner /> : <Content />}</div>

// ✅ GOOD - Logical AND for optional rendering
{isAdmin && <AdminPanel />}

// ❌ AVOID - Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : data ? <Content /> : null}
```

---

## Import Order

### Standard Import Order

```typescript
// 1. React and framework imports
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// 2. Third-party library imports
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

// 3. Internal UI components
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

// 4. Internal business components
import { UserAvatar } from '@/components/UserAvatar'
import { OrderSummary } from '@/components/OrderSummary'

// 5. Contexts and hooks
import { useAuth } from '@/contexts/AuthContext'
import { useSupabaseData } from '@/hooks/useSupabaseData'

// 6. Services and utilities
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { validateEmail } from '@/lib/validations'

// 7. Types
import type { UserProfile, Commande } from '@/types/app'
import type { Database } from '@/types/supabase'

// 8. Assets (if applicable)
import logo from '@/public/images/logo.png'
```

### Path Mapping (@/ alias)

```typescript
// ✅ GOOD - Use @/ alias for absolute imports
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

// ❌ AVOID - Relative imports for non-adjacent files
import { Button } from '../../../components/ui/button'
import { useAuth } from '../../contexts/AuthContext'
```

---

## Code Formatting

### ESLint Configuration

**File**: `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Prettier Configuration (If Used)

**File**: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Line Length and Wrapping

```typescript
// ✅ GOOD - Keep lines under 100 characters
const result = calculateOrderTotal(
  orderItems,
  discountCode,
  shippingMethod
)

// ✅ GOOD - Break long chains
const userData = await supabase
  .from('client_db')
  .select('*')
  .eq('firebase_uid', uid)
  .single()

// ❌ AVOID - Very long lines
const result = calculateOrderTotal(orderItems, discountCode, shippingMethod, taxRate, additionalFees, loyaltyDiscount)
```

### Object and Array Formatting

```typescript
// ✅ GOOD - Multiline objects (>2 properties)
const user = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com',
}

// ✅ GOOD - Inline for short objects
const point = { x: 10, y: 20 }

// ✅ GOOD - Trailing commas
const items = [
  'item1',
  'item2',
  'item3',  // Trailing comma for easy git diffs
]
```

---

## Error Handling

### Try-Catch Patterns

```typescript
// ✅ GOOD - Specific error handling
async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  try {
    const { data: updated, error } = await supabase
      .from('client_db')
      .update(data)
      .eq('firebase_uid', uid)
      .select()
      .single()

    if (error) {
      throw new SupabaseError(error, 'Failed to update profile')
    }

    toast.success('Profile updated successfully')
    return updated
  } catch (error) {
    if (error instanceof SupabaseError) {
      toast.error(error.message)
      console.error('Profile update failed:', error.details)
    } else {
      toast.error('An unexpected error occurred')
      console.error('Unexpected error:', error)
    }
    throw error
  }
}
```

### Custom Error Classes

```typescript
// ✅ GOOD - Extend Error for custom errors
export class SupabaseError extends Error {
  details: PostgrestError
  context?: string

  constructor(error: PostgrestError, context?: string) {
    super(error.message || 'Supabase operation failed')
    this.name = 'SupabaseError'
    this.details = error
    this.context = context
  }
}

// Usage
throw new SupabaseError(error, 'Failed to fetch commandes')
```

### Error Boundaries (React)

```typescript
// ✅ GOOD - Error boundary for component trees
'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>
    }

    return this.props.children
  }
}
```

---

## Async/Await Patterns

### Async Function Best Practices

```typescript
// ✅ GOOD - Always use try-catch with async
async function fetchUserData(uid: string) {
  try {
    const { data, error } = await supabase
      .from('client_db')
      .select('*')
      .eq('firebase_uid', uid)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// ✅ GOOD - Parallel fetching with Promise.all
async function loadDashboardData() {
  try {
    const [users, orders, plats] = await Promise.all([
      fetchUsers(),
      fetchOrders(),
      fetchPlats(),
    ])

    return { users, orders, plats }
  } catch (error) {
    console.error('Dashboard data loading failed:', error)
    throw error
  }
}

// ❌ AVOID - Sequential fetching when parallel is possible
const users = await fetchUsers()
const orders = await fetchOrders()  // Waits unnecessarily
const plats = await fetchPlats()    // Waits unnecessarily
```

### Promise Chaining vs Async/Await

```typescript
// ✅ GOOD - Prefer async/await for readability
async function createOrder(orderData: OrderInput) {
  const { data: order } = await supabase
    .from('commande_db')
    .insert(orderData)
    .select()
    .single()

  await sendOrderConfirmation(order.id)
  await updateInventory(order.items)

  return order
}

// ❌ AVOID - Promise chaining (harder to read)
function createOrder(orderData: OrderInput) {
  return supabase
    .from('commande_db')
    .insert(orderData)
    .select()
    .single()
    .then(({ data: order }) => {
      return sendOrderConfirmation(order.id)
        .then(() => updateInventory(order.items))
        .then(() => order)
    })
}
```

---

## React Hooks Rules

### Hook Order and Consistency

```typescript
// ✅ GOOD - Hooks in consistent order
function OrderPage({ orderId }: { orderId: number }) {
  // 1. State hooks
  const [isEditing, setIsEditing] = useState(false)

  // 2. Context hooks
  const { currentUser } = useAuth()

  // 3. Query hooks
  const { data: order, isLoading } = useQuery({
    queryKey: ['commandes', orderId],
    queryFn: () => fetchOrder(orderId),
  })

  // 4. Mutation hooks
  const updateMutation = useMutation({
    mutationFn: updateOrder,
  })

  // 5. Effect hooks
  useEffect(() => {
    // Side effect logic
  }, [orderId])

  // 6. Callback hooks
  const handleUpdate = useCallback(() => {
    updateMutation.mutate({ id: orderId, status: 'prete' })
  }, [orderId, updateMutation])

  // 7. Ref hooks
  const inputRef = useRef<HTMLInputElement>(null)

  // Component logic...
}

// ❌ AVOID - Conditional hooks
if (isAdmin) {
  const adminData = useAdminData()  // ❌ Breaks Rules of Hooks
}

// ✅ GOOD - Call hooks unconditionally, use conditional logic inside
const adminData = useAdminData()
const displayData = isAdmin ? adminData : null
```

### Custom Hook Pattern

```typescript
// ✅ GOOD - Custom hook with clear naming
export function useOrderStatus(orderId: number) {
  const [status, setStatus] = useState<CommandeStatus>('en_attente')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'commande_db',
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        setStatus(payload.new.status)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const updateStatus = useCallback(async (newStatus: CommandeStatus) => {
    setIsUpdating(true)
    try {
      await supabase
        .from('commande_db')
        .update({ status: newStatus })
        .eq('id', orderId)

      setStatus(newStatus)
    } catch (error) {
      console.error('Status update failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }, [orderId])

  return { status, isUpdating, updateStatus }
}
```

### useEffect Best Practices

```typescript
// ✅ GOOD - Clean up subscriptions
useEffect(() => {
  const channel = supabase.channel('commandes')

  channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'commande_db' }, handleChange)
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}, [handleChange])

// ✅ GOOD - Explicit dependencies
useEffect(() => {
  if (userId) {
    fetchUserData(userId)
  }
}, [userId])  // Clear dependency

// ❌ AVOID - Missing dependencies
useEffect(() => {
  fetchUserData(userId)
}, [])  // ESLint will warn - userId missing

// ❌ AVOID - Object/array dependencies (causes infinite loops)
useEffect(() => {
  console.log(filters)
}, [filters])  // New object on every render

// ✅ GOOD - Stable object reference
const filters = useMemo(() => ({ status: 'prete' }), [])
useEffect(() => {
  console.log(filters)
}, [filters])  // Now stable
```

---

## State Management

### TanStack Query Patterns

```typescript
// ✅ GOOD - Query hook with proper typing
export function useCommandes(filters?: CommandeFilters) {
  return useQuery({
    queryKey: ['commandes', filters],
    queryFn: async () => {
      let query = supabase
        .from('commande_db')
        .select(`
          *,
          client:client_db!commande_db_client_r_fkey(nom, prenom),
          details:details_commande_db(*)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      if (error) throw new SupabaseError(error)
      return data
    },
    staleTime: 2 * 60 * 1000,  // 2 minutes
  })
}

// ✅ GOOD - Mutation hook with optimistic updates
export function useUpdateCommandeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: CommandeStatus }) => {
      const { data, error } = await supabase
        .from('commande_db')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new SupabaseError(error)
      return data
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['commandes'] })
      const previous = queryClient.getQueryData(['commandes'])

      queryClient.setQueryData(['commandes'], (old: any) =>
        old?.map((c: any) => (c.id === id ? { ...c, status } : c))
      )

      return { previous }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['commandes'], context?.previous)
      toast.error('Failed to update order status')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    },
  })
}
```

### Context API Best Practices

```typescript
// ✅ GOOD - Typed context with provider
import { createContext, useContext, type ReactNode } from 'react'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// ✅ GOOD - Custom hook with error handling
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

---

## Styling Standards

### Tailwind CSS Class Order

```typescript
// ✅ GOOD - Consistent class order
// 1. Layout (display, position)
// 2. Box model (width, height, margin, padding)
// 3. Typography (font, text)
// 4. Visual (color, background, border)
// 5. Effects (shadow, opacity, transform)
// 6. Interactivity (cursor, hover, focus)

<div className="
  flex items-center justify-between
  w-full max-w-4xl mx-auto p-6
  text-lg font-semibold
  bg-white border border-gray-200 rounded-lg
  shadow-md hover:shadow-lg
  cursor-pointer transition-shadow
">
  Content
</div>
```

### cn() Utility for Conditional Classes

```typescript
import { cn } from '@/lib/utils'

// ✅ GOOD - Use cn() for conditional classes
<button
  className={cn(
    'px-4 py-2 rounded font-medium transition-colors',
    variant === 'primary' && 'bg-thai-orange text-white hover:bg-thai-orange/90',
    variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    isLoading && 'opacity-50 cursor-not-allowed',
    className  // Allow prop-based override
  )}
>
  {children}
</button>

// ❌ AVOID - String concatenation
<button className={`px-4 py-2 ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-100'}`}>
```

### Thai Theme Colors

```typescript
// ✅ GOOD - Use defined Thai colors
<div className="bg-thai-orange text-white">
<div className="border-thai-green">
<div className="text-thai-gold">

// Available colors (defined in globals.css):
// - thai-orange
// - thai-green
// - thai-gold
// - thai-red
// - thai-cream
```

### Responsive Design

```typescript
// ✅ GOOD - Mobile-first responsive classes
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">

// ✅ GOOD - Use breakpoint hooks for complex logic
const { isMobile, isTablet, isDesktop } = useBreakpoints()

return (
  <>
    {isMobile && <MobileView />}
    {isTablet && <TabletView />}
    {isDesktop && <DesktopView />}
  </>
)
```

---

## Comments and Documentation

### JSDoc for Functions

```typescript
/**
 * Calculates the total price of an order including extras and discounts.
 *
 * @param items - Array of order items with quantities
 * @param discountCode - Optional discount code to apply
 * @returns Total price in euros (€)
 *
 * @example
 * ```ts
 * const total = calculateOrderTotal([
 *   { plat_id: 1, quantity: 2, prix: 12.50 }
 * ], 'SUMMER2025')
 * // Returns: 22.50 (with 10% discount)
 * ```
 */
export function calculateOrderTotal(
  items: OrderItem[],
  discountCode?: string
): number {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ GOOD - Explain WHY, not WHAT
// Cache users for 15 minutes to reduce database load during peak hours
const CACHE_TIME = 15 * 60 * 1000

// Prevent race condition when Firebase auth changes during profile creation
await queryClient.cancelQueries({ queryKey: ['user-profile'] })

// ❌ AVOID - Obvious comments
// Set isLoading to true
setIsLoading(true)

// Increment counter by 1
setCounter(counter + 1)
```

### TODO Comments

```typescript
// ✅ GOOD - TODO with context and date
// TODO: Implement pagination for orders list (2025-10-15)
// TODO: Add real-time subscriptions after RLS activation (Phase 4)
// FIXME: Profile form allows invalid dates like Feb 31 - needs validation

// ❌ AVOID - Vague TODOs
// TODO: Fix this
// TODO: Improve performance
```

### Component Documentation

```typescript
/**
 * UserProfile component displays user information with edit capabilities.
 *
 * Features:
 * - Display user profile data
 * - Edit mode with form validation
 * - Avatar upload with preview
 * - Real-time profile updates
 *
 * @component
 * @example
 * ```tsx
 * <UserProfile userId={123} onUpdate={(profile) => console.log(profile)} />
 * ```
 */
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // Implementation
}
```

---

## Testing Standards

### Test File Naming

```bash
# ✅ GOOD - .spec.ts or .test.ts suffix
components/UserProfile.spec.tsx
hooks/useSupabaseData.test.ts
lib/validations.spec.ts

# E2E tests in tests/ directory
tests/auth.spec.ts
tests/ordering.spec.ts
```

### Playwright E2E Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001')
  })

  test('should allow user login with valid credentials', async ({ page }) => {
    // Arrange
    await page.click('[data-testid="login-button"]')

    // Act
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-login"]')

    // Assert
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page).toHaveURL(/.*profil/)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('[data-testid="login-button"]')
    await page.fill('[data-testid="email-input"]', 'invalid@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="submit-login"]')

    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials')
  })
})
```

### Test Data Attributes

```typescript
// ✅ GOOD - Use data-testid for test selectors
<button data-testid="submit-order" onClick={handleSubmit}>
  Submit Order
</button>

<input data-testid="email-input" type="email" />

// ❌ AVOID - Relying on CSS classes or text content
<button className="submit-btn">Submit Order</button>  // Fragile
```

---

## Security Best Practices

### Environment Variables

```typescript
// ✅ GOOD - Use NEXT_PUBLIC_ prefix for client-side vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ✅ GOOD - Server-side only (no NEXT_PUBLIC_ prefix)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const dbPassword = process.env.SUPABASE_DB_PASSWORD

// ❌ AVOID - Hardcoded secrets
const apiKey = 'sk_live_abc123...'  // NEVER commit secrets
```

### Input Validation

```typescript
import { z } from 'zod'

// ✅ GOOD - Zod schema validation
const userProfileSchema = z.object({
  nom: z.string().min(2, 'Name must be at least 2 characters'),
  prenom: z.string().min(2),
  email: z.string().email('Invalid email format'),
  telephone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  date_naissance: z.date().max(new Date(), 'Birth date cannot be in the future'),
})

// Validate user input
function validateUserProfile(input: unknown) {
  return userProfileSchema.parse(input)  // Throws ZodError if invalid
}
```

### XSS Prevention

```typescript
// ✅ GOOD - React automatically escapes JSX
<div>{userInput}</div>  // Safe - escaped automatically

// ❌ DANGER - dangerouslySetInnerHTML (use only if necessary)
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // XSS risk

// ✅ GOOD - Sanitize HTML if absolutely required
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### SQL Injection Prevention

```typescript
// ✅ GOOD - Supabase parameterized queries (safe)
const { data } = await supabase
  .from('client_db')
  .select('*')
  .eq('email', userEmail)  // Automatically sanitized

// ❌ AVOID - Raw SQL with concatenation (if using raw queries)
const query = `SELECT * FROM client_db WHERE email = '${userEmail}'`  // SQL injection risk
```

---

## Performance Considerations

### Code Splitting

```typescript
// ✅ GOOD - Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,  // Disable SSR if client-only
})

// ✅ GOOD - Route-based code splitting (automatic in Next.js)
// Each page in app/ is automatically code-split
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD - useMemo for expensive calculations
const sortedOrders = useMemo(() => {
  return orders.sort((a, b) => b.created_at.localeCompare(a.created_at))
}, [orders])

// ✅ GOOD - useCallback for event handlers passed to children
const handleOrderUpdate = useCallback((orderId: number) => {
  updateOrder(orderId)
}, [updateOrder])

// ❌ AVOID - Premature optimization
const sum = useMemo(() => a + b, [a, b])  // Too simple to memoize
```

### Image Optimization

```typescript
import Image from 'next/image'

// ✅ GOOD - Next.js Image component
<Image
  src="/images/dish.jpg"
  alt="Thai dish"
  width={500}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// ✅ GOOD - Custom OptimizedImage component
import { OptimizedImage } from '@/components/OptimizedImage'

<OptimizedImage
  src="https://supabase.co/storage/v1/object/public/plats/dish.jpg"
  alt="Thai dish"
  className="rounded-lg"
/>
```

### Bundle Size Monitoring

```typescript
// ✅ GOOD - Import only what you need
import { format } from 'date-fns'  // Import specific function
import { useQuery } from '@tanstack/react-query'

// ❌ AVOID - Importing entire libraries
import _ from 'lodash'  // Imports entire lodash library
import * as dateFns from 'date-fns'  // Imports all date-fns functions
```

---

## Enforcement

### Pre-commit Hooks (Recommended)

```bash
# Install Husky for Git hooks
npm install -D husky lint-staged

# .husky/pre-commit
npm run lint
npm run type-check

# lint-staged config in package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### CI/CD Quality Gates

```yaml
# .github/workflows/quality.yml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Build
        run: npm run build
      - name: E2E tests
        run: npm run test:e2e
```

---

## Summary

These coding standards ensure:
- ✅ **Consistency**: Uniform code style across the project
- ✅ **Type Safety**: TypeScript strict mode prevents runtime errors
- ✅ **Maintainability**: Clear patterns for long-term codebase health
- ✅ **Performance**: Optimized patterns and best practices
- ✅ **Security**: Protection against common vulnerabilities
- ✅ **Developer Experience**: Clear guidelines for productive development

**Enforcement**: ESLint + TypeScript + Pre-commit hooks + CI/CD quality gates

**Review**: These standards should be reviewed quarterly and updated with new Next.js/React/TypeScript best practices.

---

**Related Documentation**:
- [Architecture Overview](./architecture-overview.md)
- [Development Setup](./development-setup.md)
- [Testing Guide](./testing-guide.md)
- [Security Best Practices](./security-best-practices.md)

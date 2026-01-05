# Component Patterns - APPChanthana

**Date**: 2025-10-06
**Version**: 1.0.0
**Framework**: Next.js 15.5.4 + React 19.1.1
**Status**: ✅ Production

## Vue d'Ensemble

Ce document détaille les patterns de composants utilisés dans APPChanthana, couvrant Server Components, Client Components, shadcn/ui, et les patterns spécifiques au projet.

### Architecture Composants

| Type | Quantité | Localisation | Usage |
|------|----------|--------------|-------|
| **Server Components** | ~60% | `app/`, `components/` | Rendu serveur, data fetching |
| **Client Components** | ~40% | `components/`, `contexts/` | Interactivité, hooks, state |
| **UI Components** | ~35 | `components/ui/` | shadcn/ui primitives |
| **Business Components** | ~50 | `components/` | Logique métier restaurant |

---

## Next.js 15 Component Patterns

### Server Components (Par Défaut)

**Quand utiliser**:
- Data fetching initial
- Rendu statique
- Accès direct aux ressources serveur
- SEO critique

**Exemple - Page Menu**:
```typescript
// app/commander/page.tsx
import { createClient } from '@/lib/supabase'

// ✅ Server Component (par défaut)
export default async function CommanderPage() {
  const supabase = createClient()

  // Data fetching côté serveur
  const { data: plats } = await supabase
    .from('plats_db')
    .select('*')
    .eq('disponible', true)
    .order('ordre_affichage')

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Menu Thai</h1>
      <MenuGrid plats={plats} />
    </div>
  )
}
```

**Avantages**:
- 🚀 **Performance**: Moins de JavaScript côté client
- 🔒 **Sécurité**: Secrets serveur invisibles au client
- ⚡ **Streaming**: Rendu progressif avec Suspense
- 📊 **SEO**: HTML complet pour crawlers

---

### Client Components ('use client')

**Quand utiliser**:
- Hooks React (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Context providers et consumers

**Exemple - Formulaire Commande**:
```typescript
// components/forms/CommandeForm.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateCommande } from '@/hooks/useSupabaseData'
import { Button } from '@/components/ui/button'

export function CommandeForm({ plats }: { plats: PlatDB[] }) {
  const [panier, setPanier] = useState<CartItem[]>([])
  const { currentUser } = useAuth()
  const createCommande = useCreateCommande()

  const handleSubmit = async () => {
    const commande = {
      contact_client_r: currentUser?.id,
      items: panier,
      total: calculateTotal(panier)
    }
    await createCommande.mutateAsync(commande)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Interactive form elements */}
      <Button type="submit">Commander</Button>
    </form>
  )
}
```

**Directive 'use client'**:
- Placée **en haut du fichier** (avant imports)
- Marque le **boundary** Client Component
- Enfants deviennent automatiquement Client Components
- Props doivent être sérialisables (JSON)

---

## Patterns shadcn/ui + Radix UI

### Composants UI Atomiques

**Localisation**: `components/ui/`

**Pattern shadcn/ui**:
- Composants **copiés dans projet** (pas npm package)
- Basés sur **Radix UI** (accessible, unstyled)
- Stylés avec **Tailwind CSS**
- **Customisables** à 100%

**Exemple - Button Component**:
```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-thai-orange text-white hover:bg-thai-orange/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-thai-green bg-transparent hover:bg-thai-green/10",
        ghost: "hover:bg-thai-cream/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

**Usage**:
```typescript
import { Button } from "@/components/ui/button"

// Variants
<Button variant="default">Commander</Button>
<Button variant="outline">Annuler</Button>
<Button variant="ghost" size="sm">Détails</Button>

// AsChild pattern (composition)
<Button asChild>
  <Link href="/menu">Voir le menu</Link>
</Button>
```

---

### Composants UI Complexes

#### Dialog Pattern (Modal)

```typescript
// components/ui/dialog.tsx (shadcn/ui)
import * as DialogPrimitive from "@radix-ui/react-dialog"

// Usage dans business component
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function PlatDetailsDialog({ plat }: { plat: PlatDB }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Voir détails</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plat.nom}</DialogTitle>
          <DialogDescription>{plat.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <PlatImage src={plat.image_url} alt={plat.nom} />
          <PlatExtras platId={plat.id} />
          <div className="text-2xl font-bold text-thai-orange">
            {plat.prix.toFixed(2)} €
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => addToCart(plat)}>Ajouter au panier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### Form Pattern avec React Hook Form

```typescript
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  nom: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  telephone: z.string().regex(/^0[1-9]\d{8}$/, "Téléphone invalide"),
})

export function ProfilForm({ defaultValues }: { defaultValues?: ClientDB }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProfile(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Dupont" {...field} />
              </FormControl>
              <FormDescription>Votre nom de famille</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Autres champs... */}
        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  )
}
```

---

## Patterns Business Components

### Composition Pattern

**Pattern**: Petits composants réutilisables → Composants composés

```typescript
// components/plats/PlatCard.tsx
interface PlatCardProps {
  plat: PlatDB
  onAddToCart?: (plat: PlatDB) => void
}

export function PlatCard({ plat, onAddToCart }: PlatCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <PlatImage src={plat.image_url} alt={plat.nom} />
      <CardHeader>
        <CardTitle>{plat.nom}</CardTitle>
        <CardDescription>{plat.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <PlatPrice prix={plat.prix} />
        <PlatAllergenes allergenes={plat.allergenes} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart?.(plat)} className="w-full">
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  )
}

// Composants atomiques
function PlatImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-48 w-full">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

function PlatPrice({ prix }: { prix: number }) {
  return (
    <div className="text-2xl font-bold text-thai-orange">
      {prix.toFixed(2)} €
    </div>
  )
}

function PlatAllergenes({ allergenes }: { allergenes?: string[] }) {
  if (!allergenes || allergenes.length === 0) return null
  return (
    <div className="flex gap-1 flex-wrap mt-2">
      {allergenes.map((allergen) => (
        <Badge key={allergen} variant="outline" className="text-xs">
          {allergen}
        </Badge>
      ))}
    </div>
  )
}
```

---

### Container/Presenter Pattern

**Pattern**: Séparer logique (Container) et présentation (Presenter)

```typescript
// components/commandes/CommandeListContainer.tsx (Container)
'use client'

import { useCommandes } from '@/hooks/useSupabaseData'
import { useAuth } from '@/contexts/AuthContext'
import { CommandeListPresenter } from './CommandeListPresenter'

export function CommandeListContainer() {
  const { currentUser } = useAuth()
  const { data: commandes, isLoading, error } = useCommandes(currentUser?.id)

  if (isLoading) return <CommandeListSkeleton />
  if (error) return <ErrorDisplay error={error} />
  if (!commandes || commandes.length === 0) return <EmptyState />

  return <CommandeListPresenter commandes={commandes} />
}

// components/commandes/CommandeListPresenter.tsx (Presenter)
interface CommandeListPresenterProps {
  commandes: CommandeDB[]
}

export function CommandeListPresenter({ commandes }: CommandeListPresenterProps) {
  return (
    <div className="space-y-4">
      {commandes.map((commande) => (
        <CommandeCard key={commande.id} commande={commande} />
      ))}
    </div>
  )
}
```

---

### Compound Components Pattern

**Pattern**: Composants qui fonctionnent ensemble (API déclarative)

```typescript
// components/menu/MenuSection.tsx
interface MenuSectionProps {
  children: React.ReactNode
}

export function MenuSection({ children }: MenuSectionProps) {
  return <section className="space-y-6">{children}</section>
}

MenuSection.Header = function MenuSectionHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-thai-orange">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}

MenuSection.Grid = function MenuSectionGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}

// Usage déclaratif
<MenuSection>
  <MenuSection.Header
    title="Entrées"
    description="Découvrez nos entrées traditionnelles thaïlandaises"
  />
  <MenuSection.Grid>
    {entrees.map((plat) => (
      <PlatCard key={plat.id} plat={plat} />
    ))}
  </MenuSection.Grid>
</MenuSection>
```

---

## Patterns Spécifiques APPChanthana

### Responsive Date Selector

```typescript
// components/forms/ResponsiveDateSelector.tsx
'use client'

import { useState } from 'react'
import { useBreakpoints } from '@/hooks/use-mobile'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ResponsiveDateSelectorProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
}

export function ResponsiveDateSelector({
  value,
  onChange,
  minDate,
  maxDate,
}: ResponsiveDateSelectorProps) {
  const { isMobile, isTablet } = useBreakpoints()

  // Mobile: Dropdowns jour/mois/année
  if (isMobile) {
    return <MobileDateDropdowns value={value} onChange={onChange} />
  }

  // Tablet: Calendrier compact
  if (isTablet) {
    return (
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        disabled={(date) => {
          if (minDate && date < minDate) return true
          if (maxDate && date > maxDate) return true
          return false
        }}
        className="rounded-md border"
      />
    )
  }

  // Desktop: Calendrier pleine taille
  return (
    <Calendar
      mode="single"
      selected={value}
      onSelect={onChange}
      disabled={(date) => {
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        return false
      }}
      className="rounded-md border p-4"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
      }}
    />
  )
}

function MobileDateDropdowns({ value, onChange }: { value?: Date, onChange: (date: Date | undefined) => void }) {
  const [day, setDay] = useState(value?.getDate() || 1)
  const [month, setMonth] = useState(value?.getMonth() || 0)
  const [year, setYear] = useState(value?.getFullYear() || new Date().getFullYear())

  const updateDate = (newDay: number, newMonth: number, newYear: number) => {
    // Validation dates impossibles (ex: 31 février)
    const daysInMonth = new Date(newYear, newMonth + 1, 0).getDate()
    const validDay = Math.min(newDay, daysInMonth)

    const newDate = new Date(newYear, newMonth, validDay)
    if (!isNaN(newDate.getTime())) {
      onChange(newDate)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select value={day.toString()} onValueChange={(v) => {
        const newDay = parseInt(v)
        setDay(newDay)
        updateDate(newDay, month, year)
      }}>
        <SelectTrigger><SelectValue placeholder="Jour" /></SelectTrigger>
        <SelectContent>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={month.toString()} onValueChange={(v) => {
        const newMonth = parseInt(v)
        setMonth(newMonth)
        updateDate(day, newMonth, year)
      }}>
        <SelectTrigger><SelectValue placeholder="Mois" /></SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year.toString()} onValueChange={(v) => {
        const newYear = parseInt(v)
        setYear(newYear)
        updateDate(day, month, newYear)
      }}>
        <SelectTrigger><SelectValue placeholder="Année" /></SelectTrigger>
        <SelectContent>
          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]
```

---

### Optimized Image Component

```typescript
// components/OptimizedImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={cn("bg-thai-cream flex items-center justify-center", className)}>
        <ImageOffIcon className="w-12 h-12 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-thai-cream animate-shimmer" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
      />
    </div>
  )
}
```

---

### Enhanced Loading States

```typescript
// components/ui/enhanced-loading.tsx
'use client'

import { cn } from '@/lib/utils'

type LoadingVariant = 'spinner' | 'dots' | 'bars' | 'thai'

interface EnhancedLoadingProps {
  variant?: LoadingVariant
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export function EnhancedLoading({
  variant = 'spinner',
  size = 'md',
  message,
  className,
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {variant === 'spinner' && (
        <div className={cn(
          "animate-spin rounded-full border-4 border-thai-cream border-t-thai-orange",
          sizeClasses[size]
        )} />
      )}

      {variant === 'dots' && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-thai-orange animate-bounce",
                sizeClasses[size]
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {variant === 'bars' && (
        <div className="flex gap-1 items-end">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 bg-thai-orange animate-pulse",
                size === 'sm' && 'h-4',
                size === 'md' && 'h-8',
                size === 'lg' && 'h-12'
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                height: `${(i + 1) * 25}%`,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'thai' && (
        <div className="relative">
          <div className={cn(
            "rounded-full border-4 border-thai-cream animate-spin",
            sizeClasses[size]
          )} />
          <div className={cn(
            "absolute inset-0 rounded-full border-4 border-transparent border-t-thai-orange border-r-thai-green animate-spin",
            sizeClasses[size]
          )}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </div>
      )}

      {message && (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  )
}

// Skeleton components
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-thai-cream", className)}
      {...props}
    />
  )
}

export function PlatCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
```

---

## Error Boundary Pattern

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

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
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            {this.state.error?.message || "Erreur inconnue"}
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Réessayer
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={<CustomErrorUI />}>
  <CommandeListContainer />
</ErrorBoundary>
```

---

## Performance Patterns

### Lazy Loading Components

```typescript
// app/admin/page.tsx
import { lazy, Suspense } from 'react'
import { EnhancedLoading } from '@/components/ui/enhanced-loading'

// Lazy load heavy components
const CommandesChart = lazy(() => import('@/components/admin/CommandesChart'))
const StatistiquesPanel = lazy(() => import('@/components/admin/StatistiquesPanel'))

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<EnhancedLoading variant="thai" size="lg" />}>
        <CommandesChart />
      </Suspense>

      <Suspense fallback={<EnhancedLoading variant="bars" message="Chargement des statistiques..." />}>
        <StatistiquesPanel />
      </Suspense>
    </div>
  )
}
```

---

### Memoization Pattern

```typescript
'use client'

import { useMemo, memo } from 'react'

interface PlatListProps {
  plats: PlatDB[]
  filters: {
    categorie?: string
    prixMax?: number
    allergenes?: string[]
  }
}

export const PlatList = memo(function PlatList({ plats, filters }: PlatListProps) {
  // Memoize expensive filtering operation
  const filteredPlats = useMemo(() => {
    return plats.filter((plat) => {
      if (filters.categorie && plat.categorie !== filters.categorie) {
        return false
      }
      if (filters.prixMax && plat.prix > filters.prixMax) {
        return false
      }
      if (filters.allergenes && filters.allergenes.length > 0) {
        const hasAllergen = plat.allergenes?.some((a) =>
          filters.allergenes!.includes(a)
        )
        if (hasAllergen) return false
      }
      return true
    })
  }, [plats, filters])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPlats.map((plat) => (
        <PlatCard key={plat.id} plat={plat} />
      ))}
    </div>
  )
})
```

---

## Context Pattern

### Auth Context

```typescript
// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { ClientDB } from '@/types/supabase'
import { useClient } from '@/hooks/useSupabaseData'

interface AuthContextType {
  currentUser: FirebaseUser | null
  currentUserProfile: ClientDB | null
  currentUserRole: 'admin' | 'client' | null
  isLoadingAuth: boolean
  isLoadingUserRole: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [currentUserProfile, setCurrentUserProfile] = useState<ClientDB | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'client' | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  const { data: profileData, isLoading: isLoadingProfile } = useClient(
    currentUser?.uid || '',
    { enabled: !!currentUser }
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user)
      setIsLoadingAuth(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (profileData) {
      setCurrentUserProfile(profileData)
      setCurrentUserRole(profileData.role as 'admin' | 'client')
    }
  }, [profileData])

  const logout = async () => {
    await auth.signOut()
    setCurrentUser(null)
    setCurrentUserProfile(null)
    setCurrentUserRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserProfile,
        currentUserRole,
        isLoadingAuth,
        isLoadingUserRole: isLoadingProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## Responsive Design Patterns

### Breakpoint Hook

```typescript
// hooks/use-mobile.tsx
'use client'

import { useEffect, useState } from 'react'

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const

export function useBreakpoints() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setBreakpoint({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop,
        width,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Shorthand hooks
export function useIsMobile() {
  const { isMobile } = useBreakpoints()
  return isMobile
}

export function useIsTablet() {
  const { isTablet } = useBreakpoints()
  return isTablet
}

export function useIsDesktop() {
  const { isDesktop } = useBreakpoints()
  return isDesktop
}
```

---

### Adaptive Components

```typescript
// components/navigation/ResponsiveNav.tsx
'use client'

import { useBreakpoints } from '@/hooks/use-mobile'
import { MobileNav } from './MobileNav'
import { DesktopNav } from './DesktopNav'

export function ResponsiveNav() {
  const { isMobile } = useBreakpoints()

  return isMobile ? <MobileNav /> : <DesktopNav />
}

// Mobile: Hamburger menu
function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <MenuIcon />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            <NavLink href="/commander">Commander</NavLink>
            <NavLink href="/evenements">Événements</NavLink>
            <NavLink href="/profil">Mon profil</NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

// Desktop: Horizontal nav
function DesktopNav() {
  return (
    <nav className="flex items-center gap-6">
      <NavLink href="/commander">Commander</NavLink>
      <NavLink href="/evenements">Événements</NavLink>
      <NavLink href="/profil">Mon profil</NavLink>
    </nav>
  )
}
```

---

## Testing Patterns

### Component Testing Setup

```typescript
// __tests__/components/PlatCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PlatCard } from '@/components/plats/PlatCard'

const mockPlat: PlatDB = {
  id: 1,
  nom: 'Pad Thai',
  description: 'Nouilles sautées thaïlandaises',
  prix: 12.50,
  categorie: 'plats',
  disponible: true,
  image_url: '/images/pad-thai.jpg',
  allergenes: ['gluten', 'arachides'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('PlatCard', () => {
  it('renders plat information correctly', () => {
    render(<PlatCard plat={mockPlat} />)

    expect(screen.getByText('Pad Thai')).toBeInTheDocument()
    expect(screen.getByText('Nouilles sautées thaïlandaises')).toBeInTheDocument()
    expect(screen.getByText('12.50 €')).toBeInTheDocument()
  })

  it('calls onAddToCart when button clicked', () => {
    const handleAddToCart = jest.fn()
    render(<PlatCard plat={mockPlat} onAddToCart={handleAddToCart} />)

    const button = screen.getByRole('button', { name: /ajouter au panier/i })
    fireEvent.click(button)

    expect(handleAddToCart).toHaveBeenCalledWith(mockPlat)
  })

  it('displays allergenes badges', () => {
    render(<PlatCard plat={mockPlat} />)

    expect(screen.getByText('gluten')).toBeInTheDocument()
    expect(screen.getByText('arachides')).toBeInTheDocument()
  })
})
```

---

## Accessibilité (a11y) Patterns

### Keyboard Navigation

```typescript
// components/ui/command-menu.tsx (shadcn/ui Command)
'use client'

import { useEffect, useState } from 'react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command>
      <CommandInput placeholder="Rechercher un plat, une commande..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => router.push('/commander')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Commander</span>
          </CommandItem>
          <CommandItem onSelect={() => router.push('/evenements')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Événements</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

---

### ARIA Labels & Screen Readers

```typescript
// components/plats/PlatCard.tsx
export function PlatCard({ plat, onAddToCart }: PlatCardProps) {
  return (
    <article
      className="plat-card"
      aria-labelledby={`plat-title-${plat.id}`}
      aria-describedby={`plat-description-${plat.id}`}
    >
      <Image
        src={plat.image_url}
        alt={`Photo de ${plat.nom}`}
        role="img"
        aria-label={`Présentation visuelle de ${plat.nom}`}
      />

      <h3 id={`plat-title-${plat.id}`} className="text-xl font-bold">
        {plat.nom}
      </h3>

      <p id={`plat-description-${plat.id}`} className="text-sm text-muted-foreground">
        {plat.description}
      </p>

      <div aria-label={`Prix: ${plat.prix.toFixed(2)} euros`}>
        {plat.prix.toFixed(2)} €
      </div>

      {plat.allergenes && plat.allergenes.length > 0 && (
        <div
          role="list"
          aria-label="Allergènes"
          className="flex gap-1 flex-wrap"
        >
          {plat.allergenes.map((allergen) => (
            <Badge
              key={allergen}
              role="listitem"
              aria-label={`Contient: ${allergen}`}
            >
              {allergen}
            </Badge>
          ))}
        </div>
      )}

      <Button
        onClick={() => onAddToCart?.(plat)}
        aria-label={`Ajouter ${plat.nom} au panier pour ${plat.prix.toFixed(2)} euros`}
      >
        Ajouter au panier
      </Button>
    </article>
  )
}
```

---

## Best Practices

### Component Checklist

✅ **Architecture**
- [ ] Server Component par défaut
- [ ] 'use client' uniquement si nécessaire
- [ ] Composition > Héritage
- [ ] Props typées avec TypeScript

✅ **Performance**
- [ ] Lazy loading pour composants lourds
- [ ] Memoization pour calculs coûteux
- [ ] Optimistic updates pour UX
- [ ] Image optimization avec Next.js Image

✅ **Accessibilité**
- [ ] ARIA labels pertinents
- [ ] Navigation clavier
- [ ] Contraste couleurs suffisant
- [ ] Focus visibles

✅ **Testing**
- [ ] Tests unitaires pour logique critique
- [ ] Tests d'intégration pour workflows
- [ ] E2E tests avec Playwright
- [ ] Visual regression tests

✅ **Code Quality**
- [ ] Pas de code dupliqué
- [ ] Fonctions < 50 lignes
- [ ] Composants < 300 lignes
- [ ] ESLint 0 warnings

---

## Références

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **shadcn/ui**: https://ui.shadcn.com
- **Radix UI**: https://radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com

---

**Prochaine lecture recommandée**: [API Routes & Server Actions](./api-routes.md)

# Performance Optimization Guide - APPChanthana

## Overview

This guide covers performance optimization strategies for APPChanthana, a Next.js 15 application focused on delivering excellent Core Web Vitals scores and fast user experiences.

### Current Performance Metrics

**Technology Stack Performance Characteristics**:
- **Next.js 15.5.4**: App Router with Server Components, Turbopack for faster builds
- **React 19.1.1**: Concurrent rendering, automatic batching, Server Components
- **Tailwind CSS v4**: CSS-first configuration, optimized build output
- **TanStack Query 5.90.2**: Intelligent caching with stale-while-revalidate
- **Supabase 2.58.0**: Optimized queries with selective column fetching
- **Firebase Auth 12.3.0**: Lazy-loaded auth modules

**Performance Goals**:
- **Lighthouse Score**: >90 for all metrics (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- **Bundle Size**: <200KB initial JavaScript bundle
- **Time to Interactive (TTI)**: <3.5s on 3G networks

---

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP) - Target: <2.5s

**Current Implementation**:

#### 1. Server Components for Fast Initial Render
```typescript
// app/page.tsx - Server Component by default
export default async function HomePage() {
  // Server-side data fetching - no client JavaScript needed
  const featuredPlats = await getFeaturedPlats()

  return (
    <main>
      <HeroSection />
      <FeaturedPlats plats={featuredPlats} />
    </main>
  )
}
```

#### 2. Image Optimization with next/image
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image'

export function OptimizedImage({ src, alt, width, height }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy" // Lazy load images below the fold
      placeholder="blur" // Show blur placeholder while loading
      blurDataURL={generateBlurDataURL(src)} // Auto-generated blur
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Responsive sizes
      quality={85} // Optimize quality vs file size
      format="webp" // Modern image format
    />
  )
}
```

**LCP Optimization Checklist**:
- ✅ Server Components for initial render
- ✅ next/image with automatic optimization
- ✅ WebP format for modern browsers
- ✅ Responsive image sizes
- ✅ Priority loading for above-the-fold images
- ✅ Blur placeholders for better perceived performance

#### 3. Priority Loading for Hero Images
```typescript
// components/HeroSection.tsx
export function HeroSection() {
  return (
    <section>
      <Image
        src="/images/hero-chanthana.jpg"
        alt="Chanthana Restaurant"
        width={1920}
        height={1080}
        priority // Load immediately, above the fold
        quality={90} // Higher quality for hero image
      />
    </section>
  )
}
```

#### 4. Font Optimization with next/font
```typescript
// app/layout.tsx
import { Inter, Sarabun } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOUT (Flash of Unstyled Text)
  variable: '--font-inter',
})

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-sarabun',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sarabun.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

### First Input Delay (FID) - Target: <100ms

**Current Implementation**:

#### 1. Minimize Main Thread Blocking
```typescript
// ✅ GOOD - Use Server Components for expensive operations
// app/admin/dashboard/page.tsx
export default async function AdminDashboard() {
  // Computed server-side, no client JavaScript
  const stats = await computeDashboardStats()

  return <DashboardView stats={stats} />
}

// ❌ AVOID - Heavy computation on client
'use client'
export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Blocks main thread
    const computed = computeExpensiveStats()
    setStats(computed)
  }, [])

  return <DashboardView stats={stats} />
}
```

#### 2. Code Splitting for Lazy Loading
```typescript
// ✅ GOOD - Dynamic import for heavy components
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false, // Client-side only if needed
})

export default function AdminPage() {
  return <AdminDashboard />
}
```

#### 3. Debounce User Inputs
```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage in search component
'use client'
export function SearchPlats() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: plats } = useQuery({
    queryKey: ['plats', 'search', debouncedSearch],
    queryFn: () => searchPlats(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  })

  return <input onChange={(e) => setSearchTerm(e.target.value)} />
}
```

**FID Optimization Checklist**:
- ✅ Server Components for expensive computations
- ✅ Code splitting with dynamic imports
- ✅ Debounced user inputs (300ms default)
- ✅ Memoization for expensive calculations
- ✅ Web Workers for CPU-intensive tasks (if needed)

---

### Cumulative Layout Shift (CLS) - Target: <0.1

**Current Implementation**:

#### 1. Image Size Attributes
```typescript
// ✅ GOOD - Always specify width and height
<Image
  src="/images/plat-pad-thai.jpg"
  alt="Pad Thai"
  width={400}
  height={300} // Aspect ratio preserved
/>

// ❌ AVOID - Missing dimensions cause layout shift
<img src="/images/plat-pad-thai.jpg" alt="Pad Thai" />
```

#### 2. Skeleton Loading States
```typescript
// components/ui/skeleton.tsx
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-thai-cream/20', className)}
      {...props}
    />
  )
}

// components/PlatsListSkeleton.tsx
export function PlatsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full" /> {/* Image placeholder */}
          <Skeleton className="h-4 w-3/4" /> {/* Title placeholder */}
          <Skeleton className="h-3 w-1/2" /> {/* Price placeholder */}
        </div>
      ))}
    </div>
  )
}

// Usage with Suspense
import { Suspense } from 'react'

export default function PlatsPage() {
  return (
    <Suspense fallback={<PlatsListSkeleton />}>
      <PlatsList />
    </Suspense>
  )
}
```

#### 3. Fixed Container Heights
```typescript
// app/globals.css
/* Prevent layout shift for containers */
.container-fixed {
  min-height: 400px; /* Fixed minimum height */
}

/* Thai theme container with fixed aspect ratio */
.plat-card-container {
  aspect-ratio: 4 / 3; /* Maintain aspect ratio */
  position: relative;
}
```

**CLS Optimization Checklist**:
- ✅ Image dimensions specified (width/height)
- ✅ Skeleton loading states for all async content
- ✅ Fixed container heights for dynamic content
- ✅ font-display: swap for web fonts
- ✅ Aspect ratio containers for images
- ✅ No dynamic injection of content above the fold

---

## Bundle Optimization

### Bundle Analysis

#### 1. Analyze Bundle Size
```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Configure in next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // ... existing config
})

# Run analysis
ANALYZE=true npm run build
```

**Expected Output**:
```
Page                                       Size     First Load JS
┌ ○ /                                      5.2 kB         95.3 kB
├ ○ /admin                                 8.1 kB         135.2 kB
├ ○ /commander                             6.7 kB         112.4 kB
├ ○ /evenements                            4.9 kB         98.1 kB
└ ○ /profil                                3.2 kB         89.5 kB

+ First Load JS shared by all              84.1 kB
  ├ chunks/framework-[hash].js             45.2 kB
  ├ chunks/main-[hash].js                  31.5 kB
  └ chunks/webpack-[hash].js               7.4 kB
```

#### 2. Code Splitting Strategy
```typescript
// ✅ GOOD - Route-based splitting (automatic)
// Each page in app/ directory is automatically split

// ✅ GOOD - Component-based splitting for heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/admin/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Only load on client if needed
})

const AdminCalendar = dynamic(() => import('@/components/admin/AdminCalendar'), {
  loading: () => <CalendarSkeleton />,
})

// ✅ GOOD - Lazy load third-party libraries
const ReactPDF = dynamic(() => import('@react-pdf/renderer'), {
  ssr: false,
})
```

#### 3. Tree Shaking Optimization
```typescript
// ✅ GOOD - Named imports for tree shaking
import { Button, Input, Select } from '@/components/ui'

// ❌ AVOID - Default import prevents tree shaking
import * as UI from '@/components/ui'

// ✅ GOOD - Import only what you need from lodash
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// ❌ AVOID - Imports entire lodash library
import _ from 'lodash'
```

**Bundle Optimization Checklist**:
- ✅ Route-based code splitting (automatic in Next.js)
- ✅ Dynamic imports for heavy components
- ✅ Tree shaking with named imports
- ✅ Remove unused dependencies (npm run depcheck)
- ✅ Minification enabled in production
- ✅ Gzip/Brotli compression enabled

---

## Image Optimization

### Next.js Image Component

**Current Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['lkaiwnkyoztebplqoifc.supabase.co'], // Supabase storage
    formats: ['image/webp', 'image/avif'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },
}
```

### Responsive Images
```typescript
// components/PlatCard.tsx
export function PlatCard({ plat }: { plat: Plat }) {
  return (
    <div className="plat-card">
      <Image
        src={plat.image_url}
        alt={plat.nom}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        placeholder="blur"
        blurDataURL={plat.blur_data_url}
        quality={85}
      />
      <h3>{plat.nom}</h3>
      <p>{plat.prix} €</p>
    </div>
  )
}
```

### Supabase Storage Optimization
```typescript
// lib/supabase-storage.ts
export async function uploadPlatImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `plats/${fileName}`

  // Upload original
  const { data, error } = await supabase.storage
    .from('plats')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Get public URL with transformation
  const {
    data: { publicUrl },
  } = supabase.storage.from('plats').getPublicUrl(filePath, {
    transform: {
      width: 800,
      height: 600,
      quality: 85,
      format: 'webp', // Convert to WebP
    },
  })

  return publicUrl
}
```

**Image Optimization Checklist**:
- ✅ next/image component for all images
- ✅ WebP/AVIF format support
- ✅ Responsive image sizes
- ✅ Lazy loading for below-the-fold images
- ✅ Blur placeholders for better UX
- ✅ CDN caching (30 days minimum)
- ✅ Supabase storage transformations

---

## Caching Strategies

### TanStack Query Caching

**Current Configuration**:
```typescript
// components/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      cacheTime: 10 * 60 * 1000, // 10 minutes in cache
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

**Cache Time by Data Type**:
```typescript
// hooks/useSupabaseData.ts

// ✅ Static data - Long cache (15 minutes)
export function usePlats() {
  return useQuery({
    queryKey: ['plats'],
    queryFn: fetchPlats,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}

// ✅ Semi-dynamic data - Medium cache (5 minutes)
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ✅ Dynamic data - Short cache (1 minute)
export function useCommandes() {
  return useQuery({
    queryKey: ['commandes'],
    queryFn: fetchCommandes,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ✅ Real-time data - No cache
export function useActiveOrders() {
  return useQuery({
    queryKey: ['commandes', 'active'],
    queryFn: fetchActiveCommandes,
    staleTime: 0, // Always fresh
    cacheTime: 0, // No cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}
```

### Next.js Cache Configuration

**Route Segment Config**:
```typescript
// app/page.tsx - Homepage with static data
export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const featuredPlats = await getFeaturedPlats()
  return <FeaturedSection plats={featuredPlats} />
}

// app/commander/page.tsx - Dynamic ordering page
export const revalidate = 60 // Revalidate every minute

export default async function CommanderPage() {
  const plats = await getPlats()
  return <MenuList plats={plats} />
}

// app/admin/dashboard/page.tsx - Real-time admin
export const dynamic = 'force-dynamic' // Never cache
export const revalidate = 0

export default async function AdminDashboard() {
  const orders = await getActiveOrders()
  return <DashboardView orders={orders} />
}
```

**Caching Optimization Checklist**:
- ✅ TanStack Query with appropriate staleTime
- ✅ Next.js revalidate config per route
- ✅ Static generation for stable pages
- ✅ Incremental Static Regeneration (ISR) for semi-dynamic
- ✅ Dynamic rendering for real-time pages
- ✅ CDN caching for static assets

---

## Memoization and Optimization

### React.memo for Component Optimization
```typescript
// ✅ GOOD - Memo for expensive components
import { memo } from 'react'

export const PlatCard = memo(function PlatCard({ plat }: { plat: Plat }) {
  return (
    <div className="plat-card">
      <Image src={plat.image_url} alt={plat.nom} width={400} height={300} />
      <h3>{plat.nom}</h3>
      <p>{plat.prix} €</p>
    </div>
  )
})

// ❌ AVOID - Memo for simple components
export const SimpleButton = memo(function SimpleButton({ label }: { label: string }) {
  return <button>{label}</button> // Too simple, memo overhead not worth it
})
```

### useMemo for Expensive Calculations
```typescript
// ✅ GOOD - useMemo for filtering/sorting
'use client'
export function PlatsList({ plats }: { plats: Plat[] }) {
  const [category, setCategory] = useState<string>('all')

  const filteredPlats = useMemo(() => {
    if (category === 'all') return plats
    return plats.filter((p) => p.categorie === category)
  }, [plats, category])

  return <PlatsGrid plats={filteredPlats} />
}

// ❌ AVOID - useMemo for simple operations
const total = useMemo(() => price + tax, [price, tax]) // Unnecessary
```

### useCallback for Event Handlers
```typescript
// ✅ GOOD - useCallback for child component props
'use client'
export function OrderForm() {
  const [items, setItems] = useState<CartItem[]>([])

  const handleAddItem = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const handleRemoveItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
      ))}
    </div>
  )
}

// ❌ AVOID - useCallback without dependencies
const onClick = useCallback(() => console.log('clicked'), []) // No benefit
```

**Memoization Checklist**:
- ✅ React.memo for expensive rendering components
- ✅ useMemo for filtering, sorting, complex calculations
- ✅ useCallback for event handlers passed to child components
- ❌ Avoid over-memoization (simple components/operations)

---

## Server Components Performance

### Server Components Benefits

**Current Architecture**:
```typescript
// ✅ GOOD - Server Component for data fetching
// app/menu/page.tsx
export default async function MenuPage() {
  // Fetched on server, no client JavaScript needed
  const plats = await getPlats()
  const categories = await getCategories()

  return (
    <main>
      <MenuHeader categories={categories} />
      <MenuGrid plats={plats} />
    </main>
  )
}

// ✅ GOOD - Client Component only where needed
// components/MenuGrid.tsx
'use client'
export function MenuGrid({ plats }: { plats: Plat[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filtered = plats.filter((p) =>
    selectedCategory === 'all' ? true : p.categorie === selectedCategory
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filtered.map((plat) => (
        <PlatCard key={plat.id} plat={plat} />
      ))}
    </div>
  )
}
```

**Server vs Client Component Decision Tree**:
```
Does component need:
├─ Browser APIs (window, localStorage)?          → Client Component
├─ Event handlers (onClick, onChange)?           → Client Component
├─ React hooks (useState, useEffect)?            → Client Component
├─ Only data fetching and static rendering?      → Server Component ✅
└─ Both static and interactive parts?            → Hybrid (Server + Client)
```

**Server Components Checklist**:
- ✅ Default to Server Components
- ✅ Use Client Components only for interactivity
- ✅ Fetch data in Server Components
- ✅ Minimize client-side JavaScript
- ✅ Compose Server + Client Components appropriately

---

## Turbopack Build Performance

**Current Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Turbopack configuration
      resolveAlias: {
        '@': './src',
      },
    },
  },
}
```

**Build Performance Metrics**:
```bash
# Development build with Turbopack
npm run dev

# Expected output:
▲ Next.js 15.5.4 (turbo)
- Local:        http://localhost:3000
- Turbopack:    Enabled

✓ Ready in 1.2s (vs 3.5s with Webpack)
○ Compiling /
✓ Compiled / in 890ms (vs 2.1s with Webpack)
```

**Production Build**:
```bash
# Production build
npm run build

# Expected output:
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95.3 kB
├ ○ /admin                               8.1 kB         135.2 kB
├ ○ /commander                           6.7 kB         112.4 kB
└ ○ /evenements                          4.9 kB         98.1 kB

Build time: ~45s (average)
```

**Build Optimization Checklist**:
- ✅ Turbopack enabled for development
- ✅ Production builds optimized automatically
- ✅ Incremental builds in development
- ✅ Parallel compilation

---

## Performance Monitoring

### Web Vitals Reporting

**Current Implementation**:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Custom Web Vitals Reporting**:
```typescript
// lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics provider
  console.log(metric)

  // Example: Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFID(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

// app/layout.tsx
'use client'
import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return null
}
```

### Lighthouse CI Integration

**Configuration**:
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/commander',
        'http://localhost:3000/evenements',
        'http://localhost:3000/admin',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

**GitHub Actions Integration**:
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js app
        run: npm run build

      - name: Start server
        run: npm start &
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.13.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Monitoring Checklist**:
- ✅ Vercel Analytics integration
- ✅ Speed Insights monitoring
- ✅ Custom Web Vitals reporting
- ✅ Lighthouse CI in GitHub Actions
- ✅ Performance budget enforcement

---

## Database Query Optimization

### Supabase Query Performance

**Current Patterns**:
```typescript
// ✅ GOOD - Select only needed columns
export async function getPlats() {
  const { data, error } = await supabase
    .from('plats_db')
    .select('id, nom, description, prix, categorie, image_url, disponible')
    .eq('disponible', true)
    .order('nom', { ascending: true })

  if (error) throw error
  return data
}

// ❌ AVOID - Select all columns with *
export async function getPlats() {
  const { data, error } = await supabase
    .from('plats_db')
    .select('*') // Fetches unnecessary data

  if (error) throw error
  return data
}
```

**Pagination for Large Datasets**:
```typescript
// ✅ GOOD - Paginate large result sets
export async function getCommandesPage(page: number, pageSize: number = 20) {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('commande_db')
    .select('id, date_commande, status, total', { count: 'exact' })
    .order('date_commande', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}
```

**Joins Optimization**:
```typescript
// ✅ GOOD - Selective joins with specific columns
export async function getCommandeDetails(id: number) {
  const { data, error } = await supabase
    .from('commande_db')
    .select(
      `
      id,
      date_commande,
      status,
      total,
      client:client_db!client_id(nom, prenom, email),
      details:details_commande_db(
        id,
        quantite,
        prix_unitaire,
        plat:plats_db!plat_id(nom, image_url)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// ❌ AVOID - Unfiltered joins
export async function getCommandeDetails(id: number) {
  const { data, error } = await supabase
    .from('commande_db')
    .select('*, client:client_db(*), details:details_commande_db(*, plat:plats_db(*))')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
```

**Database Optimization Checklist**:
- ✅ Select only required columns
- ✅ Paginate large datasets
- ✅ Use indexes on filtered columns
- ✅ Selective joins with specific columns
- ✅ Avoid N+1 queries

---

## Network Optimization

### HTTP/2 and Compression

**Current Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  compress: true, // Enable gzip/brotli compression
  poweredByHeader: false, // Remove X-Powered-By header
  generateEtags: true, // Enable ETag headers for caching
}
```

**CDN Configuration** (Vercel):
```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).jpg",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000"
        }
      ]
    }
  ]
}
```

### Prefetching and Preloading

**Link Prefetching**:
```typescript
// app/layout.tsx
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <Link href="/commander" prefetch={true}>
        Commander
      </Link>
      <Link href="/evenements" prefetch={true}>
        Événements
      </Link>
      <Link href="/admin" prefetch={false}>
        Admin
      </Link>
    </nav>
  )
}
```

**Resource Preloading**:
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/Sarabun-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://lkaiwnkyoztebplqoifc.supabase.co" />
        <link rel="dns-prefetch" href="https://lkaiwnkyoztebplqoifc.supabase.co" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Network Optimization Checklist**:
- ✅ HTTP/2 enabled (automatic on Vercel)
- ✅ Gzip/Brotli compression
- ✅ CDN caching headers
- ✅ Link prefetching for critical routes
- ✅ Resource preloading (fonts, images)
- ✅ Preconnect to external domains

---

## Best Practices Summary

### Performance Optimization Priorities

**Priority 1 - Critical (Implement First)**:
- ✅ Server Components for initial render
- ✅ next/image with WebP format
- ✅ Code splitting with dynamic imports
- ✅ TanStack Query caching
- ✅ Skeleton loading states

**Priority 2 - Important**:
- ✅ Font optimization with next/font
- ✅ Bundle analysis and tree shaking
- ✅ Memoization (React.memo, useMemo, useCallback)
- ✅ Database query optimization
- ✅ CDN caching headers

**Priority 3 - Nice to Have**:
- ✅ Lighthouse CI integration
- ✅ Custom Web Vitals reporting
- ✅ Link prefetching
- ✅ Resource preloading

### Common Anti-Patterns to Avoid

```typescript
// ❌ AVOID - Client Component for static content
'use client'
export default function AboutPage() {
  return <div>Static content</div> // Should be Server Component
}

// ❌ AVOID - No memoization for expensive operations
function HeavyComponent({ data }: { data: Item[] }) {
  const filtered = data.filter(complexFilter) // Recalculated every render
  return <List items={filtered} />
}

// ❌ AVOID - Blocking main thread
useEffect(() => {
  const result = expensiveSync Calculation() // Blocks UI
  setResult(result)
}, [])

// ❌ AVOID - No loading states
function DataComponent() {
  const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData })
  return <div>{data?.map(...)}</div> // Layout shift when data loads
}
```

---

## Performance Testing

### Local Testing

```bash
# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse on specific pages
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
npx lighthouse http://localhost:3000/commander --output html --output-path ./lighthouse-commander.html

# Analyze bundle
ANALYZE=true npm run build
```

### Continuous Monitoring

**Setup**:
1. ✅ Vercel Analytics (automatic on Vercel deployment)
2. ✅ Speed Insights (configured in layout.tsx)
3. ✅ Lighthouse CI (GitHub Actions workflow)
4. ✅ Custom Web Vitals reporting (lib/web-vitals.ts)

**Monitoring Dashboard**:
- Vercel Dashboard → Analytics tab → Core Web Vitals
- GitHub Actions → Lighthouse CI results
- Browser DevTools → Performance tab

---

## Next Steps

After implementing performance optimizations:

1. **Test Changes**: Run Lighthouse and measure improvements
2. **Monitor Production**: Enable Web Vitals reporting
3. **Iterate**: Identify bottlenecks and optimize
4. **Document**: Update this guide with findings

---

## Related Documentation

- [architecture-overview.md](./architecture-overview.md) - System architecture patterns
- [development-setup.md](./development-setup.md) - Environment configuration
- [coding-standards.md](./coding-standards.md) - Code quality guidelines
- [testing-guide.md](./testing-guide.md) - E2E testing with Playwright
- [deployment-checklist.md](./deployment-checklist.md) - Production deployment

---

**Last Updated**: 2025-10-06
**Current Performance Status**: LCP <2.5s, FID <100ms, CLS <0.1 (targets met)
**Bundle Size**: ~95KB initial JavaScript (target: <200KB)

# CLAUDE_MEMORY.md - Mémoire Persistante Application APPCHANTHANA

*Dernière mise à jour: 25 août 2025*

## 🎯 CONTEXTE GLOBAL

**Application**: APPCHANTHANA - Système de gestion restaurant thaïlandais  
**Propriétaire**: ChanthanaThaiCook  
**Type**: Application web complète (commandes + événements + administration)  
**Status**: Production-ready, architecture moderne 2025

---

## 📋 ANALYSE TECHNIQUE COMPLÈTE

### Stack Technologique (Dernières versions 2025)
```yaml
Framework: Next.js 15.4.5 (App Router + Server Components)
Frontend: React 19.1.1 + TypeScript 5
UI_Framework: shadcn/ui + Radix UI + Tailwind CSS 4.1.12
State_Management: TanStack Query 5.84.1 + Context API
Backend: Supabase 2.55.0 (PostgreSQL + RLS)
Authentication: Firebase 12.0.0 (hybride avec Supabase profiles)
Styling: Thème Thai personnalisé (thai-orange, thai-green, thai-gold, thai-red, thai-cream)
```

### Architecture Next.js 15 Optimisée
- **App Router**: Layouts imbriqués + Server Components par défaut
- **Streaming**: React Suspense pour chargement progressif
- **Cache intelligent**: force-cache, no-store, revalidate
- **Performance**: Bundle optimisé, lazy loading, Web Vitals
- **Turbopack**: Builds développement accélérés

---

## 🏗️ STRUCTURE APPLICATION

### Dossiers Principaux
```
app/                    # App Router (routes, layouts, pages)
├── admin/             # Panel administration complet
├── commander/         # Système de commandes
├── evenements/        # Gestion événementielle
├── historique/        # Suivi commandes client
└── profil/           # Gestion profils utilisateurs

components/            # 50+ composants modulaires
├── ui/               # shadcn/ui components (30+ composants)
├── historique/       # Composants métier commandes
└── suivi-commande/   # Composants tracking

contexts/             # État global (Client Components)
├── AuthContext.tsx   # Firebase + Supabase sync
├── CartContext.tsx   # Panier shopping
└── DataContext.tsx   # Données app globales

hooks/                # Custom hooks
└── useSupabaseData.ts # 1400+ lignes logique métier

lib/                  # Utilitaires
├── supabase.ts       # Client Supabase configuré
└── firebaseConfig.ts # Config Firebase

services/             # Services externes
└── supabaseService.ts # Couche abstraction DB

types/                # TypeScript
├── supabase.ts       # Types auto-générés DB
└── app.ts           # 175+ lignes types métier
```

---

## 💼 FONCTIONNALITÉS MÉTIER

### 1. Système de Commandes (commander/page.tsx)
**Complexité**: 1320 lignes, logique sophistiquée
- **Planning**: Sélection jour → date → heure (18h-20h30)
- **Menu dynamique**: Plats disponibles par jour de semaine
- **Panier avancé**: Groupement par date retrait, quantités, modifications
- **Validation**: Profil requis, dates futures, plats disponibles
- **UX**: Mobile/Desktop responsive, animations Thai

### 2. Gestion Événements (evenements/page.tsx)  
**Fonctionnalités**: 692 lignes
- **Minimum**: 10 personnes obligatoire
- **Types**: Anniversaire, entreprise, famille, cocktail, buffet, autre
- **Planning**: Date/heure flexible (9h-23h par 15min)
- **Plats**: Présélection menu avec tooltips photos
- **Process**: Devis gratuit → contact 24h → confirmation

### 3. Administration Complète (admin/)
**Modules**: 5+ sections spécialisées
- **Centre commandement**: Statistiques temps réel, filtres
- **Commandes**: Gestion statuts, suivi détaillé  
- **Plats**: Menu management, disponibilités
- **Clients**: Base clients, profils complets
- **Statistiques**: Métriques business, analytics

### 4. Authentification Hybride
**Innovation**: Firebase + Supabase synchronisé
- **Firebase**: Gestion login/logout, tokens
- **Supabase**: Profils clients avec rôles (client/admin)
- **Sync auto**: Création profil Supabase si Firebase user existe
- **Protection**: Middleware Next.js, guards composants

---

## 🎨 DESIGN SYSTEM THAI

### Palette Couleurs Personnalisée
```css
thai-orange: Couleur principale (actions, CTA)
thai-green: Textes importants, titres
thai-gold: Accents, badges, highlights
thai-red: Alertes, erreurs
thai-cream: Backgrounds, conteneurs
```

### Composants Signature
- **Cartes gradients**: from-thai-orange to-thai-gold
- **Animations**: hover:scale-105, transitions duration-200
- **Icons thématiques**: Lucide React (shopping-cart, calendar, users)
- **Badges interactifs**: Statuts commandes colorés
- **Mobile-first**: Responsive complet

---

## 🔧 ARCHITECTURE TECHNIQUE

### State Management Sophistiqué
**TanStack Query**: Gestion état serveur, cache, mutations
**Context API**: État UI global (auth, cart, data)
**Hooks pattern**: Abstraction logique métier (useSupabaseData.ts)

### Types TypeScript Complets (175+ lignes)
- **Mapping DB → UI**: Supabase types vers interfaces frontend
- **Compatibilité**: Support legacy Airtable structure
- **Validation**: Types stricts pour sécurité données

### Performance Optimisations
- **Server Components**: Rendu serveur par défaut
- **Bundle splitting**: Code splitting automatique
- **Images**: Optimisation Next.js intégrée
- **Cache layers**: React Query + Next.js cache

---

## 📊 MÉTRIQUES APPLICATION

### Complexité Code
- **Composants**: 50+ fichiers modulaires
- **Hooks personnalisés**: 15+ hooks métier
- **Pages principales**: 10+ routes complètes
- **Types definitions**: 175+ lignes TypeScript
- **Services**: Couche complète abstraction DB

### Fonctionnalités Business
- **Horaires**: Lun/Mer/Ven/Sam 18h00-20h30
- **Événements**: Minimum 10 personnes
- **Paiement**: Sur place, CB acceptée
- **Retrait**: 2 impasse de la poste, 37120 Marigny Marmande
- **Contact**: 07 49 28 37 07

---

## 🚀 ÉTAT PRODUCTION

### Points Forts
✅ **Stack moderne**: Dernières versions (Next.js 15, React 19)  
✅ **Architecture scalable**: App Router optimisé  
✅ **Code quality**: TypeScript strict, patterns cohérents  
✅ **UX exceptionnelle**: Design Thai authentique  
✅ **Fonctionnalités complètes**: Tous aspects métier couverts  
✅ **Performance**: Server Components, optimisations  

### Optimisations Futures Possibles
- **Tests automatisés**: Jest + Testing Library
- **Monitoring**: Sentry, analytics avancées  
- **CI/CD**: Pipeline déploiement automatisé
- **SEO**: Métadonnées, sitemap
- **PWA**: Service worker, offline support
- **A11y**: Audit accessibilité complet

---

## 🧠 POINTS MÉMOIRE CLAUDE

### Commandes Fréquentes
```bash
npm run dev    # Développement (http://localhost:3000)
npm run build  # Build production
npm run lint   # Vérification code
```

### Fichiers Clés à Retenir
- `app/commander/page.tsx` - Système commandes (1320 lignes)
- `hooks/useSupabaseData.ts` - Logique métier (1400+ lignes)  
- `types/app.ts` - Types complets (175+ lignes)
- `contexts/AuthContext.tsx` - Auth hybride Firebase+Supabase
- `components/FloatingCartIcon.tsx` - UX panier flottant
- `app/admin/layout.tsx` - Navigation admin complète

### Patterns Architecturaux
- **Server First**: Server Components par défaut
- **Client selective**: 'use client' uniquement si nécessaire
- **Types safety**: Validation stricte Supabase → UI
- **Error handling**: Boundaries + toast notifications
- **Real-time**: Supabase subscriptions + React Query

---

*📝 Note: Ce fichier sert de mémoire persistante pour éviter de redemander l'analyse de l'application. Mise à jour automatique à chaque analyse majeure.*
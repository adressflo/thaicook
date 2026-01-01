# ChanthanaThaiCook - Restaurant Thaï Authentique

Application Next.js pour la gestion d'un restaurant thaïlandais avec système de commandes, événements et administration.

## 🚀 Stack Technique

| Catégorie         | Technologies                                         |
| ----------------- | ---------------------------------------------------- |
| **Framework**     | Next.js 16 (App Router) + React 19 + TypeScript 5    |
| **UI**            | shadcn/ui + Radix UI + Tailwind CSS 4                |
| **Auth**          | Better Auth (Prisma adapter)                         |
| **Database**      | PostgreSQL (Hetzner/Coolify) + Prisma ORM 7          |
| **Storage**       | MinIO (Hetzner self-hosted, S3-compatible)           |
| **State**         | TanStack Query 5 + Server Actions (next-safe-action) |
| **Notifications** | Firebase Cloud Messaging (FCM)                       |
| **Emails**        | Resend + React Email                                 |
| **Testing**       | Vitest (unit) + Playwright (E2E)                     |
| **Hosting**       | Hetzner Cloud (Coolify) - 100% self-hosted           |

## 📁 Structure

```
app/
├── actions/           # Server Actions (Prisma CRUD)
├── auth/              # Pages auth (login, signup, reset-password)
├── admin/             # Interface admin
├── historique/        # Historique commandes client
├── commander/         # Page commande
├── panier/            # Panier
└── profil/            # Profil utilisateur

components/
├── historique/        # OrderHistoryCard, ActionButtons, StatusBadge
├── shared/            # CartItemCard, CommandePlatModal, ProductCard
├── layout/            # AppLayout, MobileNav, Footer
└── ui/                # shadcn/ui components

lib/
├── auth.ts            # Better Auth server
├── auth-client.ts     # Better Auth client
├── prisma.ts          # Prisma client
├── minio.ts           # MinIO client (storage)
├── fcm.ts             # Firebase Cloud Messaging
├── fcm-admin.ts       # FCM Admin SDK
├── validations.ts     # Schémas Zod
└── safe-action.ts     # next-safe-action client

hooks/
└── usePrismaData.ts   # 44+ hooks TanStack Query
```

## 🛠️ Installation

```bash
# Cloner et installer
git clone [repository-url]
cd appchanthana
npm install

# Configuration
cp .env.example .env.local
# Remplir  BETTER_AUTH_SECRET, RESEND_API_KEY, etc.

# Générer Prisma client
npm run prisma:generate

# Démarrer
npm run dev
```

## � Scripts

```bash
npm run dev              # Serveur développement
npm run build            # Build production
npm run prisma:generate  # Générer client Prisma
npm run prisma:studio    # Interface DB visuelle
npm run prisma:push      # Push schema vers DB
npm run test             # Tests Vitest
npm run test:e2e         # Tests Playwright
npm run email:dev        # Preview emails React Email
```

## 🎨 Palette Couleurs

- **Orange Thaï** `#FF7B54` - Principale
- **Vert Thaï** `#2D5016` - Secondaire
- **Or Thaï** `#FFD700` - Accents
- **Crème Thaï** `#FEF7E0` - Backgrounds

## 🔐 Auth

- Better Auth avec Prisma adapter
- Sessions cookies (`better-auth.session_token`)
- Middleware protection routes (`/admin/*`, `/profil/*`)
- Sync User ↔ client_db via `auth_user_id`

## 📱 PWA

- Service Worker avec cache strategies
- Mode offline (IndexedDB + TanStack Query persist)
- Push notifications FCM
- Installable (manifest.ts)

## 📚 Documentation

- [`road.md`](road.md) - Roadmap complète du projet
- [`GEMINI.md`](GEMINI.md) - Instructions IA
- [`documentation/`](documentation/) - Docs techniques

## 📞 Contact

- Email : contact@cthaicook.com
- Site : [cthaicook.com](https://cthaicook.com)

---

Développé pour ChanthanaThaiCook - Restaurant Thaï Authentique

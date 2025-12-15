# GEMINI.md - APPChanthana

> **📋 Roadmap** : Consulter [`road.md`](./road.md) pour l'état d'avancement stratégique.

---

## Contexte Projet

**APPChanthana** - Application web pour restaurant thaïlandais.

| Fonctionnalité    | Description                              |
| ----------------- | ---------------------------------------- |
| **Client**        | Prise de commande, historique, suivi     |
| **Admin**         | Gestion plats, commandes, clients, stats |
| **Environnement** | `http://localhost:3000`                  |

---

## Architecture Technique

### Stack Principal

| Composant | Technologie           | Fichiers                                |
| --------- | --------------------- | --------------------------------------- |
| Framework | Next.js 15 App Router | -                                       |
| ORM       | Prisma                | `lib/prisma.ts`, `prisma/schema.prisma` |
| Auth      | Better Auth           | `lib/auth.ts`, `lib/auth-client.ts`     |
| State     | TanStack Query        | `hooks/usePrismaData.ts`                |
| Mutations | next-safe-action      | `app/actions/*.ts`                      |
| Storage   | MinIO (S3-compatible) | Hetzner self-hosted                     |
| Database  | PostgreSQL            | Supabase (migration Hetzner planifiée)  |
| Realtime  | Supabase Realtime     | -                                       |

### Base de Données

26 modèles Prisma dont :

- `User`, `Session`, `Account` (Better Auth)
- `client_db` (profils utilisateurs)
- `plats_db`, `extras_db` (catalogue)
- `commande_db`, `details_commande_db` (commandes)
- `evenements_db` (événements/traiteur)

---

## Scripts Clés

```bash
npm run dev              # Serveur développement
npm run prisma:generate  # Générer client Prisma
npm run prisma:push      # Push schema vers DB (dev)
npm run prisma:studio    # Interface données
npm run test:e2e         # Tests Playwright
```

---

## Conventions

- **Server Components** par défaut
- **Server Actions** pour toutes les mutations (`app/actions/`)
- **Typage Strict** TypeScript
- **Named Exports** pour les composants
- **Alias** `@/` pour les imports depuis la racine

---

## Authentification

- Gérée par **Better Auth**
- Protection routes : `middleware.ts`
- Contrôle d'accès : `PrivateRoute`, `AdminRoute`
- Cookie session : `better-auth.session_token`

---

## Points d'Attention

1. **MinIO** : Images stockées sur `116.203.111.206:9000` (pas Supabase Storage)
2. **Prisma** : Toujours `prisma:generate` après modification du schema
3. **Zod** : Validation obligatoire pour toutes les entrées utilisateur
4. **Server Actions** : Utiliser `next-safe-action` pour les mutations

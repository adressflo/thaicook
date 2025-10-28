# Scripts SQL - APPChanthana

**Projet**: Restaurant Thaïlandais APPChanthana
**Database**: Supabase PostgreSQL 15
**ORM**: Prisma 6.17.1

---

## 📁 Structure

```
sql/
├── archive-firebase/     # Scripts SQL obsolètes (Firebase Auth)
│   ├── README.md        # ⚠️ Avertissements + explications
│   ├── fix-storage-rls.sql
│   ├── notifications_table.sql
│   ├── plats-rupture-migration.sql
│   ├── quick-storage-fix.sql
│   └── rls-bypass-fix.sql
└── README.md           # Ce fichier
```

---

## 🚀 Architecture Actuelle (2025-10-27+)

### Stack Database

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **ORM** | Prisma 6.17.1 | Accès database type-safe |
| **Database** | Supabase PostgreSQL 15 | Base données relationnelle |
| **Auth** | Better Auth 1.3.28 | Authentification + sessions |
| **Sécurité** | Application-level | Server Actions Next.js |
| **Real-time** | Supabase Realtime | Synchronisation live |
| **Storage** | Supabase Storage | Images plats/avatars |

### Principes Architecturaux

✅ **Prisma ORM First** - Toutes opérations CRUD via Prisma
✅ **Server Actions** - Sécurité + validation côté serveur
✅ **Better Auth** - UUID `auth_user_id` (pas Firebase UID)
✅ **RLS Désactivé** - Sécurité dans code TypeScript
✅ **Type-Safe** - Types auto-générés Prisma + TypeScript strict

---

## 🔧 Modifier le Schéma Database

### Méthode Actuelle: Prisma Migrations

**1. Éditer le schéma Prisma**
```bash
# Ouvrir dans VS Code
code prisma/schema.prisma
```

**2. Créer une migration**
```bash
# Dev: Crée migration + applique + génère client
npx prisma migrate dev --name description_migration

# Production: Applique migrations existantes
npx prisma migrate deploy
```

**3. Générer le client Prisma**
```bash
# Régénérer types TypeScript après changements
npx prisma generate
```

### Exemple de Migration

```prisma
// prisma/schema.prisma
model client_db {
  id_client    Int      @id @default(autoincrement())
  auth_user_id String   @unique // Lien Better Auth
  email        String
  nom          String?
  prenom       String?
  role         String   @default("client")
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  @@index([auth_user_id])
  @@index([email])
  @@index([role])
  @@map("client_db")
}
```

**Commande**:
```bash
npx prisma migrate dev --name add_client_indexes
```

---

## 📚 Documentation

### Guides Prisma
- **Guide complet**: [`documentation/prismadoc.md`](../documentation/prismadoc.md)
- **Schéma DB**: [`documentation/database-schema.md`](../documentation/database-schema.md)

### Architecture
- **Vue globale**: [`documentation/architecture-overview.md`](../documentation/architecture-overview.md)
- **Better Auth**: Section dans `architecture-overview.md`
- **State management**: [`documentation/state-management.md`](../documentation/state-management.md)

### Commandes Prisma Utiles

```bash
# Visualiser database dans Prisma Studio
npx prisma studio

# Vérifier état migrations
npx prisma migrate status

# Créer migration sans l'appliquer
npx prisma migrate dev --create-only

# Reset database (⚠️ DEV ONLY - perte données)
npx prisma migrate reset

# Générer types TypeScript
npx prisma generate

# Valider schéma Prisma
npx prisma validate

# Introspection DB (générer schéma depuis DB existante)
npx prisma db pull
```

---

## 🗄️ Archive Firebase

**Dossier**: `archive-firebase/`
**Contenu**: 5 scripts SQL obsolètes (août-sept 2025)
**Status**: ⚠️ **NE PAS UTILISER**

Ces scripts utilisaient:
- ❌ Firebase Authentication (`firebase_uid`)
- ❌ Row Level Security (RLS) Supabase
- ❌ Requêtes Supabase SQL directes

**Voir**: [`archive-firebase/README.md`](archive-firebase/README.md) pour détails

---

## ⚠️ Avertissements Importants

### NE PAS Exécuter Scripts SQL Directement

❌ **ÉVITER**:
```sql
-- Ne pas exécuter SQL brut dans Supabase SQL Editor
CREATE TABLE nouvelle_table (...);
ALTER TABLE client_db ADD COLUMN ...;
```

✅ **UTILISER**:
```bash
# Modifier prisma/schema.prisma puis :
npx prisma migrate dev --name description_modification
```

### Pourquoi Prisma Migrations ?

1. **Versioning** - Toutes migrations versionnées dans `prisma/migrations/`
2. **Reproductibilité** - Même schéma dev/staging/prod
3. **Rollback** - Possibilité revenir en arrière
4. **Types** - Types TypeScript auto-générés
5. **Collaboration** - Migrations commitées dans Git

---

## 🔐 Sécurité Database

### Architecture Actuelle

**Sécurité Application-Level** (Server Actions):
- Vérification session Better Auth
- Validation données Zod
- Filtrage queries Prisma selon rôle
- Logs erreurs côté serveur

### Exemple Server Action Sécurisé

```typescript
// app/actions/clients.ts
'use server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function getClientProfile() {
  // 1. Vérifier authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error('Non authentifié')
  }

  // 2. Query Prisma filtrée
  return await prisma.client_db.findUnique({
    where: { auth_user_id: session.user.id }
  })
}
```

**Pas de RLS Supabase** - Sécurité dans code TypeScript

---

## 📊 Statut Migrations

**Date dernière migration**: Vérifier avec `npx prisma migrate status`
**Migrations pendantes**: Vérifier avant `git pull`
**Schéma DB actuel**: Voir `prisma/schema.prisma`

---

## 🆘 Troubleshooting

### Erreur: "Database schema not in sync"
```bash
npx prisma migrate deploy
npx prisma generate
```

### Erreur: "Migration failed"
```bash
# Voir détails
npx prisma migrate status

# Marquer migration comme appliquée (si déjà exécutée manuellement)
npx prisma migrate resolve --applied <migration_name>
```

### Reset complet (DEV ONLY)
```bash
# ⚠️ PERTE DONNÉES
npx prisma migrate reset
```

---

**Dernière mise à jour**: 2025-10-27
**Architecture**: Better Auth + Prisma ORM + Supabase PostgreSQL

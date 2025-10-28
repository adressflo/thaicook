# Archive Scripts SQL - Firebase Auth

**Date archivage**: 2025-10-27
**Raison**: Migration Better Auth + Prisma ORM
**Status**: ⚠️ **OBSOLÈTES - NE PAS EXÉCUTER**

---

## ⚠️ Avertissement Important

Ces scripts SQL sont **archivés** et **ne doivent plus être utilisés**. Ils ont été conçus pour l'ancienne architecture utilisant:
- ❌ **Firebase Authentication** (`firebase_uid`)
- ❌ **Row Level Security (RLS)** Supabase
- ❌ **Requêtes Supabase directes**

### Architecture Actuelle (2025-10-27+)

L'application utilise maintenant:
- ✅ **Better Auth 1.3.28** - Authentification TypeScript-first
  - UUID `auth_user_id` (remplace `firebase_uid`)
  - Sessions via cookies (remplace JWT tokens)
- ✅ **Prisma ORM 6.17.1** - ORM type-safe
  - Server Actions Next.js 15
  - Sécurité application-level
- ✅ **Supabase PostgreSQL** - Database uniquement
  - Realtime subscriptions
  - Storage (images)
  - **RLS DÉSACTIVÉ** (sécurité dans Server Actions)

---

## 📋 Scripts Archivés

### 1. `fix-storage-rls.sql` (3.7 KB)
**But**: Configurer RLS policies pour Storage bucket `platphoto`
**Problème**: Utilise Firebase Auth pour vérifier permissions upload
**Remplacement**: Sécurité Storage gérée via Server Actions Better Auth

### 2. `notifications_table.sql` (4.8 KB)
**But**: Créer table notifications système
**Problème**:
- Colonne `user_id VARCHAR(255)` pour Firebase UID
- RLS policies Firebase Auth
- Table jamais créée en production
**Remplacement**: Système notifications pas encore implémenté

### 3. `plats-rupture-migration.sql` (6.9 KB)
**But**: Migration ruptures de stock par date
**Statut**:
- ✅ Migration déjà appliquée
- ✅ Table `plats_rupture_dates` existe
- ❌ RLS policies obsolètes
**Note**: Fonctionnalité toujours utilisée (4 hooks dans `useSupabaseData.ts`)

### 4. `quick-storage-fix.sql` (828 B)
**But**: Désactiver RLS Storage (DEBUG ONLY)
**Problème**: Solution temporaire dangereuse
**Remplacement**: N/A - Plus pertinent avec Better Auth

### 5. `rls-bypass-fix.sql` (3.7 KB)
**But**: Fonctions helpers RLS
**Contenu**:
- `is_admin_user()` - Vérifier role admin
- `get_current_firebase_uid()` - Obtenir Firebase UID
- `can_access_client_data()` - Vérifier accès données
**Problème**: Toutes fonctions utilisent Firebase Auth
**Remplacement**: Vérifications dans Server Actions Prisma

---

## 🚫 Pourquoi Ces Scripts Ne Fonctionnent Plus

### 1. Firebase Auth Supprimé
```sql
-- ❌ Ne fonctionne plus
WHERE firebase_uid = current_setting('request.jwt.claims')::json->>'sub'

-- ✅ Équivalent Better Auth (dans Server Actions TypeScript)
const session = await auth.api.getSession({ headers: await headers() })
const client = await prisma.client_db.findUnique({
  where: { auth_user_id: session.user.id }
})
```

### 2. RLS Désactivé
```sql
-- ❌ RLS policies ne s'appliquent plus
CREATE POLICY "clients_read" ON client_db
  FOR SELECT USING (firebase_uid = auth.uid());

-- ✅ Sécurité dans Server Actions
export async function getClientProfile() {
  const session = await auth.api.getSession()
  if (!session?.user) throw new Error('Non authentifié')

  return await prisma.client_db.findUnique({
    where: { auth_user_id: session.user.id }
  })
}
```

### 3. Schéma DB Changé
```sql
-- ❌ Colonne obsolète
firebase_uid TEXT UNIQUE

-- ✅ Colonne actuelle
auth_user_id TEXT UNIQUE  -- UUID Better Auth User.id
```

---

## 📚 Documentation Actuelle

Pour comprendre l'architecture actuelle, consulter:

- **Architecture globale**: [`documentation/architecture-overview.md`](../../documentation/architecture-overview.md)
- **Schéma database**: [`documentation/database-schema.md`](../../documentation/database-schema.md)
- **Prisma ORM**: [`documentation/prismadoc.md`](../../documentation/prismadoc.md)
- **Better Auth**: Section dans `architecture-overview.md`

---

## 🔧 Créer/Modifier le Schéma DB

**Méthode actuelle**: Utiliser Prisma migrations

```bash
# Modifier le schéma
code prisma/schema.prisma

# Créer migration
npx prisma migrate dev --name description_migration

# Appliquer en production
npx prisma migrate deploy
```

**Voir**: [`documentation/prismadoc.md`](../../documentation/prismadoc.md)

---

## 📖 Historique

Ces scripts ont été créés entre **août et septembre 2025** pour:
- Configurer RLS policies Supabase
- Fixer problèmes permissions Storage
- Créer table ruptures de stock
- Ajouter système notifications (jamais implémenté)

**Migration Better Auth + Prisma**: **27 octobre 2025**
- Firebase Auth complètement supprimé
- Prisma ORM remplace requêtes Supabase directes
- RLS désactivé (sécurité application-level)

---

**⚠️ NE PAS EXÉCUTER CES SCRIPTS**
**✅ Utiliser Prisma migrations pour modifications DB**

**Dernière mise à jour**: 2025-10-27

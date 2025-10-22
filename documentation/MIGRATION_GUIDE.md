# Guide de Migration Prisma ORM

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration initiale](#configuration-initiale)
4. [Génération du client Prisma](#génération-du-client-prisma)
5. [Introspection de la base de données](#introspection-de-la-base-de-données)
6. [Migration progressive des requêtes](#migration-progressive-des-requêtes)
7. [Exemples de conversion](#exemples-de-conversion)
8. [Tests et validation](#tests-et-validation)
9. [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

Cette migration introduit **Prisma ORM** comme couche d'abstraction type-safe pour remplacer progressivement les requêtes Supabase directes. L'objectif est d'améliorer:

- ✅ **Type Safety** : Types TypeScript auto-générés pour toutes les opérations
- ✅ **Performance** : Requêtes optimisées avec pooling de connexions
- ✅ **Maintenabilité** : API unifiée et prévisible pour toutes les opérations DB
- ✅ **Relations** : Gestion automatique des relations complexes
- ✅ **Migrations** : Gestion versionnée des changements de schéma

## 📦 Prérequis

- [x] Node.js 18+ installé
- [x] Accès à la base de données Supabase PostgreSQL
- [x] Variables d'environnement Supabase configurées
- [x] Prisma CLI installé : `npm install prisma @prisma/client --save-dev`

## ⚙️ Configuration initiale

### 1. Variables d'environnement

Créez ou mettez à jour votre fichier `.env` avec les URLs de connexion Prisma:

```bash
# Supabase Configuration (Existant)
SUPABASE_URL=https://lkaiwnkyoztebplqoifc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=sbp_...
SUPABASE_DB_PASSWORD=richelieu37120+!

# Prisma Configuration (Nouveau)
# Connection Pooling (Session Mode) - Pour les requêtes
DATABASE_URL="postgresql://postgres.lkaiwnkyoztebplqoifc:richelieu37120+!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection - Pour les migrations
DIRECT_URL="postgresql://postgres.lkaiwnkyoztebplqoifc:richelieu37120+!@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**🔍 Comment obtenir ces URLs:**

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc)
2. Naviguez vers: **Settings → Database**
3. Copiez les deux URLs:
   - **Connection Pooling** (Mode Session) → `DATABASE_URL`
   - **Connection String** (Direct) → `DIRECT_URL`

### 2. Vérification du schéma Prisma

Le fichier `prisma/schema.prisma` a déjà été créé avec:

- ✅ 6 modèles de données (Client, Plat, Extra, Commande, DetailCommande, Evenement)
- ✅ Enums pour les statuts (StatutCommande, StatutPaiement, TypeLivraison, CategorieMenu)
- ✅ Relations entre tables (1-N, N-1)
- ✅ Index pour optimisation des requêtes
- ✅ Mapping des noms de colonnes Supabase

## 🚀 Génération du client Prisma

### Étape 1: Générer le client TypeScript

```bash
npx prisma generate
```

Cette commande:
- ✅ Génère les types TypeScript dans `node_modules/@prisma/client`
- ✅ Crée le client Prisma avec autocomplétion complète
- ✅ Valide la syntaxe du schéma Prisma

### Étape 2: Vérifier la génération

```bash
# Vérifier que le client est généré
ls node_modules/.prisma/client

# Tester l'import dans Node.js
node -e "const { PrismaClient } = require('@prisma/client'); console.log('✅ Prisma Client importé avec succès')"
```

### Étape 3: Vérifier la connexion à la base de données

```bash
npx prisma db pull --force
```

Cette commande:
- ✅ Introspection de la base Supabase existante
- ✅ Synchronise le schéma Prisma avec les tables réelles
- ✅ Détecte automatiquement les colonnes manquantes

**⚠️ Note:** Utilisez `--force` pour écraser le schéma existant lors de l'introspection

## 🔄 Introspection de la base de données

Si vous souhaitez regénérer le schéma depuis la base existante:

```bash
# Sauvegarder le schéma actuel
cp prisma/schema.prisma prisma/schema.prisma.backup

# Introspection complète
npx prisma db pull

# Comparer les différences
diff prisma/schema.prisma.backup prisma/schema.prisma
```

## 📝 Migration progressive des requêtes

### Stratégie recommandée

1. **Phase 1** : Cohabitation Supabase + Prisma
2. **Phase 2** : Migration des requêtes de lecture simples
3. **Phase 3** : Migration des requêtes de lecture avec relations
4. **Phase 4** : Migration des mutations (Create, Update, Delete)
5. **Phase 5** : Retrait complet de Supabase Query Client

### Architecture de cohabitation

```typescript
// lib/database.ts - Abstraction layer
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const db = {
  // Utiliser Prisma progressivement
  clients: {
    findByFirebaseUid: (uid: string) => prisma.client.findUnique({
      where: { firebaseUid: uid }
    }),
    // Fallback Supabase si besoin
    findByFirebaseUidLegacy: async (uid: string) => {
      const { data } = await supabase
        .from('client_db')
        .select('*')
        .eq('firebase_uid', uid)
        .single()
      return data
    }
  }
}
```

## 🔄 Exemples de conversion

### Exemple 1: Lecture simple (SELECT)

**❌ Avant (Supabase):**
```typescript
const { data: client, error } = await supabase
  .from('client_db')
  .select('*')
  .eq('firebase_uid', firebaseUid)
  .single()

if (error) throw error
return client
```

**✅ Après (Prisma):**
```typescript
const client = await prisma.client.findUnique({
  where: { firebaseUid }
})
return client // null si non trouvé, pas d'erreur
```

### Exemple 2: Lecture avec relations (JOIN)

**❌ Avant (Supabase):**
```typescript
const { data, error } = await supabase
  .from('commande_db')
  .select(`
    *,
    details_commande_db (
      *,
      plats_db (prix),
      extras_db (prix)
    )
  `)
  .eq('client_firebase_uid', firebaseUid)

if (error) throw error
return data
```

**✅ Après (Prisma):**
```typescript
const commandes = await prisma.commande.findMany({
  where: { clientFirebaseUid: firebaseUid },
  include: {
    details: {
      include: {
        plat: {
          select: { prix: true }
        },
        extra: {
          select: { prix: true }
        }
      }
    }
  }
})
return commandes
```

### Exemple 3: Création (INSERT)

**❌ Avant (Supabase):**
```typescript
const { data, error } = await supabase
  .from('client_db')
  .insert({
    firebase_uid: firebaseUid,
    email,
    nom,
    prenom
  })
  .select()
  .single()

if (error) throw error
return data
```

**✅ Après (Prisma):**
```typescript
const client = await prisma.client.create({
  data: {
    firebaseUid,
    email,
    nom,
    prenom
  }
})
return client
```

### Exemple 4: Mise à jour (UPDATE)

**❌ Avant (Supabase):**
```typescript
const { data, error } = await supabase
  .from('client_db')
  .update({ nom, prenom, telephone })
  .eq('firebase_uid', firebaseUid)
  .select()
  .single()

if (error) throw error
return data
```

**✅ Après (Prisma):**
```typescript
const client = await prisma.client.update({
  where: { firebaseUid },
  data: { nom, prenom, telephone }
})
return client
```

### Exemple 5: Suppression (DELETE)

**❌ Avant (Supabase):**
```typescript
const { error } = await supabase
  .from('client_db')
  .delete()
  .eq('firebase_uid', firebaseUid)

if (error) throw error
```

**✅ Après (Prisma):**
```typescript
await prisma.client.delete({
  where: { firebaseUid }
})
```

### Exemple 6: Transaction complexe

**❌ Avant (Supabase):**
```typescript
// Plusieurs appels séparés, pas de transaction atomique
const { data: commande } = await supabase
  .from('commande_db')
  .insert(commandeData)
  .select()
  .single()

for (const detail of details) {
  await supabase
    .from('details_commande_db')
    .insert({
      ...detail,
      idcommande_r: commande.idcommande
    })
}
```

**✅ Après (Prisma):**
```typescript
// Transaction atomique garantie
const commande = await prisma.commande.create({
  data: {
    clientFirebaseUid,
    datePriseCommande: new Date(),
    statutCommande: 'EN_ATTENTE_CONFIRMATION',
    details: {
      create: details.map(detail => ({
        platId: detail.platId,
        quantitePlat: detail.quantite,
        prixUnitaire: detail.prix
      }))
    }
  },
  include: {
    details: {
      include: {
        plat: true,
        extra: true
      }
    }
  }
})
```

## 🧪 Tests et validation

### Test unitaire avec Jest

```typescript
// __tests__/prisma/client.test.ts
import { prisma } from '@/lib/prisma'

describe('Prisma Client Operations', () => {
  it('should find client by Firebase UID', async () => {
    const client = await prisma.client.findUnique({
      where: { firebaseUid: 'test-firebase-uid' }
    })
    expect(client).toBeDefined()
    expect(client?.email).toBe('test@example.com')
  })

  it('should create a new order with details', async () => {
    const commande = await prisma.commande.create({
      data: {
        clientFirebaseUid: 'test-uid',
        details: {
          create: [
            { platId: 1, quantitePlat: 2, prixUnitaire: 12.99 }
          ]
        }
      },
      include: { details: true }
    })
    expect(commande.details).toHaveLength(1)
  })
})
```

### Test de migration avec comparaison

```typescript
// scripts/compare-results.ts
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

async function compareResults() {
  // Supabase query
  const { data: supabaseData } = await supabase
    .from('client_db')
    .select('*')
    .limit(10)

  // Prisma query
  const prismaData = await prisma.client.findMany({
    take: 10
  })

  console.log('Supabase count:', supabaseData?.length)
  console.log('Prisma count:', prismaData.length)
  console.log('Match:', supabaseData?.length === prismaData.length)
}
```

## 🐛 Dépannage

### Erreur: "Can't reach database server"

**Solution:**
```bash
# Vérifier la connectivité
npx prisma db pull

# Si erreur, vérifier les variables d'environnement
echo $DATABASE_URL
echo $DIRECT_URL
```

### Erreur: "Relation missing in schema"

**Solution:**
```bash
# Regénérer le schéma depuis la base
npx prisma db pull --force

# Puis régénérer le client
npx prisma generate
```

### Erreur: "Type mismatch in generated types"

**Solution:**
```bash
# Nettoyer et régénérer
rm -rf node_modules/.prisma
npx prisma generate
```

### Performance lente avec Supavisor Pooler

**Solution:**
```prisma
// Dans schema.prisma, utiliser directUrl pour migrations
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")        // Pooling pour queries
  directUrl = env("DIRECT_URL")         // Direct pour migrations
}
```

## 📚 Ressources supplémentaires

- [Documentation Prisma officielle](https://www.prisma.io/docs)
- [Prisma avec Next.js 15](https://www.prisma.io/docs/guides/deployment/nextjs)
- [Prisma avec Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Guide de migration Prisma](https://www.prisma.io/docs/guides/migrate/seed-database)

## ✅ Checklist de migration complète

- [x] Prisma installé et configuré
- [x] Schéma Prisma créé avec tous les modèles
- [x] Variables d'environnement configurées
- [x] Client Prisma généré
- [ ] Tests de connexion réussis
- [ ] Première requête migrée (Client.findUnique)
- [ ] Requêtes avec relations migrées
- [ ] Mutations migrées
- [ ] Tests unitaires créés
- [ ] Tests E2E mis à jour
- [ ] Performance validée
- [ ] Documentation mise à jour

---

**🎉 Migration Prisma prête à démarrer!**

Pour commencer, exécutez:
```bash
npx prisma generate
npm run dev
```

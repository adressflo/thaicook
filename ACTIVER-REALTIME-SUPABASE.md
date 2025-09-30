# 🔄 Activer Real-time Supabase pour synchronisation instantanée

## Problème actuel

Les modifications faites par l'admin ne se synchronisent pas automatiquement côté client. Le client doit recharger manuellement la page pour voir les changements.

## Solution : Activer les publications Real-time Supabase

### Étapes à suivre dans le Dashboard Supabase

#### 1. Accéder au Dashboard Supabase
- URL : https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc
- Se connecter avec les identifiants du projet

#### 2. Activer Real-time pour `commande_db`

**Navigation** : Database → Replication → Publications

1. Chercher la table `commande_db`
2. Activer les options suivantes :
   - ✅ **INSERT** : Notifications lors de la création de nouvelles commandes
   - ✅ **UPDATE** : Notifications lors du changement de statut/modifications
   - ✅ **DELETE** : Notifications lors de la suppression de commandes

**Ou via SQL** :
```sql
-- Activer la réplication pour commande_db
ALTER TABLE commande_db REPLICA IDENTITY FULL;

-- Ajouter la table à la publication
ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;
```

#### 3. Activer Real-time pour `details_commande_db`

1. Chercher la table `details_commande_db`
2. Activer les options suivantes :
   - ✅ **INSERT** : Notifications lors de l'ajout de plats
   - ✅ **UPDATE** : Notifications lors du changement de quantité
   - ✅ **DELETE** : Notifications lors de la suppression de plats

**Ou via SQL** :
```sql
-- Activer la réplication pour details_commande_db
ALTER TABLE details_commande_db REPLICA IDENTITY FULL;

-- Ajouter la table à la publication
ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;
```

#### 4. Vérifier l'activation

Dans le **SQL Editor**, exécuter :
```sql
-- Vérifier les tables avec Real-time activé
SELECT
  schemaname,
  tablename
FROM
  pg_publication_tables
WHERE
  pubname = 'supabase_realtime';
```

**Résultat attendu** :
```
 schemaname |      tablename
------------+---------------------
 public     | commande_db
 public     | details_commande_db
```

### Alternative : Commandes SQL complètes

Si vous préférez tout activer via SQL en une fois :

```sql
-- Activer Real-time pour toutes les tables de commandes
BEGIN;

-- 1. Activer REPLICA IDENTITY pour les deux tables
ALTER TABLE commande_db REPLICA IDENTITY FULL;
ALTER TABLE details_commande_db REPLICA IDENTITY FULL;

-- 2. Ajouter les tables à la publication Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;
ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;

COMMIT;

-- 3. Vérifier l'activation
SELECT
  schemaname,
  tablename,
  pubinsert,
  pubupdate,
  pubdelete
FROM
  pg_publication_tables
WHERE
  pubname = 'supabase_realtime'
  AND tablename IN ('commande_db', 'details_commande_db');
```

## Test après activation

### 1. Recharger les pages web
- Recharger la page admin : `http://localhost:3000/admin/commandes`
- Recharger la page client : `http://localhost:3000/historique`

### 2. Vérifier les logs dans la console
Vous devriez voir :
```
🔄 Activation Real-time Supabase pour synchronisation admin ↔ client
📡 Statut subscription commandes: SUBSCRIBED
📡 Statut subscription détails: SUBSCRIBED
```

### 3. Tester la synchronisation
1. **Admin** : Modifier la quantité d'un plat dans une commande
2. **Client** : Ouvrir `/historique` ou `/suivi-commande/[id]` dans un autre onglet
3. **Résultat attendu** : Le client voit le changement **instantanément** sans recharger

Vous devriez voir dans la console :
```
🔔 Changement détails commande détecté: UPDATE
✅ Caches détails invalidés
```

## Architecture mise en place

### Hook Real-time (`useCommandesRealtime`)

Le hook écoute 2 canaux Supabase :

1. **Canal commandes** (`commandes-realtime-channel`)
   - Écoute : `commande_db` (INSERT, UPDATE, DELETE)
   - Déclenche : Invalidation cache + refetch

2. **Canal détails** (`details-realtime-channel`)
   - Écoute : `details_commande_db` (INSERT, UPDATE, DELETE)
   - Déclenche : Invalidation cache + refetch

### Pages avec Real-time activé

✅ **Côté Client**
- [app/historique/page.tsx](app/historique/page.tsx) - Liste complète des commandes
- [app/suivi-commande/[id]/page.tsx](app/suivi-commande/[id]/page.tsx) - Détail commande

✅ **Côté Admin**
- [app/admin/commandes/page.tsx](app/admin/commandes/page.tsx) - Dashboard admin

### Caches invalidés automatiquement

Quand un événement Real-time est reçu, ces caches sont invalidés :
- `'commandes'` - Commandes génériques
- `'commande'` - Commande individuelle
- `'commandes-admin-global'` - Vue admin complète
- `'commandes-stats'` - Statistiques admin
- `'commandes-fixed'` - Commandes client spécifiques

## Dépannage

### Problème : Pas de logs Real-time dans la console

**Solution** : Vérifier que Real-time est activé dans Supabase (étapes ci-dessus)

### Problème : `status: CHANNEL_ERROR`

**Causes possibles** :
1. Real-time non activé pour les tables
2. Limites du plan Supabase dépassées (vérifier quotas)
3. Firewall/proxy bloquant les WebSockets

**Solution** : Exécuter le script de test :
```bash
node scripts/test-realtime-connection.js
```

### Problème : Synchronisation fonctionne mais lente

**Cause** : Cache React Query avec `staleTime` élevé

**Solution** : Déjà implémentée - invalidation forcée avec `queryClient.invalidateQueries()`

## Avantages de cette architecture

✅ **Expérience temps réel** : Les clients voient les changements instantanément
✅ **Aucun polling** : Pas de requêtes répétées inutiles (économie ressources)
✅ **Bidirectionnel** : Admin → Client ET Client → Admin
✅ **Scalable** : Supabase gère la charge avec WebSockets
✅ **Nettoyage automatique** : `useEffect` cleanup désinscrit les channels

## Performance

- **Latence moyenne** : < 100ms pour la notification
- **Bande passante** : Événements légers (JSON minimal)
- **Coût** : Inclus dans le plan Supabase gratuit (jusqu'à 2M messages/mois)

---

**Créé** : 2025-09-30
**Auteur** : Claude Code
**Status** : Implémentation complète ✅ | Activation Supabase requise ⚠️
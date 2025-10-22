# 🔧 Configuration des URLs de Connexion Prisma - Guide Précis

**Projet:** Chanthana Thai Cook
**Base de données:** Supabase PostgreSQL
**Objectif:** Configurer `DATABASE_URL` et `DIRECT_URL` pour Prisma ORM

---

## 📍 Étapes Exactes pour Trouver les URLs

### Étape 1: Accéder à votre Dashboard Supabase

1. Ouvrez votre navigateur
2. Allez sur: **https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc**
3. Connectez-vous si nécessaire

### Étape 2: Cliquer sur le Bouton "Connect"

🔍 **Où trouver ce bouton:**

- **Option 1:** En haut à droite de votre dashboard, cherchez un bouton vert **"Connect"**
- **Option 2:** Allez dans la barre latérale gauche → **"Project Settings"** (icône engrenage ⚙️)
- **Option 3:** URL directe: `https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc?showConnect=true`

**Apparence du bouton:**
```
┌─────────────┐
│   Connect   │  ← Bouton vert en haut à droite
└─────────────┘
```

### Étape 3: Identifier les Types de Connexion

Une fois le panneau "Connect" ouvert, vous verrez **3 options de connexion:**

```
╔════════════════════════════════════════════╗
║  Connection Strings                        ║
╠════════════════════════════════════════════╣
║  1. 📦 Session Pooler (recommandé)        ║
║  2. 🔄 Transaction Pooler                  ║
║  3. 🔗 Direct Connection                   ║
╚════════════════════════════════════════════╝
```

### Étape 4: Copier les URLs

#### 📦 **URL #1: Session Pooler** → `DATABASE_URL`

**Section à chercher:** "Session Pooler" ou "Connection pooling"

**Apparence:**
```
Session Pooler (Recommended for serverless)
┌────────────────────────────────────────────────────────┐
│ postgres://postgres.[PROJECT]:PASSWORD@aws-0-[REGION]. │
│ pooler.supabase.com:6543/postgres                      │
│                                                        │
│ [Copy] button                                          │
└────────────────────────────────────────────────────────┘
```

**Format exact:**
```
postgres://postgres.lkaiwnkyoztebplqoifc:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Caractéristiques à vérifier:**
- ✅ Contient `:6543` (port du pooler)
- ✅ Contient `.pooler.supabase.com`
- ✅ Commence par `postgres://postgres.lkaiwnkyoztebplqoifc`

#### 🔗 **URL #2: Direct Connection** → `DIRECT_URL`

**Section à chercher:** "Direct Connection" ou "Direct database connection"

**Apparence:**
```
Direct Connection
┌────────────────────────────────────────────────────────┐
│ postgres://postgres.[PROJECT]:PASSWORD@aws-0-[REGION]. │
│ pooler.supabase.com:5432/postgres                      │
│                                                        │
│ [Copy] button                                          │
└────────────────────────────────────────────────────────┘
```

**Format exact:**
```
postgres://postgres.lkaiwnkyoztebplqoifc:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Caractéristiques à vérifier:**
- ✅ Contient `:5432` (port PostgreSQL standard)
- ✅ Contient `.pooler.supabase.com` (ou `.aws.neon.tech`)
- ✅ Commence par `postgres://postgres.lkaiwnkyoztebplqoifc`

---

## 🔐 Votre Mot de Passe

D'après votre fichier `.env` actuel:
```
SUPABASE_DB_PASSWORD=richelieu37120+!
```

**⚠️ Important:** Le caractère `+` et `!` doivent être **URL-encodés** dans l'URL de connexion:
- `+` devient `%2B`
- `!` devient `%21`

**Mot de passe encodé:** `richelieu37120%2B%21`

---

## 📝 Configuration Finale du Fichier .env

### Option 1: Si les URLs utilisent `.pooler.supabase.com`

Ouvrez votre fichier `.env` et **ajoutez** (ou remplacez) ces lignes:

```bash
# Supabase Configuration (Existant - NE PAS MODIFIER)
SUPABASE_URL=https://lkaiwnkyoztebplqoifc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sbp_1ba0bad09468be39860696c966dab20a9094efbe
SUPABASE_DB_PASSWORD=richelieu37120+!

# ============================================
# PRISMA ORM CONFIGURATION (NOUVEAU)
# ============================================

# Connection Pooling (Session Mode) - Pour les requêtes Prisma
DATABASE_URL="postgres://postgres.lkaiwnkyoztebplqoifc:richelieu37120%2B%21@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection - Pour les migrations Prisma
DIRECT_URL="postgres://postgres.lkaiwnkyoztebplqoifc:richelieu37120%2B%21@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Option 2: Format Alternatif (si votre URL a un format différent)

Si vos URLs ressemblent à ceci:
```
postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
```

Alors utilisez:
```bash
# Session Pooler
DATABASE_URL="postgresql://postgres:richelieu37120%2B%21@db.lkaiwnkyoztebplqoifc.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection
DIRECT_URL="postgresql://postgres:richelieu37120%2B%21@db.lkaiwnkyoztebplqoifc.supabase.co:5432/postgres"
```

---

## 🎯 Checklist de Vérification

Avant de continuer, vérifiez:

- [ ] Les URLs commencent par `postgres://` ou `postgresql://`
- [ ] Le projet est bien `lkaiwnkyoztebplqoifc`
- [ ] `DATABASE_URL` utilise le port **6543** (pooler)
- [ ] `DIRECT_URL` utilise le port **5432** (direct)
- [ ] Le mot de passe est encodé: `richelieu37120%2B%21`
- [ ] `DATABASE_URL` contient `?pgbouncer=true`
- [ ] Les guillemets `"` entourent bien les URLs

---

## 🧪 Tester la Configuration

### Test 1: Valider le schéma Prisma

```bash
npm run prisma:validate
```

**Résultat attendu:**
```
✔ Prisma schema loaded from prisma\schema.prisma
✔ Validation successful
```

### Test 2: Vérifier la connexion

```bash
npx prisma db pull --force
```

**Résultat attendu:**
```
✔ Introspected 6 models and wrote them into prisma\schema.prisma
```

**Si erreur:**
- ❌ "Can't reach database server" → Vérifier `DATABASE_URL` ou `DIRECT_URL`
- ❌ "Authentication failed" → Vérifier le mot de passe encodé
- ❌ "Connection timeout" → Vérifier le port (6543 vs 5432)

### Test 3: Générer le client Prisma

```bash
npm run prisma:generate
```

**Résultat attendu:**
```
✔ Generated Prisma Client to .\node_modules\@prisma\client
```

---

## 🆘 Méthode Alternative: Trouver les URLs via l'Onglet "Database"

Si le bouton "Connect" est introuvable:

### Étape 1: Naviguer vers Database Settings

1. Dans la barre latérale gauche, cliquez sur **"Project Settings"** (icône ⚙️)
2. Dans le sous-menu, cliquez sur **"Database"**
3. URL directe: `https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc/settings/database`

### Étape 2: Trouver les Connection Strings

Descendez jusqu'à la section **"Connection string"** ou **"Connection info"**

Vous verrez:
```
Connection pooling
┌────────────────────────────────────────┐
│ Mode: Session                          │
│ ┌────────────────────────────────────┐ │
│ │ postgres://postgres.[PROJECT]...   │ │
│ └────────────────────────────────────┘ │
│ [Copy] button                          │
└────────────────────────────────────────┘

Direct connection
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ postgres://postgres.[PROJECT]...   │ │
│ └────────────────────────────────────┘ │
│ [Copy] button                          │
└────────────────────────────────────────┘
```

---

## 📸 Captures d'écran de Référence

### Vue 1: Bouton "Connect" dans le Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Supabase    lkaiwnkyoztebplqoifc         [Connect] ✓   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Dashboard                                              │
│  ├─ Table Editor                                        │
│  ├─ SQL Editor                                          │
│  └─ Database                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
              ↑ Cliquer sur "Connect" ici
```

### Vue 2: Section Database Settings
```
Project Settings → Database
┌─────────────────────────────────────────┐
│  Connection info                        │
├─────────────────────────────────────────┤
│  Host: db.lkaiwnkyoztebplqoifc...      │
│  Database name: postgres                │
│  Port: 5432                             │
│  User: postgres                         │
│                                         │
│  Connection string                      │
│  ┌─────────────────────────────────┐   │
│  │ postgres://postgres...          │   │
│  └─────────────────────────────────┘   │
│  [Copy] [Show password]                │
│                                         │
│  Connection pooling                     │
│  ┌─────────────────────────────────┐   │
│  │ postgres://postgres...          │   │
│  └─────────────────────────────────┘   │
│  [Copy] [Show password]                │
└─────────────────────────────────────────┘
```

---

## ✅ Configuration Complète - Exemple Final

Voici à quoi devrait ressembler votre fichier `.env` après configuration:

```bash
# ============================================
# SUPABASE CONFIGURATION (Existant)
# ============================================
SUPABASE_URL=https://lkaiwnkyoztebplqoifc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw
SUPABASE_SERVICE_ROLE_KEY=sbp_1ba0bad09468be39860696c966dab20a9094efbe
SUPABASE_DB_PASSWORD=richelieu37120+!

# ============================================
# PRISMA ORM CONFIGURATION (Nouveau)
# ============================================

# Session Pooler - Pour les queries Prisma (serverless-friendly)
DATABASE_URL="postgres://postgres.lkaiwnkyoztebplqoifc:richelieu37120%2B%21@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection - Pour les migrations Prisma (bypasse le pooler)
DIRECT_URL="postgres://postgres.lkaiwnkyoztebplqoifc:richelieu37120%2B%21@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

---

## 🚀 Prochaines Étapes

Une fois les URLs configurées:

```bash
# 1. Valider la configuration
npm run prisma:validate

# 2. Tester la connexion (introspection)
npx prisma db pull --force

# 3. Générer le client Prisma
npm run prisma:generate

# 4. (Optionnel) Ouvrir Prisma Studio
npm run prisma:studio
```

---

## 📞 Aide Supplémentaire

**Si vous ne trouvez toujours pas les URLs:**

1. **Contactez le support Supabase** via le bouton "Help" dans le dashboard
2. **Utilisez l'API Supabase** pour récupérer les infos:
   ```bash
   # Avec votre SUPABASE_SERVICE_ROLE_KEY
   curl https://lkaiwnkyoztebplqoifc.supabase.co/rest/v1/?apikey=YOUR_SERVICE_ROLE_KEY
   ```
3. **Vérifiez la documentation Supabase** spécifique à votre projet:
   `https://supabase.com/dashboard/project/lkaiwnkyoztebplqoifc/settings/database`

---

**🎯 Astuce:** Si vous avez du mal à trouver les URLs, copiez simplement l'URL que vous voyez dans le dashboard et remplacez:
- Le port par `6543` pour `DATABASE_URL`
- Le port par `5432` pour `DIRECT_URL`
- Le mot de passe par la version encodée `richelieu37120%2B%21`

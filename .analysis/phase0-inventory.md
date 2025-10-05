# Phase 0: Inventaire et Baseline - APPChanthana

**Date**: 2025-10-05
**Branche Git**: `cleanup/analysis-2025`
**Objectif**: Collecte de données réelles pour baseline du projet (ZÉRO estimation)

---

## 📊 Statistiques Globales du Projet (cloc)

### Vue d'ensemble
- **Total fichiers**: 235 fichiers
- **Total lignes de code**: 67,671 lignes
- **Lignes blanches**: 5,674
- **Lignes de commentaires**: 2,184

### Répartition par Langage

| Langage | Fichiers | Lignes Code | Lignes Blanches | Commentaires |
|---------|----------|-------------|-----------------|--------------|
| **TypeScript** | 160 | 37,608 | 3,368 | 1,272 |
| **JSON** | 10 | 20,116 | 0 | 0 |
| **Markdown** | 17 | 5,941 | 1,470 | 20 |
| **JavaScript** | 19 | 1,778 | 379 | 193 |
| **SQL** | 14 | 1,334 | 319 | 588 |
| **CSS** | 1 | 418 | 84 | 20 |

---

## 📁 Fichiers Markdown à la Racine (14 fichiers)

### Fichiers à CONSERVER
1. ✅ **CLAUDE.md** - Instructions projet pour Claude Code
2. ✅ **README.md** - Documentation principale (à mettre à jour Phase 5)
3. ✅ **Plan d'Amélioration Global de l'Application.md** - Demande utilisateur de ne pas toucher

### Fichiers à MIGRER vers /documentation/
4. 🔄 **ARCHITECTURE.md** → `documentation/architecture/ARCHITECTURE.md`
5. 🔄 **architecture-frontend-shadcn-ui.md** → `documentation/architecture/frontend-shadcn-ui.md`
6. 🔄 **architecture supabase.md** → `documentation/architecture/backend-supabase.md`
7. 🔄 **README-SECURITE-RLS.md** → `documentation/TECHNICAL_DEBT.md` (section RLS)
8. 🔄 **SUPABASE-FOREIGN-KEY-FIX.md** → `documentation/TECHNICAL_DEBT.md` (section Foreign Keys)
9. 🔄 **ACTIVER-REALTIME-SUPABASE.md** → `documentation/architecture/deployment.md` (section Real-time)
10. 🔄 **DONNÉES-DYNAMIQUES-AGENTS.md** → `documentation/ONBOARDING.md` (section Agents)
11. 🔄 **MEMOIRE-SUPABASE-MCP.md** → `documentation/DEPENDENCIES.md` (section MCP)
12. 🔄 **GEMINI.md** → `documentation/ONBOARDING.md` (section AI Tools)

### Fichiers à SUPPRIMER (obsolètes)
13. ❌ **plan_hebergement.md** - Planification obsolète
14. ❌ **plan_hetzner_docker_ce.md** - Planification obsolète

---

## 🛠️ Scripts npm (package.json)

### Scripts Actifs (7 scripts)
```json
{
  "dev": "set NODE_OPTIONS=--inspect && next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test:e2e": "playwright test",
  "docker:status": "docker ps",
  "docker:clean:supalocal": "docker-compose --file \"C:\\Users\\USER\\mcp\\supabase-migration\\docker-compose.yml\" down"
}
```

### Analyse
- **Scripts principaux**: dev, build, start, lint (essentiels Next.js)
- **Tests**: test:e2e (Playwright)
- **Docker**: 2 scripts utilitaires pour Supabase local

---

## 📂 Contenu du Répertoire /scripts/ (19 items)

### Fichiers SQL (4 fichiers)
1. `activate-realtime.sql` - Activation real-time Supabase
2. `activate-realtime-supabase.sql` - Variant activation real-time
3. `fix-commande-creation.sql` - Fix création commandes
4. `fix-rls-details.sql` - Fix policies RLS
5. `fix-security-warnings.sql` - Corrections sécurité
6. `rls-policies-sql.sql` - Définition policies RLS

### Scripts JavaScript (13 fichiers)
7. `activate-realtime-node.js` - Activation real-time via Node
8. `check-rls-policies.js` - Vérification policies RLS
9. `create-platphoto-bucket.js` - Création bucket images
10. `create-test-details.js` - Tests détails commandes
11. `debug-client-link.js` - Debug lien clients
12. `debug-database-structure.js` - Debug structure BDD
13. `find-details-table.js` - Recherche table détails
14. `fix_admin_queries.js` - Fix requêtes admin
15. `fix-storage-rls.js` - Fix RLS storage
16. `optimize_database_relations.js` - Optimisation relations BDD
17. `simple-storage-test.js` - Test storage Supabase
18. `test-bucket-plats.js` - Test bucket plats
19. `test-realtime-connection.js` - Test connexion real-time
20. `test-update-quantity.js` - Test mise à jour quantités
21. `verify_database_status.js` - Vérification statut BDD

### Fichiers Configuration/Docs (2 fichiers)
22. `GUIDE_DEPLOIEMENT.md` - Guide déploiement
23. `docker-compose.yml` - Configuration Docker

### Scripts Shell (1 fichier)
24. `setup-server.sh` - Script setup serveur

### Répertoires (2 dossiers)
25. `landing-page/` - Page d'accueil standalone
26. `traefik/` - Configuration Traefik reverse proxy

### Analyse Usage
- **Scripts référencés dans package.json**: AUCUN
- **Scripts potentiellement obsolètes**: À confirmer Phase 1 via agents
- **Scripts critiques**: activate-realtime*, fix-rls*, test-*

---

## 📦 Analyse Dépendances (depcheck)

### Dépendances MANQUANTES (1)
```json
{
  "@radix-ui/react-collapsible": [
    "c:\\Users\\USER\\Desktop\\APPChanthana\\components\\ui\\collapsible.tsx"
  ]
}
```
**Action**: Installer `@radix-ui/react-collapsible` en Phase 3

### Dépendances INUTILISÉES (4)
1. `@hookform/resolvers` - Validation formulaires
2. `@tailwindcss/postcss` - PostCSS Tailwind
3. `pg` - Client PostgreSQL
4. `tailwindcss-animate` - Animations Tailwind

**Action**: Supprimer en Phase 4 après validation agents

### DevDependencies INUTILISÉES (5)
1. `@next/eslint-plugin-next` - ESLint Next.js
2. `@types/node` - Types Node.js
3. `autoprefixer` - PostCSS autoprefixer
4. `postcss` - PostCSS
5. `tailwindcss` - Tailwind CSS

**Action**: Vérifier avec agents si réellement inutilisées (possible faux positif pour devDeps)

---

## 🎯 Actions Identifiées pour Phases Suivantes

### Phase 1: Analyse Multi-Agents
- [ ] Analyser scripts/ pour identifier fichiers obsolètes
- [ ] Vérifier si devDependencies "inutilisées" sont vraiment à supprimer
- [ ] Identifier autres fichiers à migrer/supprimer

### Phase 2: Documentation
- [ ] Créer 16 fichiers documentation (sauf n8n-workflows.md)
- [ ] Migrer contenu des 9 .md à fusionner
- [ ] Créer diagrams Mermaid pour ARCHITECTURE.md

### Phase 3: Dépendances
- [ ] Installer `@radix-ui/react-collapsible`
- [ ] Mettre à jour: Supabase 2.58.0, Firebase 12.3.0, TanStack Query 5.90.2, Next.js 15.5.4
- [ ] Valider avec `npm ci` et tests

### Phase 4: Nettoyage Radical
- [ ] Supprimer plan_hebergement.md, plan_hetzner_docker_ce.md
- [ ] Supprimer 9 .md migrés vers /documentation/
- [ ] Supprimer dépendances inutilisées identifiées
- [ ] Supprimer scripts obsolètes identifiés par agents

### Phase 5: README.md
- [ ] Mettre à jour sections Architecture, Scripts, Dépendances
- [ ] Ajouter liens vers /documentation/

### Phase 6: Validation Finale
- [ ] `npx tsc --noEmit` (TypeScript)
- [ ] `npm run lint` (ESLint)
- [ ] `npm run build` (Build Next.js)
- [ ] `npm run test:e2e` (Playwright E2E)

---

## ✅ Phase 0 - Statut Final

- ✅ Branche Git créée: `cleanup/analysis-2025`
- ✅ 14 fichiers .md inventoriés
- ✅ 19 items scripts/ listés
- ✅ 235 fichiers, 67,671 lignes de code comptabilisés (cloc)
- ✅ Dépendances analysées (depcheck)
- ✅ Scripts npm extraits

**Durée réelle Phase 0**: ~10 minutes
**Prochaine étape**: Phase 1 - Analyse Multi-Agents (8 agents, 3 groupes parallèles)

---

**Note**: Toutes les données sont réelles, collectées via `npx cloc`, `npx depcheck`, PowerShell. ZÉRO estimation conformément aux exigences utilisateur.

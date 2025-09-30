# 🧠 MÉMOIRE : Utilisation MCP Supabase pour ce projet

## ⚠️ RÈGLE ABSOLUE

**TOUJOURS utiliser le MCP Supabase ou l'agent Supabase pour interagir avec la base de données de ce projet.**

**NE JAMAIS demander au user d'aller manuellement sur le dashboard Supabase.**

## Informations du projet

- **URL Supabase** : `https://lkaiwnkyoztebplqoifc.supabase.co`
- **Projet ID** : `lkaiwnkyoztebplqoifc`
- **Credentials** : Stockées dans `.env.local`

## Outils disponibles

### 1. MCP Supabase Server
- **Outil MCP** : Devrait être disponible via les outils MCP commençant par `mcp__`
- **Usage** : Exécution directe de requêtes SQL, gestion tables, etc.

### 2. Agent Supabase spécialisé
- **Agent** : Agent fullstack-developer avec accès Supabase MCP
- **Usage** : Tâches complexes nécessitant plusieurs opérations

## Exemples d'utilisation correcte

### ❌ MAUVAIS (ce que je ne dois JAMAIS faire)
```
"Allez sur https://supabase.com/dashboard/..."
"Naviguez vers Database → Replication..."
"Cliquez sur..."
```

### ✅ BON (ce que je dois faire)
```typescript
// Utiliser le MCP Supabase directement
// OU
// Lancer l'agent spécialisé avec Task tool
```

## Actions courantes

### Activer Real-time sur une table
- **Via MCP** : Exécuter SQL directement
- **Via Agent** : Task avec agent fullstack-developer

### Vérifier la structure de la DB
- **Via MCP** : Query sur pg_catalog
- **Via Agent** : Task d'exploration

### Créer/Modifier des tables
- **Via MCP** : Exécuter DDL
- **Via Agent** : Task de migration

### Gérer les RLS policies
- **Via MCP** : Exécuter SQL policies
- **Via Agent** : Task de sécurité

## Pourquoi c'est important

1. **Efficacité** : Évite les allers-retours manuels
2. **Automatisation** : Scripts reproductibles
3. **Documentation** : Traçabilité des changements
4. **Expérience utilisateur** : Le user n'a pas à quitter son IDE

## TODO pour moi (Claude)

- [ ] Identifier les outils MCP Supabase disponibles (chercher `mcp__supabase*`)
- [ ] Tester l'exécution SQL via MCP
- [ ] Documenter les patterns d'usage MCP Supabase pour ce projet
- [ ] Créer des exemples de scripts réutilisables

---

**Date de création** : 2025-09-30
**Rappel** : TOUJOURS utiliser MCP/Agent, JAMAIS demander navigation manuelle dashboard
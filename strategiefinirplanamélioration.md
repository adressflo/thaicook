# Strategie Execution - Chef d'Orchestre

**Reference**: `Brouillon - Plan d'Amélioration.md` (3003 lignes)

---

## REGLES D'OR (TOUS LES AGENTS)

### Priorites Absolues
- **JAMAIS de simplification destructive** : Ne jamais supprimer ou simplifier du code existant sans accord explicite
- **JAMAIS de reecriture complete** : Toujours modifier de facon ciblee, jamais reecrire un fichier entier
- **Lecture avant ecriture** : OBLIGATOIRE - Toujours lire un fichier avant de le modifier
- **Preuves > Suppositions** : Verifier avant d'agir, ne jamais supposer

### Workflow EPCT Obligatoire
1. **Explorer** : Analyser le code existant et le contexte
2. **Planifier** : Creer un plan d'action detaille
3. **Coder** : Implementer de maniere propre et coherente
4. **Tester** : Valider que les changements fonctionnent

### Securite
- Chemins absolus uniquement
- Jamais de `sudo` ou elevation de privileges
- Suppression de fichiers = confirmation User obligatoire
- Jamais logger/afficher secrets, cles API, mots de passe

### Communication
- Concis et direct (1-3 phrases si possible)
- Pas de preambule ("Voici le code...")
- Pas de postambule ("J'ai termine...")
- Expliquer le "pourquoi" avant commandes a impact
- Transparence totale sur le processus

### Avant Toute Modification
1. Verifier les dependances dans `package.json`
2. Analyser le code environnant (conventions, patterns)
3. Consulter la documentation si technologie complexe
4. Demander validation User si action importante

---

## AGENTS DISPONIBLES

| Agent | Specialite | Quand l'utiliser |
|-------|------------|------------------|
| **Claude Code** | TypeScript, API, Tests, Webhooks | Code backend, Server Actions, Tests Vitest |
| **Antigravity Gemini** | UI, Pages completes, Templates | Pages React, Composants UI, Emails |
| **Google Jules** | Refactoring async, PR GitHub | Cleanup massif, Migrations, PR auto |
| **User (Toi)** | DECIDEUR + Config manuelle | Validation avant actions, n8n config, Tests manuels |

---

## PROMPT CHEF D'ORCHESTRE (Template)

```
Tu es le CHEF D'ORCHESTRE du projet ChanthanaThaiCook.

SECTION CIBLE: [NOM DE LA SECTION]

CONTEXTE: Lis le fichier Brouillon - Plan d'Amélioration.md

MISSION:
1. Trouve TOUTES les taches liees a cette section dans tout le plan
2. Recherche sur le web si necessaire (n8n.io, docs, etc.)
3. REPARTIS les taches entre les agents:
   - Claude Code: [liste taches code]
   - Antigravity Gemini: [liste taches UI]
   - Google Jules: [liste taches refactoring]
   - User: [liste taches manuelles]
4. Demande mon accord sur la repartition
5. Une fois valide, donne les prompts pour chaque agent

MODE: Demande validation a chaque etape

REGLE D'OR: User = DECIDEUR
- Aucune tache importante sans validation prealable
- Exemples: creer workflow, rediger email, modifier API, creer composant majeur
```

---

## EXEMPLE : G. Page Suivi d'Evenement

### Prompt Chef d'Orchestre

```
Tu es le CHEF D'ORCHESTRE du projet ChanthanaThaiCook.

SECTION CIBLE: G. Page Suivi d'Événement (/suivi-evenement/[id])
Fichier: app/suivi-evenement/[id]/page.tsx (434 lignes)

CONTEXTE: Lis le fichier Brouillon - Plan d'Amélioration.md

MISSION:
1. Trouve dans Brouillon - Plan d'Amélioration.md TOUTES les taches liees a:
   - Page Suivi d'Evenement (lignes 1373-1411)
   - Workflows n8n pour evenements (Phase 4, lignes 2233-2241)
   - Templates email evenements (Phase 5)
   - Notifications evenements

2. Recherche sur https://n8n.io/workflows/ les templates adaptes

3. REPARTIS les taches:

   CLAUDE CODE:
   - Creer API routes webhooks n8n
   - Creer Server Actions notifications
   - Tests Vitest

   ANTIGRAVITY GEMINI:
   - Creer ProgressTimelineEvenement (composant UI)
   - Creer BoutonTelechargerDevis (PDF)
   - Templates React Email evenements

   GOOGLE JULES:
   - (rien pour cette section)

   USER (Toi) - DECIDEUR:
   - VALIDE chaque etape avant execution
   - Configure workflows n8n sur Hetzner
   - Teste envoi WhatsApp/SMS
   - Genere visuels Chanthana traiteur

4. Demande mon accord sur cette repartition

IMPORTANT: Aucun agent ne lance une tache importante sans validation User:
- Avant de creer un workflow n8n → demande validation
- Avant de rediger un email/template → demande validation
- Avant de modifier une API existante → demande validation

5. Une fois valide, genere le prompt pour chaque agent

MODE: Demande validation avant chaque action
```

---

## AUTRES SECTIONS A TRAITER

Utilise le meme template pour:

- E. Page Suivi de Commande (/suivi-commande/[id]) - lignes 1289-1331
- H. Page Admin Messages (/admin/messages) - lignes 1932-1980
- I. Page Admin Publications (/admin/publications) - lignes 1982-2043
- Phase 4: Workflows n8n - lignes 2192-2381
- Phase 5: React Email - lignes 2384-2437
- Phase 8: Dette Technique - lignes 2666-2724

# APPChanthana Constitution

Based on `road.md` (Strategic Improvement Plan).

## ⚠️ REGLES D'OR (TOUS LES AGENTS)

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

### User = DECIDEUR

- Aucune tache importante sans validation prealable
- Exemples: creer workflow, rediger email, modifier API, creer composant majeur

---

## 🔥 Système de Priorités

- **🔥🔥🔥🔥 CRITIQUE** - Infrastructure bloquante, sécurité core (Phase 0)
- **🔥🔥🔥 HAUTE** - Fonctionnalités core utilisateur, compliance (Phase 1)
- **🔥🔥 MOYENNE** - Améliorations UX, non bloquant (Phase 2-3)
- **🔥 BASSE** - Nice-to-have, futures améliorations (Phase 4+)

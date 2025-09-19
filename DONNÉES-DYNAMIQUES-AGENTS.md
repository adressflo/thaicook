
# 📊 DONNÉES DYNAMIQUES - ENVIRONNEMENT DE TEST

**⚠️ ATTENTION AGENTS :** Les données ci-dessous sont en **ENVIRONNEMENT DE TEST** et évoluent rapidement.

## 🚨 INSTRUCTIONS POUR LES AGENTS

### ❌ NE PAS UTILISER - DONNÉES BACKEND FIGÉES
Les chiffres figés dans "ANALYSE DÉTAILLÉE DES TABLES" de architecture supabase.md :
- client_db: 13 (OBSOLÈTE)
- plats_db: 20 (OBSOLÈTE)
- commande_db: 44 (OBSOLÈTE)
- details_commande: 97 (OBSOLÈTE)
- evenements_db: 14 (OBSOLÈTE)
- notification_templates: 12 (OBSOLÈTE)

### ❌ NE PAS UTILISER - DONNÉES FRONTEND FIGÉES  
Les chiffres figés dans architecture-frontend-shadcn-ui.md :
- shadcn_components: 53 (OBSOLÈTE)
- radix_primitives: 25 (OBSOLÈTE)
- lucide_icons: 539 (OBSOLÈTE)
- bundle_size: 2.1MB (OBSOLÈTE)
- first_paint: 200ms (OBSOLÈTE)
- interactive: 500ms (OBSOLÈTE)

### ✅ UTILISER À LA PLACE

#### Backend - Requêtes Supabase temps réel :
```sql
-- Données backend actuelles
SELECT COUNT(*) as clients_count FROM client_db WHERE active = true;
SELECT COUNT(*) as plats_count FROM plats_db WHERE disponible = true;
SELECT COUNT(*) as commandes_count FROM commande_db WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
SELECT COUNT(*) as evenements_count FROM evenements_db WHERE statut != 'annule';
```

#### Frontend - Vérifications filesystem temps réel :
```bash
# Compter les vrais composants shadcn/ui
find ./components/ui -name "*.tsx" | wc -l

# Analyser le bundle actuel
npm run build && npm run analyze

# Mesurer les performances réelles
npx lighthouse http://localhost:3000 --only-categories=performance
```

### 🎯 STRATÉGIES RECOMMANDÉES PAR AGENT

#### Agent Supabase Chanthana
1. **Toujours interroger la base** pour les métriques de sizing/performance
2. **Ne jamais se fier** aux chiffres de l'architecture pour les recommandations
3. **Considérer l'évolution rapide** en environnement de test
4. **Prévoir la scalabilité** pour x10 les volumes actuels

#### Agent shadcn/ui Chanthana  
1. **Compter les composants réels** via filesystem (find ./components/ui)
2. **Mesurer les performances actuelles** via Lighthouse/WebVitals
3. **Analyser le bundle réel** via webpack-bundle-analyzer
4. **Vérifier l'accessibilité** via tests automatisés

#### Agent Next.js Chanthana
1. **Analyser le build actuel** (npm run build) 
2. **Mesurer les Core Web Vitals** en temps réel
3. **Vérifier la structure des routes** via filesystem
4. **Optimiser selon les métriques réelles**

#### Agent Firebase Auth Chanthana
1. **Vérifier la configuration actuelle** Firebase
2. **Analyser les providers activés** dans la console
3. **Mesurer les performances d'auth** en temps réel
4. **Optimiser selon l'usage réel**

---

**🔄 Dernière mise à jour :** 2025-09-19T19:30:42.158Z
**📍 Environnement :** TEST - Données évolutives
**🎯 Recommandation :** Toujours vérifier en temps réel

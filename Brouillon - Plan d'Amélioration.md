### 🎯 Plan d'Amélioration Stratégique : ChanthanaThaiCook
Notre feuille de route pour faire évoluer l'expérience ChanthanaThaiCook. Ce document est notre espace de collaboration pour construire l'avenir de l'application.

### 🔧 Phase 0 : Infrastructure et Outils Modernes (Préparatoire)
**Préparation des fondations techniques avec 13 outils octobre 2025**
**1️⃣ Prisma ORM - Migration Base de Données**
✅ **Infrastructure complétée** (2025-10-12)
- [x] Schéma Prisma généré avec 26 modèles depuis Supabase
- [x] Types TypeScript auto-générés et BigInt corrigés
- [x] Tests CRUD validés : `npm run prisma:test` (18 tests ✅)

✅ **Migration application COMPLÈTE** (2025-10-27)
- [x] Server Actions créés : `app/actions/*.ts` (5 fichiers, 100% CRUD)
  - clients.ts, plats.ts, commandes.ts, extras.ts, evenements.ts
- [x] Hooks Prisma créés : `hooks/usePrismaData.ts` (44 hooks TanStack Query)
  - Clients: 7 hooks (CRUD + search)
  - Plats: 4 hooks (CRUD complet)
  - Commandes: 15 hooks (CRUD + relations + détails)
  - Extras: 4 hooks (CRUD complet)
  - Evenements: 7 hooks (CRUD + relations)
- [x] Migration 100% des composants : 17 pages + 10 composants
  - app/profil, app/commander, app/panier, app/admin/*, app/suivi-*, etc.
  - Tous les composants utilisent usePrismaData.ts
- [x] Nettoyage `hooks/useSupabaseData.ts` : **2904 → 361 lignes (-87%)**
  - Supprimé 36 hooks obsolètes (CRUD remplacés par Prisma)
  - Gardé 8 hooks légitimes (Realtime, Ruptures, Listes de courses)
- [x] Nettoyage `services/supabaseService.ts` : **408 → 12 lignes (-97%)**
  - Classe complète supprimée, simple export client Supabase
- [x] Suppression 3 fichiers obsolètes (useSupabase.ts, useSupabaseNotifications.ts, supabaseAdmin.ts)
- [x] **Total : -3200 lignes de code obsolète supprimées**
- [x] Tests CRUD validés : `tests/prisma-crud.test.ts` (mis à jour auth_user_id)
- [x] Correction TypeScript : **27 erreurs → 0 erreur** ✅

📊 **Statut : Infrastructure 100% ✅ | Application 100% ✅ | Global 100% ✅**
📖 **Doc :** `documentation/prisma-migration.md`
🔗 **Commits :**
  - `2347e59` - backup avant nettoyage
  - `c169c55` - nettoyage massif (-3200 lignes)
  - `35f58ae` - correction toutes erreurs TypeScript

**2️⃣ n8n - Préparation Intégrations**
✅ **Déjà hébergé sur serveur Hetzner** (pas d'installation requise)

**Configuration initiale :**
- [ ] Vérifier instance n8n opérationnelle et accessible
- [ ] Configurer webhooks entrants depuis Next.js
- [ ] Tester connexion Next.js → n8n (ping/pong simple)

**Intégrations tierces à préparer :**
- [ ] **Brevo/SendGrid** : Compte + API key pour emails transactionnels
- [ ] **Telegram Bot** : Création bot + token pour notifications admin
- [ ] **WhatsApp Business API** : Vérification compte + configuration
- [ ] **Twilio/Vonage** : Évaluation coût SMS (optionnel)

📋 **Note :** Les workflows détaillés seront définis dans la section dédiée **§IV. n8n Workflows** en analysant page par page les besoins spécifiques.

**3️⃣ React Email - Templates Professionnels**
- [x] Installation et configuration de base (`react-email`, `resend`)
- [x] Création du dossier `emails` et du template de bienvenue
- [ ] Créer les templates transactionnels (détaillés dans la nouvelle section V)
- [ ] Intégrer l'envoi dans l'application via des Server Actions
- [ ] Configurer la clé API Resend dans le fichier `.env.local`
- [ ] Tester l'envoi des emails (simulé et réel)
- [ ] Tests visuels sur différents clients email

**4️⃣ Next Safe Action - Server Actions Sécurisés**
- [x] Installation de la bibliothèque `next-safe-action`
- [x] Création du client d'action public dans `lib/safe-action.ts`
- [x] ✅ **Better Auth déjà installé et configuré** (voir section 5️⃣)
- [x] Middleware d'authentification disponible via Better Auth (`middleware.ts`)
- [ ] Valider l'installation avec une action de test
- [ ] Migration de toutes les autres Server Actions
- [ ] Création des schémas de validation Zod pour chaque action
- [ ] Gestion d'erreurs unifiée pour les retours d'action
- [ ] Tests unitaires des actions critiques

💡 **Note :** Les Server Actions actuels utilisent déjà `auth.api.getSession()` pour la sécurité (voir `app/profil/actions.ts`).

**5️⃣ Better Auth - Authentication Moderne TypeScript**
✅ **Migration COMPLÈTE depuis Firebase Auth** (2025-10-27)
- [x] Installation et configuration initiale (MIT License, gratuit)
- [x] Configuration serveur : `lib/auth.ts` (Prisma adapter + email/password)
- [x] Configuration client : `lib/auth-client.ts` (hooks React useSession, signIn, signUp)
- [x] API Route : `app/api/auth/[...all]/route.ts` configurée
- [x] Tables Better Auth dans Prisma : User, Account, Session, Verification
- [x] Pages d'authentification créées :
  - `app/auth/login/page.tsx` (connexion email/password)
  - `app/auth/signup/page.tsx` (inscription complète)
  - `app/auth/reset-password/page.tsx` (réinitialisation mot de passe)
- [x] Synchronisation User ↔ client_db :
  - Server Action : `app/auth/actions.ts` - `createClientProfile(authUserId, data)`
  - Lien : User.id → client_db.auth_user_id
- [x] Protection des routes :
  - Middleware : `middleware.ts` (vérifie cookie better-auth.session_token)
  - PrivateRoute : `components/PrivateRoute.tsx` (useSession Better Auth)
  - AdminRoute : `components/AdminRoute.tsx` (useSession + vérification role)
- [x] Server Actions migrés : `app/profil/actions.ts` utilise `auth.api.getSession()`
- [x] **Firebase Auth 100% supprimé** :
  - ❌ lib/firebaseConfig.ts (supprimé)
  - ❌ contexts/AuthContext.tsx (supprimé)
  - ❌ Aucune dépendance Firebase dans package.json
- [x] Tests authentification : Build 0 erreur TypeScript
- [ ] Configuration 2FA et passkeys pour sécurité renforcée (Phase 4 - futur)

📊 **Statut : 100% ✅ - Migration Better Auth TERMINÉE**
🔗 **Architecture finale :**
  - User authentication : Better Auth (email/password)
  - User profile : Prisma client_db (auto-sync via auth_user_id)
  - Sessions : Better Auth cookies + middleware
  - CRUD operations : Prisma ORM Server Actions

**6️⃣ nuqs - URL State Management Type-Safe**
- [ ] Installation de la bibliothèque nuqs (NPM, gratuit)
- [ ] Implémentation filtres menu avec query params typés
- [ ] Migration pagination historique vers nuqs
- [ ] Setup recherche clients avec URL state sync
- [ ] Tests navigation et bookmarking d'états filtrés

**7️⃣ next-intl - Internationalization App Router**
- [ ] Configuration routing multilingue (fr/th/en)
- [ ] Structure répertoires locales et fichiers traductions
- [ ] Migration textes UI vers système i18n type-safe
- [ ] Traduction contenu statique (menu, événements)
- [ ] Tests changement langue et SSR multilingue

**8️⃣ react-pdf - Génération Documents PDF**
- [x] Installation react-pdf et configuration (NPM, gratuit)
- [ ] Création template facture commande (design Thai)
- [ ] Création template devis événement professionnel
- [ ] Génération tickets de caisse pour impression
- [ ] Tests PDF sur différents appareils et navigateurs

**9️⃣ Vitest - Tests Unitaires Modernes**
- [ ] Installation : `npm install -D vitest @testing-library/react @testing-library/jest-dom`
- [ ] Configuration vitest.config.ts avec support React + TypeScript
- [ ] Scripts tests unitaires pour hooks (useSupabaseData, useAuth)
- [ ] Tests validation Zod et fonctions utilitaires
- [ ] Intégration CI/CD pour exécution automatique tests

**🔟 Upload Fichiers Native - Stockage Local Hetzner**
- [ ] Création Server Action pour upload avec FormData Next.js 15
- [ ] Configuration dossier `/public/uploads` (80GB disque local)
- [ ] Validation fichiers : taille max, types MIME autorisés (images)
- [ ] Implémentation `fs/promises.writeFile()` pour stockage
- [ ] Tests upload photos plats, événements, avatars

**1️⃣1️⃣ Stack PLG - Monitoring Infrastructure & Logs**
- [ ] Installation Prometheus via image pré-configurée Hetzner Cloud
- [ ] Configuration node_exporter pour métriques serveur (CPU, RAM, Disk, Network)
- [ ] Installation Loki pour centralisation logs application Next.js
- [ ] Setup Grafana + connexion sources (Prometheus + Loki)
- [ ] Import dashboards communautaires (Hetzner Server + Next.js App)
- [ ] Configuration alertes automatiques (CPU > 80%, RAM > 90%, Disk > 85%)
- [ ] Tests corrélation métriques serveur ↔ logs application

**1️⃣2️⃣ GlitchTip - Monitoring Erreurs Application**
- [ ] Setup Docker Compose (PostgreSQL + Redis + GlitchTip)
- [ ] Configuration sous-domaine monitoring.chanthana.com
- [ ] Installation SDK `@sentry/nextjs` dans projet
- [ ] Configuration DSN pointant vers GlitchTip self-hosted
- [ ] Intégration error boundaries avec envoi automatique erreurs
- [ ] Configuration alertes email pour erreurs critiques
- [ ] Tests capture erreurs (client-side + server-side)

**1️⃣3️⃣ UptimeRobot - Monitoring Disponibilité Externe**
- [ ] Création compte gratuit UptimeRobot (50 monitors inclus)
- [ ] Configuration monitors : homepage, /api/health, /admin, /commander
- [ ] Setup alertes email + SMS optionnel si site down
- [ ] Configuration interval checks (5 minutes)
- [ ] Tests notifications downtime et recovery

---

### 🏗️ Architecture Technique Actuelle
**Vue d'ensemble de la stack technique après migration Prisma ORM + Better Auth (Octobre 2025)**

#### Stack Complète
```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 15.5.4 App Router (React 19.1.1 + TypeScript 5)   │
├─────────────────────────────────────────────────────────────┤
│  Authentication : Better Auth 1.3.28                        │
│    ├── lib/auth.ts (serveur) + lib/auth-client.ts (client) │
│    ├── Sessions : Cookies (better-auth.session_token)      │
│    └── Protection : middleware.ts + PrivateRoute/AdminRoute │
├─────────────────────────────────────────────────────────────┤
│  Database ORM : Prisma 6.17.1                               │
│    ├── CRUD : app/actions/*.ts (Server Actions)            │
│    ├── Cache : hooks/usePrismaData.ts (44 hooks)           │
│    └── Client-side : TanStack Query 5.90.2                 │
├─────────────────────────────────────────────────────────────┤
│  Supabase 2.58.0 (PostgreSQL + Fonctionnalités)            │
│    ├── Realtime : hooks/useSupabaseData.ts (1 hook)        │
│    ├── Storage : Images (plats, avatars, événements)       │
│    └── Direct queries : Ruptures (4 hooks) + Shopping (3)  │
├─────────────────────────────────────────────────────────────┤
│  UI/UX : shadcn/ui + Radix UI + Tailwind CSS 4.1.12        │
│  Tests : Playwright 1.55.0 (E2E)                            │
└─────────────────────────────────────────────────────────────┘
```

#### Séparation des Responsabilités

| Fonctionnalité | Technologie | Fichiers Clés | Statut |
|----------------|-------------|---------------|---------|
| **Authentication** | Better Auth | `lib/auth.ts`, `lib/auth-client.ts`, `middleware.ts` | ✅ 100% |
| **User Profiles** | Prisma ORM | `app/actions/clients.ts`, `hooks/usePrismaData.ts` | ✅ 100% |
| **CRUD Clients** | Prisma ORM | `app/actions/clients.ts` (7 Server Actions) | ✅ 100% |
| **CRUD Plats** | Prisma ORM | `app/actions/plats.ts` (4 Server Actions) | ✅ 100% |
| **CRUD Commandes** | Prisma ORM | `app/actions/commandes.ts` (15 Server Actions) | ✅ 100% |
| **CRUD Extras** | Prisma ORM | `app/actions/extras.ts` (4 Server Actions) | ✅ 100% |
| **CRUD Événements** | Prisma ORM | `app/actions/evenements.ts` (7 Server Actions) | ✅ 100% |
| **Realtime Sync** | Supabase Realtime | `hooks/useSupabaseData.ts` (useCommandesRealtime) | ✅ 100% |
| **Images Upload** | Supabase Storage | `lib/supabase.ts` → storage.upload() | ✅ 100% |
| **Ruptures Plats** | Supabase Direct | `hooks/useSupabaseData.ts` (4 hooks) | ✅ 100% |
| **Shopping Lists** | Supabase Direct | `hooks/useSupabaseData.ts` (3 hooks) | ✅ 100% |
| **Client Cache** | TanStack Query | `hooks/usePrismaData.ts` + `hooks/useSupabaseData.ts` | ✅ 100% |

#### Métriques Codebase (Après Nettoyage - 2025-10-27)

| Métrique | Valeur | Notes |
|----------|--------|-------|
| **Erreurs TypeScript** | 0 | ✅ Build production ready |
| **Code obsolète supprimé** | -3200 lignes | 3 fichiers supprimés + 2 réécrits |
| **hooks/useSupabaseData.ts** | 361 lignes | Était 2904 (-87%) |
| **services/supabaseService.ts** | 12 lignes | Était 408 (-97%) |
| **Server Actions Prisma** | 5 fichiers, 37 actions | 100% CRUD couvert |
| **Hooks TanStack Query** | 44 hooks Prisma + 8 hooks Supabase | Séparation claire |
| **Pages migrées** | 17 pages + 10 composants | 100% utilisent Prisma |

#### Flux de Données Actuel

**Création de Compte & Authentification :**
```
1. User → app/auth/signup/page.tsx
2. Better Auth → User table (auth.user)
3. Server Action → createClientProfile(auth_user_id)
4. Prisma → client_db (avec auth_user_id = User.id)
5. Session → Cookie (better-auth.session_token)
```

**Opérations CRUD (Exemple : Commandes) :**
```
1. Client Component → usePrismaCommandes() (TanStack Query)
2. Hook → Server Action (app/actions/commandes.ts)
3. Server Action → Prisma Client
4. Prisma → Supabase PostgreSQL (commande_db, details_commande_db)
5. Response → Cache TanStack Query → UI Update
```

**Synchronisation Realtime (Admin ↔ Client) :**
```
1. Admin modifie commande → Prisma ORM (UPDATE commande_db)
2. Supabase Realtime → Détecte changement postgres_changes
3. useCommandesRealtime() → Écoute canal 'commandes-realtime-channel'
4. Callback → queryClient.invalidateQueries('prisma-commandes')
5. TanStack Query → Refetch automatique → UI Client mise à jour
```

#### Documentation Technique

- **Architecture globale** : `documentation/architecture-overview.md`
- **Better Auth** : `documentation/hybrid-auth-architecture.md` (à mettre à jour)
- **Prisma ORM** : `documentation/prismadoc.md` + `documentation/prisma-migration.md`
- **État management** : `documentation/state-management.md`
- **Schéma DB** : `documentation/database-schema.md`
- **Realtime** : `documentation/real-time-subscriptions.md`

#### Prochaines Étapes Techniques

1. **Next Safe Action** : Migration Server Actions vers validation Zod
2. **Tests E2E** : Compléter suites Playwright (4 tests critiques)
3. **Upload Local** : Migrer Supabase Storage → Hetzner local storage
4. **RLS Policies** : Réactiver Row Level Security Supabase (Phase 4)

---

### 🚀 Phase 1 : Fondations et Expérience Globale
**📱 Vers une Expérience Native : PWA &amp; Notifications**
- [ ] Fondations PWA : Mettre en place les bases de la Progressive Web App (Service Worker, Manifest) pour rendre l'application installable.
- [ ] Notifications Push : Intégrer Firebase Cloud Messaging comme canal de communication prioritaire et gratuit.
- [ ] Stratégie de Communication Hybride :
- [ ] Priorité 1 : Envoyer systématiquement les alertes via Notification Push PWA si l'utilisateur a donné son consentement.
- [ ] Priorité 2 : Envoyer en parallèle une notification sur le canal préféré du client (WhatsApp, SMS, Telegram) via n8n.
- [ ] Mode Hors-ligne : Mettre en place un fonctionnement hors-ligne de base (consultation du menu).

**✅ Qualité, Stabilité et Fiabilité**
- [ ] Tests Automatisés : Définir et écrire des tests pour les parcours utilisateurs critiques (commande, authentification, etc.) afin de garantir la stabilité et d'éviter les régressions.
- [ ] Accessibilité : S'assurer que l'ensemble de l'application respecte les bonnes pratiques d'accessibilité.

**🤖 Automatisation Intelligente avec n8n**
- [ ] Intégration n8n : Planifier et intégrer les webhooks n8n pour les notifications de commande (SMS, WhatsApp, Telegram, etc.).
- [ ] Emailing : Rechercher et configurer un service d'email transactionnel (Brevo ou SendGrid en priorité pour leurs offres gratuites).
- [ ] Bot Telegram : Mettre en place un bot Telegram pour les notifications gratuites.

**⚡️ Performance &amp; Fluidité de Navigation**
- [ ] Optimisation Globale : Analyser l'application pour identifier les points à améliorer en termes de vitesse de chargement et de réactivité.
- [ ] Navigation Simplifiée :
    - [ ] Supprimer la page /suivi qui est redondante avec la page /historique.
    - [ ] Mettre à jour le lien "Suivi &amp; historique" sur la page d'accueil pour qu'il pointe directement vers /historique.

### 📄 Phase 2 : Améliorations Ciblées par Page
**🏠 A. Page d'Accueil (/)**
*Améliorer le pied de page*
- [ ] Ajouter les jours et horaires d'ouverture.
- [ ] Intégrer des icônes cliquables vers les réseaux sociaux (Facebook, Instagram, etc.).
*Ajouter un sélecteur de langue*
- [ ] Permettre aux utilisateurs de changer la langue du site.

**🛒 B. Page Commander (/commander)**
*Améliorer l'affichage de la quantité dans le panier*
- [ ] Remplacer le texte "X dans le panier" par une icône de panier (ShoppingCart) avec un badge indiquant la quantité.
*Ajouter des badges spéciaux aux plats*
- [ ] Mettre en avant les plats végétariens, épicés ou populaires avec des icônes ou des badges visuels.
*Optimiser l'expérience mobile*
- [ ] Simplifier la navigation entre les étapes (choix du jour, sélection des plats, panier) avec une interface adaptée (ex: menu de navigation en bas de l'écran).

**🛍️ C. Page Panier (/panier)**
*Gestion des Articles*
- [ ] Sauvegarde du Panier : Si un utilisateur non connecté remplit son panier, lui proposer de le sauvegarder en créant un compte pour ne pas perdre sa sélection.
*Expérience Utilisateur*
- [ ] Confirmation Visuelle : Après validation de la commande, afficher une page de confirmation plus visuelle et engageante, avec un récapitulatif de la commande et un message de remerciement.
*Améliorer l'affichage du message de confirmation*
- [ ] Modifier le fond du message (toast) de confirmation de commande pour qu'il soit blanc, afin d'améliorer la lisibilité.
*Gestion de l'heure de retrait*
- [ ] Ajouter une note précisant que l'heure de retrait est indicative et peut être ajustée.
- [ ] Côté admin, permettre de proposer une nouvelle heure de retrait.
- [ ] Mettre en place une notification (via n8n) pour informer le client de la nouvelle proposition d'heure.

**📜 D. Page Historique (/historique) &amp; (/historique/complet)**
*Refonte de la Page*
- [ ] Commandes Récentes :
    - [ ] Limiter l'affichage aux 3 à 5 dernières commandes terminées.
    - [ ] Ajouter un bouton icône "Facture" pour les commandes avec le statut "Récupérée".
- [ ] Événements Récents :
    - [ ] Limiter l'affichage aux 3 derniers événements terminés.
    - [ ] Ajouter un bouton icône "Devis" pour les événements.
    - [ ] Ajouter un bouton icône "Facture" pour les événements facturés.
- [ ] Créer une page dédiée :
    - [ ] Mettre en place un bouton "Voir tout l'historique" qui redirige vers une nouvelle page /historique/complet.
*Nouvelle Page "Historique Complet" (/historique/complet)*
- [ ] Filtres Avancés : Intégrer un filtre de recherche par nom de plat, date, ou statut pour les commandes et événements.
- [ ] Vue Calendrier : Proposer une vue calendrier pour naviguer facilement dans les commandes et événements passés.
- [ ] Actions sur les Commandes :
    - [ ] Export de Facture : Permettre de télécharger la facture en PDF pour chaque commande "Récupérée".
    - [ ] "Commander à Nouveau" : Ajouter un bouton pour recommander facilement une commande passée.
- [ ] Actions sur les Événements :
    - [ ] Export de Devis/Facture : Permettre de télécharger le devis et/ou la facture en PDF pour chaque événement.

**📍 E. Page Suivi de Commande (/suivi-commande/[id])**
*Informations Pratiques*
- [ ] Carte de localisation : Intégrer une petite carte (Google Maps ou autre) sous le bouton "Voir sur la carte" pour une visualisation rapide.
- [ ] Contact Rapide : Ajouter des boutons d'action pour appeler directement ou envoyer un SMS en un clic.
*Expérience Post-Commande*
- [ ] Laisser un Avis : Une fois la commande marquée comme "Récupérée", afficher un petit formulaire simple pour que le client puisse laisser un avis.
- [ ] Bouton Facture : Ajouter un bouton icône "Facture" pour les commandes avec le statut "Récupérée".
*Notifications et Alertes*
- [ ] Notifications Push (via PWA et n8n) : Envoyer des notifications push pour chaque changement de statut de la commande.

**✏️ F. Page Modifier Commande (/modifier-commande/[id])**
*Interaction Utilisateur*
- [ ] Mettre en place une boîte de dialogue de confirmation avant de sauvegarder les modifications, qui récapitule les changements et la différence de prix.
- [ ] (Côté Admin) Garder une trace des modifications apportées à une commande (qui a modifié, quand, et quels changements ont été faits).
*Notifications et Communication*
- [ ] (Intégration n8n) Envoyer une notification à l'administrateur lorsqu'un client modifie sa commande.
- [ ] (Intégration n8n) Envoyer une confirmation détaillée au client après la sauvegarde des modifications.
*Gestion de l'heure de retrait (rappel)*
- [ ] Ajouter une note précisant que l'heure de retrait est indicative et peut être ajustée.
- [ ] Côté admin, permettre de proposer une nouvelle heure de retrait.
- [ ] Mettre en place une notification (via n8n) pour informer le client de la nouvelle proposition d'heure.

**🎉 G. Page Suivi d'Événement (/suivi-evenement/[id])**
*Chronologie de l'Événement*
- [ ] Suivi Visuel : Ajouter une chronologie visuelle des étapes clés de l'organisation ("Demande reçue", "Devis envoyé", "Confirmé", etc.).
*Gestion des Documents*
- [ ] Accès Centralisé : Créer une section où le client peut télécharger le devis et la facture finale en PDF.
*Communication et Actions*
- [ ] Contact Rapide Amélioré : Ajouter un bouton "Poser une question" qui ouvre une fenêtre de messagerie pré-remplie.
- [ ] Validation du Devis : Mettre en place un bouton "Accepter le devis" qui notifie l'administrateur via n8n.
*Intégration n8n pour les Rappels*
- [ ] Configurer n8n pour envoyer des rappels automatiques au client avant l'événement et un message de remerciement après.

**👤 H. Page Profil (/profil) & Inscription (/auth/signup)**
*✅ Améliorations UI/UX Complétées (2025-11-01)*
- [x] ✅ **Sélecteur de date de naissance amélioré** : Remplacé l'input HTML5 `type="date"` par un composant `DateBirthSelector` (3 selects: Jour/Mois/Année) pour une meilleure accessibilité.
  - [x] Composant créé : `components/forms/DateBirthSelector.tsx` (réutilisable)
  - [x] Implémenté dans `/profil` : Remplacement complet, réduction de ~150 lignes de code
  - [x] Implémenté dans `/auth/signup` : Interface cohérente avec profil
- [x] ✅ **Harmonisation formulaire signup avec profil** :
  - [x] "Adresse (numéro et rue)" : Label identique entre signup et profil
  - [x] "Vos Préférences" : Changé de `Input` → `Textarea` avec placeholder "Allergies, végan, plat préféré..."
  - [x] "Comment avez-vous connu ChanthanaThaiCook ?" : Formulation et style identiques
  - [x] "Newsletter" : Changé de `Checkbox` → `RadioGroup` ("Oui, j'accepte" / "Non") avec "Oui, j'accepte" par défaut

*Intégration n8n pour la Communication*
- [ ] Messages d'Anniversaire : Envoyer automatiquement un message de vœux le jour de l'anniversaire du client.
- [ ] Actualités et Offres : Mettre en place un système d'envoi d'e-mails pour les actualités et les offres spéciales.
*Gestion du Compte*
- [ ] Sécurité :
    - [ ] Modification d'E-mail Sécurisée : Exiger le mot de passe actuel avant de permettre la modification de l'adresse e-mail.
    - [ ] Suppression de Compte : Ajouter une fonctionnalité de suppression de compte.
- [ ] Améliorations de l'Interface de Connexion :
    - [ ] Mot de Passe Oublié : Ajouter une fonctionnalité de réinitialisation du mot de passe.
    - [ ] Design des Boutons : Inverser les boutons "Se connecter" et "Créer un compte" et revoir le design des icônes.

### 🛠️ III. Améliorations de l'Interface Administrateur
**📋 Page Admin / Commandes (/admin/commandes)**
- [ ] Factures (n8n) : Ajouter un bouton sur les commandes "Terminées" pour déclencher un workflow n8n qui génère et envoie la facture au client.
- [x] ✅ **Sélecteur de date amélioré** : Remplacé l'input HTML5 `type="date"` par un composant `DateSelector` (3 selects: Jour/Mois/Année) pour une meilleure expérience utilisateur. (2025-11-01)
  - [x] Composant créé : `components/forms/DateSelector.tsx`
  - [x] Type modifié : `selectedDate` de `string | null` → `Date | undefined`
  - [x] Navigation par date fonctionnelle (Jour précédent, Jour suivant, Aujourd'hui)
- [ ] Notification de retard via n8n : Ajouter un bouton permettant à l'administrateur d'envoyer une notification de retard prédéfinie au client (ex: "Votre commande aura 5 minutes de retard").
- [ ] Automatisation des notifications de statut (n8n) : Déclencher automatiquement des notifications SMS/WhatsApp lorsque le statut d'une commande passe à "Prête à récupérer".
- [ ] Impression automatique des tickets de caisse (n8n) : Mettre en place un workflow n8n pour imprimer les nouveaux tickets de caisse dès qu'une commande est "Confirmée".
- [ ] Demande d'avis automatisée (n8n) : Envoyer automatiquement une demande d'avis par e-mail ou SMS une heure après qu'une commande soit "Récupérée".
- [x] ✅ **"Mettre en avant" une commande** : Bouton épingler/désépingler ajouté avec tri automatique des commandes épinglées en haut. (2025-10-31)
- [x] ✅ **Offrir un plat** : Fonctionnalité ajoutée pour marquer un plat comme "offert" (prix à 0€) dans une commande existante. (2025-10-31)

**🍲 Page Admin / Plats (/admin/plats)**
*Mise en place d'un système de gestion de stock par exception :*
- [ ] Modification Base de Données : Créer une nouvelle table ruptures_exceptionnelles (plat_id, date_rupture, quantite_initiale, quantite_restante).
- [ ] Interface Admin : Sur /admin/plats, intégrer le composant DateRuptureManager pour permettre de définir une rupture pour un plat à une date précise, avec ou sans quantité limitée.
- [ ] Décompte Automatique : Créer une fonction Postgres qui décrémente quantite_restante dans ruptures_exceptionnelles à chaque commande "Confirmée".
- [ ] Affichage Côté Client : Sur les pages /commander et /modifier-commande, si une rupture avec quantité existe pour un plat à la date choisie, afficher un badge "Plus que X disponibles !".
- [ ] Gestion de la Rupture Totale : Si une rupture sans quantité (ou quantité 0) existe pour un plat, le désactiver et afficher "Épuisé pour aujourd'hui".
*Expérience Utilisateur (UX) &amp; Sécurité*
- [ ] Ajouter une confirmation avant la suppression d'un extra.
*Fonctionnalité : Transférer un extra vers le menu principal*
- [ ] Ajouter un bouton "Ajouter au menu" sur chaque extra dans la liste.
- [ ] Au clic, ouvrir la modale de création de plat en pré-remplissant les informations de l'extra (nom, prix, description, image).
- [ ] Après la création du plat, proposer de désactiver ou de supprimer l'extra d'origine pour éviter les doublons.

**👥 Page Admin / Clients (/admin/clients)**
*Cette section est vide pour le moment.*

**➕ Page Admin / Création de Commande (/admin/commandes/creer)**
*Ajouter la création de commandes manuelles*
- [ ] Bouton d'action : Ajouter un bouton "Nouvelle Commande" sur la page de gestion des commandes.
- [ ] Nouvelle Route : Créer la page dédiée app/admin/commandes/creer pour le formulaire de création.
*Développer le formulaire de création*
- [ ] Étape 1: Sélection du Client : Mettre en place un champ de recherche pour trouver un client existant ou un bouton pour en créer un nouveau à la volée.
- [ ] Étape 2: Composition de la Commande : Interface pour ajouter des plats, sélectionner des extras et ajuster les quantités.
- [ ] Étape 3: Détails de la Commande : Définir l'heure de retrait, le type de livraison et ajouter des commentaires.
- [ ] Étape 4: Validation : Afficher un récapitulatif complet de la commande avant la validation finale et l'enregistrement en base de données.

**🧑‍➕ Page Admin / Création de Client (/admin/clients/creer)**
*Ajouter la création de clients manuels*
- [ ] Bouton d'action : Ajouter un bouton "Nouveau Client" sur la page app/admin/clients.
- [ ] Nouvelle Route : Créer la page dédiée app/admin/clients/creer pour le formulaire de création.
- [ ] Formulaire de création : Développer un formulaire pour saisir les informations du client (prénom, nom, email, téléphone, etc.).
- [ ] Validation et Enregistrement : Valider les données et créer le nouveau client dans la base de données.

### 🤖 IV. n8n Workflows - Automatisations par Page
*Cette section définit les workflows n8n spécifiques à créer en analysant les besoins de chaque page. Les workflows seront complétés au fur et à mesure de l'analyse détaillée.*

**Architecture générale :**
```
Next.js App → Webhook POST → n8n → Fan-out multicanal
                                   ├── SMS/WhatsApp
                                   ├── Email (Brevo/SendGrid)
                                   ├── Telegram Bot
                                   └── Server Action (PDF, etc.)
```

#### 📦 A. Workflows Commandes (/commander, /panier, /suivi-commande)
*À définir lors de l'analyse détaillée des pages commandes*

**Besoins identifiés :**
- [ ] Notification changement statut (Confirmée → En préparation → Prête → Récupérée)
- [ ] Génération + envoi facture automatique (statut "Récupérée")
- [ ] Notification retard personnalisée (admin → client)
- [ ] Demande avis post-commande (1h après "Récupérée")
- [ ] Notification modification commande (client → admin)

#### 🎉 B. Workflows Événements (/evenements, /suivi-evenement)
*À définir lors de l'analyse détaillée des pages événements*

**Besoins identifiés :**
- [ ] Confirmation réception demande (automatique)
- [ ] Notification envoi devis (admin → client)
- [ ] Rappel 48h avant événement (SMS + Email)
- [ ] Rappel 24h avant événement (WhatsApp)
- [ ] Message remerciement 24h après événement
- [ ] Relance paiement solde si nécessaire

#### 👤 C. Workflows Profil & Clients (/profil, /admin/clients)
*À définir lors de l'analyse détaillée*

**Besoins identifiés :**
- [ ] Message anniversaire automatique (cron quotidien)
- [ ] Newsletter actualités/offres (manuel ou programmé)
- [ ] Confirmation modification email/téléphone

#### 🍜 D. Workflows Gestion Menu (/admin/plats)
*À définir lors de l'analyse détaillée*

**Besoins identifiés :**
- [ ] Alerte stock faible (webhook depuis Prisma)
- [ ] Notification plat épuisé vers clients ayant commandé récemment

#### 📊 E. Workflows Admin Généraux (/admin/*)
*À définir lors de l'analyse détaillée*

**Besoins identifiés :**
- [ ] Impression automatique tickets de caisse (commande "Confirmée")
- [ ] Résumé quotidien commandes/événements (cron 8h30)
- [ ] Alertes anomalies (commandes sans client, doublons, etc.)

---

### 📧 V. React Email - Templates
*Cette section détaille les templates d'emails à créer.*

**Emails de Commande**
- [ ] **Confirmation de Commande** : Récapitulatif complet, heure de retrait, QR code.
- [ ] **Commande Prête** : Notification simple et directe.
- [ ] **Mise à jour Commande** : Détail des modifications (articles, prix, heure).
- [ ] **Annulation Commande** : Confirmation de l'annulation.

**Emails d'Événement**
- [ ] **Confirmation de Demande** : Accusé de réception de la demande de devis.
- [ ] **Envoi du Devis** : Lien vers le devis PDF, instructions pour la validation.
- [ ] **Confirmation d'Événement** : Récapitulatif final après acceptation du devis.
- [ ] **Rappel d'Événement** : Rappel 24h ou 48h avant.

**Emails de Compte Client**
- [x] **Bienvenue** : Le template `ChanthanaWelcomeEmail.tsx` déjà créé.
- [ ] **Réinitialisation Mot de Passe** : Lien sécurisé pour la réinitialisation.

---

### 📚 VI. Autres Pages
*Cette section sera complétée au fur et à mesure de notre analyse.*

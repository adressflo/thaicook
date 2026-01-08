### 🎯 Plan d'Amélioration Stratégique : ChanthanaThaiCook

Notre feuille de route pour faire évoluer l'expérience ChanthanaThaiCook. Ce document est notre espace de collaboration pour construire l'avenir de l'application.

---

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

---

## 📋 Phase 0 : Infrastructure Critique (🔥🔥🔥🔥)

**Objectif : Sécurité, validation robuste, et fondations techniques avant toutes les features**

### ✅ 1️⃣ Prisma ORM - Migration Base de Données [TERMINÉ]

**Statut : 100% ✅ (Prisma 7.2.0 + Hetzner PostgreSQL)**

<details>
<summary>📊 Détails de la migration</summary>

✅ **Infrastructure complétée**

- [x] Schéma Prisma généré avec 26 modèles depuis Supabase
- [x] Types TypeScript auto-générés et BigInt corrigés
- [x] Tests CRUD validés : `npm run prisma:test` (18 tests ✅)

✅ **Migration application COMPLÈTE**

- [x] Server Actions créés : `app/actions/*.ts` (5 fichiers, 100% CRUD)
  - clients.ts, plats.ts, commandes.ts, extras.ts, evenements.ts
- [x] Hooks Prisma créés : `hooks/usePrismaData.ts` (44 hooks TanStack Query)
  - Clients: 7 hooks (CRUD + search)
  - Plats: 4 hooks (CRUD complet)
  - Commandes: 15 hooks (CRUD + relations + détails)
  - Extras: 4 hooks (CRUD complet)
  - Evenements: 7 hooks (CRUD + relations)
- [x] Migration 100% des composants : 17 pages + 10 composants
  - app/profil, app/commander, app/panier, app/admin/_, app/suivi-_, etc.
  - Tous les composants utilisent usePrismaData.ts
- [x] **Nettoyage `hooks/useSupabaseData.ts` : SUPPRIMÉ **
  - Initialement réduit : 2904 → 361 lignes (-87%)
  - Finalement supprimé : 0 lignes (100% Prisma)
  - Hooks admin/courses avec stubs temporaires
- [x] **Nettoyage `services/supabaseService.ts` : SUPPRIMÉ **
  - Fichier entièrement supprimé avec lib/supabase.ts
- [x] Suppression 3 fichiers obsolètes (useSupabase.ts, useSupabaseNotifications.ts, supabaseAdmin.ts)
- [x] **Total : -3200 lignes de code obsolète supprimées**
- [x] Tests CRUD validés : `tests/prisma-crud.test.ts` (mis à jour auth_user_id)
- [x] Correction TypeScript : **27 erreurs → 0 erreur** ✅

✅ **Migration Hetzner + Prisma 7**

- [x] **PostgreSQL migré vers Hetzner** : Coolify self-hosted (116.203.111.206:5432)
- [x] **Prisma 6.19.0 → 7.2.0** : Upgrade complet avec breaking changes
  - Provider : `prisma-client-js` → `prisma-client`
  - Nouveau fichier : `prisma.config.ts` (datasource.url)
  - Adapter pattern : `@prisma/adapter-pg` dans `lib/prisma.ts`
  - url/directUrl supprimés de `schema.prisma`
- [x] **Supabase 100% supprimé** : Variables env nettoyées (.env, .env.local)
- [x] **Événements fonctionnels** : Création et affichage OK

📖 **Doc :** `documentation/prisma-migration.md`
🔗 **Commits :** `2347e59`, `c169c55`, `35f58ae`

</details>

---

### 🔥🔥🔥🔥 2️⃣ Next Safe Action - Validation Zod Complète [CRITIQUE]

**Dépend de : Prisma ORM ✅**

#### Configuration de base ✅

- [x] Installation de la bibliothèque `next-safe-action`
- [x] Création du client d'action public dans `lib/safe-action.ts`
- [x] Middleware d'authentification disponible via Better Auth (`middleware.ts`)
- [x] Migration de `plats.ts`, `clients.ts`, `commandes.ts`, `evenements.ts` et `extras.ts` vers next-safe-action

#### ✅ Schemas Zod pour toutes les actions [COMPLÉTÉ]

**Statut : Schemas dans `lib/validations.ts` + Server Actions migrés**

- [x] **✅ Schemas centralisés dans `lib/validations.ts`** (369 lignes)
  - ✅ `platSchema`, `platUpdateSchema` (lignes 161-204)
  - ✅ `extraSchema`, `extraUpdateSchema` (lignes 210-239)
  - ✅ `clientProfileSchema`, `clientUpdateSchema` (lignes 27-49)
  - ✅ `commandeSchema`, `commandeUpdateSchema` (lignes 108-142)
  - ✅ `evenementSchema`, `evenementUpdateSchema` (lignes 72-102)
  - ✅ Schemas actions : `searchClientsSchema`, `toggleEpingleSchema`, `addPlatToCommandeSchema`, etc.

- [x] **✅ Patterns de validation avancés implémentés :**
  - ✅ `.refine()` pour logique complexe (dates événements futurs, prix > 0, quantités)
  - ✅ Validation emails avec regex strict (ligne 8)
  - ✅ Validation téléphones français `/^(?:\+33|0)[1-9](?:[0-9]{8})$/` (ligne 11-13)
  - ✅ Validation prix avec regex `/^\d+(\.\d{1,2})?$/` (lignes 166, 218)
  - ✅ Validation dates impossibles (31 février) via `validateRealDate()` (lignes 354-369)

- [x] **✅ Server Actions migrés vers Zod + next-safe-action :**
  - ✅ `app/actions/clients.ts` → utilise `clientProfileSchema`, `clientUpdateSchema`, `searchClientsSchema`
  - ✅ `app/actions/plats.ts` → utilise `platSchema`, `platUpdateSchema`, `getByIdSchema`
  - ✅ `app/actions/commandes.ts` → utilise `commandeSchema`, `toggleEpingleSchema`, `addPlatToCommandeSchema`, etc.
  - ✅ `app/actions/extras.ts` → utilise `extraSchema`, `extraUpdateSchema`, `getByIdSchema`
  - ✅ `app/actions/evenements.ts` → utilise `evenementSchema`, `evenementUpdateSchema`

- [x] **✅ Gestion d'erreurs next-safe-action :**
  - ✅ Validation automatique via `.schema()` avant `.action()`
  - ✅ Erreurs Zod retournées dans `validationErrors` du SafeActionResult
  - ✅ Helper `unwrapSafeAction()` dans `hooks/usePrismaData.ts` (lignes 29-52)
  - ✅ Messages d'erreur français dans tous les schemas

#### ✅ Schemas Auth Complets

**Statut : 100% TERMINÉ ✅**

- [x] **✅ Ajoutés dans `lib/validations.ts` (lignes 400-550) :**
  - ✅ `signupSchema` : email, password, confirmPassword avec validation strength 8+ caractères
  - ✅ `loginSchema` : email, password basique + rememberMe optionnel
  - ✅ `requestPasswordResetSchema` : email uniquement
  - ✅ `resetPasswordSchema` : token, password, confirmPassword avec .refine()
  - ✅ `verifyEmailSchema` : token de vérification
  - ✅ `changeEmailSchema` : currentPassword, newEmail, confirmNewEmail avec .refine()
  - ✅ `deleteAccountSchema` : password + confirmation textuelle "SUPPRIMER MON COMPTE"

- [x] **✅ Validation mot de passe robuste :**
  - ✅ 8+ caractères minimum
  - ✅ Majuscule + minuscule requises
  - ✅ Chiffre requis
  - ✅ Caractère spécial requis

- [ ] **Tests Zod unitaires (UTILISATEUR - Vitest) :**
  - Tests unitaires schemas (valeurs valides/invalides)
  - Tests edge cases (dates limites, nombres max, strings vides)
  - Tests validation passwords (strength requirements)

💡 **Note :** Les Server Actions actuels utilisent déjà `auth.api.getSession()` pour la sécurité (voir `app/profil/actions.ts`).

---

### ✅ 3️⃣ Better Auth - Authentication Moderne TypeScript [TERMINÉ]

**Statut : Migration COMPLÈTE depuis Firebase Auth**

<details>
<summary>📊 Configuration actuelle</summary>

✅ **Configuration de base**

- [x] Installation et configuration initiale (MIT License, gratuit)
- [x] Configuration serveur : `lib/auth.ts` (Prisma adapter + email/password)
- [x] Configuration client : `lib/auth-client.ts` (hooks React useSession, signIn, signUp)
- [x] API Route : `app/api/auth/[...all]/route.ts` configurée
- [x] Tables Better Auth dans Prisma : User, Account, Session, Verification

✅ **Pages d'authentification créées**

- [x] `app/auth/login/page.tsx` (connexion email/password)
- [x] `app/auth/signup/page.tsx` (inscription complète)
- [x] `app/auth/reset-password/page.tsx` (réinitialisation mot de passe)

✅ **Synchronisation User ↔ client_db**

- [x] Server Action : `app/auth/actions.ts` - `createClientProfile(authUserId, data)`
- [x] Lien : User.id → client_db.auth_user_id

✅ **Protection des routes**

- [x] Middleware : `middleware.ts` (vérifie cookie better-auth.session_token)
- [x] PrivateRoute : `components/PrivateRoute.tsx` (useSession Better Auth)
- [x] AdminRoute : `components/AdminRoute.tsx` (useSession + vérification role)

✅ **Firebase Auth 100% supprimé**

- [x] lib/firebaseConfig.ts (supprimé)
- [x] contexts/AuthContext.tsx (supprimé)
- [x] Aucune dépendance Firebase dans package.json

</details>

#### ✅ Workflows Authentication - COMPLÉTÉS [100% ✅]

**Statut : Infrastructure 100% complète + Configuration Resend ✅**

- [x] **✅ Email Verification Workflow** (100% COMPLÉTÉ + RESEND CONFIGURÉ)
  - ✅ Table `Verification` existe dans Prisma
  - ✅ Template email créé : `emails/VerificationEmail.tsx` (2975 lignes)
  - ✅ Fonction `sendVerificationEmail()` dans `lib/email-sender.ts`
  - ✅ Route créée : `app/auth/verify-email/[token]/page.tsx` (213 lignes)
  - ✅ Server Actions : `app/auth/verify-email/actions.ts` (verifyEmailToken + resendVerificationEmail)
  - ✅ Plugin Better Auth activé : `lib/auth.ts` lignes 24-28
  - ✅ 4 états UI : loading, success (countdown 3s), error, expired
  - ✅ **Resend API configurée avec domaine personnalisé `cthaicook.com`**
    - ✅ Domaine vérifié : DNS DKIM + SPF + MX + DMARC (iwantmyname)
    - ✅ Sender email : `noreply@cthaicook.com` (illimité)
    - ✅ Clé API : `re_dj6BWeqN_CNBFbNu4XZ3h18YmyvV6W755` (`.env` ligne 38)
    - ✅ Suppression doublon : Email envoyé 1 seule fois par Better Auth
  - ⚠️ **TEMPORAIRE** : `requireEmailVerification: false` pour tests (ligne 20)
  - [ ] **UTILISATEUR : Tester workflow complet** (signup → login direct sans email)

- [x] **✅ Password Reset Workflow** (100% COMPLÉTÉ - FONCTIONNEL)
  - ✅ Page `app/auth/reset-password/page.tsx` créée
  - ✅ Template email créé : `emails/ResetPasswordEmail.tsx` (8390 lignes)
  - ✅ Fonction `sendPasswordResetEmail()` dans `lib/email-sender.ts`
  - ✅ Route page reset fonctionnelle
  - [ ] **UTILISATEUR : Tester workflow complet** (envoi email → clic lien → reset password)

- [x] **✅ Changement Email Sécurisé** (100% COMPLÉTÉ)
  - ✅ Page `app/profil/change-email/page.tsx` (220 lignes)
  - ✅ Server Action `changeEmailAction()` dans `app/profil/actions.ts` (lignes 154-229)
  - ✅ Template email : `emails/ChanthanaEmailChangeConfirmation.tsx` (650+ lignes)
  - ✅ Validation password actuel requis
  - ✅ Double confirmation email (newEmail + confirmNewEmail)
  - ✅ Reset `emailVerified: false` après changement
  - ✅ Update dans `User` + `client_db` simultané
  - [ ] **TODO Phase 2** : Envoyer confirmation aux deux adresses (ancienne + nouvelle)

- [x] **✅ Changement Mot de Passe** (100% COMPLÉTÉ)
  - ✅ Page `app/profil/change-password/page.tsx` (235 lignes)
  - ✅ Server Action `changePasswordAction()` dans `app/profil/actions.ts` (lignes 322-400)
  - ✅ Validation password actuel via Better Auth API
  - ✅ Validation force nouveau mot de passe (8+ char, maj, min, chiffre, spécial)
  - ✅ UI avec show/hide password pour les 3 champs
  - ✅ Section "Sécurité et confidentialité" ajoutée dans `/profil` (liens 3 pages)
  - [ ] **UTILISATEUR : Tester changement mot de passe**

- [x] **✅ Suppression Compte (GDPR Compliance)** (100% COMPLÉTÉ)
  - ✅ Page `app/profil/delete-account/page.tsx` (218 lignes)
  - ✅ Server Action `deleteAccountAction()` dans `app/profil/actions.ts` (lignes 239-313)
  - ✅ Template email : `emails/ChanthanaAccountDeletedEmail.tsx` (800+ lignes)
  - ✅ Confirmation password + texte "SUPPRIMER MON COMPTE"
  - ✅ Soft delete : `client_db.deleted_at` + anonymisation données RGPD
  - ✅ Hard delete : `User` + `Session` Better Auth
  - ✅ Messages warnings RGPD multiples (section données supprimées/conservées)
  - [ ] **TODO Phase 2** : Envoyer email confirmation suppression

#### 🔥 Fonctionnalités Avancées [PHASE 4 - FUTUR]

- [ ] **OAuth Social Providers** (Google, Facebook, GitHub)
  - Configuration : Créer OAuth apps sur providers
  - Better Auth plugin : `@better-auth/oauth-providers`
  - Signup simplifié avec Google Sign-In

- [ ] **2FA - Two-Factor Authentication**
  - Passkeys (WebAuthn) : Support navigateurs modernes
  - TOTP (Time-based One-Time Password) : App Authenticator
  - SMS OTP : Via n8n + Twilio (coûteux, optionnel)

---

### ✅ 4️⃣ Vitest - Tests Unitaires Modernes [TERMINÉ]

**Statut : 100% ✅**

**Dépend de : Schemas Zod ✅**

<details>
<summary>📊 Configuration et Premier Pattern Test</summary>

✅ **Installation complète**

- [x] Vitest 4.0.7 + @testing-library/react + @testing-library/jest-dom + jsdom
- [x] @vitejs/plugin-react pour support JSX

✅ **Configuration `vitest.config.ts`**

- [x] Environment jsdom pour tests React
- [x] Support TypeScript + path alias `@/`
- [x] Setup file : `tests/setup.ts`
- [x] Exclusion Playwright E2E tests (`**/*.e2e.spec.ts`)
- [x] Coverage provider v8 (text + json + html)

✅ **Setup Mocks Complets** (`tests/setup.ts` - 128 lignes)

- [x] Mock Prisma Client : 6 tables (client_db, plats_db, commande_db, details_commande_db, extras_db, evenement_db)
- [x] Mock Better Auth server (`@/lib/auth`) : verifyEmail, resetPassword, signIn, signOut
- [x] Mock Better Auth client (`@/lib/auth-client`) : useSession avec user test
- [x] Mock Next.js router (`next/navigation`) : useRouter, usePathname, useSearchParams
- [x] Mock Next.js Image (`next/image`) : Conversion object notation (fix JSX error)
- [x] Mock Next.js cache (`next/cache`) : revalidatePath
- [x] Globals : ResizeObserver, IntersectionObserver

✅ **Pattern Test Établi** : `tests/actions/plats.test.ts` (310 lignes, 15 tests ✅)

- [x] **getPlats** : 3 tests (récupération, transformations data, erreurs DB)
- [x] **createPlat** : 3 tests (création valide, validation Zod, erreurs DB)
- [x] **updatePlat** : 3 tests (mise à jour, validation Zod, erreurs DB)
- [x] **deletePlat** : 3 tests (soft delete, validation ID, erreurs DB)
- [x] **Transformations** : 3 tests (prix string, dates ISO, null handling)

✅ **Scripts NPM** (package.json)

- [x] `npm run test` : Vitest en mode run
- [x] `npm run test:watch` : Mode watch interactif
- [x] `npm run test:ui` : Interface web Vitest
- [x] `npm run test:coverage` : Rapport coverage

✅ **Résultats Validation**

```
✓ tests/actions/plats.test.ts (15 tests) 12ms

Test Files  1 passed (1)
Tests       15 passed (15)
```

**📝 Patterns Techniques Validés :**

- ✅ Prix format string `"13.50"` (pas number) → Zod validation
- ✅ Categorie non dans platSchema → Zod filtre champs automatiquement
- ✅ Mock return value doit correspondre au format Server Action (idplats → id transformation)
- ✅ Mocks Prisma : `(prisma.plats_db.create as any).mockResolvedValue()`
- ✅ Tests erreurs : `.rejects.toThrow()` + `result.serverError` pour next-safe-action

</details>

**🔥 Tests Additionnels À Créer (Phase suivante) :**

- [ ] `tests/actions/commandes.test.ts` : Tests CRUD + logique métier (prix, quantités, détails)
- [ ] `tests/actions/clients.test.ts` : Tests CRUD + validation profil
- [ ] `tests/actions/extras.test.ts` : Tests CRUD extras
- [ ] `tests/actions/evenements.test.ts` : Tests CRUD + relations
- [ ] `tests/schemas/validations.test.ts` : Edge cases Zod (dates impossibles, formats, limites)
- [ ] `tests/hooks/usePrismaData.test.ts` : TanStack Query invalidation
- [ ] **Intégration CI/CD** : GitHub Actions workflow `.github/workflows/test.yml`

💡 **Note :** Pattern établi avec plats.test.ts → Répéter pour autres Server Actions quand nécessaire.

---

### ✅ 5️⃣ Upload Fichiers - Migration MinIO Self-Hosted [COMPLÉTÉ]

**Statut : 100% Opérationnel | Migration Supabase → MinIO terminée**

**✅ Infrastructure MinIO (Self-Hosted Hetzner) :**

- [x] **Instance MinIO** : Hébergée sur serveur Hetzner (Port 9000/9001)
- [x] **Client MinIO** : Configuré dans `lib/minio.ts` avec SDK officiel
- [x] **Buckets configurés** : `platphoto`, `hero`, `extras`, `profile-photos`
- [x] **Upload Sécurisé** :
  - [x] Server Action : `app/actions/storage.ts`
  - [x] Validation MIME et Taille via `lib/storage-validation.ts`
  - [x] Génération noms uniques (crypto.randomUUID)
- [x] **URLs Dynamiques** :
  - [x] Utilitaire `getStorageUrl` dans `lib/storage-utils.ts`
  - [x] Support environnement Dev/Prod via variables d'environnement
- [x] **Migration Données** :
  - [x] Script migration assets Supabase → MinIO exécuté
  - [x] Script mise à jour base de données (remplacement URLs) exécuté

**🗑️ Supabase 100% SUPPRIMÉ :**

- [x] **Fichiers supprimés (~1070 lignes)** :
  - `lib/supabase.ts`, `lib/supabaseStorage.ts` (client + storage)
  - `services/supabaseService.ts` (re-export)
  - `hooks/useSupabaseData.ts` (CRUD + Realtime)
  - `hooks/useRealtimeNotifications.ts` (WebSocket)
  - `types/supabase.ts` (types générés)
  - `app/api/hero-media/upload/` (API route)
- [x] **Fichiers migrés vers Prisma** :
  - `lib/announcements.ts` → 14 requêtes Supabase → Prisma ORM
  - `app/actions/hero-media.ts` → Storage Supabase → MinIO
  - `app/page.tsx` → Query directe → API route `/api/hero-media`
  - `app/profil/actions.ts` → Upload photo → `uploadProfilePhotoToMinio`
- [x] **Architecture finale** : Prisma (CRUD) + MinIO (Storage) + Better Auth (Auth)
- [x] **Build validé** : `npm run build` ✅

---

### ✅ 6️⃣ React Email - Templates Professionnels [PARTIELLEMENT COMPLÉTÉ]

**Dépend de : Better Auth workflows ⚠️ 90%**

#### Configuration de base ✅

- [x] Installation et configuration de base (`react-email`, `resend`)
- [x] Création du dossier `emails` avec 4 templates fonctionnels
- [x] Configurer la clé API Resend dans le fichier `.env`

#### ✅ Templates Authentication Complets (6/6) [100% ✅]

**Statut : Templates Better Auth 100% + 1 transactionnel**

- [x] **ChanthanaWelcomeEmail.tsx** ✅ (31377 lignes)
- [x] **ResetPasswordEmail.tsx** ✅ (8390 lignes)
- [x] **VerificationEmail.tsx** ✅ (2975 lignes)
- [x] **ChanthanaEmailChangeConfirmation.tsx** ✅ (650+ lignes)
  - Design bleu/or professionnel
  - Section ancien/nouvel email avec flèche visuelle
  - Bouton vérification + expiration 24h
  - Notices sécurité (contactez si pas vous)
- [x] **ChanthanaAccountDeletedEmail.tsx** ✅ (800+ lignes)
  - Design rouge/gris avec icône trash
  - Section RGPD détaillée (données supprimées vs conservées)
  - Messages "Vous nous manquerez" avec bouton retour site
  - Compliance légale : Factures 10 ans (anonymisées)
- [x] **CommandeConfirmationEmail.tsx** ✅ (1170 lignes)

#### 🔥🔥 Templates Transactionnels [À FAIRE AVEC GEMINI - PHASE 3]

**Ces templates seront créés plus tard via n8n workflows**

- [ ] **CommandeConfirmationEmail.tsx** (récapitulatif, heure retrait, QR code)
- [ ] **CommandePreteEmail.tsx** (notification simple)
- [ ] **CommandeMiseAJourEmail.tsx** (détail modifications)
- [ ] **CommandeAnnulationEmail.tsx** (confirmation annulation)
- [ ] **EvenementDemandeEmail.tsx** (accusé réception demande devis)
- [ ] **EvenementDevisEmail.tsx** (lien PDF devis, instructions validation)
- [ ] **EvenementConfirmationEmail.tsx** (récapitulatif après acceptation)
- [ ] **EvenementRappelEmail.tsx** (rappel 24h/48h avant)

#### Tests emails

- [ ] Tests visuels sur différents clients email (Gmail, Outlook, Apple Mail)
- [ ] Tests responsive (mobile + desktop)
- [ ] Tests dark mode

---

### ✅ 7️⃣ Configuration Email Domaine Personnalisé [COMPLÉTÉ]

**Statut : Email contact@cthaicook.com configuré avec ImprovMX gratuit**

- [x] **Email professionnel configuré** : `contact@cthaicook.com`
- [x] **Service gratuit ImprovMX** : Forwarding vers email personnel
- [ ] **Configuration DNS** : Records MX à ajouter chez iwantmyname
  - MX 10 mx1.improvmx.com
  - MX 20 mx2.improvmx.com
- [x] **Intégration Footer** : Icône Email avec mailto: link
- [ ] **Tests envoi/réception** : Vérifier forwarding opérationnel

**Configuration ImprovMX** :

- Alias : contact@cthaicook.com
- Forward to : [email personnel utilisateur]
- Free tier : Illimité forwards (gratuit à vie)
- Dashboard : https://improvmx.com

💡 **Note** : Alternative gratuite = Cloudflare Email Routing (si DNS chez Cloudflare)

---

### ⚠️ 8️⃣ n8n - Infrastructure TypeScript Complète [50% COMPLÉTÉ]

**Note : Infrastructure prête, workflows serveur à créer en Phase 3**

✅ **Infrastructure TypeScript Complète**

- [x] **`lib/n8n-webhooks.ts`** (10433 lignes) - Classes TypeScript complètes
  - ✅ `N8nWebhookClient` : Client HTTP pour webhooks n8n
  - ✅ `CommandeWebhookPayload` : Interface payload commandes
  - ✅ `NotificationWebhookPayload` : Interface payload notifications
  - ✅ Variables env : `NEXT_PUBLIC_N8N_WEBHOOK_URL`, `N8N_WEBHOOK_TOKEN`
- [x] Hébergé sur serveur Hetzner (opérationnel)

**🔥 Workflows Server-Side à Créer (Phase 3)**

- [ ] Vérifier instance n8n opérationnelle et accessible
- [ ] Configurer webhooks entrants depuis Next.js
- [ ] Tester connexion Next.js → n8n (ping/pong simple)

**Intégrations tierces à préparer :**

- [ ] **Brevo/SendGrid** : Compte + API key pour emails transactionnels
- [ ] **Telegram Bot** : Création bot + token pour notifications admin
- [ ] **WhatsApp Business API** : Vérification compte + configuration
- [ ] **Twilio/Vonage** : Évaluation coût SMS (optionnel)

📋 **Note :** Les workflows détaillés seront définis dans la section dédiée **§IV. n8n Workflows** en analysant page par page les besoins spécifiques.

---

### 🔥 9️⃣ Stack Monitoring - PLG + GlitchTip + UptimeRobot [PHASE 4 - FUTUR]

#### PLG Stack (Prometheus + Loki + Grafana)

- [ ] Installation Prometheus via image pré-configurée Hetzner Cloud
- [ ] Configuration node_exporter pour métriques serveur (CPU, RAM, Disk, Network)
- [ ] Installation Loki pour centralisation logs application Next.js
- [ ] Setup Grafana + connexion sources (Prometheus + Loki)
- [ ] Import dashboards communautaires (Hetzner Server + Next.js App)
- [ ] Configuration alertes automatiques (CPU > 80%, RAM > 90%, Disk > 85%)
- [ ] Tests corrélation métriques serveur ↔ logs application

#### GlitchTip - Monitoring Erreurs Application

- [ ] Setup Docker Compose (PostgreSQL + Redis + GlitchTip)
- [ ] Configuration sous-domaine monitoring.chanthana.com
- [ ] Installation SDK `@sentry/nextjs` dans projet
- [ ] Configuration DSN pointant vers GlitchTip self-hosted
- [ ] Intégration error boundaries avec envoi automatique erreurs
- [ ] Configuration alertes email pour erreurs critiques
- [ ] Tests capture erreurs (client-side + server-side)

#### UptimeRobot - Monitoring Disponibilité Externe

- [ ] Création compte gratuit UptimeRobot (50 monitors inclus)
- [ ] Configuration monitors : homepage, /api/health, /admin, /commander
- [ ] Setup alertes email + SMS optionnel si site down
- [ ] Configuration interval checks (5 minutes)
- [ ] Tests notifications downtime et recovery

---

### 🔥 🔟 Outils Techniques Supplémentaires [PHASE 2-3]

#### ✅ framer-motion - Animations React Déclaratives [INSTALLÉ + UTILISÉ]

**Statut : Installation complète, utilisé dans HeroCarousel** ✅

- [x] **Installation de la bibliothèque framer-motion** (NPM v12.23.24, MIT License)
- [x] **Animations scroll Hero Section** ✅ UTILISÉ
  - [x] Hook `useScroll` : Track scroll progress (offset: 'start start' → 'end start')
  - [x] Hook `useTransform` : Mapping scroll → CSS transforms
  - [x] Rotation 3D : rotateX 20° → 0° (perspective 1000px)
  - [x] Scale responsive : mobile 0.7→0.9, desktop 1.05→1
  - [x] Translation parallax : translateY 0 → -100px
  - [x] Composant `motion.div` avec style dynamique
  - [x] Animation initiale : opacity 0, x -100 → opacity 1, x 0
  - [x] Respect prefers-reduced-motion (désactive animations si actif)
- [ ] **Extensions futures** : Stagger animations, spring physics, gestures

#### ✅ nuqs - URL State Management Type-Safe [INSTALLÉ + UTILISÉ]

**Statut : Installation complète, utilisé dans /commander**

- [x] **Installation de la bibliothèque nuqs** (NPM v2.7.2, gratuit)
- [x] **Adapter configuré** : `app/layout.tsx` avec `NuqsAdapter`
- [x] **Filtres menu `/commander`** ✅ UTILISÉ (ligne 29: `useQueryState`)
  ```typescript
  const [category, setCategory] = useQueryState("cat", parseAsString)
  // Déjà implémenté dans app/commander/page.tsx
  ```
- [ ] **Filtres avancés `/commander`** (🔥🔥 MOYENNE - EXTENSION)
  - Ajouter search, spicy, vegetarian filters
  - URL: /commander?cat=entrees&q=pad%20thai&spicy=true
- [ ] **Pagination `/historique/complet`** (🔥🔥 MOYENNE)
  ```typescript
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [pageSize, setPageSize] = useQueryState("size", parseAsInteger.withDefault(10))
  ```
- [ ] Setup recherche clients avec URL state sync
- [ ] Tests navigation et bookmarking d'états filtrés

#### ⚠️ next-intl - Internationalization App Router [50% COMPLÉTÉ]

**Statut : Installation + Config partielles - Routing multilingue incomplet**

- [x] **Installation** : NPM v4.4.0
- [x] **Configuration i18n** : `i18n.ts` (253 lignes) avec locales fr/th/en
- [x] **Messages français** : `messages/fr.json` (169 lignes)
- [x] **Hook utilisé** : `useTranslations` dans 18 fichiers
- [ ] **Routing multilingue** : Middleware i18n + structure `/[locale]/` à créer
- [ ] **Messages complets** : Traductions thaï et anglais à compléter
- [ ] **Migration complète** : Tous textes UI hardcodés vers i18n
- [ ] **Tests** : Changement langue et SSR multilingue

💡 **Note :** Infrastructure prête, routing à finaliser avec Gemini (Phase 6)

#### ⚠️ react-pdf - Génération Documents PDF [1/3 COMPLÉTÉ]

**Statut : Facture commande fonctionnelle, devis et ticket à créer**

- [x] **Installation** : react-pdf v4.3.1 configuré (NPM, gratuit)
- [x] **Facture commande** ✅ COMPLÉTÉ (🔥🔥 MOYENNE)
  - ✅ Component : `FactureCommandePDF.tsx` (template PDF complet)
  - ✅ Bouton download : `BoutonTelechargerFacture.tsx` (utilisé dans /historique)
  - ✅ Design Thai professionnel avec récapitulatif détaillé
  - ✅ Plats + extras + totaux calculés
- [ ] **Devis événement** (🔥🔥 MOYENNE)
  - Template formel avec logo
  - Détail prestations + tarifs
  - Conditions générales
- [ ] **Ticket de caisse** (🔥 BASSE)
  - Format impression thermique 80mm
  - Minimaliste et lisible
- [ ] Tests PDF sur différents appareils et navigateurs

---

## 📱 Phase 1 : PWA & Notifications (🔥🔥🔥 HAUTE)

**Objectif : Engagement utilisateur et communication temps réel**

**Dépend de : Better Auth ✅ | Server Actions stables ⏳**

### ✅ Fondations PWA

- [x] 🔥🔥🔥 Mettre en place les bases de la Progressive Web App (Service Worker, Manifest)
  - ✅ Next.js 16 native PWA (app/manifest.ts avec MetadataRoute.Manifest)
  - ✅ Service Worker personnalisé (public/sw.js v2.0.0 - 502 lignes)
  - ✅ Security headers PWA (next.config.ts - CSP, X-Frame-Options)
  - ✅ Cache strategies: Network-first (API) + Cache-first (assets)
- [x] 🔥🔥🔥 Rendre l'application installable (icon, splash screen, display: standalone)
  - ✅ Manifest configuré: name, short_name, icons, display, theme_color
  - ✅ Shortcuts définis: /commander, /historique
  - ✅ Build production réussi (29 pages générées)
- [x] 🔥🔥 Mode Hors-ligne : Consultation du menu en cache
  - ✅ IndexedDB avec TTL automatique (lib/offlineStorage.ts - 358 lignes)
  - ✅ TanStack Query persistence avec createAsyncStoragePersister
  - ✅ Service Worker v2.0.0 : Network-First API + Cache-First assets
  - ✅ Composants UI : OfflineBanner + OfflineIndicator (animations slide-down)
  - ✅ Hook useOnlineStatus : Détection temps réel online/offline
  - ✅ Tests E2E Playwright : 12 tests passent (tests/offline.spec.ts)
- [x] 🔥🔥 Mode Hors-ligne : Affichage commandes récentes en cache
  - ✅ TanStack Query networkMode: 'offlineFirst' (retry logic si offline)
  - ✅ TTL configurable : 24h menu, 1h commandes
  - ✅ Cleanup automatique données expirées au chargement app

### ✅ Notifications Push

- [x] 🔥🔥🔥 Intégrer Firebase Cloud Messaging (canal prioritaire gratuit)
  - ✅ lib/fcm.ts : Client-side FCM (requestNotificationPermission, onMessageListener, revokeFCMToken)
  - ✅ lib/fcm-admin.ts : Server-side Firebase Admin SDK (sendNotificationToClient, multicast)
  - ✅ public/firebase-messaging-sw.js : Service Worker FCM (onBackgroundMessage, notificationclick)
  - ✅ next.config.ts : Webpack config pour exclure SW du bundling
  - ✅ Firebase SDK installé : firebase@12.3.0 + firebase-admin (110 packages)
- [x] 🔥🔥🔥 Page demande permission notifications avec explications claires
  - ✅ app/notifications/setup/page.tsx : Page onboarding complète (305 lignes)
  - ✅ Explications bénéfices : Suivi commande, rappels événements, offres spéciales
  - ✅ Gestion 3 états permission : default, granted, denied
  - ✅ Instructions déblocage si permission refusée
  - ✅ Design responsive avec Shadcn/UI
- [x] 🔥🔥🔥 Stockage token FCM dans `notification_tokens` (table dédiée)
  - ✅ app/actions/notifications.ts : Server Actions (saveNotificationToken, revokeNotificationToken)
  - ✅ Table notification_tokens : client_id, device_token, device_type, is_active, last_used
  - ✅ Upsert automatique avec Better Auth session
  - ✅ Support multidevice : web, ios, android
  - ✅ Auto-cleanup tokens invalides
- [x] 🔥🔥 Notifications changement statut commande (Confirmée → Prête → etc.)
  - ✅ app/actions/commandes.ts : Intégration dans updateCommande()
  - ✅ Messages personnalisés par statut (5 variantes)
  - ✅ app/api/notifications/send/route.ts : API endpoint POST avec validation Zod
  - ✅ Erreurs non-bloquantes (try-catch)
  - ✅ Routing intelligent vers /suivi-commande/{id}
- [x] 🔥🔥 Notifications rappel événement (24h/48h avant)
  - ✅ app/api/cron/event-reminders/route.ts : API endpoint CRON (207 lignes)
  - ✅ Logique recherche événements dans plages temporelles (23h-25h et 47h-49h)
  - ✅ Filtre statut événement : Confirm\_\_\_\_Acompte_re_u, En_pr_paration
  - ✅ Envoi notifications FCM avec détails événement (nom, date, heure)
  - ✅ Messages différenciés : "Votre événement est demain !" (24h) et "Rappel : événement dans 2 jours" (48h)
  - ✅ vercel.json : Configuration CRON quotidien à 9h UTC (schedule: "0 9 \* \* \*")
  - ✅ Sécurité CRON : Vérification Authorization header (CRON_SECRET)
  - ✅ Gestion erreurs non-bloquantes + summary détaillé (eventsIn24h, eventsIn48h, totalSent)
  - ✅ 13 tests Playwright E2E (tests/event-reminders.spec.ts)
    - Tests API : Accessibilité endpoint, structure réponse, sécurité
    - Tests performance : <10s, idempotence
    - Tests sécurité : Pas d'infos sensibles révélées, méthodes HTTP autorisées

### Stratégie de Communication Hybride

```
Priorité 1: Push PWA (gratuit, temps réel)
    ↓ si consentement refusé
Priorité 2: Canal préféré client (WhatsApp/SMS/Telegram via n8n)
```

- [ ] 🔥🔥 Implémentation logique fallback multicanal
- [ ] 🔥🔥 Préférences notifications dans profil utilisateur
- [ ] 🔥 Dashboard admin : statistiques taux opt-in notifications

### ✅ Tests & Qualité

- [x] 🔥🔥🔥 Tests automatisés Playwright : Parcours critiques (commande, auth, paiement)
  - ✅ Infrastructure E2E complète (playwright.config.ts - 3 projets)
  - ✅ Authentication setup avec Better Auth (tests/auth.setup.ts)
  - ✅ Storage states pour client et admin (tests/.auth/\*.json)
  - ✅ 17 tests PWA offline passent (tests/offline.spec.ts)
  - ✅ Comptes de test configurés : client-test@example.com / admin-test@example.com
  - ✅ CI-ready avec dependencies et setup automatique
  - ✅ 10 tests Notifications FCM (tests/notifications.spec.ts)
    - Tests UI/UX : Page setup, utilisateur connecté/non-connecté, navigation
    - Tests techniques : Service Worker accessible, profil sans erreur, responsive mobile
    - Tests API : Validation payload, gestion erreurs
  - ✅ 13 tests Event Reminders CRON (tests/event-reminders.spec.ts)
    - Tests API : Accessibilité endpoint, structure JSON, gestion événements inexistants
    - Tests sécurité : 401 sans Authorization, pas d'infos sensibles, méthodes HTTP
    - Tests performance : Réponse <10s, idempotence (appels multiples)
- [ ] 🔥🔥 Tests accessibilité (ARIA labels, keyboard navigation, screen readers)
- [x] 🔥🔥 Tests PWA (Lighthouse scores, manifest validation, service worker)
  - ✅ Tests Service Worker : enregistrement, cache API/static
  - ✅ Tests IndexedDB : stores plats/commandes/user_profile
  - ✅ Tests mode offline : badge, bannière, contenu en cache
  - ✅ Tests retour online : notification, synchronisation

### ⚠️ Tests E2E - Configuration Ajustée

**Problème identifié :** `webServer` auto-start Playwright crée processus zombie (ports 3000/3001 occupés)

- Bug connu Playwright Windows (Issues #19049, #24101, #34190)
- PID 127692 zombie résolu
- Configuration `reuseExistingServer` ne fonctionne pas sur Node 18+

**Actions appliquées :**

- [x] Désactivation `webServer` en développement local
- [x] Activation uniquement en CI via `process.env.CI`
- [x] Scripts `kill-port-3000.js` conservés pour edge cases

**Workflow développement actuel :**

```bash
# Terminal 1: Serveur manuel
npm run dev

# Terminal 2: Tests E2E (si nécessaire)
npm run test:e2e
```

**TODO avant production (2-4 semaines avant mise en ligne) :**

- [ ] Vérifier tous tests passent (35 tests actuels)
- [ ] Corriger 3 tests SKIP dans `tests/offline.spec.ts` (auth requis)
- [ ] Ajouter tests workflow commande complète (panier → paiement → confirmation)
- [ ] Configurer GitHub Actions CI/CD
- [ ] Réactiver tests obligatoires en CI avant deploy

---

## 🎨 Phase 2 : Améliorations UX par Page (🔥🔥 MOYENNE)

**Objectif : Polir l'expérience utilisateur et ajouter features confort**

**Dépend de : Server Actions stables ⏳ | Schemas Zod ⏳**

### 🏠 A. Page d'Accueil (/)

#### 🎬 Hero Section Dynamique

- [x] **Carousel média administratif** : Images + vidéos courtes
  - [x] Upload depuis interface admin (/admin/hero-media)
  - [x] Support image (JPG, PNG, WebP) + vidéo (MP4, WebM)
  - [x] Drag & drop pour réorganiser l'ordre
  - [x] Transition slide entre médias (Embla Carousel + Autoplay)
  - [x] Indicateurs navigation discrets (dots en bas centre)
  - [x] Responsive : Hauteur 55vh mobile / 80vh desktop
  - [x] Autoplay 7s configurable + pause au hover/swipe
  - [x] Swipe tactile activé sur mobile
  - [ ] Transition Fade (actuellement slide, Fade supprimé)

#### 📣 Bannières d'Annonce Dynamiques

- [x] **Système d'annonces administrable** :
  - [x] Chargement via `announcementTypeConfig`
  - [x] Affichage conditionnel (si active et message présent)
  - [x] Design color-coded avec icônes (Info, Warning, Error, Success)

#### 🚀 QuickNav (Navigation Rapide)

- [x] **Barre de navigation animée** (desktop uniquement) :
  - [x] Animation "Vague" continue (couleur orange)
  - [x] Arrêt de l'animation au survol ou au clic
  - [x] Navigation fluide vers les ancres cards
  - [x] Effet "Highlight" sur la carte cible (3s)
  - [x] Liens contextuels (Visiteur vs Connecté)

#### 🧭 Card Branding (Haut Gauche)

- [x] **Card navigation Hero** :
  - [x] Logo avec animation pulse glow
  - [x] Titre "ChanthanaThaiCook" en vert thai (desktop)
  - [x] Sous-titre "Cuisine Thaï Authentique" en blanc (desktop)
  - [x] Bouton Commander (gradient orange, desktop)
  - [x] Bouton Nous Trouver (outline blanc, desktop)
  - [x] Design glassmorphism stone-900 (desktop uniquement)
  - [x] Slide-in animation au chargement
  - [ ] Animations scroll 3D (supprimées - causaient déformation)

#### 🧭 Navigation Cards

- [x] **Cartes navigation adaptatives selon auth** :
  - [x] Visiteur non connecté : 6 cartes actives
  - [x] Utilisateur connecté : 8 cartes actives
  - [x] Carte "Installer l'Application" masquée si déjà installé
  - [x] Grid responsive : lg:4 cols, md:2 cols
  - [x] **Mobile : Slider horizontal swipeable** (snap-x)
  - [x] Effet Tilt 3D au hover (via composant Tilt)
  - [x] Card highlighting au clic (glow 3s)
  - [x] Description limitée à 2 lignes (line-clamp-2)

#### 💡 Section "Pourquoi Créer un Compte"

- [x] **Visible uniquement aux non-connectés** :
  - [x] 3 bénéfices : Suivi temps réel, Historique, Gestion événements
  - [x] Boutons CTA vers /auth/signup et /auth/login

#### 📱 Section PWA Intelligente

- [x] **Hook `usePWAInstalled`** :
  - [x] Détecte display-mode standalone + iOS standalone
  - [x] Retourne isInstalled, canInstall, install()
- [x] **Affichage conditionnel** :
  - [x] Card et bouton Hero conditionnels selon canInstall
  - [x] Dialog confirmation installation

#### 🎨 Polish & Accessibilité

- [x] **Sélecteur de langue** : Drapeaux waving (fr/th/en/nl)
- [x] **Header navigation** : Liens centrés, smooth scroll
- [x] **Bouton Installer l'App** : Bas droite Hero
- [x] **Footer enrichi** : Icônes dock magnification
- [x] **Animations entrance** : Fade-in, stagger cards

#### 🚫 Suppressions Confirmées

- [x] Page `/suivi` : N'existe pas (navigation vers /historique)
- [x] Section témoignages : N'existe pas
- [x] Promotions/fidélité : N'existe pas

#### 💜 Suggestions Futures

- [ ] Animation Lottie Chanthana wai au chargement
- [ ] Parallax léger sur Hero
- [ ] Indicateur chargement Chanthana cuisine
- [ ] Bulle info contextuelle nouveaux visiteurs

#### 🔧 Spécifications Techniques

**Hero Carousel :**

- [x] Embla Carousel + Autoplay
- [x] Auto-play 7s, pause au hover/swipe
- [x] Dots navigation discrets
- [x] Overlay gradient tiers inférieur
- [ ] Badge "Nouveau !" sur Mon Profil (logique date à implémenter)

**Navigation Cards :**

- [x] 8 cartes (6 visiteur + 2 auth)
- [x] Mobile : Slider horizontal snap-x
- [x] Desktop : Grid 4 colonnes
- [x] Effet Tilt 3D au hover
- [x] Card highlighting glow 3s
- [x] Photo client depuis `photo_client`

---

#### 🎨 Icônes Réseaux Sociaux Personnalisées

**Statut : 10 composants SVG avec couleurs officielles des marques**

- [x] **`components/icons/FacebookIcon.tsx`** : Circle blue #1877F2
- [x] **`components/icons/InstagramIcon.tsx`** : Gradient radial (yellow → red → purple → blue)
- [x] **`components/icons/WhatsAppIcon.tsx`** : Circle green #25D366
- [x] **`components/icons/TikTokIcon.tsx`** : Black with gradient overlay (#00F2EA → #FF0050)
- [x] **`components/icons/YouTubeIcon.tsx`** : Red #FF0000 with play button
- [x] **`components/icons/GoogleMapsIcon.tsx`** : Multicolor pin (red #EA4335, yellow #FBBC05, green #34A853, blue #4285F4)
- [x] **`components/icons/EmailIcon.tsx`** : Orange gradient (#FF6B35 → #F7931E) with envelope
- [x] **`components/icons/PhoneIcon.tsx`** : Blue #34B7F1 with phone handset
- [x] **`components/icons/MessengerIcon.tsx`** : Blue gradient (#00B2FF → #006AFF)
- [x] **`components/icons/XIcon.tsx`** : Black with white X logo

**Design patterns** :

- [x] ViewBox 24x24 uniforme pour cohérence taille
- [x] aria-label sur chaque SVG pour accessibilité
- [x] className prop pour size control (size-full dans Dock)
- [x] Couleurs officielles des marques respectées (brand guidelines)
- [x] Support hover via DockIcon parent (scale + shadow)

**URLs configurées** :

- ✅ Facebook : https://facebook.com/chanthanathaicook
- ✅ Instagram : https://instagram.com/chanthanathaicook
- ✅ WhatsApp : https://wa.me/33749283707
- ✅ Google Maps : Adresse complète restaurant
- ✅ Email : mailto:contact@cthaicook.com
- ✅ Téléphone : tel:+33749283707
- ✅ Messenger : https://m.me/chanthanathaicook
- ⚠️ TikTok : Placeholder `#` (à créer compte)
- ⚠️ YouTube : Placeholder `#` (à créer chaîne)
- ⚠️ X (Twitter) : Placeholder `#` (à créer compte)

- [ ] 🔥 **Tests accessibilité** : Keyboard navigation, screen readers, focus states
- [ ] 🔥 **Tests E2E Playwright** : Parcours visiteur vs connecté

### 🛒 B. Page Commander (/commander)

**Page principale** : `app/commander/page.tsx` (1430 lignes)

#### 🏗️ Structure et Layout

- [x] **Layout 2 colonnes** : Menu principal (gauche) + Plat vedette/Panier (droite)
- [x] **Header contextuel** :
  - Bouton "← Retour Accueil"
  - Bouton "Mes Commandes Passées" (icône history, lien /historique)
  - Icône cloche notification (badge compteur)
  - Avatar Chanthana animé en haut à droite
- [x] **Section titre** :
  - Illustration Chanthana chef
  - Titre "Pour Commander"
  - Sous-titre horaires : "Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30"
  - Lien "Voir nos prochains événements" (calendrier)
- [x] **Footer complet** : Navigation, icônes réseaux sociaux, contact

#### 🔍 Recherche et Filtres

- [x] **Barre de recherche** :
  - Input avec placeholder "Ex: Pad Thaï, Curry, Nems..."
  - Icône loupe
  - Filtrage dynamique en temps réel (case-insensitive)
- [x] **Sélecteur de jour** :
  - 7 boutons horizontaux (Lundi → Dimanche)
  - Style : Boutons orange avec hover effect
  - Texte : "Ou choisissez un jour pour voir le menu"
  - Met à jour la liste des plats disponibles

#### 📅 Sélection Date/Heure de Retrait

- [x] **Apparaît après sélection jour** :
  - Dropdown "Date de retrait \*" : 8 prochaines dates calculées
  - Dropdown "Heure de retrait \*" : 18h00-20h30 (pas 5 min)
- [x] **Workflow 3 étapes** : Jour → Date → Heure
- [x] **Auto-sélection** depuis dernier article panier

#### ⭐ Section Plat Vedette (FeaturedDish)

- [x] **Composant** : `components/commander/FeaturedDishSection.tsx` (165 lignes)
- [x] **Position** : Sidebar droite, au-dessus du panier
- [x] **Design Polaroid** :
  - Badge étoile ⭐ gold en haut à gauche
  - Image plat grande
  - Titre + prix (badge)
  - Description scrollable
- [x] **Jours disponibles** : Badges avec highlight gold si jour courant
- [x] **Comportement clic** : Scroll vers sélecteur jours
- [x] **Bouton** : "Au menu cette semaine !"

#### 🍱 Grille des Plats

- [x] **Layout** : Grid responsive (1-3 colonnes selon breakpoint)
- [x] **Cartes plats** :
  - Image avec overlay gradient
  - Badge "Disponible" (vert)
  - Titre + description (truncated)
  - Prix formaté (ex: 12,90€)
  - Bouton "Ajouter" (+ icône)
- [x] **Badges régime/goût** :
  - 🌱 "Végétarien" (vert)
  - 🌶️ "Peut être épicé" (orange/rouge)
- [x] **Hover effects** : Scale, shadow, brightness

#### 🔥 Modal Commande Plat

- [x] **Composant** : `components/shared/CommandePlatModal.tsx` (640 lignes)
- [x] **Ouverture** : Clic sur carte plat
- [x] **Contenu** :
  - Image plat grande avec effet 3D tilt (`Floating3DCard`)
  - Titre + description complète
  - Prix unitaire
- [x] **Sélecteur quantité** : Boutons +/- avec compteur central
- [x] **SmartSpice Selector** (si plat épicé) :
  - 4 niveaux : 🍃 Non épicé | 🔥 Un peu | 🔥🔥 Épicé | 🔥🔥🔥 Très épicé
  - Icônes feuille/piment avec badges numériques
  - Gradient couleurs (vert → rouge)
- [x] **Rappel date retrait** : Affiché avant validation
- [x] **Bouton** : "Ajouter au panier" (prix total)
- [x] **Haptic feedback** : Vibration au clic (mobile)

#### 🛒 Sidebar Panier

- [x] **Apparition** : Dès premier article ajouté
- [x] **CartItemCard** (`components/shared/CartItemCard.tsx` 443 lignes) :
  - Miniature image
  - Badge quantité superposé sur image
  - Nom plat + prix unitaire
  - Icône niveau épice choisi
  - Boutons +/- quantité
  - Bouton suppression (poubelle rouge)
  - Swipe-to-delete (mobile)
- [x] **SmartSpice dans panier** : Modification distribution épices
- [x] **Zone "Demandes spéciales"** : Textarea pour instructions
- [x] **Informations** :
  - "Paiement sur place uniquement"
  - Adresse de retrait
- [x] **Bouton validation** : Prix total dynamique (ex: "Valider (25,80 €)")
- [x] **Groupage par date** : Articles groupés visuellement si dates différentes

#### 🎉 Animations et Feedbacks

- [x] **Toast ajout panier** :
  - Illustration Chanthana
  - Message "Plat ajouté !"
  - Animation slide-in
- [x] **Badge notification** : Compteur sur icône panier header
- [x] **Transitions fluides** : Modals, sidebar, hovers
- [x] **Toast vidéo** : `toastVideo()` avec MP4 pour certaines actions

#### 📦 Composants Techniques

##### `components/shared/Spice.tsx` (312 lignes)

- [x] Sélecteur 4 niveaux épicé interactif
- [x] `SPICE_LEVELS` config avec labels, icônes, couleurs
- [x] Toast vidéo avertissement si niveau 3
- [x] Props : `distribution`, `onDistributionChange`, `readOnly`, `showBackground`, `hideZeros`
- [x] Tooltips explicatifs par niveau

##### `components/shared/SmartSpice.tsx` (128 lignes)

- [x] Wrapper intelligent autour de `Spice`
- [x] Bascule automatique lecture seule ↔ interactif
- [x] Redistribution automatique au changement quantité
- [x] Logique ajout : nouvelles portions = Non épicé (niveau 0)

#### 📦 Base de Données

- [x] Champs `plats_db` : `est_vegetarien`, `niveau_epice` (0-3), `categorie`
- [x] Table `restaurant_settings` : `plat_vedette_id`
- [x] Server Actions : `setFeaturedDish()`, `getFeaturedDish()`, `isFeaturedDish()`

#### 📱 Mobile UX

- [x] **MobileNav.tsx** : Bottom navigation 5 onglets
- [x] **Barre Panier intelligente** : Résumé total + prix au-dessus nav
- [x] **Layout 1 colonne** : Menu empilé verticalement
- [x] **Sidebar cachée** : Remplacée par bottom nav

#### 💜 Suggestions Futures

- [ ] Animation "vol" ajout panier (Framer Motion layoutId)
- [ ] Skeleton loading plats
- [ ] Bottom sheet panier mobile (remplacer sidebar)
- [ ] Haptic feedback étendu
- [ ] Raccourci "Ma dernière commande"

### 🛍️ C. Page Panier (/panier)

**Page principale** : `app/panier/page.tsx` (693 lignes)

#### 🏗️ Structure Visualisée (Screenshots)

- [x] **Header Panier** :
  - Illustration Chanthana avec sacs courses
  - Titre "Mon Panier" + compteur plats (ex: "2 plats")
  - Bouton corbeille (vider panier) en haut droite
- [x] **Groupement par Retrait** :
  - Container "Votre Commande"
  - Header data : "📅 Retrait prévu le [Date] à [Heure]" (Orange)
- [x] **Footer Actions** :
  - Total commande (ex: "25,80€") bien visible
  - Info "💳 Paiement sur place : Nous acceptons la carte bleue" (Vert)
  - Zone "Demandes spéciales" (Textarea large)
  - Boutons : "Retour à Commander" (Outline) et "Valider (Prix)" (Solid Orange)

#### 📦 Composants & Fonctionnalités

##### `components/shared/CartItemCard.tsx` (443 lignes)

- [x] **Carte Article** :
  - Miniature image carrée
  - Nom + Prix unitaire (ex: "12,90€")
  - **Sélecteur Quantité** : Boutons [-] [1] [+]
  - **Icône Épicée** : Badge vert/rouge (feuille/piment) dynamique
  - **Actions** : Bouton supprimer (Poubelle décalée à droite)
- [x] **Comportement Mobile** :
  - Swipe-to-delete (Fond rouge avec poubelle)
  - Layout adaptatif (Col vs Row)

##### Gestion Panier `contexts/CartContext.tsx`

- [x] **État Global** : `panier`, `ajouterAuPanier`, `modifierQuantite`, `viderPanier`
- [x] **Persistence** : `localStorage` (avec sérialisation/désérialisation dates)
- [x] **Logique d'ajout** : Fusion intelligente si même produit + mêmes options (épices, date, demande)
- [x] **Calculs** : `totalArticles`, `totalPrix` en temps réel

#### 🎉 Feedback & Animations (Confirmé par images)

- [x] **Toast "Attention ça pique !"** :
  - Déclenché si niveau épicé élevé sélectionné
  - Style Polaroid avec Avatar Chanthana animé
  - Jauge visuelle piments
- [x] **Toast "Khop khun Kha !"** :
  - Déclenché à la validation commande
  - Message : "Votre commande a été enregistrée avec succès"
  - Animation typing text
- [x] **Toast "Plat mis à jour"** : Petit toast vert en bas droite lors modif quantité

#### ✅ Validation Commande

- [x] **Flux de validation** :
  - Vérification session (`getClientProfile`)
  - Création entrée `commande_db` via Server Action
  - Redirection vers `/suivi-commande/[id]`
- [x] **Sécurité** :
  - Validation Zod des entrées
  - Protection accès (Client uniquement)

#### 💜 Améliorations Futures (Suggestions)

- [ ] 🔥🔥 **Sauvegarde panier non connecté** : Proposer création compte pour conserver le panier
- [ ] **Mode "Invité"** : Commander sans compte (optionnel)
- [ ] **Paiement en ligne** : Intégration Stripe future
- [ ] **Email récapitulatif** : Envoi mail après validation

- [ ] 🔥 **Gestion heure retrait avancée** :
  - Note heure indicative (peut être ajustée)
  - Admin: Proposer nouvelle heure
  - Notification via n8n si changement

### 📜 D. Page Historique (/historique & /historique/complet)

**Fichiers** :

- `app/historique/page.tsx` (317 lignes)
- `app/historique/complet/page.tsx` (29 lignes)
- `components/historique/OrderHistoryCard.tsx` (477 lignes)
- `components/historique/ActionButtons.tsx` (117 lignes)

#### ✅ Fonctionnalités /historique

- [x] ✅ **Prisma ORM** : Hooks `usePrismaCommandesByClient`, `usePrismaEvenementsByClient`, `usePrismaExtras`
- [x] ✅ **OfflineBannerCompact** : Bannière mode hors-ligne
- [x] ✅ **Séparation En Cours / Historique** : 2 sections commandes + 2 sections événements
- [x] ✅ **Limite 10 commandes historique** : `.slice(0, 10)`
- [x] ✅ **OrderHistoryCard** : Carte commande premium (voir détails ci-dessous)
- [x] ✅ **StatusBadge** : Badge couleur selon statut
- [x] ✅ **EvenementActionButtons** : Boutons Voir/Modifier/Devis
- [x] ✅ **FormattedDate, FormattedEvent, PersonCount** : Composants display

#### ✅ OrderHistoryCard

**Composant** : `components/historique/OrderHistoryCard.tsx`

- [x] ✅ **Header 3 colonnes** : Média | Date & Heure | Statut & N°
- [x] ✅ **Styles dynamiques par statut** :
  - "En attente de confirmation" : Gradient orange/ambre
  - "Confirmée" : Vert avec icône clipboard
  - "En préparation" : Orange avec image Chanthana + vidéo
  - "Prête à récupérer" : Vert émeraude avec badge pulsant
  - "Récupérée" : Gris/argent avec calendrier
  - "Annulée" : Rouge avec overlay "ANNULÉE" style tampon
- [x] ✅ **Overlay Annulation** : Texte rotatif (-15°) avec backdrop blur
- [x] ✅ **CartItemCard** : Affichage plats avec photo, prix, quantité

#### ✅ CommandeActionButtons

- [x] ✅ **Bouton Voir** : Lien vers `/suivi-commande/{id}`
- [x] ✅ **Bouton Modifier** : Masqué pour statuts "En préparation", "Prête à récupérer", "Récupérée", "Annulée"
- [x] ✅ **Bouton Poubelle** : Visible uniquement pour "En attente de confirmation" et "Confirmée"
- [x] ✅ **BoutonTelechargerFacture** : Pour statut "Récupérée"
- [x] ✅ **BoutonCommanderNouveau** : Pour statuts "Récupérée" ou "Annulée"

#### ✅ Responsive Mobile

- [x] ✅ **Page container** : `px-1 pt-1 pb-8 sm:px-4 sm:py-8`
- [x] ✅ **CardContent padding** : `p-2 sm:p-6`
- [x] ✅ **Header stacking** : `flex flex-col` → `md:grid md:grid-cols-3`
- [x] ✅ **ActionButtons** : `flex-wrap` pour éviter overflow

#### ✅ Page /historique/complet

- [x] ✅ **CalendarView** : Vue calendrier des commandes/événements
- [ ] 🔥 **FilterSearchBar** : Composant existe (`components/historique/FilterSearchBar.tsx`) mais NON intégré

#### ⚠️ Composants Disponibles (Non Intégrés)

- [ ] ⚠️ **FilterSearchBar.tsx** (11615 lignes) : Filtres avancés - À intégrer
- [ ] ⚠️ **HistoryList.tsx** (4244 lignes) : Liste optimisée - À intégrer

#### 💜 Suggestions

- [ ] 💜 **Intégrer FilterSearchBar** dans /historique
- [ ] 💜 **Timeline visuelle commandes** : Vue chronologique verticale
- [ ] 💜 **Prévisualisation facture** : Modal avec PDF viewer

---

### 📍 E. Page Suivi de Commande (/suivi-commande/[id])

**Fichier** : `app/suivi-commande/[id]/page.tsx` (541 lignes)

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **ProgressTimeline** : Chronologie visuelle 5 étapes (ligne 186-190)
  - Commande passée → Confirmation → En préparation → Prête à récupérer → Récupérée
  - États : completed, current, pending, cancelled
  - Composant : `components/suivi-commande/ProgressTimeline.tsx` (225 lignes)
- [x] ✅ **Real-time Supabase sync** : `useCommandesRealtime()` (ligne 54)
- [x] ✅ **Calcul total commande** : `calculateTotal()` (lignes 118-125)
- [x] ✅ **DishDetailsModalComplex** : Modal détails plat cliquable (ligne 216)
- [x] ✅ **Demandes spéciales** : Section affichage (lignes 330-344)
- [x] ✅ **CalendarIcon** : Affichage date stylisé (ligne 360)
- [x] ✅ **Bouton "Modifier ma commande"** : Si statut "En attente" ou "Confirmée" (lignes 466-485)
- [x] ✅ **Messages conditionnels statut** : 5 états différents avec couleurs (lignes 487-527)
- [x] ✅ **Adresse retrait + lien carte** : Lien vers /nous-trouver (lignes 378-390)
- [x] ✅ **StatusBadge** : Badge statut coloré (ligne 442)
- [x] ✅ **Numéro de commande** : Affichage ID (lignes 424-436)
- [x] ✅ **Total à payer** : Section mise en évidence (lignes 446-455)

#### 🔥🔥 Tâches Restantes

- [ ] 🔥🔥 **Intégrer BoutonTelechargerFacture** : Pour commandes "Récupérée"
  - Composant existe mais non intégré dans cette page
- [ ] 🔥🔥 **Notifications Push** : Changement statut via PWA + n8n
  - Infrastructure FCM existe (voir Phase 1)
- [ ] 🔥 **Contact Rapide** : ❌ NON IMPLÉMENTÉ
  - Boutons `<a href="tel:+33749283707">` et `<a href="sms:+33749283707">`
  - Footer a les liens mais pas cette page
- [ ] 🔥 **Laisser un Avis** : ❌ NON IMPLÉMENTÉ
  - Formulaire simple après "Récupérée"
  - Aucun composant de review existant

#### 💜 Suggestions Pratiques

- [ ] 💜 **Chanthana timeline animée** : Chanthana qui "marche" le long de la timeline selon le statut actuel
- [ ] 💜 **Animation changement statut** : Confettis légers (`canvas-confetti`, gratuit) quand commande passe à "Prête"
- [ ] 💜 **QR Code retrait** : Générer QR code avec `qrcode.react` (gratuit) pour identification rapide
- [ ] 💜 **Bouton appel direct** : `<a href="tel:+33749283707">` avec icône téléphone bien visible
- [ ] 💜 **Copier numéro commande** : Bouton copier dans presse-papier pour le numéro de commande
- [ ] 💜 **Chanthana message personnalisé** : Message différent selon statut ("Je prépare !" / "C'est prêt !" / "Merci d'être venu !")

---

### ✏️ F. Page Modifier Commande (/modifier-commande/[id])

**Fichier** : `app/modifier-commande/[id]/page.tsx` (1346 lignes) - **PAGE TRÈS COMPLÈTE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Modification date/heure/jour retrait** : Sélecteurs complets (lignes 786-861)
  - Select jour de la semaine
  - Select date (8 prochaines occurrences du jour)
  - Select heure (18h00-20h30 par 5 min)
- [x] ✅ **Affichage plats disponibles selon jour** : Grille ProductCard (lignes 1114-1155)
- [x] ✅ **Affichage extras disponibles** : Section dédiée avec ExtraDetailsModalInteractive (lignes 1197-1321)
- [x] ✅ **Modification quantités** : Boutons +/- via CartItemCard (lignes 521-530)
- [x] ✅ **Suppression articles** : Fonction `supprimerDuPanierItem()` (lignes 533-535)
- [x] ✅ **Demandes spéciales** : Textarea éditable (lignes 954-974)
- [x] ✅ **Calcul total temps réel** : `totalPrixModification` (lignes 471-476)
- [x] ✅ **Bouton Restaurer original** : `restaurerOriginal()` (lignes 537-554)
- [x] ✅ **Badge "Modifications non sauvegardées"** : Indicateur visuel (lignes 729-735)
- [x] ✅ **Sidebar Desktop avec plats** : Sticky sidebar (lignes 1070-1337)
- [x] ✅ **CommandePlatModal** : Modal ajout plat avec quantité (lignes 1158-1195)
- [x] ✅ **ExtraDetailsModalInteractive** : Modal ajout extra (lignes 1236-1316)
- [x] ✅ **Groupement par date retrait** : Affichage groupé (lignes 875-938)
- [x] ✅ **Logique annulation si panier vide** : Statut → "Annulée" (lignes 560-592)
- [x] ✅ **Création nouvelle commande après modif** : Workflow complet (lignes 604-695)
- [x] ✅ **Toast notifications** : Feedback utilisateur (multiple)
- [x] ✅ **ProductCard + CartItemCard** : Composants réutilisables
- [x] ✅ **Vérification permissions** : Admin OU propriétaire (lignes 136-151)
- [x] ✅ **Bouton panier flottant** : Indicateur Desktop (lignes 751-766)

#### 🔥🔥 Tâches Restantes

- [ ] 🔥🔥 **Dialog confirmation avant sauvegarde** : Récapitulatif changements + différence prix
- [ ] 🔥🔥 **Notification admin via n8n** : Webhook si client modifie commande
- [ ] 🔥🔥 **Email confirmation client** : React Email après sauvegarde
- [ ] 🔥 **Trace modifications** : Log qui/quand/quoi (notes_internes)

---

### 🎉 G. Page Suivi d'Événement (/suivi-evenement/[id])

**Fichier** : `app/suivi-evenement/[id]/page.tsx` (434 lignes)

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Détails événement** : Nom, type, date/heure (lignes 178-221)
- [x] ✅ **Statut avec couleurs** : `getStatutColor()` (lignes 91-107)
- [x] ✅ **Nombre de personnes** : Affichage avec icône Users (lignes 244-251)
- [x] ✅ **Budget indicatif** : Si renseigné (lignes 253-261)
- [x] ✅ **Plats présélectionnés** : Grille avec DishDetailsModal (lignes 281-357)
- [x] ✅ **Demandes spéciales / Thème** : Section affichage (lignes 359-376)
- [x] ✅ **Messages selon statut** : 3 états (Demande/Confirmé/Réalisé) (lignes 381-420)
- [x] ✅ **Bouton Modifier** : Si canEdit (lignes 141-153)
- [x] ✅ **Lien vers /modifier-evenement/[id]** : Navigation (ligne 142)
- [x] ✅ **Date création demande** : Affichage (lignes 263-273)
- [x] ✅ **Vérification propriétaire** : Redirect si non autorisé (lignes 80-83)

#### 🔥🔥 Tâches Restantes

- [ ] 🔥🔥 **ProgressTimelineEvenement** : ❌ N'EXISTE PAS
  - À créer: Chronologie visuelle (Demande → Contact → Devis → Confirmé → Réalisé)
  - Similaire à `ProgressTimeline.tsx` mais pour événements
- [ ] 🔥🔥 **BoutonTelechargerDevis** : ❌ N'EXISTE PAS
  - Template PDF événement à créer avec react-pdf
- [ ] 🔥🔥 **Bouton "Accepter le devis"** : ❌ N'EXISTE PAS
  - Webhook n8n + changement statut
- [ ] 🔥 **Contact Rapide WhatsApp** : ❌ N'EXISTE PAS sur cette page
  - À ajouter: `https://wa.me/33749283707?text=Bonjour, concernant mon événement...`
- [ ] 🔥 **Rappels automatiques** : Infrastructure n8n à configurer

#### 💜 Suggestions Pratiques

- [ ] 💜 **Timeline événement visuelle** : Créer `ProgressTimelineEvenement` (Demande → Contact → Devis → Confirmé → Réalisé)
- [ ] 💜 **Chanthana chef traiteur** : Générer visuel Chanthana en mode "traiteur/buffet" pour cette page
- [ ] 💜 **Bouton WhatsApp pré-rempli** : `https://wa.me/33749283707?text=Bonjour, concernant mon événement du [date]...`
- [ ] 💜 **Récapitulatif imprimable** : Bouton pour générer PDF récapitulatif de l'événement (react-pdf)
- [ ] 💜 **Compte à rebours** : Afficher "J-X" avant l'événement avec animation

---

### 👤 H. Page Profil (/profil) & Inscription (/auth/signup)

#### ✅ Améliorations UI/UX Complétées

- [x] ✅ **Sélecteur de date de naissance amélioré** : Composant `DateBirthSelector` (3 selects)
  - ✅ Fichier: `components/forms/DateBirthSelector.tsx` (229 lignes)
  - ✅ Validation dates impossibles (31 février, etc.)
  - ✅ Mois en français
- [x] ✅ **Harmonisation formulaire signup avec profil** :
  - "Adresse (numéro et rue)" identique
  - "Vos Préférences" → Textarea
  - "Comment avez-vous connu..." formulation identique
  - "Newsletter" → RadioGroup ("Oui, j'accepte" / "Non")

#### 🔥🔥🔥 Gestion du Compte (Sécurité) - ✅ COMPLÉTÉ

- [x] **Section "Sécurité et confidentialité"** : ✅ COMPLÉTÉ
  - ✅ Fichier: `app/profil/page.tsx` (lignes 954-1031)
  - ✅ 3 options avec icônes colorées: Email (amber), Password (blue), Delete (red)

- [x] **Modification Email Sécurisée** : ✅ COMPLÉTÉ
  - ✅ Page: `app/profil/change-email/page.tsx`
  - ✅ Exige password actuel + double confirmation email
  - ✅ Notice de vérification email

- [x] **Modification Mot de Passe** : ✅ COMPLÉTÉ
  - ✅ Page: `app/profil/change-password/page.tsx`
  - ✅ Toggle visibilité pour les 3 champs (Eye/EyeOff icons)
  - ✅ Validation force mot de passe

- [x] **Suppression Compte (GDPR)** : ✅ COMPLÉTÉ
  - ✅ Page: `app/profil/delete-account/page.tsx`
  - ✅ Confirmation password + texte "SUPPRIMER MON COMPTE"
  - ✅ Notice GDPR complète
  - ✅ Option "pause" proposée

- [x] **Mot de Passe Oublié** : ✅ Route existe
  - ✅ Page: `app/auth/reset-password/page.tsx`
  - ✅ Template email: `emails/ResetPasswordEmail.tsx`

- [ ] **Design Boutons Auth** : Optionnel - UX déjà fonctionnelle

#### 💜 Suggestions Pratiques

- [ ] 💜 **Avatar Chanthana personnalisé** : Option d'avoir Chanthana comme avatar par défaut (avec variations)
- [ ] 💜 **Indicateurs visuels allergies** : Icônes claires pour allergies communes (gluten, arachides, fruits de mer)
- [ ] 💜 **Animation sauvegarde** : Micro-animation checkmark vert quand un champ est sauvegardé
- [ ] 💜 **Mode daltonien** : Toggle pour adapter les couleurs (accessibilité, gratuit avec CSS)
- [ ] 💜 **Chanthana anniversaire** : Animation spéciale si c'est l'anniversaire du client

#### 🔥 Intégration n8n Communication

- [ ] **Messages Anniversaire** : Cron quotidien envoi vœux automatiques
- [ ] **Newsletter Actualités** : Système envoi emails offres spéciales (manuel/programmé)

---

### ✅ I. Page Confirmation Commande (/commander/confirmation)

**Fichier** : `app/commander/confirmation/page.tsx` (59 lignes) - **PAGE SIMPLE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Message confirmation visuel** : Card centrée avec CheckCircle2 vert
- [x] ✅ **Redirection auto 10s** : Timer automatique vers page d'accueil
- [x] ✅ **Bouton "Nouvelle commande"** : Redirection vers `/commander`
- [x] ✅ **Bouton "Retour à l'accueil"** : Redirection vers `/`
- [x] ✅ **Message email** : Indication "Vous recevrez un email de confirmation"
- [x] ✅ **Design responsive** : Centré avec `min-h-screen` et `max-w-md`

#### 💜 Suggestions Pratiques

- [ ] 💜 **Animation Chanthana célébration** : Remplacer CheckCircle par Chanthana qui fait le wai avec confettis
- [ ] 💜 **QR Code récapitulatif** : Afficher QR code de la commande pour présentation au restaurant
- [ ] 💜 **Son de confirmation** : Petit son joyeux (ding) à l'affichage de la page

---

### ✏️ J. Page Modifier Événement (/modifier-evenement/[id])

**Fichier** : `app/modifier-evenement/[id]/page.tsx` (647 lignes) - **PAGE TRÈS COMPLÈTE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Formulaire complet événement** : Type, date/heure, nombre personnes, budget
  - 6 types d'événements : Anniversaire, Repas d'entreprise, Fête de famille, Cocktail dînatoire, Buffet traiteur, Autre
  - Sélecteurs date : Jour/Mois/Année (3 selects)
  - Sélecteur heure : 9h00-23h00 par 15 minutes
  - Minimum 10 personnes
- [x] ✅ **Précision "Autre" type** : Champ texte si type = "Autre"
- [x] ✅ **Sélection plats présélectionnés** : Checkboxes avec grid responsive + Tooltips photos
- [x] ✅ **Demandes spéciales / Thème** : Textarea pour allergies, régimes
- [x] ✅ **Chargement données existantes** : `usePrismaEvenementById()` hook
- [x] ✅ **Mise à jour mutation** : `usePrismaUpdateEvenement()` hook
- [x] ✅ **Vérification permissions** : Propriétaire uniquement (redirect si non autorisé)
- [x] ✅ **Blocage modification** : Si statut "Réalisé" ou "Payé intégralement"
- [x] ✅ **Bouton retour historique** : Navigation vers `/historique`
- [x] ✅ **Header gradient** : Dégradé thai-green → thai-orange
- [x] ✅ **Toast notifications** : Feedback succès/erreur
- [x] ✅ **Responsive design** : Grid adaptatif 1-2 colonnes
- [x] ✅ **AppLayout wrapper** : Navigation cohérente

#### 🔥 Tâches Restantes

- [ ] 🔥 **Confirmation avant sauvegarde** : Dialog récapitulatif modifications
- [ ] 🔥🔥 **Notification admin via n8n** : Webhook si client modifie événement

#### 💜 Suggestions Pratiques

- [ ] 💜 **Comparaison avant/après** : Afficher diff des changements avant sauvegarde
- [ ] 💜 **Chanthana traiteur** : Avatar Chanthana avec plateau dans le header

---

### 🔔 K. Page Préférences Notifications (/profil/notifications)

**Fichier** : `app/profil/notifications/page.tsx` (399 lignes) - **PAGE COMPLÈTE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Switch global notifications** : Activer/désactiver toutes les notifications
- [x] ✅ **Notifications commandes** : 4 toggles (confirmée, préparation, prête, retard)
- [x] ✅ **Notifications événements** : 4 toggles (confirmé, rappel 48h, rappel 24h, préparation)
- [x] ✅ **Marketing & actualités** : 3 toggles (promotions, nouveautés, newsletter)
- [x] ✅ **Autres notifications** : 2 toggles (rappel paiement, messages admin)
- [x] ✅ **Server Actions** : `getNotificationPreferences()`, `updateNotificationPreferences()`
- [x] ✅ **Sauvegarde instantanée** : Update à chaque toggle avec toast feedback
- [x] ✅ **État loading** : Spinner pendant chargement initial
- [x] ✅ **Gestion erreurs** : Restauration valeur si échec + toast erreur
- [x] ✅ **Bouton retour** : Navigation avec `router.back()`
- [x] ✅ **Note confidentialité** : Message RGPD en bas de page
- [x] ✅ **Icônes par catégorie** : Bell, ShoppingCart, Calendar, Tag, MessageSquare
- [x] ✅ **Désactivation conditionnelle** : Toggles grisés si notifications globales off

#### 💜 Suggestions Pratiques

- [ ] 💜 **Chanthana notifications** : Avatar Chanthana tenant une cloche dans le header
- [ ] 💜 **Test notification** : Bouton "Envoyer une notification test"

---

### ✨ L. Page Actualités / Découvertes (/actualites)

**Fichier** : `app/actualites/page.tsx` (189 lignes) - **PAGE STATIQUE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Header animé** : Sparkles icon avec animation pulse
- [x] ✅ **Section Plat du Moment** : Card avec placeholder image + boutons Commander/Voir menu
- [x] ✅ **Section Nouveautés Menu** : Grid 3 cards (mockées)
- [x] ✅ **Section Infos Pratiques** : Horaires, fermetures exceptionnelles, événements
- [x] ✅ **Section Réseaux Sociaux** : Boutons Facebook + Instagram avec gradients
- [x] ✅ **Bouton retour accueil** : CTA en bas de page
- [x] ✅ **Metadata SEO** : Titre + description pour référencement
- [x] ✅ **Design gradient** : `bg-gradient-thai` cohérent

#### 🔥🔥 Tâches Restantes (Contenu Dynamique)

- [ ] 🔥🔥 **Plat du moment dynamique** : Récupérer depuis DB ou admin config
- [ ] 🔥🔥 **Nouveautés réelles** : Filtrer plats récents (`created_at` < 30 jours)
- [ ] 🔥 **URLs réseaux sociaux** : Remplacer placeholders par vraies URLs
- [ ] 🔥 **Fermetures exceptionnelles** : Lier à table `ruptures_exceptionnelles` ou config admin

#### 💜 Suggestions Pratiques

- [ ] 💜 **Chanthana nouveautés** : Animation Chanthana présentant un nouveau plat
- [ ] 💜 **Instagram embed** : Intégrer feed Instagram réel (gratuit avec widget)
- [ ] 💜 **Countdown prochaine ouverture** : Si fermé, afficher "Prochaine ouverture dans X heures"

---

### 📍 M. Page Nous Trouver (/nous-trouver)

**Fichier** : `app/nous-trouver/page.tsx` (326 lignes) - **PAGE COMPLÈTE**

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **Carte Google Maps** : Iframe avec adresse complète
- [x] ✅ **États carte** : Loading (spinner) + Error (fallback bouton)
- [x] ✅ **Boutons itinéraires** : Google Maps + Waze avec liens directs
- [x] ✅ **Coordonnées complètes** : Adresse, téléphone `tel:`, email `mailto:`
- [x] ✅ **Contact direct** : Messenger + WhatsApp avec boutons stylés
- [x] ✅ **Horaires d'ouverture** : Lun/Mer/Ven/Sam 18h00-20h30
- [x] ✅ **Header gradient** : Orange → Gold avec MapPin icon
- [x] ✅ **AppLayout wrapper** : Navigation cohérente
- [x] ✅ **Bouton retour accueil** : Style cohérent avec autres pages
- [x] ✅ **Responsive design** : Grid 1-2 colonnes selon breakpoint
- [x] ✅ **Hover effects** : Animations subtiles sur les sections

#### 🔥 Tâches Restantes

- [ ] 🔥 **Clé API Google Maps** : Remplacer `VOTRE_CLE_API_GOOGLE_MAPS` par vraie clé
- [ ] 🔥 **URL Facebook** : Remplacer `https://m.me/chanthanathaikok` par vraie page

#### 💜 Suggestions Pratiques

- [ ] 💜 **Chanthana accueil** : Avatar Chanthana faisant le wai "Bienvenue !"
- [ ] 💜 **Photo du restaurant** : Ajouter photo extérieur/intérieur du restaurant
- [ ] 💜 **Parking info** : Indiquer possibilités de stationnement

---

## 🛠️ Phase 3 : Interface Admin & Workflows (🔥🔥 MOYENNE)

**Objectif : Optimiser workflows admin et automatiser communications**

**Dépend de : n8n setup ⏳ | React Email templates ⏳**

### 📋 A. Page Admin / Commandes (/admin/commandes)

#### ✅ Améliorations Complétées

- [x] ✅ **Sélecteur de date amélioré** : Composant `DateSelector` (3 selects)
- [x] ✅ **"Mettre en avant"** : Bouton épingler/désépingler + tri automatique
- [x] ✅ **"Offrir un plat"** : Marquer plat comme offert (prix 0€)
- [x] ✅ **Distribution épicée sauvegardée** : Zod schema + `spice_distribution` conservé lors création commande
- [x] ✅ **Affichage cercles colorés** : SpiceDistributionDisplay + `getDistributionText()` remplace SELECT dropdown
- [x] ✅ **Modification distribution liste** : Dialog + SpiceDistributionSelector dans PlatCommandeCard
- [x] ✅ **Modification distribution modal Détails** : Dialog + SpiceDistributionSelector dans ModalPlatCard
- [x] ✅ **Ordre affichage** : Quantité → Prix unitaire → Épicé
- [x] ✅ **SpiceDistributionDisplay avec icônes gradient** : Icônes circulaires (Leaf/Flame) avec gradients colorés + badges numériques, style identique à SpiceDistributionSelector
- [x] ✅ **Layout panier optimisé** : Photo 1:1 (w-18 h-18) sur 2 lignes, Ligne 1 (Nom + icônes épicées + prix), Ligne 2 (prix unitaire + poubelle + quantité)

#### 🔥🔥 Automatisations n8n

- [ ] **Factures automatiques** : Génération + envoi email si statut "Récupérée"
- [ ] **Notification retard** : Bouton admin envoi SMS prédéfini (ex: "5 min de retard")
- [ ] **Notifications statut** : Webhook auto SMS/WhatsApp si "Prête à récupérer"
- [ ] **Impression tickets** : Workflow n8n impression auto si "Confirmée"
- [ ] **Demande avis** : Email/SMS automatique 1h après "Récupérée"

#### 💜 Suggestions Pratiques

- [ ] 💜 **Son nouvelle commande** : Notification sonore (Audio API gratuit) quand nouvelle commande arrive
- [ ] 💜 **Vue compacte/étendue** : Toggle pour voir plus/moins de détails par commande
- [ ] 💜 **Drag & drop statuts** : Glisser-déposer commandes entre colonnes de statut (Kanban style)
- [ ] 💜 **Timer préparation** : Chrono depuis passage en "En préparation" pour suivre le temps
- [ ] 💜 **Raccourcis clavier** : Touches 1-5 pour changer rapidement le statut de la commande sélectionnée

### 🍲 B. Page Admin / Plats (/admin/plats)

#### 🔥🔥 Système Ruptures Exceptionnelles - ✅ COMPLÉTÉ

**Objectif : Gestion stock par exception (dates spécifiques)**

- [x] **Table Base de Données** : ✅ COMPLÉTÉ
  - ✅ Table: `plats_rupture_dates` (schema.prisma lignes 464-480)
  - ✅ Colonnes: plat_id, date_rupture, raison_rupture, type_rupture, notes_rupture, is_active
  - ✅ Indexes: `idx_plats_rupture_dates_date_active`, `idx_plats_rupture_dates_plat_date`
  - ⚠️ Note: La table s'appelle `plats_rupture_dates`, PAS `ruptures_exceptionnelles`

- [x] **Interface Admin** : ✅ COMPLÉTÉ
  - ✅ Composant: `components/admin/DateRuptureManager.tsx` (14 KB)
  - ✅ Sélection date avec dates passées désactivées
  - ✅ Types de rupture: stock, congés, maintenance, autre
  - ✅ Champ raison (obligatoire) + notes (optionnel)
  - ✅ Affichage ruptures actives/passées/désactivées
  - ✅ Bouton "Ruptures" dans admin/plats (lignes 1410-1417)
  - ✅ Hooks: `usePlatRuptures`, `useCreatePlatRupture`, `useDeletePlatRupture`

- [ ] **Décompte Automatique** : ❌ NON IMPLÉMENTÉ
  - À créer: Fonction Postgres décrémente `quantite_restante` à chaque commande "Confirmée"

- [ ] **Affichage Côté Client** : ❌ NON IMPLÉMENTÉ
  - À créer: Badge "Plus que X disponibles !" si quantité limitée
  - À créer: "Épuisé pour aujourd'hui" si rupture totale

#### 🔥 UX & Fonctionnalités - ✅ COMPLÉTÉ

- [x] **Confirmation suppression extra** : ✅ COMPLÉTÉ
  - ✅ AlertDialog dans `app/admin/plats/page.tsx` (lignes 700-724)
  - ✅ State: `extraToDelete` (ligne 307)
  - ✅ Handler: `confirmDeleteExtra` (lignes 356-364)

- [x] **Transférer extra → menu** : ✅ COMPLÉTÉ
  - ✅ Bouton "Transformer en Plat Menu" avec icône Utensils (lignes 682-689)
  - ✅ Handler: `handleTransformToPlat()` (lignes 369-410)
  - ✅ Crée nouveau plat + supprime extra + rafraîchit les deux listes
  - ✅ Toast succès: "Extra transformé en plat menu !"

#### 💜 Suggestions Pratiques

- [ ] 💜 **Duplication rapide plat** : Bouton "Dupliquer" pour créer variante d'un plat existant
- [ ] 💜 **Prévisualisation mobile** : Voir comment le plat apparaît sur mobile avant de sauvegarder
- [ ] 💜 **Tags allergènes visuels** : Icônes standardisées (gluten, lait, œuf, etc.) - génération avec Chanthana tenant chaque allergène
- [ ] 💜 **Import photo par URL** : Coller une URL d'image au lieu d'uploader fichier
- [ ] 💜 **Ordre personnalisé affichage** : Drag & drop pour réorganiser l'ordre des plats dans le menu

### 👥 C. Page Admin / Clients (/admin/clients)

**🔥🔥 Création Client Manuel - ✅ COMPLÉTÉ**

- [x] **Bouton "Nouveau Client"** : ✅ COMPLÉTÉ
  - ✅ Fichier: `components/admin/clients/ClientCombobox.tsx` (lignes 137-146)
  - ✅ Bouton vert avec icône Plus, hover scale + shadow
  - ✅ Callback `onCreateNewClient` ouvre le modal

- [x] **Modal création client** : ✅ COMPLÉTÉ (remplace route dédiée)
  - ✅ Fichier: `components/admin/clients/CreateClientModal.tsx` (339 lignes)
  - ✅ Orchestration: `app/admin/clients/page.tsx` (lignes 647-696)
  - ~~Route `/admin/clients/creer`~~ : Non nécessaire (modal utilisé)

- [x] **Formulaire création** : ✅ COMPLÉTÉ
  - ✅ Champs: nom, prénom, email, téléphone, adresse, code_postal, ville, date_de_naissance, preference_client
  - ✅ Validation champs requis (nom, prénom, email)
  - ✅ Hook `usePrismaCreateClient()` pour mutation
  - ✅ Auto-save + Toast notifications

- [x] **Enregistrement** : ✅ COMPLÉTÉ
  - ✅ Génère `auth_user_id` temporaire: `manual_${Date.now()}_${random}`
  - ✅ Invalidation cache automatique via TanStack Query

#### 💜 Suggestions Pratiques

- [ ] 💜 **Recherche rapide clavier** : Raccourci Ctrl+K pour focus sur recherche client (cmdk library gratuite)
- [ ] 💜 **Indicateur "Nouveau client"** : Badge visuel pour clients inscrits depuis moins de 7 jours
- [ ] 💜 **Notes rapides** : Champ notes internes pour mémoriser préférences/infos importantes du client
- [ ] 💜 **Dernière commande visible** : Afficher date et contenu de la dernière commande dans la fiche client
- [ ] 💜 **Chanthana accueil client** : Animation Chanthana qui fait le wai quand on ouvre une fiche client fidèle

### ➕ D. Page Admin / Création Commande (/admin/commandes/creer)

**🔥🔥 Création Commande Manuelle - ❌ NON IMPLÉMENTÉ**

> **Note** : Feature branch `feature/test-de-la-nouvelle-commande` existe mais non mergée dans main

- [ ] **Bouton "Nouvelle Commande"** : ❌ À CRÉER sur page `/admin/commandes`
- [ ] **Route `/admin/commandes/creer`** : ❌ À CRÉER - Page dédiée création
- [ ] **Formulaire multi-étapes** : ❌ À IMPLÉMENTER
  - Étape 1 : Sélection client (recherche ou création à la volée)
  - Étape 2 : Composition commande (plats + extras + quantités)
  - Étape 3 : Détails (heure retrait, type livraison, commentaires)
  - Étape 4 : Récapitulatif + validation
- [ ] **Validation** : Schemas Zod (dépend de : Schemas Zod ⏳)
- [ ] **Enregistrement** : Server Action création commande complète

**Ce qui EXISTE actuellement :**

- ✅ `AddPlatModal` : Ajouter plats à commande existante (lignes 857-1316)
- ✅ `AddComplementModal` : Ajouter extras à commande existante
- ✅ `QuickActionsModal` : Notes et actions rapides (lignes 287-410)
- ✅ Boutons (+) pour ajouter articles aux commandes existantes

#### 💜 Suggestions Pratiques

- [ ] 💜 **Son nouvelle commande** : Notification sonore (Audio API gratuit) quand nouvelle commande client arrive
- [ ] 💜 **Vue compacte/étendue** : Toggle pour voir plus/moins de détails par commande
- [ ] 💜 **Drag & drop statuts** : Glisser-déposer commandes entre colonnes de statut (Kanban style avec @hello-pangea/dnd)
- [ ] 💜 **Timer préparation** : Chrono depuis passage en "En préparation" pour suivre le temps
- [ ] 💜 **Raccourcis clavier** : Touches 1-5 pour changer rapidement le statut de la commande sélectionnée
- [ ] 💜 **Chanthana préparation** : Animation Chanthana qui cuisine pendant le statut "En préparation"

### 🎬 E. Page Admin / Hero Media (/admin/hero-media) ✅

**🔥🔥 Gestion Carousel Page d'Accueil - COMPLÈTE**

#### Table Base de Données

- [x] **Créer table `hero_media`** : ✅
  - Colonnes : id, type (image/video), url, titre, description, ordre, active, created_at, updated_at
  - Migration Prisma + génération types TypeScript
  - Table existante dans schema.prisma

#### Interface Admin

- [x] **Page CRUD complète** : ✅
  - [x] Liste médias avec preview miniature (vidéo + image)
  - [x] Drag & drop pour réordonner (@hello-pangea/dnd)
  - [x] Upload fichiers : Max 50MB, validation MIME (MP4, JPG, PNG, WEBP, GIF)
  - [x] Toggle actif/inactif (masquer sans supprimer)
  - [x] Édition titre + description (via modal)
  - [x] Suppression avec confirmation (AlertDialog)
  - [x] Drag & drop upload zone moderne (style 21st.dev)
  - [x] Preview fichier avant upload (vidéo + image)
  - [x] Nettoyage noms fichiers (accents + caractères spéciaux)

#### Server Actions

- [x] **uploadHeroMedia()** : Upload + validation + stockage Supabase ✅
  - API route `/api/hero-media/upload` avec service_role key
  - Validation taille (50MB) et type MIME
  - Buffer conversion pour upload Supabase Storage
- [x] **updateHeroMediaOrder()** : Réorganiser ordre affichage ✅
  - Server Action `reorderHeroMedias` avec transaction Prisma
- [x] **toggleHeroMediaActive()** : Activer/désactiver média ✅
  - Server Action `toggleHeroMediaActive`
- [x] **deleteHeroMedia()** : Suppression définitive ✅
  - Suppression fichier Supabase Storage + entrée DB

#### TanStack Query Hooks

- [x] **useGetAllHeroMedias()** : Récupérer tous les médias ✅
- [x] **useCreateHeroMedia()** : Créer nouveau média ✅
- [x] **useUpdateHeroMedia()** : Mettre à jour média ✅
- [x] **useReorderHeroMedias()** : Réorganiser ordre ✅
- [x] **useToggleHeroMediaActive()** : Toggle actif/inactif ✅
- [x] **useDeleteHeroMedia()** : Supprimer média ✅

#### Tests

- [ ] **Tests upload** : Fichiers valides/invalides, taille max ⚠️ À faire
- [ ] **Tests permissions** : Seul admin peut modifier ⚠️ À faire
- [ ] **Tests performance** : Lazy loading, optimisation vidéos ⚠️ À faire

#### 💜 Suggestions Pratiques

- [ ] 💜 **Prévisualisation carousel** : Voir le rendu final du carousel en temps réel pendant l'édition
- [ ] 💜 **Compression automatique** : Compresser vidéos côté client avant upload (ffmpeg.wasm gratuit)
- [ ] 💜 **Templates Hero** : Présets de carousel (accueil festif, promo saison, minimal)
- [ ] 💜 **Chanthana dans carousel** : Ajouter facilement Chanthana en overlay sur les médias

### 🔔 F. Page Admin / Test Visuel Toasts (/admin/testvisuel/toasts) ✅

**Fichier** : `app/admin/testvisuel/toasts/page.tsx` (~1650 lignes)

#### Playgrounds

- [x] **ToasterPlayground** : Playground toast simple (lignes 36-723)
- [x] **ToasterVideoPlayground** : Playground toast vidéo (lignes 727-1595)

#### Props ToasterPlayground (toast simple)

- [x] title, description
- [x] variant (default, destructive, polaroid, success, warning, info)
- [x] tilted, tiltedAngle
- [x] duration
- [x] borderColor, customBorderColor, borderWidth, customBorderWidth
- [x] shadowSize (sm, md, lg, xl, 2xl)
- [x] maxWidth (sm, md, lg, xl)
- [x] titleColor (5 couleurs), titleFontWeight (4 poids)
- [x] descriptionColor (5 couleurs), descriptionFontWeight (4 poids)
- [x] animateBorder, hoverScale, rotation
- [x] position (9 positions), customX, customY
- [x] redirectUrl, redirectBehavior
- [x] typingAnimation, typingSpeed

#### Props ToasterVideoPlayground (toast vidéo)

- [x] title, description, media
- [x] position (9 positions), customX, customY
- [x] aspectRatio (16:9, 4:5, 1:1, auto)
- [x] polaroid
- [x] polaroidPaddingSides, polaroidPaddingTop, polaroidPaddingBottom
- [x] scrollingText, scrollDuration, scrollSyncWithVideo
- [x] borderColor, customBorderColor, borderWidth, customBorderWidth
- [x] shadowSize (sm, md, lg, xl, 2xl)
- [x] maxWidth (sm, md, lg, xl)
- [x] titleColor (5 couleurs), descriptionColor (5 couleurs)
- [ ] titleFontWeight, descriptionFontWeight (MANQUANTS - à ajouter)
- [x] animateBorder, hoverScale, rotation
- [x] typingAnimation, typingSpeed
- [x] playCount (1, 2, custom), customPlayCount, customDuration
- [x] redirectUrl, redirectBehavior
- [x] showCloseButton

#### Fonctionnalités

- [x] BroadcastChannel sync temps réel
- [x] Bouton "Ouvrir Preview" (`/preview/render`)
- [x] Bouton "Afficher Toast" (test réel)
- [x] Info balises couleur/style (Dialog)

#### 💜 Suggestions Pratiques

- [ ] 💜 **Bibliothèque templates** : Sauvegarder configs de toast en templates réutilisables
- [ ] 💜 **Export config JSON** : Exporter/importer configuration toast pour backup
- [ ] 💜 **Toast Chanthana** : Preset avec avatar Chanthana animé intégré

### 🎬 G. Page Admin / Test Visuel Modal (/admin/testvisuel/modal) ✅

**Fichier** : `app/admin/testvisuel/modal/page.tsx` (~1798 lignes)

#### Playground

- [x] **ModalVideoPlayground** : Playground modal vidéo (lignes 231-1378)

#### Props ModalVideoPlayground

- [x] title, description, media
- [x] aspectRatio (16:9, 4:5, 1:1, auto)
- [x] polaroid
- [x] scrollingText, scrollDuration, scrollSyncWithVideo
- [x] loopCount
- [x] buttonLayout (none, single, double, triple)
- [x] cancelText, confirmText, thirdButtonText
- [x] rotation, hoverScale
- [x] maxWidth (sm, md, lg, xl, custom), customWidth, customHeight
- [x] borderColor (+ custom), customBorderColor, borderWidth (+ custom), customBorderWidth
- [x] shadowSize (none, sm, md, lg, xl, 2xl)
- [x] polaroidPaddingSides, polaroidPaddingTop, polaroidPaddingBottom
- [x] autoClose
- [x] cancelLink, confirmLink, thirdButtonLink
- [x] position (center, corners, custom), customX, customY
- [x] titleColor (5 couleurs), titleFontWeight (4 poids)
- [x] descriptionColor (5 couleurs), descriptionFontWeight (4 poids)
- [x] typingAnimation, typingSpeed
- [x] animateBorder

#### Fonctionnalités

- [x] Aperçu standalone (ModalVideoContent)
- [x] Bouton "Tester Modal Réel" (avec backdrop)
- [x] Bouton "Ouvrir Preview" (`/preview/render`)
- [x] Bouton "Copier Code" (code JSX généré)
- [x] BroadcastChannel sync temps réel
- [x] Info balises couleur/style (Dialog)
- [x] Sélecteur plats (données Prisma)

#### Composants Associés

- [x] `components/ui/ModalVideo.tsx` (805 lignes)
- [x] `ModalVideoContent` : Contenu réutilisable (standalone ou dialog)

#### 💜 Suggestions Pratiques

- [ ] 💜 **Bibliothèque modals** : Sauvegarder configs de modal en templates réutilisables
- [ ] 💜 **Preview multi-device** : Voir rendu sur mobile/tablet/desktop côte à côte
- [ ] 💜 **Modal Chanthana promo** : Template modal avec Chanthana pour annoncer plats du jour

### 💬 H. Page Admin / Messages n8n (/admin/messages) - 🆕 À CRÉER

**🔥🔥🔥 PRIORITÉ HAUTE - Interface Human-in-the-Loop pour n8n + IA/RAG**

**Concept :**

```
Client (WhatsApp/SMS/Email) → n8n + IA/RAG analyse → Page Admin → Tu valides → n8n répond au client
```

#### Structure Base de Données

- [ ] 🔥🔥🔥 **Table `messages_pending`** : À CRÉER
  - Colonnes: id, canal (whatsapp/sms/email), numero_client, contenu_original, ia_analyse, ia_reponse_proposee, type_message (commande/question/evenement/modification/autre), statut (pending/approved/rejected/modified), created_at, processed_at, processed_by

#### Interface Admin

- [ ] 🔥🔥🔥 **Inbox temps réel** : Liste messages en attente avec polling/websocket
- [ ] 🔥🔥🔥 **Card message** :
  - Canal (icône WhatsApp/SMS/Email)
  - Numéro/email client
  - Message original du client
  - Analyse IA (ex: "Commande détectée: 2 Pad Thai, 1 Tom Yum")
  - Réponse proposée par IA (éditable)
- [ ] 🔥🔥🔥 **Actions rapides** :
  - [✓ Approuver] → n8n envoie la réponse proposée
  - [✏️ Modifier] → Textarea pour éditer la réponse avant envoi
  - [✗ Refuser] → n8n envoie message d'erreur/excuse
- [ ] 🔥🔥 **Badge non-lus** : Nombre de messages en attente dans sidebar admin
- [ ] 🔥🔥 **Son notification** : Ding quand nouveau message arrive
- [ ] 🔥 **Auto-refresh** : Polling toutes les 5-10 secondes ou WebSocket

#### Workflows n8n Associés

- [ ] 🔥🔥🔥 **Webhook réception** : POST /api/n8n/message-received (depuis WhatsApp/SMS/Email)
- [ ] 🔥🔥🔥 **Webhook validation** : POST /api/n8n/message-validated (déclenche réponse client)
- [ ] **Types de messages** :
  - `commande` : Client veut commander → IA extrait plats → Tu confirmes → Commande créée en DB
  - `question` : Client pose question → IA génère réponse → Tu valides → Réponse envoyée
  - `evenement` : Demande traiteur → IA prépare infos → Tu complètes
  - `modification` : Client veut modifier commande → IA propose action → Tu valides
  - `autre` : Message non classifié → Tu réponds manuellement

#### 💜 Suggestions Pratiques

- [ ] 💜 **Swipe mobile** : Glisser droite = Approuver, Glisser gauche = Refuser
- [ ] 💜 **Réponses rapides** : Templates de réponses fréquentes (1 tap)
- [ ] 💜 **Timeout visuel** : Message non traité > 5min = badge rouge clignotant
- [ ] 💜 **Push admin** : Notification sur téléphone même app fermée
- [ ] 💜 **Chanthana IA** : Avatar Chanthana à côté de l'analyse IA

### 📢 I. Page Admin / Publications n8n (/admin/publications) - 🆕 À CRÉER

**🔥🔥 PRIORITÉ MOYENNE - Créateur de Contenu Réseaux Sociaux via n8n**

**Concept :**

```
Admin upload image + écrit message → n8n génère formats adaptés → Publie sur Facebook, Instagram, X
```

#### Interface Admin

- [ ] 🔥🔥 **Zone upload image** : Drag & drop ou sélection fichier
  - Formats acceptés : JPG, PNG, WebP
  - Taille max : 10MB
  - Preview de l'image uploadée
  - Recadrage optionnel (react-image-crop déjà installé)
- [ ] 🔥🔥 **Textarea message** : Texte de la publication
  - Compteur caractères (280 pour X, illimité pour FB/IG)
  - Suggestions hashtags populaires (#ThaïFood, #Marigny, #ChanthanaCook)
  - Emojis picker optionnel
- [ ] 🔥🔥 **Sélection réseaux** : Checkboxes
  - [ ] Facebook
  - [ ] Instagram
  - [ ] X (Twitter)
  - Bouton "Tout sélectionner / Désélectionner"
- [ ] 🔥🔥 **Bouton "Créer la pub"** : Envoie à n8n
- [ ] 🔥 **Preview par réseau** : Aperçu du rendu sur chaque plateforme (optionnel)

#### Workflow n8n

- [ ] 🔥🔥 **Webhook réception** : POST /api/n8n/create-publication
  - Payload : `{ image_base64, message, networks: ['facebook', 'instagram', 'x'] }`
- [ ] 🔥🔥 **Redimensionnement auto** :
  - Facebook : 1200x630px (lien) ou 1080x1080px (post)
  - Instagram : 1080x1080px (carré) ou 1080x1350px (portrait)
  - X/Twitter : 1200x675px
- [ ] 🔥🔥 **Publication via APIs** :
  - Facebook Graph API (Page Token)
  - Instagram Graph API (Business Account)
  - X API v2 (OAuth 2.0)
- [ ] 🔥 **Retour statut** : Webhook callback avec URLs des posts créés

#### Options Avancées (Optionnel)

- [ ] 💜 **Planification** : Date/heure de publication différée
- [ ] 💜 **Templates** : Modèles de messages pré-enregistrés (Plat du jour, Fermeture exceptionnelle, Nouveau plat)
- [ ] 💜 **Historique** : Liste des dernières publications avec liens vers les posts

#### 💜 Suggestions Pratiques

- [ ] 💜 **Loading Chanthana** : Animation Chanthana pendant génération/publication
- [ ] 💜 **Toast succès** : "Publication créée sur 3 réseaux !" avec liens cliquables
- [ ] 💜 **Toast erreur** : Message explicite si échec (token expiré, limite API, etc.)
- [ ] 💜 **Brouillons** : Sauvegarder sans publier pour plus tard
- [ ] 💜 **Copier depuis plat** : Bouton pour pré-remplir avec photo/description d'un plat existant

#### Prérequis n8n

**Tokens à configurer dans n8n (gratuits pour usage restaurant) :**

- Facebook : Page Access Token (via Facebook Developer)
- Instagram : Business Account ID + Token (via Meta Business Suite)
- X/Twitter : API Key + Secret + Bearer Token

---

### 🏠 J. Page Admin / Dashboard (/admin) - ⚠️ REFONTE SUGGÉRÉE

**Problème actuel : Stats inutiles (CA, évolution %, graphiques) - Restaurant familial, pas une startup**

#### ❌ À SUPPRIMER (inutile)

- [ ] 💜 Supprimer KPI "CA Aujourd'hui" et "CA Semaine" (visible en caisse)
- [ ] 💜 Supprimer "Évolution % hebdo" (statistique corporate)
- [ ] 💜 Supprimer graphique "Tendance 7 derniers jours" (gadget)
- [ ] 💜 Supprimer "Taux de service" (KPI entreprise)
- [ ] 💜 Supprimer "Clients actifs" (inutile)
- [ ] 💜 Supprimer horloge temps réel (on a l'heure sur le téléphone)

#### ✅ À GARDER (simplifié)

- Commandes en attente de confirmation (URGENT - visible)
- Commandes en préparation (en cours)
- Commandes prêtes à récupérer (action requise)
- Alertes plats épuisés (stock)

#### 💜 NOUVEAU DESIGN SUGGÉRÉ

- [ ] 💜 **Vue Kanban commandes** : 4 colonnes swipeable (En attente → Confirmée → En préparation → Prête)
- [ ] 💜 **Timeline du jour** : Liste verticale commandes avec heure de retrait, triée chronologiquement
- [ ] 💜 **Quick actions** : Boutons grosses icônes "Confirmer", "Prête", "Retard" accessibles au pouce
- [ ] 💜 **Alertes visuelles** : Badge rouge clignotant si commande en attente > 5min
- [ ] 💜 **Section événements** : "Prochains traiteur" avec J-7, J-3, J-1 (simple liste)
- [ ] 💜 **Chanthana statut** : Avatar Chanthana qui change selon charge (zen, occupée, débordée)
- [ ] 💜 **Son notification** : Ding discret nouvelle commande (Audio API)

### 📊 K. Page Admin / Statistiques (/admin/statistiques) - ⚠️ SIMPLIFIER OU SUPPRIMER

**Problème : Trop de stats marketing (insights, projections, objectifs €10k)**

#### État Actuel (TROP COMPLEXE)

- 3 modes : Overview, Detailed, Trends
- Top 5 plats, tendances 30j, satisfaction client
- Objectifs revenue €10k, projections, recommandations auto

#### ❌ À SUPPRIMER

- [ ] 💜 Supprimer "Insights & Recommandations" (paternaliste)
- [ ] 💜 Supprimer "Objectif revenue €10k" (pression inutile)
- [ ] 💜 Supprimer "Projections fin de mois" (boule de cristal)
- [ ] 💜 Supprimer "Taux de rétention" (marketing)
- [ ] 💜 Supprimer vue "Detailed" (trop complexe)

#### ✅ À GARDER (si page conservée)

- Top 5 plats les plus commandés (utile pour savoir quoi préparer)
- Nombre de commandes par jour de la semaine (pour planning)

#### 💜 OU OPTION RADICALE

- [ ] 💜 **Supprimer la page entière** : Fusionner les 2-3 infos utiles dans /admin/courses (stock)

### ⚙️ L. Page Admin / Paramètres (/admin/parametres) - ✅ EXISTE

**Fichier** : `app/admin/parametres/page.tsx`

**6 catégories de paramètres :**

- Général : Nom restaurant, description, horaires, téléphone, adresse, max commandes/créneau
- Notifications : Email/SMS, alertes nouvelle commande, alertes stock, email admin
- Sécurité : Timeout session, vérification téléphone, tentatives login, exigences mot de passe
- Paiements : Méthodes paiement, montant minimum, frais livraison, taux TVA
- Apparence : Couleurs thème, infos nutritionnelles, allergènes, langue
- Intégrations : Google Analytics, Facebook Pixel, Google Reviews, contact WhatsApp

### 📦 M. Page Admin / Courses (/admin/courses) - ✅ EXISTE

**Fichier** : `app/admin/courses/page.tsx`

**Gestion stock & listes de courses :**

- Onglet "Articles du Catalogue" : Inventaire produits avec statut (Disponible/Rupture/En commande)
- Onglet "Listes de Courses" : Gestion listes achats avec statut (Brouillon/Validée/Commandée/Livrée)
- Métriques : Total articles, articles en rupture, valeur stock, coût estimé listes actives

### 🔧 N. Page Admin / Avancé (/admin/advanced) - ✅ EXISTE

**Fichier** : `app/admin/advanced/page.tsx`

**Configuration technique (6 catégories) :**

- Base de données : Connexion, pool, timeout, SSL, backups auto
- Sécurité : JWT, rate limiting, IPs autorisées, 2FA, durée session
- Performance : Cache, TTL, gzip, CDN, workers
- API & Webhooks : Version API, CORS, secrets webhooks, throttling
- Monitoring : Alertes, rétention métriques, niveau logs
- Backup : Fréquence, rétention, compression, encryption

---

## 📱 Phase 3.5 : Responsive & Mobile (🔥🔥 HAUTE)

**Objectif : Optimiser l'expérience mobile client ET admin**

### État Actuel du Code

**Hooks existants** (`hooks/use-mobile.tsx`) :

- ✅ `useIsMobile()` - Détecte < 768px
- ✅ `useIsTablet()` - Détecte 768-1023px
- ✅ `useBreakpoints()` - Retourne {isMobile, isTablet, isDesktop}

**Composants responsive existants** :

- ✅ `Sidebar.tsx` - Hamburger menu mobile, sidebar desktop
- ✅ `Header.tsx` - Navigation responsive
- ✅ `Drawer` (Vaul) - Bottom-up drawer mobile
- ✅ `Sheet` - Side panel responsive
- ✅ `ResponsiveDateSelector.tsx` - Sélecteur date adaptatif

**PWA existante** :

- ✅ Service Worker registration
- ✅ Apple Web App metadata
- ✅ `SectionPWA.tsx` - UI installation
- ✅ `OfflineBanner.tsx` - Indicateur hors-ligne

### 💜 Améliorations Mobile à Implémenter

#### Navigation Mobile Client

- [x] ✅ **Bottom Navigation Bar** : Barre fixe en bas (Mobile Nav) - ✅ COMPLÉTÉ
- [ ] 💜 **Pull-to-refresh** : Geste natif pour rafraîchir les données (react-pull-to-refresh)
- [x] ✅ **Swipe gestures** : Glisser pour supprimer du panier (Swipeable List) - ✅ COMPLÉTÉ

#### Panier Mobile

- [x] ✅ **Bottom Sheet panier** : Panier dans un Drawer responsive (Vaul) - ✅ COMPLÉTÉ
- [x] ✅ **Docked Cart / Sticky button** : Barre de panier fixe avec résumé - ✅ COMPLÉTÉ
- [x] ✅ **Haptic feedback** : Vibration au clic et interactions (`useHaptic`) - ✅ COMPLÉTÉ

#### Admin Mobile

- [ ] 💜 **Vue Kanban swipeable** : Colonnes swipeable horizontalement sur mobile
- [ ] 💜 **Quick actions pouce** : Boutons grosses icônes accessibles d'un pouce
- [ ] 💜 **Notifications push admin** : Alerte nouvelle commande même app fermée

#### PWA Améliorations

- [ ] 💜 **Splash screen Chanthana** : Écran de démarrage personnalisé avec logo animé
- [ ] 💜 **App shortcuts** : Raccourcis PWA (Commander, Historique) depuis l'icône
- [ ] 💜 **Badge notifications** : Badge sur icône PWA (nombre commandes non lues)
- [ ] 💜 **Background sync** : Sync commandes hors-ligne quand connexion revient

---

## 🤖 Phase 4 : n8n Workflows - Automatisations Détaillées (🔥🔥 MOYENNE)

**Objectif : Automatiser communications multicanal et workflows métier**

**Note : Section À COMPLÉTER AVEC GEMINI en Phase 3 après stabilisation features**

### Architecture générale n8n

```
Next.js App → Webhook POST → n8n → Fan-out multicanal
                                   ├── SMS/WhatsApp (Twilio)
                                   ├── Email (Brevo/SendGrid)
                                   ├── Telegram Bot (Admin)
                                   └── Server Action (PDF, etc.)
```

### A. Workflows Commandes

**Triggers : Webhooks depuis Server Actions**

- [ ] 🔥🔥 **Changement statut commande** :
  - Webhook : `POST /webhook/commande-status-change`
  - Payload : `{ commandeId, oldStatus, newStatus, clientId }`
  - Actions : Envoi notification client (Push PWA → Email → SMS fallback)

- [ ] 🔥🔥 **Génération facture automatique** :
  - Trigger : Statut "Récupérée"
  - Actions : Génération PDF via react-pdf → Upload Hetzner → Envoi email avec lien

- [ ] 🔥 **Notification retard** :
  - Trigger : Bouton admin "Envoyer notification retard"
  - Actions : SMS prédéfini "Votre commande aura X minutes de retard"

- [ ] 🔥 **Demande avis post-commande** :
  - Trigger : Cron (1h après "Récupérée")
  - Actions : Email/SMS avec lien formulaire avis

- [ ] 🔥 **Modification commande client** :
  - Trigger : Webhook après modification
  - Actions : Notification admin Telegram + Email récapitulatif client

### B. Workflows Événements

- [ ] 🔥🔥 **Confirmation réception demande** : Email automatique accusé réception
- [ ] 🔥🔥 **Notification envoi devis** : Email avec PDF devis + bouton validation
- [ ] 🔥🔥 **Rappel 48h avant événement** : SMS + Email automatique
- [ ] 🔥 **Rappel 24h avant événement** : WhatsApp avec détails pratiques
- [ ] 🔥 **Remerciement 24h après** : Email/SMS remerciement + demande avis
- [ ] 🔥 **Relance paiement solde** : Si solde impayé après événement

### C. Workflows Profil & Clients

- [ ] 🔥 **Message anniversaire** : Cron quotidien (9h) vérification dates + envoi email/SMS
- [ ] 🔥 **Newsletter actualités** : Workflow manuel envoi offres spéciales (filtre opt-in)
- [ ] 🔥 **Confirmation modification email/téléphone** : Double email (ancienne + nouvelle adresse)

### D. Workflows Gestion Menu

- [ ] 🔥 **Alerte stock faible** : Webhook si rupture exceptionnelle < seuil
- [ ] 🔥 **Notification plat épuisé** : Alerte clients ayant commandé récemment ce plat

### E. Workflows Admin Généraux

- [ ] 🔥🔥 **Impression tickets de caisse** : Webhook statut "Confirmée" → Impression auto
- [ ] 🔥 **Résumé quotidien** : Cron 8h30 - Email admin stats jour (commandes/événements)
- [ ] 🔥 **Alertes anomalies** : Détection commandes sans client, doublons, erreurs

#### 💜 Suggestions Pratiques n8n

- [ ] 💜 **Backup workflows** : Export automatique JSON des workflows n8n (cron hebdo vers Git)
- [ ] 💜 **Dashboard monitoring** : Page admin affichant statut des derniers webhooks (succès/erreurs)
- [ ] 💜 **Mode test workflows** : Flag "test_mode" pour envoyer tous les emails à admin seulement

---

### 🆕 F. Templates n8n.io Recommandés (Ne pas réinventer la roue !)

**Source : [n8n.io/workflows](https://n8n.io/workflows/) - Templates gratuits prêts à l'emploi**

#### 📱 WhatsApp Business Automation

| Template                                                     | Lien                                                                                                                            | Adaptation Restaurant                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **AI-Powered WhatsApp Assistant for Restaurants**            | [n8n #3043](https://n8n.io/workflows/3043-ai-powered-whatsapp-assistant-for-restaurants-and-delivery-automation/)               | Chatbot IA pour prises de commandes WhatsApp, statuts automatiques |
| **Restaurant Order & Menu Management with Google Gemini**    | [n8n #5096](https://n8n.io/workflows/5096-ai-powered-restaurant-order-and-menu-management-with-whatsapp-and-google-gemini/)     | Menu dans Google Sheets, IA répond "C'est épicé ?" en FR/TH/EN     |
| **WhatsApp Starter Workflow**                                | [n8n #2162](https://n8n.io/workflows/2162-whatsapp-starter-workflow/)                                                           | Auto-réponses basiques "Merci pour votre commande !"               |
| **Product Training & Customer Support via WhatsApp + GPT-4** | [n8n #3379](https://n8n.io/workflows/3379-automate-product-training-and-customer-support-via-whatsapp-gpt-4-and-google-sheets/) | FAQ automatisée ("Vous êtes ouverts quand ?")                      |

#### 📸 Réseaux Sociaux (Instagram/Facebook/X)

| Template                                            | Lien                                                                                                                           | Adaptation Restaurant                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Instagram Single Image Post avec Facebook API**   | [n8n #2537](https://n8n.io/workflows/2537-simple-social-instagram-single-image-post-with-facebook-api/)                        | Post quotidien plat du jour (pas de rate limiting) |
| **Instagram & Facebook avec System User Tokens**    | [n8n #5457](https://n8n.io/workflows/5457-automate-instagram-and-facebook-posting-with-meta-graph-api-and-system-user-tokens/) | Tokens sécurisés, planification avancée            |
| **Instagram Posts avec Google Drive + AI Captions** | [n8n #3478](https://n8n.io/workflows/3478-automate-instagram-posts-with-google-drive-ai-captions-and-facebook-api/)            | Photos dans Drive, IA génère légendes automatiques |
| **Social Media Content AI (IG, FB, LinkedIn, X)**   | [n8n #4637](https://n8n.io/workflows/4637-automate-social-media-content-with-ai-for-instagram-facebook-linkedin-and-x/)        | Multi-plateformes, génération idées + images       |

#### 📧 Notifications Email

| Template                                              | Lien                                                                                                                   | Adaptation Restaurant                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **E-commerce Order Processing avec Email & Webhooks** | [n8n #7518](https://n8n.io/workflows/7518-automate-e-commerce-order-processing-with-email-notifications-and-webhooks/) | Email client + notification cuisine + email livreur |
| **Delivery Confirmation (Telegram + Gmail)**          | [n8n #3204](https://n8n.io/workflows/3204-automate-delivery-confirmation-with-telegram-bot-google-drive-and-gmail/)    | Email remerciement + reçu automatique               |

#### 📲 SMS Automation (Twilio)

| Template                                                 | Lien                                                                                                                | Adaptation Restaurant                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Send SMS/WhatsApp avec Twilio**                        | [n8n #401](https://n8n.io/workflows/401-send-an-smswhatsapp-message-with-twilio/)                                   | "Votre commande #123 est prête !"         |
| **Appointment Reminders via SMS + Webhook**              | [n8n #6932](https://n8n.io/workflows/6932-send-automated-appointment-reminders-via-sms-with-twilio-webhook/)        | Rappel réservation table 1h avant         |
| **Google Sheets + Twilio Bulk SMS**                      | [n8n #8684](https://n8n.io/workflows/8684-google-sheets-send-sms-with-twilio-bulk-sms-automation-simplified/)       | SMS promo ("Plat du jour : Pad Krapow !") |
| **AI-Powered SMS Support (Twilio + GPT-4 + PostgreSQL)** | [n8n #9220](https://n8n.io/workflows/9220-build-an-ai-powered-sms-support-system-with-twilio-gpt-4-and-postgresql/) | Réponses IA aux questions SMS             |

#### 📊 Google Sheets & Reporting

| Template                                         | Lien                                                                                                                             | Adaptation Restaurant                               |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Restaurant Food Waste Prediction (Gemini AI)** | [n8n #5982](https://n8n.io/workflows/5982-predict-restaurant-food-waste-with-gemini-ai-and-google-sheets-reporting/)             | Prédiction demande "Samedi = +30% green curry"      |
| **Restaurant Sales & Inventory Forecasting**     | [n8n #5983](https://n8n.io/workflows/5983-automate-restaurant-sales-and-inventory-forecasting-with-gemini-ai-and-google-sheets/) | Recommandations stock (20kg riz, 5L lait coco)      |
| **Workflow Inventory Dashboard**                 | [n8n #9113](https://n8n.io/workflows/9113-create-workflow-inventory-dashboard-with-n8n-api-and-google-sheets/)                   | Dashboard stock temps réel                          |
| **Google Business Reviews + AI Responses**       | [n8n #6590](https://n8n.io/workflows/6590-automate-google-business-reviews-with-ai-responses-slack-alerts-and-sheets-logging/)   | Réponses automatiques avis Google, alertes 1 étoile |

#### 🔐 Webhooks Sécurisés

| Template                                     | Lien                                                                                                           | Adaptation Restaurant             |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Creating a Secure Webhook (MUST HAVE)**    | [n8n #5174](https://n8n.io/workflows/5174-creating-a-secure-webhook-must-have/)                                | Clé API obligatoire sur webhooks  |
| **Dynamic Workflows via Webhooks & n8n API** | [n8n #4544](https://n8n.io/workflows/4544-create-dynamic-workflows-programmatically-via-webhooks-and-n8n-api/) | Création workflows programmatique |

#### 🍽️ Templates Spéciaux Restaurant

| Template                                                       | Lien                                                                                                                           | Adaptation Restaurant                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **Restaurant Marketing & Booking (Excel + VAPI Voice)**        | [n8n #5890](https://n8n.io/workflows/5890-automate-restaurant-marketing-and-booking-with-excel-vapi-voice-agent-and-calendar/) | Agent vocal pour réservations téléphoniques |
| **AI Restaurant Order Chatbot (GPT-4o + POS)**                 | [n8n #3942](https://n8n.io/workflows/3942-ai-powered-restaurant-order-chatbot-with-gpt-4o-for-pos-integration/)                | Chatbot commandes avec intégration caisse   |
| **Restaurant Order & Delivery (WhatsApp + GPT-4o + Supabase)** | [n8n #7298](https://n8n.io/workflows/7298-restaurant-order-and-delivery-system-for-whatsapp-with-gpt-4o-and-supabase/)         | Système complet WhatsApp → Supabase         |

---

### 💜 G. Plan de Déploiement Recommandé (Progressif)

**Objectif : Déployer en 5 semaines, en ordre de valeur ajoutée**

#### Semaine 1 : Commandes WhatsApp (Gratuit)

- [ ] 💜 Déployer template **#5096** (WhatsApp + Gemini)
- [ ] 💜 Créer Google Sheet avec menu (plats, prix, descriptions)
- [ ] 💜 Configurer WhatsApp Business API (gratuit)
- [ ] 💜 Tester avec numéro personnel d'abord

#### Semaine 2 : Notifications Client (15€/mois Twilio)

- [ ] 💜 Déployer template **#7518** (Email commandes)
- [ ] 💜 Déployer template **#401** (SMS Twilio basique)
- [ ] 💜 Configurer webhooks `/api/n8n/commande-status`
- [ ] 💜 Tester flux complet : Commande → Email → SMS "Prête"

#### Semaine 3 : Réseaux Sociaux (Gratuit)

- [ ] 💜 Déployer template **#3478** (Instagram + Drive + AI)
- [ ] 💜 Créer dossier Google Drive "Photos Plats"
- [ ] 💜 Configurer tokens Meta Graph API
- [ ] 💜 Planifier posts automatiques 18h (heure dîner)

#### Semaine 4 : Reporting & Prédiction (Gratuit)

- [ ] 💜 Déployer template **#5982** (Prédiction gaspillage)
- [ ] 💜 Créer Sheet "Ventes Quotidiennes"
- [ ] 💜 Configurer email rapport hebdomadaire
- [ ] 💜 Tester recommandations stock

#### Semaine 5 : Avis & Réputation (Gratuit)

- [ ] 💜 Déployer template **#6590** (Google Reviews)
- [ ] 💜 Configurer alerte Telegram avis négatifs
- [ ] 💜 Paramétrer réponses IA personnalisées
- [ ] 💜 Créer dashboard avis Google Sheets

---

### 💰 H. Estimation Coûts (Tier Gratuit vs Payant)

| Service                   | Tier Gratuit                             | Payant (si dépassement)           |
| ------------------------- | ---------------------------------------- | --------------------------------- |
| **n8n**                   | Self-hosted OU Cloud free (5 workflows)  | 20€/mois (illimité)               |
| **WhatsApp Business API** | ✅ Gratuit (messages initiés par client) | 0.05€/message initié par business |
| **Google Gemini AI**      | ✅ 15 req/min gratuit                    | 0.001€/1K tokens                  |
| **Google Sheets**         | ✅ 15GB gratuit                          | -                                 |
| **Twilio SMS**            | 15€ crédits offerts (~40 SMS FR)         | 0.08€/SMS FR                      |
| **Meta Graph API**        | ✅ Gratuit (compte Business)             | -                                 |
| **Gmail/SMTP**            | ✅ 500 emails/jour                       | Brevo 20€/mois (10K emails)       |

**Budget minimum : 0€/mois** (tout en tier gratuit, SMS limités)
**Budget confortable : 35€/mois** (n8n cloud + Twilio recharge)

---

## 📧 Phase 5 : React Email - Templates Détaillés (🔥 BASSE)

**Note : Section À COMPLÉTER AVEC GEMINI après workflows n8n fonctionnels**

**Dépend de : n8n workflows ⏳**

### Templates Commande (8 templates)

- [ ] **CommandeConfirmationEmail.tsx** : Récapitulatif complet, heure retrait, QR code
- [ ] **CommandePreteEmail.tsx** : Notification simple et directe
- [ ] **CommandeMiseAJourEmail.tsx** : Détail modifications (articles, prix, heure)
- [ ] **CommandeAnnulationEmail.tsx** : Confirmation annulation
- [ ] **CommandeRetardEmail.tsx** : Notification retard avec nouvelle heure estimée
- [ ] **CommandeAvisEmail.tsx** : Demande avis post-commande (lien formulaire)
- [ ] **CommandeFactureEmail.tsx** : Email accompagnement facture PDF
- [ ] **CommandeRappelRetraitEmail.tsx** : Rappel si commande non récupérée après 1h

### Templates Événement (6 templates)

- [ ] **EvenementDemandeEmail.tsx** : Accusé réception demande devis
- [ ] **EvenementDevisEmail.tsx** : Lien PDF devis + instructions validation
- [ ] **EvenementConfirmationEmail.tsx** : Récapitulatif final après acceptation
- [ ] **EvenementRappel48hEmail.tsx** : Rappel 48h avant + détails pratiques
- [ ] **EvenementRappel24hEmail.tsx** : Rappel 24h avant + checklist
- [ ] **EvenementRemerciementEmail.tsx** : Remerciement + demande avis

### Templates Compte Client (4 templates)

- [x] **ChanthanaWelcomeEmail.tsx** ✅ (déjà créé)
- [ ] **ChanthanaPasswordResetEmail.tsx** : Lien reset sécurisé, expiration 1h
- [ ] **ChanthanaEmailVerificationEmail.tsx** : Lien vérification email
- [ ] **ChanthanaEmailChangeEmail.tsx** : Confirmation changement email
- [ ] **ChanthanaAccountDeletedEmail.tsx** : Confirmation suppression compte
- [ ] **ChanthanaNewsletterEmail.tsx** : Template actualités/offres spéciales
- [ ] **ChanthanaBirthdayEmail.tsx** : Message anniversaire + offre optionnelle

### Templates Admin (3 templates)

- [ ] **AdminNewCommandeEmail.tsx** : Notification nouvelle commande (Telegram)
- [ ] **AdminDailySummaryEmail.tsx** : Résumé quotidien stats
- [ ] **AdminAnomalyAlertEmail.tsx** : Alerte anomalies détectées

### Tests Templates

- [ ] Tests visuels clients email (Gmail, Outlook, Apple Mail, Thunderbird)
- [ ] Tests responsive (mobile 320px → desktop 1920px)
- [ ] Tests dark mode (Apple Mail, Gmail)
- [ ] Tests accessibilité (screen readers, contraste couleurs)

#### 💜 Suggestions Pratiques React Email

- [ ] 💜 **Preview live emails** : Page admin `/admin/emails/preview` pour voir rendu temps réel
- [ ] 💜 **Chanthana header** : Bannière Chanthana réutilisable dans tous les emails (composant partagé)
- [ ] 💜 **Footer personnalisé** : Signature "La famille Chanthana" avec mini-avatar animé GIF

---

## 🌍 Phase 6 : Internationalization (🔥 BASSE)

**Dépend de : Pages finalisées ⏳**

### Configuration next-intl

- [ ] Configuration routing multilingue (fr/th/en)
- [ ] Structure répertoires : `locales/{fr|th|en}/*.json`
- [ ] Middleware i18n : Détection langue navigateur + cookie préférence
- [ ] Composant `LocaleSwitcher` : Sélecteur langue dans header

### Traductions Contenu

- [ ] **Traductions UI** : Tous labels, boutons, messages (3 langues)
- [ ] **Traductions Statiques** : Pages marketing (accueil, à propos, contact)
- [ ] **Traductions Menu** : Noms plats, descriptions (français + thaï authentique)
- [ ] **Traductions Emails** : Templates React Email multilingues
- [ ] **Traductions Erreurs** : Messages validation, erreurs serveur

### Tests i18n

- [ ] Tests changement langue (persistence cookie)
- [ ] Tests SSR (génération pages statiques par langue)
- [ ] Tests SEO (hreflang tags, URLs multilingues)
- [ ] Validation traductions thaï (review native speaker)

#### 💜 Suggestions Pratiques i18n

- [ ] 💜 **Drapeau animé** : Animation drapeau au clic sur LocaleSwitcher (CSS keyframes)
- [ ] 💜 **Chanthana polyglotte** : Avatar Chanthana qui change de tenue selon la langue (wai thaï, béret français, etc.)
- [ ] 💜 **Détection automatique** : Proposer automatiquement le thaï aux visiteurs avec navigateur en thaï

---

## 🚀 Phase 7 : Optimisations & Production (🔥 BASSE - CONTINU)

### Performance

- [ ] Analyse Lighthouse : Scores 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] Optimisation images : Conversion WebP automatique, lazy loading, responsive
- [ ] Optimisation fonts : Preload fonts critiques, font-display: swap
- [ ] Code splitting : Dynamic imports composants lourds
- [ ] Bundle analyzer : Réduction taille bundles JavaScript

### Sécurité Production

- [ ] **⚠️ CRITIQUE** : Réactiver RLS Policies Supabase (désactivées temporairement)
- [ ] Audit dépendances : `npm audit` résolution vulnérabilités
- [ ] Rate limiting : Protection API routes (10 req/min par IP)
- [ ] CSRF protection : Tokens validation formulaires critiques
- [ ] Content Security Policy : Headers sécurité Next.js
- [ ] Environment variables : Rotation secrets régulière

### Monitoring & Observability

- [ ] Stack PLG (Prometheus + Loki + Grafana) : Métriques serveur + logs app
- [ ] GlitchTip : Capture erreurs frontend + backend
- [ ] UptimeRobot : Monitoring disponibilité externe (5 min checks)
- [ ] Dashboards Grafana : Visualisation métriques clés
- [ ] Alertes automatiques : CPU/RAM/Disk dépassements seuils

### Documentation

- [ ] Mise à jour `CLAUDE.md` : Refléter architecture finale
- [ ] Mise à jour `documentation/` : Architecture, workflows, deployment
- [ ] Guide déploiement : Steps production Hetzner
- [ ] Guide contribution : Pour futurs développeurs
- [ ] Changelog : Documenter toutes versions majeures

#### 💜 Suggestions Pratiques Production

- [ ] 💜 **View Transitions API** : Transitions fluides entre pages (natif Chrome/Edge, gratuit)
- [ ] 💜 **Scroll-driven animations** : Animations au scroll avec CSS natif `animation-timeline` (gratuit)
- [ ] 💜 **Prefers-reduced-motion** : Respecter les préférences utilisateur pour animations (accessibilité)
- [ ] 💜 **Image placeholders LQIP** : Blur-up images avec plaiceholder (gratuit, Next.js natif)
- [ ] 💜 **Service Worker amélioré** : Background Sync pour commandes hors-ligne (retry auto quand connexion revient)
- [ ] 💜 **Page 404 Chanthana** : Page d'erreur avec Chanthana perdue qui cherche avec une loupe (animation Lottie)
- [ ] 💜 **Loading skeleton Chanthana** : Remplacer spinners par skeleton avec silhouette Chanthana

---

## 📚 Annexes

### Architecture Emails & Notifications (Clarification)

#### Better Auth → Resend (Emails Authentification)

```
Better Auth workflows
├── Bienvenue (ChanthanaWelcomeEmail.tsx)
├── Reset Password (ChanthanaPasswordResetEmail.tsx)
├── Email Verification (ChanthanaEmailVerificationEmail.tsx)
└── Email Change (ChanthanaEmailChangeEmail.tsx)

Service: Resend (100 emails/jour gratuit)
Use case: Emails critiques sécurité uniquement
```

#### n8n → Brevo/SendGrid (Emails Transactionnels + Multicanal)

```
n8n Workflows (Business Logic)
├── Commandes (confirmation, statut, facture, avis)
├── Événements (devis, rappels, remerciements)
├── Marketing (newsletter, anniversaires, offres)
└── Admin (résumés, alertes, anomalies)

Services:
├── Email: Brevo (300 emails/jour gratuit) ou SendGrid (100/jour)
├── SMS/WhatsApp: Twilio/Vonage (payant, backup)
├── Telegram: Bot gratuit (notifications admin)
└── Push PWA: Firebase FCM (gratuit, prioritaire)

Fallback logic: Push PWA → Email → SMS/WhatsApp
```

### Capacité Génération Assets Chanthana (Mascotte)

**Le propriétaire peut générer des visuels personnalisés de Chanthana (mascotte du restaurant) à la demande via IA générative.**

#### Workflow Génération :

1. Claude décrit scène souhaitée (ex: "Chanthana tenant carnet + stylo")
2. Propriétaire génère image/vidéo avec IA (Veo 3.1 Fast, Imagen)
3. Propriétaire fournit fichier (PNG, WebP, MP4, GIF)
4. Claude intègre le fichier dans le code

#### Style Référence Chanthana :

- Animation manga chibi moderne, énergique
- Femme thaïlandaise, cheveux noirs en chignon serré, front dégagé
- Eye-liner "cat eye" (virgule) noir distinctif
- Tablier noir avec texte "chanthana thai cook"
- Expressions chaleureuses et souriantes

#### Assets Existants :

- `/chanthana.svg` (891KB) - Avatar principal utilisé page À Propos
- `/videogif/Sawadee.gif` (257KB) - Geste wai animé (emails)
- `/videohero/Sawadeechanthana.mp4` (5.9MB)
- `/videohero/telephone.mp4` (9.6MB)

#### Utilisation Transversale :

- **Page Commander** : Avatar prend commande (sidebar/header)
- **Modal Confirmation** : Polaroid sawadee remerciement
- **Animation Panier** : Clin d'œil + thumbs up feedback
- **Page À Propos** : Présentation chef (déjà implémenté)
- **Page Événements** : Chanthana présente buffet/traiteur
- **Emails** : Sawadee.gif dans templates (déjà utilisé)

#### Avantages :

- Personnalisation illimitée pour chaque contexte UX
- Cohérence visuelle avec mascotte unique du restaurant
- Humanisation et authenticité de l'expérience client
- Identité de marque forte et mémorable

#### 🎭 Stratégie d'Intégration Personnage (Tendances UX )

**Techniques Clés** :

1.  **State Awareness** : Personnage réactif (Chanthana triste si panier vide, fête si succès).
2.  **Mascot FAB** : Bouton flottant "Compagnon de Poche" (Chanthana).
3.  **Micro-Animations** : Mouvements subtils (clignement yeux, "Pull-to-Refresh" personnalisé).

#### 💜 Visuels Chanthana à Générer (IA Générative)

- [ ] 💜 **Chanthana wai accueil** : Animation 3s de Chanthana faisant le salut thaï traditionnel (format Lottie ou GIF)
- [ ] 💜 **Chanthana cuisine** : Animation de Chanthana qui remue un wok (pour loading states)
- [ ] 💜 **Chanthana pouce levé** : Animation rapide (1s) pour confirmations et succès
- [ ] 💜 **Chanthana triste** : Animation légère pour erreurs ou suppressions (empathique, pas dramatique)
- [ ] 💜 **Chanthana fête** : Animation avec confettis pour célébrations (commande prête, anniversaire)
- [ ] 💜 **Chanthana traiteur** : Version Chanthana avec plateau/buffet pour page événements
- [ ] 💜 **Chanthana épices** : Animation avec différents niveaux de piment (0-3 flammes)
- [ ] 💜 **Chanthana cherche** : Chanthana avec loupe pour page 404 ou recherche vide
- [ ] 💜 **Chanthana timer** : Animation chrono/sablier pour états d'attente
- [ ] 💜 **Chanthana nuit** : Version avec toque de nuit pour mode sombre (futur)

#### 💜 Composants 21st.dev à Intégrer (Gratuits, shadcn-compatible)

- [ ] 💜 **Tilt Card 3D** : `npx shadcn@latest add "https://21st.dev/r/llaxmi/tilt-card"` - Effet 3D sur les cards plats au hover
- [ ] 💜 **Glassmorphism Card** : Effet verre dépoli moderne pour le Hero overlay
- [ ] 💜 **Glow Effect Card** : Effet lueur au hover pour les plats vedettes
- [ ] 💜 **Magic Card** : Effet reflet arc-en-ciel au mouvement de souris
- [ ] 💜 **Animated Cards** : Collection de cards avec animations modernes pour NavigationCards
- [ ] 💜 **3D Interactive Element** : Potentiel pour animation Chanthana 3D interactive

**Installation** : `npx shadcn@latest add "https://21st.dev/r/[author]/[component]"`

### Dépendances entre Phases

```
Phase 0 (Infrastructure) → BLOQUANT pour tout le reste
  ├── Schemas Zod → Requis par: Toutes Server Actions, Upload, Tests
  ├── Better Auth workflows → Requis par: React Email templates auth
  ├── Upload Local → Requis par: Migration Supabase Storage
  └── Vitest → Requis par: CI/CD, stabilité

Phase 1 (PWA + Notifs) → En cours (Better Auth ✅, PWA ✅)
  ├── PWA → ✅ Fondations complétées (Next.js 16 native)
  └── Push Notifs → Dépend de: FCM setup

Phase 2 (UX Pages) → Dépend de: Schemas Zod, nuqs installation
  ├── nuqs filtres/pagination → Dépend de: Server Actions stables
  ├── PDF factures/devis → Dépend de: react-pdf + design Thai
  └── Commander à nouveau → Dépend de: Schemas Zod validation

Phase 3 (Admin + Workflows) → Dépend de: n8n setup, React Email templates
  ├── n8n webhooks → Dépend de: Server Actions finalisés
  ├── Workflows détaillés → Dépend de: React Email templates
  └── Admin création manuelle → Dépend de: Schemas Zod

Phase 4-7 (Optimisations) → Continu, non bloquant
```

---

## 🧹 Phase 8 : Dette Technique & Qualité Code (🔥🔥🔥 HAUTE)

**Objectif : Nettoyer le code pour maintenir la qualité et faciliter les futures évolutions**

### A. Nettoyage Console.log (20+ instances à supprimer)

| Fichier                             | Lignes                                                                              | Action                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| `hooks/useSupabaseData.ts`          | 204, 217, 229, 233, 247, 259, 263, 268, 286, 294, 298, 312, 320, 324, 341, 350, 354 | ❌ Supprimer logs debug                            |
| `app/admin/commandes/page.tsx`      | 2938                                                                                | ❌ Supprimer `console.log("🔍 DEBUG - Extras...")` |
| `hooks/usePWAInstalled.ts`          | 57, 68, 72                                                                          | ❌ Remplacer par logger conditionnel               |
| `hooks/useRealtimeNotifications.ts` | 25, 51, 84                                                                          | ❌ Supprimer logs payload                          |

#### 💜 Suggestion : Logger Centralisé

- [ ] 💜 **Créer `lib/logger.ts`** : Logger avec niveaux (debug/info/warn/error) et désactivation automatique en production
  ```typescript
  const logger = {
    debug: (...args) => process.env.NODE_ENV === "development" && console.log(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
  }
  ```

### B. TODO/FIXME à Compléter (11 items)

| Fichier                                  | Ligne         | TODO                                                              | Priorité |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------- | -------- |
| `app/page.tsx`                           | 82            | `photoUploadedRecently = false // TODO: Implémenter logique date` | 🔥       |
| `app/auth/verify-email/[token]/page.tsx` | 63            | `// TODO: Get user email from session`                            | 🔥🔥     |
| `app/admin/testvisuel/modal/page.tsx`    | 376           | `// TODO: Add toast notification "✅ Code copié !"`               | 🔥       |
| `app/profil/actions.ts`                  | 216, 300      | `// TODO: Send confirmation emails` (2x)                          | 🔥🔥🔥   |
| `app/modifier-commande/[id]/page.tsx`    | 1177          | `// TODO: Ajouter support épices dans PlatPanier`                 | 🔥       |
| `components/shared/ErrorBoundary.tsx`    | 30            | `// TODO: Intégrer Sentry/LogRocket`                              | 🔥🔥     |
| `components/pwa/OfflineIndicator.tsx`    | 187, 190      | `// TODO: Intégrer système toast` (2x)                            | 🔥       |
| `proxy.ts`                               | 43            | `// TODO: Vérifier rôle admin côté Server Component`              | 🔥🔥🔥   |
| `tests/offline.spec.ts`                  | 114, 141, 192 | `// TODO: Ajouter auth Playwright` (3x)                           | 🔥       |

### C. TypeScript `any` à Typer

| Fichier                             | Variable                  | Type suggéré                                       |
| ----------------------------------- | ------------------------- | -------------------------------------------------- |
| `app/actions/commandes.ts`          | `updateData: any`         | `Partial<CommandeUpdateInput>`                     |
| `app/actions/evenements.ts`         | `updateData: any`         | `Partial<EvenementUpdateInput>`                    |
| `app/actions/notifications.ts`      | `quietHoursData: any`     | `QuietHoursConfig`                                 |
| `app/admin/commandes/page.tsx:2911` | `router: any, toast: any` | `AppRouterInstance`, `ReturnType<typeof useToast>` |

### D. Composants Trop Volumineux (À Découper)

| Fichier                                  | Lignes   | Sous-composants suggérés                                              |
| ---------------------------------------- | -------- | --------------------------------------------------------------------- |
| `app/admin/commandes/page.tsx`           | **3900** | `CommandeCard`, `CommandeFilters`, `CommandeActions`, `CommandeStats` |
| `app/admin/clients/[id]/orders/page.tsx` | **3267** | `OrderList`, `OrderDetails`, `OrderModals`                            |
| `app/modifier-commande/[id]/page.tsx`    | **1345** | `ModifyCartSection`, `ModifyPaymentSection`                           |
| `app/commander/page.tsx`                 | **1264** | `MenuSection`, `CartSidebar`, `CheckoutFlow`                          |
| `components/ui/ModalVideo.tsx`           | **922**  | `ModalWrapper`, `MediaContent`, `ModalControls`                       |

---

## 🎯 Phase 9 : UX/UI Améliorations Découvertes (🔥🔥 MOYENNE)

**Objectif : Améliorer la cohérence et l'expérience utilisateur**

### A. Remplacer `window.confirm()` par AlertDialog (8 instances)

| Fichier                                  | Instances | Action                      |
| ---------------------------------------- | --------- | --------------------------- |
| `app/admin/clients/[id]/orders/page.tsx` | 3         | ⚠️ Utiliser `<AlertDialog>` |
| `app/admin/commandes/page.tsx`           | 3         | ⚠️ Utiliser `<AlertDialog>` |
| `app/admin/hero-media/page.tsx`          | 2         | ⚠️ Utiliser `<AlertDialog>` |

**Composant existant** : `components/ui/alert-dialog.tsx` (déjà utilisé dans HeroCarousel)

### B. Ajouter Breadcrumbs aux Routes Imbriquées

| Route                         | Breadcrumb suggéré                          |
| ----------------------------- | ------------------------------------------- |
| `/admin/clients/[id]/orders`  | Admin > Clients > [Nom Client] > Commandes  |
| `/modifier-commande/[id]`     | Accueil > Mes Commandes > Modifier #123     |
| `/admin/clients/[id]/contact` | Admin > Clients > [Nom Client] > Contact    |
| `/admin/clients/[id]/events`  | Admin > Clients > [Nom Client] > Événements |

**Composant existant** : `components/ui/breadcrumb.tsx` (non utilisé en production, à intégrer)

### C. Ajouter Empty States aux Pages Admin

| Page                | Empty State manquant | Message suggéré                                                      |
| ------------------- | -------------------- | -------------------------------------------------------------------- |
| `/admin/clients`    | ❌ Aucun             | "Aucun client pour le moment. Les clients s'inscriront via le site." |
| `/admin/commandes`  | ❌ Aucun             | "Aucune commande aujourd'hui. Profitez-en pour préparer !"           |
| `/admin/plats`      | ❌ Aucun             | "Aucun plat dans le menu. Ajoutez votre premier plat !"              |
| `/admin/evenements` | ❌ Aucun             | "Aucun événement programmé."                                         |

**Composant existant** : `components/historique/EmptyState.tsx` (à réutiliser/adapter)

### D. Ajouter error.tsx aux Routes Principales

- [ ] `app/admin/error.tsx` - Erreur admin générique avec bouton retry
- [ ] `app/commander/error.tsx` - Erreur menu/commande avec suggestion de rafraîchir
- [ ] `app/profil/error.tsx` - Erreur profil utilisateur
- [ ] `app/evenements/error.tsx` - Erreur événements

---

## 🌐 Phase 10 : APIs Navigateur Modernes (🔥 BASSE)

**Objectif : Exploiter les capacités modernes des navigateurs pour une meilleure UX**

### A. Web Share API

| Page          | Utilisation                    | Bouton                 |
| ------------- | ------------------------------ | ---------------------- |
| `/commander`  | Partager un plat vedette       | "Partager ce plat"     |
| `/historique` | Partager confirmation commande | "Partager ma commande" |
| `/panier`     | Partager panier avec amis      | "Envoyer mon panier"   |
| `/a-propos`   | Partager infos restaurant      | "Recommander"          |

- [ ] 💜 **Créer `hooks/useWebShare.ts`** : Hook wrapper autour de `navigator.share()` avec fallback

### B. Clipboard API

| Page                   | Utilisation                   | Bouton            |
| ---------------------- | ----------------------------- | ----------------- |
| `/panier`              | Copier récapitulatif commande | "Copier le récap" |
| `/historique`          | Copier numéro facture         | Icône copie       |
| `/admin/commandes`     | Copier détails commande       | Icône copie       |
| `/suivi-commande/[id]` | Copier numéro commande        | "Copier #CMD-XXX" |

- [ ] 💜 **Créer `hooks/useClipboard.ts`** : Hook avec toast de confirmation "Copié !"

### C. Geolocation API (Page Nous Trouver)

**Fichier** : `app/nous-trouver/page.tsx`

- [ ] 💜 **Détecter position utilisateur** : Bouton "Utiliser ma position"
- [ ] 💜 **Afficher distance** : "Vous êtes à X km du restaurant"
- [ ] 💜 **Navigation intelligente** : Proposer Google Maps / Waze / Apple Maps selon device

### D. Payment Request API (Panier) - Futur

**Fichier** : `app/panier/page.tsx`

- [ ] 💜 **Apple Pay / Google Pay** : Intégration native via Payment Request API
- [ ] 💜 **Express checkout** : Infos pré-remplies depuis portefeuille digital
- [ ] 💜 **Fallback** : Paiement classique si API non supportée

---

## 📈 Phase 11 : SEO & Méta Avancé (🔥🔥 MOYENNE)

**Objectif : Améliorer le référencement et le partage social**

### A. Fichiers SEO Manquants à Créer

| Fichier                   | Contenu                                                   | Priorité |
| ------------------------- | --------------------------------------------------------- | -------- |
| `app/sitemap.ts`          | Sitemap dynamique (pages statiques + plats + événements)  | 🔥🔥🔥   |
| `app/robots.ts`           | Configuration robots.txt (autoriser crawl, exclure admin) | 🔥🔥     |
| `app/opengraph-image.tsx` | Image OG dynamique pour accueil (1200x630)                | 🔥       |

### B. Twitter Cards (Manquantes)

**Fichier** : `app/layout.tsx`

- [ ] Ajouter métadonnées Twitter :

```typescript
twitter: {
  card: "summary_large_image",
  title: "ChanthanaThaiCook - Cuisine Thaï Authentique",
  description: "Cuisine thaïlandaise authentique à Marigny-Marmande (37)",
  creator: "@chanthanacook",
  images: ["/og-image.jpg"],
}
```

### C. Structured Data JSON-LD

| Type Schema         | Page            | Contenu                                    |
| ------------------- | --------------- | ------------------------------------------ |
| `Restaurant`        | `/` (accueil)   | Nom, adresse, horaires, téléphone, cuisine |
| `Menu` + `MenuItem` | `/commander`    | Liste des plats avec prix                  |
| `Organization`      | Footer global   | Logo, réseaux sociaux, contact             |
| `Event`             | `/evenements`   | Événements traiteur                        |
| `LocalBusiness`     | `/nous-trouver` | Coordonnées GPS, horaires                  |

- [ ] 💜 **Créer `components/seo/StructuredData.tsx`** : Composant réutilisable pour JSON-LD

---

## 🚀 Phase 12 : Performance Avancée (🔥🔥 MOYENNE)

**Objectif : Optimiser les performances pour une meilleure expérience**

### A. Convertir `<img>` vers `next/image`

| Fichier                                  | Images à convertir          |
| ---------------------------------------- | --------------------------- |
| `app/a-propos/page.tsx`                  | Images équipe/restaurant    |
| `app/admin/clients/[id]/orders/page.tsx` | Images plats dans commandes |
| `app/admin/commandes/page.tsx`           | Images produits             |
| `components/ui/ModalVideo.tsx`           | Media dans modal            |

### B. Ajouter Suspense Boundaries

| Page               | Section à wrapper   | Fallback suggéré     |
| ------------------ | ------------------- | -------------------- |
| `/commander`       | Liste des plats     | Skeleton cards plats |
| `/historique`      | Liste commandes     | Skeleton liste       |
| `/admin/commandes` | Table commandes     | Skeleton table       |
| `/profil`          | Données utilisateur | Skeleton form        |

### C. App Shortcuts PWA (manifest.ts)

- [ ] Ajouter raccourcis dans `app/manifest.ts` :

```typescript
shortcuts: [
  { name: "Commander", short_name: "Menu", url: "/commander", icons: [...] },
  { name: "Mes Commandes", short_name: "Historique", url: "/historique", icons: [...] },
  { name: "Nous Trouver", short_name: "Adresse", url: "/nous-trouver", icons: [...] },
  { name: "Mon Profil", short_name: "Profil", url: "/profil", icons: [...] },
]
```

---

## ♿ Phase 13 : Accessibilité (a11y) (🔥🔥 MOYENNE)

**Objectif : Rendre l'application accessible à tous les utilisateurs**

### A. Ajouter aria-label aux Boutons Icônes

| Composant              | Boutons concernés | aria-label suggéré |
| ---------------------- | ----------------- | ------------------ |
| `ModalVideo.tsx`       | Bouton fermer (X) | "Fermer la vidéo"  |
| `FloatingUserIcon.tsx` | Menu utilisateur  | "Menu utilisateur" |
| `CartSidebar`          | Bouton panier     | "Voir mon panier"  |
| Toutes les modales     | Boutons close     | "Fermer"           |

### B. Améliorer Navigation Clavier

- [ ] 💜 **Focus trap dans modales** : Empêcher le focus de sortir des modales ouvertes
- [ ] 💜 **Skip links** : Lien "Aller au contenu principal" en haut de page
- [ ] 💜 **Tab order logique** : Vérifier l'ordre de tabulation dans les formulaires
- [ ] 💜 **Focus visible** : Indicateur de focus clair sur tous éléments interactifs

### C. Support Screen Reader

- [ ] 💜 **aria-live** : Pour notifications toast et changements dynamiques
- [ ] 💜 **aria-describedby** : Pour formulaires complexes avec instructions
- [ ] 💜 **Rôles ARIA** : Pour composants custom (tabs, modals, menus)

---

## 🧪 Phase 14 : Tests Manquants (🔥🔥🔥 HAUTE)

**Objectif : Assurer la stabilité et prévenir les régressions**

### A. Tests Composants (Priorité Haute)

| Composant                | Lignes | Tests suggérés                                |
| ------------------------ | ------ | --------------------------------------------- |
| `CartItemCard.tsx`       | 386    | Ajout/suppression, calcul prix, options       |
| `CommandePlatModal.tsx`  | 339    | Sélection options, validation, soumission     |
| `CreateClientModal.tsx`  | 338    | Validation formulaire, création, erreurs      |
| `DateRuptureManager.tsx` | 369    | Gestion dates, validation plages, suppression |

### B. Tests E2E Manquants

| Flow               | Fichier test                        | Scénarios                               |
| ------------------ | ----------------------------------- | --------------------------------------- |
| Checkout complet   | `tests/checkout.e2e.spec.ts`        | Panier → Paiement → Confirmation        |
| Profil utilisateur | `tests/profile.e2e.spec.ts`         | Modification infos, changement password |
| Dashboard admin    | `tests/admin-dashboard.e2e.spec.ts` | Navigation, actions rapides             |
| Real-time updates  | `tests/realtime.e2e.spec.ts`        | Notifications, mise à jour statuts      |

### C. Compléter Tests Offline

**Fichier** : `tests/offline.spec.ts`

- [ ] Compléter 3 TODOs pour setup auth Playwright (lignes 114, 141, 192)
- [ ] Tester mode hors-ligne avec utilisateur connecté
- [ ] Tester sync au retour de connexion

---

## 🔄 Phase 15 : Refactoring Code Dupliqué (🔥 BASSE)

**Objectif : Réduire la duplication et améliorer la maintenabilité**

### A. Fusionner Modales Historique (3 → 1)

| Fichier actuel                    | Action               |
| --------------------------------- | -------------------- |
| `DishDetailsModal.tsx`            | ✅ Garder comme base |
| `DishDetailsModalComplex.tsx`     | ❌ Fusionner         |
| `DishDetailsModalInteractive.tsx` | ❌ Fusionner         |

**Résultat** : 1 composant `DishDetailsModal` avec prop `variant: 'simple' | 'complex' | 'interactive'`

### B. Unifier Sélecteurs Date (3 → 1)

| Fichier actuel               | Utilisation                   |
| ---------------------------- | ----------------------------- |
| `DateSelector.tsx`           | Sélection date générique      |
| `DateBirthSelector.tsx`      | Date de naissance (3 selects) |
| `ResponsiveDateSelector.tsx` | Version mobile-first          |

**Résultat** : 1 composant `DatePicker` avec props :

```typescript
type DatePickerProps = {
  type: "default" | "birth" | "responsive"
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}
```

---

## 📊 Résumé des Nouvelles Phases

| Phase                          | Priorité     | Items principaux                                      |
| ------------------------------ | ------------ | ----------------------------------------------------- |
| **Phase 8** : Dette Technique  | 🔥🔥🔥 HAUTE | 20+ console.log, 11 TODOs, 4 `any`, 5 gros composants |
| **Phase 9** : UX/UI            | 🔥🔥 MOYENNE | 8 confirm(), breadcrumbs, empty states, error.tsx     |
| **Phase 10** : APIs Modernes   | 🔥 BASSE     | Web Share, Clipboard, Geolocation, Payment            |
| **Phase 11** : SEO             | 🔥🔥 MOYENNE | sitemap, robots, Twitter Cards, JSON-LD               |
| **Phase 12** : Performance     | 🔥🔥 MOYENNE | next/image, Suspense, PWA shortcuts                   |
| **Phase 13** : Accessibilité   | 🔥🔥 MOYENNE | aria-labels, keyboard nav, screen readers             |
| **Phase 14** : Tests           | 🔥🔥🔥 HAUTE | Tests composants, E2E, offline                        |
| **Phase 15** : Refactoring     | 🔥 BASSE     | Modales, DatePickers                                  |
| **Phase 16** : Migration Infra | 🔥🔥🔥 HAUTE | Hetzner, Coolify, MinIO, Docker                       |

---

## 🚀 Phase 16 : Migration & Optimisation Infrastructure (🔥🔥 CRITIQUE)

**Objectif : Indépendance infrastructure (Hetzner) et Performance (Supabase Quotas)**

### A. Optimisation Bandwidth (Supabase)

- [x] ✅ **Audit & Fix Images** : Remplacement des `<img>` par `next/image` dans `evenements`, `commander`, `suivi-commande`
- [x] ✅ **Refactoring Composants** : `ProductCard` et tooltips optimisés

### B. Migration Infrastructure (Hetzner + Coolify)

- [x] ✅ **Setup Serveur** : Installation Coolify sur Hetzner (VPS)
- [x] ✅ **Projet Coolify** : Création projet "Chanthana" et configuration
- [x] ✅ **Base de Données** : Provisionning PostgreSQL (Supabase image) + Configuration publique temporaire

### C. Migration Données

- [x] ✅ **Audit Connexions** : Récupération clés Supabase et Coolify
- [x] ✅ **Migration Schema + Data** : Transfert via Pipe Docker (`pg_dump | psql`)
- [x] ✅ **Vérification Intégrité** : Validation des données (6 clients vérifiés)
- [ ] 🔥 **Migration Stockage** : Setup MinIO (S3 compatible) et transfert des images (Prochaine étape)

### D. Finalisation

- [ ] 🔥 **Déploiement App** : Configurer Next.js sur Coolify (Env vars, Build)
- [ ] 🔥 **Switch DNS** : Pointer `cthaicook.com` vers nouvelle IP
- [ ] 🔥 **Arrêt Supabase** : Désactivation progressive des services cloud

---

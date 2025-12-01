### 🎯 Plan d'Amélioration Stratégique : ChanthanaThaiCook

Notre feuille de route pour faire évoluer l'expérience ChanthanaThaiCook. Ce document est notre espace de collaboration pour construire l'avenir de l'application.

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

**Statut : 100% ✅**

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
- [x] Nettoyage `hooks/useSupabaseData.ts` : **2904 → 361 lignes (-87%)**
  - Supprimé 36 hooks obsolètes (CRUD remplacés par Prisma)
  - Gardé 8 hooks légitimes (Realtime, Ruptures, Listes de courses)
- [x] Nettoyage `services/supabaseService.ts` : **408 → 12 lignes (-97%)**
  - Classe complète supprimée, simple export client Supabase
- [x] Suppression 3 fichiers obsolètes (useSupabase.ts, useSupabaseNotifications.ts, supabaseAdmin.ts)
- [x] **Total : -3200 lignes de code obsolète supprimées**
- [x] Tests CRUD validés : `tests/prisma-crud.test.ts` (mis à jour auth_user_id)
- [x] Correction TypeScript : **27 erreurs → 0 erreur** ✅

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

### ✅ 5️⃣ Upload Fichiers - Supabase Storage Fonctionnel [COMPLÉTÉ]

**Statut : 100% Opérationnel | Migration Hetzner optionnelle (Phase 4)**

**✅ Infrastructure actuelle Supabase Storage :**

- [x] **Validation MIME complète** : `lib/supabaseStorage.ts` (7583 lignes)
  - ✅ MIME types autorisés : `image/jpeg`, `image/png`, `image/webp`, `image/gif`
  - ✅ Validation taille max : 5MB par fichier
  - ✅ Fonction `validateImageFile()` avec gestion erreurs françaises
- [x] **Hook upload complet** : `hooks/useImageUpload.ts` fonctionnel
- [x] **Buckets configurés** : Photos plats, avatars, événements
- [x] **URLs publiques** : Accès direct via Supabase CDN

**🔥 Migration Hetzner Local (OPTIONNEL - Phase 4)**
**Objectif :** Économiser stockage Supabase (actuellement 1GB free tier)

- [ ] **Server Action Upload local**
  - `app/actions/upload.ts` : Server Action avec `zfd.formData({ image: zfd.file() })`
  - Validation MIME identique à Supabase Storage actuel
  - Utiliser `fs/promises.writeFile()` pour stockage dans `/public/uploads/`
  - Structure dossiers : `/public/uploads/{plats,extras,evenements,avatars}/`
  - Retourner URL publique : `/uploads/plats/image-123.webp`

- [ ] **Configuration dossier `/public/uploads`**
  - Créer structure : `mkdir -p public/uploads/{plats,extras,evenements,avatars}`
  - Ajouter `.gitkeep` dans chaque sous-dossier
  - Ajouter `public/uploads/*` dans `.gitignore` (ne pas versionner uploads)

- [ ] **Optimisation Images (optionnel, Phase 2)**
  - Compression automatique avec `sharp` (NPM)
  - Génération thumbnails pour performances
  - Conversion auto vers WebP

- [ ] **Tests Upload**
  - Test upload image valide
  - Test rejection fichier invalide (PDF, exe, etc.)
  - Test rejection fichier trop lourd (>5MB)
  - Test génération nom unique (collision handling)

💡 **Note :** Garder Supabase Storage en backup temporairement jusqu'à migration complète validée.

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

- [x] 🔥🔥🔥 **Carousel média administratif** : Images + vidéos courtes (5-8s) ✅
  - [x] Upload depuis interface admin (/admin/hero-media) ✅
  - [x] Support image (JPG, PNG, WebP) + vidéo (MP4, WebM)
  - [x] Drag & drop pour réorganiser l'ordre ✅
  - [x] Transition fade douce entre médias (Embla Carousel + Autoplay + Fade)
  - [x] Indicateurs navigation discrets (dots en bas centre)
  - [x] Responsive : Aspect ratio adaptatif mobile/desktop
  - [x] Hauteur carousel : 80vh min-h-[650px]
  - [x] 2 vidéos actives dans hero_media (Supabase)
  - [x] Autoplay 7s configurable + pause au hover
  - [x] Respect prefers-reduced-motion

- [x] 🔥🔥 **Card navigation en haut à gauche** : ✅
  - [x] Logo + ChanthanaThaiCook
  - [x] Bouton Commander (gradient orange)
  - [x] Bouton Nous Trouver (outline blanc)
  - [x] Design glassmorphism (backdrop-blur-xl)
  - [x] Animations hover (scale, shadow, shine sweep)
  - [x] Animations scroll Framer Motion :
    - Rotation 3D (20° → 0°)
    - Scale responsive (mobile: 0.7→0.9, desktop: 1.05→1)
    - Translation parallax (0 → -100px)
    - Perspective 1000px pour effet 3D
  - [x] Slide-in animation au chargement
  - [x] Position : top-20 left-12

#### 🧭 Navigation Contextuelle

- [x] 🔥🔥🔥 **Cartes navigation adaptatives selon auth** : ✅
  - [x] **Visiteur non connecté** : 6 cartes (4 actives + 2 désactivées)
    - Pour Commander ✓
    - Nous Trouver ✓
    - Pour vos Événements ✓
    - À propos de nous ✓
    - Découvertes (Actualités) ✓
    - Installer l'Application ✓
  - [x] **Utilisateur connecté** : 8 cartes actives
    - Les 6 ci-dessus + Mon Profil + Suivi & Historique
  - [x] Grid responsive : lg:grid-cols-4 (4 colonnes desktop)
  - [x] Full-width layout avec px-8
  - [x] Image PWA card : /installapp.svg

#### 💡 Section "Pourquoi Créer un Compte" (Non-connectés uniquement)

- [ ] 🔥🔥 **Bénéfices pratiques (pas marketing)** :
  - 📱 Suivi en temps réel : Notifications quand commande prête
  - 📋 Historique : Retrouver facilement plats préférés
  - 🎉 Gestion événements : Suivre demandes devis et réservations
  - Design : Fond crème thaï, icônes minimalistes, ton informatif
  - Boutons : [Créer mon compte] [Se connecter]

#### 📱 Section PWA Intelligente

- [ ] 🔥🔥🔥 **Hook `usePWAInstalled`** : Détecter si app installée
  - Vérifier `display-mode: standalone`
  - Écouter `beforeinstallprompt` event
  - Stocker état dans localStorage

- [ ] 🔥🔥 **Affichage conditionnel** :
  - **Si non installée** : "Installez notre application"
    - Mockup téléphone avec screenshot app
    - Bénéfices : Commander + rapidement, Notifications, Hors ligne
    - Bouton : [Installer l'application →]
  - **Si installée** : "Application installée ✅"
    - Message : "Accédez rapidement à votre espace"
    - Bouton : [Ouvrir l'application →] (deep link)

#### 🚫 Suppressions

- [ ] 🔥 **Supprimer page `/suivi`** : Redondante avec `/historique`
  - Fichier : `app/suivi/page.tsx` (suppression)
  - Redirection 308 Permanent : `/suivi` → `/historique`
- [ ] 🔥 **Renommer card navigation** : "Suivi & Historique" → "Suivi"
  - Description : "Suivez vos commandes et consultez l'historique" (conservée)
  - Icon : History (conservée)
- [ ] 🔥 **Supprimer section témoignages** : Pas adapté restaurant familial
- [ ] 🔥 **Supprimer promotions/offres/fidélité** : Pas la politique maison

#### 🔧 Spécifications Techniques Détaillées

**Hero Carousel :**

- [ ] **Bibliothèque** : Embla Carousel (shadcn/ui intégré)
- [ ] **Auto-play** : Ajustable par admin (default 7s par média)
- [ ] **Pause au hover** : Activée automatiquement
- [ ] **Prefers-reduced-motion** : Auto-détecté (désactive auto-play si actif)
- [ ] **Contrôles navigation** : Dots discrets uniquement (pas de flèches)
- [ ] **Transitions** : Fade 800ms cubic-bezier(0.4, 0, 0.2, 1)

**Overlay Hero :**

- [ ] **Position** : Tiers inférieur (70% image visible, 30% overlay)
- [ ] **Fond** : Gradient `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`
- [ ] **Backdrop blur** : 8px sur zone texte uniquement
- [ ] **Boutons CTA** :
  - [Commander] : Solid bg-thai-orange
  - [Découvrir] : Outline blanc + smooth scroll vers section navigation

**Navigation Cards (6 cartes) :**

- [x] **Visiteur non connecté** : 6 cartes affichées ✅
  - Pour Commander (actif)
  - Nous Trouver (actif)
  - Pour vos Événements (actif)
  - À propos de nous (actif)
  - Découvertes (actif) ← NOUVELLE CARTE
  - Mon Profil (désactivé/grisé)
- [x] **Utilisateur connecté** : 6 cartes actives ✅
  - Ajouter : Mon Profil (actif) + Suivi (actif)
  - Badge "Nouveau !" sur Mon Profil si `photo_client` récente (<7 jours)
- [x] **Nouvelle carte "Découvertes"** : ✅
  - Route : `/actualites`
  - Icon : Sparkles ✨
  - Description : "Nouveautés, plats du moment et suivez nos coulisses sur les réseaux sociaux"
  - Image : Photo plat saisonnier ou collage Instagram
- [x] **Grid responsive** : ✅
  - Desktop (≥1024px) : 4 colonnes (lg:grid-cols-4)
  - Tablet (768-1023px) : 2 colonnes (md:grid-cols-2)
  - Mobile (<768px) : 1 colonne (grid)
- [x] **Animations** : Stagger 150ms top to bottom (framer-motion) ✅
- [x] **Rotation Polaroid** : Straight par défaut, tilt -2deg au hover ✅
- [x] **Photo profil par défaut** : `/image avatar/profildefaut.svg` ✅
- [x] **Card highlighting au clic** : Rotation + scale + élévation + glow 3s ✅
  - Glow pulsant : Dégradé orange thaï (#ff7b54) → vert thaï (#2d5016)
  - Scroll automatique smooth vers card ciblée (scrollIntoView)

**Médias Hero - Spécifications :**

- [ ] **Images** :
  - Format prioritaire : WebP 1920x1080
  - Fallback : JPEG
  - Ratio : 16:9 (standard)
  - Taille max : 10MB
- [ ] **Vidéos** :
  - Durée max : 10-15 secondes
  - Codecs : MP4 H.264 + WebM VP9 (compatibilité)
  - Audio : Muted forcé
  - Sous-titres : Non nécessaires
  - Taille max : 10MB

**Fallbacks & Error Handling :**

- [ ] **Cascade fallback médias** :
  1. Essayer vidéo
  2. Si erreur → Image associée
  3. Si pas d'image → `/hero-default.jpg`
  4. Pendant chargement → Blur-up placeholder (LQIP)
- [ ] **Aucun média actif** : Afficher image par défaut

**Bonus Implémentés :**

- [ ] **Badge "Nouveau !" card Mon Profil** : Si `photo_client` uploadée < 7 jours (logique calcul date à implémenter)
- [x] **Smooth scroll CTA "Découvrir"** : Scroll vers section navigation cards ✅
- [x] **Photo client dans card Mon Profil** : Depuis `client_db.photo_client` ✅

#### 🎨 Polish & Accessibilité

- [x] 🔥🔥 **Sélecteur de langue** : Permettre changement langue (fr/th/en) ✅
  - [x] DropdownMenu avec drapeaux waving WebP (fr.webp, th.webp, gb.webp, nl.webp)
  - [x] Position : bottom-4 left-4 (bas gauche)
  - [x] État local : useState selectedLang (fr/th/en/nl)
  - [x] Hover scale 110% + transition smooth
  - [ ] ⚠️ Intégration next-intl routing (Phase 6 - futur)
- [x] 🔥🔥 **Header navigation simplifié** : ✅
  - [x] Centré avec gap-8
  - [x] Liens : Événements, À Propos, Actualités
  - [x] Liens auth conditionnels : Mon Profil, Suivi (si isAuthenticated)
  - [x] Couleurs : text-white/90 hover:text-thai-orange
  - [x] Backdrop blur minimal : from-black/5 backdrop-blur-[2px]
  - [x] Smooth scroll vers sections navigation cards
- [x] 🔥🔥 **Bouton Installer l'App** : ✅
  - [x] Position : bottom-4 right-4 (bas droite)
  - [x] Design : bg-white/10 backdrop-blur-sm border-2 border-white
  - [x] Hook usePWAInstalled pour détecter installation
  - [x] Texte conditionnel : "Application Installée" vs "Installer l'App"
- [x] 🔥 **Footer enrichi** : ✅
  - [x] **10 icônes réseaux sociaux avec effet dock magnification** (macOS style)
    - Facebook, Instagram, WhatsApp, TikTok, YouTube, Google Maps, Email, Phone, Messenger, X
    - Framer Motion : useSpring physics (mass 0.1, stiffness 150, damping 12)
    - Magnification : 40px → 60px based on mouse distance (150px range)
    - GPU-accelerated transforms (will-change: width)
  - [x] **Email professionnel** : contact@cthaicook.com (ImprovMX gratuit)
  - [x] **Layout centré** : Navigation en haut + icônes dock en dessous (justify-center)
  - [x] **Suppression logo et texte "ChanthanaThaiCook"** du footer (20 lignes supprimées)
  - [x] Composant RestaurantFooter créé (components/Footer/)
  - [x] Horaires d'ouverture détaillés avec jour de fermeture
  - [x] Contact : téléphone, email, adresse avec liens directs
  - [x] Navigation complète (3 sections : Navigation, Légal, Support)
  - [x] Moyens de paiement affichés
  - [x] CTA sticky mobile (Appeler + Localiser)
  - [x] Design cohérent avec palette thaï (vert, orange)
  - [x] Intégré dans app/layout.tsx
  - ⚠️ **À personnaliser** : Téléphone, adresse, horaires réels, URLs réseaux sociaux (TikTok, YouTube, X en placeholder)
- [x] 🔥 **Animations entrance** : Hero fade-in, cards stagger animation ✅
  - [x] Card navigation : Framer Motion scroll animations + slide-in
  - [x] Navigation cards : Stagger 150ms (via animationDelay CSS)
- [x] 🔥🔥 **QuickNav - Navigation rapide entre Hero et Cards** : ✅
  - [x] Composant `QuickNav.tsx` créé (145 lignes)
  - [x] Position : sticky top-0 z-30 entre HeroCarousel et NavigationCards
  - [x] **Animation vague séquentielle automatique** :
    - Animation continue toutes les 800ms (chaque lien vert → orange → vert)
    - Pause automatique au survol de la navigation
    - Reprise automatique quand la souris quitte
  - [x] **Interaction clic** :
    - Vague s'arrête, seul le lien cliqué reste orange 3 secondes
    - Appel global `window.highlightCard()` pour déclencher effet sur card
    - Reprise animation vague après 3 secondes
  - [x] **Liens dynamiques** : NAV_LINKS_GUEST vs NAV_LINKS_AUTH
    - Visiteur : Commander, Installer App, Événements, Nous trouver, Découvertes, À propos (6 liens)
    - Authentifié : + Mon Profil, Suivi (8 liens)
  - [x] **Liens vers cards** : Anchors `#card-*` avec scroll smooth + highlight
  - [x] **Couleurs thaï** : Vert #2d5016 par défaut, Orange #ff7b54 au hover/actif
  - [x] **Framer Motion** : Transitions color 0.6s ease-in-out
  - [x] **Focus styles supprimés** : .quick-nav exclusions dans globals.css
  - [x] **États gérés** : isPaused, isClicked, clickedIndex, activeWaveIndex

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

**Migration** : `20251111183339_add_plat_features`

- [x] ✅ Ajout champs `plats_db` :
  - `est_vegetarien` (Boolean, default: false) + index
  - `niveau_epice` (Int 0-3, default: 0) + index
  - `categorie` (String VARCHAR(100)) + index
- [x] ✅ Table `restaurant_settings` : Gestion configuration restaurant
  - `plat_vedette_id` : ID du plat mis en avant cette semaine

**Server Actions** : `app/actions/restaurant-settings.ts` (241 lignes)

- [x] ✅ `setFeaturedDish(plat_id)` : Définir/retirer plat vedette + validation jours disponibles
- [x] ✅ `getFeaturedDish()` : Récupération plat vedette avec jours disponibles calculés
- [x] ✅ `isFeaturedDish(platId)` : Vérifier si plat est vedette actuel

**Zod Schemas** : `lib/validations.ts`

- [x] ✅ `platSchema` étendu : `est_vegetarien`, `niveau_epice` (0-3), `categorie` (enum)
- [x] ✅ `platVedetteSchema` : Validation plat_id nullable
- [x] ✅ `restaurantSettingSchema` : Validation settings key-value

**Types** : `types/app.ts`

- [x] ✅ `PlatPanier` étendu : Champ `demandeSpeciale` pour préférences épices

#### 🔥🔥 Améliorations Complétées

- [x] 🔥🔥 **nuqs - Filtres menu** : URL state pour catégorie ✅ (line 29: useQueryState)
  - Extension: Ajouter recherche, épicé, végétarien (Phase 2)

- [x] ✅ **Badges spéciaux plats** : Icônes végétarien, épicé
  - Implémentation : `app/commander/page.tsx` lignes 683-697
  - Badge végétarien : 🌱 vert si `est_vegetarien = true`
  - Badge épicé : 🔥 rouge répété selon `niveau_epice` (1-3)
  - Style : `Badge variant="outline"` avec couleurs custom
  - ⚠️ **Configuration requise** : Définir valeurs dans Prisma Studio pour affichage

- [x] ✅ **Sélecteur Niveau Épicé** : Choix 0-3 piments dans modal plat
  - Composant : `components/commander/SpiceLevelSelector.tsx` (161 lignes)
  - Design : shadcn/ui `ToggleGroup` + Lucide `Flame` icons
  - Niveaux : 🍃 Non épicé | 🌶️ Léger | 🌶️🌶️ Moyen | 🌶️🌶️🌶️ Très épicé
  - Gradient couleurs : vert → jaune → orange → rouge
  - Intégration : `DishDetailsModalInteractive` lignes 176-185
  - Helper function : `getSpiceLevelText(level)` génère texte formaté
  - Storage : Append à `PlatPanier.demandeSpeciale` via paramètre `onAddToCart`
  - Affichage conditionnel : Seulement si `plat.niveau_epice > 0`
  - ⚠️ **Configuration requise** : Définir `niveau_epice` dans Prisma Studio (1-3)

- [x] ✅ **Section "Cette semaine au menu"** : Plat vedette avec Chanthana + Polaroid
  - Composant : `components/commander/FeaturedDishSection.tsx` (172 lignes)
  - API Route : `app/api/featured-dish/route.ts` (force-dynamic)
  - Position : Entre header et filtres menu (ligne 463 commander/page.tsx)
  - Layout responsive :
    - Vidéo Chanthana : `platsemaine.mp4` (1.81 MB, 720x720, 1:1, 3s loop)
    - Bulle dialogue animée : "Cette semaine au menu !" (bounce animation)
    - Polaroid plat : Style cards actuelles + étoile ⭐ gold top-left
  - Badges jours : Highlight gold sur jours où plat vedette disponible
  - Comportement clic : Scroll smooth vers section jours via `handleScrollToDays()`
  - Admin : Bouton "⭐ Vedette" dans `/admin/plats` lignes 1389-1403
  - Bouton toggle : Gold rempli si vedette, outline sinon
  - Asset vidéo : Prompt générateur dans `public/videogif/promptvideoVEO.md`
  - ⚠️ **Configuration requise** : Cliquer bouton "⭐ Vedette" sur un plat dans admin

- [x] ✅ **Modal Remerciement Polaroid** : Après validation commande
  - Composant : `components/commander/PolaroidThankYouModal.tsx` (146 lignes)
  - Style : Photo Polaroid avec bordure blanche 8px + rotation hover
  - Illustration : Chanthana chef 👩‍🍳 + sawadee 🙏 avec animations
  - Message : "Khop khun kha ! 🙏 Merci pour votre commande"
  - Éléments décoratifs : Cœurs animés + sparkles ✨
  - Progress bar : Barre animée gradient orange-gold
  - Auto-fermeture : 5s (configurable via `autoCloseDelay`)
  - Redirect : `/historique` (configurable via `redirectTo`)
  - Accessibilité : aria-describedby + sr-only title/description
  - Intégration : `commander/page.tsx` ligne 358 (remplace toast)
  - Props : `isOpen`, `onClose`, `autoCloseDelay?`, `redirectTo?`
  - Animations : zoom-in-95, pulse, bounce, ping (Tailwind)

- [x] ✅ **Recherche plats en temps réel** : Filtrage case-insensitive par nom
  - Implémentation : `commander/page.tsx` lignes 190-196
  - Affichage jours disponibilité dans résultats
  - Quick-select jour depuis résultat recherche

- [x] ✅ **Sélection Jour/Date/Heure complet** : Workflow 3 étapes
  - Jours ouverture dynamiques selon disponibilité plats (lignes 253-281)
  - 8 prochaines dates calculées pour jour sélectionné
  - Heures: 18h00 - 20h30 (pas de 5 min)
  - Auto-sélection depuis dernier article panier

- [x] ✅ **Groupage panier par date retrait** : Organisation automatique
  - Articles groupés visuellement par date (lignes 432-484)
  - Création commande séparée par date

- [x] ✅ **Toast vidéo ajout panier** : Feedback animé MP4
  - Animation: `ajoutpaniernote.mp4` (lignes 378-402)
  - TypingAnimation pour texte coloré
  - Style Polaroid avec progress bar

- [x] ✅ **Persistence panier localStorage** : Sauvegarde automatique
  - CartContext avec JSON serialization (lignes 31-61)
  - Reconversion dates ISO au chargement
  - UniqueId par article pour gestion fine

- [x] ✅ **Intégration Better Auth** : Authentification complète
  - useSession() pour vérification connexion (lignes 103-117)
  - getClientProfile() pour mapping User.id → client_db
  - Validation profil avant commande

- [x] ✅ **Layout responsive 3 breakpoints** : Mobile/Tablet/Desktop
  - Mobile: 1 colonne, FeaturedDish compact
  - Tablet: 2 colonnes, sélecteurs côte à côte
  - Desktop: Layout 3fr_2fr, Polaroid sticky sidebar (lignes 555-560)

- [x] ✅ **Distribution épicée SmartSpice** : Gestion multi-portions
  - 4 niveaux: Non épicé → Piment Thai
  - Répartition intelligente sur plusieurs portions
  - Indicateurs visuels couleur + warning niveau max
  - Composants: `SmartSpice.tsx` (124 lignes) + `Spice.tsx` (266 lignes)

- [x] ✅ **Avatar Chanthana animé** : Composant `ChanthanaAvatar.tsx` (84 lignes)
  - Animations Framer Motion (idle/happy)
  - Support messages dynamiques + réactions
  - Responsive mobile/desktop

#### 🔥 Tâches Restantes

- [ ] 🔥🔥 **Icône panier visuelle** : Ajouter icône ShoppingCart à côté du texte existant
  - Texte "X dans le panier" existe déjà ✅
  - Ajouter `ShoppingCart` icon de lucide-react
  - Ajouter badge numérique superposé
  - Status : FACILE (~30 min)

- [ ] 🔥 **Mobile UX - Bottom navigation** : Menu bas d'écran
  - Créer bottom navigation bar responsive
  - Optimiser touch interactions
  - Status : PENDING

- [x] ✅ **Avatar Chanthana animations** : FAIT via `ChanthanaAvatar.tsx`
  - Composant existant avec Framer Motion (84 lignes)
  - Position sidebar avec messages dynamiques
  - Animations idle/happy + réactions
  - ~~Status : PENDING~~ → COMPLÉTÉ

- [ ] 🔥 **Animation ajout panier améliorée** : Micro-animation clin d'œil (optionnel)
  - Toast vidéo existe déjà avec MP4 ✅
  - À améliorer: GIF/MP4 Chanthana réaction 2-3s
  - Status : OPTIONNEL (feedback vidéo existe)

#### ⚙️ Configuration Requise pour Affichage

**Après restart du serveur de développement, configurer via Prisma Studio** :

1. **Pour badges spéciaux** : Éditer plats dans `plats_db`
   - `est_vegetarien` → `true` pour plats végétariens
   - `niveau_epice` → `1`, `2`, ou `3` pour plats épicés
   - Exemple : Pad Thai végétarien → `est_vegetarien: true, niveau_epice: 2`

2. **Pour sélecteur épicé dans modal** :
   - Définir `niveau_epice` > 0 sur plats concernés
   - Modal affichera automatiquement le sélecteur

3. **Pour section plat vedette** :
   - Aller dans `/admin/plats`
   - Cliquer sur bouton "⭐ Vedette" du plat souhaité
   - Vérifier que plat a au moins 1 jour disponible (`lundi_dispo` = "oui", etc.)
   - Section apparaîtra automatiquement sur `/commander`

4. **Vérification** :
   - Prisma Studio en cours : Background process c1883f
   - Interface : http://localhost:5555
   - Redémarrer serveur après modifications Prisma

### 🛍️ C. Page Panier (/panier)

#### ✅ Améliorations Complétées

- [x] ✅ **Photo Polaroid Header** : Composant réutilisable `PolaroidPhoto.tsx`
  - Padding effet Polaroid authentique (10px/20px)
  - Bordures Thai green + rotation hover 3°
  - Caption et shadow effects

- [x] ✅ **Gestion panier complète** : CartContext + localStorage
  - Fichier: `contexts/CartContext.tsx` (167 lignes)
  - Ajout/modification/suppression articles
  - Persistence localStorage avec dates ISO
  - UniqueId par article pour gestion fine
  - Reconversion dates au chargement

- [x] ✅ **Modification quantité intelligente** : Ajustement épices auto
  - Fichier: `app/panier/page.tsx` lignes 271-310
  - Boutons +/- avec suppression si qty <= 0
  - Distribution épicée ajustée automatiquement
  - Toast confirmation modifications

- [x] ✅ **Suppression avec confirmation** : Modal vidéo avant action
  - Composant: `CartItemCard.tsx` lignes 308-383
  - ModalVideo avec question + boutons Confirmer/Annuler
  - Animation et feedback visuel

- [x] ✅ **Calcul total prix temps réel** : Somme dynamique
  - `totalGeneral = sum(prix * quantite)` (ligne 160-163)
  - Formatage selon décimales (0€ ou 2.50€)

- [x] ✅ **Groupement par date retrait** : Organisation visuelle
  - Articles groupés par date de retrait (lignes 119-158)
  - Section distincte par date

- [x] ✅ **Demandes spéciales** : Textarea avec feedback
  - Champ libre pour allergies/préférences (lignes 490-512)
  - Toast vidéo au blur si texte rempli
  - Envoyé dans `demande_special_pour_la_commande`

- [x] ✅ **Création commandes multiples** : Par date retrait
  - Une commande Prisma par date unique
  - Détails: plat_r, quantité, épices, distribution
  - Redirection vers `/suivi-commande/{id}`

- [x] ✅ **Distribution épicée SmartSpice** : Lecture et édition
  - Composants: `SmartSpice.tsx` (124 lignes) + `Spice.tsx` (266 lignes)
  - Mode lecture seule dans récapitulatif
  - Mode édition dans modal modification
  - Ajustement auto lors changement quantité

- [x] ✅ **Responsive mobile-first** : 3 breakpoints
  - Mobile: Layout vertical, padding réduit (px-1)
  - Tablet: Éléments côte à côte
  - Desktop: Container centré max-w-6xl

- [x] ✅ **Intégration auth Better Auth** : Validation avant commande
  - Vérification session utilisateur (useSession)
  - Toast erreur si profil incomplet
  - Bouton disabled si non connecté

- [x] ✅ **Page confirmation visuelle** : FAIT via redirection suivi-commande
  - Redirection vers `/suivi-commande/{id}` après validation
  - Toast vidéo "Khop khun kha" avant redirection

- [x] ✅ **Message confirmation lisible** : FAIT via toast vidéo
  - Toast vidéo avec animation MP4 + Polaroid style
  - TypingAnimation pour texte coloré

#### 🔥🔥 Fonctionnalités Prioritaires (Restantes)

- [ ] 🔥🔥 **Sauvegarde panier non connecté** : Proposer création compte
  - Panier localStorage existe déjà ✅
  - À ajouter: Modal "Créer compte pour conserver"

- [ ] 🔥 **Gestion heure retrait avancée** :
  - Note heure indicative (peut être ajustée)
  - Admin: Proposer nouvelle heure
  - Notification via n8n si changement

### 📜 D. Page Historique (/historique & /historique/complet)

**Fichier** : `app/historique/page.tsx` (651 lignes)

#### ✅ Fonctionnalités Existantes (Complètes)

- [x] ✅ **FilterSearchBar** : Composant complet de filtres (ligne 310)
  - [x] Recherche par nom de plat (case-insensitive)
  - [x] Filtre par statut (commande ou événement)
  - [x] Filtre par type (commande / événement)
  - [x] Filtre par plage de dates (DateRangePicker)
  - [x] Filtre par montant min/max
  - [x] Bouton "Effacer tous les filtres"
  - [x] Badge compteur filtres actifs
- [x] ✅ **Real-time Supabase sync** : `useCommandesRealtime()` (ligne 72)
- [x] ✅ **Offline Banner** : `OfflineBannerCompact` (ligne 307)
- [x] ✅ **Résumé résultats filtrés** : Affichage count commandes + événements (lignes 293-308)
- [x] ✅ **Séparation En Cours / Historique** : 4 sections distinctes
- [x] ✅ **Limite 10 dernières commandes historique** : `.slice(0, 10)` (ligne 254)
- [x] ✅ **StatusBadge** : Composant couleurs statuts (ligne 47)
- [x] ✅ **CommandeActionButtons** : Boutons Voir/Modifier (ligne 35-37)
- [x] ✅ **EvenementActionButtons** : Boutons Voir/Modifier (ligne 35-37)
- [x] ✅ **FormattedDate, FormattedPrice, DishList, PersonCount** : Composants display (ligne 40-46)

#### ⚠️ Composant Créé mais NON Intégré

- [ ] 🔥🔥 **BoutonTelechargerFacture** : Composant existe (`components/historique/BoutonTelechargerFacture.tsx` - 41 lignes) mais **NON utilisé** dans la page historique
  - À intégrer dans `CommandeActionButtons` pour commandes "Récupérée"

#### 🔥🔥 Tâches Restantes

- [ ] 🔥🔥 **Intégrer BoutonTelechargerFacture** : Ajouter dans ActionButtons.tsx pour statut "Récupérée"
- [ ] 🔥🔥 **Bouton Devis/Facture événements** : Template PDF événement à créer
- [ ] 🔥🔥 **Bouton "Voir tout l'historique"** : Redirection vers `/historique/complet`
- [ ] 🔥🔥 **"Commander à Nouveau"** : Bouton copie commande passée vers panier

#### ❌ Page Historique Complet (/historique/complet) - N'EXISTE PAS

**Note : Page planifiée mais non créée**

- [ ] 🔥🔥 **Créer page `/historique/complet/page.tsx`** : Route Next.js manquante
- [ ] 🔥🔥 **nuqs - Pagination** : Navigation pages avec URL state
- [ ] 🔥 **Vue Calendrier** : Navigation visuelle commandes/événements passés

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
- [ ] 🔥🔥 **Notifications Push** : Changement statut via PWA + n8n
- [ ] 🔥 **Contact Rapide** : Boutons `<a href="tel:">` et `<a href="sms:">`
- [ ] 🔥 **Laisser un Avis** : Formulaire simple après "Récupérée"

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

- [ ] 🔥🔥 **ProgressTimelineEvenement** : Chronologie visuelle (Demande → Contact → Devis → Confirmé → Réalisé)
- [ ] 🔥🔥 **BoutonTelechargerDevis** : Template PDF événement
- [ ] 🔥🔥 **Bouton "Accepter le devis"** : Webhook n8n + changement statut
- [ ] 🔥 **Contact Rapide** : WhatsApp avec message pré-rempli
- [ ] 🔥 **Rappels automatiques** : n8n avant événement + remerciement après

### 👤 H. Page Profil (/profil) & Inscription (/auth/signup)

#### ✅ Améliorations UI/UX Complétées

- [x] ✅ **Sélecteur de date de naissance amélioré** : Composant `DateBirthSelector` (3 selects)
- [x] ✅ **Harmonisation formulaire signup avec profil** :
  - "Adresse (numéro et rue)" identique
  - "Vos Préférences" → Textarea
  - "Comment avez-vous connu..." formulation identique
  - "Newsletter" → RadioGroup ("Oui, j'accepte" / "Non")

#### 🔥🔥🔥 Gestion du Compte (Sécurité)

**Dépend de : Better Auth workflows ⏳**

- [ ] **Modification Email Sécurisée** : Exiger password actuel + confirmation double email
- [ ] **Suppression Compte** : Page dédiée avec confirmation password + GDPR compliance
- [ ] **Mot de Passe Oublié** : Workflow complet reset password (déjà route créée)
- [ ] **Design Boutons Auth** : Inverser "Se connecter" / "Créer un compte" + revoir icônes

#### 🔥 Intégration n8n Communication

- [ ] **Messages Anniversaire** : Cron quotidien envoi vœux automatiques
- [ ] **Newsletter Actualités** : Système envoi emails offres spéciales (manuel/programmé)

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

### 🍲 B. Page Admin / Plats (/admin/plats)

#### 🔥🔥 Système Ruptures Exceptionnelles

**Objectif : Gestion stock par exception (dates spécifiques)**

- [ ] **Modification Base de Données** :
  - Table `ruptures_exceptionnelles` (plat_id, date_rupture, quantite_initiale, quantite_restante)

- [ ] **Interface Admin** :
  - Composant `DateRuptureManager` : Définir rupture plat à date précise
  - Option quantité limitée ou rupture totale

- [ ] **Décompte Automatique** :
  - Fonction Postgres : Décrémente `quantite_restante` à chaque commande "Confirmée"

- [ ] **Affichage Côté Client** :
  - Pages `/commander` et `/modifier-commande`
  - Badge "Plus que X disponibles !" si quantité limitée
  - "Épuisé pour aujourd'hui" si rupture totale

#### 🔥 UX & Fonctionnalités

- [ ] **Confirmation suppression extra** : Dialog avant delete
- [ ] **Transférer extra → menu** :
  - Bouton "Ajouter au menu" sur chaque extra
  - Modale création plat pré-remplie
  - Proposition désactiver/supprimer extra d'origine (éviter doublons)

### 👥 C. Page Admin / Clients (/admin/clients)

**🔥🔥 Création Client Manuel**

- [ ] **Bouton "Nouveau Client"** : Sur page `/admin/clients`
- [ ] **Route `/admin/clients/creer`** : Page dédiée création
- [ ] **Formulaire création** :
  - Champs : prénom, nom, email, téléphone, adresse, date naissance
  - Validation Zod (dépend de : Schemas Zod ⏳)
  - Création profil client sans compte auth (optionnel)
- [ ] **Enregistrement** : Server Action + invalidation cache

### ➕ D. Page Admin / Création Commande (/admin/commandes/creer)

**🔥🔥 Création Commande Manuelle**

- [ ] **Bouton "Nouvelle Commande"** : Sur page `/admin/commandes`
- [ ] **Route `/admin/commandes/creer`** : Page dédiée création
- [ ] **Formulaire multi-étapes** :
  - Étape 1 : Sélection client (recherche ou création à la volée)
  - Étape 2 : Composition commande (plats + extras + quantités)
  - Étape 3 : Détails (heure retrait, type livraison, commentaires)
  - Étape 4 : Récapitulatif + validation
- [ ] **Validation** : Schemas Zod (dépend de : Schemas Zod ⏳)
- [ ] **Enregistrement** : Server Action création commande complète

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

### Budget Mensuel Estimé (Nov 2025)

| Service                     | Coût            | Notes                             |
| --------------------------- | --------------- | --------------------------------- |
| **Hetzner VPS**             | 5-10€/mois      | CX22 (2 vCPU, 4GB RAM, 80GB)      |
| **n8n self-hosted**         | 0€              | Inclus dans VPS                   |
| **Resend (Better Auth)**    | 0€              | Free tier 100 emails/jour         |
| **Brevo (n8n emails)**      | 0€              | Free tier 300 emails/jour         |
| **Firebase FCM (Push)**     | 0€              | Gratuit illimité                  |
| **Telegram Bot**            | 0€              | Gratuit illimité                  |
| **Supabase (DB + Storage)** | 0€              | Free tier (500MB DB, 1GB Storage) |
| **Twilio SMS** (optionnel)  | 0-15€           | Si activation SMS backup          |
| **Domaine**                 | 10-15€/an       | .com/.fr                          |
| **Total**                   | **10-25€/mois** | Sans SMS, 25-40€ avec             |

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

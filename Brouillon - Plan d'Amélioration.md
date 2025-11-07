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

#### ✅ Schemas Auth Complets [COMPLÉTÉ 2025-11-04]
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
**Statut : Migration COMPLÈTE depuis Firebase Auth (2025-10-27)**

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

#### ✅ Workflows Authentication - COMPLÉTÉS [100% ✅] (2025-11-04)
**Statut : Infrastructure 100% complète + Configuration Resend ✅**

- [x] **✅ Email Verification Workflow** (100% COMPLÉTÉ + RESEND CONFIGURÉ)
  - ✅ Table `Verification` existe dans Prisma
  - ✅ Template email créé : `emails/VerificationEmail.tsx` (2975 lignes)
  - ✅ Fonction `sendVerificationEmail()` dans `lib/email-sender.ts`
  - ✅ Route créée : `app/auth/verify-email/[token]/page.tsx` (213 lignes)
  - ✅ Server Actions : `app/auth/verify-email/actions.ts` (verifyEmailToken + resendVerificationEmail)
  - ✅ Plugin Better Auth activé : `lib/auth.ts` lignes 24-28
  - ✅ 4 états UI : loading, success (countdown 3s), error, expired
  - ✅ **Resend API configurée avec domaine personnalisé `cthaicook.com`** (2025-11-04)
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
**Statut : 100% ✅ (2025-11-05)**

**Dépend de : Schemas Zod ✅**

<details>
<summary>📊 Configuration et Premier Pattern Test</summary>

✅ **Installation complète** (2025-11-05)
- [x] Vitest 4.0.7 + @testing-library/react + @testing-library/jest-dom + jsdom
- [x] @vitejs/plugin-react pour support JSX

✅ **Configuration `vitest.config.ts`** (2025-11-05)
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

✅ **Résultats Validation** (2025-11-05)
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

#### ✅ Templates Authentication Complets (6/6) [100% ✅] (2025-11-04)
**Statut : Templates Better Auth 100% + 1 transactionnel**

- [x] **ChanthanaWelcomeEmail.tsx** ✅ (31377 lignes, créé 2025-11-03)
- [x] **ResetPasswordEmail.tsx** ✅ (8390 lignes, créé 2025-11-03)
- [x] **VerificationEmail.tsx** ✅ (2975 lignes, créé 2025-10-22)
- [x] **ChanthanaEmailChangeConfirmation.tsx** ✅ (650+ lignes, créé 2025-11-04)
  - Design bleu/or professionnel
  - Section ancien/nouvel email avec flèche visuelle
  - Bouton vérification + expiration 24h
  - Notices sécurité (contactez si pas vous)
- [x] **ChanthanaAccountDeletedEmail.tsx** ✅ (800+ lignes, créé 2025-11-04)
  - Design rouge/gris avec icône trash
  - Section RGPD détaillée (données supprimées vs conservées)
  - Messages "Vous nous manquerez" avec bouton retour site
  - Compliance légale : Factures 10 ans (anonymisées)
- [x] **CommandeConfirmationEmail.tsx** ✅ (1170 lignes, créé 2025-11-03)

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

### ⚠️ 7️⃣ n8n - Infrastructure TypeScript Complète [50% COMPLÉTÉ]
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

### 🔥 8️⃣ Stack Monitoring - PLG + GlitchTip + UptimeRobot [PHASE 4 - FUTUR]

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

### 🔥 9️⃣ Outils Techniques Supplémentaires [PHASE 2-3]

#### ✅ nuqs - URL State Management Type-Safe [INSTALLÉ + UTILISÉ]
**Statut : Installation complète, utilisé dans /commander**

- [x] **Installation de la bibliothèque nuqs** (NPM v2.7.2, gratuit)
- [x] **Adapter configuré** : `app/layout.tsx` avec `NuqsAdapter`
- [x] **Filtres menu `/commander`** ✅ UTILISÉ (ligne 29: `useQueryState`)
  ```typescript
  const [category, setCategory] = useQueryState('cat', parseAsString)
  // Déjà implémenté dans app/commander/page.tsx
  ```
- [ ] **Filtres avancés `/commander`** (🔥🔥 MOYENNE - EXTENSION)
  - Ajouter search, spicy, vegetarian filters
  - URL: /commander?cat=entrees&q=pad%20thai&spicy=true
- [ ] **Pagination `/historique/complet`** (🔥🔥 MOYENNE)
  ```typescript
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [pageSize, setPageSize] = useQueryState('size', parseAsInteger.withDefault(10))
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

### ✅ Fondations PWA [COMPLÉTÉ 2025-11-05]
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

### ✅ Notifications Push [COMPLÉTÉ 2025-11-05]
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
- [x] 🔥🔥 Notifications rappel événement (24h/48h avant) [COMPLÉTÉ 2025-11-05]
  - ✅ app/api/cron/event-reminders/route.ts : API endpoint CRON (207 lignes)
  - ✅ Logique recherche événements dans plages temporelles (23h-25h et 47h-49h)
  - ✅ Filtre statut événement : Confirm____Acompte_re_u, En_pr_paration
  - ✅ Envoi notifications FCM avec détails événement (nom, date, heure)
  - ✅ Messages différenciés : "Votre événement est demain !" (24h) et "Rappel : événement dans 2 jours" (48h)
  - ✅ vercel.json : Configuration CRON quotidien à 9h UTC (schedule: "0 9 * * *")
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

### ✅ Tests & Qualité [COMPLÉTÉ 2025-11-05]
- [x] 🔥🔥🔥 Tests automatisés Playwright : Parcours critiques (commande, auth, paiement)
  - ✅ Infrastructure E2E complète (playwright.config.ts - 3 projets)
  - ✅ Authentication setup avec Better Auth (tests/auth.setup.ts)
  - ✅ Storage states pour client et admin (tests/.auth/*.json)
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

---

## 🎨 Phase 2 : Améliorations UX par Page (🔥🔥 MOYENNE)
**Objectif : Polir l'expérience utilisateur et ajouter features confort**

**Dépend de : Server Actions stables ⏳ | Schemas Zod ⏳**

### 🏠 A. Page d'Accueil (/)

#### 🎬 Hero Section Dynamique
- [ ] 🔥🔥🔥 **Carousel média administratif** : Images + vidéos courtes (5-8s)
  - Upload depuis interface admin (/admin/hero-media)
  - Support image (JPG, PNG, WebP) + vidéo (MP4, WebM)
  - Drag & drop pour réorganiser l'ordre
  - Transition fade douce entre médias
  - Indicateurs navigation discrets
  - Responsive : Aspect ratio adaptatif mobile/desktop

- [ ] 🔥🔥 **Overlay texte sur hero** : Titre + baseline + CTA
  - "ChanthanaThaiCook - Cuisine Thaïlandaise Authentique"
  - "Faite Maison avec Passion"
  - Boutons : [Commander] [Découvrir]
  - Fond overlay subtil pour lisibilité

#### 🧭 Navigation Contextuelle

- [ ] 🔥🔥🔥 **Cartes navigation adaptatives selon auth** :
  - **Visiteur non connecté** : 4 cartes
    - Pour Commander
    - Nous Trouver
    - Pour vos Événements
    - À propos de nous
  - **Utilisateur connecté** : 6 cartes (+ Mon Profil + Suivi & Historique)

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
- [ ] **Visiteur non connecté** : 6 cartes affichées
  - Pour Commander (actif)
  - Nous Trouver (actif)
  - Pour vos Événements (actif)
  - À propos de nous (actif)
  - Découvertes (actif) ← NOUVELLE CARTE
  - Mon Profil (désactivé/grisé)
- [ ] **Utilisateur connecté** : 6 cartes actives
  - Ajouter : Mon Profil (actif) + Suivi (actif)
  - Badge "Nouveau !" sur Mon Profil si `photo_client` récente (<7 jours)
- [ ] **Nouvelle carte "Découvertes"** :
  - Route : `/actualites`
  - Icon : Sparkles ✨
  - Description : "Nouveautés, plats du moment et suivez nos coulisses sur les réseaux sociaux"
  - Image : Photo plat saisonnier ou collage Instagram
- [ ] **Grid responsive** :
  - Desktop (≥1024px) : 3 colonnes
  - Tablet (768-1023px) : 2 colonnes
  - Mobile (<768px) : 1 colonne
- [ ] **Animations** : Stagger 150ms top to bottom (framer-motion)

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
- [ ] **Badge "Nouveau !" card Mon Profil** : Si `photo_client` uploadée < 7 jours
- [ ] **Smooth scroll CTA "Découvrir"** : Scroll vers section navigation cards
- [ ] **Photo client dans card Mon Profil** : Depuis `client_db.photo_client`

#### 🎨 Polish & Accessibilité

- [ ] 🔥🔥 **Sélecteur de langue** : Permettre changement langue (fr/th/en)
  - Dépend de : next-intl configuration ⏳
- [ ] 🔥 **Footer enrichi** : Horaires détaillés + jours fermeture hebdomadaire
- [ ] 🔥 **Animations entrance** : Hero fade-in, cards stagger animation
- [ ] 🔥 **Tests accessibilité** : Keyboard navigation, screen readers, focus states
- [ ] 🔥 **Tests E2E Playwright** : Parcours visiteur vs connecté

### 🛒 B. Page Commander (/commander)
- [x] 🔥🔥 **nuqs - Filtres menu** : URL state pour catégorie ✅ (line 29: useQueryState)
  - Extension: Ajouter recherche, épicé, végétarien (Phase 2)
- [ ] 🔥🔥 **Badges spéciaux plats** : Icônes végétarien, épicé, populaire
- [ ] 🔥🔥 **Icône panier avec badge** : ⚠️ Text "X dans le panier" existe, ajouter icône ShoppingCart visuelle
- [ ] 🔥 **Mobile UX** : Simplifier navigation étapes (menu bas d'écran)

### 🛍️ C. Page Panier (/panier)
- [ ] 🔥🔥 **Sauvegarde panier non connecté** : Proposer création compte pour conserver sélection
- [ ] 🔥🔥 **Page confirmation visuelle** : Récapitulatif + message remerciement après validation
- [ ] 🔥 **Message confirmation lisible** : Fond blanc pour toast confirmation
- [ ] 🔥 **Gestion heure retrait** :
  - Note heure indicative (peut être ajustée)
  - Admin : Proposer nouvelle heure
  - Notification via n8n si changement

### 📜 D. Page Historique (/historique & /historique/complet)
#### Page Historique (/historique)
- [ ] 🔥🔥 **Limiter affichage** : 3-5 dernières commandes + 3 derniers événements
- [x] 🔥🔥 **Bouton Facture** ✅ : `BoutonTelechargerFacture.tsx` utilisé pour commandes "Récupérée"
- [ ] 🔥🔥 **Bouton Devis/Facture** : Pour événements terminés (template PDF à créer)
- [ ] 🔥🔥 **Bouton "Voir tout l'historique"** : Redirection vers `/historique/complet` (page à créer)

#### ❌ Page Historique Complet (/historique/complet) - N'EXISTE PAS
**Note : Page planifiée mais non créée, à développer en Phase 2**

- [ ] 🔥🔥 **Créer page `/historique/complet/page.tsx`** : Route Next.js manquante
- [ ] 🔥🔥 **nuqs - Filtres avancés** : Recherche par nom plat, date, statut
- [ ] 🔥🔥 **nuqs - Pagination** : Navigation pages avec URL state
- [ ] 🔥🔥 **"Commander à Nouveau"** : Bouton copie commande passée vers panier
- [ ] 🔥 **Vue Calendrier** : Navigation visuelle commandes/événements passés
- [ ] 🔥 **Export Facture PDF** : Téléchargement pour chaque commande "Récupérée"

### 📍 E. Page Suivi de Commande (/suivi-commande/[id])
- [ ] 🔥🔥 **Bouton Facture** : Pour commandes "Récupérée" (génération PDF)
- [ ] 🔥🔥 **Notifications Push** : Changement statut via PWA + n8n
- [ ] 🔥 **Carte localisation** : ⚠️ Code embed Google Maps ready, ajouter API key dans `.env`
- [ ] 🔥 **Contact Rapide** : Boutons appel/SMS en un clic
- [ ] 🔥 **Laisser un Avis** : Formulaire simple après "Récupérée"

### ✏️ F. Page Modifier Commande (/modifier-commande/[id])
- [ ] 🔥🔥 **Confirmation modifications** : Dialog récapitulatif changements + différence prix
- [ ] 🔥🔥 **Notification admin** : Alerte via n8n si client modifie commande
- [ ] 🔥🔥 **Confirmation client** : Email détaillé après sauvegarde modifications
- [ ] 🔥 **Trace modifications** : Log qui/quand/quoi (côté admin)
- [ ] 🔥 **Gestion heure retrait** : Note indicative + proposition nouvelle heure admin

### 🎉 G. Page Suivi d'Événement (/suivi-evenement/[id])
- [ ] 🔥🔥 **Chronologie visuelle** : Étapes clés ("Demande reçue" → "Devis envoyé" → "Confirmé")
- [ ] 🔥🔥 **Accès Documents** : Téléchargement devis + facture PDF
- [ ] 🔥🔥 **Validation Devis** : Bouton "Accepter le devis" → notification admin n8n
- [ ] 🔥 **Contact Rapide** : Bouton "Poser une question" avec messagerie pré-remplie
- [ ] 🔥 **Rappels automatiques** : n8n envoie rappels avant événement + remerciement après

### 👤 H. Page Profil (/profil) & Inscription (/auth/signup)
#### ✅ Améliorations UI/UX Complétées (2025-11-01)
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
#### ✅ Améliorations Complétées (2025-10-31 / 2025-11-01)
- [x] ✅ **Sélecteur de date amélioré** : Composant `DateSelector` (3 selects)
- [x] ✅ **"Mettre en avant"** : Bouton épingler/désépingler + tri automatique
- [x] ✅ **"Offrir un plat"** : Marquer plat comme offert (prix 0€)

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

### 🎬 E. Page Admin / Hero Media (/admin/hero-media)
**🔥🔥 Gestion Carousel Page d'Accueil**

#### Table Base de Données
- [ ] **Créer table `hero_media`** :
  - Colonnes : id, type (image/video), url, titre, description, ordre, active, created_at, updated_at
  - Migration Prisma + génération types TypeScript

#### Interface Admin
- [ ] **Page CRUD complète** :
  - Liste médias avec preview miniature
  - Drag & drop pour réordonner (bibliothèque dnd-kit)
  - Upload fichiers : Max 10MB, validation MIME
  - Toggle actif/inactif (masquer sans supprimer)
  - Édition titre + description
  - Suppression avec confirmation
  - Preview temps réel du carousel

#### Server Actions
- [ ] **uploadHeroMedia()** : Upload + validation + stockage
- [ ] **updateHeroMediaOrder()** : Réorganiser ordre affichage
- [ ] **toggleHeroMediaActive()** : Activer/désactiver média
- [ ] **deleteHeroMedia()** : Suppression définitive

#### Tests
- [ ] **Tests upload** : Fichiers valides/invalides, taille max
- [ ] **Tests permissions** : Seul admin peut modifier
- [ ] **Tests performance** : Lazy loading, optimisation vidéos

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
**Note : À FAIRE AVEC GEMINI après stabilisation toutes pages**

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

### Budget Mensuel Estimé (Nov 2025)

| Service | Coût | Notes |
|---------|------|-------|
| **Hetzner VPS** | 5-10€/mois | CX22 (2 vCPU, 4GB RAM, 80GB) |
| **n8n self-hosted** | 0€ | Inclus dans VPS |
| **Resend (Better Auth)** | 0€ | Free tier 100 emails/jour |
| **Brevo (n8n emails)** | 0€ | Free tier 300 emails/jour |
| **Firebase FCM (Push)** | 0€ | Gratuit illimité |
| **Telegram Bot** | 0€ | Gratuit illimité |
| **Supabase (DB + Storage)** | 0€ | Free tier (500MB DB, 1GB Storage) |
| **Twilio SMS** (optionnel) | 0-15€ | Si activation SMS backup |
| **Domaine** | 10-15€/an | .com/.fr |
| **Total** | **10-25€/mois** | Sans SMS, 25-40€ avec |

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

**📅 Dernière mise à jour :** 2025-11-05 (PWA + Tests Playwright E2E + Auth setup complétés)


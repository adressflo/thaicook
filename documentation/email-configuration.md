# Configuration des Emails - Better Auth + Resend

## Vue d'ensemble

L'application utilise **Resend** pour l'envoi d'emails d'authentification (vérification et réinitialisation de mot de passe) via **Better Auth**.

## Stack Email

- **Resend**: Service d'envoi d'emails transactionnels
- **React Email**: Templates d'emails React
- **Better Auth**: Gestion des hooks d'authentification

## Configuration

### 1. Obtenir une clé API Resend

1. Créer un compte sur [resend.com](https://resend.com)
2. Générer une clé API dans le dashboard
3. Ajouter la clé dans `.env.local`:

```bash
RESEND_API_KEY=re_votre_cle_api_resend
```

### 2. Configurer le domaine d'envoi (Production)

Par défaut, Resend utilise `onboarding@resend.dev` pour les tests.

Pour la production:

1. Vérifier votre domaine dans Resend
2. Mettre à jour `lib/email.ts`:

```typescript
from: 'Chanthana Thai Cook <noreply@chanthanathaicook.com>'
```

### 3. Activer la vérification d'email (Optionnel)

Dans `lib/auth.ts`, changer:

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // Force la vérification
  // ...
}
```

## Templates d'emails

### Vérification d'email

**Fichier**: `emails/VerificationEmail.tsx`

**Déclenché par**: Inscription d'un nouvel utilisateur

**Contenu**:
- Message de bienvenue
- Bouton de vérification
- Lien de vérification direct
- Expiration: 24 heures

### Réinitialisation de mot de passe

**Fichier**: `emails/ResetPasswordEmail.tsx`

**Déclenché par**: Demande de reset password

**Contenu**:
- Instructions de réinitialisation
- Bouton d'action
- Lien de réinitialisation direct
- Avertissement de sécurité
- Expiration: 1 heure

## Architecture

```
Better Auth (événement)
  ↓
lib/auth.ts (hooks)
  ↓
lib/email.ts (envoi Resend)
  ↓
emails/*.tsx (templates React Email)
  ↓
Resend API → Email envoyé
```

## Fonctions d'envoi

### `sendVerificationEmail(email, verificationUrl)`

```typescript
import { sendVerificationEmail } from '@/lib/email';

await sendVerificationEmail(
  'user@example.com',
  'https://app.com/verify?token=xxx'
);
```

### `sendResetPasswordEmail(email, resetUrl)`

```typescript
import { sendResetPasswordEmail } from '@/lib/email';

await sendResetPasswordEmail(
  'user@example.com',
  'https://app.com/reset-password?token=xxx'
);
```

## Développement local

Pour tester les emails en local:

```bash
# 1. Démarrer le serveur de preview React Email
npm run email:dev

# 2. Ouvrir http://localhost:3000
# Vous verrez tous vos templates d'emails

# 3. Tester l'envoi réel avec une clé API Resend de test
```

## Customisation des templates

Les templates utilisent:
- **Couleurs thaïlandaises**: Rouge #dc2626
- **Emojis**: 🌶️ 🙏 pour le branding
- **Responsive**: Optimisé mobile/desktop
- **Accessibilité**: Texte alternatif pour les liens

Pour modifier un template:

1. Éditer `emails/NomTemplate.tsx`
2. Tester avec `npm run email:dev`
3. Les changements sont automatiquement pris en compte par Better Auth

## Gestion des erreurs

Les erreurs d'envoi sont loggées mais ne bloquent pas le processus d'authentification:

```typescript
try {
  await sendVerificationEmail(email, url);
} catch (error) {
  console.error('Échec envoi email:', error);
  // L'utilisateur peut quand même se connecter
}
```

## Monitoring

Pour le monitoring en production:

1. Dashboard Resend: Voir les emails envoyés/échecs
2. Logs Better Auth: `console.log` dans `lib/auth.ts`
3. Resend Webhooks: Configurer pour recevoir les événements (bounce, complaint, etc.)

## Limites Resend

- **Plan gratuit**: 100 emails/jour, 3,000/mois
- **Plan Pro**: $20/mois pour 50,000 emails
- **Rate limit**: 10 req/s maximum

## Sécurité

- ✅ Les tokens de vérification/reset expirent automatiquement
- ✅ Pas d'informations sensibles dans les emails
- ✅ HTTPS requis pour les liens de vérification
- ✅ Clé API Resend jamais exposée côté client

## Troubleshooting

### Email non reçu

1. Vérifier spam/promotions
2. Vérifier logs Resend dashboard
3. Vérifier `RESEND_API_KEY` dans `.env.local`
4. Vérifier que le domaine est vérifié (production)

### Erreur "Invalid API key"

```bash
# Régénérer la clé dans Resend dashboard
# Mettre à jour .env.local
RESEND_API_KEY=re_nouvelle_cle
```

### Template ne s'affiche pas correctement

```bash
# Rebuild les templates
npm run email:dev

# Vérifier les imports React Email
```

## Références

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Better Auth Email](https://www.better-auth.com/docs/concepts/email-password)

# APPCHANTHANA - Restaurant Thaï Authentique

Une application Next.js 15 moderne pour la gestion d'un restaurant thaïlandais, offrant une expérience culinaire authentique avec un système de commandes et de gestion complet.

## 🚀 Technologies

- **Frontend**: Next.js 15.5.4 + React 19.1.1 + TypeScript 5
- **UI**: shadcn/ui + Radix UI + Tailwind CSS 4.1.12
- **Authentication**: Better Auth 1.3.28 (TypeScript-first auth)
- **Database**: Supabase PostgreSQL 15 + Prisma ORM 6.17.1
- **État**: TanStack Query 5.90.2 + Server Actions
- **Testing**: Playwright 1.55.0 (E2E)
- **Déploiement**: Vercel (recommandé)

### ⚡ Migrations & Améliorations Récentes

#### Migration Prisma & Better Auth (2025-10-27)
✅ **Firebase Auth → Better Auth** : Migration complète vers Better Auth avec Prisma adapter
✅ **Supabase SDK → Prisma ORM** : 100% des opérations CRUD via Prisma Server Actions
✅ **Architecture modernisée** : Sécurité application-level + types auto-générés
✅ **Nettoyage code** : -3200 lignes de code obsolète supprimées

#### Nouvelles Fonctionnalités (2025-10-31 / 2025-11-01)
✅ **Admin - Épingler des commandes** : Mise en avant des commandes prioritaires avec tri automatique
✅ **Admin - Offrir des plats** : Marquage de plats comme offerts (prix à 0€) dans les commandes
✅ **Admin - Sélecteur de date amélioré** : Interface intuitive avec dropdowns jour/mois/année
✅ **UX - Date de naissance** : Composant réutilisable `DateBirthSelector` pour profil et inscription
✅ **UX - Harmonisation formulaires** : Cohérence profil ↔ signup (labels, types de champs, valeurs par défaut)

📖 **Documentation complète** : Voir [`documentation/architecture-overview.md`](documentation/architecture-overview.md)

## 📋 Prérequis

- Node.js 18.17.0 ou plus récent
- npm, yarn ou pnpm

## 🛠️ Installation

1. Clonez le repository
```bash
git clone [repository-url]
cd appchanthana
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env.local
```

4. Démarrez le serveur de développement
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
├── app/                    # App Router Next.js 15
│   ├── actions/           # Server Actions Prisma (clients, plats, commandes, extras, evenements)
│   ├── auth/              # Pages d'authentification (login, signup, reset-password)
│   ├── admin/             # Interface administrateur
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Page d'accueil
├── components/            # Composants React
│   ├── forms/            # Composants de formulaire réutilisables
│   │   ├── DateBirthSelector.tsx   # Sélecteur date de naissance (jour/mois/année)
│   │   └── DateSelector.tsx        # Sélecteur date générique (admin)
│   └── ui/               # Composants shadcn/ui
├── hooks/                # Hooks personnalisés
│   ├── usePrismaData.ts  # 44 hooks TanStack Query pour Prisma
│   └── useSupabaseData.ts # 8 hooks Realtime + ruptures
├── lib/                  # Utilitaires et configurations
│   ├── auth.ts           # Better Auth serveur
│   ├── auth-client.ts    # Better Auth client
│   └── supabase.ts       # Client Supabase
├── prisma/               # Schéma Prisma ORM
│   ├── schema.prisma     # Schéma de base de données (26 modèles)
│   └── migrations/       # Historique des migrations
├── services/             # Services externes
├── types/                # Types TypeScript
│   ├── app.ts           # Types applicatifs
│   └── supabase.ts      # Types générés Supabase
└── public/              # Assets statiques
```

## 🎨 Fonctionnalités

### Pour les Clients
- 🍜 Consultation du menu et commandes
- 📱 Interface responsive et mobile-friendly
- 🛒 Panier de commande intuitif
- 📅 Réservation d'événements
- 📍 Localisation du restaurant
- 📊 Historique des commandes
- 👤 **Profil utilisateur amélioré** :
  - 📆 Sélecteur de date de naissance avec dropdowns (jour/mois/année) (ajouté 2025-11-01)
  - 📝 Formulaire d'inscription harmonisé avec le profil
  - ✅ Newsletter par défaut avec RadioGroup ("Oui, j'accepte" / "Non")

### Pour les Administrateurs
- 📊 Tableau de bord complet
- 🍽️ Gestion des plats et menus
- 📋 Gestion des commandes
  - 📌 **Épingler des commandes** : Mettre en avant les commandes importantes (ajouté 2025-10-31)
  - 🎁 **Offrir des plats** : Marquer des plats comme offerts (prix à 0€) (ajouté 2025-10-31)
  - 📅 **Sélecteur de date amélioré** : Navigation intuitive avec dropdowns jour/mois/année (ajouté 2025-11-01)
- 👥 Gestion des clients
- 📈 Statistiques et analyses
- 🎯 Système de recommandations IA

## 🔧 Scripts Disponibles

```bash
# Développement avec Turbopack
npm run dev

# Build de production
npm run build

# Démarrage production
npm start

# Linting
npm run lint

# Vérification types
npm run type-check

# Prisma ORM
npm run prisma:generate    # Générer le client Prisma
npm run prisma:push        # Push schema vers la DB
npm run prisma:studio      # Interface graphique DB
npm run prisma:migrate     # Créer une migration
npm run prisma:test        # Tests CRUD Prisma

# Tests E2E
npm run test:e2e          # Playwright tests
```

## 🎨 Thème et Design

L'application utilise une palette de couleurs inspirée de la Thaïlande :

- **Orange Thaï** (`#FF7B54`) - Couleur principale
- **Vert Thaï** (`#2D5016`) - Couleur secondaire
- **Or Thaï** (`#FFD700`) - Accents
- **Rouge Thaï** (`#DC2626`) - Alertes
- **Crème Thaï** (`#FEF7E0`) - Arrière-plans

## 🔐 Authentification

Le système d'authentification moderne utilise :
- **Better Auth 1.3.28** : TypeScript-first authentication avec Prisma adapter
- **Sessions cookies** : Stockage sécurisé via `better-auth.session_token`
- **Middleware Next.js** : Protection automatique des routes admin et utilisateur
- **Synchronisation automatique** : User → client_db via `auth_user_id`

## 📱 Responsive Design

- Design mobile-first avec Tailwind CSS
- Adaptation automatique pour tablettes et desktop
- Interface tactile optimisée
- Performance optimisée sur tous les appareils

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres Plateformes

L'application est compatible avec :
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add: AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📚 Documentation

Consultez la documentation complète dans `/documentation/` :

- [Architecture Globale](documentation/1-architecture-globale.md)
- [Frontend Architecture](documentation/2-frontend-architecture.md)
- [Backend & Database](documentation/3-backend-architecture.md)
- [Code Quality Standards](documentation/4-code-quality-standards.md)
- [Security Guidelines](documentation/5-security-guidelines.md)
- [Performance Optimization](documentation/6-performance-optimization.md)
- [Testing Strategy](documentation/7-testing-strategy.md)
- [Refactoring Roadmap](documentation/8-refactoring-roadmap.md)

[Voir tous les docs →](documentation/)

## 📞 Support

Pour toute question ou support :
- Email : support@appchanthana.com
- Issues GitHub : [Créer un ticket](../../issues)

---

Développé avec ❤️ pour APPCHANTHANA - Restaurant Thaï Authentique
# APPCHANTHANA - Restaurant Thaï Authentique

Une application Next.js 15 moderne pour la gestion d'un restaurant thaïlandais, offrant une expérience culinaire authentique avec un système de commandes et de gestion complet.

## 🚀 Technologies

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **Backend**: Supabase + Firebase Authentication
- **État**: React Query + Context API
- **Déploiement**: Vercel (recommandé)

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
│   ├── (routes)/          # Groupes de routes
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Page d'accueil
├── components/            # Composants React
│   └── ui/               # Composants shadcn/ui
├── contexts/             # Contextes React
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires et configurations
├── services/             # Services externes
├── types/                # Types TypeScript
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

### Pour les Administrateurs
- 📊 Tableau de bord complet
- 🍽️ Gestion des plats et menus
- 📋 Gestion des commandes
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
```

## 🎨 Thème et Design

L'application utilise une palette de couleurs inspirée de la Thaïlande :

- **Orange Thaï** (`#FF7B54`) - Couleur principale
- **Vert Thaï** (`#2D5016`) - Couleur secondaire
- **Or Thaï** (`#FFD700`) - Accents
- **Rouge Thaï** (`#DC2626`) - Alertes
- **Crème Thaï** (`#FEF7E0`) - Arrière-plans

## 🔐 Authentification

Le système d'authentification combine :
- **Firebase Auth** : Gestion des utilisateurs
- **Supabase** : Base de données et profils
- **Middleware Next.js** : Protection des routes

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
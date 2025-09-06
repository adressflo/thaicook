# Analyse Approfondie du Projet : APPChanthana

Ce document synthétise l'analyse complète du projet APPChanthana, de son code source, de son architecture et de sa base de données. Il sert de mémoire de référence pour les assistants IA.

---

## 1. Vue d'ensemble du Projet

**APPChanthana** est une application web complète de type service traiteur / restaurant, conçue pour gérer les commandes à la carte, les événements traiteur, les clients, et l'inventaire. L'application dispose d'une interface client et d'un tableau de bord d'administration riche en fonctionnalités pour la gestion interne.

---

## 2. Stack Technologique

| Catégorie | Technologie | Version/Détails |
|---|---|---|
| **Framework Frontend** | Next.js | ~14.2.0 (probablement v15 avec React 19) |
| **Librairie UI** | React | ~18.3.0 |
| **Styling** | Tailwind CSS | v4 (inféré par les dépendances) |
| **Composants UI** | shadcn/ui | Utilise Radix UI et `class-variance-authority` |
| **Icônes** | Lucide React | `lucide-react` |
| **Backend-as-a-Service**| Supabase | PostgreSQL, Auth, Storage, Realtime |
| **Authentification** | Supabase Auth & Firebase Auth | Système hybride ou en migration |
| **Gestion d'état (Serveur)** | TanStack Query | Pour le fetching, caching, et la mise à jour des données |
| **Gestion d'état (Client)** | React Context | Pour les états globaux (ex: Auth, Panier) |
| **Formulaires** | React Hook Form & Zod | Gestion des formulaires et validation de schémas |
| **Manipulation de dates**| date-fns | Bibliothèque moderne pour les dates |
| **Tests E2E** | Playwright | Pour les tests d'intégration de bout en bout |
| **Automatisation** | n8n | Client `n8n-client` intégré |

---

## 3. Architecture Générale

L'application suit une architecture moderne et robuste basée sur Next.js App Router.

- **Frontend (Next.js App Router)** : La structure du code est orientée serveur par défaut (React Server Components). Les composants interactifs sont explicitement marqués avec `"use client"`.
- **Backend (Supabase)** : Supabase sert de backend principal. La logique métier est implémentée à la fois dans le code frontend (via le client Supabase JS) et directement dans la base de données via des **fonctions PostgreSQL** et des **triggers**.
- **Base de données (PostgreSQL)** : Le schéma est bien structuré et relationnel. Il couvre tous les aspects de l'activité : plats, clients, commandes, événements, ingrédients, et un système de notification complet.
- **Authentification** : Un système hybride semble en place. `client_db.firebase_uid` suggère une intégration Firebase, tandis que l'utilisation de `@supabase/auth-helpers-nextjs` et des fonctions `auth.uid()` dans la DB pointe vers Supabase Auth. **Clarification requise sur la stratégie à long terme.**

---

## 4. Design et UI/UX

- **Système de Design** : L'utilisation de **shadcn/ui** implique une approche de design system composable et personnalisable. Les composants ne sont pas importés d'une librairie mais générés dans le projet, permettant une appropriation complète.
- **Philosophie** : L'accent est mis sur l'accessibilité et la modularité (principes de Radix UI).
- **Styling** : **Tailwind CSS** est utilisé pour un styling utilitaire rapide et cohérent.

---

## 5. Base de Données & Sécurité

- **Schéma** : Très complet, avec des tables pour `plats_db`, `client_db`, `commande_db`, `evenements_db`, `ingredients_db`, et un système de notifications (`notification_templates`, `notification_queue`, etc.).
- **Sécurité (RLS)** : La sécurité au niveau des lignes (Row-Level Security) est une pierre angulaire de l'application.
  - **Bonne pratique** : La RLS est activée sur la majorité des tables (`plats_db`, `client_db`, etc.).
  - **⚠️ ALERTE SÉCURITÉ ⚠️** : La RLS est **DÉSACTIVÉE** sur les tables `public.details_commande_db` et `public.evenements_db`, bien que des politiques de sécurité existent pour elles. **Ceci est une faille de sécurité critique à corriger immédiatement.**

---

## 6. Conventions et Bonnes Pratiques

- **Structure de projet** : Standard pour une application Next.js App Router (`app/`, `components/`, `lib/`, etc.).
- **Logique métier** : Partagée entre le frontend et la base de données (fonctions et triggers PostgreSQL), ce qui est une pratique courante et performante avec Supabase.
- **Validation** : L'utilisation de **Zod** avec **React Hook Form** garantit une validation de données robuste et typée de bout en bout.
- **Tests** : La présence de **Playwright** indique une volonté de maintenir une haute qualité via des tests end-to-end.

---

## 7. Recommandations Prioritaires

1.  **Corriger la faille de sécurité RLS** : Activer immédiatement la RLS sur les tables `details_commande_db` et `evenements_db` avec la commande SQL : `ALTER TABLE public.details_commande_db ENABLE ROW LEVEL SECURITY;` et `ALTER TABLE public.evenements_db ENABLE ROW LEVEL SECURITY;`.
2.  **Clarifier la stratégie d'authentification** : Déterminer si Firebase Auth doit être déprécié au profit de Supabase Auth pour simplifier l'architecture.
3.  **Réviser les fonctions PostgreSQL** : De nombreuses fonctions ont un `search_path` mutable, ce qui est un risque de sécurité mineur. Il est recommandé de le définir explicitement (`SET search_path = '', 'public';`).

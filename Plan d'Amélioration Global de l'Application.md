### 🚨 Actions Prioritaires (Q3 2025) - URGENT

- [ ] **Sécurité : Isoler les variables d'environnement**
    - [ ] Retirer le fichier `.env.local` du suivi Git.
    - [ ] Ajouter `.env.local` au fichier `.gitignore`.
    - [ ] Documenter la procédure de configuration des variables d'environnement pour les nouveaux développeurs.
- [ ] **Performance : Optimiser les assets SVG**
    - [ ] Compresser les fichiers SVG du dossier `/public` pour réduire leur taille de manière significative (objectif : &lt; 1MB).
- [ ] **Refactoring : Décomposer les composants Admin**
    - [ ] Diviser le composant principal de la page de gestion des commandes (`/admin/commandes`) en sous-composants plus petits et spécialisés.
- [ ] **Base de Données : Réactiver et configurer les politiques RLS**
    - [ ] Activer la sécurité au niveau des lignes (RLS) sur les tables Supabase critiques (`client_db`, `commande_db`, etc.).
    - [ ] Définir des politiques RLS pour garantir que les utilisateurs ne puissent accéder qu'à leurs propres données.

---

### 🎯 Plan d'Amélioration Stratégique : ChanthanaThaiCook
Notre feuille de route pour faire évoluer l'expérience ChanthanaThaiCook. Ce document est notre espace de collaboration pour construire l'avenir de l'application.

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

**👤 H. Page Profil (/profil)**
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
- [ ] Pagination par date : Remplacer la pagination par défaut par une navigation par jour (ex: "Aujourd'hui", "Hier", ou un sélecteur de date).
- [ ] Notification de retard via n8n : Ajouter un bouton permettant à l'administrateur d'envoyer une notification de retard prédéfinie au client (ex: "Votre commande aura 5 minutes de retard").
- [ ] Automatisation des notifications de statut (n8n) : Déclencher automatiquement des notifications SMS/WhatsApp lorsque le statut d'une commande passe à "Prête à récupérer".
- [ ] Impression automatique des tickets de caisse (n8n) : Mettre en place un workflow n8n pour imprimer les nouveaux tickets de caisse dès qu'une commande est "Confirmée".
- [ ] Demande d'avis automatisée (n8n) : Envoyer automatiquement une demande d'avis par e-mail ou SMS une heure après qu'une commande soit "Récupérée".
- [ ] "Mettre en avant" une commande : Ajouter un bouton pour épingler une commande en haut de la liste journalière.
- [ ] Offrir un plat : Ajouter une fonctionnalité pour marquer un plat comme "offert" (prix à 0€) dans une commande existante.

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

### 📚 IV. Autres Pages
*Cette section sera complétée au fur et à mesure de notre analyse.*
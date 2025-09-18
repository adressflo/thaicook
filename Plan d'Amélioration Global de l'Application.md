# Plan d'Amélioration Global de l'Application

Ce document centralise toutes les tâches d'amélioration pour l'application ChanthanaThaiCook.

## I. Améliorations Générales et Transversales

### Transformer l'application en Progressive Web App (PWA)
- [ ] Rendre l'application installable sur l'écran d'accueil des mobiles
- [ ] Mettre en place un fonctionnement hors-ligne de base (consultation du menu)
- [ ] Préparer le terrain pour les notifications push (pour les statuts de commande, etc.)

### Mettre en place une stratégie de tests automatisés
- [ ] Définir et écrire des tests pour les parcours utilisateurs critiques (commande, authentification, etc.) afin de garantir la stabilité de l'application et d'éviter les régressions

### Intégration n8n
- [ ] Planifier et intégrer les webhooks n8n pour les notifications de commande (SMS, WhatsApp, etc.)

### Optimisation des performances globales
- [ ] Analyser l'ensemble de l'application pour identifier les points à améliorer en termes de vitesse de chargement et de réactivité

### Améliorer l'accessibilité
- [ ] S'assurer que l'ensemble de l'application respecte les bonnes pratiques d'accessibilité

### Simplification de la navigation
- [ ] Supprimer la page /suivi qui est redondante avec la page /historique
- [ ] Mettre à jour le lien "Suivi & historique" sur la page d'accueil pour qu'il pointe directement vers /historique

## II. Améliorations par Page

### A. Page d'Accueil (/)

#### Améliorer le pied de page
- [ ] Ajouter les jours et horaires d'ouverture
- [ ] Intégrer des icônes cliquables vers les réseaux sociaux (Facebook, Instagram, etc.)

#### Ajouter un sélecteur de langue
- [ ] Permettre aux utilisateurs de changer la langue du site

### B. Page Commander (/commander)

#### Améliorer l'affichage de la quantité dans le panier
- [ ] Remplacer le texte "X dans le panier" par une icône de panier (ShoppingCart) avec un badge indiquant la quantité

#### Ajouter des badges spéciaux aux plats
- [ ] Mettre en avant les plats végétariens, épicés ou populaires avec des icônes ou des badges visuels

#### Optimiser l'expérience mobile
- [ ] Simplifier la navigation entre les étapes (choix du jour, sélection des plats, panier) avec une interface adaptée aux mobiles (par exemple, un menu de navigation en bas de l'écran)

### C. Page Panier (/panier)

#### Gestion des Articles
- [ ] **Sauvegarde du Panier** : Si un utilisateur non connecté remplit son panier, lui proposer de le sauvegarder en créant un compte pour ne pas perdre sa sélection

#### Expérience Utilisateur
- [ ] **Confirmation Visuelle** : Après validation de la commande, afficher une page de confirmation plus visuelle et engageante, avec un récapitulatif de la commande et un message de remerciement

#### Améliorer l'affichage du message de confirmation
- [ ] Modifier le fond du message (toast) de confirmation de commande pour qu'il soit blanc, afin d'améliorer la lisibilité

#### Gestion de l'heure de retrait
- [ ] Ajouter une note précisant que l'heure de retrait est indicative et peut être ajustée
- [ ] Côté admin, permettre de proposer une nouvelle heure de retrait
- [ ] Mettre en place une notification (via n8n) pour informer le client de la nouvelle proposition d'heure

### D. Page Historique (/historique)

#### Refonte de la Page

##### Commandes Récentes
- [ ] Limiter l'affichage aux 3 à 5 dernières commandes terminées
- [ ] Ajouter un bouton icône "Facture" pour les commandes avec le statut "Récupérée"

##### Événements Récents
- [ ] Limiter l'affichage aux 3 derniers événements terminés
- [ ] Ajouter un bouton icône "Devis" pour les événements
- [ ] Ajouter un bouton icône "Facture" pour les événements facturés

##### Créer une page dédiée
- [ ] Mettre en place un bouton "Voir tout l'historique" qui redirige vers une nouvelle page /historique/complet

#### Nouvelle Page "Historique Complet" (/historique/complet)

##### Filtres Avancés
- [ ] Intégrer un filtre de recherche par nom de plat, date, ou statut pour les commandes et événements

##### Vue Calendrier
- [ ] Proposer une vue calendrier pour naviguer facilement dans les commandes et événements passés

##### Actions sur les Commandes
- [ ] **Export de Facture** : Permettre de télécharger la facture en PDF pour chaque commande "Récupérée"
- [ ] **"Commander à Nouveau"** : Ajouter un bouton pour recommander facilement une commande passée

##### Actions sur les Événements
- [ ] **Export de Devis/Facture** : Permettre de télécharger le devis et/ou la facture en PDF pour chaque événement

### E. Page Suivi de Commande (/suivi-commande/[id])

#### Informations Pratiques
- [ ] **Carte de localisation** : Intégrer une petite carte (Google Maps ou autre) sous le bouton "Voir sur la carte" pour une visualisation rapide
- [ ] **Contact Rapide** : Ajouter des boutons d'action pour appeler directement ou envoyer un SMS en un clic

#### Expérience Post-Commande
- [ ] **Laisser un Avis** : Une fois la commande marquée comme "Récupérée", afficher un petit formulaire simple pour que le client puisse laisser un avis
- [ ] **Bouton Facture** : Ajouter un bouton icône "Facture" pour les commandes avec le statut "Récupérée"

#### Notifications et Alertes
- [ ] **Notifications Push (via PWA et n8n)** : Envoyer des notifications push pour chaque changement de statut de la commande

### F. Page Modifier Commande (/modifier-commande/[id])

#### Interaction Utilisateur
- [ ] Mettre en place une boîte de dialogue de confirmation avant de sauvegarder les modifications, qui récapitule les changements et la différence de prix
- [ ] (Côté Admin) Garder une trace des modifications apportées à une commande (qui a modifié, quand, et quels changements ont été faits)

#### Notifications et Communication
- [ ] (Intégration n8n) Envoyer une notification à l'administrateur lorsqu'un client modifie sa commande
- [ ] (Intégration n8n) Envoyer une confirmation détaillée au client après la sauvegarde des modifications

#### Gestion de l'heure de retrait (rappel)
- [ ] Ajouter une note précisant que l'heure de retrait est indicative et peut être ajustée
- [ ] Côté admin, permettre de proposer une nouvelle heure de retrait
- [ ] Mettre en place une notification (via n8n) pour informer le client de la nouvelle proposition d'heure

### G. Page Suivi d'Événement (/suivi-evenement/[id])

#### Chronologie de l'Événement
- [ ] **Suivi Visuel** : Ajouter une chronologie visuelle des étapes clés de l'organisation ("Demande reçue", "Devis envoyé", "Confirmé", etc.)

#### Gestion des Documents
- [ ] **Accès Centralisé** : Créer une section où le client peut télécharger le devis et la facture finale en PDF

#### Communication et Actions
- [ ] **Contact Rapide Amélioré** : Ajouter un bouton "Poser une question" qui ouvre une fenêtre de messagerie pré-remplie
- [ ] **Validation du Devis** : Mettre en place un bouton "Accepter le devis" qui notifie l'administrateur via n8n

#### Intégration n8n pour les Rappels
- [ ] Configurer n8n pour envoyer des rappels automatiques au client avant l'événement et un message de remerciement après

### H. Page Profil (/profil)

#### Intégration n8n pour la Communication
- [ ] **Messages d'Anniversaire** : Envoyer automatiquement un message de vœux le jour de l'anniversaire du client
- [ ] **Actualités et Offres** : Mettre en place un système d'envoi d'e-mails pour les actualités et les offres spéciales

#### Gestion du Compte

##### Sécurité
- [ ] **Modification d'E-mail Sécurisée** : Exiger le mot de passe actuel avant de permettre la modification de l'adresse e-mail
- [ ] **Suppression de Compte** : Ajouter une fonctionnalité de suppression de compte

##### Améliorations de l'Interface de Connexion
- [ ] **Mot de Passe Oublié** : Ajouter une fonctionnalité de réinitialisation du mot de passe
- [ ] **Design des Boutons** : Inverser les boutons "Se connecter" et "Créer un compte" et revoir le design des icônes

## III. Autres Pages

Cette section sera complétée au fur et à mesure de notre analyse.

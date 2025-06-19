# Nouvelle fonctionnalité : Modifier une commande

## 📋 Résumé des modifications

J'ai créé une nouvelle page permettant aux clients de modifier leurs commandes existantes. Cette fonctionnalité s'inspire des pages `Commander` et `SuiviCommande` existantes.

## 🔧 Fichiers modifiés/créés

### Nouveaux fichiers :
- `src/pages/ModifierCommande.tsx` - Page principale de modification de commande

### Fichiers modifiés :
- `src/App.tsx` - Ajout de la route `/modifier-commande/:id`
- `src/pages/SuiviCommande.tsx` - Ajout du bouton "Modifier ma commande"
- `src/hooks/useSupabaseData.ts` - Ajout des hooks `useDeleteDetail` et `useCreateDetail`
- `src/types/app.ts` - Ajout du type `CommandeWithDetails`

## 🚀 Fonctionnalités implémentées

### 1. **Gestion des dates et plats disponibles**
- Changement de jour → mise à jour automatique des plats disponibles
- Changement de date → recalcul des dates autorisées selon le jour sélectionné
- Système identique à la page Commander pour la cohérence UX

### 2. **Modification des plats existants**
- Modification des quantités (+/- ou suppression)
- Visualisation claire des plats actuels avec prix
- Marquage des modifications (pas de suppression immédiate)

### 3. **Ajout de nouveaux plats**
- Recherche et sélection parmi les plats disponibles pour le nouveau jour
- Gestion séparée des nouveaux plats ajoutés
- Interface identique à la page Commander

### 4. **Récapitulatif intelligent**
- Affichage des modifications : plats supprimés, quantités modifiées, nouveaux plats
- Calcul du nouveau total en temps réel
- Validation avant sauvegarde

### 5. **Restrictions de sécurité**
- Seul le propriétaire de la commande peut la modifier
- Modification autorisée uniquement pour les statuts "En attente" et "Confirmée"
- Remise à "En attente de confirmation" après modification

## 🔄 Logique de modification

1. **Chargement** : Récupération des données existantes de la commande
2. **Modification** : Interface intuitive pour changer date/heure et plats
3. **Sauvegarde** :
   - Mise à jour des infos générales (date, heure, demandes spéciales)
   - Suppression des détails marqués pour suppression
   - Ajout des nouveaux plats sélectionnés
   - Invalidation du cache et redirection

## 🎯 Points techniques importants

### Gestion des états
- `details` : Plats existants avec marquage des modifications
- `nouveauxPlats` : Nouveaux plats à ajouter
- Séparation claire entre modifications et ajouts

### Hooks utilisés
- `useCommandeById` : Récupération de la commande
- `useUpdateCommande` : Mise à jour des infos générales
- `useDeleteDetail` : Suppression de détails spécifiques
- `useCreateDetail` : Ajout de nouveaux détails

### UX/UI
- Design cohérent avec l'existant (couleurs thai, icônes)
- Messages d'alerte clairs selon le contexte
- Validation des données avant sauvegarde
- Feedback utilisateur à chaque étape

## 🔗 Navigation

- **Accès** : Bouton "Modifier ma commande" dans SuiviCommande
- **Retour** : Boutons pour revenir au suivi ou annuler
- **Redirection** : Vers SuiviCommande après sauvegarde réussie

Cette implémentation respecte l'architecture existante et offre une expérience utilisateur fluide pour la modification des commandes.

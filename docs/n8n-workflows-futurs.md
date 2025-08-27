# Workflows n8n Futurs - APPCHANTHANA

## 📋 Contexte Restaurant
- **Type**: Restaurant thaï, emporter uniquement (pas de livraison)
- **Platform**: Next.js + Supabase + Firebase Auth
- **ID Client banni**: `6UGZPvuXOCWrXyXsvlcoujJNFb42`

---

## 🔄 Workflows de Communication Client

### 1. **Confirmation de Commande via WhatsApp**
**Trigger**: Admin confirme une commande (statut passe à "Confirmée")
**Actions**:
- Envoyer message WhatsApp au client
- Template: "Bonjour {prenom}, votre commande #{numero} est confirmée ! Retrait prévu le {date} à {heure}. Merci !"

### 2. **Notification Commande Prête**
**Trigger**: Statut passe à "Prête à récupérer"
**Actions**:
- SMS + WhatsApp au client
- Template: "Votre commande #{numero} est prête ! Vous pouvez venir la récupérer au restaurant. À bientôt !"

### 2.5. **Notification Commande Annulée** 🆕
**Trigger**: Statut passe à "Annulée" (avec confirmation admin)
**Actions**:
- WhatsApp + SMS au client
- Email de confirmation d'annulation
- Notification équipe pour libérer les ressources
**Templates**:
- Client: "Bonjour {prenom}, nous sommes désolés mais votre commande #{numero} a été annulée. Nous vous contacterons pour vous expliquer. Nos excuses."
- Équipe: "⚠️ Commande #{numero} annulée - Libérer les ingrédients et réorganiser la production"

### 3. **Rappel de Retrait**
**Trigger**: Commande prête depuis 30 minutes
**Actions**:
- Rappel automatique par WhatsApp
- Template: "N'oubliez pas de récupérer votre commande #{numero} au restaurant 🍜"

---

## 📱 Marketing & Communication

### 4. **Publication Facebook Automatique**
**Trigger**: Nouvelle commande validée / plat populaire
**Actions**:
- Créer post Facebook avec photo du plat
- Template: "Commande du jour : {nom_plat} ! 😋 Venez découvrir nos spécialités thaï authentiques"
- Hashtags automatiques : #ThaiFood #ChanthanaThaiCook #Authentique

### 5. **Stories Instagram**
**Trigger**: Commande avec photo / plat du jour
**Actions**:
- Poster story Instagram
- Ajouter géolocalisation du restaurant
- Template: "En préparation... {nom_plat} 👨‍🍳"

### 6. **Newsletter Hebdomadaire**
**Trigger**: Dimanche 18h
**Actions**:
- Compile les nouveaux plats de la semaine
- Statistiques des plats populaires
- Envoi email aux clients abonnés

---

## 🏪 Gestion Restaurant

### 7. **Notification Équipe - Nouvelle Commande**
**Trigger**: Nouvelle commande reçue
**Actions**:
- Message WhatsApp groupe équipe
- Template: "🔔 Nouvelle commande #{numero} - {nb_plats} plats - Retrait : {heure}"

### 8. **Alerte Stock Faible**
**Trigger**: Plat marqué comme "bientôt épuisé"
**Actions**:
- Message WhatsApp chef/gérant
- Template: "⚠️ Stock faible : {nom_plat} - Prévoir réapprovisionnement"

### 9. **Rapport de Fin de Journée**
**Trigger**: 21h30 chaque jour
**Actions**:
- Compiler les statistiques du jour
- Envoyer WhatsApp au gérant
- Template: "📊 Bilan jour : {nb_commandes} commandes, {ca}€ CA, plat top : {plat_populaire}"

---

## 🎯 Fidélisation Client

### 10. **Message Anniversaire**
**Trigger**: Date de naissance client
**Actions**:
- WhatsApp personnalisé
- Template: "🎂 Joyeux anniversaire {prenom} ! Profitez de 10% sur votre prochaine commande avec le code ANNIV10"

### 11. **Suivi Post-Commande**
**Trigger**: 24h après récupération
**Actions**:
- Message WhatsApp de satisfaction
- Template: "Merci pour votre commande {prenom} ! Nous espérons que vous avez apprécié. Note sur 5 ⭐ ?"

### 12. **Client Inactif**
**Trigger**: Pas de commande depuis 30 jours
**Actions**:
- Message WhatsApp de retour
- Template: "Cela fait longtemps {prenom} ! Nouvelle carte disponible, venez découvrir nos nouveautés 🌶️"

---

## ⚠️ Alertes & Sécurité

### 13. **Détection Client Banni**
**Trigger**: Commande avec ID `6UGZPvuXOCWrXyXsvlcoujJNFb42`
**Actions**:
- Alerte immédiate admin
- Bloquer la commande automatiquement
- Notification sécurité

### 14. **Commande Anormale**
**Trigger**: Commande > 100€ ou > 10 plats
**Actions**:
- Validation manuelle requise
- WhatsApp admin pour confirmation
- Template: "🚨 Commande importante #{numero} - {montant}€ - Validation requise"

---

## 📊 Analytics & Reporting

### 15. **Rapport Hebdomadaire Détaillé**
**Trigger**: Lundi 9h
**Actions**:
- Analyser les tendances semaine
- Top 5 plats, heures de pointe, CA
- Email gérant avec graphiques

### 16. **Alerte Performance**
**Trigger**: Baisse CA > 20% vs semaine précédente
**Actions**:
- Alerte WhatsApp gérant
- Analyse automatique des causes
- Suggestions d'actions marketing

---

## 🛠️ Configuration Technique

### Endpoints n8n Requis:
- `/webhook/commande-confirmee`
- `/webhook/commande-prete`
- `/webhook/commande-annulee` 🆕
- `/webhook/nouvelle-commande`
- `/webhook/client-banni`
- `/webhook/publication-facebook`
- `/webhook/rapport-journalier`

### Intégrations Nécessaires:
- **WhatsApp Business API**
- **Facebook Graph API**
- **Instagram Basic Display API**
- **SMS Provider** (Twilio/Orange/etc.)
- **Supabase Webhooks**

### Variables d'Environnement:
- `WHATSAPP_BUSINESS_TOKEN`
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `SMS_API_KEY`
- `RESTAURANT_PHONE`
- `ADMIN_PHONE`

---

## 📝 Notes d'Implémentation

1. **Priorité 1**: Workflows 1, 2, 2.5, 7, 13 (communication client + sécurité)
   - **Workflow 2.5** (Annulation) est critique pour la satisfaction client
2. **Priorité 2**: Workflows 4, 8, 14 (marketing + gestion)  
3. **Priorité 3**: Workflows de fidélisation et analytics

4. **Tests Requis**: Mode sandbox pour tous les workflows
5. **Conformité**: RGPD pour données client, opt-out disponible
6. **Monitoring**: Logs détaillés, alertes échec envoi
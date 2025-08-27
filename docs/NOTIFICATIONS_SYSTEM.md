# Système de Notifications ChanthanaThaiCook

Un système de notifications complet et professionnel pour l'application Next.js.

## 🎯 Vue d'ensemble

Le système de notifications offre une expérience utilisateur moderne avec :
- ✅ Notifications en temps réel
- ✅ Catégorisation intelligente  
- ✅ Interface intuitive avec badge dynamique
- ✅ Page dédiée avec filtres et recherche
- ✅ Architecture évolutive pour Supabase
- ✅ Types TypeScript complets

## 🏗️ Architecture

### Composants principaux

```
contexts/NotificationContext.tsx    # État global centralisé
components/FloatingUserIcon.tsx     # Badge et dropdown notifications
app/notifications/page.tsx          # Page complète des notifications
hooks/useSupabaseNotifications.ts   # Intégration Supabase (future)
sql/notifications_table.sql         # Schema Supabase (future)
```

### Types de notifications

| Type | Catégorie | Usage | Couleur |
|------|-----------|-------|---------|
| `success` | order, event | Confirmations, succès | Vert |
| `info` | system, promotion | Informations, nouveautés | Bleu |
| `warning` | cart, event | Alertes, rappels | Orange |
| `error` | system | Erreurs, problèmes | Rouge |

### Catégories

- **`order`** : Commandes (confirmée, prête, livrée)
- **`event`** : Événements (confirmation, rappel)  
- **`cart`** : Panier (articles en attente)
- **`promotion`** : Promotions et offres
- **`system`** : Messages système

## 🚀 Utilisation

### Context et Hooks

```tsx
// Dans un composant
import { useNotifications, useNotificationActions } from '@/contexts/NotificationContext';

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { notifyOrderConfirmed } = useNotificationActions();
  
  // Marquer comme lu
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  // Créer une notification
  const handleOrderSuccess = (orderId: string) => {
    notifyOrderConfirmed(orderId);
  };
};
```

### Actions disponibles

```tsx
const {
  addNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAll
} = useNotifications();

const {
  notifyOrderConfirmed,
  notifyOrderReady,
  notifyEventConfirmed,
  notifyPromotion,
  notifySystem
} = useNotificationActions();
```

### Création manuelle de notifications

```tsx
addNotification({
  type: 'success',
  title: 'Commande confirmée',
  message: 'Votre commande #CMD-123 a été confirmée',
  category: 'order',
  actionUrl: '/suivi',
  read: false
});
```

## 📱 Interface utilisateur

### FloatingUserIcon
- Badge avec compteur dynamique (taille optimisée)
- Dropdown avec 5 dernières notifications
- Lien vers page complète avec compteur "+N"
- Clics directs vers actions liées

### Page /notifications
- **Filtres** : par catégorie, statut (lu/non lu)
- **Recherche** : dans titre et message
- **Actions** : marquer lu/non lu, supprimer
- **Stats** : compteurs non lues et total
- **Responsive** : mobile et desktop

## 🔄 Intégration Supabase (Future)

### Setup Database
```sql
-- Exécuter le script SQL fourni
\i sql/notifications_table.sql
```

### Configuration
```tsx
// hooks/useSupabaseNotifications.ts sera prêt
const { triggerOrderNotifications } = useSupabaseNotifications();

// Déclencher une notification
await triggerOrderNotifications('CMD-123', 'confirmed');
```

### Real-time
- Subscriptions automatiques par utilisateur
- Notifications instantanées cross-device
- Synchronisation état lu/non lu

## 🎨 Personnalisation

### Couleurs du thème Thai
- **Primary** : `thai-orange` (#ff7b54)
- **Secondary** : `thai-green` (#2d5016)  
- **Accent** : `thai-gold` (#ffd700)
- **Background** : `thai-cream` (#fef7e0)

### Badge de notification
```tsx
// Taille actuelle optimisée
className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-red-500 text-white text-sm font-bold rounded-full"
```

### Animations
- Fade in/out fluides
- Hover effects subtils
- Transitions cohérentes (200-300ms)

## 📊 Métriques et monitoring

### États trackés
- Nombre total de notifications
- Notifications non lues par utilisateur
- Taux d'engagement (clics sur notifications)
- Catégories les plus utilisées

### Performance
- Lazy loading des notifications anciennes
- Cache intelligent (100 notifications max par user)
- Optimistic updates pour la réactivité

## 🔧 Maintenance

### Nettoyage automatique
```sql
-- Garder les 100 plus récentes par utilisateur
SELECT cleanup_old_notifications();
```

### Debugging
```tsx
// Activer les logs en développement
const isDev = process.env.NODE_ENV === 'development';
if (isDev) console.log('Notification added:', notification);
```

### Tests
- Tests unitaires du Context
- Tests d'intégration UI  
- Tests E2E du parcours notifications

## 📚 Best Practices

### Timing des notifications
- **Immediate** : Confirmations critiques
- **Delayed (1min)** : Notifications secondaires
- **Batched** : Digest périodiques

### Message quality  
- Titres concis (< 50 chars)
- Messages clairs et actionnables
- URL d'action pertinentes

### UX Guidelines
- Maximum 1 notification par action
- Regroupement intelligent des similaires
- Respect des préférences utilisateur

## 🚦 Status

- ✅ **Phase 1** : Core system implémenté
- ⏳ **Phase 2** : Intégration Supabase 
- ⏳ **Phase 3** : Analytics et optimisation
- ⏳ **Phase 4** : Push notifications mobiles

---

**Système créé avec ❤️ pour ChanthanaThaiCook**  
*Notifications parfaites pour une expérience culinaire exceptionnelle* 🍜
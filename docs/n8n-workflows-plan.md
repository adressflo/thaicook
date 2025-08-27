# n8n Workflows Plan - ChanthanaThaiCook Restaurant

## 📋 Informations Importantes à Retenir

### 🍽️ **Contexte Restaurant**
- **Type de service**: Emporter uniquement (pas de livraison)
- **Plateforme**: Application Next.js avec Supabase + Firebase Auth
- **Actions rapides admin**: Implémentées dans `app/admin/commandes/page.tsx`

### 🔧 **Architecture Technique**
- **Base de données**: Supabase (tables: commande_db, client_db, plats_db, details_commande_db)
- **Auth**: Firebase Auth → Profils Supabase
- **API**: Hooks React Query pour mutations
- **Types**: TypeScript strict avec interfaces CommandeUI, CommandeUpdate

---

## 🚀 Workflows n8n Prévus

### **1. Notification Nouvelles Commandes** 
**Trigger**: Webhook Supabase (INSERT sur commande_db)
**Actions**:
- ✉️ Email admin avec détails commande
- 📱 SMS/Discord notification équipe cuisine
- 📊 Mise à jour statistiques temps réel

**Configuration n8n**:
```json
{
  "webhook": {
    "method": "POST",
    "authentication": "headerAuth", 
    "path": "/commande/nouvelle"
  },
  "nodes": [
    "Webhook → Parse Data → Email → Discord → Respond"
  ]
}
```

### **2. Suivi Automatique Statuts Commandes**
**Trigger**: Webhook changement statut (actions rapides admin)
**Actions**:
- 📧 Email client avec mise à jour statut
- ⏰ Rappels automatiques selon délais
- 📱 Notification "Commande prête" pour retrait

**Workflow**:
```json
{
  "trigger": "webhook /commande/statut-change",
  "conditions": [
    "if statut === 'Prête à récupérer' → notify client",
    "if statut === 'En préparation' → set timer reminder"
  ]
}
```

### **3. Gestion Automatique Inventaire**
**Trigger**: Cron job quotidien
**Actions**:
- 📊 Analyse ventes par plat
- 📦 Suggestions réapprovisionnement
- ⚠️ Alertes stock faible
- 📋 Export liste courses automatique

### **4. Fidélisation Client Automatisée**
**Trigger**: Cron hebdomadaire + événements client
**Actions**:
- 🎂 Email anniversaire avec offre spéciale
- 🏆 Programme fidélité (5e commande = réduction)
- 📧 Newsletter promotions selon historique
- ⭐ Demande d'avis après commande récupérée

### **5. Reporting & Analytics Automatisés**
**Trigger**: Cron quotidien/hebdomadaire
**Actions**:
- 📊 Rapport ventes quotidien (Discord admin)
- 📈 Analyse tendances hebdomadaire (Email)
- 💰 Tableau de bord financier mensuel
- 📋 Export données comptabilité

### **6. Gestion Événements & Traiteur**
**Trigger**: Webhook nouvelle demande événement
**Actions**:
- 📧 Confirmation réception demande
- 📋 Création devis automatique selon paramètres
- 🗓️ Planification dans calendrier
- 📱 Rappel préparation J-3

---

## 🔗 Intégrations Techniques n8n

### **Webhooks Supabase**
```sql
-- Trigger nouvelle commande
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://your-n8n-instance.com/webhook/commande/nouvelle',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := row_to_json(NEW)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger changement statut
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.statut_commande != NEW.statut_commande THEN
    PERFORM net.http_post(
      url := 'https://your-n8n-instance.com/webhook/commande/statut-change',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'order_id', NEW.idcommande,
        'old_status', OLD.statut_commande,
        'new_status', NEW.statut_commande,
        'client_email', NEW.client_r
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **Nodes n8n Recommandés**
- **Webhook**: Réception événements Supabase
- **HTTP Request**: API calls vers application Next.js
- **Email (Gmail/SMTP)**: Communications clients
- **Discord**: Notifications équipe interne
- **Supabase**: Lecture/écriture base données
- **Schedule Trigger**: Tâches récurrentes
- **Function**: Logique métier complexe
- **IF**: Logique conditionnelle
- **Set/Edit Fields**: Transformation données

### **Configuration Authentification**
```json
{
  "supabase_credentials": {
    "url": "https://your-project.supabase.co",
    "api_key": "your-service-role-key"
  },
  "webhook_auth": {
    "type": "headerAuth",
    "name": "Authorization",
    "value": "Bearer your-webhook-secret"
  }
}
```

---

## 📱 Actions Rapides → n8n Integration

### **Boutons Admin vers Webhooks**
Les actions rapides créées dans `admin/commandes/page.tsx` peuvent déclencher des webhooks n8n :

```typescript
// Dans QuickActionButtons
const handleQuickAction = async (newStatus: string) => {
  setLoadingAction(newStatus);
  try {
    // 1. Mise à jour Supabase (existant)
    await onStatusChange(commande.idcommande, newStatus);
    
    // 2. Notification n8n (nouveau)
    await fetch('/api/webhook/status-change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: commande.idcommande,
        newStatus,
        clientEmail: commande.client?.email,
        timestamp: new Date().toISOString()
      })
    });
  } finally {
    setLoadingAction(null);
  }
};
```

---

## 🎯 Priorités d'Implémentation

### **Phase 1 - Essential** 
1. ✅ Actions rapides admin (FAIT)
2. 🔄 Notifications nouvelles commandes
3. 🔄 Suivi automatique statuts

### **Phase 2 - Croissance**
4. 📊 Reporting automatisé
5. 🏆 Fidélisation client

### **Phase 3 - Avancé**
6. 📦 Gestion inventaire intelligent
7. 🎉 Événements & traiteur automatisés

---

## 📚 Documentation n8n Key Points

### **Webhook Best Practices**
- URLs uniques par instance n8n
- Authentication headerAuth recommandée
- Production webhooks nécessitent activation workflow
- Respond to Webhook node pour réponses personnalisées

### **Performance & Scaling**
- Queue mode pour charge élevée
- Webhook processors dédiés
- Disable production webhooks on main process
- Environment variables pour configuration

### **Error Handling**
- Error Trigger workflows pour notifications échecs
- Retry logic avec exponential backoff
- Logging structured pour debugging
- Status codes appropriés (200, 500, etc.)

---

**📝 Ce document évoluera au fur et à mesure de l'implémentation des workflows n8n.**
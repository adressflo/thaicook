'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Clock,
  Bell,
  Shield,
  Database,
  Mail,
  Smartphone,
  CreditCard,
  Palette,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemParameter {
  id: string;
  category: 'general' | 'notifications' | 'security' | 'payments' | 'appearance' | 'integrations';
  name: string;
  description: string;
  type: 'boolean' | 'text' | 'number' | 'select' | 'textarea';
  value: any;
  options?: string[];
  required?: boolean;
  sensitive?: boolean;
}

export default function AdminParametres() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Configuration système simulée (à connecter avec Supabase)
  const [parameters, setParameters] = useState<SystemParameter[]>([
    // Paramètres généraux
    {
      id: 'restaurant_name',
      category: 'general',
      name: 'Nom du restaurant',
      description: 'Nom affiché sur le site et dans les communications',
      type: 'text',
      value: 'Chanthana Thai Cook',
      required: true
    },
    {
      id: 'restaurant_description',
      category: 'general',
      name: 'Description',
      description: 'Description du restaurant pour les métadonnées',
      type: 'textarea',
      value: 'Restaurant thaïlandais authentique proposant des plats traditionnels'
    },
    {
      id: 'opening_hours',
      category: 'general',
      name: 'Horaires d\'ouverture',
      description: 'Format: Lun-Dim HH:MM-HH:MM',
      type: 'text',
      value: 'Mar-Dim 11:30-14:30, 18:30-22:30'
    },
    {
      id: 'phone_number',
      category: 'general',
      name: 'Téléphone',
      description: 'Numéro de téléphone principal',
      type: 'text',
      value: '+33 1 23 45 67 89'
    },
    {
      id: 'address',
      category: 'general',
      name: 'Adresse',
      description: 'Adresse complète du restaurant',
      type: 'textarea',
      value: '123 Rue de la Paix, 75000 Paris, France'
    },
    {
      id: 'max_orders_per_slot',
      category: 'general',
      name: 'Commandes max par créneau',
      description: 'Nombre maximum de commandes acceptées par créneau horaire',
      type: 'number',
      value: 50
    },
    
    // Notifications
    {
      id: 'email_notifications',
      category: 'notifications',
      name: 'Notifications email activées',
      description: 'Recevoir des notifications par email',
      type: 'boolean',
      value: true
    },
    {
      id: 'sms_notifications',
      category: 'notifications',
      name: 'Notifications SMS activées',
      description: 'Recevoir des notifications par SMS',
      type: 'boolean',
      value: false
    },
    {
      id: 'notification_new_order',
      category: 'notifications',
      name: 'Nouvelles commandes',
      description: 'Notification pour chaque nouvelle commande',
      type: 'boolean',
      value: true
    },
    {
      id: 'notification_low_stock',
      category: 'notifications',
      name: 'Stock faible',
      description: 'Alerte quand le stock est en dessous du minimum',
      type: 'boolean',
      value: true
    },
    {
      id: 'admin_email',
      category: 'notifications',
      name: 'Email administrateur',
      description: 'Adresse email pour recevoir les notifications',
      type: 'text',
      value: 'admin@chanthanathaicook.com',
      sensitive: true
    },

    // Sécurité
    {
      id: 'session_timeout',
      category: 'security',
      name: 'Timeout session (minutes)',
      description: 'Durée avant déconnexion automatique',
      type: 'number',
      value: 30
    },
    {
      id: 'require_phone_verification',
      category: 'security',
      name: 'Vérification téléphone obligatoire',
      description: 'Demander la vérification du numéro de téléphone',
      type: 'boolean',
      value: false
    },
    {
      id: 'max_login_attempts',
      category: 'security',
      name: 'Tentatives de connexion max',
      description: 'Nombre maximum de tentatives avant blocage',
      type: 'number',
      value: 5
    },
    {
      id: 'password_min_length',
      category: 'security',
      name: 'Longueur minimum mot de passe',
      description: 'Nombre minimum de caractères pour les mots de passe',
      type: 'number',
      value: 8
    },

    // Paiements
    {
      id: 'payment_methods',
      category: 'payments',
      name: 'Méthodes de paiement',
      description: 'Méthodes de paiement acceptées',
      type: 'select',
      value: 'cash_card',
      options: ['cash', 'card', 'cash_card', 'online']
    },
    {
      id: 'min_order_amount',
      category: 'payments',
      name: 'Montant minimum commande (€)',
      description: 'Montant minimum pour passer une commande',
      type: 'number',
      value: 15
    },
    {
      id: 'delivery_fee',
      category: 'payments',
      name: 'Frais de livraison (€)',
      description: 'Montant des frais de livraison',
      type: 'number',
      value: 3
    },
    {
      id: 'tax_rate',
      category: 'payments',
      name: 'Taux de TVA (%)',
      description: 'Taux de TVA applicable',
      type: 'number',
      value: 10
    },

    // Apparence
    {
      id: 'theme_color',
      category: 'appearance',
      name: 'Couleur principale',
      description: 'Couleur principale du thème',
      type: 'select',
      value: 'thai-green',
      options: ['thai-green', 'thai-orange', 'thai-gold', 'thai-red']
    },
    {
      id: 'show_nutritional_info',
      category: 'appearance',
      name: 'Afficher infos nutritionnelles',
      description: 'Montrer les informations nutritionnelles sur les plats',
      type: 'boolean',
      value: true
    },
    {
      id: 'show_allergens',
      category: 'appearance',
      name: 'Afficher allergènes',
      description: 'Afficher les informations sur les allergènes',
      type: 'boolean',
      value: true
    },
    {
      id: 'default_language',
      category: 'appearance',
      name: 'Langue par défaut',
      description: 'Langue par défaut du site',
      type: 'select',
      value: 'fr',
      options: ['fr', 'en', 'th']
    },

    // Intégrations
    {
      id: 'google_analytics_id',
      category: 'integrations',
      name: 'Google Analytics ID',
      description: 'Identifiant Google Analytics (GA4)',
      type: 'text',
      value: '',
      sensitive: true
    },
    {
      id: 'facebook_pixel_id',
      category: 'integrations',
      name: 'Facebook Pixel ID',
      description: 'Identifiant Facebook Pixel pour le tracking',
      type: 'text',
      value: '',
      sensitive: true
    },
    {
      id: 'enable_google_reviews',
      category: 'integrations',
      name: 'Avis Google activés',
      description: 'Afficher les avis Google sur le site',
      type: 'boolean',
      value: true
    },
    {
      id: 'whatsapp_number',
      category: 'integrations',
      name: 'Numéro WhatsApp',
      description: 'Numéro pour le contact WhatsApp',
      type: 'text',
      value: '+33123456789'
    }
  ]);

  const categories = [
    { id: 'general', name: 'Général', icon: Settings, color: 'text-blue-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-orange-600' },
    { id: 'security', name: 'Sécurité', icon: Shield, color: 'text-red-600' },
    { id: 'payments', name: 'Paiements', icon: CreditCard, color: 'text-green-600' },
    { id: 'appearance', name: 'Apparence', icon: Palette, color: 'text-purple-600' },
    { id: 'integrations', name: 'Intégrations', icon: Globe, color: 'text-teal-600' }
  ];

  const filteredParameters = useMemo(() => {
    return parameters.filter(param => param.category === activeCategory);
  }, [parameters, activeCategory]);

  const updateParameter = (id: string, value: any) => {
    setParameters(prev => prev.map(param => 
      param.id === id ? { ...param, value } : param
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Ici, on intégrerait avec Supabase pour sauvegarder les paramètres
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Tous les paramètres ont été mis à jour avec succès.",
        variant: "default"
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === activeCategory);
  };

  const renderParameterInput = (param: SystemParameter) => {
    switch (param.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={param.value}
              onCheckedChange={(checked) => updateParameter(param.id, checked)}
            />
            <span className="text-sm text-gray-600">
              {param.value ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={param.value}
            onChange={(e) => updateParameter(param.id, e.target.value)}
            placeholder={param.description}
            className="min-h-[80px]"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={param.value}
            onChange={(e) => updateParameter(param.id, Number(e.target.value))}
            placeholder={param.description}
          />
        );
      
      case 'select':
        return (
          <select
            value={param.value}
            onChange={(e) => updateParameter(param.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-green"
          >
            {param.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        );
      
      default: // text
        return (
          <Input
            type={param.sensitive ? 'password' : 'text'}
            value={param.value}
            onChange={(e) => updateParameter(param.id, e.target.value)}
            placeholder={param.description}
          />
        );
    }
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-thai-green">Paramètres Système</h1>
          <p className="text-sm text-gray-600">Configuration générale de l'application</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Indicateur de changements */}
      {hasChanges && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-orange-800 font-medium">
                Des modifications non sauvegardées sont en attente
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des catégories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green">Catégories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-thai-green text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {currentCategory && <currentCategory.icon className={`w-6 h-6 ${currentCategory.color}`} />}
                <CardTitle className="text-thai-green">
                  {currentCategory?.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredParameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {param.name}
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            Requis
                          </Badge>
                        )}
                        {param.sensitive && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Sensible
                          </Badge>
                        )}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    </div>
                  </div>
                  
                  <div className="max-w-md">
                    {renderParameterInput(param)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informations système */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Base de données</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connectée
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">Supabase PostgreSQL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">Authentification</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">Firebase Auth</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Actif
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">Application</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-medium">Next.js 15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
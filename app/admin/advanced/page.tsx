'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Database, 
  Shield, 
  Zap,
  Code,
  Terminal,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Key,
  Activity,
  FileText,
  Webhook,
  Cog,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  id: string;
  category: 'database' | 'security' | 'performance' | 'api' | 'monitoring' | 'backup';
  name: string;
  description: string;
  value: any;
  type: 'boolean' | 'text' | 'number' | 'json' | 'password';
  sensitive?: boolean;
  advanced?: boolean;
  editable?: boolean;
}

export default function AdminAdvanced() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('database');
  const [showSensitive, setShowSensitive] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  // Configuration système avancée (simulée)
  const [configs, setConfigs] = useState<SystemConfig[]>([
    // Base de données
    {
      id: 'db_connection_string',
      category: 'database',
      name: 'Chaîne de connexion Supabase',
      description: 'URL de connexion à la base de données PostgreSQL',
      value: 'postgresql://postgres:[password]@db.supabase.co:5432/postgres',
      type: 'password',
      sensitive: true,
      editable: false
    },
    {
      id: 'db_max_connections',
      category: 'database',
      name: 'Connexions maximales',
      description: 'Nombre maximum de connexions simultanées à la base',
      value: 100,
      type: 'number',
      advanced: true
    },
    {
      id: 'db_query_timeout',
      category: 'database',
      name: 'Timeout requêtes (ms)',
      description: 'Délai d\'expiration pour les requêtes DB',
      value: 30000,
      type: 'number'
    },
    {
      id: 'db_ssl_mode',
      category: 'database',
      name: 'Mode SSL',
      description: 'Activation du SSL pour les connexions DB',
      value: true,
      type: 'boolean'
    },
    {
      id: 'db_backup_enabled',
      category: 'database',
      name: 'Sauvegardes automatiques',
      description: 'Sauvegardes quotidiennes automatiques',
      value: true,
      type: 'boolean'
    },

    // Sécurité
    {
      id: 'security_jwt_secret',
      category: 'security',
      name: 'JWT Secret',
      description: 'Clé secrète pour la signature des tokens JWT',
      value: 'super-secret-jwt-key-2024-changeme',
      type: 'password',
      sensitive: true
    },
    {
      id: 'security_rate_limit',
      category: 'security',
      name: 'Limite de requêtes/min',
      description: 'Nombre maximum de requêtes par minute par IP',
      value: 100,
      type: 'number'
    },
    {
      id: 'security_admin_ips',
      category: 'security',
      name: 'IPs autorisées admin',
      description: 'Adresses IP autorisées pour l\'accès admin',
      value: '127.0.0.1,192.168.1.0/24',
      type: 'text',
      advanced: true
    },
    {
      id: 'security_2fa_enabled',
      category: 'security',
      name: 'Authentification 2FA',
      description: 'Activation de la double authentification',
      value: false,
      type: 'boolean'
    },
    {
      id: 'security_session_duration',
      category: 'security',
      name: 'Durée session (heures)',
      description: 'Durée de validité des sessions utilisateur',
      value: 24,
      type: 'number'
    },

    // Performance
    {
      id: 'perf_cache_enabled',
      category: 'performance',
      name: 'Cache activé',
      description: 'Activation du système de cache Redis',
      value: true,
      type: 'boolean'
    },
    {
      id: 'perf_cache_ttl',
      category: 'performance',
      name: 'Durée de vie cache (s)',
      description: 'Time-to-live par défaut du cache',
      value: 3600,
      type: 'number'
    },
    {
      id: 'perf_compression',
      category: 'performance',
      name: 'Compression gzip',
      description: 'Compression des réponses HTTP',
      value: true,
      type: 'boolean'
    },
    {
      id: 'perf_cdn_enabled',
      category: 'performance',
      name: 'CDN activé',
      description: 'Utilisation du CDN pour les assets statiques',
      value: true,
      type: 'boolean'
    },
    {
      id: 'perf_worker_count',
      category: 'performance',
      name: 'Nombre de workers',
      description: 'Processus de traitement parallèle',
      value: 4,
      type: 'number',
      advanced: true
    },

    // API
    {
      id: 'api_version',
      category: 'api',
      name: 'Version API',
      description: 'Version actuelle de l\'API REST',
      value: 'v2.1.0',
      type: 'text',
      editable: false
    },
    {
      id: 'api_cors_origins',
      category: 'api',
      name: 'Origines CORS autorisées',
      description: 'Domaines autorisés pour les requêtes CORS',
      value: 'https://chanthanathaicook.com,https://admin.chanthanathaicook.com',
      type: 'text'
    },
    {
      id: 'api_webhook_secret',
      category: 'api',
      name: 'Secret Webhook',
      description: 'Clé secrète pour valider les webhooks',
      value: 'webhook-secret-key-2024',
      type: 'password',
      sensitive: true
    },
    {
      id: 'api_throttling',
      category: 'api',
      name: 'Throttling API',
      description: 'Limitation des requêtes API',
      value: true,
      type: 'boolean'
    },

    // Monitoring
    {
      id: 'monitoring_enabled',
      category: 'monitoring',
      name: 'Monitoring activé',
      description: 'Surveillance des performances système',
      value: true,
      type: 'boolean'
    },
    {
      id: 'monitoring_alerts',
      category: 'monitoring',
      name: 'Alertes par email',
      description: 'Notifications d\'alertes système',
      value: true,
      type: 'boolean'
    },
    {
      id: 'monitoring_metrics_retention',
      category: 'monitoring',
      name: 'Rétention métriques (jours)',
      description: 'Durée de conservation des métriques',
      value: 30,
      type: 'number'
    },
    {
      id: 'monitoring_log_level',
      category: 'monitoring',
      name: 'Niveau de logs',
      description: 'Verbosité des logs système',
      value: 'info',
      type: 'text'
    },

    // Sauvegarde
    {
      id: 'backup_frequency',
      category: 'backup',
      name: 'Fréquence sauvegardes',
      description: 'Intervalle entre les sauvegardes automatiques',
      value: 'daily',
      type: 'text'
    },
    {
      id: 'backup_retention',
      category: 'backup',
      name: 'Rétention sauvegardes (jours)',
      description: 'Durée de conservation des sauvegardes',
      value: 30,
      type: 'number'
    },
    {
      id: 'backup_compression',
      category: 'backup',
      name: 'Compression sauvegardes',
      description: 'Compression des fichiers de sauvegarde',
      value: true,
      type: 'boolean'
    },
    {
      id: 'backup_encryption',
      category: 'backup',
      name: 'Chiffrement sauvegardes',
      description: 'Chiffrement des sauvegardes',
      value: true,
      type: 'boolean'
    }
  ]);

  const categories = [
    { id: 'database', name: 'Base de Données', icon: Database, color: 'text-blue-600' },
    { id: 'security', name: 'Sécurité', icon: Shield, color: 'text-red-600' },
    { id: 'performance', name: 'Performance', icon: Zap, color: 'text-yellow-600' },
    { id: 'api', name: 'API & Webhooks', icon: Code, color: 'text-purple-600' },
    { id: 'monitoring', name: 'Monitoring', icon: Activity, color: 'text-green-600' },
    { id: 'backup', name: 'Sauvegarde', icon: HardDrive, color: 'text-orange-600' }
  ];

  const filteredConfigs = useMemo(() => {
    return configs.filter(config => config.category === activeTab);
  }, [configs, activeTab]);

  const updateConfig = (id: string, value: any) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, value } : config
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Ici, on intégrerait avec l'API backend pour sauvegarder les configs
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      
      toast({
        title: "Configuration sauvegardée",
        description: "Toutes les modifications ont été appliquées avec succès.",
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
      setLoading(false);
    }
  };

  const exportConfig = () => {
    const exportData = configs.reduce((acc, config) => {
      if (!config.sensitive) {
        acc[config.id] = config.value;
      }
      return acc;
    }, {} as Record<string, any>);

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration exportée",
      description: "Le fichier de configuration a été téléchargé.",
      variant: "default"
    });
  };

  const renderConfigInput = (config: SystemConfig) => {
    if (!config.editable && config.editable !== undefined) {
      return (
        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600">
          {config.sensitive && !showSensitive ? '••••••••••••' : String(config.value)}
        </div>
      );
    }

    switch (config.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.value}
              onCheckedChange={(checked) => updateConfig(config.id, checked)}
            />
            <span className="text-sm text-gray-600">
              {config.value ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        );
      
      case 'password':
        return (
          <div className="flex gap-2">
            <Input
              type={showSensitive ? 'text' : 'password'}
              value={config.value}
              onChange={(e) => updateConfig(config.id, e.target.value)}
              placeholder={config.description}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitive(!showSensitive)}
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={config.value}
            onChange={(e) => updateConfig(config.id, Number(e.target.value))}
            placeholder={config.description}
          />
        );
      
      case 'json':
        return (
          <Textarea
            value={typeof config.value === 'object' ? JSON.stringify(config.value, null, 2) : config.value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateConfig(config.id, parsed);
              } catch {
                updateConfig(config.id, e.target.value);
              }
            }}
            placeholder={config.description}
            className="font-mono text-xs min-h-[100px]"
          />
        );
      
      default: // text
        return (
          <Input
            type="text"
            value={config.value}
            onChange={(e) => updateConfig(config.id, e.target.value)}
            placeholder={config.description}
          />
        );
    }
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === activeTab);
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-thai-green">Configuration Avancée</h1>
          <p className="text-sm text-gray-600">Paramètres système et configurations techniques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportConfig}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={!hasChanges || loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Cog className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Alertes de sécurité */}
      <Card className="border-l-4 border-l-amber-500 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Zone de Configuration Avancée</h3>
              <p className="text-sm text-amber-700 mt-1">
                Ces paramètres affectent le comportement système. Les modifications incorrectes peuvent impacter 
                les performances ou la sécurité. Sauvegardez la configuration avant toute modification majeure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateur de changements */}
      {hasChanges && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Modifications non sauvegardées détectées
                </span>
              </div>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                Sauvegarder maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des catégories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-thai-green">Catégories</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitive(!showSensitive)}
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const categoryConfigs = configs.filter(c => c.category === category.id);
                  const hasAdvanced = categoryConfigs.some(c => c.advanced);
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-thai-green text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {categoryConfigs.length}
                        </Badge>
                        {hasAdvanced && (
                          <Badge variant="outline" className="text-xs">
                            ADV
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Statut système */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-thai-green">Statut Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de données</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connectée
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache Redis</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Actif
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CDN</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Opérationnel
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monitoring</span>
                <Badge className="bg-green-100 text-green-800">
                  <Activity className="w-3 h-3 mr-1" />
                  En ligne
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu de la configuration */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentCategory && <currentCategory.icon className={`w-6 h-6 ${currentCategory.color}`} />}
                  <CardTitle className="text-thai-green">
                    Configuration {currentCategory?.name}
                  </CardTitle>
                </div>
                <Badge variant="outline">
                  {filteredConfigs.length} paramètre{filteredConfigs.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredConfigs.map((config) => (
                <div key={config.id} className={`space-y-3 p-4 border rounded-lg ${
                  config.sensitive ? 'border-red-200 bg-red-50' : 
                  config.advanced ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {config.name}
                        {config.sensitive && (
                          <Badge variant="destructive" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Sensible
                          </Badge>
                        )}
                        {config.advanced && (
                          <Badge variant="secondary" className="text-xs">
                            <Terminal className="w-3 h-3 mr-1" />
                            Avancé
                          </Badge>
                        )}
                        {!config.editable && config.editable !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Lecture seule
                          </Badge>
                        )}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                    </div>
                  </div>
                  
                  <div className="max-w-md">
                    {renderConfigInput(config)}
                  </div>

                  {config.sensitive && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Cette configuration contient des informations sensibles
                    </p>
                  )}
                </div>
              ))}

              {filteredConfigs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun paramètre disponible dans cette catégorie</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
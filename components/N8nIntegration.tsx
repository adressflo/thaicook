import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Workflow, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Settings
} from 'lucide-react';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  lastExecution?: Date;
  status: 'success' | 'error' | 'waiting' | 'running';
  description: string;
}

interface N8nIntegrationProps {
  onWorkflowExecute?: (workflowId: string) => void;
  onWorkflowToggle?: (workflowId: string, active: boolean) => void;
}

const N8nIntegration: React.FC<N8nIntegrationProps> = ({
  onWorkflowExecute,
  onWorkflowToggle
}) => {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  useEffect(() => {
    const workflows: N8nWorkflow[] = [
      {
        id: '1',
        name: 'Notification commande confirmée',
        description: 'Envoie automatiquement une notification au client quand sa commande est confirmée',
        active: true,
        status: 'success',
        lastExecution: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: '2',
        name: 'Rappel événement 24h',
        description: 'Rappelle aux clients leur événement 24h avant',
        active: true,
        status: 'success',
        lastExecution: new Date('2024-01-14T09:15:00Z')
      },
      {
        id: '3',
        name: 'Sync stocks ingredients',
        description: 'Synchronise automatiquement les stocks d\'ingrédients avec les fournisseurs',
        active: false,
        status: 'waiting',
        lastExecution: new Date('2024-01-10T14:20:00Z')
      },
      {
        id: '4',
        name: 'Analyse performances hebdo',
        description: 'Génère automatiquement un rapport de performance chaque lundi',
        active: true,
        status: 'success',
        lastExecution: new Date('2024-01-08T08:00:00Z')
      }
    ];
    
    setWorkflows(workflows);
    checkN8nConnection();
  }, []);

  const checkN8nConnection = async () => {
    setConnectionStatus('connecting');
    try {
      // Simuler la vérification de connexion n8n
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    setLoading(true);
    try {
      // Simuler l'exécution du workflow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflowId 
            ? { ...w, lastExecution: new Date(), status: 'success' as const }
            : w
        )
      );
      
      onWorkflowExecute?.(workflowId);
    } catch (error) {
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflowId 
            ? { ...w, status: 'error' as const }
            : w
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (workflowId: string, active: boolean) => {
    try {
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflowId 
            ? { ...w, active, status: active ? 'success' as const : 'waiting' as const }
            : w
        )
      );
      
      onWorkflowToggle?.(workflowId, active);
    } catch (error) {
      console.error('Erreur lors de la modification du workflow:', error);
    }
  };

  const getStatusIcon = (status: N8nWorkflow['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: N8nWorkflow['status'], active: boolean) => {
    if (!active) return <Badge variant="secondary">Inactif</Badge>;
    
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'running':
        return <Badge variant="default" className="bg-blue-500">En cours</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const ConnectionStatusAlert = () => {
    const statusConfig = {
      connected: {
        icon: CheckCircle,
        variant: 'default' as const,
        message: 'Connexion n8n établie - Tous les workflows sont opérationnels'
      },
      connecting: {
        icon: RefreshCw,
        variant: 'default' as const,
        message: 'Connexion en cours...'
      },
      disconnected: {
        icon: XCircle,
        variant: 'destructive' as const,
        message: 'Connexion n8n indisponible - Les workflows automatiques sont désactivés'
      }
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <Alert variant={config.variant} className="mb-6">
        <Icon className={`h-4 w-4 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
        <AlertDescription>{config.message}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-thai-green flex items-center space-x-2">
            <Workflow className="w-6 h-6" />
            <span>Automatisation n8n</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Gestion intelligente des workflows automatisés
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={checkN8nConnection}
            variant="outline"
            disabled={connectionStatus === 'connecting'}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
            Vérifier Connexion
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      <ConnectionStatusAlert />

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="border-thai-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <CardTitle className="text-thai-green">{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(workflow.status, workflow.active)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {workflow.lastExecution 
                    ? `Dernière exécution: ${workflow.lastExecution.toLocaleString('fr-FR')}`
                    : 'Jamais exécuté'
                  }
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeWorkflow(workflow.id)}
                    disabled={loading || connectionStatus !== 'connected'}
                    className="text-thai-green border-thai-orange hover:bg-thai-cream"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Exécuter
                  </Button>
                  <Button
                    size="sm"
                    variant={workflow.active ? "destructive" : "default"}
                    onClick={() => toggleWorkflow(workflow.id, !workflow.active)}
                    disabled={connectionStatus !== 'connected'}
                    className={workflow.active ? "" : "bg-thai-green hover:bg-thai-green/90 text-white"}
                  >
                    {workflow.active ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Activer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Workflow className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun workflow configuré</p>
            <Button className="mt-4 bg-thai-orange hover:bg-thai-orange/90 text-white">
              Créer un workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default N8nIntegration;
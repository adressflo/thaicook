import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAirtableConfig } from '@/hooks/useAirtable';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const AirtableConfig = () => {
  const { config, saveConfig } = useAirtableConfig();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [baseId, setBaseId] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setApiKey(config.apiKey);
      setBaseId(config.baseId);
    }
  }, [config]);

  const handleSaveAndTest = async () => {
    setTestStatus('testing');
    setTestError(null);
    
    // Sauvegarde immédiate
    saveConfig(apiKey, baseId);

    // Test de la connexion
    try {
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/Plats%20DB?maxRecords=1`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        setTestStatus('success');
        toast({
          title: "Configuration sauvegardée",
          description: "La connexion à Airtable a réussi.",
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `Erreur ${response.status}`;
        setTestStatus('error');
        setTestError(`La clé ou l'ID de la base semble incorrect. Airtable a répondu : "${errorMessage}"`);
        toast({
          title: "Erreur de connexion",
          description: "Veuillez vérifier vos identifiants Airtable.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestStatus('error');
      setTestError("Une erreur réseau est survenue. Vérifiez votre connexion internet.");
      toast({
        title: "Erreur réseau",
        description: "Impossible de joindre les serveurs d'Airtable.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Configuration Airtable</CardTitle>
            <CardDescription>
              Entrez vos identifiants Airtable pour connecter l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important: Permissions requises</AlertTitle>
              <AlertDescription>
                Votre clé d'API (Personal Access Token) doit avoir les permissions (`scope`) suivantes :
                <ul className="list-disc pl-5 mt-2 text-xs">
                  <li><code className="font-mono">data.records:read</code></li>
                  <li><code className="font-mono">data.records:write</code></li>
                  <li><code className="font-mono">schema.bases:read</code></li>
                </ul>
              </AlertDescription>
            </Alert>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Où trouver ces informations ?</AlertTitle>
                <AlertDescription>
                    <p>1. Obtenez votre clé d'API sur <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="underline">la page des développeurs Airtable</a>.</p>
                    <p>2. L'ID de la base se trouve dans l'URL de votre base sur Airtable (il commence par "app...").</p>
                </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Clé API Airtable (Personal Access Token)</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="patex..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseId">ID de Base Airtable</Label>
              <Input
                id="baseId"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                placeholder="app..."
              />
            </div>
            <Button onClick={handleSaveAndTest} disabled={!apiKey || !baseId || testStatus === 'testing'} className="w-full">
              {testStatus === 'testing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              {testStatus === 'testing' ? 'Test en cours...' : 'Sauvegarder & Tester'}
            </Button>
            {testStatus === 'success' && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Connexion réussie !</AlertTitle>
                <AlertDescription className="text-green-800">
                  L'application va se recharger...
                </AlertDescription>
              </Alert>
            )}
            {testStatus === 'error' && testError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur de configuration</AlertTitle>
                <AlertDescription>{testError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AirtableConfig;

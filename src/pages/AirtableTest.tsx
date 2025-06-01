
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AirtableConfig from '@/components/AirtableConfig';
import ClientsList from '@/components/ClientsList';
import { useAirtableConfig, usePlats } from '@/hooks/useAirtable';
import { Database, Users, UtensilsCrossed, Settings } from 'lucide-react';

const AirtableTest = () => {
  const { config } = useAirtableConfig();
  const { plats, isLoading: platsLoading } = usePlats();

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Database className="w-16 h-16 text-thai-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-thai-green mb-2">
              Test Airtable Integration
            </h1>
            <p className="text-thai-green/70">
              Configurez d'abord votre accès à Airtable
            </p>
          </div>
          
          <AirtableConfig />
          
          <div className="mt-8 text-center">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Comment obtenir votre clé API Airtable :
                </h3>
                <ol className="text-sm text-blue-700 text-left space-y-1">
                  <li>1. Allez sur https://airtable.com/create/tokens</li>
                  <li>2. Créez un nouveau token personnel</li>
                  <li>3. Accordez les permissions data.records:read et data.records:write</li>
                  <li>4. Sélectionnez votre base (appjSFSHxwJqhnUJj)</li>
                  <li>5. Copiez le token et collez-le ci-dessus</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-thai-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-thai-green mb-2">
            Données Airtable - ChanthanaThaiCook
          </h1>
          <p className="text-thai-green/70">
            Visualisation et gestion de vos données
          </p>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="plats" className="flex items-center space-x-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Plats</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsList />
          </TabsContent>

          <TabsContent value="plats">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <UtensilsCrossed className="w-6 h-6 text-thai-orange" />
                <h2 className="text-2xl font-bold text-thai-green">
                  Plats ({plats?.length || 0})
                </h2>
              </div>

              {platsLoading ? (
                <Card>
                  <CardContent className="text-center p-8">
                    <p className="text-thai-green">Chargement des plats...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plats?.map((plat) => (
                    <Card key={plat.id} className="border-thai-orange/20">
                      <CardHeader>
                        <CardTitle className="text-thai-green">{plat.plat}</CardTitle>
                        <CardDescription>{plat.prixVu || `${plat.prix}€`}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {plat.description && (
                          <p className="text-sm text-thai-green/70 mb-2">{plat.description}</p>
                        )}
                        <div className="mt-2 text-xs text-thai-green/60">
                          <p>Disponibilités:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plat.lundiDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Lun</span>}
                            {plat.mardiDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Mar</span>}
                            {plat.mercrediDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Mer</span>}
                            {plat.jeudiDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Jeu</span>}
                            {plat.vendrediDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Ven</span>}
                            {plat.samediDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Sam</span>}
                            {plat.dimancheDispo === 'oui' && <span className="bg-thai-cream px-1 rounded">Dim</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <Card className="col-span-full">
                      <CardContent className="text-center p-8">
                        <UtensilsCrossed className="w-12 h-12 text-thai-green/30 mx-auto mb-4" />
                        <p className="text-thai-green/70">Aucun plat trouvé</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="config">
            <AirtableConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AirtableTest;

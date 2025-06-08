
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClients } from '@/hooks/useAirtable';
import { Users, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

const ClientsList = () => {
  const { data: clients, isLoading, error } = useClients();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-thai-orange" />
          <span className="ml-2 text-thai-green">Chargement des clients...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">
            Erreur lors du chargement des clients: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-6 h-6 text-thai-orange" />
        <h2 className="text-2xl font-bold text-thai-green">
          Clients ({clients.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="border-thai-orange/20">
            <CardHeader>
              <CardTitle className="text-thai-green">
                {client['Prénom']} {client['Nom']}
              </CardTitle>
              {/* <CardDescription>
                Client depuis le {new Date(client.createdTime).toLocaleDateString('fr-FR')}
              </CardDescription> */}
            </CardHeader>
            
            <CardContent className="space-y-2">
              {client['e-mail'] && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-thai-orange" />
                  <span className="text-sm">{client['e-mail']}</span>
                </div>
              )}
              
              {client['Numéro de téléphone'] && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-thai-orange" />
                  <span className="text-sm">{client['Numéro de téléphone']}</span>
                </div>
              )}
              
              {client['Adresse (numéro et rue)'] && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-thai-orange" />
                  <span className="text-sm">
                    {client['Adresse (numéro et rue)']}
                    {client['Code postal'] && `, ${client['Code postal']}`}
                    {client['Ville'] && ` ${client['Ville']}`}
                  </span>
                </div>
              )}
              
              {client['Préférence client'] && (
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-thai-cream text-thai-green">
                    {client['Préférence client']}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {clients.length === 0 && (
          <Card>
            <CardContent className="text-center p-8">
              <Users className="w-12 h-12 text-thai-green/30 mx-auto mb-4" />
              <p className="text-thai-green/70">Aucun client trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientsList;

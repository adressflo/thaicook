'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ShoppingCart, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ClientUI } from '@/types/app';

interface ClientDetailsModalProps {
  client: ClientUI;
  commandes: any[];
  onClose: () => void;
}

const ClientDetailsModal = ({ 
  client, 
  commandes, 
  onClose 
}: ClientDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-thai-green">
              Détails Client - {client.prenom} {client.nom}
            </h2>
            <Button variant="ghost" onClick={onClose}>
              <span className="sr-only">Fermer</span>
              <X />
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nom complet</p>
                <p className="text-gray-600">{client.prenom} {client.nom}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{client.email || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-600">{client.numero_de_telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium">Client ID</p>
                <p className="text-gray-600">
                  #{client.idclient || 'Inconnu'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium">Adresse</p>
                <p className="text-gray-600">{client.adresse_numero_et_rue || 'Non renseignée'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Historique des commandes */}
          {commandes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-thai-green">Historique des Commandes ({commandes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {commandes.map((commande, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Commande #{commande.idcommande}</p>
                        <p className="text-sm text-gray-600">
                          {commande.date_de_prise_de_commande ? format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yyyy à HH:mm', { locale: fr }) : 'Date inconnue'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{commande.statut_commande}</Badge>
                        <p className="text-sm font-medium text-thai-orange mt-1">
                          {(commande.details?.reduce((sum: number, detail: any) => {
                            return sum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
                          }, 0) || 0).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;

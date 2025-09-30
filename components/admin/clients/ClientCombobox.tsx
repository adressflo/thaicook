'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchClients } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Loader2,
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Plus,
  Clock,
  User,
  ChevronRight,
  X
} from 'lucide-react';
import type { ClientUI } from '@/types/app';

interface ClientComboboxProps {
  clients: ClientUI[] | undefined;
  onSelectClient: (client: ClientUI) => void;
  onCreateNewClient?: () => void;
  className?: string;
}

// Fonction utilitaire pour obtenir le nom d'affichage
const getDisplayName = (client: ClientUI): string => {
  if (client.nom || client.prenom) {
    return `${client.prenom || ''} ${client.nom || ''}`.trim();
  }
  return client.email || 'Client sans nom';
};

// Fonction utilitaire pour obtenir les initiales
const getInitials = (nom?: string | null, prenom?: string | null): string => {
  const n = nom?.charAt(0)?.toUpperCase() || '';
  const p = prenom?.charAt(0)?.toUpperCase() || '';
  return `${p}${n}` || 'C';
};

// Hook pour gérer les clients récents
const useRecentClients = (clients: ClientUI[] = []) => {
  const [recentClientIds, setRecentClientIds] = useState<number[]>([]);

  // Charger les clients récents depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent-clients');
      if (stored) {
        const ids = JSON.parse(stored);
        setRecentClientIds(Array.isArray(ids) ? ids : []);
      }
    } catch (error) {
      console.warn('Erreur lecture clients récents:', error);
      setRecentClientIds([]);
    }
  }, []);

  // Sauvegarder quand un client est sélectionné
  const addRecentClient = (clientId: number) => {
    try {
      const newRecents = [clientId, ...recentClientIds.filter(id => id !== clientId)].slice(0, 5);
      setRecentClientIds(newRecents);
      localStorage.setItem('recent-clients', JSON.stringify(newRecents));
    } catch (error) {
      console.warn('Erreur sauvegarde clients récents:', error);
    }
  };

  // Obtenir les clients récents complets
  const recentClients = useMemo(() => {
    return recentClientIds
      .map(id => clients.find(client => client.idclient === id))
      .filter((client): client is ClientUI => client !== undefined)
      .slice(0, 5);
  }, [recentClientIds, clients]);

  return { recentClients, addRecentClient };
};

export const ClientCombobox = ({
  clients = [],
  onSelectClient,
  onCreateNewClient,
  className = ""
}: ClientComboboxProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { recentClients, addRecentClient } = useRecentClients(clients);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const { data: searchedClients, isLoading: isSearching } = useSearchClients(debouncedSearchTerm);

  // Gérer la sélection d'un client
  const handleSelectClient = (client: ClientUI) => {
    addRecentClient(client.idclient);
    onSelectClient(client);
    setSearchValue('');
  };

  const results = searchedClients || [];

  return (
    <Card className={`shadow-xl border-thai-green/20 animate-in fade-in-0 hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-thai-green/5 to-thai-cream/20 border-b border-thai-green/10 p-6">
        {/* Barre de recherche stylée avec bouton Nouveau Client */}
        <div className="flex gap-4 items-center">
          {/* Icône loupe avant la barre de recherche */}
          <div className="p-3 bg-thai-green/10 rounded-xl border border-thai-green/20 shadow-sm">
            <Search className="w-6 h-6 text-thai-green" />
          </div>

          <div className="relative group flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou ville (2 caractères min)..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-4 pr-10 h-14 text-lg border-2 border-thai-green/30 rounded-xl bg-white/50 backdrop-blur-sm focus:border-thai-green focus:ring-2 focus:ring-thai-green/30 focus:bg-white transition-all duration-300 hover:border-thai-green/60 focus:outline-none"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-thai-green animate-spin w-5 h-5" />
            )}
            {searchValue && !isSearching && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-thai-red transition-colors duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bouton Nouveau Client */}
          {onCreateNewClient && (
            <button
              onClick={onCreateNewClient}
              className="h-14 px-6 bg-thai-green hover:bg-thai-green/90 text-white border-0 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau Client
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Présentation galerie des résultats */}
        {searchValue ? (
          <div className="space-y-4">
            {/* Header des résultats */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-thai-green">
                Résultats de recherche ({results.length})
              </h3>
              {results.length > 0 && (
                <span className="text-sm text-gray-500">
                  Cliquez sur une carte pour sélectionner
                </span>
              )}
            </div>

            {debouncedSearchTerm.length < 2 && searchValue.length > 0 && !isSearching && (
              <div className="text-center py-12 text-gray-500">
                 <p>Continuez à taper pour rechercher...</p>
              </div>
            )}

            {isSearching && (
               <div className="text-center py-12 text-gray-500">
                 <Loader2 className="w-8 h-8 mx-auto text-thai-green animate-spin" />
                 <p className="mt-2">Recherche en cours...</p>
              </div>
            )}

            {!isSearching && debouncedSearchTerm.length >= 2 && results.length > 0 ? (
              /* Grille de cartes clients */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((client) => (
                  <div
                    key={client.idclient}
                    onClick={() => handleSelectClient(client)}
                    className="bg-gradient-to-br from-white to-thai-green/5 border-2 border-thai-green/20 rounded-2xl p-5 cursor-pointer hover:border-thai-green hover:shadow-xl hover:from-thai-green/10 hover:to-thai-green/15 transition-all duration-300 hover:scale-[1.03] group relative overflow-hidden"
                  >
                    {/* Décoration d'angle */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-thai-green/10 rounded-bl-2xl group-hover:bg-thai-green/20 transition-colors duration-300"></div>

                    {/* Avatar centralisé */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        {client.photo_client ? (
                          <img
                            src={client.photo_client}
                            alt={getDisplayName(client)}
                            className="w-20 h-20 rounded-full object-cover border-3 border-thai-green/30 shadow-lg group-hover:border-thai-green group-hover:shadow-xl transition-all duration-300"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-thai-green to-thai-green/80 text-white text-xl font-bold shadow-lg group-hover:from-thai-green/90 group-hover:to-thai-green transition-all duration-300">
                            {getInitials(client.nom, client.prenom)}
                          </div>
                        )}
                      </div>

                      {/* Nom centré */}
                      <div className="text-center mt-3">
                        <h3 className="font-bold text-thai-green text-lg leading-tight group-hover:text-thai-green/90 transition-colors">
                          {getDisplayName(client)}
                        </h3>
                      </div>
                    </div>

                    {/* Badge de statut */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-thai-green/10 text-thai-green text-xs font-medium rounded-full border border-thai-green/20">
                      Client
                    </div>

                    {/* Informations contact */}
                    {(client.numero_de_telephone || client.ville) && (
                      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-thai-green/10">
                        {client.numero_de_telephone && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-thai-green/10 rounded-full border border-thai-green/20 hover:bg-thai-green/20 transition-colors group-hover:border-thai-green/30">
                            <Phone className="w-4 h-4 text-thai-green" />
                            <span className="text-sm font-medium text-thai-green">{client.numero_de_telephone}</span>
                          </div>
                        )}
                        {client.ville && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-thai-orange/10 rounded-full border border-thai-orange/20 hover:bg-thai-orange/20 transition-colors group-hover:border-thai-orange/30">
                            <MapPin className="w-4 h-4 text-thai-orange" />
                            <span className="text-sm font-medium text-thai-orange truncate max-w-20">{client.ville}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Effet de hover subtil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-thai-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            ) : null}
            {!isSearching && debouncedSearchTerm.length >= 2 && results.length === 0 && (
              /* Message aucun résultat */
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-thai-green/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-thai-green/40" />
                </div>
                <h3 className="font-medium text-lg mb-2">Aucun client trouvé</h3>
                <p className="text-sm text-gray-400">
                  Essayez avec d'autres termes de recherche
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Affichage par défaut - clients récents */
          <div className="space-y-4">
            {recentClients.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-thai-green mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Clients récents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentClients.map((client) => (
                    <div
                      key={`recent-${client.idclient}`}
                      onClick={() => handleSelectClient(client)}
                      className="bg-gradient-to-br from-white to-thai-green/5 border-2 border-thai-green/20 rounded-2xl p-5 cursor-pointer hover:border-thai-green hover:shadow-xl hover:from-thai-green/10 hover:to-thai-green/15 transition-all duration-300 hover:scale-[1.03] group relative overflow-hidden"
                    >
                      {/* Décoration d'angle avec Clock */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-thai-green/10 rounded-bl-2xl group-hover:bg-thai-green/20 transition-colors duration-300 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-thai-green" />
                      </div>

                      {/* Avatar centralisé */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="relative">
                          {client.photo_client ? (
                            <img
                              src={client.photo_client}
                              alt={getDisplayName(client)}
                              className="w-20 h-20 rounded-full object-cover border-3 border-thai-green/30 shadow-lg group-hover:border-thai-green group-hover:shadow-xl transition-all duration-300"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-thai-green to-thai-green/80 text-white text-xl font-bold shadow-lg group-hover:from-thai-green/90 group-hover:to-thai-green transition-all duration-300">
                              {getInitials(client.nom, client.prenom)}
                            </div>
                          )}
                        </div>

                        {/* Nom centré */}
                        <div className="text-center mt-3">
                          <h3 className="font-bold text-thai-green text-lg leading-tight group-hover:text-thai-green/90 transition-colors">
                            {getDisplayName(client)}
                          </h3>
                        </div>
                      </div>

                      {/* Badge de statut récent */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-thai-green/10 text-thai-green text-xs font-medium rounded-full border border-thai-green/20">
                        Récent
                      </div>

                      {/* Informations contact */}
                      {(client.numero_de_telephone || client.ville) && (
                        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-thai-green/10">
                          {client.numero_de_telephone && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-thai-green/10 rounded-full border border-thai-green/20 hover:bg-thai-green/20 transition-colors group-hover:border-thai-green/30">
                              <Phone className="w-4 h-4 text-thai-green" />
                              <span className="text-sm font-medium text-thai-green">{client.numero_de_telephone}</span>
                            </div>
                          )}
                          {client.ville && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-thai-orange/10 rounded-full border border-thai-orange/20 hover:bg-thai-orange/20 transition-colors group-hover:border-thai-orange/30">
                              <MapPin className="w-4 h-4 text-thai-orange" />
                              <span className="text-sm font-medium text-thai-orange truncate max-w-20">{client.ville}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Effet de hover subtil */}
                      <div className="absolute inset-0 bg-gradient-to-r from-thai-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Message d'accueil */
              <div className="text-center py-12 text-gray-500">
                <div className="w-20 h-20 bg-thai-green/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-thai-green/40" />
                </div>
                <h3 className="font-medium text-xl mb-2">Rechercher un client</h3>
                <p className="text-gray-400">
                  Utilisez la barre de recherche ci-dessus pour trouver un client
                </p>
              </div>
            )}
          </div>
        )}

        {/* Statistiques */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Total clients: <span className="font-bold text-thai-green">{clients?.length || 0}</span>
            </span>
            {searchValue && (
              <span className="text-thai-orange font-medium">
                Résultats: <span className="font-bold">{results.length}</span>
              </span>
            )}
          </div>
          {recentClients.length > 0 && (
            <div className="flex items-center gap-2 text-thai-green">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{recentClients.length} récents</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
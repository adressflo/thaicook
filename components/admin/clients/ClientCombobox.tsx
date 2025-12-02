"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { usePrismaSearchClients } from "@/hooks/usePrismaData"
import type { ClientUI } from "@/types/app"
import { Clock, Loader2, MapPin, Phone, Plus, Search, Users, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface ClientComboboxProps {
  clients: ClientUI[] | undefined
  onSelectClient: (client: ClientUI) => void
  onCreateNewClient?: () => void
  className?: string
}

// Fonction utilitaire pour obtenir le nom d'affichage
const getDisplayName = (client: ClientUI): string => {
  if (client.nom || client.prenom) {
    return `${client.prenom || ""} ${client.nom || ""}`.trim()
  }
  return client.email || "Client sans nom"
}

// Fonction utilitaire pour obtenir les initiales
const getInitials = (nom?: string | null, prenom?: string | null): string => {
  const n = nom?.charAt(0)?.toUpperCase() || ""
  const p = prenom?.charAt(0)?.toUpperCase() || ""
  return `${p}${n}` || "C"
}

// Hook pour gérer les clients récents
const useRecentClients = (clients: ClientUI[] = []) => {
  const [recentClientIds, setRecentClientIds] = useState<number[]>([])

  // Charger les clients récents depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent-clients")
      if (stored) {
        const ids = JSON.parse(stored)
        setRecentClientIds(Array.isArray(ids) ? ids : [])
      }
    } catch (error) {
      console.warn("Erreur lecture clients récents:", error)
      setRecentClientIds([])
    }
  }, [])

  // Sauvegarder quand un client est sélectionné
  const addRecentClient = (clientId: number) => {
    try {
      const newRecents = [clientId, ...recentClientIds.filter((id) => id !== clientId)].slice(0, 5)
      setRecentClientIds(newRecents)
      localStorage.setItem("recent-clients", JSON.stringify(newRecents))
    } catch (error) {
      console.warn("Erreur sauvegarde clients récents:", error)
    }
  }

  // Obtenir les clients récents complets
  const recentClients = useMemo(() => {
    return recentClientIds
      .map((id) => clients.find((client) => client.idclient === id))
      .filter((client): client is ClientUI => client !== undefined)
      .slice(0, 5)
  }, [recentClientIds, clients])

  return { recentClients, addRecentClient }
}

export const ClientCombobox = ({
  clients = [],
  onSelectClient,
  onCreateNewClient,
  className = "",
}: ClientComboboxProps) => {
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const { recentClients, addRecentClient } = useRecentClients(clients)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchValue)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchValue])

  const { data: searchedClients, isLoading: isSearching } =
    usePrismaSearchClients(debouncedSearchTerm)

  // Gérer la sélection d'un client
  const handleSelectClient = (client: ClientUI) => {
    addRecentClient(client.idclient)
    onSelectClient(client)
    setSearchValue("")
  }

  const results = searchedClients || []

  return (
    <Card
      className={`border-thai-green/20 animate-in fade-in-0 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      <CardHeader className="from-thai-green/5 to-thai-cream/20 border-thai-green/10 border-b bg-linear-to-r p-6">
        {/* Barre de recherche stylée avec bouton Nouveau Client */}
        <div className="flex items-center gap-4">
          {/* Icône loupe avant la barre de recherche */}
          <div className="bg-thai-green/10 border-thai-green/20 rounded-xl border p-3 shadow-sm">
            <Search className="text-thai-green h-6 w-6" />
          </div>

          <div className="group relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou ville (2 caractères min)..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-thai-green/30 focus:border-thai-green focus:ring-thai-green/30 hover:border-thai-green/60 h-14 w-full rounded-xl border-2 bg-white/50 pr-10 pl-4 text-lg backdrop-blur-sm transition-all duration-300 focus:bg-white focus:ring-2 focus:outline-none"
            />
            {isSearching && (
              <Loader2 className="text-thai-green absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform animate-spin" />
            )}
            {searchValue && !isSearching && (
              <button
                onClick={() => setSearchValue("")}
                className="hover:text-thai-red absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 transition-colors duration-200 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Bouton Nouveau Client */}
          {onCreateNewClient && (
            <button
              onClick={onCreateNewClient}
              className="bg-thai-green hover:bg-thai-green/90 flex h-14 items-center gap-2 rounded-xl border-0 px-6 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
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
              <h3 className="text-thai-green text-lg font-semibold">
                Résultats de recherche ({results.length})
              </h3>
              {results.length > 0 && (
                <span className="text-sm text-gray-500">
                  Cliquez sur une carte pour sélectionner
                </span>
              )}
            </div>

            {debouncedSearchTerm.length < 2 && searchValue.length > 0 && !isSearching && (
              <div className="py-12 text-center text-gray-500">
                <p>Continuez à taper pour rechercher...</p>
              </div>
            )}

            {isSearching && (
              <div className="py-12 text-center text-gray-500">
                <Loader2 className="text-thai-green mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Recherche en cours...</p>
              </div>
            )}

            {!isSearching && debouncedSearchTerm.length >= 2 && results.length > 0 ? (
              /* Grille de cartes clients */
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((client) => (
                  <div
                    key={client.idclient}
                    onClick={() => handleSelectClient(client)}
                    className="to-thai-green/5 border-thai-green/20 hover:border-thai-green hover:from-thai-green/10 hover:to-thai-green/15 group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-linear-to-br from-white p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                  >
                    {/* Décoration d'angle */}
                    <div className="bg-thai-green/10 group-hover:bg-thai-green/20 absolute top-0 right-0 h-8 w-8 rounded-bl-2xl transition-colors duration-300"></div>

                    {/* Avatar centralisé */}
                    <div className="mb-4 flex flex-col items-center">
                      <div className="relative">
                        {client.photo_client ? (
                          <img
                            src={client.photo_client}
                            alt={getDisplayName(client)}
                            className="border-thai-green/30 group-hover:border-thai-green h-20 w-20 rounded-full border-3 object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl"
                          />
                        ) : (
                          <div className="from-thai-green to-thai-green/80 group-hover:from-thai-green/90 group-hover:to-thai-green flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br text-xl font-bold text-white shadow-lg transition-all duration-300">
                            {getInitials(client.nom, client.prenom)}
                          </div>
                        )}
                      </div>

                      {/* Nom centré */}
                      <div className="mt-3 text-center">
                        <h3 className="text-thai-green group-hover:text-thai-green/90 text-lg leading-tight font-bold transition-colors">
                          {getDisplayName(client)}
                        </h3>
                      </div>
                    </div>

                    {/* Badge de statut */}
                    <div className="bg-thai-green/10 text-thai-green border-thai-green/20 absolute top-3 left-3 rounded-full border px-2 py-1 text-xs font-medium">
                      Client
                    </div>

                    {/* Informations contact */}
                    {(client.numero_de_telephone || client.ville) && (
                      <div className="border-thai-green/10 mt-4 flex items-center justify-center gap-4 border-t pt-4">
                        {client.numero_de_telephone && (
                          <div className="bg-thai-green/10 border-thai-green/20 hover:bg-thai-green/20 group-hover:border-thai-green/30 flex items-center gap-2 rounded-full border px-3 py-2 transition-colors">
                            <Phone className="text-thai-green h-4 w-4" />
                            <span className="text-thai-green text-sm font-medium">
                              {client.numero_de_telephone}
                            </span>
                          </div>
                        )}
                        {client.ville && (
                          <div className="bg-thai-orange/10 border-thai-orange/20 hover:bg-thai-orange/20 group-hover:border-thai-orange/30 flex items-center gap-2 rounded-full border px-3 py-2 transition-colors">
                            <MapPin className="text-thai-orange h-4 w-4" />
                            <span className="text-thai-orange max-w-20 truncate text-sm font-medium">
                              {client.ville}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Effet de hover subtil */}
                    <div className="from-thai-green/5 absolute inset-0 rounded-2xl bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                ))}
              </div>
            ) : null}
            {!isSearching && debouncedSearchTerm.length >= 2 && results.length === 0 && (
              /* Message aucun résultat */
              <div className="py-12 text-center text-gray-500">
                <div className="bg-thai-green/5 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Users className="text-thai-green/40 h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Aucun client trouvé</h3>
                <p className="text-sm text-gray-400">Essayez avec d'autres termes de recherche</p>
              </div>
            )}
          </div>
        ) : (
          /* Affichage par défaut - clients récents */
          <div className="space-y-4">
            {recentClients.length > 0 ? (
              <div>
                <h3 className="text-thai-green mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" />
                  Clients récents
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentClients.map((client) => (
                    <div
                      key={`recent-${client.idclient}`}
                      onClick={() => handleSelectClient(client)}
                      className="to-thai-green/5 border-thai-green/20 hover:border-thai-green hover:from-thai-green/10 hover:to-thai-green/15 group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-linear-to-br from-white p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                    >
                      {/* Décoration d'angle avec Clock */}
                      <div className="bg-thai-green/10 group-hover:bg-thai-green/20 absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-bl-2xl transition-colors duration-300">
                        <Clock className="text-thai-green h-3 w-3" />
                      </div>

                      {/* Avatar centralisé */}
                      <div className="mb-4 flex flex-col items-center">
                        <div className="relative">
                          {client.photo_client ? (
                            <img
                              src={client.photo_client}
                              alt={getDisplayName(client)}
                              className="border-thai-green/30 group-hover:border-thai-green h-20 w-20 rounded-full border-3 object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl"
                            />
                          ) : (
                            <div className="from-thai-green to-thai-green/80 group-hover:from-thai-green/90 group-hover:to-thai-green flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br text-xl font-bold text-white shadow-lg transition-all duration-300">
                              {getInitials(client.nom, client.prenom)}
                            </div>
                          )}
                        </div>

                        {/* Nom centré */}
                        <div className="mt-3 text-center">
                          <h3 className="text-thai-green group-hover:text-thai-green/90 text-lg leading-tight font-bold transition-colors">
                            {getDisplayName(client)}
                          </h3>
                        </div>
                      </div>

                      {/* Badge de statut récent */}
                      <div className="bg-thai-green/10 text-thai-green border-thai-green/20 absolute top-3 left-3 rounded-full border px-2 py-1 text-xs font-medium">
                        Récent
                      </div>

                      {/* Informations contact */}
                      {(client.numero_de_telephone || client.ville) && (
                        <div className="border-thai-green/10 mt-4 flex items-center justify-center gap-4 border-t pt-4">
                          {client.numero_de_telephone && (
                            <div className="bg-thai-green/10 border-thai-green/20 hover:bg-thai-green/20 group-hover:border-thai-green/30 flex items-center gap-2 rounded-full border px-3 py-2 transition-colors">
                              <Phone className="text-thai-green h-4 w-4" />
                              <span className="text-thai-green text-sm font-medium">
                                {client.numero_de_telephone}
                              </span>
                            </div>
                          )}
                          {client.ville && (
                            <div className="bg-thai-orange/10 border-thai-orange/20 hover:bg-thai-orange/20 group-hover:border-thai-orange/30 flex items-center gap-2 rounded-full border px-3 py-2 transition-colors">
                              <MapPin className="text-thai-orange h-4 w-4" />
                              <span className="text-thai-orange max-w-20 truncate text-sm font-medium">
                                {client.ville}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Effet de hover subtil */}
                      <div className="from-thai-green/5 absolute inset-0 rounded-2xl bg-linear-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Message d'accueil */
              <div className="py-12 text-center text-gray-500">
                <div className="bg-thai-green/5 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                  <Search className="text-thai-green/40 h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Rechercher un client</h3>
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
              Total clients:{" "}
              <span className="text-thai-green font-bold">{clients?.length || 0}</span>
            </span>
            {searchValue && (
              <span className="text-thai-orange font-medium">
                Résultats: <span className="font-bold">{results.length}</span>
              </span>
            )}
          </div>
          {recentClients.length > 0 && (
            <div className="text-thai-green flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{recentClients.length} récents</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

'use client';

import React, { memo, useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCommandesByClient,
  useEvenementsByClient,
} from '@/hooks/useSupabaseData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Clock, History, Calendar, Utensils, Euro, BarChart3, Zap, PartyPopper, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CommandeUI, DetailCommande, Plat } from '@/types/app';
import { AppLayout } from '@/components/AppLayout';
import { isWithinInterval, parseISO } from 'date-fns';

// Composants optimisés
import { StatusBadge } from '@/components/historique/StatusBadge';
import { FormattedPrice, FormattedDate, FormattedEvent, PersonCount, DishList } from '@/components/historique/FormattedDisplay';
import { CommandeActionButtons, EvenementActionButtons } from '@/components/historique/ActionButtons';
import { EmptyState } from '@/components/historique/EmptyState';
import { FilterSearchBar } from '@/components/historique/FilterSearchBar';

export const dynamic = 'force-dynamic';

// Utilisation du type existant CommandeUI qui contient déjà les détails
type CommandeAvecDetails = CommandeUI;

const HistoriquePage = memo(() => {
  const { currentUser } = useAuth();
  const {
    data: commandes,
    isLoading: isLoadingCommandes,
    error,
  } = useCommandesByClient(currentUser?.uid);
  const {
    data: evenements,
    isLoading: isLoadingEvenements,
    error: errorEvenements,
  } = useEvenementsByClient(currentUser?.uid);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Fonctions optimisées avec memoization
  const formatPrix = useCallback((prix: number): string => {
    return prix % 1 === 0 
      ? `${prix}€` 
      : `${prix.toFixed(2).replace('.', ',')}€`;
  }, []);

  const calculateTotal = useCallback((commande: CommandeAvecDetails): number => {
    if (commande.prix_total != null) return commande.prix_total;
    
    return commande.details?.reduce((acc, detail) => 
      acc + (detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0), 0
    ) || 0;
  }, []);

  // Fonctions de filtrage
  const filterBySearch = useCallback((commande: CommandeAvecDetails) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return commande.details?.some(detail => 
      detail.plat?.plat?.toLowerCase().includes(searchLower)
    ) || false;
  }, [searchTerm]);

  const filterByStatus = useCallback((item: any) => {
    if (!statusFilter) return true;
    const status = item.statut_commande || item.statut_evenement;
    return status === statusFilter;
  }, [statusFilter]);

  const filterByDate = useCallback((item: any) => {
    if (!dateRange.from && !dateRange.to) return true;
    const itemDate = item.date_retrait || item.date_evenement;
    if (!itemDate) return false;
    
    try {
      const date = typeof itemDate === 'string' ? parseISO(itemDate) : itemDate;
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
      } else if (dateRange.from) {
        return date >= dateRange.from;
      } else if (dateRange.to) {
        return date <= dateRange.to;
      }
    } catch {
      return false;
    }
    return true;
  }, [dateRange]);

  const filterByAmount = useCallback((commande: CommandeAvecDetails) => {
    const total = calculateTotal(commande);
    const min = parseFloat(minAmount) || 0;
    const max = parseFloat(maxAmount) || Infinity;
    return total >= min && total <= max;
  }, [minAmount, maxAmount, calculateTotal]);

  // Fonctions pour les filtres
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter(null);
    setTypeFilter(null);
    setDateRange({ from: null, to: null });
    setMinAmount('');
    setMaxAmount('');
    setSortConfig(null);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter) count++;
    if (typeFilter) count++;
    if (dateRange.from || dateRange.to) count++;
    if (minAmount || maxAmount) count++;
    return count;
  }, [searchTerm, statusFilter, typeFilter, dateRange, minAmount, maxAmount]);

  const isFiltered = activeFiltersCount > 0;

  // Filtrer les données avec memoization pour optimiser les performances
  const { commandesEnCours, commandesHistorique, evenementsEnCours, evenementsHistorique, commandesFiltered, evenementsFiltered } = useMemo(() => {
    // Appliquer les filtres de base
    let filteredCommandes = commandes || [];
    let filteredEvenements = evenements || [];

    // Filtrage par type
    if (typeFilter === 'commande') {
      filteredEvenements = [];
    } else if (typeFilter === 'evenement') {
      filteredCommandes = [];
    }

    // Appliquer les filtres sur les commandes
    filteredCommandes = filteredCommandes.filter(c => 
      filterBySearch(c) && 
      filterByStatus(c) && 
      filterByDate(c) && 
      filterByAmount(c)
    );

    // Appliquer les filtres sur les événements
    filteredEvenements = filteredEvenements.filter(e => 
      filterByStatus(e) && 
      filterByDate(e)
    );

    // Séparer en cours/historique après filtrage
    const commandesEnCours = filteredCommandes.filter(
      c => c.statut_commande !== 'Annulée' && c.statut_commande !== 'Récupérée'
    );

    const commandesHistorique = filteredCommandes
      .filter(c => c.statut_commande === 'Annulée' || c.statut_commande === 'Récupérée')
      .slice(0, 10);

    const evenementsEnCours = filteredEvenements.filter(
      e => e.statut_evenement !== 'Réalisé' && e.statut_evenement !== 'Annulé'
    );

    const evenementsHistorique = filteredEvenements.filter(
      e => e.statut_evenement === 'Réalisé' || e.statut_evenement === 'Annulé'
    );

    return { 
      commandesEnCours, 
      commandesHistorique, 
      evenementsEnCours, 
      evenementsHistorique,
      commandesFiltered: filteredCommandes,
      evenementsFiltered: filteredEvenements
    };
  }, [commandes, evenements, filterBySearch, filterByStatus, filterByDate, filterByAmount, typeFilter]);

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-thai p-4">
          <Alert className="max-w-md">
            <AlertDescription>
              Veuillez vous{' '}
              <Link href="/profil" className="font-bold underline">
                connecter
              </Link>{' '}
              pour voir votre historique de commandes.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-7xl space-y-8 animate-fadeIn">
          {/* Barre de recherche et filtres */}
          <FilterSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            minAmount={minAmount}
            onMinAmountChange={setMinAmount}
            maxAmount={maxAmount}
            onMaxAmountChange={setMaxAmount}
            activeFiltersCount={activeFiltersCount}
            onClearAllFilters={clearAllFilters}
            isFiltered={isFiltered}
          />

          {/* Résumé des résultats */}
          {isFiltered && (
            <Card className="bg-thai-cream/30 border-thai-green/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-thai-green font-medium">
                    Résultats filtrés: {commandesFiltered.length + evenementsFiltered.length} élément(s)
                  </span>
                  <span className="text-thai-green/70">
                    {commandesFiltered.length} commande(s) • {evenementsFiltered.length} événement(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Suivi des Commandes */}
          <Card className="shadow-xl border-thai-orange/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                <Clock className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Suivi de vos commandes
              </CardTitle>
              <CardDescription>
                Commandes en cours de traitement ou confirmées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCommandes ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-thai-orange" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : commandesEnCours.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="hover:shadow-sm transition-shadow duration-200">
                    <TableHeader>
                      <TableRow className="hover:bg-gradient-to-r hover:from-thai-orange/5 hover:to-thai-orange/10 transition-all duration-200">
                        <TableHead className="text-center font-semibold text-thai-green w-1/4">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4 text-thai-orange" />
                            <span>Date de retrait</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Utensils className="h-4 w-4 text-thai-orange" />
                            <span>Plats commandés</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Euro className="h-4 w-4 text-thai-orange" />
                            <span>Total</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <BarChart3 className="h-4 w-4 text-thai-orange" />
                            <span>Statut</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4 text-thai-orange" />
                            <span>Actions</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commandesEnCours.map(c => {
                        const canEdit =
                          c.statut_commande !== 'Prête à récupérer' &&
                          c.statut_commande !== 'Récupérée';
                        return (
                          <TableRow key={c.idcommande} className="hover:bg-gradient-to-r hover:from-thai-orange/5 hover:to-transparent transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                            <TableCell className="text-center">
                              <FormattedDate date={c.date_et_heure_de_retrait_souhaitees} />
                            </TableCell>
                            <TableCell className="text-center">
                              <DishList details={(c.details || []) as Array<DetailCommande & { plat: Plat | null }>} formatPrix={formatPrix} />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormattedPrice 
                                prix={calculateTotal(c)} 
                                formatPrix={formatPrix} 
                                details={c.details?.map(d => ({
                                  plat: d.plat ? { plat: d.plat.plat, prix: d.plat.prix } : null,
                                  quantite_plat_commande: d.quantite_plat_commande
                                }))}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <StatusBadge statut={c.statut_commande} type="commande" />
                            </TableCell>
                            <TableCell className="text-center">
                              <CommandeActionButtons commandeId={c.idcommande} canEdit={canEdit} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="commandes-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Section Historique des Commandes */}
          <Card className="shadow-xl border-thai-orange/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                <History className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Historique de vos commandes
              </CardTitle>
              <CardDescription>
                Vos 10 dernières commandes terminées (récupérées ou annulées).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commandesHistorique.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="hover:shadow-sm transition-shadow duration-200">
                    <TableHeader>
                      <TableRow className="hover:bg-gradient-to-r hover:from-thai-orange/5 hover:to-thai-orange/10 transition-all duration-200">
                        <TableHead className="text-center font-semibold text-thai-green w-1/4">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4 text-thai-orange" />
                            <span>Date de retrait</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Utensils className="h-4 w-4 text-thai-orange" />
                            <span>Plats commandés</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Euro className="h-4 w-4 text-thai-orange" />
                            <span>Total</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <BarChart3 className="h-4 w-4 text-thai-orange" />
                            <span>Statut</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4 text-thai-orange" />
                            <span>Actions</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commandesHistorique.map(c => (
                        <TableRow key={c.idcommande} className="hover:bg-gradient-to-r hover:from-thai-orange/5 hover:to-transparent transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                          <TableCell className="text-center">
                            <FormattedDate date={c.date_et_heure_de_retrait_souhaitees} />
                          </TableCell>
                          <TableCell className="text-center">
                            <DishList details={(c.details || []) as Array<DetailCommande & { plat: Plat | null }>} formatPrix={formatPrix} />
                          </TableCell>
                          <TableCell className="text-center">
                            <FormattedPrice 
                              prix={calculateTotal(c)} 
                              formatPrix={formatPrix} 
                              details={c.details?.map(d => ({
                                plat: d.plat ? { plat: d.plat.plat, prix: d.plat.prix } : null,
                                quantite_plat_commande: d.quantite_plat_commande
                              }))}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge statut={c.statut_commande} type="commande" />
                          </TableCell>
                          <TableCell className="text-center">
                            <CommandeActionButtons commandeId={c.idcommande} canEdit={false} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="commandes-historique" />
              )}
            </CardContent>
          </Card>

          {/* Section Suivi des Événements */}
          <Card className="shadow-xl border-thai-green/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                <Clock className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Suivi de vos événements
              </CardTitle>
              <CardDescription>
                Événements en cours de traitement ou confirmés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEvenements ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-thai-orange" />
                </div>
              ) : errorEvenements ? (
                <Alert variant="destructive">
                  <AlertDescription>{errorEvenements.message}</AlertDescription>
                </Alert>
              ) : evenementsEnCours.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="hover:shadow-sm transition-shadow duration-200">
                    <TableHeader>
                      <TableRow className="hover:bg-gradient-to-r hover:from-thai-green/5 hover:to-thai-green/10 transition-all duration-200">
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <PartyPopper className="h-4 w-4 text-thai-orange" />
                            <span>Événement</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4 text-thai-orange" />
                            <span>Date prévue</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-thai-orange" />
                            <span>Personnes</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <BarChart3 className="h-4 w-4 text-thai-orange" />
                            <span>Statut</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4 text-thai-orange" />
                            <span>Actions</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evenementsEnCours.map(evt => {
                        const canEdit =
                          evt.statut_evenement !== 'Réalisé' &&
                          evt.statut_evenement !== 'Payé intégralement';
                        return (
                          <TableRow key={evt.idevenements} className="hover:bg-gradient-to-r hover:from-thai-green/5 hover:to-transparent transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                            <TableCell className="text-center">
                              <FormattedEvent event={evt} />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormattedDate date={evt.date_evenement} />
                            </TableCell>
                            <TableCell className="text-center">
                              <PersonCount count={evt.nombre_de_personnes} />
                            </TableCell>
                            <TableCell className="text-center">
                              <StatusBadge statut={evt.statut_evenement} type="evenement" />
                            </TableCell>
                            <TableCell className="text-center">
                              <EvenementActionButtons evenementId={evt.idevenements} canEdit={canEdit} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="evenements-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Section Historique des Événements */}
          <Card className="shadow-xl border-thai-green/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                <History className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Historique de vos événements
              </CardTitle>
              <CardDescription>
                Événements terminés (réalisés ou annulés).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evenementsHistorique.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="hover:shadow-sm transition-shadow duration-200">
                    <TableHeader>
                      <TableRow className="hover:bg-gradient-to-r hover:from-thai-green/5 hover:to-thai-green/10 transition-all duration-200">
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <PartyPopper className="h-4 w-4 text-thai-orange" />
                            <span>Événement</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4 text-thai-orange" />
                            <span>Date prévue</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-thai-orange" />
                            <span>Personnes</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <BarChart3 className="h-4 w-4 text-thai-orange" />
                            <span>Statut</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-thai-green">
                          <div className="flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4 text-thai-orange" />
                            <span>Actions</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evenementsHistorique.map(evt => (
                        <TableRow key={evt.idevenements} className="hover:bg-gradient-to-r hover:from-thai-green/5 hover:to-transparent transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                          <TableCell className="text-center">
                            <FormattedEvent event={evt} />
                          </TableCell>
                          <TableCell className="text-center">
                            <FormattedDate date={evt.date_evenement} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PersonCount count={evt.nombre_de_personnes} />
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge statut={evt.statut_evenement} type="evenement" />
                          </TableCell>
                          <TableCell className="text-center">
                            <EvenementActionButtons evenementId={evt.idevenements} canEdit={false} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="evenements-historique" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
});

HistoriquePage.displayName = 'HistoriquePage';

export default HistoriquePage;

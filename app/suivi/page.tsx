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
import { Loader2, Clock, Calendar, Utensils, Euro, BarChart3, Zap, PartyPopper, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CommandeUI, DetailCommande, Plat } from '@/types/app';
import { AppLayout } from '@/components/AppLayout';

// Composants optimisés
import { StatusBadge } from '@/components/historique/StatusBadge';
import { FormattedPrice, FormattedDate, FormattedEvent, PersonCount, DishList } from '@/components/historique/FormattedDisplay';
import { CommandeActionButtons, EvenementActionButtons } from '@/components/historique/ActionButtons';
import { EmptyState } from '@/components/historique/EmptyState';

export const dynamic = 'force-dynamic';

// Utilisation du type existant CommandeUI qui contient déjà les détails
type CommandeAvecDetails = CommandeUI;

const SuiviPage = memo(() => {
  const { currentUser } = useAuth();
  const {
    data: commandes,
    isLoading: isLoadingCommandes,
    error,
  } = useCommandesByClient(currentUser?.id);
  const {
    data: evenements,
    isLoading: isLoadingEvenements,
    error: errorEvenements,
  } = useEvenementsByClient(currentUser?.id);

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

  // Filtrer uniquement les éléments en cours avec memoization
  const { commandesEnCours, evenementsEnCours } = useMemo(() => {
    const commandesEnCours = (commandes || []).filter(
      c => c.statut_commande !== 'Annulée' && c.statut_commande !== 'Récupérée'
    );

    const evenementsEnCours = (evenements || []).filter(
      e => e.statut_evenement !== 'Réalisé' && e.statut_evenement !== 'Annulé'
    );

    return { commandesEnCours, evenementsEnCours };
  }, [commandes, evenements]);

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
              pour voir le suivi de vos commandes et événements.
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
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-thai-green">
              Suivi de vos commandes et événements
            </h1>
            <p className="text-thai-green/80 max-w-2xl mx-auto">
              Retrouvez ici toutes vos commandes et événements en cours de traitement ou confirmés.
            </p>
          </div>

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
                                  plat: d.plat ? { plat: d.plat.plat, prix: d.plat.prix || 0 } : null,
                                  quantite_plat_commande: d.quantite_plat_commande || 0
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

          {/* Lien vers l'historique complet */}
          <Card className="bg-thai-cream/30 border-thai-orange/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-thai-green mb-2">
                Besoin de consulter votre historique complet ?
              </h3>
              <Link 
                href="/historique"
                className="inline-flex items-center gap-2 px-4 py-2 bg-thai-orange text-white rounded-lg hover:bg-thai-orange-dark transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Voir l'historique complet
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
});

SuiviPage.displayName = 'SuiviPage';

export default SuiviPage;
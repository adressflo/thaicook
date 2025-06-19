import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
// Utilisation des hooks Supabase
import { useCommandesByClient, useEvenementsByClient } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PackageSearch, Calendar, Clock, History, Edit, Eye, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
// Importe les types de base depuis votre fichier supabase.ts
import type { Commande, DetailsCommande, Plat, Evenement } from '@/types/supabase';

// Type pour représenter une commande enrichie avec ses détails
type CommandeAvecDetails = Commande & {
  details: (DetailsCommande & {
    plat: Plat | null;
  })[];
};

const HistoriqueClient = memo(() => {
  const { currentUser } = useAuth();
  const { data: commandes, isLoading: isLoadingCommandes, error } = useCommandesByClient(currentUser?.uid);
  const { data: evenements, isLoading: isLoadingEvenements, error: errorEvenements } = useEvenementsByClient(currentUser?.uid);

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  // Fonction pour calculer le total de la commande à partir de ses détails
  const calculateTotal = (commande: CommandeAvecDetails): number => {
    if (!commande.details) return 0;
    return commande.details.reduce((acc, detail) => {
        const prix = detail.plat?.prix || 0;
        const quantite = detail.quantite_plat_commande || 0;
        return acc + (prix * quantite);
    }, 0);
  };

  // Fonction pour styliser les prix comme le bouton "Voir" avec centrage
  const formatPrixWithStyle = (prix: number): JSX.Element => {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 min-w-[80px]">
          {formatPrix(prix)}
        </span>
      </div>
    );
  };

  // Fonction pour styliser les dates avec meilleur alignement (avec jour de la semaine)
  const formatDateWithStyle = (date: string | null): JSX.Element => {
    if (!date) {
      return (
        <div className="flex justify-center">
          <span className="text-gray-500 text-sm">Non définie</span>
        </div>
      );
    }
    
    const formattedDate = format(new Date(date), 'eeee dd MMMM HH:mm', { locale: fr });
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 min-w-[140px]">
          {formattedDate}
        </span>
      </div>
    );
  };

  // Fonction pour styliser les événements avec meilleur alignement (nom uniquement)
  const formatEvenementWithStyle = (evt: Evenement): JSX.Element => {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 min-w-[120px]">
          <span className="font-medium">{evt.nom_evenement}</span>
        </div>
      </div>
    );
  };

  // Fonction pour styliser les statuts avec centrage
  const formatStatutWithStyle = (statut: string | null, type: 'commande' | 'evenement'): JSX.Element => {
    if (!statut) {
      return (
        <div className="flex justify-center">
          <span className="text-gray-500 text-sm">Inconnu</span>
        </div>
      );
    }

    let colorClasses = '';
    let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'outline';

    if (type === 'commande') {
      if (statut === 'Confirmée' || statut === 'Récupérée') {
        colorClasses = 'bg-green-100 text-green-800 border-green-300';
        variant = 'default';
      } else if (statut === 'En attente de confirmation') {
        colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        variant = 'secondary';
      } else if (statut === 'Annulée') {
        colorClasses = 'bg-red-100 text-red-800 border-red-300';
        variant = 'destructive';
      } else {
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-300';
      }
    } else {
      if (statut === 'Confirmé / Acompte reçu' || statut === 'Payé intégralement' || statut === 'Réalisé') {
        colorClasses = 'bg-green-100 text-green-800 border-green-300';
        variant = 'default';
      } else if (statut === 'En préparation' || statut === 'Contact établi') {
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-300';
        variant = 'secondary';
      } else if (statut === 'Annulé') {
        colorClasses = 'bg-red-100 text-red-800 border-red-300';
        variant = 'destructive';
      } else {
        colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      }
    }

    return (
      <div className="flex justify-center">
        <Badge 
          variant={variant} 
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 min-w-[100px]",
            colorClasses
          )}
        >
          {statut}
        </Badge>
      </div>
    );
  };
  const getPlatsNamesWithStyle = (commande: CommandeAvecDetails): JSX.Element => {
    if (!commande.details || commande.details.length === 0) {
      return <span className="text-gray-500">Aucun plat</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {commande.details.map((detail, index) => {
          const platName = detail.plat?.plat || 'Plat supprimé';
          const quantite = detail.quantite_plat_commande || 0;
          const displayName = quantite > 1 ? `${platName} (x${quantite})` : platName;
          
          return (
            <span
              key={index}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-thai-orange text-white hover:bg-thai-orange/80 h-9 px-3"
            >
              {displayName}
            </span>
          );
        })}
      </div>
    );
  };

  // Filtrer les commandes
  const commandesEnCours = commandes?.filter(c => 
    c.statut_commande !== 'Annulée' && c.statut_commande !== 'Récupérée'
  ) || [];
  
  const commandesHistorique = commandes?.filter(c => 
    c.statut_commande === 'Annulée' || c.statut_commande === 'Récupérée'
  ).slice(0, 10) || [];

  // Filtrer les événements
  const evenementsEnCours = evenements?.filter(e => 
    e.statut_evenement !== 'Réalisé' && e.statut_evenement !== 'Annulé'
  ) || [];
  
  const evenementsHistorique = evenements?.filter(e => 
    e.statut_evenement === 'Réalisé' || e.statut_evenement === 'Annulé'
  ) || [];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-thai p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            Veuillez vous <Link to="/profil" className="font-bold underline">connecter</Link> pour voir votre historique de commandes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-7xl space-y-8">
            
            {/* Section Suivi des Commandes */}
            <Card className="shadow-xl border-thai-orange/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                        <Clock className="h-6 w-6" />
                        Suivi de vos commandes
                    </CardTitle>
                    <CardDescription>Commandes en cours de traitement ou confirmées.</CardDescription>
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Date de retrait</TableHead>
                                        <TableHead className="text-center">Plats commandés</TableHead>
                                        <TableHead className="text-center">Total</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandesEnCours.map((c) => {
                                        const canEdit = c.statut_commande !== 'Prête à récupérer' && c.statut_commande !== 'Récupérée';
                                        return (
                                            <TableRow key={c.idcommande}>
                                                <TableCell className="text-center">
                                                    {formatDateWithStyle(c.date_et_heure_de_retrait_souhaitees)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getPlatsNamesWithStyle(c as CommandeAvecDetails)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatPrixWithStyle(calculateTotal(c as CommandeAvecDetails))}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatStatutWithStyle(c.statut_commande, 'commande')}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link to={`/suivi-commande/${c.idcommande}`}>
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Voir
                                                            </Link>
                                                        </Button>
                                                        {canEdit && (
                                                            <Button asChild variant="default" size="sm" className="bg-thai-orange hover:bg-thai-orange/80">
                                                                <Link to={`/modifier-commande/${c.idcommande}`}>
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Modifier
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                            <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande en cours</h3>
                            <p className="mt-1 text-sm text-gray-500">Vous n'avez pas de commande en cours de traitement.</p>
                            <div className="mt-6">
                                <Button asChild className="bg-thai-orange">
                                    <Link to="/commander">Commencer à commander</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section Historique des Commandes */}
            <Card className="shadow-xl border-thai-orange/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                        <History className="h-6 w-6" />
                        Historique de vos commandes
                    </CardTitle>
                    <CardDescription>Vos 10 dernières commandes terminées (récupérées ou annulées).</CardDescription>
                </CardHeader>
                <CardContent>
                    {commandesHistorique.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Date de retrait</TableHead>
                                        <TableHead className="text-center">Plats commandés</TableHead>
                                        <TableHead className="text-center">Total</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandesHistorique.map((c) => (
                                        <TableRow key={c.idcommande}>
                                            <TableCell className="text-center">
                                                {formatDateWithStyle(c.date_et_heure_de_retrait_souhaitees)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getPlatsNamesWithStyle(c as CommandeAvecDetails)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatPrixWithStyle(calculateTotal(c as CommandeAvecDetails))}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatStatutWithStyle(c.statut_commande, 'commande')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/suivi-commande/${c.idcommande}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Voir
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <History className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm">Aucun historique de commande pour le moment.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section Suivi des Événements */}
            <Card className="shadow-xl border-thai-green/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                        <Clock className="h-6 w-6" />
                        Suivi de vos événements
                    </CardTitle>
                    <CardDescription>Événements en cours de traitement ou confirmés.</CardDescription>
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Événement</TableHead>
                                        <TableHead className="text-center">Date prévue</TableHead>
                                        <TableHead className="text-center">Personnes</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {evenementsEnCours.map((evt) => {
                                        const canEdit = evt.statut_evenement !== 'Réalisé' && evt.statut_evenement !== 'Payé intégralement';
                                        return (
                                            <TableRow key={evt.idevenements}>
                                                <TableCell className="text-center">
                                                    {formatEvenementWithStyle(evt)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatDateWithStyle(evt.date_evenement)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center">
                                                        <div className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium border border-input bg-background h-9 px-3 min-w-[60px]">
                                                            <Users className="h-4 w-4 text-gray-500" />
                                                            <span>{evt.nombre_de_personnes || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatStatutWithStyle(evt.statut_evenement, 'evenement')}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link to={`/suivi-evenement/${evt.idevenements}`}>
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Voir
                                                            </Link>
                                                        </Button>
                                                        {canEdit && (
                                                            <Button asChild variant="default" size="sm" className="bg-thai-green hover:bg-thai-green/80">
                                                                <Link to={`/modifier-evenement/${evt.idevenements}`}>
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Modifier
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun événement en cours</h3>
                            <p className="mt-1 text-sm text-gray-500">Vous n'avez pas d'événement en cours de traitement.</p>
                            <div className="mt-6">
                                <Button asChild className="bg-thai-green">
                                    <Link to="/evenements">Organiser un événement</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section Historique des Événements */}
            <Card className="shadow-xl border-thai-green/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-thai-green flex items-center gap-2">
                        <History className="h-6 w-6" />
                        Historique de vos événements
                    </CardTitle>
                    <CardDescription>Événements terminés (réalisés ou annulés).</CardDescription>
                </CardHeader>
                <CardContent>
                    {evenementsHistorique.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Événement</TableHead>
                                        <TableHead className="text-center">Date prévue</TableHead>
                                        <TableHead className="text-center">Personnes</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {evenementsHistorique.map((evt) => (
                                        <TableRow key={evt.idevenements}>
                                            <TableCell className="text-center">
                                                {formatEvenementWithStyle(evt)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatDateWithStyle(evt.date_evenement)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <div className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium border border-input bg-background h-9 px-3 min-w-[60px]">
                                                        <Users className="h-4 w-4 text-gray-500" />
                                                        <span>{evt.nombre_de_personnes || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatStatutWithStyle(evt.statut_evenement, 'evenement')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/suivi-evenement/${evt.idevenements}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Voir
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <History className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm">Aucun historique d'événement pour le moment.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
});

HistoriqueClient.displayName = 'HistoriqueClient';
export default HistoriqueClient;
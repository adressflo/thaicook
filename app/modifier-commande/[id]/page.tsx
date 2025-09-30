'use client';

import { Badge } from '@/components/ui/badge';
import { DishDetailsModalComplex } from '@/components/historique/DishDetailsModalComplex';
import { DishDetailsModalInteractive } from '@/components/historique/DishDetailsModalInteractive';
import { ExtraDetailsModalInteractive } from '@/components/historique/ExtraDetailsModalInteractive';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIconLucide,
  ChevronRight,
  Clock,
  CreditCard,
  Edit,
  Loader2,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { redirect, useParams, useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { addDays, format, getDay, isFuture, isSameDay, startOfDay, type Day } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useCommandeById, useCreateCommande, useDeleteCommande, useExtras } from '@/hooks/useSupabaseData';
import { extractRouteParam } from '@/lib/params-utils';
import { supabase } from '@/services/supabaseService';
import type { PlatUI as Plat, PlatPanier, DetailCommande } from '@/types/app';

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

const ModifierCommande = memo(() => {
  const params = useParams();
  const id = extractRouteParam(params?.id);
  const router = useRouter();
  const { toast } = useToast();
  const { plats, isLoading: dataIsLoading } = useData();
  const { currentUser, isLoadingAuth } = useAuth();
  const {
    data: commande,
    isLoading: isLoadingCommande,
    error: commandeError,
  } = useCommandeById(id ? Number(id) : undefined, currentUser?.uid);
  const createCommande = useCreateCommande();
  const deleteCommande = useDeleteCommande();
  const { data: extras } = useExtras();
  const isMobile = useIsMobile();
  const platsSectionRef = useRef<HTMLDivElement>(null);

  // États pour la modification
  const [panierModification, setPanierModification] = useState<PlatPanier[]>([]);
  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // États pour la UI mobile et sidebar
  const [isCartCollapsed, setIsCartCollapsed] = useState(true);
  const [highlightedPlatId, setHighlightedPlatId] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<{
    panierOriginal: PlatPanier[];
    dateOriginale: Date | undefined;
    heureOriginale: string;
    demandesOriginales: string;
  } | null>(null);

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  // Fonction pour obtenir la bonne photo URL pour un item
  const getItemPhotoUrl = (item: PlatPanier): string | undefined => {
    // Si c'est un extra (extra), utiliser la photo de la table extras_db
    if (item.type === 'extra' && extras) {
      // Extraire l'ID de l'extra depuis l'ID du panier (format: "extra-123")
      const extraId = parseInt(item.id.replace('extra-', '')) || 0;
      const extraData = extras.find(extra => extra.idextra === extraId);
      return extraData?.photo_url ?? 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
    }
    // Sinon, utiliser la photo du plat normal
    const platData = plats?.find(p => p.idplats.toString() === item.id);
    return platData?.photo_du_plat ?? undefined;
  };

  // Initialiser les données de la commande
  useEffect(() => {
    if (commande && plats && extras && commande.details && commande.details.length > 0) {
      const platsPanier: PlatPanier[] = [];

      commande.details.forEach((detail, index) => {
        if (detail.quantite_plat_commande) {
          // Utiliser les données enrichies du hook useCommandesByClient
          // La logique d'enrichissement y est déjà appliquée

          // Vérifier si c'est un extra (nouveau ou ancien système)
          const isExtraNewSystem = !detail.plat && detail.plat_r && detail.plat_r > 0;
          const isExtraOldSystem = detail.plat_r === 0 && detail.nom_plat && detail.plat?.plat === 'Extra (Complément divers)';
          const isExtra = detail.type === 'extra' || isExtraNewSystem || isExtraOldSystem;

          if (isExtra) {
            // Utiliser les données enrichies (extra, nom_plat, prix_unitaire)
            const extraNom = detail.nom_plat || detail.extra?.nom_extra || 'Extra';
            const extraPrix = detail.prix_unitaire || detail.extra?.prix || 0;
            const extraId = detail.extra?.idextra || detail.plat_r || detail.iddetails || index;

            console.log('Extra détecté:', { extraNom, extraPrix, extraId, detail });

            platsPanier.push({
              id: `extra-${extraId}`,
              nom: extraNom,
              prix: extraPrix,
              quantite: detail.quantite_plat_commande,
              dateRetrait: commande.date_et_heure_de_retrait_souhaitees
                ? new Date(commande.date_et_heure_de_retrait_souhaitees)
                : new Date(),
              jourCommande: '',
              uniqueId: `extra-${extraId}-${Date.now()}`,
              type: 'extra',
            });
          } else {
            // Gérer les plats normaux
            const platData = detail.plat || plats.find(p => p.idplats === detail.plat_r);
            if (platData) {
              platsPanier.push({
                id: platData.idplats.toString(),
                nom: platData.plat,
                prix: platData.prix || 0,
                quantite: detail.quantite_plat_commande,
                dateRetrait: commande.date_et_heure_de_retrait_souhaitees
                  ? new Date(commande.date_et_heure_de_retrait_souhaitees)
                  : new Date(),
                jourCommande: '',
                uniqueId: `${platData.idplats}-${index}-${Date.now()}`,
                type: 'plat',
              });
            }
          }
        }
      });

      console.log('Initialisation panier modification:', platsPanier);
      setPanierModification(platsPanier);

      // Initialiser la date et l'heure
      let dateInit: Date | undefined;
      let heureInit = '';
      if (commande.date_et_heure_de_retrait_souhaitees) {
        const dateCommande = new Date(commande.date_et_heure_de_retrait_souhaitees);
        dateInit = dateCommande;
        setDateRetrait(dateCommande);
        heureInit = format(dateCommande, 'HH:mm');
        setHeureRetrait(heureInit);

        const jourDate = format(dateCommande, 'eeee', { locale: fr }).toLowerCase();
        setJourSelectionne(jourDate);
      }

      const demandesInit = commande.demande_special_pour_la_commande || '';
      setDemandesSpeciales(demandesInit);

      // Sauvegarder les données originales pour la restauration
      setOriginalData({
        panierOriginal: [...platsPanier],
        dateOriginale: dateInit,
        heureOriginale: heureInit,
        demandesOriginales: demandesInit,
      });

      // Ouvrir automatiquement la sidebar si il y a des articles
      if (platsPanier.length > 0) {
        setIsCartCollapsed(false);
      }
    }
  }, [commande, plats, extras]);

  // Vérifier les changements
  useEffect(() => {
    if (!commande) return;

    const originalTotal =
      commande.details?.reduce((total, detail) => {
        const quantite = detail.quantite_plat_commande || 0;
        let prixUnitaire = 0;
        
        // Gérer les extras vs plats normaux (architecture hybride)
        const platCorrespondant = plats?.find(p => p.idplats === detail.plat_r);
        const isExtra = !platCorrespondant && detail.plat_r;
        if (isExtra) {
          const extraData = extras?.find(e => e.idextra === detail.plat_r);
          prixUnitaire = extraData?.prix || detail.prix_unitaire || 0;
        } else {
          prixUnitaire = detail.plat?.prix || 0;
        }
        
        return total + prixUnitaire * quantite;
      }, 0) || 0;

    const newTotal = panierModification.reduce(
      (total, item) => total + item.prix * item.quantite,
      0
    );

    const dateChanged = commande.date_et_heure_de_retrait_souhaitees
      ? !dateRetrait ||
        !isSameDay(new Date(commande.date_et_heure_de_retrait_souhaitees), dateRetrait)
      : dateRetrait !== undefined;

    const heureChanged = commande.date_et_heure_de_retrait_souhaitees
      ? heureRetrait !== format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'HH:mm')
      : heureRetrait !== '';

    const demandesChanged = (commande.demande_special_pour_la_commande || '') !== demandesSpeciales;
    const totalChanged = Math.abs(originalTotal - newTotal) > 0.01;
    const articlesChanged = (commande.details?.length || 0) !== panierModification.length;

    setHasChanges(
      dateChanged || heureChanged || demandesChanged || totalChanged || articlesChanged
    );
  }, [commande, panierModification, dateRetrait, heureRetrait, demandesSpeciales]);

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return [];
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
    return plats.filter(plat =>
      plat[champDispoKey] === 'oui' && plat.idplats !== 0 // Exclure les anciens extras
    );
  }, [jourSelectionne, plats]);

  // Extras disponibles (toujours disponibles)
  const extrasDisponibles = useMemo(() => {
    if (!extras) return [];
    return extras.filter(extra => extra.est_disponible);
  }, [extras]);

  const joursOuverture = useMemo(() => {
    const joursMap = [
      { key: 'lundi_dispo', value: 'lundi', label: 'Lundi' },
      { key: 'mardi_dispo', value: 'mardi', label: 'Mardi' },
      { key: 'mercredi_dispo', value: 'mercredi', label: 'Mercredi' },
      { key: 'jeudi_dispo', value: 'jeudi', label: 'Jeudi' },
      { key: 'vendredi_dispo', value: 'vendredi', label: 'Vendredi' },
      { key: 'samedi_dispo', value: 'samedi', label: 'Samedi' },
      { key: 'dimanche_dispo', value: 'dimanche', label: 'Dimanche' },
    ];

    return joursMap.filter(
      jour => plats?.some(plat => plat[jour.key as keyof typeof plat] === 'oui') || false
    );
  }, [plats]);

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    const heureActuelle = new Date(0);
    heureActuelle.setHours(18, 0, 0, 0);
    const heureFin = new Date(0);
    heureFin.setHours(20, 30, 0, 0);
    while (heureActuelle <= heureFin) {
      heures.push(format(heureActuelle, 'HH:mm'));
      heureActuelle.setMinutes(heureActuelle.getMinutes() + 5);
    }
    return heures;
  }, []);

  useEffect(() => {
    if (jourSelectionne && jourSelectionne in dayNameToNumber) {
      const targetDayNumber = dayNameToNumber[jourSelectionne];
      const today = startOfDay(new Date());
      const calculatedDates: Date[] = [];

      let currentDate = today;
      let foundDates = 0;

      while (foundDates < 8) {
        if (
          getDay(currentDate) === targetDayNumber &&
          (isSameDay(currentDate, today) || isFuture(currentDate))
        ) {
          calculatedDates.push(startOfDay(currentDate));
          foundDates++;
        }
        currentDate = addDays(currentDate, 1);
      }

      setAllowedDates(calculatedDates);
      if (dateRetrait && !calculatedDates.some(d => isSameDay(d, dateRetrait))) {
        setDateRetrait(undefined);
      }
    } else {
      setAllowedDates([]);
    }
  }, [jourSelectionne, dateRetrait]);

  // Scroll automatique vers la section des plats
  useEffect(() => {
    if (jourSelectionne && dateRetrait && heureRetrait && platsSectionRef.current) {
      setTimeout(() => {
        platsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [jourSelectionne, dateRetrait, heureRetrait]);

  const handleAjouterAuPanier = (plat: Plat) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return;

    if (!jourSelectionne || !dateRetrait || !heureRetrait) {
      toast({
        title: 'Informations requises',
        description: "Veuillez d'abord sélectionner un jour, une date et une heure de retrait.",
        variant: 'destructive',
      });
      return;
    }

    const dateCompleteRetrait = new Date(dateRetrait);
    const [heures, minutes] = heureRetrait.split(':');
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);

    const newItem: PlatPanier = {
      id: plat.idplats.toString(),
      nom: plat.plat,
      prix: plat.prix ?? 0,
      quantite: 1,
      jourCommande: jourSelectionne,
      dateRetrait: dateCompleteRetrait,
      uniqueId: `${plat.idplats}-${Date.now()}`,
      type: 'plat',
    };

    setPanierModification(prev => [...prev, newItem]);

    // Ouvrir automatiquement le panier sur ajout d'article
    if (!isCartCollapsed) {
      setIsCartCollapsed(false);
    }

    toast({
      title: 'Plat ajouté !',
      description: `${plat.plat} a été ajouté à votre commande modifiée.`,
    });
  };

  const handleAjouterExtraAuPanier = (extra: any) => {
    if (!extra.idextra || !extra.nom_extra || extra.prix === undefined) return;

    if (!dateRetrait || !heureRetrait) {
      toast({
        title: 'Informations requises',
        description: "Veuillez d'abord sélectionner une date et une heure de retrait.",
        variant: 'destructive',
      });
      return;
    }

    const dateCompleteRetrait = new Date(dateRetrait);
    const [heures, minutes] = heureRetrait.split(':');
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);

    const newItem: PlatPanier = {
      id: `extra-${extra.idextra}`,
      nom: extra.nom_extra,
      prix: extra.prix ?? 0,
      quantite: 1,
      jourCommande: jourSelectionne || '',
      dateRetrait: dateCompleteRetrait,
      uniqueId: `extra-${extra.idextra}-${Date.now()}`,
      type: 'extra',
    };

    setPanierModification(prev => [...prev, newItem]);

    // Ouvrir automatiquement le panier sur ajout d'article
    if (!isCartCollapsed) {
      setIsCartCollapsed(false);
    }

    toast({
      title: 'Extra ajouté !',
      description: `${extra.nom_extra} a été ajouté à votre commande modifiée.`,
    });
  };

  const totalPrixModification = useMemo(() => {
    return panierModification.reduce((total, item) => total + item.prix * item.quantite, 0);
  }, [panierModification]);

  // Loading states
  if (isLoadingAuth || isLoadingCommande || dataIsLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-16 w-16 animate-spin text-thai-orange' />
      </div>
    );
  }

  // Error states
  if (commandeError || !commande) {
    return (
      <div className='flex h-screen items-center justify-center bg-gradient-thai p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Impossible de charger cette commande.</AlertDescription>
          <Button asChild variant='secondary' className='mt-4'>
            <Link href='/historique'>Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  // Vérifier permissions
  if (currentUser?.uid !== commande.client_r) {
    redirect('/historique');
  }

  if (
    commande.statut_commande &&
    !['En attente de confirmation', 'Confirmée'].includes(commande.statut_commande)
  ) {
    return (
      <div className='flex h-screen items-center justify-center bg-gradient-thai p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Cette commande ne peut plus être modifiée (statut: {commande.statut_commande}).
          </AlertDescription>
          <Button asChild variant='secondary' className='mt-4'>
            <Link href={`/suivi-commande/${commande.idcommande}`}>Voir la commande</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const modifierQuantiteItem = (uniqueId: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      setPanierModification(prev => prev.filter(item => item.uniqueId !== uniqueId));
      return;
    }
    setPanierModification(prev =>
      prev.map(item =>
        item.uniqueId === uniqueId ? { ...item, quantite: nouvelleQuantite } : item
      )
    );
  };

  const supprimerDuPanierItem = (uniqueId: string) => {
    setPanierModification(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const restaurerOriginal = () => {
    if (originalData) {
      setPanierModification([...originalData.panierOriginal]);
      setDateRetrait(originalData.dateOriginale);
      setHeureRetrait(originalData.heureOriginale);
      setDemandesSpeciales(originalData.demandesOriginales);

      if (originalData.dateOriginale) {
        const jourDate = format(originalData.dateOriginale, 'eeee', { locale: fr }).toLowerCase();
        setJourSelectionne(jourDate);
      }

      toast({
        title: 'Commande restaurée',
        description: 'Les modifications ont été annulées et les données originales restaurées.',
      });
    }
  };

  const sauvegarderModifications = async () => {
    console.log('Début sauvegarde, panier length:', panierModification.length);
    console.log('Commande ID:', commande?.idcommande);

    if (panierModification.length === 0) {
      // Si le panier est vide, mettre la commande en statut "Annulée"
      try {
        console.log("Tentative d'annulation de la commande:", commande.idcommande);

        // Mettre à jour le statut de la commande à "Annulée"
        const { error: updateError } = await supabase
          .from('commande_db')
          .update({
            statut_commande: 'Annulée' as const,
            notes_internes: 'Commande annulée - panier vidé par le client',
          })
          .eq('idcommande', commande.idcommande);

        if (updateError) {
          console.error('Erreur mise à jour statut:', updateError);
          throw updateError;
        }

        console.log('Annulation réussie');
        toast({
          title: 'Commande annulée',
          description: 'La commande a été annulée car elle était vide.',
        });

        // Navigation immédiate
        router.push('/historique');
        return;
      } catch (error: unknown) {
        console.error('Erreur annulation commande:', error);
        const errorMessage =
          error instanceof Error ? error.message : "Erreur lors de l'annulation.";
        toast({
          title: 'Erreur annulation',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!currentUser?.uid) {
      toast({
        title: 'Erreur utilisateur',
        description: "Impossible d'identifier l'utilisateur.",
        variant: 'destructive',
      });
      return;
    }

    try {
      // Annuler l'ancienne commande d'abord
      console.log("Annulation de l'ancienne commande avant création:", commande.idcommande);

      const { error: updateError } = await supabase
        .from('commande_db')
        .update({
          statut_commande: 'Annulée' as const,
          notes_internes: 'Commande annulée - modifiée par le client',
        })
        .eq('idcommande', commande.idcommande);

      if (updateError) {
        console.error('Erreur mise à jour statut:', updateError);
        throw updateError;
      }

      // Attendre un peu pour que la mise à jour soit effective
      await new Promise(resolve => setTimeout(resolve, 300));

      // Grouper les articles par date de retrait
      const groupedByDate = panierModification.reduce((groups, item) => {
        const dateKey = item.dateRetrait?.toISOString() || '';
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(item);
        return groups;
      }, {} as Record<string, PlatPanier[]>);

      let commandesCreees = 0;
      let derniereCommandeId: number | null = null;

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue;

        const nouvelleCommande = await createCommande.mutateAsync({
          client_r: currentUser.uid,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map(item => {
            // Distinguer les extras des plats normaux
            if (item.id.startsWith('extra-')) {
              const extraId = parseInt(item.id.replace('extra-', '')) || 0;
              return {
                plat_r: extraId, // Architecture hybride: plat_r vers extras_db.idextra
                quantite_plat_commande: item.quantite,
                nom_plat: item.nom,
                prix_unitaire: item.prix,
                type: 'extra'
              };
            } else {
              return {
                plat_r: parseInt(item.id),
                quantite_plat_commande: item.quantite,
              };
            }
          }),
        });

        commandesCreees++;
        derniereCommandeId = nouvelleCommande.idcommande;
      }

      const totalGeneral = panierModification.reduce((sum, item) => sum + item.prix * item.quantite, 0);

      toast({
        title: 'Commande(s) modifiée(s) !',
        description: `${commandesCreees} nouvelle${commandesCreees > 1 ? 's' : ''} commande${commandesCreees > 1 ? 's ont' : ' a'} été créée${commandesCreees > 1 ? 's' : ''} (${formatPrix(totalGeneral)}).`,
      });

      // Rediriger vers la dernière commande créée ou vers l'historique si plusieurs commandes
      if (commandesCreees === 1 && derniereCommandeId) {
        router.push(`/suivi-commande/${derniereCommandeId}`);
      } else {
        router.push('/historique');
      }
    } catch (error: unknown) {
      console.error('Erreur modification commande:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la modification.';
      toast({
        title: 'Erreur modification',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-thai py-8 px-4'>
      <div
        className={`container mx-auto transition-all duration-500 ${
          panierModification.length > 0 && !isCartCollapsed
            ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6'
            : 'max-w-5xl'
        }`}
      >
        {/* Section principale - Modification */}
        <div
          className={panierModification.length > 0 && !isCartCollapsed ? 'lg:col-span-1' : 'w-full'}
        >
          {/* Header avec navigation */}
          <div className='flex items-center justify-between mb-6'>
            <Button
              asChild
              variant='outline'
              className='group transform transition-all duration-200 hover:scale-105 hover:shadow-lg'
            >
              <Link
                href={`/suivi-commande/${commande.idcommande}`}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4 group-hover:-translate-x-1 transition-transform' />
                Retour au suivi
              </Link>
            </Button>

            <div className='flex items-center gap-3'>
              {hasChanges && (
                <Badge
                  variant='secondary'
                  className='bg-orange-100 text-orange-800 border-orange-300 animate-pulse'
                >
                  Modifications non sauvegardées
                </Badge>
              )}
              {hasChanges && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={restaurerOriginal}
                  className='text-gray-600 hover:text-gray-800'
                >
                  <RotateCcw className='h-4 w-4 mr-1' />
                  Restaurer
                </Button>
              )}
            </div>
          </div>

          {/* Bouton panier flottant mobile */}
          {!isMobile && isCartCollapsed && panierModification.length > 0 && (
            <div
              className='fixed top-1/2 right-0 -translate-y-1/2 cursor-pointer group z-40'
              onClick={() => setIsCartCollapsed(false)}
            >
              <div className='relative flex items-center justify-center w-20 h-20 bg-thai-green backdrop-blur-sm rounded-l-full transition-all duration-300 group-hover:scale-110 group-hover:bg-thai-green/80 shadow-lg'>
                <Edit className='h-8 w-8 text-white drop-shadow-lg' />
              </div>
              <Badge
                variant='secondary'
                className='absolute -top-1 -left-1 bg-white text-thai-orange font-bold text-base w-8 h-8 rounded-full flex items-center justify-center border-2 border-thai-gold shadow-lg'
              >
                {panierModification.reduce((total, item) => total + item.quantite, 0)}
              </Badge>
            </div>
          )}

          {/* Header de modification */}
          <Card className='shadow-xl border-thai-orange/20 mb-6'>
            <CardHeader className='text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4'>
              <div className='flex items-center justify-center mb-1'>
                <Edit className='h-7 w-7 mr-2' />
                <CardTitle className='text-2xl font-bold'>
                  Modifier la Commande #{commande.idcommande}
                </CardTitle>
              </div>
              <p className='text-white/90 text-xs'>
                Statut: {commande.statut_commande || 'En attente'}
              </p>
            </CardHeader>
          </Card>

          {/* Section date/heure et sélection du jour */}
          <Card className='shadow-xl border-thai-orange/20 mb-6'>
            <CardContent className='p-6'>
              {dateRetrait && heureRetrait && (
                <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center'>
                  <p className='text-sm text-green-800 font-medium'>
                    ✓ Retrait prévu le {format(dateRetrait, 'eeee dd MMMM', { locale: fr })} à{' '}
                    {heureRetrait}
                  </p>
                </div>
              )}
              <h3 className='text-lg font-semibold text-thai-green mb-4'>
                Modifier la date ou heure de retrait :
              </h3>
              <div className='grid md:grid-cols-2 gap-4 mb-6'>
                <div>
                  <Label htmlFor='dateRetrait'>Date de retrait *</Label>
                  <Select
                    onValueChange={value => setDateRetrait(new Date(value))}
                    value={dateRetrait?.toISOString() || ''}
                  >
                    <SelectTrigger className={cn(!dateRetrait && 'text-muted-foreground')}>
                      <CalendarIconLucide className='mr-2 h-4 w-4' />
                      <SelectValue>
                        {dateRetrait
                          ? format(dateRetrait, 'eeee dd MMMM', { locale: fr })
                          : 'Sélectionner une date'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {allowedDates.map(date => (
                        <SelectItem key={date.toISOString()} value={date.toISOString()}>
                          {format(date, 'eeee dd MMMM', { locale: fr })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='heureRetrait'>Heure de retrait *</Label>
                  <Select onValueChange={setHeureRetrait} value={heureRetrait}>
                    <SelectTrigger className={cn(!heureRetrait && 'text-green-700')}>
                      <Clock className='mr-2 h-4 w-4' />
                      <SelectValue placeholder='Sélectionner' />
                    </SelectTrigger>
                    <SelectContent>
                      {heuresDisponibles.map(h => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className='text-md font-semibold text-thai-green mb-3 block'>
                  Ou choisissez un autre jour de la semaine pour modifier le menu :
                </Label>
                <div className='flex flex-wrap gap-2 sm:gap-3'>
                  {joursOuverture.map(jour => (
                    <Button
                      key={jour.value}
                      variant={jourSelectionne === jour.value ? 'default' : 'outline'}
                      onClick={() => setJourSelectionne(jour.value)}
                      className={cn(
                        'px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-md transition-all duration-200 hover:scale-105',
                        jourSelectionne === jour.value
                          ? 'bg-thai-orange text-white'
                          : 'border-thai-orange text-thai-orange bg-white hover:bg-thai-orange/10'
                      )}
                    >
                      {jour.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles actuels - Version principale (toujours visible) */}
          <Card className='shadow-xl border-thai-orange/20 mb-6'>
            <CardContent className='p-6'>
              {panierModification.length === 0 ? (
                <div className='text-center py-12 border border-dashed border-thai-orange/30 rounded-lg bg-thai-cream/20'>
                  <ShoppingCart className='h-12 w-12 text-thai-orange/50 mx-auto mb-3' />
                  <p className='text-thai-green font-medium'>Aucun article dans cette commande.</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {(() => {
                    const groupedByDate = panierModification.reduce((groups, item) => {
                      const dateKey = item.dateRetrait?.toDateString() || 'no-date';
                      if (!groups[dateKey]) {
                        groups[dateKey] = [];
                      }
                      groups[dateKey].push(item);
                      return groups;
                    }, {} as Record<string, PlatPanier[]>);

                    return Object.entries(groupedByDate).map(([dateKey, items]) => {
                      const dateRetrait = items[0]?.dateRetrait;

                      return (
                        <div
                          key={dateKey}
                          className='mb-4 border border-thai-orange/20 rounded-lg p-3 bg-thai-cream/20 animate-fade-in transition-all duration-300 hover:shadow-md hover:border-thai-orange/30 hover:bg-thai-cream/30'
                        >
                          {dateRetrait && (
                            <div className='mb-2 pb-2 border-b border-thai-orange/10'>
                              <h4 className='font-semibold text-thai-green flex items-center gap-2 text-base'>
                                <CalendarIconLucide className='h-4 w-4 text-thai-orange' />
                                Retrait prévu le{' '}
                                <span className='text-thai-orange font-bold'>
                                  {format(dateRetrait, 'eeee dd MMMM', { locale: fr }).replace(
                                    /^\w/,
                                    c => c.toUpperCase()
                                  )}{' '}
                                  à {format(dateRetrait, 'HH:mm')}
                                </span>
                              </h4>
                            </div>
                          )}

                          <div className='space-y-3'>
                            {items.map(item => {

                              // Pour les extras, pas de platData correspondant
                              const platData = item.type === 'extra'
                                ? null
                                : plats?.find(p => p.id.toString() === item.id);

                              // Prepare detail object for modal (matching the expected type)
                              const itemId = item.type === 'extra'
                                ? parseInt(item.id.replace('extra-', '')) || 0
                                : parseInt(item.id);

                              // Pour les extras, récupérer les vraies données depuis extras
                              const extraData = item.type === 'extra' && extras
                                ? extras.find(e => e.idextra === itemId)
                                : null;

                              const detailForModal: DetailCommande & { plat: any; extra: any } = {
                                commande_r: commande?.idcommande || 0,
                                iddetails: itemId,
                                plat_r: itemId, // Architecture hybride: plat_r pointe vers plats_db ou extras_db
                                extra_id: item.type === 'extra' ? itemId : null, // ID de l'extra si c'est un extra
                                quantite_plat_commande: item.quantite,
                                prix_unitaire: extraData?.prix || item.prix,
                                nom_plat: extraData?.nom_extra || item.nom,
                                type: (item.type === 'extra' ? 'extra' : 'plat') as 'plat' | 'extra' | null,
                                plat: item.type === 'extra' ? null : {
                                  idplats: itemId,
                                  plat: item.nom,
                                  prix: item.prix,
                                  description: platData?.description || null,
                                  photo_du_plat: platData?.photo_du_plat || null,
                                  dimanche_dispo: null,
                                  lundi_dispo: null,
                                  mardi_dispo: null,
                                  mercredi_dispo: null,
                                  jeudi_dispo: '',
                                  vendredi_dispo: null,
                                  samedi_dispo: null,
                                  est_epuise: null,
                                  epuise_depuis: null,
                                  epuise_jusqu_a: null,
                                  nom_plat: item.nom
                                },
                                extra: item.type === 'extra' ? {
                                  idextra: itemId,
                                  nom_extra: extraData?.nom_extra || item.nom,
                                  prix: extraData?.prix || item.prix,
                                  description: extraData?.description || null,
                                  photo_url: extraData?.photo_url || getItemPhotoUrl(item) || null,
                                  actif: extraData?.est_disponible ?? true,
                                  created_at: extraData?.created_at || new Date().toISOString(),
                                  updated_at: extraData?.updated_at || new Date().toISOString()
                                } : null
                              };

                              return (
                                <DishDetailsModalComplex
                                  key={item.uniqueId}
                                  detail={detailForModal}
                                  formatPrix={formatPrix}
                                >
                                  <div className='flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform cursor-pointer'>
                                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                      {getItemPhotoUrl(item) ? (
                                        <img
                                          src={getItemPhotoUrl(item)}
                                          alt={item.nom}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center">
                                          <span className="text-thai-orange text-lg">🍽️</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className='flex-1'>
                                      <h4 className='font-medium text-thai-green text-base mb-1'>
                                        {item.nom}
                                      </h4>
                                      <div className='flex items-center gap-4 text-sm text-gray-600'>
                                        <span className='flex items-center gap-1'>
                                          <span className='font-medium'>Quantité:</span>
                                          <span className='bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium'>
                                            {item.quantite}
                                          </span>
                                        </span>
                                        <span className='flex items-center gap-1'>
                                          <span className='font-medium'>Prix unitaire:</span>
                                          <span className='text-thai-green font-semibold'>
                                            {formatPrix(item.prix)}
                                          </span>
                                        </span>
                                      </div>
                                    </div>

                                    <div className='text-right'>
                                      <div className='text-lg font-bold text-thai-orange mb-3'>
                                        {formatPrix(item.prix * item.quantite)}
                                      </div>
                                      <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          size='sm'
                                          variant='outline'
                                          className='h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            modifierQuantiteItem(item.uniqueId!, item.quantite - 1);
                                          }}
                                        >
                                          -
                                        </Button>
                                        <span className='w-6 text-center font-medium text-sm'>
                                          {item.quantite}
                                        </span>
                                        <Button
                                          size='sm'
                                          variant='outline'
                                          className='h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            modifierQuantiteItem(item.uniqueId!, item.quantite + 1);
                                          }}
                                        >
                                          +
                                        </Button>
                                        <Button
                                          size='icon'
                                          variant='ghost'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            supprimerDuPanierItem(item.uniqueId!);
                                            toast({
                                              title: 'Article supprimé',
                                              description: `${item.nom} a été retiré de votre commande.`,
                                            });
                                          }}
                                          className='h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-red-300'
                                          aria-label="Supprimer l'article"
                                        >
                                          <Trash2 className='h-3 w-3' />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DishDetailsModalComplex>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}

                  <div className='flex justify-between items-center bg-thai-cream/30 p-4 rounded-lg mb-4'>
                    <span className='text-lg font-bold text-thai-green'>
                      Total de la commande :
                    </span>
                    <span className='text-xl font-bold text-thai-orange'>
                      {formatPrix(totalPrixModification)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demandes spéciales */}
          <Card className='shadow-xl border-thai-orange/20 mb-6'>
            <CardContent className='p-6'>
              <div>
                <Label
                  htmlFor='demandesSpeciales'
                  className='text-lg font-semibold text-thai-green mb-3 block'
                >
                  Demandes spéciales
                </Label>
                <Textarea
                  id='demandesSpeciales'
                  placeholder='Allergies, préférences alimentaires...'
                  value={demandesSpeciales}
                  onChange={e => setDemandesSpeciales(e.target.value)}
                  className='border border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de retrait modifiées */}
          <Card className='shadow-xl border-thai-orange/20 mb-6'>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold text-thai-green mb-4 flex items-center gap-2'>
                <Clock className='h-5 w-5 text-thai-orange' />
                Informations de retrait
              </h3>
              <div className='bg-thai-cream/30 p-4 rounded-lg space-y-4'>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 mb-2'>
                      Date et heure de retrait :
                    </p>
                    <div className='space-y-1'>
                      <p className='text-thai-green font-medium'>
                        {commande.date_et_heure_de_retrait_souhaitees
                          ? format(
                              new Date(commande.date_et_heure_de_retrait_souhaitees),
                              'eeee dd MMMM yyyy à HH:mm',
                              { locale: fr }
                            )
                          : 'Non définie'}
                      </p>
                      {dateRetrait && heureRetrait && (
                        <p className='text-thai-orange font-bold'>
                          {format(dateRetrait, 'eeee dd MMMM yyyy', { locale: fr })} à{' '}
                          {heureRetrait}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='p-3 bg-green-50 border border-green-200 rounded-lg text-center'>
                    <p className='text-sm text-green-800 font-medium flex items-center justify-center gap-2'>
                      <CreditCard className='h-4 w-4' />
                      Paiement sur place : Nous acceptons la carte bleue.
                    </p>
                  </div>

                  <div className='text-center text-sm text-thai-green/80 p-3 bg-thai-cream/50 rounded-lg space-y-1'>
                    <div className='flex items-center justify-center gap-2'>
                      <MapPin className='h-4 w-4 text-thai-orange' />
                      <span>Adresse de retrait : </span>
                      <Link 
                        href='/nous-trouver' 
                        className='text-thai-orange hover:text-thai-orange/80 font-semibold underline decoration-thai-orange/50 hover:decoration-thai-orange transition-colors duration-200'
                      >
                        2 impasse de la poste 37120 Marigny Marmande
                      </Link>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                      <Phone className='h-4 w-4 text-thai-orange' />
                      <span>Contact : 07 49 28 37 07</span>
                    </div>
                  </div>

                  <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <p className='text-sm text-yellow-800 text-center font-medium'>
                      ⏳ Votre commande sera remise en attente de confirmation. Nous la traiterons
                      dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className='flex gap-3'>
            <Button
              asChild
              variant='outline'
              className='flex-1 py-6 border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white'
            >
              <Link href={`/suivi-commande/${commande.idcommande}`}>Annuler les modifications</Link>
            </Button>
            <Button
              onClick={sauvegarderModifications}
              disabled={createCommande.isPending || deleteCommande.isPending || !hasChanges}
              className='flex-1 bg-thai-orange text-lg py-6'
            >
              {createCommande.isPending || deleteCommande.isPending ? (
                <Loader2 className='animate-spin mr-2 h-5 w-5' />
              ) : (
                <Save className='mr-2 h-5 w-5' />
              )}
              {panierModification.length === 0
                ? 'Annuler la commande'
                : `Sauvegarder (${formatPrix(totalPrixModification)})`}
            </Button>
          </div>
        </div>

        {/* Section latérale droite - Panier de modification */}
        {panierModification.length > 0 && !isCartCollapsed && (
          <div className='lg:col-span-1'>
            {/* Desktop Sidebar */}
            {!isMobile && (
              <div className='sticky top-8 h-fit w-full'>
                <Card className='shadow-xl border-thai-orange/20 animate-fade-in'>
                  <CardHeader className='bg-gradient-to-r from-thai-orange to-thai-gold text-white py-4 relative rounded-t-lg'>
                    <div className='text-center'>
                      <div className='flex items-center justify-center mb-1'>
                        <Edit className='h-7 w-7 mr-2 animate-pulse' />
                        <CardTitle className='text-2xl font-bold'>Modifications</CardTitle>
                      </div>
                      <p className='text-white/90 text-xs'>
                        {jourSelectionne
                          ? `Plats & Extras disponibles le ${
                              jourSelectionne.charAt(0).toUpperCase() + jourSelectionne.slice(1)
                            }${
                              dateRetrait
                                ? ` ${format(dateRetrait, 'dd MMMM', { locale: fr })}`
                                : ''
                            }`
                          : `${panierModification.reduce(
                              (total, item) => total + item.quantite,
                              0
                            )} Article${
                              panierModification.reduce((total, item) => total + item.quantite, 0) >
                              1
                                ? 's'
                                : ''
                            }`}
                      </p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setIsCartCollapsed(true)}
                        className='text-white hover:bg-white/20 p-1 absolute top-2 right-2'
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='p-4'>
                    {/* Section plats disponibles dans le sidebar */}
                    {jourSelectionne && dateRetrait && heureRetrait && (
                      <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-thai-green mb-4'>
                          Plats disponibles le{' '}
                          {jourSelectionne.charAt(0).toUpperCase() + jourSelectionne.slice(1)} :
                        </h3>

                        {dataIsLoading ? (
                          <div className='text-center py-6'>
                            <Loader2 className='h-6 w-6 animate-spin mx-auto text-thai-orange' />
                          </div>
                        ) : platsDisponibles.length === 0 ? (
                          <div className='text-center py-6 bg-thai-cream/30 rounded-lg'>
                            <p className='text-thai-green/70'>Aucun plat disponible ce jour-là.</p>
                          </div>
                        ) : (
                          <div className='grid grid-cols-2 gap-3'>
                            {platsDisponibles.map(plat => {
                              // Prepare detail object for modal (matching the expected type)
                              const detailForModal = {
                                plat_r: plat.id,
                                quantite_plat_commande: 1, // Default quantity for display
                                plat: {
                                  idplats: plat.id,
                                  plat: plat.plat,
                                  prix: plat.prix || 0,
                                  description: plat.description || '',
                                  photo_du_plat: plat.photo_du_plat || ''
                                }
                              };

                              // Fonction pour ajouter un plat au panier de modification
                              const handleAddPlatToCart = (platToAdd: Plat, quantity: number) => {
                                if (dateRetrait && heureRetrait) {
                                  const newItem: PlatPanier = {
                                    id: platToAdd.idplats.toString(),
                                    nom: platToAdd.plat,
                                    prix: platToAdd.prix || 0,
                                    quantite: quantity,
                                    dateRetrait: new Date(dateRetrait.getTime()),
                                    jourCommande: jourSelectionne || ''
                                  };
                                  setPanierModification(prev => [...prev, newItem]);
                                  toast({
                                    title: "Plat ajouté",
                                    description: `${platToAdd.plat} (x${quantity}) a été ajouté à votre commande.`
                                  });
                                }
                              };

                              // Calculer la quantité actuelle de ce plat dans le panier
                              const currentQuantity = panierModification
                                .filter(item => item.id === plat.id.toString())
                                .reduce((total, item) => total + item.quantite, 0);

                              return (
                                <DishDetailsModalInteractive
                                  key={plat.id}
                                  plat={plat}
                                  formatPrix={formatPrix}
                                  onAddToCart={handleAddPlatToCart}
                                  currentQuantity={currentQuantity}
                                  dateRetrait={dateRetrait}
                                >
                                  <div
                                    className={`border-thai-orange/20 p-3 border rounded-lg transition-all duration-300 cursor-pointer ${
                                      highlightedPlatId === plat.id.toString()
                                        ? 'ring-2 ring-thai-orange/50 border-thai-orange scale-105 shadow-lg'
                                        : 'hover:shadow-md'
                                    }`}
                                    onMouseEnter={() => setHighlightedPlatId(plat.id.toString())}
                                    onMouseLeave={() => setHighlightedPlatId(null)}
                                  >
                                    {plat.photo_du_plat && (
                                      <div className='w-full aspect-square mx-auto overflow-hidden rounded-lg mb-2'>
                                        <img
                                          src={plat.photo_du_plat}
                                          alt={plat.plat}
                                          className='w-full h-full object-cover'
                                        />
                                      </div>
                                    )}
                                    <h4 className='font-semibold text-thai-green mb-1 text-sm'>
                                      {plat.plat}
                                    </h4>
                                    <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                                      {plat.description}
                                    </p>
                                    <div className='flex items-center justify-between' onClick={(e) => e.stopPropagation()}>
                                      <Badge variant='secondary' className='text-xs'>
                                        {formatPrix(plat.prix || 0)}
                                      </Badge>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAjouterAuPanier(plat);
                                        }}
                                        size='sm'
                                        className='bg-thai-orange text-xs px-2 py-1'
                                      >
                                        Ajouter
                                      </Button>
                                    </div>
                                  </div>
                                </DishDetailsModalInteractive>
                              );
                            })}
                          </div>
                        )}

                        {/* Section extras disponibles */}
                        {extrasDisponibles.length > 0 && (
                          <div className='mt-6'>
                            <h3 className='text-lg font-semibold text-thai-green mb-4 flex items-center gap-2'>
                              <span className='text-thai-gold'>⭐</span>
                              Extras disponibles :
                            </h3>
                            <div className='grid grid-cols-2 gap-3'>
                              {extrasDisponibles.map(extra => {
                                // Calculer la quantité actuelle de cet extra dans le panier
                                const currentQuantity = panierModification
                                  .filter(item => item.id === `extra-${extra.idextra}`)
                                  .reduce((total, item) => total + item.quantite, 0);

                                // Fonction pour ajouter un extra au panier de modification
                                const handleAddExtraToCart = (extraToAdd: any, quantity: number) => {
                                  if (dateRetrait && heureRetrait) {
                                    const newItem: PlatPanier = {
                                      id: `extra-${extraToAdd.idextra}`,
                                      nom: extraToAdd.nom_extra,
                                      prix: extraToAdd.prix || 0,
                                      quantite: quantity,
                                      dateRetrait: new Date(dateRetrait.getTime()),
                                      jourCommande: jourSelectionne || '',
                                      type: 'extra',
                                      uniqueId: `extra-${extraToAdd.idextra}-${Date.now()}`
                                    };
                                    setPanierModification(prev => [...prev, newItem]);
                                    toast({
                                      title: "Extra ajouté",
                                      description: `${extraToAdd.nom_extra} (x${quantity}) a été ajouté à votre commande.`
                                    });
                                  }
                                };

                                return (
                                  <ExtraDetailsModalInteractive
                                    key={extra.idextra}
                                    extra={{
                                      ...extra,
                                      est_disponible: extra.est_disponible ?? true
                                    }}
                                    formatPrix={formatPrix}
                                    onAddToCart={handleAddExtraToCart}
                                    currentQuantity={currentQuantity}
                                    dateRetrait={dateRetrait}
                                  >
                                    <div
                                      className={`border-thai-orange/20 p-3 border rounded-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-thai-gold/10 to-thai-orange/10 ${
                                        highlightedPlatId === `extra-${extra.idextra}`
                                          ? 'ring-2 ring-thai-gold/50 border-thai-gold scale-105 shadow-lg'
                                          : 'hover:shadow-md hover:border-thai-gold/50'
                                      }`}
                                      onMouseEnter={() => setHighlightedPlatId(`extra-${extra.idextra}`)}
                                      onMouseLeave={() => setHighlightedPlatId(null)}
                                    >
                                      {extra.photo_url && (
                                        <div className='w-full aspect-square mx-auto overflow-hidden rounded-lg mb-2'>
                                          <img
                                            src={extra.photo_url}
                                            alt={extra.nom_extra}
                                            className='w-full h-full object-cover'
                                            onError={(e) => {
                                              e.currentTarget.src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                                            }}
                                          />
                                        </div>
                                      )}
                                      <div className='flex items-center gap-1 mb-2'>
                                        <span className='text-thai-gold text-sm'>⭐</span>
                                        <h4 className='font-semibold text-thai-green text-sm truncate'>
                                          {extra.nom_extra}
                                        </h4>
                                      </div>
                                      {extra.description && (
                                        <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                                          {extra.description}
                                        </p>
                                      )}
                                      <div className='flex items-center justify-between' onClick={(e) => e.stopPropagation()}>
                                        <Badge variant='secondary' className='text-xs bg-thai-gold/20 text-thai-gold border-thai-gold/30'>
                                          {formatPrix(extra.prix || 0)}
                                        </Badge>
                                        <div className='flex items-center gap-2'>
                                          {currentQuantity > 0 && (
                                            <Badge variant='outline' className='text-xs bg-thai-orange/10 text-thai-orange border-thai-orange/30'>
                                              {currentQuantity} dans le panier
                                            </Badge>
                                          )}
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAjouterExtraAuPanier(extra);
                                            }}
                                            size='sm'
                                            className='bg-thai-gold hover:bg-thai-gold/90 text-white text-xs px-2 py-1'
                                          >
                                            Ajouter
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </ExtraDetailsModalInteractive>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {dateRetrait && heureRetrait && (
                          <div className='mt-4 p-2 bg-green-50 border border-green-200 rounded-lg text-center'>
                            <p className='text-xs text-green-800 font-medium'>
                              ✓ Nouveau retrait prévu le{' '}
                              {format(dateRetrait, 'eeee dd MMMM', { locale: fr })} à {heureRetrait}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ModifierCommande.displayName = 'ModifierCommande';

export default ModifierCommande;
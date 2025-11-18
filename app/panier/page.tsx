'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, AlertCircle, ShoppingCart, CreditCard, Loader2, Trash2, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useSession } from '@/lib/auth-client';
import { getClientProfile } from '@/app/profil/actions';
import { useData } from '@/contexts/DataContext';
import { usePrismaCreateCommande } from '@/hooks/usePrismaData';
import { useCart } from '@/contexts/CartContext';
import type { PlatPanier, PlatUI as Plat } from '@/types/app';
import { DishDetailsModalInteractive } from '@/components/historique/DishDetailsModalInteractive';
import { FloatingUserIcon } from '@/components/FloatingUserIcon';
import { toSafeNumber } from '@/lib/serialization';
import { spiceTextToLevel } from '@/lib/spice-helpers';
import { SpiceDistributionSelector, getDistributionText } from '@/components/commander/SpiceDistributionSelector';

export default function PanierPage() {
  const { toast } = useToast();
  const { plats } = useData();
  const createCommande = usePrismaCreateCommande();

  // Better Auth session
  const { data: session } = useSession();
  const currentUser = session?.user;

  // Client profile (pour obtenir idclient)
  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile);
    } else {
      setClientProfile(null);
    }
  }, [currentUser?.id]);

  const clientFirebaseUID = clientProfile?.idclient;

  const { panier, modifierQuantite, supprimerDuPanier, viderPanier, totalPrix, ajouterAuPanier } = useCart();

  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  const validerCommande = async () => {
    if (!currentUser || !clientFirebaseUID) {
      toast({ title: "Profil incomplet", description: "Veuillez vous connecter et compléter votre profil.", variant: "destructive" });
      return;
    }
    if (panier.length === 0) {
      toast({ title: "Panier vide", variant: "destructive" });
      return;
    }

    // Grouper les articles par date de retrait
    const groupedByDate = panier.reduce((groups, item) => {
      const dateKey = item.dateRetrait?.toISOString() || '';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
      return groups;
    }, {} as Record<string, PlatPanier[]>);

    try {
      let commandesCreees = 0;

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue;

        await createCommande.mutateAsync({
          client_r: currentUser.id,
          client_r_id: clientFirebaseUID,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map(item => ({
            plat_r: item.id, // Garder comme string, sera converti dans le hook
            quantite_plat_commande: item.quantite,
            preference_epice_niveau: spiceTextToLevel(item.demandeSpeciale),
            spice_distribution: item.spiceDistribution || null,
          }))
        });

        commandesCreees++;
      }

      const totalGeneral = panier.reduce(
        (sum, item) => sum + toSafeNumber(item.prix) * item.quantite,
        0
      );

      toast({
        title: "Commande(s) envoyée(s) !",
        description: `${commandesCreees} commande${commandesCreees > 1 ? 's' : ''} d'un total de ${formatPrix(totalGeneral)} ${commandesCreees > 1 ? 'ont été enregistrées' : 'a été enregistrée'}.`
      });

      viderPanier();
      setDemandesSpeciales('');

    } catch (error: unknown) {
      console.error('Erreur validation commande:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la commande.";
      toast({
        title: "Erreur commande",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Fonction pour ajouter un plat au panier avec quantité spécifique
  const handleAjouterAuPanier = (plat: Plat, quantite: number, spicePreference?: string, spiceDistribution?: number[]) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return;

    // Récupérer le premier item du panier pour cette plat pour obtenir dateRetrait et jourCommande
    const existingItem = panier.find(item => item.id === plat.idplats.toString());

    if (existingItem?.dateRetrait && existingItem?.jourCommande) {
      ajouterAuPanier({
        id: plat.idplats.toString(),
        nom: plat.plat,
        prix: plat.prix ?? '0',
        quantite: quantite,
        dateRetrait: existingItem.dateRetrait,
        jourCommande: existingItem.jourCommande,
        demandeSpeciale: spicePreference || undefined,
        spiceDistribution: spiceDistribution,
      });

      toast({
        title: 'Plat mis à jour !',
        description: `${plat.plat} a été mis à jour dans votre panier.`,
      });
    }
  };

  // Calculer la quantité actuelle d'un plat dans le panier pour une date donnée
  const getCurrentQuantity = (platId: number, dateRetrait?: Date): number => {
    if (!dateRetrait) return 0;

    return panier
      .filter(item =>
        item.id === platId.toString() &&
        item.dateRetrait?.getTime() === dateRetrait.getTime()
      )
      .reduce((total, item) => total + item.quantite, 0);
  };

  // Modifier la distribution épicée directement
  const handleDistributionChange = (item: PlatPanier, newDistribution: number[]) => {
    if (item.uniqueId) {
      const newDistributionText = getDistributionText(newDistribution);

      // Supprimer l'ancien item
      supprimerDuPanier(item.uniqueId);

      // Ajouter le nouvel item avec la distribution mise à jour
      ajouterAuPanier({
        ...item,
        spiceDistribution: newDistribution,
        demandeSpeciale: newDistributionText,
      });
    }
  };

  // Gérer le changement de quantité avec ajustement automatique de la distribution
  const handleQuantityChange = (item: PlatPanier, newQuantity: number) => {
    if (newQuantity <= 0) {
      supprimerDuPanier(item.uniqueId!);
      return;
    }

    // Si le plat a une distribution épicée, on l'ajuste
    if (item.spiceDistribution && item.spiceDistribution.length === 4) {
      const currentTotal = item.spiceDistribution.reduce((sum, count) => sum + count, 0);
      const diff = newQuantity - currentTotal;
      const newDistribution = [...item.spiceDistribution];

      if (diff > 0) {
        // Augmentation: ajouter les portions sur "non épicé" (index 0)
        newDistribution[0] += diff;
      } else if (diff < 0) {
        // Diminution: retirer des portions en commençant par "non épicé"
        let toRemove = Math.abs(diff);
        for (let i = 0; i < 4 && toRemove > 0; i++) {
          const canRemove = Math.min(newDistribution[i], toRemove);
          newDistribution[i] -= canRemove;
          toRemove -= canRemove;
        }
      }

      const newDistributionText = getDistributionText(newDistribution);

      // Supprimer l'ancien et ajouter le nouveau
      supprimerDuPanier(item.uniqueId!);
      ajouterAuPanier({
        ...item,
        quantite: newQuantity,
        spiceDistribution: newDistribution,
        demandeSpeciale: newDistributionText,
      });
    } else {
      // Pas de distribution épicée, juste modifier la quantité
      modifierQuantite(item.uniqueId!, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {!currentUser || !clientFirebaseUID ? (
          <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Profil requis :</strong> Pour commander, veuillez vous <Link href={"/auth/login" as any} className="underline font-medium">connecter et compléter votre profil</Link>.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="shadow-xl border-thai-orange/20" style={{ position: 'relative', zIndex: 1 }}>
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4">
            <div className="flex items-center justify-center mb-1">
              <ShoppingCart className="h-7 w-7 mr-2" />
              <CardTitle className="text-2xl font-bold">Mon Panier</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8" style={{ position: 'relative', zIndex: 1 }}>
            {panier.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-thai-orange/30 mb-4" />
                <h3 className="text-xl font-semibold text-thai-green mb-2">Votre panier est vide</h3>
                <p className="text-gray-600 mb-6">Découvrez nos délicieux plats thaïlandais</p>
                <Link href="/commander">
                  <Button className="bg-thai-orange hover:bg-thai-orange/90">
                    Voir le menu
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-thai-green">Votre Commande</h3>

                {/* Grouper les articles par date de retrait */}
                {(() => {
                  const groupedByDate = panier.reduce((groups, item) => {
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
                      <div key={dateKey} className="border border-thai-orange/20 rounded-lg p-4 bg-thai-cream/20">
                        {dateRetrait && (
                          <div className="mb-3 pb-2 border-b border-thai-orange/10">
                            <h4 className="font-semibold text-thai-green flex items-center gap-2">
                              <CalendarIconLucide className="h-4 w-4 text-thai-orange" />
                              Retrait prévu le <span className="text-thai-orange font-bold">{format(dateRetrait, 'eeee dd MMMM yyyy', {locale: fr}).replace(/^\w/, c => c.toUpperCase())} à {format(dateRetrait, 'HH:mm')}</span>
                            </h4>
                          </div>
                        )}

                        <div className="space-y-4">
                          {items.map((item) => {
                            const platData = plats?.find(p => p.id.toString() === item.id);
                            const imageUrl = platData?.photo_du_plat;

                            return (
                              <div
                                key={item.uniqueId}
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform"
                              >
                                {/* Image du plat */}
                                {platData ? (
                                  <DishDetailsModalInteractive
                                    plat={platData}
                                    formatPrix={formatPrix}
                                    onAddToCart={(plat, quantite, spicePreference, spiceDistribution) =>
                                      handleAjouterAuPanier(
                                        plat,
                                        quantite,
                                        spicePreference,
                                        spiceDistribution
                                      )
                                    }
                                    currentQuantity={item.quantite}
                                    currentSpiceDistribution={item.spiceDistribution}
                                    dateRetrait={item.dateRetrait}
                                  >
                                    {imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt={item.nom}
                                        className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                      />
                                    ) : (
                                      <div className="w-24 h-16 bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-thai-cream/50 transition-colors duration-200">
                                        <span className="text-thai-orange text-lg">
                                          🍽️
                                        </span>
                                      </div>
                                    )}
                                  </DishDetailsModalInteractive>
                                ) : (
                                  <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-lg">
                                      🍽️
                                    </span>
                                  </div>
                                )}

                                {/* Informations du plat */}
                                <div className="flex-1 space-y-2">
                                  {/* Ligne 1: Nom du plat */}
                                  {platData ? (
                                    <DishDetailsModalInteractive
                                      plat={platData}
                                      formatPrix={formatPrix}
                                      onAddToCart={(plat, quantite, spicePreference, spiceDistribution) =>
                                        handleAjouterAuPanier(
                                          plat,
                                          quantite,
                                          spicePreference,
                                          spiceDistribution
                                        )
                                      }
                                      currentQuantity={item.quantite}
                                      currentSpiceDistribution={item.spiceDistribution}
                                      dateRetrait={item.dateRetrait}
                                    >
                                      <h4 className="font-medium text-thai-green text-lg cursor-pointer hover:text-thai-orange transition-colors duration-200 hover:underline decoration-thai-orange/50">
                                        {item.nom}
                                      </h4>
                                    </DishDetailsModalInteractive>
                                  ) : (
                                    <h4 className="font-medium text-gray-500 text-lg">
                                      {item.nom}
                                    </h4>
                                  )}

                                  {/* Ligne 2: Badges épicés (milieu) - Modifiables directement */}
                                  {item.demandeSpeciale && item.demandeSpeciale.includes("épicé") && item.spiceDistribution && (
                                    <SpiceDistributionSelector
                                      totalQuantity={item.quantite}
                                      distribution={item.spiceDistribution}
                                      onDistributionChange={(newDistribution) => handleDistributionChange(item, newDistribution)}
                                    />
                                  )}

                                  {/* Ligne 3: Quantité et Prix unitaire */}
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">
                                        Quantité:
                                      </span>
                                      <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
                                        {item.quantite}
                                      </span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">
                                        Prix unitaire:
                                      </span>
                                      <span className="text-thai-green font-semibold">
                                        {formatPrix(toSafeNumber(item.prix))}
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                {/* Prix total et contrôles */}
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-thai-orange mb-4">
                                    {formatPrix(
                                      toSafeNumber(item.prix) * item.quantite
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleQuantityChange(item, item.quantite - 1);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <span className="w-8 text-center font-medium">
                                      {item.quantite}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleQuantityChange(item, item.quantite + 1);
                                      }}
                                    >
                                      +
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={e => {
                                        e.stopPropagation();
                                        supprimerDuPanier(item.uniqueId!);
                                        toast({
                                          title: 'Article supprimé',
                                          description: `${item.nom} a été retiré de votre panier.`,
                                        });
                                      }}
                                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                                      aria-label="Supprimer l'article"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}

                <div className="flex justify-between items-center bg-thai-cream/30 p-4 rounded-lg">
                  <span className="text-xl font-bold text-thai-green">Total de la commande :</span>
                  <span className="text-2xl font-bold text-thai-orange">{formatPrix(totalPrix)}</span>
                </div>

                <Alert className="bg-green-50/50 border-green-200 text-green-800">
                  <CreditCard className="h-4 w-4 !text-green-700" />
                  <AlertDescription className="font-medium">
                    Paiement sur place : Nous acceptons la carte bleue.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="demandesSpeciales">Demandes spéciales</Label>
                        <Textarea
                          id="demandesSpeciales"
                          placeholder="Allergies, etc."
                          value={demandesSpeciales}
                          onChange={e => setDemandesSpeciales(e.target.value)}
                          className="border border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5"
                        />
                    </div>
                </div>

                {/* Section informations */}
                <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10">
                  <CardContent className="p-4">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 text-center font-medium">
                          ⏳ Votre commande sera mise en attente de confirmation. Nous la traiterons dans les plus brefs délais.
                        </p>
                      </div>

                      <div className="text-center text-sm text-thai-green/80 p-3 bg-thai-cream/50 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4 text-thai-orange" />
                          <span>Adresse de retrait : 2 impasse de la poste 37120 Marigny Marmande</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-thai-orange" />
                          <span>Contact : 07 49 28 37 07</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <Link href="/commander" className="flex-1">
                    <Button variant="outline" className="w-full py-6 border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white">
                      Retour à Commander
                    </Button>
                  </Link>
                  <Button onClick={validerCommande} disabled={createCommande.isPending || !currentUser || !clientFirebaseUID} className="flex-1 bg-thai-orange text-lg py-6">
                    {createCommande.isPending ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
                    Valider ma commande ({formatPrix(totalPrix)})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FloatingUserIcon ajouté pour navigation universelle */}
        <FloatingUserIcon />
      </div>
    </div>
  );
}

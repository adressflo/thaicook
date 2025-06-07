import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, CheckCircle, Eye, History, CookingPot, ShoppingBasket, Users
} from 'lucide-react';
import { format, isToday, isFuture, isPast, differenceInDays, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { memo } from 'react';

// Imports corrigés pour pointer vers le fichier unique
import { useCommandes, useUpdateCommande, useEvenements, useClients, useIngredients } from '@/hooks/useAirtable';
import type { Commande } from '@/types/airtable';

const Admin = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { commandes, isLoading: commandesLoading } = useCommandes();
  const { evenements, isLoading: evenementsLoading } = useEvenements();
  const { clients, isLoading: clientsLoading } = useClients();
  const { ingredients, isLoading: ingredientsLoading } = useIngredients();
  const updateCommande = useUpdateCommande();

  const isLoading = commandesLoading || evenementsLoading || clientsLoading || ingredientsLoading;

  // Utilisation des noms de champs exacts d'Airtable
  const commandesFutures = commandes
    ?.filter(c => c['Date et Heure de Retrait Souhaitées'] && isFuture(new Date(c['Date et Heure de Retrait Souhaitées'])))
    .sort((a, b) => new Date(a['Date et Heure de Retrait Souhaitées']!).getTime() - new Date(b['Date et Heure de Retrait Souhaitées']!).getTime()) 
    || [];
  
  const listeDeCourses = ingredients?.filter(i => i.Statut === 'À acheter !') || [];

  const groupCommandsByDate = (cmds: Commande[]) => {
    const today = startOfToday();
    return cmds.reduce((acc, commande) => {
      const date = new Date(commande['Date et Heure de Retrait Souhaitées']!);
      const diff = differenceInDays(date, today);
      let key = format(date, "EEEE d MMMM", { locale: fr });
      if (diff === 0) key = 'Aujourd\'hui';
      else if (diff === 1) key = 'Demain';
      key = key.charAt(0).toUpperCase() + key.slice(1);
      if (!acc[key]) acc[key] = [];
      acc[key].push(commande);
      return acc;
    }, {} as Record<string, Commande[]>);
  };

  const commandesFuturesGroupees = groupCommandsByDate(commandesFutures);

  const handleConfirmCommande = async (commandeId: string) => {
    toast({ title: "Confirmation en cours..." });
    try {
      await updateCommande.mutateAsync({
        recordId: commandeId,
        data: { 'Statut Commande': 'Confirmée' }
      });
      toast({ title: "Succès", description: "La commande a été confirmée." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de confirmer la commande.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-thai-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-thai-green mb-8 text-center">Administration</h1>
        <Tabs defaultValue="futures" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="futures">Commandes Futures</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="courses">Liste de Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="futures">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Commandes Futures ({commandesFutures.length})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
                {Object.keys(commandesFuturesGroupees).length > 0 ? Object.entries(commandesFuturesGroupees).map(([date, cmdsDuJour]) => (
                  <div key={date}>
                    <h3 className="text-md font-semibold text-gray-600 border-b pb-2 mb-3">{date}</h3>
                    {cmdsDuJour.map(commande => (
                      <div key={commande.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-semibold text-thai-green">{commande.clientName}</p>
                          <p className="text-sm text-gray-500">{commande['N commande']} - {commande['Total Commande vu']}</p>
                        </div>
                        {commande['Statut Commande'] === 'En attente de confirmation' && (
                           <Button size="sm" variant="secondary" onClick={() => handleConfirmCommande(commande.id)} disabled={updateCommande.isPending} className="bg-green-100 text-green-800 hover:bg-green-200">
                             <CheckCircle className="h-4 w-4 mr-1"/> Confirmer
                           </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )) : <p className="text-center text-gray-500 py-4">Aucune commande à venir.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Tous les Clients ({clients.length})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-2">
                {clients.map(client => (
                   <div key={client.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                     <div>
                      <p className="font-semibold text-thai-green">{client.Prénom} {client.Nom}</p>
                      <p className="text-sm text-gray-500">{client['e-mail']}</p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/clients/${client.id}`)}><Eye className="h-4 w-4"/></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Liste de Courses ({listeDeCourses.length})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-2">
                {listeDeCourses.map(ingredient => (
                   <div key={ingredient.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                     <div>
                      <p className="font-semibold text-thai-green">{ingredient.Ingrédient}</p>
                      <p className="text-sm text-gray-500">{ingredient.Catégorie}</p>
                    </div>
                    <Badge variant="outline">{ingredient.Fournisseur}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

export default Admin;
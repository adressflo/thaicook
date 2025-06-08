import { memo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCommandeById } from '@/hooks/useAirtable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SuiviCommande = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoadingAuth } = useAuth();
  const { data: commande, isLoading: isLoadingCommande, error } = useCommandeById(id);

  if (isLoadingAuth || isLoadingCommande) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-thai-orange" />
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de cette commande. Elle n'existe peut-être pas ou a été supprimée.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link to="/historique">Retour à l'historique</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de la commande
  if (currentUser?.uid !== commande.FirebaseUID?.[0]) {
    return <Navigate to="/historique" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button asChild variant="outline" className="mb-4 group">
          <Link to="/historique">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Retour à l'historique
          </Link>
        </Button>
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-2xl text-thai-green">
              Détail de la Commande #{commande['Numéro de Commande']}
            </CardTitle>
            <CardDescription>
              Passée le {format(new Date(commande.createdTime), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className="font-semibold text-lg text-thai-green">{commande['Statut Commande']}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total payé</p>
                    <p className="font-semibold text-lg text-thai-green">{commande.Total.toFixed(2)}€</p>
                </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Date et heure de retrait</p>
              <p className="font-semibold text-lg text-thai-orange">
                {format(new Date(commande['Date & Heure de retrait']), 'eeee dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-thai-green">Articles de votre commande</h4>
              {/* Note: Le détail des articles n'est pas encore disponible dans le modèle de données actuel. */}
              <div className="text-center py-6 border border-dashed rounded-lg">
                <p className="text-sm text-gray-500">Le récapitulatif détaillé des articles sera bientôt disponible.</p>
              </div>
            </div>

            <div className="pt-6 border-t">
                <p className="text-sm text-center text-muted-foreground">
                    Une question ou besoin de modifier votre commande ? N'hésitez pas à nous contacter.
                </p>
                {commande['Statut Commande'] === 'En attente de confirmation' && (
                    <Button className="mt-4 w-full" variant="secondary" disabled>
                        Modifier la commande (bientôt disponible)
                    </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

SuiviCommande.displayName = 'SuiviCommande';
export default SuiviCommande;

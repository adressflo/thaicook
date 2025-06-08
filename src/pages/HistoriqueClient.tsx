import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCommandesByClient } from '@/hooks/useAirtable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const HistoriqueClient = memo(() => {
  const { currentUser, currentUserAirtableData } = useAuth();
  const { data: commandes, isLoading: isLoadingCommandes, error } = useCommandesByClient(currentUserAirtableData?.id);

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
        <div className="container mx-auto max-w-4xl">
            <Card className="shadow-xl border-thai-orange/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-thai-green">Historique de vos commandes</CardTitle>
                    <CardDescription>Consultez ici le détail et le statut de vos commandes passées.</CardDescription>
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
                    ) : commandes && commandes.length > 0 ? (
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Date de retrait</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {commandes.map(c => (
                                <TableRow key={c.id}>
                                <TableCell className="font-medium">{c['Numéro de Commande']}</TableCell>
                                <TableCell>{format(new Date(c['Date & Heure de retrait']), 'dd MMMM yyyy à HH:mm', { locale: fr })}</TableCell>
                                <TableCell className="text-right">{c.Total.toFixed(2)}€</TableCell>
                                <TableCell>
                                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                                        c['Statut Commande'] === 'Confirmée' ? 'bg-green-100 text-green-800' : 
                                        c['Statut Commande'] === 'Annulée' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                    )}>
                                        {c['Statut Commande']}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                    <Link to={`/suivi-commande/${c.id}`}>Voir</Link>
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
                        <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore passé de commande.</p>
                        <div className="mt-6">
                            <Button asChild className="bg-thai-orange">
                            <Link to="/commander">Commencer à commander</Link>
                            </Button>
                        </div>
                        </div>
                    )
                    }
                </CardContent>
            </Card>
        </div>
    </div>
  );
});

HistoriqueClient.displayName = 'HistoriqueClient';
export default HistoriqueClient;

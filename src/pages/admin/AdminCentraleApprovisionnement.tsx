import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Types simplifiés
interface ListeCourse {
  id: number;
  nom_liste: string;
  description?: string;
  statut?: string;
  total_estimatif?: number;
}

interface ArticleListeCourse {
  id: number;
  liste_id: number;
  nom_article: string;
  quantite: number;
  unite?: string;
  prix_unitaire_estime?: number;
  prix_total_estime?: number;
  achete?: boolean;
}

interface ListeAvecArticles extends ListeCourse {
  articles: ArticleListeCourse[];
}

const AdminCentraleApprovisionnement = () => {
  const [listes, setListes] = useState<ListeAvecArticles[]>([]);
  const [listeSelectionnee, setListeSelectionnee] = useState<ListeAvecArticles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      await chargerListes();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const chargerListes = async () => {
    // @ts-ignore - Contournement temporaire pour les nouvelles tables
    const { data: listesData, error } = await supabase
      .from('listes_courses' as any)
      .select('*')
      .order('date_derniere_modification', { ascending: false });

    if (error) throw error;

    const listesAvecArticles: ListeAvecArticles[] = [];
    
    for (const liste of listesData || []) {
      // @ts-ignore - Contournement temporaire
      const { data: articlesData } = await supabase
        .from('articles_liste_courses' as any)
        .select('*')
        .eq('liste_id', (liste as any).id)
        .order('ordre_affichage', { ascending: true });

      listesAvecArticles.push({
        ...(liste as any),
        articles: articlesData || []
      });
    }

    setListes(listesAvecArticles);
    
    if (!listeSelectionnee && listesAvecArticles.length > 0) {
      setListeSelectionnee(listesAvecArticles[0]);
    }
  };

  const creerNouvelleListe = async (nomListe: string, description?: string) => {
    // @ts-ignore
    const { error } = await supabase
      .from('listes_courses' as any)
      .insert({
        nom_liste: nomListe,
        description: description || '',
        statut: 'en_cours'
      });

    if (error) {
      toast.error('Erreur lors de la création');
      return;
    }

    toast.success('Liste créée avec succès');
    chargerListes();
  };

  const supprimerListe = async (listeId: number) => {
    // @ts-ignore
    const { error } = await supabase
      .from('listes_courses' as any)
      .delete()
      .eq('id', listeId);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Liste supprimée');
    chargerListes();
    if (listeSelectionnee?.id === listeId) {
      setListeSelectionnee(null);
    }
  };

  const getStatistiquesListe = (liste: ListeAvecArticles) => {
    const totalArticles = liste.articles.length;
    const articlesAchetes = liste.articles.filter(a => a.achete).length;
    const progression = totalArticles > 0 ? Math.round((articlesAchetes / totalArticles) * 100) : 0;
    
    return { totalArticles, articlesAchetes, progression };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-thai-orange mx-auto mb-4"></div>
          <p>Chargement de la centrale d'approvisionnement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {listes.length} liste{listes.length > 1 ? 's' : ''} de courses
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={chargerDonnees} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <NouvelleListeDialog onCreer={creerNouvelleListe} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mes Listes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {listes.map((liste) => {
                    const stats = getStatistiquesListe(liste);
                    return (
                      <div
                        key={liste.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          listeSelectionnee?.id === liste.id
                            ? 'border-thai-orange bg-thai-orange/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setListeSelectionnee(liste)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{liste.nom_liste}</h4>
                          <Badge variant={liste.statut === 'en_cours' ? 'default' : 'secondary'}>
                            {liste.statut}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{stats.articlesAchetes}/{stats.totalArticles} articles</span>
                          <span>{(liste.total_estimatif || 0).toFixed(2)}€</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-thai-green h-1.5 rounded-full transition-all"
                            style={{ width: `${stats.progression}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {listes.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune liste de courses
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {listeSelectionnee ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{listeSelectionnee.nom_liste}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {listeSelectionnee.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la liste</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{listeSelectionnee.nom_liste}" ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => supprimerListe(listeSelectionnee.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-thai-green">{listeSelectionnee.articles.length}</div>
                    <div className="text-sm text-muted-foreground">Articles</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {listeSelectionnee.articles.filter(a => a.achete).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Achetés</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {getStatistiquesListe(listeSelectionnee).progression}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progression</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-thai-orange">
                      {(listeSelectionnee.total_estimatif || 0).toFixed(2)}€
                    </div>
                    <div className="text-sm text-muted-foreground">Total estimé</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {listeSelectionnee.articles.map((article) => (
                      <div 
                        key={article.id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          article.achete ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                      >
                        <CheckCircle className={`w-5 h-5 ${article.achete ? 'text-green-600' : 'text-gray-400'}`} />
                        
                        <div className="flex-1">
                          <h5 className={`font-medium ${article.achete ? 'line-through text-gray-500' : ''}`}>
                            {article.nom_article}
                          </h5>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="min-w-[3rem] text-center font-medium">
                            {article.quantite} {article.unite}
                          </span>
                        </div>

                        <div className="text-right min-w-[4rem]">
                          <div className="font-medium">{(article.prix_total_estime || 0).toFixed(2)}€</div>
                        </div>
                      </div>
                    ))}
                    
                    {listeSelectionnee.articles.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun article dans cette liste
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Aucune liste sélectionnée</p>
                  <p className="text-muted-foreground">
                    Sélectionnez une liste à gauche ou créez-en une nouvelle
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Dialog pour créer une nouvelle liste
interface NouvelleListeDialogProps {
  onCreer: (nom: string, description?: string) => void;
}

const NouvelleListeDialog: React.FC<NouvelleListeDialogProps> = ({ onCreer }) => {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!nom.trim()) {
      toast.error('Le nom de la liste est requis');
      return;
    }

    onCreer(nom.trim(), description.trim() || undefined);
    setNom('');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Liste
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle liste de courses</DialogTitle>
          <DialogDescription>
            Donnez un nom à votre liste et ajoutez une description optionnelle.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom de la liste *</label>
            <Input
              placeholder="ex: Courses Semaine 25"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="ex: Approvisionnement pour la semaine du 24-30 juin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer la liste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCentraleApprovisionnement;
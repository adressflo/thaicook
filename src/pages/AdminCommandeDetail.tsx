import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCommandeById, useUpdateCommande, type CommandeUpdate } from '@/hooks/useSupabaseData';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Clock, 
  CreditCard, 
  FileText, 
  Phone, 
  Mail, 
  MapPin,
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Edit,
  Printer,
  Send,
  XCircle,
  Info,
  MessageSquare,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminCommandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: commande, isLoading, refetch } = useCommandeById(id ? parseInt(id) : undefined);
  const updateCommandeMutation = useUpdateCommande();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CommandeUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Mettre à jour le formData quand la commande est chargée
  useEffect(() => {
    if (commande) {
      setFormData({
        statut_commande: commande.statut_commande,
        statut_paiement: commande.statut_paiement,
        notes_internes: commande.notes_internes || '',
        type_livraison: commande.type_livraison,
        adresse_specifique: commande.adresse_specifique || ''
      });
    }
  }, [commande]);

  // Détecter les changements
  useEffect(() => {
    if (commande) {
      const changed = 
        formData.statut_commande !== commande.statut_commande ||
        formData.statut_paiement !== commande.statut_paiement ||
        formData.notes_internes !== (commande.notes_internes || '') ||
        formData.type_livraison !== commande.type_livraison ||
        formData.adresse_specifique !== (commande.adresse_specifique || '');
      setHasChanges(changed);
    }
  }, [formData, commande]);

  const statutCommandeOptions = [
    { value: 'En attente de confirmation', label: 'En attente de confirmation', icon: Clock, color: 'text-yellow-500' },
    { value: 'Confirmée', label: 'Confirmée', icon: CheckCircle, color: 'text-blue-500' },
    { value: 'En préparation', label: 'En préparation', icon: RefreshCw, color: 'text-orange-500' },
    { value: 'Prête à récupérer', label: 'Prête à récupérer', icon: AlertCircle, color: 'text-purple-500' },
    { value: 'Récupérée', label: 'Récupérée', icon: CheckCircle, color: 'text-green-500' },
    { value: 'Annulée', label: 'Annulée', icon: XCircle, color: 'text-red-500' }
  ];

  const statutPaiementOptions = [
    { value: 'En attente sur place', label: 'En attente sur place', icon: Clock, color: 'text-yellow-500' },
    { value: 'Payé sur place', label: 'Payé sur place', icon: CheckCircle, color: 'text-green-500' },
    { value: 'Payé en ligne', label: 'Payé en ligne', icon: CreditCard, color: 'text-blue-500' },
    { value: 'Non payé', label: 'Non payé', icon: XCircle, color: 'text-red-500' },
    { value: 'Payée', label: 'Payée', icon: CheckCircle, color: 'text-green-500' }
  ];

  const typeLivraisonOptions = [
    { value: 'À emporter', label: 'À emporter', icon: Package },
    { value: 'Livraison', label: 'Livraison', icon: MapPin }
  ];

  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'En attente de confirmation':
        return 'destructive';
      case 'Confirmée':
        return 'default';
      case 'En préparation':
        return 'secondary';
      case 'Prête à récupérer':
        return 'default';
      case 'Récupérée':
        return 'outline';
      case 'Annulée':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaiementVariant = (statut: string) => {
    if (statut?.includes('Payé') || statut === 'Payée') return 'default';
    if (statut?.includes('En attente')) return 'secondary';
    return 'destructive';
  };

  const calculateTotal = () => {
    return commande?.details?.reduce((sum: number, detail: any) => 
      sum + (parseFloat(detail.plat?.prix || 0) * detail.quantite_plat_commande), 0
    ) || 0;
  };

  const handleSave = async () => {
    if (!commande || !hasChanges) return;

    try {
      await updateCommandeMutation.mutateAsync({
        idcommande: commande.idcommande,
        updates: formData
      });
      
      setEditMode(false);
      setHasChanges(false);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    if (commande) {
      setFormData({
        statut_commande: commande.statut_commande,
        statut_paiement: commande.statut_paiement,
        notes_internes: commande.notes_internes || '',
        type_livraison: commande.type_livraison,
        adresse_specifique: commande.adresse_specifique || ''
      });
      setEditMode(false);
      setHasChanges(false);
    }
  };

  const getStatusColor = (statut: string) => {
    const option = statutCommandeOptions.find(opt => opt.value === statut);
    return option?.color || 'text-gray-500';
  };

  const getStatusIcon = (statut: string) => {
    const option = statutCommandeOptions.find(opt => opt.value === statut);
    return option?.icon || AlertCircle;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-thai-orange mx-auto mb-4" />
            <p className="text-thai-green">Chargement de la commande...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-thai-green mb-2">Commande non trouvée</h2>
            <p className="text-thai-green/70 mb-4">La commande demandée n'existe pas ou a été supprimée.</p>
            <Button onClick={() => navigate('/admin/commandes')} className="bg-thai-orange hover:bg-thai-orange/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux commandes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(commande.statut_commande || '');

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/commandes')}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-thai-green">Commande #{commande.idcommande}</h1>
                <Badge variant={getBadgeVariant(commande.statut_commande || '')} className="text-lg px-3 py-1">
                  <StatusIcon className={`w-4 h-4 mr-2 ${getStatusColor(commande.statut_commande || '')}`} />
                  {commande.statut_commande}
                </Badge>
              </div>
              <p className="text-thai-green/70">
                Commandée le {commande.date_de_prise_de_commande ? 
                  new Date(commande.date_de_prise_de_commande).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Date inconnue'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!editMode ? (
              <Button
                onClick={() => setEditMode(true)}
                className="bg-thai-green hover:bg-thai-green/90"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || updateCommandeMutation.isPending}
                  className="bg-thai-orange hover:bg-thai-orange/90"
                >
                  {updateCommandeMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Alerte pour les changements non sauvegardés */}
        {hasChanges && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Vous avez des modifications non sauvegardées. N'oubliez pas de cliquer sur "Sauvegarder".
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Informations client */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informations client */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commande.client ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-thai-green">Nom complet</Label>
                      <p className="text-lg font-semibold text-thai-green">
                        {commande.client.nom} {commande.client.prenom}
                      </p>
                    </div>
                    
                    {commande.client.email && (
                      <div>
                        <Label className="text-sm font-medium text-thai-green">Email</Label>
                        <p className="text-thai-green flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {commande.client.email}
                        </p>
                      </div>
                    )}
                    
                    {commande.client.numero_de_telephone && (
                      <div>
                        <Label className="text-sm font-medium text-thai-green">Téléphone</Label>
                        <p className="text-thai-green flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {commande.client.numero_de_telephone}
                        </p>
                      </div>
                    )}

                    {(commande.client.adresse_numero_et_rue || commande.client.ville) && (
                      <div>
                        <Label className="text-sm font-medium text-thai-green">Adresse</Label>
                        <div className="text-thai-green flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            {commande.client.adresse_numero_et_rue && (
                              <p>{commande.client.adresse_numero_et_rue}</p>
                            )}
                            {commande.client.ville && (
                              <p>{commande.client.code_postal} {commande.client.ville}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <Label className="text-sm font-medium text-thai-green">Client</Label>
                    <p className="text-thai-green">{commande.client_r || 'Client non identifié'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations temporelles */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-thai-green">Date de commande</Label>
                  <p className="text-thai-green flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {commande.date_de_prise_de_commande ?
                      new Date(commande.date_de_prise_de_commande).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Non définie'
                    }
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-thai-green">Date de retrait souhaitée</Label>
                  <p className="text-thai-green flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {commande.date_et_heure_de_retrait_souhaitees ?
                      new Date(commande.date_et_heure_de_retrait_souhaitees).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Non définie'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Résumé financier */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Résumé Financier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-thai-green">Sous-total:</span>
                    <span className="text-thai-green">{calculateTotal().toFixed(2)} €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-thai-green">Total:</span>
                    <span className="text-thai-orange">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite - Gestion et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gestion des statuts */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Gestion des Statuts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-thai-green">Statut de la commande</Label>
                    {editMode ? (
                      <Select 
                        value={formData.statut_commande} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, statut_commande: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statutCommandeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <option.icon className={`w-4 h-4 mr-2 ${option.color}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <Badge variant={getBadgeVariant(commande.statut_commande || '')}>
                          <StatusIcon className={`w-4 h-4 mr-2 ${getStatusColor(commande.statut_commande || '')}`} />
                          {commande.statut_commande}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-thai-green">Statut de paiement</Label>
                    {editMode ? (
                      <Select 
                        value={formData.statut_paiement} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, statut_paiement: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statutPaiementOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <option.icon className={`w-4 h-4 mr-2 ${option.color}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <Badge variant={getPaiementVariant(commande.statut_paiement || '')}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {commande.statut_paiement}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-thai-green">Type de service</Label>
                  {editMode ? (
                    <Select 
                      value={formData.type_livraison} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type_livraison: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeLivraisonOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <option.icon className="w-4 h-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                      {commande.type_livraison === 'Livraison' ? (
                        <MapPin className="w-4 h-4 mr-2 text-thai-green" />
                      ) : (
                        <Package className="w-4 h-4 mr-2 text-thai-green" />
                      )}
                      <span className="text-thai-green">{commande.type_livraison || 'À emporter'}</span>
                    </div>
                  )}
                </div>

                {(editMode ? formData.type_livraison === 'Livraison' : commande.type_livraison === 'Livraison') && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-thai-green">Adresse de livraison</Label>
                    {editMode ? (
                      <Textarea
                        value={formData.adresse_specifique || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, adresse_specifique: e.target.value }))}
                        placeholder="Adresse de livraison..."
                        rows={3}
                      />
                    ) : (
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-thai-green">
                          {commande.adresse_specifique || 'Aucune adresse spécifiée'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demandes spéciales */}
            {commande.demande_special_pour_la_commande && (
              <Card className="border-thai-orange/20">
                <CardHeader>
                  <CardTitle className="text-thai-green flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Demandes Spéciales du Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-thai-green italic">"{commande.demande_special_pour_la_commande}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes internes */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Notes Internes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={formData.notes_internes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes_internes: e.target.value }))}
                    placeholder="Ajouter des notes internes pour l'équipe..."
                    rows={4}
                  />
                ) : (
                  <div className="p-4 border rounded-lg bg-gray-50 min-h-[100px]">
                    {commande.notes_internes ? (
                      <p className="text-thai-green whitespace-pre-wrap">{commande.notes_internes}</p>
                    ) : (
                      <p className="text-thai-green/50 italic">Aucune note interne</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Détail des plats */}
            <Card className="border-thai-orange/20">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Détail des Plats Commandés
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commande.details && commande.details.length > 0 ? (
                  <div className="space-y-3">
                    {commande.details.map((detail) => (
                      <div key={detail.iddetails} className="flex justify-between items-center p-4 bg-thai-cream/30 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-semibold text-thai-green text-lg">{detail.plat?.plat}</h4>
                          {detail.plat?.description && (
                            <p className="text-sm text-thai-green/70 mt-1">{detail.plat.description}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-thai-green bg-white px-2 py-1 rounded">
                              Quantité: {detail.quantite_plat_commande}
                            </span>
                            <span className="text-sm text-thai-green bg-white px-2 py-1 rounded">
                              Prix unitaire: {parseFloat(detail.plat?.prix || 0).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-thai-orange">
                            {((parseFloat(detail.plat?.prix || 0)) * detail.quantite_plat_commande).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center p-4 bg-thai-orange/10 rounded-lg border">
                      <span className="text-xl font-bold text-thai-green">Total de la commande:</span>
                      <span className="text-2xl font-bold text-thai-orange">{calculateTotal().toFixed(2)} €</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-thai-green/70">
                    <Package className="w-16 h-16 mx-auto mb-4 text-thai-green/30" />
                    <p>Aucun détail de commande disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommandeDetail;
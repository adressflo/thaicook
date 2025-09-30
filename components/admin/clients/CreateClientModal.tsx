'use client';

import React, { useState } from 'react';
import { useCreateClient } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';
import type { ClientInputData } from '@/types/app';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

const CreateClientModal = ({
  isOpen,
  onClose,
  onClientCreated
}: CreateClientModalProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero_de_telephone: '',
    adresse_numero_et_rue: '',
    code_postal: '',
    ville: '',
    date_de_naissance: '',
    preference_client: ''
  });

  const createClientMutation = useCreateClient();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique côté client
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim()) {
      toast({
        title: 'Erreur de validation',
        description: 'Le nom, prénom et email sont obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Générer un firebase_uid temporaire pour les clients créés manuellement
      // Dans un vrai scénario, cela viendrait de l'authentification Firebase
      const temporaryFirebaseUid = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const clientData: ClientInputData = {
        firebase_uid: temporaryFirebaseUid,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        numero_de_telephone: formData.numero_de_telephone.trim() || undefined,
        adresse_numero_et_rue: formData.adresse_numero_et_rue.trim() || undefined,
        code_postal: formData.code_postal.trim() ? parseInt(formData.code_postal.trim()) : undefined,
        ville: formData.ville.trim() || undefined,
        date_de_naissance: formData.date_de_naissance || undefined,
        preference_client: formData.preference_client.trim() || undefined,
        role: 'client'
      };

      const newClient = await createClientMutation.mutateAsync(clientData);

      toast({
        title: 'Client créé avec succès',
        description: `${formData.prenom} ${formData.nom} a été ajouté à la base de données.`,
      });

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        numero_de_telephone: '',
        adresse_numero_et_rue: '',
        code_postal: '',
        ville: '',
        date_de_naissance: '',
        preference_client: ''
      });

      // Callback pour notifier le parent
      if (onClientCreated) {
        onClientCreated(newClient);
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      toast({
        title: 'Erreur lors de la création',
        description: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite.',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="bg-gradient-to-r from-thai-orange/5 to-thai-cream/20 border-b border-thai-orange/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-thai-green flex items-center gap-3">
                <div className="p-2 bg-thai-orange/10 rounded-lg border border-thai-orange/20 shadow-sm">
                  <User className="w-6 h-6 text-thai-orange" />
                </div>
                <div>
                  <span className="text-xl font-bold">Nouveau Client</span>
                  <p className="text-sm text-gray-600 font-normal mt-1">
                    Créer une nouvelle fiche client
                  </p>
                </div>
              </CardTitle>
              <Button
                variant="ghost"
                onClick={onClose}
                className="hover:bg-thai-red/10 hover:text-thai-red transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-thai-green flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom" className="text-thai-green font-medium">
                      Prénom *
                    </Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      className="mt-1 border-thai-green/30 focus:border-thai-green"
                      placeholder="Prénom du client"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nom" className="text-thai-green font-medium">
                      Nom *
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className="mt-1 border-thai-green/30 focus:border-thai-green"
                      placeholder="Nom de famille"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-thai-green font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 border-thai-green/30 focus:border-thai-green"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telephone" className="text-thai-green font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.numero_de_telephone}
                    onChange={(e) => handleInputChange('numero_de_telephone', e.target.value)}
                    className="mt-1 border-thai-green/30 focus:border-thai-green"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <Label htmlFor="date_naissance" className="text-thai-green font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de naissance
                  </Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={formData.date_de_naissance}
                    onChange={(e) => handleInputChange('date_de_naissance', e.target.value)}
                    className="mt-1 border-thai-green/30 focus:border-thai-green"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-thai-green flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse
                </h3>

                <div>
                  <Label htmlFor="adresse" className="text-thai-green font-medium">
                    Numéro et rue
                  </Label>
                  <Input
                    id="adresse"
                    value={formData.adresse_numero_et_rue}
                    onChange={(e) => handleInputChange('adresse_numero_et_rue', e.target.value)}
                    className="mt-1 border-thai-green/30 focus:border-thai-green"
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code_postal" className="text-thai-green font-medium">
                      Code postal
                    </Label>
                    <Input
                      id="code_postal"
                      value={formData.code_postal}
                      onChange={(e) => handleInputChange('code_postal', e.target.value)}
                      className="mt-1 border-thai-green/30 focus:border-thai-green"
                      placeholder="75001"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ville" className="text-thai-green font-medium">
                      Ville
                    </Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      className="mt-1 border-thai-green/30 focus:border-thai-green"
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Préférences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-thai-green">
                  Préférences et notes
                </h3>

                <div>
                  <Label htmlFor="preferences" className="text-thai-green font-medium">
                    Préférences du client
                  </Label>
                  <Textarea
                    id="preferences"
                    value={formData.preference_client}
                    onChange={(e) => handleInputChange('preference_client', e.target.value)}
                    className="mt-1 border-thai-green/30 focus:border-thai-green"
                    placeholder="Allergies, préférences alimentaires, notes spéciales..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createClientMutation.isPending}
                  className="bg-thai-green hover:bg-thai-green/90 text-white"
                >
                  {createClientMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Créer le client
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateClientModal;
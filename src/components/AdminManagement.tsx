import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useSupabaseData';
import { supabase } from '@/lib/supabase';
import { Shield, ShieldCheck, Users, Mail, UserPlus, UserMinus } from 'lucide-react';

export const AdminManagement = () => {
  const [emailToPromote, setEmailToPromote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: clients, refetch } = useClients();
  const { toast } = useToast();

  const promoteToAdmin = async () => {
    if (!emailToPromote.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mettre à jour directement le rôle dans la table client_db
      const { data, error } = await supabase
        .from('client_db')
        .update({ role: 'admin' })
        .eq('email', emailToPromote.trim())
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast({
          title: "Succès",
          description: `${emailToPromote} a été promu administrateur`
        });
        setEmailToPromote('');
        refetch();
      } else {
        toast({
          title: "Erreur",
          description: "Aucun utilisateur trouvé avec cet email",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur promotion admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de promouvoir l'utilisateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoteToClient = async (email: string) => {
    setIsLoading(true);
    try {
      // Mettre à jour directement le rôle dans la table client_db
      const { data, error } = await supabase
        .from('client_db')
        .update({ role: 'client' })
        .eq('email', email)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast({
          title: "Succès",
          description: `${email} a été rétrogradé en client`
        });
        refetch();
      } else {
        toast({
          title: "Erreur",
          description: "Utilisateur non trouvé",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur rétrogradation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rétrograder l'utilisateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const admins = clients?.filter(client => client.role === 'admin') || [];
  const regularClients = clients?.filter(client => client.role === 'client') || [];

  return (
    <div className="space-y-6">
      {/* Promouvoir un utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-thai-green">
            <UserPlus className="w-5 h-5" />
            Promouvoir un Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Email de l'utilisateur à promouvoir"
              value={emailToPromote}
              onChange={(e) => setEmailToPromote(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={promoteToAdmin}
              disabled={isLoading || !emailToPromote.trim()}
              className="bg-thai-orange hover:bg-thai-orange/90"
            >
              {isLoading ? "..." : "Promouvoir"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            L'utilisateur doit déjà avoir un compte pour être promu administrateur.
          </p>
        </CardContent>
      </Card>

      {/* Liste des administrateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-thai-green">
            <ShieldCheck className="w-5 h-5" />
            Administrateurs Actuels ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.firebase_uid} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-thai-green">
                      {admin.prenom} {admin.nom}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {admin.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Admin
                  </Badge>
                  {admins.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => demoteToClient(admin.email)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-thai-green">
            <Users className="w-5 h-5" />
            Clients ({regularClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {regularClients.map((client) => (
              <div key={client.firebase_uid} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{client.prenom} {client.nom}</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
                <Badge variant="secondary">Client</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
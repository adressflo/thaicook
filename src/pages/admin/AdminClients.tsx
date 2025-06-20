import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Shield, UserPlus } from 'lucide-react';
import { useClients } from '@/hooks/useSupabaseData';
import { AdminManagement } from '@/components/AdminManagement';

const AdminClients = () => {
  const { data: clients } = useClients();

  const admins = clients?.filter(client => client.role === 'admin') || [];
  const regularClients = clients?.filter(client => client.role === 'client') || [];

  return (
    <div className="space-y-6">
      {/* Gestion des administrateurs */}
      <AdminManagement />

      {/* Statistiques clients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-thai-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-thai-green">{clients?.length || 0}</p>
            <p className="text-sm text-gray-600">Total Utilisateurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-thai-green">{admins.length}</p>
            <p className="text-sm text-gray-600">Administrateurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <UserPlus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-thai-green">{regularClients.length}</p>
            <p className="text-sm text-gray-600">Clients</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminClients;
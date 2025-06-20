import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Cog } from 'lucide-react';

const AdminParametres = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Cog className="w-16 h-16 text-thai-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-thai-green mb-2">
              Configuration
            </h3>
            <p className="text-gray-600">
              Cette section contiendra les paramètres de configuration du restaurant,
              horaires d'ouverture, délais de livraison, etc.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminParametres;
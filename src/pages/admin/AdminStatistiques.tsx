import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

const AdminStatistiques = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistiques Détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <TrendingUp className="w-16 h-16 text-thai-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-thai-green mb-2">
              Statistiques Avancées
            </h3>
            <p className="text-gray-600">
              Cette section contiendra des graphiques et analyses détaillées des ventes,
              plats populaires, et tendances clients.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminStatistiques;
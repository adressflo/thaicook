import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import AdminLayout from './AdminLayout';
import AdminTableauDeBord from './AdminTableauDeBord';
import AdminGestionPlats from './AdminGestionPlats';
import AdminCommandes from './AdminCommandes';
import AdminClients from './AdminClients';
import AdminStatistiques from './AdminStatistiques';
import AdminParametres from './AdminParametres';

const AdminRouter = () => {
  return (
    <PermissionGuard requireAdmin={true}>
      <AdminLayout>
        <Routes>
          {/* Route par défaut vers le tableau de bord */}
          <Route path="/" element={<AdminTableauDeBord />} />
          
          {/* Pages Admin */}
          <Route path="/dashboard" element={<AdminTableauDeBord />} />
          <Route path="/plats" element={<AdminGestionPlats />} />
          <Route path="/commandes" element={<AdminCommandes />} />
          <Route path="/clients" element={<AdminClients />} />
          <Route path="/statistiques" element={<AdminStatistiques />} />
          <Route path="/parametres" element={<AdminParametres />} />
          
          {/* Route 404 pour admin */}
          <Route path="*" element={<AdminTableauDeBord />} />
        </Routes>
      </AdminLayout>
    </PermissionGuard>
  );
};

export default AdminRouter;
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/PermissionGuard';
import AdminLayout from './AdminLayout';
import AdminCentreCommandement from './AdminCentreCommandement';
import AdminCentraleApprovisionnement from './AdminCentraleApprovisionnement';
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
          {/* Route par défaut vers le centre de commandement */}
          <Route path="/" element={<AdminCentreCommandement />} />
          
          {/* Pages Admin */}
          <Route path="/centre-commandement" element={<AdminCentreCommandement />} />
          <Route path="/courses" element={<AdminCentraleApprovisionnement />} />
          <Route path="/commandes" element={<AdminCommandes />} />
          <Route path="/plats" element={<AdminGestionPlats />} />
          <Route path="/clients" element={<AdminClients />} />
          <Route path="/statistiques" element={<AdminStatistiques />} />
          <Route path="/parametres" element={<AdminParametres />} />
          
          {/* Route 404 pour admin */}
          <Route path="*" element={<AdminCentreCommandement />} />
        </Routes>
      </AdminLayout>
    </PermissionGuard>
  );
};

export default AdminRouter;
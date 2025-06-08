import { Suspense, lazy, useState } from 'react'; // MODIFICATION: Ajout de useState
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { CartProvider } from './contexts/CartContext';
import Sidebar from "./components/Sidebar";
import AdminRoute from './components/AdminRoute';
import { Loader2 } from 'lucide-react';
import './firebaseConfig';
import './index.css';
import FloatingCartIcon from './components/FloatingCartIcon';
import LanguageSelector from './components/LanguageSelector';
import { cn } from './lib/utils'; // MODIFICATION: Import de cn

// Lazy load pages for better performance
const TableauDeBord = lazy(() => import("./pages/TableauDeBord"));
const Commander = lazy(() => import("./pages/Commander"));
const Evenements = lazy(() => import("./pages/Evenements"));
const Profil = lazy(() => import("./pages/Profil"));
const NousTrouver = lazy(() => import("./pages/NousTrouver"));
const APropos = lazy(() => import("./pages/APropos"));
const AirtableConfig = lazy(() => import("./components/AirtableConfig"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminCommandes = lazy(() => import("./pages/AdminCommandes"));
const AdminCommandeDetail = lazy(() => import("./pages/AdminCommandeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-thai-orange mx-auto mb-4" />
      <p className="text-thai-green font-medium">Chargement...</p>
    </div>
  </div>
);

const App = () => {
  // MODIFICATION: L'état de la sidebar est maintenant géré ici
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <div className="min-h-screen bg-background flex w-full">
                {/* MODIFICATION: On passe l'état et la fonction pour le modifier à la Sidebar */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <LanguageSelector />
                {/* MODIFICATION: La marge de la page principale est maintenant dynamique */}
                <main className={cn(
                  "flex-1 transition-all duration-300",
                  isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
                )}>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<TableauDeBord />} />
                      <Route path="/commander" element={<Commander />} />
                      <Route path="/evenements" element={<Evenements />} />
                      <Route path="/profil" element={<Profil />} />
                      <Route path="/nous-trouver" element={<NousTrouver />} />
                      <Route path="/a-propos" element={<APropos />} />
                      
                      <Route path="/airtable-config" element={<AirtableConfig />} />

                      <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/commandes" element={<AdminCommandes />} />
                        <Route path="/admin/commandes/:id" element={<AdminCommandeDetail />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <FloatingCartIcon />
              </div>
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
};

export default App;

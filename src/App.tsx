import './firebaseConfig';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Sidebar from "./components/Sidebar";

// Lazy load pages for better performance
const TableauDeBord = lazy(() => import("./pages/TableauDeBord"));
const Commander = lazy(() => import("./pages/Commander"));
const Evenements = lazy(() => import("./pages/Evenements"));
const Profil = lazy(() => import("./pages/Profil"));
const NousTrouver = lazy(() => import("./pages/NousTrouver"));
const APropos = lazy(() => import("./pages/APropos"));
// La ligne pour AirtableTest a été supprimée
const AirtableConfig = lazy(() => import("./components/AirtableConfig"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminCommandes = lazy(() => import("./pages/AdminCommandes"));
const AdminCommandeDetail = lazy(() => import("./pages/AdminCommandeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-thai">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-thai-green font-medium">Chargement...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex w-full">
          <Sidebar />
          <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<TableauDeBord />} />
                <Route path="/commander" element={<Commander />} />
                <Route path="/evenements" element={<Evenements />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/nous-trouver" element={<NousTrouver />} />
                <Route path="/a-propos" element={<APropos />} />
                <Route path="/airtable-config" element={<AirtableConfig />} />
                {/* La route pour /airtable-test a été supprimée */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/commandes" element={<AdminCommandes />} />
                <Route path="/admin/commandes/:id" element={<AdminCommandeDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
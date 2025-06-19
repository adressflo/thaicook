
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-thai flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-thai-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
          <h1 className="text-4xl font-bold text-thai-green mb-4">
            Page non trouvée
          </h1>
          <p className="text-xl text-thai-green/70 mb-8">
            Oups ! La page que vous recherchez semble avoir disparu comme un parfum de citronnelle...
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="bg-thai-orange hover:bg-thai-orange-dark text-white w-full">
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white w-full">
            <Link to="/commander">
              Voir le menu
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

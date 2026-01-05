import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-thai flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Image ou illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-thai-orange/20 rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-thai-orange">404</span>
          </div>
        </div>

        {/* Titre et description */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-thai-green">
            Page non trouvée
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
            Découvrez nos délicieux plats thaïlandais en retournant à l'accueil !
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-thai-orange hover:bg-thai-orange/90">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-thai-green text-thai-green hover:bg-thai-green/10">
            <Link href="/commander" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voir le menu
            </Link>
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-thai-orange/20">
          <h3 className="font-semibold text-thai-green mb-4">Vous pourriez être intéressé par :</h3>
          <div className="grid grid-cols-1 gap-2">
            <Link 
              href="/commander" 
              className="text-sm text-gray-600 hover:text-thai-orange transition-colors"
            >
              🍜 Découvrir notre menu complet
            </Link>
            <Link 
              href="/evenements" 
              className="text-sm text-gray-600 hover:text-thai-orange transition-colors"
            >
              🎉 Organiser un événement
            </Link>
            <Link 
              href="/historique" 
              className="text-sm text-gray-600 hover:text-thai-orange transition-colors"
            >
              📋 Consulter vos commandes
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.</p>
        </div>
      </div>
    </div>
  );
}
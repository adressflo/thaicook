import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const FloatingCartIcon = () => {
  const { totalArticles } = useCart();

  // N'affiche l'icône que si le panier n'est pas vide
  if (totalArticles === 0) {
    return null;
  }

  return (
    <Link 
      to="/commander" 
      className="fixed top-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-thai-orange text-white shadow-lg transition-transform hover:scale-110"
      aria-label={`Voir le panier, ${totalArticles} article(s)`}
    >
      <ShoppingCart className="h-7 w-7" />
      <Badge 
        variant="destructive"
        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs"
      >
        {totalArticles}
      </Badge>
    </Link>
  );
};

export default FloatingCartIcon;

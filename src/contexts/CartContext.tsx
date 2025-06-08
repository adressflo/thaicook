import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PlatPanier } from '@/types/airtable';

// Définit la forme des données et fonctions que notre contexte va fournir
interface CartContextType {
  panier: PlatPanier[];
  ajouterAuPanier: (plat: PlatPanier) => void;
  modifierQuantite: (id: string, nouvelleQuantite: number) => void;
  viderPanier: () => void;
  totalArticles: number;
  totalPrix: number;
}

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props pour le composant Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // L'état du panier, initialisé depuis le localStorage
  const [panier, setPanier] = useState<PlatPanier[]>(() => {
    try {
      const item = window.localStorage.getItem('panier');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Erreur lors de la lecture du panier depuis localStorage", error);
      return [];
    }
  });

  // Sauvegarde le panier dans le localStorage à chaque modification
  useEffect(() => {
    try {
      window.localStorage.setItem('panier', JSON.stringify(panier));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier dans localStorage", error);
    }
  }, [panier]);

  // Fonction pour ajouter un plat
  const ajouterAuPanier = (plat: PlatPanier) => {
    setPanier(prev => {
      const platExistant = prev.find(p => p.id === plat.id);
      if (platExistant) {
        return prev.map(p => p.id === plat.id ? { ...p, quantite: p.quantite + 1 } : p);
      }
      return [...prev, { ...plat, quantite: 1 }];
    });
  };

  // Fonction pour modifier la quantité
  const modifierQuantite = (id: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite < 0) return;
    setPanier(prev => {
        if (nouvelleQuantite === 0) return prev.filter(p => p.id !== id);
        return prev.map(p => p.id === id ? { ...p, quantite: nouvelleQuantite } : p);
    });
  };

  // Fonction pour vider le panier
  const viderPanier = () => {
    setPanier([]);
  };

  // Calculs mémorisés pour la performance
  const totalArticles = panier.reduce((total, plat) => total + plat.quantite, 0);
  const totalPrix = panier.reduce((total, plat) => total + (plat.prix * plat.quantite), 0);

  // Valeur fournie par le contexte
  const value = {
    panier,
    ajouterAuPanier,
    modifierQuantite,
    viderPanier,
    totalArticles,
    totalPrix,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte facilement
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

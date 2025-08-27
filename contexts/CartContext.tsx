'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PlatPanier } from '@/types/app'

// Définit la forme des données et fonctions que notre contexte va fournir
interface CartContextType {
  panier: PlatPanier[];
  ajouterAuPanier: (plat: PlatPanier) => void;
  modifierQuantite: (id: string, nouvelleQuantite: number) => void;
  supprimerDuPanier: (id: string) => void;
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
  const [panier, setPanier] = useState<PlatPanier[]>([]);

  // Initialisation du panier depuis localStorage côté client
  useEffect(() => {
    try {
      const item = window.localStorage.getItem('panier');
      if (item) {
        const parsed = JSON.parse(item);
        // Reconvertir les dates de string vers Date et ajouter des IDs uniques
        const panierFromStorage = parsed.map((p: Partial<PlatPanier>, index: number) => ({
          ...p,
          dateRetrait: p.dateRetrait ? new Date(p.dateRetrait) : undefined,
          uniqueId: p.uniqueId || `${p.id}-${Date.now()}-${index}` // ID unique pour chaque article
        }));
        setPanier(panierFromStorage);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du panier depuis localStorage", error);
    }
  }, []);

  // Sauvegarde le panier dans le localStorage à chaque modification
  useEffect(() => {
    try {
      // Convertir les dates en string pour la sérialisation JSON
      const panierForStorage = panier.map(p => ({
        ...p,
        dateRetrait: p.dateRetrait ? p.dateRetrait.toISOString() : undefined
      }));
      window.localStorage.setItem('panier', JSON.stringify(panierForStorage));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier dans localStorage", error);
    }
  }, [panier]);

  // Fonction pour ajouter un plat
  const ajouterAuPanier = (plat: PlatPanier) => {
    setPanier(prev => {
      // Chercher un plat identique avec le même jour et la même date
      const platExistant = prev.find(p => 
        p.id === plat.id && 
        p.jourCommande === plat.jourCommande &&
        p.dateRetrait?.toDateString() === plat.dateRetrait?.toDateString()
      );
      
      if (platExistant) {
        return prev.map(p => 
          p.id === plat.id && 
          p.jourCommande === plat.jourCommande &&
          p.dateRetrait?.toDateString() === plat.dateRetrait?.toDateString()
            ? { ...p, quantite: p.quantite + 1 } 
            : p
        );
      }
      
      // Ajouter un nouvel article avec un ID unique
      const nouvelArticle = { 
        ...plat, 
        quantite: plat.quantite || 1,
        uniqueId: `${plat.id}-${Date.now()}-${Math.random()}`
      };
      return [...prev, nouvelArticle];
    });
  };

  // Fonction pour modifier la quantité
  const modifierQuantite = (uniqueId: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      supprimerDuPanier(uniqueId);
      return;
    }
    
    setPanier(prev => prev.map(item => 
      item.uniqueId === uniqueId 
        ? { ...item, quantite: nouvelleQuantite }
        : item
    ));
  };

  // Fonction pour supprimer un article du panier
  const supprimerDuPanier = (uniqueId: string) => {
    setPanier(prev => prev.filter(item => item.uniqueId !== uniqueId));
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
    supprimerDuPanier,
    viderPanier,
    totalArticles,
    totalPrix,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte facilement
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error('useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
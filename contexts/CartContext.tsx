"use client"

import type { PlatPanier } from "@/types/app"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

// Définit la forme des données et fonctions que notre contexte va fournir
interface CartContextType {
  panier: PlatPanier[]
  ajouterAuPanier: (plat: PlatPanier) => void
  modifierQuantite: (id: string, nouvelleQuantite: number) => void
  modifierDistributionEpice: (id: string, nouvelleDistribution: number[]) => void
  supprimerDuPanier: (id: string) => void
  viderPanier: () => void
  totalArticles: number
  totalPrix: number
  ajouterPlusieursAuPanier: (plats: PlatPanier[]) => void
}

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined)

// Props pour le composant Provider
interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // L'état du panier, initialisé depuis le localStorage
  const [panier, setPanier] = useState<PlatPanier[]>([])

  // Initialisation du panier depuis localStorage côté client
  useEffect(() => {
    try {
      const item = window.localStorage.getItem("panier")
      if (item) {
        const parsed = JSON.parse(item)
        // Reconvertir les dates de string vers Date et ajouter des IDs uniques
        const panierFromStorage = parsed.map((p: Partial<PlatPanier>, index: number) => ({
          ...p,
          dateRetrait: p.dateRetrait ? new Date(p.dateRetrait) : undefined,
          uniqueId: p.uniqueId || `${p.id}-${Date.now()}-${index}`, // ID unique pour chaque article
        }))
        setPanier(panierFromStorage)
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du panier depuis localStorage", error)
    }
  }, [])

  // Sauvegarde le panier dans le localStorage à chaque modification
  useEffect(() => {
    try {
      // Convertir les dates en string pour la sérialisation JSON
      const panierForStorage = panier.map((p) => ({
        ...p,
        dateRetrait: p.dateRetrait ? p.dateRetrait.toISOString() : undefined,
      }))
      window.localStorage.setItem("panier", JSON.stringify(panierForStorage))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier dans localStorage", error)
    }
  }, [panier])

  // Helper pour comparer les distributions épicées
  const isSameSpiceDistribution = (a?: number[], b?: number[]) => {
    if (!a && !b) return true
    if (!a || !b) return false
    if (a.length !== b.length) return false
    return a.every((val, idx) => val === b[idx])
  }

  // Fonction pour ajouter un plat
  const ajouterAuPanier = (plat: PlatPanier) => {
    setPanier((prev) => {
      // Chercher un plat identique avec le même jour, la même date, la même préférence épicée ET la même distribution épicée
      const platExistant = prev.find(
        (p) =>
          p.id === plat.id &&
          p.jourCommande === plat.jourCommande &&
          p.dateRetrait?.toDateString() === plat.dateRetrait?.toDateString() &&
          p.demandeSpeciale === plat.demandeSpeciale &&
          isSameSpiceDistribution(p.spiceDistribution, plat.spiceDistribution)
      )

      if (platExistant) {
        return prev.map((p) =>
          p.id === plat.id &&
          p.jourCommande === plat.jourCommande &&
          p.dateRetrait?.toDateString() === plat.dateRetrait?.toDateString() &&
          p.demandeSpeciale === plat.demandeSpeciale &&
          isSameSpiceDistribution(p.spiceDistribution, plat.spiceDistribution)
            ? { ...p, quantite: p.quantite + plat.quantite }
            : p
        )
      }

      // Ajouter un nouvel article avec un ID unique
      const nouvelArticle = {
        ...plat,
        quantite: plat.quantite || 1,
        uniqueId: `${plat.id}-${Date.now()}-${Math.random()}`,
      }
      return [...prev, nouvelArticle]
    })
  }

  // Fonction pour ajouter plusieurs plats
  const ajouterPlusieursAuPanier = (plats: PlatPanier[]) => {
    setPanier((prev) => {
      let newPanier = [...prev]

      plats.forEach((plat) => {
        const index = newPanier.findIndex(
          (p) =>
            p.id === plat.id &&
            p.jourCommande === plat.jourCommande &&
            p.dateRetrait?.toDateString() === plat.dateRetrait?.toDateString() &&
            p.demandeSpeciale === plat.demandeSpeciale &&
            isSameSpiceDistribution(p.spiceDistribution, plat.spiceDistribution)
        )

        if (index !== -1) {
          newPanier[index] = {
            ...newPanier[index],
            quantite: newPanier[index].quantite + plat.quantite,
          }
        } else {
          newPanier.push({
            ...plat,
            quantite: plat.quantite || 1,
            uniqueId: `${plat.id}-${Date.now()}-${Math.random()}`,
          })
        }
      })
      return newPanier
    })
  }

  // Fonction pour modifier la quantité
  const modifierQuantite = (uniqueId: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      supprimerDuPanier(uniqueId)
      return
    }

    setPanier((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantite: nouvelleQuantite } : item
      )
    )
  }

  // Fonction pour modifier la distribution d'épices
  const modifierDistributionEpice = (uniqueId: string, nouvelleDistribution: number[]) => {
    setPanier((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, spiceDistribution: nouvelleDistribution } : item
      )
    )
  }

  // Fonction pour supprimer un article du panier
  const supprimerDuPanier = (uniqueId: string) => {
    setPanier((prev) => prev.filter((item) => item.uniqueId !== uniqueId))
  }

  // Fonction pour vider le panier
  const viderPanier = () => {
    setPanier([])
  }

  // Calculs mémorisés pour la performance
  const totalArticles = panier.reduce((total, plat) => total + plat.quantite, 0)
  const totalPrix = panier.reduce((total, plat) => total + parseFloat(plat.prix) * plat.quantite, 0)

  // Valeur fournie par le contexte
  const value = {
    panier,
    ajouterAuPanier,
    ajouterPlusieursAuPanier,
    modifierQuantite,
    modifierDistributionEpice,
    supprimerDuPanier,
    viderPanier,
    totalArticles,
    totalPrix,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook personnalisé pour utiliser le contexte facilement
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    console.error("useCart must be used within a CartProvider")
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

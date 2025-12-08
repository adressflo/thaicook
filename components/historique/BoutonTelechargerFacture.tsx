"use client"

import FactureCommandePDF from "@/components/pdf/FactureCommandePDF"
import { Button } from "@/components/ui/button"
import type { CommandeUI } from "@/types/app"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import React from "react"

interface BoutonTelechargerFactureProps {
  commande: CommandeUI
  // On ajoute une prop pour le style, pour pouvoir le mettre à côté de l'autre bouton
  className?: string
}

const BoutonTelechargerFacture: React.FC<BoutonTelechargerFactureProps> = ({
  commande,
  className,
}) => {
  // Nom du fichier qui sera téléchargé
  const nomFichier = `facture-chanthana-${commande.idcommande}.pdf`

  // On s'assure que la commande n'est pas nulle avant de rendre le composant
  if (!commande) {
    return null
  }

  return (
    <PDFDownloadLink document={<FactureCommandePDF commande={commande} />} fileName={nomFichier}>
      {({ loading }) => (
        <Button variant="outline" size="sm" disabled={loading} className={className}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {loading ? "Génération..." : "Facture"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

export default BoutonTelechargerFacture

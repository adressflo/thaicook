"use client"

import { Button } from "@/components/ui/button"
import type { CommandeUI } from "@/types/app"
import { Download, Loader2 } from "lucide-react"
import React from "react"

interface BoutonTelechargerFactureProps {
  commande: CommandeUI
  className?: string
}

const BoutonTelechargerFacture: React.FC<BoutonTelechargerFactureProps> = ({
  commande,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // Construire le nom du client
      const clientName = commande.client
        ? `${commande.client.prenom || ""} ${commande.client.nom || ""}`.trim() || "Client"
        : commande.client_r || "Client"

      // Construire l'adresse
      const clientAddress = commande.client
        ? [
            commande.client.adresse_numero_et_rue,
            commande.client.code_postal,
            commande.client.ville,
          ]
            .filter(Boolean)
            .join(", ")
        : commande.adresse_specifique || ""

      // Préparer les données pour l'API Playwright
      const data = {
        docType: "FACTURE" as const,
        docRef: `FAC-${commande.idcommande}`,
        docDate: new Date().toLocaleDateString("fr-FR"),
        client: {
          name: clientName,
          address: clientAddress,
          phone: commande.client?.numero_de_telephone || "",
        },
        event: {
          name: "Commande",
          date: commande.date_et_heure_de_retrait_souhaitees
            ? new Date(commande.date_et_heure_de_retrait_souhaitees).toLocaleDateString("fr-FR")
            : "",
          location: commande.adresse_specifique || commande.type_livraison || "",
        },
        products:
          commande.details?.map((d) => ({
            name: d.plat?.plat || d.nom_plat || "Plat",
            desc: `x${d.quantite_plat_commande}`,
            img: d.plat?.photo_du_plat || undefined,
          })) || [],
        total: commande.total || 0,
        mentions: "Merci pour votre commande !",
      }

      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du PDF")
      }

      // Télécharger le PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `facture-chanthana-${commande.idcommande}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur téléchargement facture:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!commande) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading}
      className={className}
      onClick={handleDownload}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Génération..." : "Facture"}
    </Button>
  )
}

export default BoutonTelechargerFacture

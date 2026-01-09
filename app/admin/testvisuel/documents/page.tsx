"use client"

import type { DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

const DATA: DevisTemplateData = {
  docType: "DEVIS",
  docRef: "N°202619",
  docDate: "09/01",

  client: {
    name: "Commune de Marigny Marmande Mairie",
    address: "26 Gr Grande Rue, 37120 Marigny-Marmande",
    phone: "02 47 58 31 11",
  },

  event: {
    name: "Repas des Vœux du Maire",
    location: "Salle des fêtes de Marigny Marmande",
    date: "10/01/2026 à 17h",
  },

  products: [
    { name: "Ailes de poulets", desc: "Marinées et croustillantes" },
    { name: "Chips crevettes", desc: "Légères et croustillantes" },
    { name: "Crevettes à l'ail", desc: "Sauce à l'ail frais" },
    { name: "Nems", desc: "Frits minute" },
    { name: "Compléments divers", desc: "Accompagnements" },
  ],

  total: 850.0,
  mentions: "Budget TTC global validé.",
}

export default function TestDocumentsPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(DATA),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)

      toast({
        title: "✅ PDF généré",
        description: "Le document est prêt à être consulté.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        variant: "destructive",
        title: "❌ Erreur",
        description: "Impossible de générer le PDF. Vérifiez la console.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = () => {
    if (!pdfUrl) return

    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${DATA.docRef}.pdf`
    link.click()
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">🧪 Playground PDF - Playwright</h1>
        <p className="text-gray-600">
          Génération de devis via Playwright (support natif des images WebP)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Controls */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">📄 Document</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Type:</span> {DATA.docType}
              </div>
              <div>
                <span className="font-medium">Réf:</span> {DATA.docRef}
              </div>
              <div>
                <span className="font-medium">Date:</span> {DATA.docDate}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">👤 Client</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{DATA.client.name}</p>
              <p className="text-gray-600">{DATA.client.address}</p>
              <p className="text-gray-600">{DATA.client.phone}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">🎉 Événement</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{DATA.event.name}</p>
              <p className="text-gray-600">{DATA.event.date}</p>
              <p className="text-gray-600">{DATA.event.location}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">💰 Total</h2>
            <p className="text-2xl font-bold text-green-600">{DATA.total.toFixed(2)} €</p>
          </div>

          <div className="space-y-2">
            <Button onClick={generatePDF} disabled={isGenerating} className="w-full" size="lg">
              {isGenerating ? "⏳ Génération..." : "🚀 Générer le PDF"}
            </Button>

            {pdfUrl && (
              <Button onClick={downloadPDF} variant="outline" className="w-full" size="lg">
                ⬇️ Télécharger
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT: PDF Preview */}
        <div className="lg:col-span-2">
          <div className="bg-card h-[calc(100vh-200px)] rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">👁️ Prévisualisation</h2>
            {!pdfUrl ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="mb-2 text-lg">Aucun PDF généré</p>
                  <p className="text-sm">Cliquez sur &quot;Générer le PDF&quot; pour commencer</p>
                </div>
              </div>
            ) : (
              <iframe src={pdfUrl} className="h-full w-full rounded border" title="PDF Preview" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

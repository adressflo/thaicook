"use client"

import type { DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useMemo, useState } from "react"

const MINIO_BASE = "http://116.203.111.206:9000/platphoto"

const BASE_DATA = {
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
    {
      name: "Ailes de poulets",
      desc: "Marinées et croustillantes",
      img: `${MINIO_BASE}/ailes_poulet.webp`,
    },
    {
      name: "Chips crevettes",
      desc: "Légères et croustillantes",
      img: `${MINIO_BASE}/chips_crevettes.webp`,
    },
    {
      name: "Crevettes à l'ail",
      desc: "Sauce à l'ail frais",
      img: `${MINIO_BASE}/crevettes_ail.webp`,
    },
    { name: "Nems", desc: "Frits minute", img: `${MINIO_BASE}/nems.webp` },
    { name: "Riz nature", desc: "Accompagnement", img: `${MINIO_BASE}/riz_nature.webp` },
  ],

  total: 850.0,
  mentions: "Budget TTC global validé.",
}

type DocType = "DEVIS" | "FACTURE" | "TICKET"

// Générer le HTML du template (même code que dans route.ts)
function generatePreviewHTML(data: DevisTemplateData): string {
  const productsHTML = data.products
    .map(
      (product) => `
      <div class="product-item">
        <div class="product-icon">
          ${
            product.img
              ? `<img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'" />`
              : `<svg class="product-icon-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>`
          }
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.desc}</div>
        </div>
      </div>
    `
    )
    .join("")

  const badgeColor =
    data.docType === "DEVIS" ? "#f97316" : data.docType === "FACTURE" ? "#3b82f6" : "#16a34a"

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: white; color: #1a1a1a; padding: 24px; }
    .page { max-width: 100%; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #f5f5f0; }
    .header-left { display: flex; gap: 12px; align-items: center; }
    .avatar-container { width: 60px; height: 60px; border-radius: 10px; background: #f5f5f0; padding: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .avatar { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
    .company-info { display: flex; flex-direction: column; gap: 2px; }
    .company-name { font-size: 16px; font-weight: 700; color: #16a34a; }
    .company-tagline { font-size: 11px; color: #666; font-weight: 500; }
    .company-address { font-size: 10px; color: #999; margin-top: 2px; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .doc-badge { background: linear-gradient(135deg, ${badgeColor} 0%, ${badgeColor}dd 100%); color: white; padding: 6px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; letter-spacing: 1px; }
    .doc-ref, .doc-date { font-size: 11px; color: #666; font-weight: 500; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .info-card { border-left: 3px solid #16a34a; background: #f9fafb; padding: 12px; border-radius: 6px; }
    .info-card.event { border-left-color: #f97316; }
    .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600; margin-bottom: 6px; }
    .info-title { font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
    .info-details { font-size: 11px; color: #666; line-height: 1.5; }
    .products-section { margin-bottom: 16px; }
    .products-header { background: #16a34a; color: white; padding: 10px 14px; border-radius: 6px 6px 0 0; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .product-item { display: flex; gap: 10px; padding: 12px; border-bottom: 1px solid #e5e7eb; background: white; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
    .product-item:last-child { border-bottom: none; border-radius: 0 0 6px 6px; border: 1px solid #e5e7eb; }
    .product-icon { width: 40px; height: 40px; border-radius: 6px; background: #f5f5f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
    .product-icon img { width: 100%; height: 100%; object-fit: cover; }
    .product-icon-placeholder { width: 20px; height: 20px; color: #999; }
    .product-details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .product-name { font-size: 12px; font-weight: 600; color: #1a1a1a; margin-bottom: 1px; }
    .product-desc { font-size: 10px; color: #666; }
    .divider { height: 2px; background: repeating-linear-gradient(to right, #f97316 0px, #f97316 8px, transparent 8px, transparent 16px); margin: 16px 0; }
    .total-section { background: linear-gradient(135deg, #f5f5f0 0%, #ebebeb 100%); padding: 16px; border-radius: 10px; margin-bottom: 14px; }
    .total-label { font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .total-amount { font-size: 28px; font-weight: 700; color: #16a34a; letter-spacing: -1px; }
    .mentions { font-size: 9px; color: #999; line-height: 1.5; padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="avatar-container">
          <img src="http://localhost:3000/media/statut/evenement/buffet/buffet1.png" alt="Logo" class="avatar" />
        </div>
        <div class="company-info">
          <div class="company-name">CHANTHANATHAICOOK</div>
          <div class="company-tagline">Traiteur Thaïlandais</div>
          <div class="company-address">2 impasse de la poste, 37120 Marigny Marmande</div>
        </div>
      </div>
      <div class="header-right">
        <div class="doc-badge">${data.docType}</div>
        <div class="doc-ref">${data.docRef}</div>
        <div class="doc-date">${data.docDate}</div>
      </div>
    </div>
    <div class="info-section">
      <div class="info-card">
        <div class="info-label">Client</div>
        <div class="info-title">${data.client.name}</div>
        <div class="info-details">${data.client.address}${data.client.phone ? `<br />${data.client.phone}` : ""}</div>
      </div>
      <div class="info-card event">
        <div class="info-label">Événement</div>
        <div class="info-title">${data.event.name}</div>
        <div class="info-details">${data.event.date}<br />${data.event.location}</div>
      </div>
    </div>
    <div class="products-section">
      <div class="products-header">Menu Proposé</div>
      ${productsHTML}
    </div>
    <div class="divider"></div>
    <div class="total-section">
      <div class="total-label">Total</div>
      <div class="total-amount">${data.total.toFixed(2)} €</div>
    </div>
    ${data.mentions ? `<div class="mentions">${data.mentions}</div>` : ""}
  </div>
</body>
</html>`
}

export default function TestDocumentsPage() {
  const [docType, setDocType] = useState<DocType>("DEVIS")
  const [isGenerating, setIsGenerating] = useState(false)

  const getData = (): DevisTemplateData => ({
    ...BASE_DATA,
    docType: docType === "TICKET" ? "RECU" : docType,
  })

  // Prévisualisation HTML live (mise à jour instantanée)
  const previewHTML = useMemo(() => {
    const data: DevisTemplateData = {
      ...BASE_DATA,
      docType: docType === "TICKET" ? "RECU" : docType,
    }
    return generatePreviewHTML(data)
  }, [docType])

  // Générer et télécharger le PDF via l'API Playwright
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getData()),
      })

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${docType}-${BASE_DATA.docRef}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      toast({ title: "✅ PDF téléchargé", description: `${docType} généré avec succès.` })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        variant: "destructive",
        title: "❌ Erreur",
        description: "Impossible de générer le PDF.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">🧪 Playground PDF - Playwright</h1>
        <p className="text-gray-600">Prévisualisation live + Génération PDF via Playwright</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Controls */}
        <div className="space-y-4 lg:col-span-1">
          {/* Document Type Buttons */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">📋 Type de document</h2>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => setDocType("DEVIS")}
                variant={docType === "DEVIS" ? "default" : "outline"}
                className={docType === "DEVIS" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                Devis
              </Button>
              <Button
                onClick={() => setDocType("FACTURE")}
                variant={docType === "FACTURE" ? "default" : "outline"}
                className={docType === "FACTURE" ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                Facture
              </Button>
              <Button
                onClick={() => setDocType("TICKET")}
                variant={docType === "TICKET" ? "default" : "outline"}
                className={docType === "TICKET" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                Ticket
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">📄 Document</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Type:</span>{" "}
                <span className="rounded bg-orange-100 px-2 py-0.5 font-semibold text-orange-700">
                  {docType}
                </span>
              </div>
              <div>
                <span className="font-medium">Réf:</span> {BASE_DATA.docRef}
              </div>
              <div>
                <span className="font-medium">Date:</span> {BASE_DATA.docDate}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">👤 Client</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{BASE_DATA.client.name}</p>
              <p className="text-gray-600">{BASE_DATA.client.address}</p>
              <p className="text-gray-600">{BASE_DATA.client.phone}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">💰 Total</h2>
            <p className="text-2xl font-bold text-green-600">{BASE_DATA.total.toFixed(2)} €</p>
          </div>

          <Button
            onClick={generateAndDownloadPDF}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? "⏳ Génération..." : `⬇️ Télécharger ${docType} (PDF)`}
          </Button>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="lg:col-span-2">
          <div className="bg-card h-[calc(100vh-200px)] rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">👁️ Prévisualisation live</h2>
            <iframe
              srcDoc={previewHTML}
              className="h-full w-full rounded border bg-white"
              title="Prévisualisation PDF"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

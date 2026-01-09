"use client"

import { getPlats } from "@/app/actions/plats"
import type { DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getStorageUrl } from "@/lib/storage-utils"
import type { PlatUI } from "@/types/app"
import { Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"

// Types
interface SelectedPlat {
  plat: PlatUI
  quantite: number
}

type DocType = "DEVIS" | "FACTURE" | "TICKET"

function generatePreviewHTML(data: DevisTemplateData): string {
  const productsHTML = data.products
    .map(
      (product) => `
      <div class="product-item">
        <div class="product-icon">
          ${
            product.img
              ? `<img src="${product.img}" alt="${product.name}" onerror="this.parentElement.innerHTML='🍜'" />`
              : `<div class="product-emoji">🍜</div>`
          }
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.desc}</div>
        </div>
        <div class="product-price">
          <div class="qty">x${product.qty || 1}</div>
          ${product.price ? `<div class="price">${product.price}€</div>` : ""}
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
    .header-left { display: flex; gap: 14px; align-items: center; }
    .avatar-container { width: 70px; height: 70px; border-radius: 12px; background: linear-gradient(135deg, #fef7e0 0%, #fff5cc 100%); padding: 6px; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid #f97316; }
    .avatar { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
    .company-info { display: flex; flex-direction: column; gap: 2px; }
    .company-name { font-size: 16px; font-weight: 700; color: #2d5016; }
    .company-tagline { font-size: 11px; color: #666; font-weight: 500; }
    .company-address { font-size: 10px; color: #999; margin-top: 2px; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .doc-badge { background: linear-gradient(135deg, ${badgeColor} 0%, ${badgeColor}dd 100%); color: white; padding: 6px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; letter-spacing: 1px; }
    .doc-ref, .doc-date { font-size: 11px; color: #666; font-weight: 500; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .info-card { border-left: 3px solid #2d5016; background: #f9fafb; padding: 12px; border-radius: 6px; }
    .info-card.event { border-left-color: #f97316; }
    .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600; margin-bottom: 6px; }
    .info-title { font-size: 13px; font-weight: 700; color: #2d5016; margin-bottom: 2px; }
    .info-details { font-size: 11px; color: #666; line-height: 1.5; }
    .products-section { margin-bottom: 16px; }
    .products-header { background: #2d5016; color: white; padding: 10px 14px; border-radius: 6px 6px 0 0; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .product-item { display: flex; gap: 10px; padding: 12px; border-bottom: 1px solid #e5e7eb; background: white; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; align-items: center; }
    .product-item:last-child { border-radius: 0 0 6px 6px; border-bottom: 1px solid #e5e7eb; }
    .product-icon { width: 50px; height: 50px; border-radius: 8px; background: #f5f5f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
    .product-icon img { width: 100%; height: 100%; object-fit: cover; }
    .product-emoji { font-size: 24px; }
    .product-details { flex: 1; }
    .product-name { font-size: 13px; font-weight: 600; color: #2d5016; margin-bottom: 2px; }
    .product-desc { font-size: 10px; color: #666; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-price { text-align: right; min-width: 70px; }
    .product-price .qty { font-size: 10px; color: #999; }
    .product-price .price { font-size: 14px; font-weight: 700; color: #2d5016; }
    .divider { height: 2px; background: repeating-linear-gradient(to right, #f97316 0px, #f97316 8px, transparent 8px, transparent 16px); margin: 16px 0; }
    .total-section { background: linear-gradient(135deg, #f5f5f0 0%, #ebebeb 100%); padding: 16px; border-radius: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; }
    .total-amount { font-size: 28px; font-weight: 700; color: #2d5016; }
    .mentions { font-size: 9px; color: #999; line-height: 1.5; padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #e5e7eb; }
    .legal-tva { font-size: 10px; color: #666; font-style: italic; text-align: center; margin-bottom: 16px; padding: 8px; background: #fef3c7; border-radius: 4px; border: 1px solid #fcd34d; }
    .signature-section { margin-top: 20px; }
    .signature-box { border: 2px dashed #d1d5db; border-radius: 8px; padding: 16px; background: #fafafa; }
    .signature-title { font-size: 12px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
    .signature-mention { font-size: 10px; color: #f97316; font-style: italic; margin-bottom: 16px; }
    .signature-line { display: flex; justify-content: space-between; font-size: 11px; color: #666; padding-top: 30px; border-top: 1px solid #e5e7eb; }
    .signature-space { min-width: 150px; }
    .footer-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
    .footer-qr { text-align: center; }
    .footer-qr img { width: 45px; height: 45px; }
    .footer-qr-label { font-size: 7px; color: #2d5016; font-weight: 600; margin-top: 2px; }
    .footer-mentions { font-size: 8px; color: #666; flex: 1; text-align: center; padding: 0 10px; }
    .footer-logo { width: 50px; height: 50px; }
    .footer-logo img { width: 100%; height: 100%; object-fit: contain; }
    .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .bank-details { background: #fef7e0; padding: 12px; border-radius: 8px; border-left: 3px solid #2d5016; }
    .bank-title { font-size: 10px; font-weight: 700; color: #2d5016; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .bank-info { font-size: 10px; color: #1a1a1a; line-height: 1.5; }
    .bank-name { font-size: 9px; color: #666; margin-top: 4px; }
    .payment-conditions { background: #fef7e0; padding: 12px; border-radius: 8px; border-left: 3px solid #f97316; }
    .payment-title { font-size: 10px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .payment-text { font-size: 10px; color: #1a1a1a; line-height: 1.5; }
    .small-text { font-size: 9px; color: #666; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="avatar-container">
          <img src="http://localhost:3000/media/statut/evenement/buffet/buffet1.png" alt="Buffet" class="avatar" />
        </div>
        <div class="company-info">
          <div class="company-name">CHANTHANATHAICOOK</div>
          <div class="company-tagline">Traiteur Thaïlandais</div>
          <div class="company-address">2 impasse de la poste, 37120 Marigny Marmande</div>
          <div class="company-address">SIRET : 510 941 164 RM 37 - EI</div>
        </div>
      </div>
      <div class="header-right">
        <div class="doc-badge">${data.docType}</div>
        <div class="doc-ref">${data.docRef}</div>
        <div class="doc-date">Émis le ${data.docDate}</div>
        <div class="doc-date" style="color: #f97316; font-weight: 600;">Valable 1 mois</div>
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
        <div class="info-title" style="color: #f97316;">${data.event.name}</div>
        <div class="info-details">${data.event.date}<br />${data.event.location}</div>
      </div>
    </div>
    <div class="products-section">
      <div class="products-header">Menu Proposé</div>
      ${productsHTML}
    </div>
    <div class="divider"></div>
    
    <!-- Total Section -->
    <div class="total-section">
      <div class="total-label">Total HT</div>
      <div class="total-amount">${data.total.toFixed(2)} €</div>
    </div>
    
    <!-- Mention légale TVA -->
    <div class="legal-tva">
      TVA non applicable, art. 293 B du CGI
    </div>
    
    <!-- Cards Grid (Bank + Conditions side by side) -->
    <div class="cards-grid">
      <!-- Coordonnées bancaires -->
      <div class="bank-details">
        <div class="bank-title">Coordonnées bancaires</div>
        <div class="bank-info">
          <div><strong>IBAN :</strong> FR76 3000 4031 4400 0103 0315 066</div>
          <div><strong>BIC :</strong> BNPAFRPPXXX</div>
          <div class="bank-name">Hellobank! - MME CHAMPA CHANTHANA</div>
        </div>
      </div>
      
      <!-- Conditions de règlement -->
      <div class="payment-conditions">
        <div class="payment-title">Conditions de règlement</div>
        <div class="payment-text">
          Acompte de 30% à la signature du devis.<br/>
          Solde à régler le jour de la livraison.<br/><br/>
          <span class="small-text">
            Pénalités de retard : 10% l'an.<br/>
            Indemnité forfaitaire (pros) : 40 €.
          </span>
        </div>
      </div>
    </div>
    
    <!-- Zone de signature -->
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-title">Signature du client</div>
        <div class="signature-mention">Mention manuscrite : "Bon pour accord"</div>
        <div class="signature-line">
          <div>Date : ____/____/________</div>
          <div class="signature-space">Signature :</div>
        </div>
      </div>
    </div>
    
    <!-- Footer with QR left, logo right -->
    <div class="footer-section">
      <div class="footer-qr">
        <img src="http://localhost:3000/qrcode_cthaicook.com%20(1).png" alt="QR Code" />
        <div class="footer-qr-label">cthaicook.com</div>
      </div>
      <div class="footer-mentions">
        CHANTHANATHAICOOK - Traiteur Thaïlandais | 2 impasse de la poste, 37120 Marigny Marmande | SIRET : 510 941 164 RM 37 - EI
      </div>
      <div class="footer-logo">
        <img src="http://localhost:3000/logo.svg" alt="Logo" />
      </div>
    </div>
  </div>
</body>
</html>`
}

export default function TestDocumentsPage() {
  const [docType, setDocType] = useState<DocType>("DEVIS")
  const [isGenerating, setIsGenerating] = useState(false)
  const [plats, setPlats] = useState<PlatUI[]>([])
  const [selectedPlats, setSelectedPlats] = useState<SelectedPlat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Client info
  const [clientName, setClientName] = useState("Commune de Marigny Marmande Mairie")
  const [clientAddress, setClientAddress] = useState("26 Gr Grande Rue, 37120 Marigny-Marmande")
  const [clientPhone, setClientPhone] = useState("02 47 58 31 11")

  // Options du devis
  const [showPrices, setShowPrices] = useState(true)
  const [useManualTotal, setUseManualTotal] = useState(false)
  const [manualTotal, setManualTotal] = useState("")

  // Charger les plats réels
  useEffect(() => {
    const loadPlats = async () => {
      try {
        const data = await getPlats()
        setPlats(data)
      } catch (error) {
        console.error("Erreur chargement plats:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les plats.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadPlats()
  }, [])

  // Ajouter un plat
  const handleAddPlat = (platId: string) => {
    const plat = plats.find((p) => p.idplats.toString() === platId)
    if (plat && !selectedPlats.find((sp) => sp.plat.idplats === plat.idplats)) {
      setSelectedPlats([...selectedPlats, { plat, quantite: 1 }])
    }
  }

  // Modifier la quantité
  const handleQuantityChange = (platId: number, quantite: number) => {
    setSelectedPlats(
      selectedPlats.map((sp) =>
        sp.plat.idplats === platId ? { ...sp, quantite: Math.max(1, quantite) } : sp
      )
    )
  }

  // Supprimer un plat
  const handleRemovePlat = (platId: number) => {
    setSelectedPlats(selectedPlats.filter((sp) => sp.plat.idplats !== platId))
  }

  // Calculer le total
  const total = useMemo(() => {
    return selectedPlats.reduce((sum, sp) => {
      const prix = parseFloat(sp.plat.prix || "0")
      return sum + prix * sp.quantite
    }, 0)
  }, [selectedPlats])

  // Générer les données pour le template
  const getData = useCallback((): DevisTemplateData => {
    const finalTotal = useManualTotal && manualTotal ? parseFloat(manualTotal) : total
    return {
      docType: docType === "TICKET" ? "RECU" : docType,
      docRef: `N°${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      docDate: new Date().toLocaleDateString("fr-FR"),
      client: { name: clientName, address: clientAddress, phone: clientPhone },
      event: {
        name: "Repas des Vœux du Maire",
        location: "Salle des fêtes de Marigny Marmande",
        date: "10/01/2026 à 17h",
      },
      products: selectedPlats.map((sp) => ({
        name: sp.plat.plat,
        desc: sp.plat.description || "",
        img: sp.plat.photo_du_plat ? getStorageUrl(sp.plat.photo_du_plat) : undefined,
        qty: sp.quantite,
        price: showPrices ? sp.plat.prix || "0" : undefined,
      })),
      total: finalTotal,
      mentions: "Budget TTC global validé. Acompte de 30% à la commande.",
    }
  }, [
    docType,
    clientName,
    clientAddress,
    clientPhone,
    selectedPlats,
    total,
    showPrices,
    useManualTotal,
    manualTotal,
  ])

  // Prévisualisation HTML live
  const previewHTML = useMemo(() => {
    return generatePreviewHTML(getData())
  }, [getData])

  // Télécharger le PDF
  const generateAndDownloadPDF = async () => {
    if (selectedPlats.length === 0) {
      toast({ variant: "destructive", title: "Erreur", description: "Ajoutez au moins un plat." })
      return
    }
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
      link.download = `${docType}-${getData().docRef}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      toast({ title: "✅ PDF téléchargé" })
    } catch (error) {
      console.error("Erreur:", error)
      toast({ variant: "destructive", title: "❌ Erreur PDF" })
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">🧪 Playground PDF - Données Réelles</h1>
        <p className="text-gray-600">
          Sélectionnez des plats réels avec leurs vraies images et descriptions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Controls */}
        <div className="space-y-4 lg:col-span-1">
          {/* Document Type */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">📋 Type</h2>
            <div className="grid grid-cols-3 gap-2">
              {(["DEVIS", "FACTURE", "TICKET"] as DocType[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => setDocType(type)}
                  variant={docType === type ? "default" : "outline"}
                  className={
                    docType === type
                      ? type === "DEVIS"
                        ? "bg-orange-500"
                        : type === "FACTURE"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      : ""
                  }
                  size="sm"
                >
                  {type === "TICKET" ? "Reçu" : type.charAt(0) + type.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Client */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">👤 Client</h2>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Nom</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Adresse</Label>
                <Input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Téléphone</Label>
                <Input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Plats Selector */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">🍜 Plats</h2>
            <div className="mb-3 flex gap-2">
              <Select onValueChange={handleAddPlat}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Ajouter un plat..." />
                </SelectTrigger>
                <SelectContent>
                  {plats
                    .filter((p) => !selectedPlats.find((sp) => sp.plat.idplats === p.idplats))
                    .map((plat) => (
                      <SelectItem key={plat.idplats} value={plat.idplats.toString()}>
                        <span className="flex items-center gap-2">
                          {plat.plat} - {plat.prix}€
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Plats */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {selectedPlats.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">Aucun plat sélectionné</p>
              ) : (
                selectedPlats.map((sp) => (
                  <div
                    key={sp.plat.idplats}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 p-2"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                      {sp.plat.photo_du_plat ? (
                        <Image
                          src={getStorageUrl(sp.plat.photo_du_plat)}
                          alt={sp.plat.plat}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg">
                          🍜
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{sp.plat.plat}</p>
                      <p className="text-xs text-gray-500">{sp.plat.prix}€</p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={sp.quantite}
                      onChange={(e) =>
                        handleQuantityChange(sp.plat.idplats, parseInt(e.target.value) || 1)
                      }
                      className="h-8 w-14 text-center text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleRemovePlat(sp.plat.idplats)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">⚙️ Options</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPrices}
                  onChange={(e) => setShowPrices(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">Afficher les prix unitaires</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={useManualTotal}
                  onChange={(e) => setUseManualTotal(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">Total HT manuel</span>
              </label>
              {useManualTotal && (
                <div>
                  <Label className="text-xs">Total HT (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={manualTotal}
                    onChange={(e) => setManualTotal(e.target.value)}
                    placeholder="Ex: 850.00"
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-1 text-lg font-semibold">💰 Total</h2>
            <p className="text-3xl font-bold text-green-600">
              {useManualTotal && manualTotal
                ? parseFloat(manualTotal).toFixed(2)
                : total.toFixed(2)}{" "}
              €
            </p>
            {useManualTotal && <p className="text-xs text-orange-500">⚠️ Total manuel</p>}
          </div>

          <Button
            onClick={generateAndDownloadPDF}
            disabled={isGenerating || selectedPlats.length === 0}
            className="w-full"
            size="lg"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isGenerating ? "Génération..." : `⬇️ Télécharger ${docType} (PDF)`}
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

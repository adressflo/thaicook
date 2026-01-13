// Interface spécifique pour le Ticket (indépendante de DevisTemplate)
export interface TicketTemplateData {
  docRef: string
  products: Array<{
    name: string
    desc?: string
    img?: string
    qty?: number
    price?: string
  }>
  total: number
  // Données commande
  orderNumber?: number // idcommande
  pickupDate?: string // Date de retrait formatée: "Samedi 25 Janvier 2025"
  pickupTime?: string // Heure de retrait: "18:30"
  orderDate?: string // Date de commande: "22/01/25 à 00:00"
  encashmentDate?: string // Date/heure génération ticket (= maintenant)
}

export function TicketTemplate(data: TicketTemplateData): string {
  // Helper for price formatting
  const formatPrice = (price: string | number): string => {
    const num = typeof price === "string" ? parseFloat(price) : price
    if (isNaN(num)) return ""
    return num % 1 === 0 ? num.toString() + " €" : num.toFixed(2).replace(".", ",") + " €"
  }

  // Default values if not provided
  const pickupDate =
    data.pickupDate ||
    new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  const pickupTime =
    data.pickupTime ||
    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const orderDate = data.orderDate || ""
  const orderNumber = data.orderNumber || 0
  const encashmentDate =
    data.encashmentDate ||
    new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
      " à " +
      new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  // Generate products HTML
  const productsHTML = data.products
    .map(
      (product) => `
      <div style="display: flex; gap: 12px; padding: 12px; background: white; border: 1px solid #f0f0f0; border-radius: 12px; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: #f5f5f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
          ${
            product.img
              ? `<img src="${product.img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='🍜'" />`
              : `<span style="font-size: 24px;">🍜</span>`
          }
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 700; color: #2d5016; margin-bottom: 2px;">${product.name}</div>
          ${product.desc ? `<div style="font-size: 11px; color: #666; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.desc}</div>` : ""}
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #ea580c; text-align: right; min-width: 70px;">${product.price ? formatPrice(product.price) : ""}</div>
      </div>
    `
    )
    .join("")

  return `
    <div style="max-width: 800px; margin: 0 auto; background: #fffbeb; border: 2px solid #fde68a; border-radius: 24px; overflow: hidden; font-family: 'Geist', sans-serif;">
        
        <!-- HEADER: Image | Date Retrait | Badge Encaissement + N° Commande -->
        <div style="padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #fde68a;">
            
            <!-- Left: Image -->
            <div style="width: 100px; height: 70px; background: #fff; border-radius: 12px; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <img src="http://localhost:3000/media/statut/compta/papier.svg" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <!-- Center: Date de Retrait (comme OrderHistoryCard) -->
            <div style="flex: 1; text-align: center; padding: 0 20px;">
                <!-- Ligne 1: Jour + Date complète (text-amber-800) - UNE LIGNE -->
                <div style="font-size: 20px; font-weight: 900; color: #92400e; text-transform: capitalize; line-height: 1.2; white-space: nowrap;">
                    ${pickupDate}
                </div>
                <!-- Ligne 2: Heure (text-amber-800) -->
                <div style="font-size: 18px; font-weight: 800; color: #92400e; margin-top: 4px;">
                    ${pickupTime}
                </div>

                <!-- Ligne 3: Date de commande (text-amber-600) -->
                ${orderDate ? `<div style="font-size: 11px; color: #d97706; margin-top: 8px; font-weight: 500;">(Commandé le ${orderDate})</div>` : ""}
            </div>


            <!-- Right: Encaissement + N° Commande -->
            <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <!-- Encaissement Date/Time (style badge comme "En attente de confirmation") -->
                <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.8); border: 1px solid #fde68a; border-radius: 9999px; padding: 6px 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style="font-size: 12px; font-weight: 600; color: #92400e;">${encashmentDate}</span>
                </div>

                
                <!-- N° Commande (Badge circulaire vert) -->
                ${
                  orderNumber > 0
                    ? `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 11px; font-weight: 600; color: #666;">N°</span>
                    <div style="background: #2d5016; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        ${orderNumber}
                    </div>
                </div>
                `
                    : ""
                }
            </div>
        </div>

        <!-- PRODUCT LIST -->
        <div style="padding: 24px 32px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${productsHTML}
            </div>

            <!-- Total -->
            <div style="margin-top: 24px; padding-top: 20px; border-top: 2px dashed #fde68a; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; font-weight: 800; color: #92400e;">Total de la commande</span>
                <span style="font-size: 24px; font-weight: 900; color: #ea580c;">${formatPrice(data.total)}</span>
            </div>
            
            <!-- TVA -->
            <div style="margin-top: 12px; text-align: right; font-size: 10px; color: #9ca3af; font-style: italic;">
                TVA non applicable, art. 293 B du CGI
            </div>
        </div>

        <!-- FOOTER: QR | Company Info | Logo -->
        <div style="background: #fffbeb; border-top: 2px dashed #fde68a; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;">
            
            <!-- Left: QR -->
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                <img src="http://localhost:3000/qrcode_cthaicook.com%20(1).png" style="width: 40px; height: 40px;" />
                <span style="font-size: 10px; color: #2d5016; font-weight: bold;">cthaicook.com</span>
            </div>
            
            <!-- Center: Company Info -->
            <div style="text-align: center; flex: 1; padding: 0 16px;">
                <div style="font-weight: 700; font-size: 12px; color: #2d5016;">ChanthanaThaiCook</div>
                <div style="font-size: 10px; color: #666; line-height: 1.3;">2 Impasse de la Poste, 37120 Marigny Marmande</div>
                <div style="font-size: 10px; color: #666;">07 49 28 37 07 | SIRET : 510 941 164 RM 37 - EI</div>
            </div>
            
            <!-- Right: Logo -->
            <div style="flex-shrink: 0;">
                <img src="http://localhost:3000/logo.svg" style="width: 40px; height: 40px;" />
            </div>
        </div>
    </div>
  `
}

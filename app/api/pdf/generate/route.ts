import type { DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { TicketTemplate, type TicketTemplateData } from "@/components/pdf/templates/TicketTemplate"
import { NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function generateDocHTML(data: DevisTemplateData): string {
  // For TICKET, use the dedicated TicketTemplate
  if (data.docType === "TICKET") {
    // Map DevisTemplateData to TicketTemplateData
    const ticketData: TicketTemplateData = {
      docRef: data.docRef,
      products: data.products,
      total: data.total,
      // Ces champs viendront de la commande réelle, pour l'instant on utilise des valeurs par défaut
      orderNumber: (data as unknown as { orderNumber?: number }).orderNumber,
      pickupDate: (data as unknown as { pickupDate?: string }).pickupDate,
      pickupTime: (data as unknown as { pickupTime?: string }).pickupTime,
      orderDate: (data as unknown as { orderDate?: string }).orderDate,
      encashmentDate: (data as unknown as { encashmentDate?: string }).encashmentDate,
      // Mapping Client Info
      clientName: data.client.name,
      clientPhone: data.client.phone,
      clientAddress: data.client.address,
    }

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    @font-face { font-family: 'Geist'; src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2'); }
    @font-face { font-family: 'Geist'; src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2') format('woff2'); font-weight: 700; }
    @font-face { font-family: 'Geist'; src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Black.woff2') format('woff2'); font-weight: 900; }
    body { font-family: 'Geist', sans-serif; padding: 40px; background: white; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body>
  ${TicketTemplate(ticketData)}
</body>
</html>`
  }

  const isFacture = data.docType === "FACTURE"

  const productsHTML = data.products
    .map(
      (product) => `
    <div class="product-item">
      <div class="product-icon">
        ${
          product.img
            ? `<img src="${product.img}" alt="${product.name}" />`
            : `<svg class="product-icon-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>`
        }
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
      </div>
      ${
        product.price
          ? `<div class="product-price">${parseFloat(product.price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</div>`
          : ""
      }
    </div>
  `
    )
    .join("")

  const conditionsHTML = isFacture
    ? `
      <div class="info-box-card orange-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-orange">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div class="info-box-title">Conditions de règlement</div>
        </div>
        <div class="info-box-content">
          Escompte pour paiement anticipé : Néant.<br />
          Date limite de paiement : À réception du document.<br /><br />
          <span class="info-box-sub">
            Pénalités de retard : 10% l'an.<br />
            Indemnité forfaitaire (pros) : 40 €.
          </span>
        </div>
      </div>`
    : `
      <div class="info-box-card orange-theme">
        <div class="info-box-header">
           <div class="icon-circle bg-orange">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
           </div>
           <div class="info-box-title">Conditions de règlement</div>
        </div>
        <div class="info-box-content">
          Acompte de 30% à la signature du devis.<br />
          Solde à régler le jour de la livraison.<br /><br />
          <span class="info-box-sub">
            Pénalités de retard : 10% l'an.<br />
            Indemnité forfaitaire (pros) : 40 €.
          </span>
        </div>
      </div>`

  const signatureHTML = !isFacture
    ? `
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-title">Signature</div>
        <div class="signature-mention">Mention manuscrite : "Bon pour accord"</div>
        <div class="signature-line">
          <div>Date : ____/____/________</div>
          <div class="signature-space">Signature :</div>
        </div>
      </div>
    </div>`
    : ""

  const cleanDocRef = data.docRef
    .replace(/^N°/, "")
    .replace("DEVIS N°", "")
    .replace("Devis N°", "")
    .replace("FACTURE N°", "")

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.docType} - ${data.docRef}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: white;
      color: #1a1a1a;
      padding: 40px;
      -webkit-font-smoothing: antialiased;
    }
    
    .page { max-width: 210mm; margin: 0 auto; }
    
    .icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px; height: 24px;
      border-radius: 50%;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .icon-circle svg {
      width: 14px; height: 14px;
      fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    }
    .bg-green { background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%); }
    .bg-orange { background: linear-gradient(135deg, #ff7b54 0%, #ffb386 100%); }
    
    .header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; padding-bottom: 12px;
    }
    
    .header-left { display: flex; gap: 20px; align-items: flex-start; }
    
    .logo-column { display: flex; flex-direction: column; gap: 6px; align-items: center; }
    
    .avatar-container {
      width: 160px; height: 100px;
      border-radius: 12px;
      overflow: hidden; flex-shrink: 0;
      display: block;
    }
    .avatar { width: 100%; height: 100%; object-fit: cover; }
    
    .company-siret { font-size: 10px; color: #9ca3af; margin-top: 2px; }
    
    .company-info { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .company-name {
      font-size: 24px; font-weight: 800; color: #2d5016;
      letter-spacing: -1px; margin-bottom: 2px; line-height: 1;
    }
    .company-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #4b5563; line-height: 1.4; }
    .company-phone { font-weight: 600; color: #1a1a1a; }
    
    .header-right { }
    .header-glass-card {
      background: white;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      padding: 12px 24px;
      text-align: center;
      min-width: 140px;
    }
    
    .doc-main-title { display: flex; flex-direction: column; align-items: center; line-height: 1.2; margin-bottom: 6px; }
    .doc-type { font-size: 20px; font-weight: 800; color: #2d5016; text-transform: uppercase; letter-spacing: 0.5px; }
    .doc-ref { font-size: 14px; font-weight: 700; color: #ea580c; }
    .doc-meta { font-size: 11px; color: #6b7280; font-weight: 500; }
    .doc-validity { font-size: 10px; color: #ff7b54; font-style: italic; margin-top: 2px; }
    
    .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    
    .info-box-card {
      background: #fffbf7; border-radius: 16px; padding: 16px; height: 100%;
      border: 2px solid transparent;
    }
    .info-box-card.green-theme { border-color: #dcfce7; }
    .info-box-card.orange-theme { border-color: #ffedd5; }
    
    .info-box-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 10px; padding-bottom: 8px;
      border-bottom: 1px dashed;
    }
    .green-theme .info-box-header { border-bottom-color: #dcfce7; color: #2d5016; }
    .orange-theme .info-box-header { border-bottom-color: #ffedd5; color: #ff7b54; }
    
    .info-box-title { font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
    .info-box-content { font-size: 10px; color: #1a1a1a; line-height: 1.6; }
    .info-box-sub { color: #666; font-size: 10px; margin-top: 4px; display: block; }

    .product-card-container {
      background-color: #fffbeb;
      border: 2px solid #fde68a;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 24px;
    }
    
    .product-card-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px; padding: 0 4px 12px 4px;
      border-bottom: 2px dashed #fde68a;
    }
    .product-card-title {
      font-size: 24px; font-weight: 900; color: #92400e;
      letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;
    }
    .product-card-info {
      font-size: 16px; color: #92400e; font-weight: 800;
      background: rgba(255, 255, 255, 0.8);
      padding: 6px 16px; border-radius: 9999px;
      border: 1px solid #fed7aa;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      display: flex; align-items: center; gap: 8px;
    }
    
    .product-list { display: flex; flex-direction: column; gap: 12px; }
    
    .product-item {
      display: flex; gap: 12px; padding: 12px;
      background: white; border: 1px solid #f0f0f0; border-radius: 12px;
      align-items: center;
    }
    .product-item:not(:last-child), .product-item:last-child {
       border-bottom: 1px solid #f0f0f0; border-left: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0;
    }
    
    .product-icon {
      width: 48px; height: 48px; border-radius: 10px; background: #f5f5f0;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
    }
    .product-icon img { width: 100%; height: 100%; object-fit: cover; }
    .product-icon-placeholder { width: 24px; height: 24px; color: #999; }
    
    .product-details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .product-name { font-size: 14px; font-weight: 600; color: #2d5016; margin-bottom: 2px; }
    .product-desc { font-size: 12px; color: #666; line-height: 1.4; }
    .product-price { font-size: 14px; font-weight: 700; color: #ea580c; text-align: right; min-width: 80px; }
    
    .product-card-footer {
      margin-top: 16px; padding-top: 16px; padding-bottom: 16px;
      border-top: 2px dashed #fde68a; border-bottom: 2px dashed #fde68a;
      display: flex; justify-content: space-between; align-items: center;
    }
    .total-label { font-size: 18px; font-weight: 800; color: #92400e; opacity: 0.9; }
    .total-amount { font-size: 24px; font-weight: 900; color: #ea580c; }
    
    /* Dynamic footer styles handled by JS template literals above */
    
    .legal-tva {
      font-size: 10px; color: #9ca3af; font-style: italic; text-align: right;
      margin-top: -12px; padding-right: 16px; padding-bottom: 8px;
    }
    
    .mentions {
      font-size: 11px; color: #999; line-height: 1.6;
      padding: 16px; background: #fafafa; border-radius: 8px; border: 1px solid #e5e7eb;
      margin-top: 20px;
    }
    
    .signature-section { margin-top: 24px; }
    .signature-box {
      border: 2px dashed #fde68a; border-radius: 8px; padding: 16px; background: #fffbeb;
    }
    .signature-title { font-size: 12px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
    .signature-mention { font-size: 10px; color: #ff7b54; font-style: italic; margin-bottom: 24px; }
    .signature-line {
      display: flex; justify-content: space-between; font-size: 11px; color: #92400e;
      padding-top: 24px; border-top: 2px dashed #fde68a;
    }
    .signature-space { min-width: 150px; }
    
    .footer-section {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb;
    }
    .footer-qr { text-align: center; }
    .footer-qr img { width: 45px; height: 45px; }
    .footer-qr-label { font-size: 7px; color: #16a34a; font-weight: 600; margin-top: 2px; }
    .footer-mentions {
      font-size: 8px; color: #666; flex: 1; text-align: center; padding: 0 16px;
    }
    .footer-logo { width: 50px; height: 50px; }
    .footer-logo img { width: 100%; height: 100%; object-fit: contain; }
    
    @media print {
      body { padding: 0; }
      @page { margin: 20mm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="logo-column">
          <div class="avatar-container">
            <img src="http://localhost:3000/media/statut/evenement/buffet/buffet1.png" alt="Logo" class="avatar" />
          </div>
          <div class="company-siret">SIRET : 510 941 164 RM 37 - EI</div>
        </div>
        <div class="company-info">
          <div class="company-name">ChanthanaThaiCook</div>
          
          <div class="company-row">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div style="font-weight: 500">
              2 Impasse de la Poste<br />37120 Marigny Marmande
            </div>
          </div>
          
          <div class="company-row">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span class="company-phone">07 49 28 37 07</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="header-glass-card">
          <div class="doc-main-title">
            <span class="doc-type">${data.docType}</span>
            <span class="doc-ref">N° ${cleanDocRef}</span>
          </div>
          <div class="doc-meta">Émis le <span style="font-weight:bold; color:#000000">${data.docDate}</span></div>
          ${!isFacture ? `<div class="doc-validity">Valable 1 mois</div>` : ""}
        </div>
      </div>
    </div>
    
    
    
    <div class="cards-grid">
      <div class="info-box-card green-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-green">
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="info-box-title">${data.client.name}</div>
        </div>
        <div class="info-box-content">
          ${data.client.address}<br />${data.client.phone || ""}
        </div>
      </div>
      <div class="info-box-card orange-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-orange">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div class="info-box-title">${data.event.name}</div>
        </div>
        <div class="info-box-content">
          ${data.event.date}<br />${data.event.location}
        </div>
      </div>
    </div>
    
    <div class="product-card-container">
      <div class="product-card-header">
        <div class="product-card-title">
           <div class="icon-circle bg-green" style="margin-right: 6px; width: 28px; height: 28px;">
             <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
               <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
               <path d="M7 2v20" />
               <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
             </svg>
           </div>
           ${isFacture ? "Prestations" : "Menu Proposé"}
        </div>
        ${
          data.nombrePersonnes
            ? `
        <div class="product-card-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          ${data.nombrePersonnes} personnes
        </div>`
            : ""
        }
      </div>
      
      <div class="product-list">
        ${productsHTML}
      </div>
      
      <div class="product-card-footer" style="${data.acomptePaid && data.acomptePaid > 0 && isFacture ? "display:block;" : ""}">
        ${
          data.acomptePaid && data.acomptePaid > 0 && isFacture
            ? `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="total-label" style="font-size:16px;">Total HT</span>
            <span class="total-amount" style="font-size:18px;">${data.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#666;">
            <span class="total-label" style="font-size:14px; font-weight:600;">Acompte déjà versé</span>
            <span class="total-amount" style="font-size:14px; color:#2d5016;">- ${data.acomptePaid.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px dashed #fde68a; padding-top:8px;">
            <span class="total-label">Net à payer</span>
            <span class="total-amount">${(data.total - data.acomptePaid).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
          </div>
          `
            : `
          <div class="total-label">Total HT</div>
          <div class="total-amount">${data.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</div>
          `
        }
      </div>
    </div>
    
    <div class="legal-tva">TVA non applicable, art. 293 B du CGI</div>
    
    
    <div class="cards-grid">
      <div class="info-box-card green-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-green">
            <svg viewBox="0 0 24 24">
              <line x1="3" y1="21" x2="21" y2="21" />
              <line x1="5" y1="21" x2="5" y2="10" />
              <line x1="19" y1="21" x2="19" y2="10" />
              <path d="M5 10a4 4 0 1 1 14 0" />
              <path d="M12 7V3" />
              <path d="M10 2L14 2" />
            </svg>
          </div>
          <div class="info-box-title">Coordonnées bancaires</div>
        </div>
        <div class="info-box-content">
          <div><strong>IBAN :</strong> FR76 3000 4031 4400 0103 0315 066</div>
          <div><strong>BIC :</strong> BNPAFRPPXXX</div>
          <div class="info-box-sub">Hellobank! - MME CHAMPA CHANTHANA</div>
        </div>
      </div>
      
      ${conditionsHTML}
    </div>
    
    
    ${signatureHTML}
    
    ${data.mentions ? `<div class="mentions">${data.mentions}</div>` : ""}
    
    
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

export async function POST(request: NextRequest) {
  let browser

  try {
    const data: DevisTemplateData = await request.json()
    const html = generateDocHTML(data)

    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: "networkidle" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    })

    await browser.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${data.docRef || "document"}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    if (browser) await browser.close()
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

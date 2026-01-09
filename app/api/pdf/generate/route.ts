import type { DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Generate HTML string directly (no React SSR needed)
function generateDevisHTML(data: DevisTemplateData): string {
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
      </div>
    `
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.docType} - ${data.docRef}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: white;
      color: #1a1a1a;
      padding: 40px;
    }
    
    .page { max-width: 210mm; margin: 0 auto; }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f5f5f0;
    }
    
    .header-left { display: flex; gap: 16px; align-items: center; }
    
    .avatar-container {
      width: 80px; height: 80px;
      border-radius: 12px;
      background: #f5f5f0;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .avatar { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
    .company-info { display: flex; flex-direction: column; gap: 2px; }
    .company-name { font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: -0.5px; }
    .company-tagline { font-size: 13px; color: #666; font-weight: 500; }
    .company-address { font-size: 12px; color: #999; margin-top: 4px; }
    
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .doc-badge {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .doc-ref, .doc-date { font-size: 13px; color: #666; font-weight: 500; }
    
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
    .info-card {
      border-left: 4px solid #16a34a;
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
    }
    .info-card.event { border-left-color: #f97316; }
    .info-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; font-weight: 600; margin-bottom: 8px; }
    .info-title { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
    .info-details { font-size: 13px; color: #666; line-height: 1.6; }
    
    .products-section { margin-bottom: 24px; }
    .products-header {
      background: #16a34a;
      color: white;
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .product-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      background: white;
      border-left: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
    }
    .product-item:last-child { border-bottom: none; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; }
    
    .product-icon {
      width: 48px; height: 48px;
      border-radius: 8px;
      background: #f5f5f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .product-icon img { width: 100%; height: 100%; object-fit: cover; }
    .product-icon-placeholder { width: 24px; height: 24px; color: #999; }
    .product-details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .product-name { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
    .product-desc { font-size: 12px; color: #666; }
    
    .divider {
      height: 2px;
      background: repeating-linear-gradient(to right, #f97316 0px, #f97316 10px, transparent 10px, transparent 20px);
      margin: 24px 0;
    }
    
    .total-section {
      background: linear-gradient(135deg, #f5f5f0 0%, #ebebeb 100%);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .total-label { font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .total-amount { font-size: 36px; font-weight: 700; color: #16a34a; letter-spacing: -1px; }
    
    .mentions {
      font-size: 11px;
      color: #999;
      line-height: 1.6;
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    
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
        <div class="info-details">
          ${data.client.address}
          ${data.client.phone ? `<br />${data.client.phone}` : ""}
        </div>
      </div>
      <div class="info-card event">
        <div class="info-label">Événement</div>
        <div class="info-title">${data.event.name}</div>
        <div class="info-details">
          ${data.event.date}<br />
          ${data.event.location}
        </div>
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

export async function POST(request: NextRequest) {
  let browser

  try {
    const data: DevisTemplateData = await request.json()
    const html = generateDevisHTML(data)

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

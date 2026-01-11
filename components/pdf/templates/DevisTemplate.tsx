/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-img-element */
// This component renders raw HTML for Playwright PDF generation, not a Next.js page

export interface DevisTemplateData {
  docType: "DEVIS" | "FACTURE" | "RECU"
  docRef: string
  docDate: string
  client: {
    name: string
    address: string
    phone?: string
  }
  event: {
    name: string
    date: string
    location: string
  }
  products: Array<{
    name: string
    desc: string
    img?: string
    qty?: number
    price?: string
  }>
  total: number
  mentions?: string
  nombrePersonnes?: string
}

export interface DevisTemplateProps {
  data: DevisTemplateData
}

export function DevisTemplate({ data }: DevisTemplateProps) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {data.docType} - {data.docRef}
        </title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Using Geist font via CDN to match application theme */
          @font-face {
            font-family: 'Geist';
            src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'Geist';
            src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Medium.woff2') format('woff2');
            font-weight: 500;
            font-style: normal;
          }
          @font-face {
            font-family: 'Geist';
            src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-SemiBold.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
          }
          @font-face {
            font-family: 'Geist';
            src: url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: white;
            color: #1a1a1a;
            padding: 40px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-weight: 500;
            text-rendering: optimizeLegibility;
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: none;
          }
          
          .header-left {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          
          .avatar-container {
            width: 80px;
            height: 80px;
            border-radius: 12px;
            background: #f5f5f0;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          
          .company-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 4px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: 800;
            color: #2d5016;
            letter-spacing: -1px;
            margin-bottom: 4px;
            line-height: 1;
          }
          
          .company-row {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            font-size: 11px;
            color: #4b5563;
            line-height: 1.4;
          }
          
          .company-icon {
            width: 12px;
            height: 12px;
            color: #ff7b54;
            flex-shrink: 0;
            margin-top: 1px;
          }
          
          .company-phone {
            font-weight: 600;
            color: #1a1a1a;
          }

          .company-siret {
            font-size: 10px;
            color: #9ca3af;
            margin-top: 2px;
          }
          
          .doc-info-container {
            text-align: right;
          }
          
          .doc-main-title {
            font-size: 28px;
            font-weight: 800;
            color: #2d5016;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin-bottom: 4px;
            line-height: 1;
          }
          
          .doc-meta {
            font-size: 11px;
            color: #4b5563;
            font-weight: 600;
          }
          
          .doc-validity {
            font-size: 10px;
            color: #ff7b54;
            font-style: italic;
            margin-top: 2px;
          }
          
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .info-card {
            border-left: 3px solid #2d5016;
            background: #fffcf5;
            padding: 12px;
            border-radius: 4px;
          }
          
          .info-card.event {
             border-left-color: #ff7b54;
             background: #fff8f5;
          }

          .info-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;
          }
          
          .info-icon {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
          }
          
          .info-icon.client { color: #2d5016; }
          .info-icon.event { color: #ff7b54; }
          
          .info-title {
            font-size: 12px;
            font-weight: 600;
            color: #2d5016;
            line-height: 1.3;
            text-transform: none; /* Removed uppercase */
            letter-spacing: 0;
          }
          
          .info-details {
            line-height: 1.6;
          }
          
          .products-section {
            margin-bottom: 24px;
          }
          
          .products-header {
            background: #2d5016;
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
          }
          
          .product-item:last-child {
            border-bottom: none;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e5e7eb;
          }
          
          .product-item:not(:last-child) {
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          }
          
          .product-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background: #f5f5f0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }
          
          .product-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .product-icon-placeholder {
            width: 24px;
            height: 24px;
            color: #999;
          }
          
          .product-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .product-name {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 2px;
          }
          
          .product-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }

          .product-price {
            font-size: 14px;
            font-weight: 700;
            color: #ff7b54;
            text-align: right;
            min-width: 80px;
          }
          
          .divider {
            height: 2px;
            background: repeating-linear-gradient(
              to right,
              #f97316 0px,
              #f97316 10px,
              transparent 10px,
              transparent 20px
            );
            margin: 24px 0;
          }
          
          .total-section {
            background: linear-gradient(135deg, #f5f5f0 0%, #ebebeb 100%);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          
          .total-label {
            font-size: 13px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          
          .total-amount {
            font-size: 36px;
            font-weight: 700;
            color: #2d5016;
            letter-spacing: -1px;
          }
          
          .mentions {
            font-size: 11px;
            color: #999;
            line-height: 1.6;
            padding: 16px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }

          .legal-tva {
            font-size: 10px;
            color: #666;
            font-style: italic;
            text-align: center;
            margin-bottom: 20px;
            padding: 8px;
            background: #fef3c7;
            border-radius: 4px;
            border: 1px solid #fcd34d;
          }

          .cards-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }

          .bank-details {
            background: #fef7e0;
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid #2d5016;
          }

          .bank-title {
            font-size: 10px;
            font-weight: 700;
            color: #2d5016;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }

          .bank-info {
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.5;
          }

          .bank-name {
            font-size: 10px;
            color: #666;
            margin-top: 4px;
          }

          .payment-conditions {
            background: #fef7e0;
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid #ff7b54;
          }

          .payment-title {
            font-size: 10px;
            font-weight: 700;
            color: #ff7b54;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }

          .payment-text {
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.5;
          }

          .small-text {
            font-size: 10px;
            color: #666;
          }

          .signature-section {
            margin-top: 24px;
          }

          .signature-box {
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            background: #fafafa;
          }

          .signature-title {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          .signature-mention {
            font-size: 10px;
            color: #ff7b54;
            font-style: italic;
            margin-bottom: 24px;
          }

          .signature-line {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #666;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
          }

          .signature-space {
            min-width: 150px;
          }

          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }

          .footer-qr {
            text-align: center;
          }

          .footer-qr img {
            width: 45px;
            height: 45px;
          }

          .footer-qr-label {
            font-size: 7px;
            color: #16a34a;
            font-weight: 600;
            margin-top: 2px;
          }

          .footer-mentions {
            font-size: 8px;
            color: #666;
            flex: 1;
            text-align: center;
            padding: 0 16px;
          }

          .footer-logo {
            width: 50px;
            height: 50px;
          }

          .footer-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          @media print {
            body {
              padding: 0;
            }
            @page {
              margin: 20mm;
              size: A4;
            }
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="page">
          {/* HEADER */}
          <div className="header">
            <div className="header-left">
              <div className="avatar-container">
                <img
                  src="http://localhost:3000/media/statut/evenement/buffet/buffet1.png"
                  alt="Logo"
                  className="avatar"
                />
              </div>
              <div className="company-info">
                <div className="company-name">ChanthanaThaiCook</div>

                <div className="company-row">
                  {/* Map Pin Icon */}
                  <svg
                    className="company-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div style={{ fontWeight: 500 }}>
                    2 Impasse de la Poste
                    <br />
                    37120 Marigny Marmande
                  </div>
                </div>

                <div className="company-row">
                  {/* Phone Icon */}
                  <svg
                    className="company-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="company-phone">07 49 28 37 07</span>
                </div>

                <div className="company-siret">SIRET : 510 941 164 RM 37 - EI</div>
              </div>
            </div>
            <div className="header-right">
              <div className="doc-info-container">
                <div className="doc-main-title">
                  {data.docType} {data.docRef}
                </div>
                <div className="doc-meta">Émis le {data.docDate}</div>
                <div className="doc-validity">Valable 1 mois</div>
              </div>
            </div>
          </div>

          {/* CLIENT & EVENT INFO */}
          <div className="info-section">
            <div className="info-card">
              <div className="info-header">
                {/* User Icon */}
                <svg
                  className="info-icon client"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div className="info-title">{data.client.name}</div>
              </div>
              <div className="info-details">
                {data.client.address}
                <br />
                {data.client.phone}
              </div>
            </div>
            <div className="info-card event">
              <div className="info-header">
                {/* Calendar Icon */}
                <svg
                  className="info-icon event"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="info-title" style={{ color: "#ff7b54" }}>
                  {data.event.name}
                </div>
              </div>
              <div className="info-details">
                {data.event.date}
                <br />
                {data.event.location}
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="products-section">
            <div className="products-header">Menu Proposé</div>
            {data.products.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-icon">
                  {product.img ? (
                    <img src={product.img} alt={product.name} />
                  ) : (
                    <svg
                      className="product-icon-placeholder"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-desc">{product.desc}</div>
                </div>
                {product.price && (
                  <div className="product-price">
                    {parseFloat(product.price).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="divider"></div>

          {/* TOTAL */}
          <div className="total-section">
            <div className="total-label">Total</div>
            <div className="total-amount">{data.total.toFixed(2)} €</div>
          </div>

          {/* LEGAL TVA */}
          <div className="legal-tva">TVA non applicable, art. 293 B du CGI</div>

          {/* BANK & CONDITIONS */}
          <div className="cards-grid">
            {/* Coordonnées bancaires */}
            <div className="bank-details">
              <div className="bank-title">Coordonnées bancaires</div>
              <div className="bank-info">
                <div>
                  <strong>IBAN :</strong> FR76 3000 4031 4400 0103 0315 066
                </div>
                <div>
                  <strong>BIC :</strong> BNPAFRPPXXX
                </div>
                <div className="bank-name">Hellobank! - MME CHAMPA CHANTHANA</div>
              </div>
            </div>

            {/* Conditions de règlement */}
            <div className="payment-conditions">
              <div className="payment-title">Conditions de règlement</div>
              <div className="payment-text">
                Acompte de 30% à la signature du devis.
                <br />
                Solde à régler le jour de la livraison.
                <br />
                <br />
                <span className="small-text">
                  Pénalités de retard : 10% l'an.
                  <br />
                  Indemnité forfaitaire (pros) : 40 €.
                </span>
              </div>
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-title">Signature</div>
              <div className="signature-mention">Mention manuscrite : "Bon pour accord"</div>
              <div className="signature-line">
                <div>Date : ____/____/________</div>
                <div className="signature-space">Signature :</div>
              </div>
            </div>
          </div>

          {/* MENTIONS */}
          {data.mentions && (
            <div className="mentions" style={{ marginTop: "20px" }}>
              {data.mentions}
            </div>
          )}

          {/* FOOTER */}
          <div className="footer-section">
            <div className="footer-qr">
              <img src="http://localhost:3000/qrcode_cthaicook.com%20(1).png" alt="QR Code" />
              <div className="footer-qr-label">cthaicook.com</div>
            </div>
            <div className="footer-mentions">
              CHANTHANATHAICOOK - Traiteur Thaïlandais | 2 impasse de la poste, 37120 Marigny
              Marmande | SIRET : 510 941 164 RM 37 - EI
            </div>
            <div className="footer-logo">
              <img src="http://localhost:3000/logo.svg" alt="Logo" />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

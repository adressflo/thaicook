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
            border-radius: 12px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-weight: 500;
            text-rendering: optimizeLegibility;
          }
          
          .icon-circle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
          }
          .icon-circle svg {
            width: 14px;
            height: 14px;
            fill: none;
            stroke: white;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .bg-green {
            background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%);
          }
          .bg-orange {
            background: linear-gradient(135deg, #ff7b54 0%, #ffb386 100%);
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: none;
          }
          
          .header-left {
            display: flex;
            gap: 20px;
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
            gap: 6px;
            margin-top: 4px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: 800;
            color: #2d5016;
            letter-spacing: -1px;
            margin-bottom: 6px;
            line-height: 1;
          }
          
          .company-row {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #4b5563;
            line-height: 1.4;
          }
          
          .company-icon {
            display: none;
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
            border-radius: 12px;
          }
          
          .info-card.event {
             border-left-color: #ff7b54;
             background: #fff8f5;
          }

          .info-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }
          
          .info-icon {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
            display: none;
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
          
          /* Card Style Product Section */
          .product-card-container {
            background-color: #fffbeb; /* Amber 50 */
            border: 2px solid #fde68a; /* Amber 200 */
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 24px;
          }

          .product-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 0 4px;
          }

          .product-card-title {
            font-size: 24px; /* Matches text-2xl/text-3xl */
            font-weight: 900;
            color: #92400e;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .product-card-info {
            font-size: 16px; /* Matches text-base */
            color: #92400e; /* text-amber-800 */
            font-weight: 800;
            background: rgba(255, 255, 255, 0.8);
            padding: 6px 16px;
            border-radius: 9999px;
            border: 1px solid #fed7aa; /* ring-orange-200 */
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }

          .product-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .product-item {
            display: flex;
            gap: 12px;
            padding: 12px;
            background: white;
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            align-items: center;
          }
          
          .product-item:not(:last-child),
          .product-item:last-child {
             border-bottom: 1px solid #f0f0f0;
             border-left: 1px solid #f0f0f0;
             border-right: 1px solid #f0f0f0;
          }
          
          .product-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
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
            color: #2d5016; /* Thai Green */
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
            color: #ea580c; /* Orange-600 */
            text-align: right;
            min-width: 80px;
          }
          
          .product-card-footer {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px dashed #fde68a; /* Amber 200 */
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .total-label {
            font-size: 18px; /* text-lg */
            font-weight: 800; /* font-extrabold */
            color: #92400e; /* text-amber-800 */
            opacity: 0.9;
            text-transform: none;
          }
          
          .total-amount {
            font-size: 24px; /* text-2xl */
            font-weight: 900; /* font-black */
            color: #ea580c; /* text-orange-600 */
            letter-spacing: 0;
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
          
          .info-box-card {
            background: #fffbf7;
            border-radius: 16px;
            padding: 16px;
            height: 100%;
            border: 2px solid transparent;
          }
          
          .info-box-card.green-theme {
            border-color: #dcfce7; /* Light Green Border */
          }
          
          .info-box-card.orange-theme {
            border-color: #ffedd5; /* Light Orange Border */
          }
          
          .info-box-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed;
          }
          
          .green-theme .info-box-header {
            border-bottom-color: #dcfce7;
            color: #2d5016;
          }
          
          .orange-theme .info-box-header {
            border-bottom-color: #ffedd5;
            color: #ff7b54;
          }
          
          .info-box-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-box-content {
            font-size: 10px;
            color: #1a1a1a;
            line-height: 1.6;
          }
          
          .info-box-sub {
            color: #666;
            font-size: 10px;
            margin-top: 4px;
            display: block;
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
                  <div className="icon-circle bg-green">
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    2 Impasse de la Poste
                    <br />
                    37120 Marigny Marmande
                  </div>
                </div>

                <div className="company-row">
                  {/* Phone Icon */}
                  <div className="icon-circle bg-orange">
                    <svg viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
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
                <div className="icon-circle bg-green">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
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
                <div className="icon-circle bg-orange">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
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

          {/* PRODUCT CARD CONTAINER */}
          <div className="product-card-container">
            <div
              className="product-card-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "0 4px 12px 4px",
                borderBottom: "2px dashed #fde68a",
              }}
            >
              <div className="product-card-title">
                <div
                  className="icon-circle bg-green"
                  style={{ marginRight: "6px", width: "28px", height: "28px" }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                  </svg>
                </div>
                Menu Proposé
              </div>
              {data.nombrePersonnes && (
                <div
                  className="product-card-info"
                  style={{
                    fontSize: "16px" /* Matches text-base */,
                    color: "#92400e" /* Amber 900 */,
                    fontWeight: "800",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    border: "1px solid #fed7aa" /* ring-orange-200 */,
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {data.nombrePersonnes} personnes
                </div>
              )}
            </div>

            <div className="product-list">
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

            <div
              className="product-card-footer"
              style={{ borderTop: "2px dashed #fde68a", paddingTop: "12px", marginTop: "12px" }}
            >
              <div className="total-label">Total HT</div>
              <div
                className="total-amount"
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#ea580c",
                }}
              >
                {data.total.toFixed(2)} €
              </div>
            </div>
          </div>

          <div
            className="legal-tva"
            style={{
              fontSize: "10px",
              color: "#9ca3af",
              fontStyle: "italic",
              textAlign: "right",
              marginTop: "-12px",
              paddingRight: "16px",
              paddingBottom: "8px",
              border: "none",
              position: "relative",
            }}
          >
            TVA non applicable, art. 293 B du CGI
          </div>

          {/* LEGAL TVA */}

          {/* BANK & CONDITIONS */}
          <div className="cards-grid">
            {/* Coordonnées bancaires */}
            <div className="info-box-card green-theme">
              <div className="info-box-header">
                <div className="icon-circle bg-green">
                  <svg viewBox="0 0 24 24">
                    <line x1="3" y1="21" x2="21" y2="21" />
                    <line x1="5" y1="21" x2="5" y2="10" />
                    <line x1="19" y1="21" x2="19" y2="10" />
                    <path d="M5 10a4 4 0 1 1 14 0" />
                    <path d="M12 7V3" />
                    <path d="M10 2L14 2" />
                  </svg>
                </div>
                <div className="info-box-title">Coordonnées bancaires</div>
              </div>
              <div className="info-box-content">
                <div>
                  <strong>IBAN :</strong> FR76 3000 4031 4400 0103 0315 066
                </div>
                <div>
                  <strong>BIC :</strong> BNPAFRPPXXX
                </div>
                <div className="info-box-sub">Hellobank! - MME CHAMPA CHANTHANA</div>
              </div>
            </div>

            {/* Conditions de règlement */}
            <div className="info-box-card orange-theme">
              <div className="info-box-header">
                <div className="icon-circle bg-orange">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="info-box-title">Conditions de règlement</div>
              </div>
              <div className="info-box-content">
                Acompte de 30% à la signature du devis.
                <br />
                Solde à régler le jour de la livraison.
                <br />
                <br />
                <span className="info-box-sub">
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

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
  customPrice: string
}

type DocType = "DEVIS" | "FACTURE" | "TICKET"

function generatePreviewHTML(data: DevisTemplateData): string {
  // Format prix: "12.90" → "12,90 €", "12.00" → "12 €", "12.9" → "12,90 €"
  const formatPrice = (price: string): string => {
    const num = parseFloat(price)
    if (isNaN(num)) return ""
    // Nombre entier → pas de décimales, sinon toujours 2 décimales
    const formatted = num % 1 === 0 ? num.toString() : num.toFixed(2).replace(".", ",")
    return `${formatted} €`
  }

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
        <div class="product-price">${product.price ? formatPrice(product.price) : ""}</div>
      </div>
    `
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
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
    * { margin: 0; padding: 0; box-sizing: border-box; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Geist', sans-serif; 
      background: white; 
      color: #1a1a1a; 
      padding: 24px;
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
    .page { max-width: 100%; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 8px; border-bottom: none; }
    .header-left { display: flex; gap: 20px; align-items: flex-start; }
    .logo-column { display: flex; flex-direction: column; gap: 6px; align-items: center; }
    .avatar { 
      width: 160px; 
      height: 100px; 
      border-radius: 12px; 
      flex-shrink: 0; 
      background-size: cover; 
      background-position: center; 
      background-repeat: no-repeat;
      /* Removed heavy border/shadow to match 'clean' look of image, but keeping logic if user wants it back easily */
    }
    .company-info { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .company-name { font-size: 24px; font-weight: 800; color: #2d5016; margin-bottom: 4px; letter-spacing: -1px; line-height: 1; }
    .company-row { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #4b5563; line-height: 1.4; }
    .company-icon { display: none; }
    .company-phone { font-weight: 700; color: #1a1a1a; }
    .company-siret { font-size: 10px; color: #9ca3af; margin-top: 4px; }
    .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .header-glass-card {
      background: white;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      padding: 12px 24px;
      text-align: center;
      min-width: 140px;
    }
    .doc-main-title { 
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .doc-type {
      font-size: 20px;
      font-weight: 800;
      color: #2d5016;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-ref {
      font-size: 14px;
      font-weight: 700;
      color: #ea580c;
    }
    .doc-meta { font-size: 11px; color: #6b7280; font-weight: 500; }
    .doc-validity { font-size: 10px; color: #ff7b54; font-style: italic; margin-top: 2px; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .info-card {
      background: #f0fdf4; /* Green-50 */
      border-radius: 12px; 
      padding: 16px; 
      border: 2px solid #bbf7d0; /* Green-200 */
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .info-card.event { 
      background: #fff7ed; /* Orange-50 */
      border-color: #fed7aa; /* Orange-200 */
    }
    .info-header { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      margin-bottom: 8px; 
      padding-bottom: 8px; 
      border-bottom: 2px dashed #bbf7d0; 
    }
    .info-card.event .info-header { 
      border-bottom-color: #fed7aa;
    }
    .info-title { font-size: 11px; font-weight: 700; color: #1a1a1a; }
    .info-details { font-size: 10px; color: #4b5563; line-height: 1.4; }
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
      padding: 0 4px 12px 4px;
      border-bottom: 2px dashed #fde68a; /* Amber 200 */
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .product-list {
      display: flex;
      flex-direction: column;
      gap: 12px; /* Space between floating cards */
    }

    .product-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: white;
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.01);
    }
    
    /* Remove old borders */
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

    .product-icon img { width: 100%; height: 100%; object-fit: cover; }
    .product-emoji { font-size: 24px; }
    
    .product-details { flex: 1; min-width: 0; }
    
    .product-name {
      font-size: 13px;
      font-weight: 700;
      color: #2d5016; /* Thai Green */
      margin-bottom: 2px;
    }

    .product-desc {
      font-size: 10px;
      color: #666;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-price {
      font-size: 14px;
      font-weight: 700;
      color: #ea580c; /* Orange-600 */
      text-align: right;
      min-width: 70px;
    }
    
    .product-card-footer {
      margin-top: 16px;
      padding-top: 16px;
      padding-bottom: 16px; /* Space for bottom line */
      border-top: 2px dashed #fde68a;
      border-bottom: 2px dashed #fde68a; /* New separator below */
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .total-label {
      font-size: 18px; /* text-lg */
      font-weight: 800; /* font-extrabold */
      color: #92400e; /* text-amber-800 */
      opacity: 0.9;
      text-transform: none; /* Removed uppercase */
    }
    
    .total-amount {
      font-size: 24px; /* text-2xl */
      font-weight: 900; /* font-black */
      color: #ea580c; /* text-orange-600 */
    }

    .mentions { font-size: 10px; color: #999; line-height: 1.5; padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #e5e7eb; }
    .legal-tva { 
      font-size: 10px; 
      color: #9ca3af; 
      font-style: italic; 
      text-align: right; 
      margin-top: -12px; 
      padding-right: 16px;
      padding-bottom: 8px;
      border: none;
      position: relative;
      z-index: 10;
    }
    .signature-section { margin-top: 20px; }
    .signature-box { border: 2px dashed #fde68a; border-radius: 8px; padding: 16px; background: #fffbeb; }
    .signature-title { font-size: 12px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
    .signature-mention { font-size: 10px; color: #ff7b54; font-style: italic; margin-bottom: 16px; }
    .signature-line { display: flex; justify-content: space-between; font-size: 11px; color: #92400e; padding-top: 24px; border-top: 2px dashed #fde68a; }
    .signature-space { min-width: 150px; }
    .footer-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
    .footer-qr { text-align: center; }
    .footer-qr img { width: 45px; height: 45px; }
    .footer-qr-label { font-size: 7px; color: #2d5016; font-weight: 600; margin-top: 2px; }
    .footer-mentions { font-size: 8px; color: #666; flex: 1; text-align: center; padding: 0 10px; }
    .footer-logo { width: 50px; height: 50px; }
    .footer-logo img { width: 100%; height: 100%; object-fit: contain; }
    .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    
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
      font-size: 12px;
      font-weight: 700;
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
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="logo-column">
          <div class="avatar" style="background-image: url('http://localhost:3000/media/statut/evenement/buffet/buffet.svg');"></div>
          <div class="company-siret">SIRET : 510 941 164 RM 37 - EI</div>
        </div>
        <div class="company-info">
          <div class="company-name">ChanthanaThaiCook</div>
          
          <div class="company-row">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div style="font-weight: 500;">
              2 Impasse de la Poste<br/>
              37120 Marigny Marmande
            </div>
          </div>

          <div class="company-row">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
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
            <span class="doc-ref">N° ${data.docRef.replace(/^N°/, "").replace("DEVIS N°", "").replace("Devis N°", "")}</span>
          </div>
          <div class="doc-meta">Émis le <span style="font-weight:bold; color:#000000">${data.docDate}</span></div>
          ${data.docType !== "FACTURE" ? `<div class="doc-validity">Valable 1 mois</div>` : ""}
        </div>
      </div>
    </div>
    <div class="cards-grid">
      <div class="info-box-card green-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-green">
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="info-box-title">${data.client.name}</div>
        </div>
        <div class="info-box-content">
          ${data.client.address.replace(/,/g, "<br />")}<br />
          ${data.client.phone}
        </div>
      </div>
      <div class="info-box-card orange-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-orange">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="info-box-title">${data.event.name}</div>
        </div>
        <div class="info-box-content">
          ${data.event.date}<br />
          ${data.event.location}
        </div>
      </div>
    </div>
    
    <!-- New Product Card Container -->
    <div class="product-card-container">
      <div class="product-card-header">
        <div class="product-card-title">
           <div class="icon-circle bg-green" style="width: 28px; height: 28px;">
             <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
               <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
               <path d="M7 2v20"/>
               <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
             </svg>
           </div>
           ${data.docType === "FACTURE" ? "Prestations" : "Menu Proposé"}
        </div>
        ${
          data.nombrePersonnes
            ? `<div class="product-card-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          ${data.nombrePersonnes} personnes</div>`
            : ""
        }
      </div>
      
      <div class="product-list">
        ${productsHTML}
      </div>

      <div class="product-card-footer" style="${data.acomptePaid && data.acomptePaid > 0 && data.docType === "FACTURE" ? "display:block;" : ""}">
        ${
          data.acomptePaid && data.acomptePaid > 0 && data.docType === "FACTURE"
            ? `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="total-label" style="font-size:16px;">Total HT</span>
            <span class="total-amount" style="font-size:18px;">${formatPrice(data.total.toString())}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#666;">
            <span class="total-label" style="font-size:14px; font-weight:600;">Acompte déjà versé</span>
            <span class="total-amount" style="font-size:14px; color:#2d5016;">- ${formatPrice(data.acomptePaid.toString())}</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px dashed #fde68a; padding-top:8px;">
            <span class="total-label">Net à payer</span>
            <span class="total-amount">${formatPrice((data.total - data.acomptePaid).toString())}</span>
          </div>
          `
            : `
          <div class="total-label">Total HT</div>
          <div class="total-amount">${formatPrice(data.total.toString())}</div>
          `
        }
      </div>
    </div>
    <div class="legal-tva">
      TVA non applicable, art. 293 B du CGI
    </div>
    
    <!-- Cards Grid (Bank + Conditions side by side) -->
    <div class="cards-grid">
      <!-- Coordonnées bancaires -->
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
      
      <!-- Conditions de règlement -->
      <div class="info-box-card orange-theme">
        <div class="info-box-header">
          <div class="icon-circle bg-orange">
            ${
              data.docType === "FACTURE"
                ? `<svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>`
                : `<svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>`
            }
          </div>
          <div class="info-box-title">Conditions de règlement</div>
        </div>
        <div class="info-box-content">
          ${
            data.docType === "FACTURE"
              ? `Escompte pour paiement anticipé : Néant.<br />
                 Date limite de paiement : À réception du document.<br /><br />
                 <span class="info-box-sub">
                   Pénalités de retard : 10% l'an.<br />
                   Indemnité forfaitaire (pros) : 40 €.
                 </span>`
              : `Acompte de 30% à la signature du devis.<br/>
                 Solde à régler le jour de la livraison.<br/><br/>
                 <span class="info-box-sub">
                   Pénalités de retard : 10% l'an.<br/>
                   Indemnité forfaitaire (pros) : 40 €.
                 </span>`
          }
        </div>
      </div>
    </div>
    
    <!-- Zone de signature -->
    ${
      data.docType !== "FACTURE"
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
    }
    
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
  const [nombrePersonnes, setNombrePersonnes] = useState("120")

  // Document info (éditable)
  const [docRef, setDocRef] = useState(`N°${new Date().getFullYear()}001`)
  const [docDate, setDocDate] = useState(new Date().toLocaleDateString("fr-FR"))

  // Événement info
  const [eventName, setEventName] = useState("Repas des Vœux du Maire")
  const [eventDate, setEventDate] = useState("10/01/2026 à 17h")
  const [eventLocation, setEventLocation] = useState("Salle des fêtes de Marigny Marmande")

  // Plat personnalisé
  const [showCustomPlat, setShowCustomPlat] = useState(false)
  const [customPlatName, setCustomPlatName] = useState("Buffet Thaï Tradition")
  const [customPlatDesc, setCustomPlatDesc] = useState(
    "Notre buffet signature avec une sélection de nos meilleures spécialités thaïlandaises."
  )
  const [customPlatPrice, setCustomPlatPrice] = useState("")

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
      setSelectedPlats([...selectedPlats, { plat, customPrice: plat.prix || "" }])
    }
  }

  // Modifier le prix
  const handlePriceChange = (platId: number, price: string) => {
    setSelectedPlats(
      selectedPlats.map((sp) => (sp.plat.idplats === platId ? { ...sp, customPrice: price } : sp))
    )
  }

  // Supprimer un plat
  const handleRemovePlat = (platId: number) => {
    setSelectedPlats(selectedPlats.filter((sp) => sp.plat.idplats !== platId))
  }

  // Facture specific state
  const [acomptePaid, setAcomptePaid] = useState<string>("")

  // Calculer le total
  const total = useMemo(() => {
    let sum = selectedPlats.reduce((acc, sp) => {
      const prix = parseFloat(sp.customPrice || "0")
      return acc + prix
    }, 0)
    // Ajouter le plat personnalisé si activé
    if (showCustomPlat && customPlatPrice) {
      sum += parseFloat(customPlatPrice) || 0
    }
    return sum
  }, [selectedPlats, showCustomPlat, customPlatPrice])

  // Générer les données pour le template
  const getData = useCallback((): DevisTemplateData => {
    const finalTotal = useManualTotal && manualTotal ? parseFloat(manualTotal) : total
    return {
      docType: docType === "TICKET" ? "RECU" : docType,
      docRef,
      docDate,
      client: { name: clientName, address: clientAddress, phone: clientPhone },
      event: {
        name: eventName,
        location: eventLocation,
        date: eventDate,
      },
      products: [
        // Plats sélectionnés
        ...selectedPlats.map((sp) => ({
          name: sp.plat.plat,
          desc: sp.plat.description || "",
          img: sp.plat.photo_du_plat ? getStorageUrl(sp.plat.photo_du_plat) : undefined,
          price: showPrices && sp.customPrice ? sp.customPrice : undefined,
        })),
        // Plat personnalisé (si activé) - moved to end
        ...(showCustomPlat
          ? [
              {
                name: customPlatName,
                desc: customPlatDesc,
                img: "http://localhost:3000/media/statut/evenement/buffet/buffetclin.svg",
                price: showPrices && customPlatPrice ? customPlatPrice : undefined,
              },
            ]
          : []),
      ],
      total: finalTotal,
      mentions: "Budget TTC global validé. Acompte de 30% à la commande.",
      nombrePersonnes,
      acomptePaid: docType === "FACTURE" && acomptePaid ? parseFloat(acomptePaid) : undefined,
    }
  }, [
    docType,
    docRef,
    docDate,
    clientName,
    clientAddress,
    clientPhone,
    selectedPlats,
    total,
    showPrices,
    useManualTotal,
    manualTotal,
    nombrePersonnes,
    eventName,
    eventDate,
    eventLocation,
    showCustomPlat,
    customPlatName,
    customPlatDesc,
    customPlatPrice,
    acomptePaid,
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
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">N° Devis</Label>
                <Input
                  value={docRef}
                  onChange={(e) => setDocRef(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Date émis</Label>
                <Input
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              {docType === "FACTURE" && (
                <div className="col-span-2 mt-2">
                  <Label className="text-xs font-semibold text-blue-600">
                    Acompte déjà perçu (€)
                  </Label>
                  <Input
                    type="number"
                    value={acomptePaid}
                    onChange={(e) => setAcomptePaid(e.target.value)}
                    className="h-8 border-blue-200 bg-blue-50 text-sm"
                    placeholder="ex: 300"
                  />
                </div>
              )}
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

          {/* Événement */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">📅 Événement</h2>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Nom de l&apos;événement</Label>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Date & Heure</Label>
                  <Input
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Nb personnes</Label>
                  <Input
                    value={nombrePersonnes}
                    onChange={(e) => setNombrePersonnes(e.target.value)}
                    className="h-8 text-sm"
                    placeholder="120"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Lieu</Label>
                <Input
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Plat personnalisé */}
          <div className="bg-card rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">🎨 Plat personnalisé</h2>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCustomPlat}
                  onChange={(e) => setShowCustomPlat(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">Activer</span>
              </label>
            </div>
            {showCustomPlat && (
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Nom du plat</Label>
                  <Input
                    value={customPlatName}
                    onChange={(e) => setCustomPlatName(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={customPlatDesc}
                    onChange={(e) => setCustomPlatDesc(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Prix</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        value={customPlatPrice}
                        onChange={(e) => setCustomPlatPrice(e.target.value)}
                        className="h-8 text-sm"
                        placeholder="850"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-200">
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
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="text"
                        value={sp.customPrice}
                        onChange={(e) => handlePriceChange(sp.plat.idplats, e.target.value)}
                        className="h-8 w-16 text-right text-sm"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">€</span>
                    </div>
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
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

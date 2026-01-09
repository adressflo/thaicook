/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import React from "react"

// --- THEME COLORS ---
const colors = {
  orange: "#ff7b54",
  green: "#2d5016",
  cream: "#fef7e0",
  white: "#ffffff",
  grey: "#4b5563",
  lightGrey: "#f3f4f6",
  darkGrey: "#1f2937",
}

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#ffffff",
    color: colors.darkGrey,
    paddingBottom: 60, // Space for footer
  },

  // Header Section with Full Width Background
  headerBg: {
    backgroundColor: colors.cream,
    paddingHorizontal: 40,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: colors.orange,
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  companyDetails: {
    flex: 1,
    alignItems: "flex-start",
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.green,
    textTransform: "uppercase",
  },
  companyTagline: {
    fontSize: 10,
    color: colors.orange,
    marginTop: 2,
    fontWeight: "bold",
  },

  contactInfoBox: {
    alignItems: "flex-end",
  },
  contactText: {
    fontSize: 9,
    color: colors.grey,
    marginBottom: 2,
  },

  // Document Info & Client (White area)
  infoSection: {
    flexDirection: "row",
    paddingHorizontal: 40,
    marginTop: 30,
    justifyContent: "space-between",
  },
  docTitleBlock: {
    width: "50%",
  },
  docType: {
    fontSize: 28,
    fontWeight: "heavy",
    color: colors.orange, // "DEVIS" in Orange
    textTransform: "uppercase",
    marginBottom: 5,
  },
  docRef: {
    fontSize: 12,
    color: colors.darkGrey,
  },
  docDate: {
    marginTop: 4,
    fontSize: 11,
    color: colors.grey,
  },

  clientBlock: {
    width: "45%",
    backgroundColor: colors.lightGrey,
    borderRadius: 6,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },
  clientLabel: {
    fontSize: 8,
    color: colors.green,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.darkGrey,
    marginBottom: 2,
  },
  clientAddress: {
    fontSize: 10,
    color: colors.grey,
    lineHeight: 1.4,
  },

  // Table
  tableContainer: {
    marginTop: 40,
    marginHorizontal: 40,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.green,
    color: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  th: {
    fontWeight: "bold",
    fontSize: 10,
  },

  // Row Styles
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 50,
  },
  rowEven: {
    backgroundColor: colors.white,
  },
  rowOdd: {
    backgroundColor: "#f9fafb", // Very light grey
  },

  // Columns widths
  colPhoto: { width: "12%", alignItems: "center" },
  colDesc: { width: "48%", paddingRight: 5 },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "15%", textAlign: "right" },

  productImage: {
    width: 35,
    height: 35,
    borderRadius: 4,
    objectFit: "cover",
  },

  descriptionText: {
    fontSize: 10,
    color: colors.darkGrey,
  },

  // Totals Area
  footerSection: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 40,
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.grey,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: colors.orange,
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.orange,
  },

  // Bank Info & Notes
  bottomNotes: {
    marginHorizontal: 40,
    marginTop: 30,
    padding: 15,
    backgroundColor: colors.cream,
    borderRadius: 4,
  },
  mentionsText: {
    fontSize: 9,
    color: colors.green,
    fontStyle: "italic",
  },

  // Footer (Fixed)
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: "center",
    color: colors.grey,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
})

export type DocumentPDFProps = {
  type: string
  reference: string
  date: string
  client: {
    name: string
    address: string
  }
  lines: Array<{
    description: string
    quantity: number
    price: number
    photo_url?: string
  }>
  totals: {
    ht: number
    tva: number
    ttc: number
  }
  mentions?: string
}

// --- MOCK DATA ---
export const MOCK_DATA: DocumentPDFProps = {
  type: "DEVIS",
  reference: "D-2026-003",
  date: "09/01/2026",
  client: {
    name: "Jean Dupont - Entreprise XYZ",
    address: "12 Rue de la Paix\n75000 Paris",
  },
  lines: [
    {
      description: 'Menu "Saveurs Thaï" - Formule Complète\n(Entrée + Plat + Dessert)',
      quantity: 50,
      price: 25.0,
      photo_url: "http://116.203.111.206:9000/platphoto/pad_thai.jpg",
    },
    {
      description: "Location de vaisselle et nappage",
      quantity: 1,
      price: 150.0,
      // No photo
    },
    {
      description: "Service en salle (2 maîtres d'hôtel - 4h)",
      quantity: 8,
      price: 35.0,
    },
  ],
  totals: {
    ht: 1680.0,
    tva: 0,
    ttc: 1680.0,
  },
  mentions:
    "Acompte de 30% à la commande. Solde à la livraison. TVA non applicable, art. 293 B du CGI.",
}

const DocumentPDF: React.FC<DocumentPDFProps> = ({
  type,
  reference,
  date,
  client,
  lines,
  totals,
  mentions,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER WITH LOGO */}
      <View style={styles.headerBg}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.logoContainer}>
            {/* Using localhost:3000/logo.png assuming the app is running locally for preview.
                 For production, this should be a stable absolute URL. */}
            <Image src="http://localhost:3000/logo.png" style={styles.logoImage} />
          </View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>CHANTHANA</Text>
            <Text style={styles.companyTagline}>THAI COOK - TRAITEUR</Text>
          </View>
        </View>

        <View style={styles.contactInfoBox}>
          <Text style={styles.contactText}>123 Avenue de la Gastronomie</Text>
          <Text style={styles.contactText}>44000 NANTES</Text>
          <Text style={styles.contactText}>Tel: 06 12 34 56 78</Text>
          <Text style={styles.contactText}>contact@chanthana.fr</Text>
          <Text style={styles.contactText}>SIRET: 123 456 789 00012</Text>
        </View>
      </View>

      {/* DOCUMENT & CLIENT INFO */}
      <View style={styles.infoSection}>
        <View style={styles.docTitleBlock}>
          <Text style={styles.docType}>{type}</Text>
          <Text style={styles.docRef}>Réf : {reference}</Text>
          <Text style={styles.docDate}>Date d'émission : {date}</Text>
        </View>
        <View style={styles.clientBlock}>
          <Text style={styles.clientLabel}>CLIENT / FACTURÉ À</Text>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientAddress}>{client.address}</Text>
        </View>
      </View>

      {/* TABLE */}
      <View style={styles.tableContainer}>
        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, ...styles.colPhoto }}>Image</Text>
          <Text style={{ ...styles.th, ...styles.colDesc }}>Désignation</Text>
          <Text style={{ ...styles.th, ...styles.colQty }}>Qté</Text>
          <Text style={{ ...styles.th, ...styles.colPrice }}>P.U</Text>
          <Text style={{ ...styles.th, ...styles.colTotal }}>Total</Text>
        </View>

        {/* Rows */}
        {lines.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
          >
            <View style={styles.colPhoto}>
              {item.photo_url ? (
                <Image src={item.photo_url} style={styles.productImage} />
              ) : (
                <Text style={{ fontSize: 8, color: "#9ca3af" }}>-</Text>
              )}
            </View>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{item.price.toFixed(2)} €</Text>
            <Text style={styles.colTotal}>{(item.quantity * item.price).toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      {/* TOTALS */}
      <View style={styles.footerSection}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{totals.ht.toFixed(2)} €</Text>
          </View>
          {totals.tva > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                TVA ({((totals.tva / totals.ht) * 100).toFixed(0)}%)
              </Text>
              <Text style={styles.totalValue}>{totals.tva.toFixed(2)} €</Text>
            </View>
          )}
          <View style={styles.finalTotalRow}>
            <Text style={styles.finalTotalLabel}>NET À PAYER</Text>
            <Text style={styles.finalTotalValue}>{totals.ttc.toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      {/* MENTIONS */}
      {mentions && (
        <View style={styles.bottomNotes}>
          <Text style={styles.mentionsText}>Notes : {mentions}</Text>
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text>Chanthana Thai Cook - Micro-entreprise - NANTES</Text>
        <Text>Merci de votre confiance !</Text>
      </View>
    </Page>
  </Document>
)

export default DocumentPDF

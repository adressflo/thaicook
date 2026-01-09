/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import React from "react"

// --- COLORS (Matches App Theme) ---
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
    backgroundColor: "#ffffff", // White page background as requested "feuille blanche"
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },

  // TICKET CONTAINER STYLE (Centered on White Page)
  ticketParams: {
    backgroundColor: colors.cream,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    overflow: "hidden",
    marginTop: 10,
  },

  // HEADER SECTION
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.orange,
    borderStyle: "dashed",
  },
  logoBlock: {
    alignItems: "center",
  },
  logoImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.green,
    textTransform: "uppercase",
  },
  companyAddress: {
    fontSize: 9,
    color: colors.grey,
    textAlign: "center",
  },

  // CLIENT & EVENT BLOCK
  infoBlock: {
    padding: 20,
    backgroundColor: "rgba(255, 123, 84, 0.05)",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  clientRow: {
    marginBottom: 15,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.green,
  },
  clientDetail: {
    fontSize: 10,
    color: colors.darkGrey,
  },

  eventBox: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.orange,
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.orange,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  eventDetail: {
    fontSize: 9,
    color: colors.grey,
    marginBottom: 2,
  },

  // PRODUCTS LIST
  productsSection: {
    padding: 20,
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#f0f0f0",
  },
  productImage: {
    width: 35,
    height: 35,
    borderRadius: 4,
    marginRight: 10,
    objectFit: "cover",
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.darkGrey,
  },
  productDesc: {
    fontSize: 9,
    color: colors.grey,
    fontStyle: "italic",
  },

  // TOTALS
  totalSection: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderTopWidth: 2,
    borderTopColor: colors.orange,
    borderStyle: "dashed",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.grey,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.orange,
  },

  // FOOTER EXTERNAL
  docTitleExternal: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.orange,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  docRefExternal: {
    fontSize: 10,
    color: colors.grey,
    marginBottom: 15,
  },
})

export type DocumentPDFProps = {
  type: string
  reference: string
  date: string
  client: any
  lines: any[]
  totals: any
  mentions?: string
  eventDetails?: any // New prop for event specifics
}

// --- MOCK DATA SPECIFIC FOR MAIRIE DE MARIGNY ---
export const MOCK_DATA: DocumentPDFProps = {
  type: "DEVIS",
  reference: "D-2026-003",
  date: "09/01/2026",
  client: {
    name: "Commune de Marigny Marmande Mairie",
    address: "26 Gr Grande Rue, 37120 Marigny-Marmande",
    phone: "02 47 58 31 11",
  },
  eventDetails: {
    title: "Prestation : Repas des Voeux du Maire",
    location: "Salle des fêtes de Marigny Marmande",
    date: "10/01/2026 à 17h",
  },
  lines: [
    {
      description: "Ailes de poulets",
      quantity: 1, // Quantity not specified, assuming global or per person
      price: 0, // Price not specific per item, using global budget logic or breakdown
      photo_url: "http://localhost:3000/media/avatars/panier1.svg", // Placeholder
    },
    {
      description: "Chips crevettes",
      quantity: 1,
      price: 0,
    },
    {
      description: "Crevettes à l'ail",
      quantity: 1,
      price: 0,
    },
    {
      description: "Nems",
      quantity: 1,
      price: 0,
    },
    {
      description: "Complements divers",
      quantity: 1,
      price: 0,
    },
  ],
  totals: {
    ht: 850.0, // Assuming budget is total
    tva: 0,
    ttc: 850.0,
  },
  mentions: "Budget TTC global validé.",
}

const DocumentPDF: React.FC<DocumentPDFProps> = ({
  type,
  reference,
  date,
  client,
  lines,
  totals,
  mentions,
  eventDetails,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* External Title Area */}
      <View>
        <Text style={styles.docTitleExternal}>{type}</Text>
        <Text style={styles.docRefExternal}>
          Réf : {reference} | Date : {date}
        </Text>
      </View>

      {/* TICKET CONTAINER */}
      <View style={styles.ticketParams}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoBlock}>
            <Image src="http://localhost:3000/logo.png" style={styles.logoImage} />
            <Text style={styles.companyName}>ChanthanaThaiCook</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.companyAddress}>2 impasse de la poste</Text>
            <Text style={styles.companyAddress}>37120 Marigny Marmande</Text>
            {/* Add contact info if needed */}
          </View>
        </View>

        {/* INFO CLIENT & EVENT */}
        <View style={styles.infoBlock}>
          <View style={styles.clientRow}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientDetail}>{client.address}</Text>
            <Text style={styles.clientDetail}>{client.phone}</Text>
          </View>

          {eventDetails && (
            <View style={styles.eventBox}>
              <Text style={styles.eventTitle}>{eventDetails.title}</Text>
              <Text style={styles.eventDetail}>📍 {eventDetails.location}</Text>
              <Text style={styles.eventDetail}>📅 {eventDetails.date}</Text>
            </View>
          )}
        </View>

        {/* PRODUCTS */}
        <View style={styles.productsSection}>
          {lines.map((item, index) => (
            <View key={index} style={styles.productRow}>
              {/* Image slot - showing placeholder or real image if available */}
              <Image
                src={item.photo_url || "http://localhost:3000/media/avatars/panier1.svg"}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.description}</Text>
              </View>

              {/* Assuming Global Price, so maybe hide individual price if 0? */}
              {item.price > 0 && (
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>{item.price} €</Text>
              )}
            </View>
          ))}
        </View>

        {/* TOTALS */}
        <View style={styles.totalSection}>
          <View style={styles.grandTotalRow}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.green }}>
              BUDGET TOTAL TTC
            </Text>
            <Text style={styles.grandTotalValue}>{totals.ttc.toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      {/* FOOTER NOTE */}
      <Text style={{ fontSize: 9, color: "#666", marginTop: 10, textAlign: "center" }}>
        {mentions}
      </Text>
    </Page>
  </Document>
)

export default DocumentPDF

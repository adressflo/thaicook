"use client"
import type { CommandeUI } from "@/types/app"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import React from "react"

// Enregistrement des polices (similaire à ce que vous avez dans le layout)
// NOTE: @react-pdf/renderer ne supporte pas directement les polices variables comme Geist.
// Il faut utiliser des fichiers de police statiques (TTF).
// Pour cet exemple, nous utiliserons les polices par défaut.

// Définition des styles, inspirés de Tailwind et de votre thème
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32", // Similaire à thai-green
  },
  subtitle: {
    fontSize: 12,
    color: "#F97316", // Similaire à thai-orange
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2E7D32",
    borderBottomWidth: 1,
    borderBottomColor: "#F97316",
    paddingBottom: 3,
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    color: "#333333",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCellText: {
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: "center",
    color: "grey",
    fontSize: 9,
  },
})

interface FacturePDFProps {
  commande: CommandeUI
}

const FacturePDF: React.FC<FacturePDFProps> = ({ commande }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ChanthanaThaiCook</Text>
        <Text style={styles.subtitle}>Facture de Commande</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations sur la commande</Text>
        <Text style={styles.text}>Numéro de commande: #{commande.idcommande}</Text>
        <Text style={styles.text}>
          Date: {new Date(commande.date_de_prise_de_commande || "").toLocaleDateString("fr-FR")}
        </Text>
        <Text style={styles.text}>
          Client: {commande.client?.prenom} {commande.client?.nom}
        </Text>
        <Text style={styles.text}>Statut: {commande.statut_commande}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails des articles</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Plat</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Quantité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Prix Unitaire</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Total</Text>
            </View>
          </View>
          {/* Table Body */}
          {(commande.details || []).map((detail, index) => (
            <View style={styles.tableRow} key={detail.iddetails || index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{detail.nom_plat}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>{detail.quantite_plat_commande}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>
                  {Number(detail.prix_unitaire).toFixed(2)} €
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellText}>
                  {(Number(detail.prix_unitaire) * (detail.quantite_plat_commande || 1)).toFixed(2)}{" "}
                  €
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ ...styles.section, marginTop: 20, textAlign: "right" }}>
        <Text style={{ ...styles.text, fontSize: 12, fontWeight: "bold" }}>
          Total:{" "}
          {(commande.details || [])
            .reduce(
              (acc, detail) =>
                acc + Number(detail.prix_unitaire) * (detail.quantite_plat_commande || 1),
              0
            )
            .toFixed(2)}{" "}
          €
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>Merci pour votre commande !</Text>
        <Text>ChanthanaThaiCook - Cuisine Thaïlandaise Authentique</Text>
      </View>
    </Page>
  </Document>
)

export default FacturePDF

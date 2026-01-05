"use client"

import FactureCommandePDF from "@/components/pdf/FactureCommandePDF"
import { Button } from "@/components/ui/button"
import type { EvenementUI } from "@/types/app"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import React from "react"

// Styles PDF basiques pour l'événement (à améliorer ou séparer plus tard)
const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 30 },
  header: { fontSize: 20, marginBottom: 20, textAlign: "center", color: "#B35E17" }, // Thai orange-ish
  section: { margin: 10, padding: 10 },
  text: { fontSize: 12, marginBottom: 5 },
})

const DevisEvenementPDF = ({ evenement }: { evenement: EvenementUI }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Récapitulatif Événement</Text>
        <Text style={styles.text}>Événement : {evenement.nom_evenement}</Text>
        <Text style={styles.text}>
          Date :{" "}
          {evenement.date_evenement
            ? new Date(evenement.date_evenement).toLocaleDateString()
            : "Non définie"}
        </Text>
        <Text style={styles.text}>Nombre de personnes : {evenement.nombre_de_personnes}</Text>
        <Text style={styles.text}>Type : {evenement.type_evenement}</Text>
        <Text style={styles.text}>Statut : {evenement.statut}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>
          Budget estimé : {evenement.budget_client || evenement.budget_estime || "Non renseigné"} €
        </Text>
      </View>
    </Page>
  </Document>
)

interface BoutonTelechargerDevisProps {
  evenement: EvenementUI
  className?: string
}

const BoutonTelechargerDevis: React.FC<BoutonTelechargerDevisProps> = ({
  evenement,
  className,
}) => {
  const nomFichier = `devis-evenement-${evenement.id || evenement.idevenements}.pdf`

  if (!evenement) return null

  return (
    <PDFDownloadLink document={<DevisEvenementPDF evenement={evenement} />} fileName={nomFichier}>
      {({ loading }) => (
        <Button variant="outline" size="sm" disabled={loading} className={className}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {loading ? "Génération..." : "Devis / Facture"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

export default BoutonTelechargerDevis

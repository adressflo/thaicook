"use client"

import DocumentPDF, { MOCK_DATA } from "@/components/pdf/DocumentPDF"
import dynamic from "next/dynamic"

// Dynamic import for PDFViewer to disable SSR (critical for react-pdf)
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Chargement du visualiseur PDF...</p>,
})

export default function PreviewDesignPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-100 p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Design Document - Aperçu</h1>
        <p className="text-sm text-gray-500">
          Modifiez `components/pdf/DocumentPDF.tsx` pour ajuster le design.
        </p>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border bg-white shadow-xl">
        <PDFViewer className="h-full w-full">
          <DocumentPDF {...MOCK_DATA} />
        </PDFViewer>
      </div>
    </div>
  )
}

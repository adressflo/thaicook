"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PreviewDesignPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/testvisuel/documents")
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Redirection...</h1>
        <p className="text-muted-foreground">Vers l'outil de prévisualisation visuelle.</p>
      </div>
    </div>
  )
}

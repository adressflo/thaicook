import { Loader2 } from "lucide-react"
import { Suspense } from "react"
import HistoryCompletClient from "./HistoryCompletClient"

export const dynamic = "force-dynamic"

export default function HistoriqueCompletPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="text-thai-orange h-12 w-12 animate-spin" />
        </div>
      }
    >
      <HistoryCompletClient />
    </Suspense>
  )
}

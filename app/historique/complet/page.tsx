"use client"

import { CalendarView } from "@/components/historique/calendar/CalendarView"
import { AppLayout } from "@/components/layout/AppLayout"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default function HistoriqueCompletPage() {
  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen px-0 py-4 md:px-4 md:py-8">
        <div className="animate-in fade-in mx-auto w-full max-w-7xl duration-500">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="text-thai-orange h-12 w-12 animate-spin" />
              </div>
            }
          >
            <CalendarView />
          </Suspense>
        </div>
      </div>
    </AppLayout>
  )
}

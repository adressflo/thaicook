"use client"

import { getClientProfile } from "@/app/profil/actions"
import { CalendarDayModal } from "@/components/historique/calendar/CalendarDayModal"
import { CalendarGrid } from "@/components/historique/calendar/CalendarGrid"
import { CalendarHeader } from "@/components/historique/calendar/CalendarHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  usePrismaCommandesByClient,
  usePrismaEvenementsByClient,
  usePrismaExtras,
} from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { addMonths, subMonths } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function CalendarView() {
  const router = useRouter()
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    }
  }, [currentUser?.id])

  // Data fetching
  const { data: commandes = [] } = usePrismaCommandesByClient(clientProfile?.idclient)
  const { data: evenements = [] } = usePrismaEvenementsByClient(clientProfile?.idclient)
  const { data: extras } = usePrismaExtras()

  // State
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Navigation handlers
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  // Filtrer les données pour le modal
  const selectedDateCommandes = selectedDate
    ? commandes.filter((c) => {
        if (!c.date_et_heure_de_retrait_souhaitees) return false
        const d = new Date(c.date_et_heure_de_retrait_souhaitees)
        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  const selectedDateEvenements = selectedDate
    ? evenements.filter((e) => {
        if (!e.date_evenement) return false
        const d = new Date(e.date_evenement)
        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  return (
    <div className="space-y-6">
      {/* Bouton Retour */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-thai-green hover:bg-thai-green/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Card className="border-thai-orange/20 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-thai-green text-3xl font-bold">
            Calendrier Historique
          </CardTitle>
          <CardDescription>
            Visualisez toutes vos commandes et événements passés et à venir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />

            <CalendarGrid
              currentDate={currentDate}
              commandes={commandes}
              evenements={evenements}
              onDayClick={handleDayClick}
            />
          </div>
        </CardContent>
      </Card>

      <CalendarDayModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        date={selectedDate}
        commandes={selectedDateCommandes}
        evenements={selectedDateEvenements}
        extras={extras || []}
      />
    </div>
  )
}

"use client"

import { getClientProfile } from "@/app/profil/actions"
import { HistoryList } from "@/components/historique/HistoryList"
import { CalendarDayModal } from "@/components/historique/calendar/CalendarDayModal"
import { CalendarGrid } from "@/components/historique/calendar/CalendarGrid"
import { CalendarHeader } from "@/components/historique/calendar/CalendarHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  usePrismaCommandesByClient,
  usePrismaEvenementsByClient,
  usePrismaExtras,
} from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { ClientUI, CommandeUI } from "@/types/app"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { addMonths, subMonths } from "date-fns"
import { ArrowLeft, Calendar as CalendarIcon, List } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function CalendarView() {
  const router = useRouter()
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile - Utilisation de ClientUI pour correspondre au type retourné
  const [clientProfile, setClientProfile] = useState<ClientUI | null>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then((data) => setClientProfile(data as unknown as ClientUI))
    }
  }, [currentUser])

  // Data fetching
  const idClient = clientProfile?.idclient

  const { data: commandes = [] } = usePrismaCommandesByClient(idClient)
  const { data: evenements = [] } = usePrismaEvenementsByClient(idClient)
  const { data: extras } = usePrismaExtras()

  // State
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  // Helpers
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(prix)
  }

  const calculateTotal = (commande: CommandeUI) => {
    if (!commande.details) return 0
    return commande.details.reduce((acc, detail) => {
      // Gestion robuste de la quantité via casting
      const d = detail as unknown as { quantite_plat_commande?: number; quantite?: number }
      const quantite = d.quantite_plat_commande || d.quantite || 0
      return acc + (Number(detail.prix_unitaire) || 0) * quantite
    }, 0)
  }

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

  // Filter data for the modal
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

      <div className="space-y-6">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
          <Card className="border-thai-orange/20 mx-0 rounded-none border-x-0 bg-white/80 shadow-xl backdrop-blur-sm md:mx-0 md:rounded-xl md:border-x">
            <CardHeader className="p-4 pb-2 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                    <DialogTrigger asChild>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/statut/compta/compta.svg"
                        alt="Historique"
                        className="h-24 w-40 cursor-pointer rounded-lg border-2 border-white/50 object-cover shadow-md transition-transform hover:scale-105"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-md overflow-hidden rounded-xl p-0">
                      <VisuallyHidden>
                        <DialogTitle>Aperçu vidéo</DialogTitle>
                      </VisuallyHidden>
                      <video
                        src="/media/statut/compta/comptabilit2.mp4"
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => setIsVideoModalOpen(false)}
                        className="w-full"
                      />
                    </DialogContent>
                  </Dialog>
                  <div>
                    <CardTitle className="text-thai-green text-3xl font-bold">
                      Mon Historique
                    </CardTitle>
                    <CardDescription>
                      Visualisez toutes vos commandes et événements passés et à venir.
                    </CardDescription>
                  </div>
                </div>

                <TabsList className="bg-thai-cream/50 border-thai-orange/20 self-start border md:self-center">
                  <TabsTrigger
                    value="calendar"
                    className="data-[state=active]:bg-thai-orange data-[state=active]:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Calendrier
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-thai-orange data-[state=active]:text-white"
                  >
                    <List className="mr-2 h-4 w-4" />
                    Liste
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-6 md:pt-0">
              <TabsContent value="calendar" className="mt-0 space-y-6">
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
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <HistoryList
                  commandes={commandes}
                  evenements={evenements}
                  extras={extras}
                  formatPrix={formatPrix}
                  calculateTotal={calculateTotal}
                  emptyType="commandes-historique"
                  onSelectDate={handleDayClick}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

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

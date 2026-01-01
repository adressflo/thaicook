"use client"

import { getClientProfile } from "@/app/profil/actions"
import { FilterSearchBar } from "@/components/historique/FilterSearchBar"
import { HistoryList } from "@/components/historique/HistoryList"
import { CalendarDayModal } from "@/components/historique/calendar/CalendarDayModal"
import { CalendarGrid } from "@/components/historique/calendar/CalendarGrid"
import { CalendarHeader } from "@/components/historique/calendar/CalendarHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  usePrismaCommandesByClient,
  usePrismaEvenementsByClient,
  usePrismaExtras,
} from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { CommandeUI } from "@/types/app"
import { addMonths, subMonths } from "date-fns"
import { ArrowLeft, Calendar as CalendarIcon, List } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

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
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [isFiltered, setIsFiltered] = useState(false)

  // Update active filters count
  useEffect(() => {
    let count = 0
    if (statusFilter) count++
    if (typeFilter) count++
    if (dateRange.from || dateRange.to) count++
    if (minAmount || maxAmount) count++
    setActiveFiltersCount(count)
    setIsFiltered(count > 0 || searchTerm.length > 0)
  }, [statusFilter, typeFilter, dateRange, minAmount, maxAmount, searchTerm])

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
    setTypeFilter(null)
    setDateRange({ from: null, to: null })
    setMinAmount("")
    setMaxAmount("")
  }

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
      return acc + (Number(detail.prix_unitaire) || 0) * (detail.quantite || 0)
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

  // Filtering Logic
  const filteredCommandes = useMemo(() => {
    if (typeFilter === "evenement") return []

    return commandes.filter((c) => {
      // 1. Search Term (Dish names)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const hasMatchingDish = c.details?.some((d) =>
          d.plat?.nom_plat?.toLowerCase().includes(searchLower)
        )
        if (!hasMatchingDish) return false
      }

      // 2. Status
      if (statusFilter && c.statut_commande !== statusFilter) {
        // Map "Confirmée" if needed, but exact match is usually safer if values align
        return false
      }

      // 3. Date Range
      if (dateRange.from || dateRange.to) {
        const cDate = c.date_et_heure_de_retrait_souhaitees
          ? new Date(c.date_et_heure_de_retrait_souhaitees)
          : null
        if (!cDate) return false

        if (dateRange.from && cDate < dateRange.from) return false
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          if (cDate > endOfDay) return false
        }
      }

      // 4. Amount
      if (minAmount || maxAmount) {
        const total = calculateTotal(c)
        if (minAmount && total < parseFloat(minAmount)) return false
        if (maxAmount && total > parseFloat(maxAmount)) return false
      }

      return true
    })
  }, [commandes, searchTerm, statusFilter, typeFilter, dateRange, minAmount, maxAmount])

  const filteredEvenements = useMemo(() => {
    if (typeFilter === "commande") return []

    return evenements.filter((e) => {
      // 1. Search Term (Event name/type)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesName = e.nom_evenement?.toLowerCase().includes(searchLower)
        const matchesType = e.type_evenement?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesType) return false
      }

      // 2. Status
      if (statusFilter && e.statut_evenement !== statusFilter) {
        return false
      }

      // 3. Date Range
      if (dateRange.from || dateRange.to) {
        const eDate = e.date_evenement ? new Date(e.date_evenement) : null
        if (!eDate) return false

        if (dateRange.from && eDate < dateRange.from) return false
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          if (eDate > endOfDay) return false
        }
      }

      // 4. Amount (Budget)
      if (minAmount || maxAmount) {
        const budget = Number(e.budget) || 0
        if (minAmount && budget < parseFloat(minAmount)) return false
        if (maxAmount && budget > parseFloat(maxAmount)) return false
      }

      return true
    })
  }, [evenements, searchTerm, statusFilter, typeFilter, dateRange, minAmount, maxAmount])

  // Filter data for the modal (using the already filtered lists is better UX?)
  // Actually, usually calendar shows everything or filtered view.
  // Let's use the filtered lists for the calendar grid too.

  const selectedDateCommandes = selectedDate
    ? filteredCommandes.filter((c) => {
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
    ? filteredEvenements.filter((e) => {
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
        <FilterSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          minAmount={minAmount}
          onMinAmountChange={setMinAmount}
          maxAmount={maxAmount}
          onMaxAmountChange={setMaxAmount}
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={handleClearAllFilters}
          isFiltered={isFiltered}
        />

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
          <div className="mb-4 flex items-center justify-between">
            <div></div> {/* Spacer */}
            <TabsList className="bg-thai-cream/50 border-thai-orange/20 border">
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

          <TabsContent value="calendar" className="mt-0">
            <Card className="border-thai-orange/20 mx-0 rounded-none border-x-0 bg-white/80 shadow-xl backdrop-blur-sm md:mx-0 md:rounded-xl md:border-x">
              <CardHeader className="p-4 pb-2 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <CardTitle className="text-thai-green text-3xl font-bold">
                      Calendrier Historique
                    </CardTitle>
                    <CardDescription>
                      Visualisez toutes vos commandes et événements passés et à venir.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-6 md:pt-0">
                <div className="space-y-6">
                  <CalendarHeader
                    currentDate={currentDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onToday={handleToday}
                  />

                  <CalendarGrid
                    currentDate={currentDate}
                    commandes={filteredCommandes}
                    evenements={filteredEvenements}
                    onDayClick={handleDayClick}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card className="border-thai-orange/20 mx-0 rounded-none border-x-0 bg-white/80 shadow-xl backdrop-blur-sm md:mx-0 md:rounded-xl md:border-x">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-thai-green text-2xl font-bold">
                  Liste Historique
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <HistoryList
                  commandes={filteredCommandes}
                  evenements={filteredEvenements}
                  extras={extras}
                  formatPrix={formatPrix}
                  calculateTotal={calculateTotal}
                  emptyType="commandes-historique"
                  onSelectDate={handleDayClick}
                />
              </CardContent>
            </Card>
          </TabsContent>
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

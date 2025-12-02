"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, ChefHat, Filter, Search, Users, X } from "lucide-react"
import React from "react"

interface FilterSearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string | null
  onStatusFilterChange: (value: string | null) => void
  typeFilter: string | null
  onTypeFilterChange: (value: string | null) => void
  dateRange: { from: Date | null; to: Date | null }
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void
  minAmount: string
  onMinAmountChange: (value: string) => void
  maxAmount: string
  onMaxAmountChange: (value: string) => void
  activeFiltersCount: number
  onClearAllFilters: () => void
  isFiltered: boolean
}

export function FilterSearchBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  dateRange,
  onDateRangeChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  activeFiltersCount,
  onClearAllFilters,
  isFiltered,
}: FilterSearchBarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "Confirmée", label: "Confirmée" },
    { value: "En attente de confirmation", label: "En attente" },
    { value: "Récupérée", label: "Récupérée" },
    { value: "Annulée", label: "Annulée" },
    { value: "Confirmé / Acompte reçu", label: "Acompte reçu" },
    { value: "Payé intégralement", label: "Payé intégralement" },
    { value: "Réalisé", label: "Réalisé" },
    { value: "En préparation", label: "En préparation" },
    { value: "Contact établi", label: "Contact établi" },
    { value: "Annulé", label: "Annulé" },
  ]

  const typeOptions = [
    { value: "all", label: "Tous les types" },
    { value: "commande", label: "Commandes" },
    { value: "evenement", label: "Événements" },
  ]

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Toutes les dates"
    if (dateRange.from && !dateRange.to) {
      return `Depuis ${format(dateRange.from, "dd MMM yyyy", { locale: fr })}`
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd MMM", { locale: fr })} - ${format(dateRange.to, "dd MMM yyyy", { locale: fr })}`
    }
    return "Sélectionner des dates"
  }

  return (
    <div className="border-thai-orange/20 animate-fadeIn overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Barre de recherche principale */}
      <div className="from-thai-cream/30 bg-linear-to-r to-white p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="text-thai-green/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-thai-green/30 focus:border-thai-orange pl-10 transition-colors"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-thai-green/30 hover:bg-thai-green/10 transition-all duration-200"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="bg-thai-orange ml-2 text-white">{activeFiltersCount}</Badge>
            )}
          </Button>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={onClearAllFilters}
              className="text-thai-red hover:bg-thai-red/10 transition-colors"
            >
              <X className="mr-1 h-4 w-4" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Filtres avancés (collapsible) */}
      {isExpanded && (
        <div className="border-thai-orange/20 bg-thai-cream/20 animate-fadeIn space-y-4 border-t p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Filtre de statut */}
            <div className="space-y-2">
              <label className="text-thai-green flex items-center gap-2 text-sm font-medium">
                <ChefHat className="h-4 w-4" />
                Statut
              </label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => onStatusFilterChange(value === "all" ? null : value)}
              >
                <SelectTrigger className="border-thai-green/30 focus:border-thai-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre de type */}
            <div className="space-y-2">
              <label className="text-thai-green flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Type
              </label>
              <Select
                value={typeFilter || "all"}
                onValueChange={(value) => onTypeFilterChange(value === "all" ? null : value)}
              >
                <SelectTrigger className="border-thai-green/30 focus:border-thai-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre de date */}
            <div className="space-y-2">
              <label className="text-thai-green flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-thai-green/30 focus:border-thai-orange w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateRange.from || undefined, to: dateRange.to || undefined }}
                    onSelect={(range) => {
                      onDateRangeChange({
                        from: range?.from || null,
                        to: range?.to || null,
                      })
                    }}
                    numberOfMonths={2}
                    locale={fr}
                  />
                  <div className="border-t p-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onDateRangeChange({ from: null, to: null })
                        setDatePickerOpen(false)
                      }}
                    >
                      Effacer les dates
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtre de montant */}
            <div className="space-y-2">
              <label className="text-thai-green text-sm font-medium">Montant (€)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={minAmount}
                  onChange={(e) => onMinAmountChange(e.target.value)}
                  className="border-thai-green/30 focus:border-thai-orange"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => onMaxAmountChange(e.target.value)}
                  className="border-thai-green/30 focus:border-thai-orange"
                />
              </div>
            </div>
          </div>

          {/* Résumé des filtres actifs */}
          {isFiltered && (
            <div className="border-thai-orange/20 flex flex-wrap gap-2 border-t pt-2">
              <span className="text-thai-green text-sm font-medium">Filtres actifs:</span>
              {statusFilter && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Statut: {statusOptions.find((s) => s.value === statusFilter)?.label}
                  <button
                    onClick={() => onStatusFilterChange(null)}
                    className="hover:text-thai-red ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {typeFilter && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Type: {typeOptions.find((t) => t.value === typeFilter)?.label}
                  <button
                    onClick={() => onTypeFilterChange(null)}
                    className="hover:text-thai-red ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(dateRange.from || dateRange.to) && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Période: {formatDateRange()}
                  <button
                    onClick={() => onDateRangeChange({ from: null, to: null })}
                    className="hover:text-thai-red ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(minAmount || maxAmount) && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Montant: {minAmount || "0"}€ - {maxAmount || "∞"}€
                  <button
                    onClick={() => {
                      onMinAmountChange("")
                      onMaxAmountChange("")
                    }}
                    className="hover:text-thai-red ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

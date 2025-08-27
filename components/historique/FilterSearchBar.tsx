'use client';

import React from 'react';
import { Search, Filter, X, Calendar, Users, ChefHat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FilterSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
  typeFilter: string | null;
  onTypeFilterChange: (value: string | null) => void;
  dateRange: { from: Date | null; to: Date | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  minAmount: string;
  onMinAmountChange: (value: string) => void;
  maxAmount: string;
  onMaxAmountChange: (value: string) => void;
  activeFiltersCount: number;
  onClearAllFilters: () => void;
  isFiltered: boolean;
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
  isFiltered
}: FilterSearchBarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Confirmée', label: 'Confirmée' },
    { value: 'En attente de confirmation', label: 'En attente' },
    { value: 'Récupérée', label: 'Récupérée' },
    { value: 'Annulée', label: 'Annulée' },
    { value: 'Confirmé / Acompte reçu', label: 'Acompte reçu' },
    { value: 'Payé intégralement', label: 'Payé intégralement' },
    { value: 'Réalisé', label: 'Réalisé' },
    { value: 'En préparation', label: 'En préparation' },
    { value: 'Contact établi', label: 'Contact établi' },
    { value: 'Annulé', label: 'Annulé' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'commande', label: 'Commandes' },
    { value: 'evenement', label: 'Événements' }
  ];

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return 'Toutes les dates';
    if (dateRange.from && !dateRange.to) {
      return `Depuis ${format(dateRange.from, 'dd MMM yyyy', { locale: fr })}`;
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'dd MMM', { locale: fr })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: fr })}`;
    }
    return 'Sélectionner des dates';
  };

  return (
    <div className="bg-white rounded-lg border border-thai-orange/20 shadow-sm overflow-hidden animate-fadeIn">
      {/* Barre de recherche principale */}
      <div className="p-4 bg-gradient-to-r from-thai-cream/30 to-white">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-thai-green/60" />
            <Input
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-thai-green/30 focus:border-thai-orange transition-colors"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-thai-green/30 hover:bg-thai-green/10 transition-all duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-thai-orange text-white">{activeFiltersCount}</Badge>
            )}
          </Button>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={onClearAllFilters}
              className="text-thai-red hover:bg-thai-red/10 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Filtres avancés (collapsible) */}
      {isExpanded && (
        <div className="border-t border-thai-orange/20 bg-thai-cream/20 p-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre de statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-thai-green flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Statut
              </label>
              <Select value={statusFilter || 'all'} onValueChange={(value) => onStatusFilterChange(value === 'all' ? null : value)}>
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
              <label className="text-sm font-medium text-thai-green flex items-center gap-2">
                <Users className="h-4 w-4" />
                Type
              </label>
              <Select value={typeFilter || 'all'} onValueChange={(value) => onTypeFilterChange(value === 'all' ? null : value)}>
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
              <label className="text-sm font-medium text-thai-green flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-thai-green/30 focus:border-thai-orange"
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
                        to: range?.to || null
                      });
                    }}
                    numberOfMonths={2}
                    locale={fr}
                  />
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onDateRangeChange({ from: null, to: null });
                        setDatePickerOpen(false);
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
              <label className="text-sm font-medium text-thai-green">Montant (€)</label>
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
            <div className="flex flex-wrap gap-2 pt-2 border-t border-thai-orange/20">
              <span className="text-sm text-thai-green font-medium">Filtres actifs:</span>
              {statusFilter && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Statut: {statusOptions.find(s => s.value === statusFilter)?.label}
                  <button
                    onClick={() => onStatusFilterChange(null)}
                    className="ml-1 hover:text-thai-red"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {typeFilter && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Type: {typeOptions.find(t => t.value === typeFilter)?.label}
                  <button
                    onClick={() => onTypeFilterChange(null)}
                    className="ml-1 hover:text-thai-red"
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
                    className="ml-1 hover:text-thai-red"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(minAmount || maxAmount) && (
                <Badge variant="secondary" className="bg-thai-green/10 text-thai-green">
                  Montant: {minAmount || '0'}€ - {maxAmount || '∞'}€
                  <button
                    onClick={() => {
                      onMinAmountChange('');
                      onMaxAmountChange('');
                    }}
                    className="ml-1 hover:text-thai-red"
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
  );
}
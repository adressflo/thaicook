'use client';

import { useState, useMemo, forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks/use-mobile';

interface ResponsiveDateSelectorProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: {
    day?: string;
    month?: string;
    year?: string;
  };
}

export const ResponsiveDateSelector = forwardRef<HTMLDivElement, ResponsiveDateSelectorProps>(
  ({ 
    value, 
    onChange, 
    label = "Date", 
    required = false, 
    disabled = false, 
    className,
    minDate,
    maxDate,
    placeholder = {
      day: "Jour",
      month: "Mois", 
      year: "Année"
    }
  }, ref) => {
    const { isMobile, isTablet } = useBreakpoints();
    
    const currentYear = new Date().getFullYear();
    const minYear = minDate?.getFullYear() || currentYear;
    const maxYear = maxDate?.getFullYear() || currentYear + 5;

    // Générer les options de jours (1-31)
    const dayOptions = useMemo(() => 
      Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString().padStart(2, '0'),
        label: (i + 1).toString()
      })), []
    );

    // Options des mois
    const monthOptions = useMemo(() => [
      { value: '01', label: isMobile ? 'Jan' : 'Janvier' },
      { value: '02', label: isMobile ? 'Fév' : 'Février' },
      { value: '03', label: isMobile ? 'Mar' : 'Mars' },
      { value: '04', label: isMobile ? 'Avr' : 'Avril' },
      { value: '05', label: isMobile ? 'Mai' : 'Mai' },
      { value: '06', label: isMobile ? 'Jui' : 'Juin' },
      { value: '07', label: isMobile ? 'Juil' : 'Juillet' },
      { value: '08', label: isMobile ? 'Aoû' : 'Août' },
      { value: '09', label: isMobile ? 'Sep' : 'Septembre' },
      { value: '10', label: isMobile ? 'Oct' : 'Octobre' },
      { value: '11', label: isMobile ? 'Nov' : 'Novembre' },
      { value: '12', label: isMobile ? 'Déc' : 'Décembre' }
    ], [isMobile]);

    // Options des années
    const yearOptions = useMemo(() => 
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
        value: (minYear + i).toString(),
        label: (minYear + i).toString()
      })), [minYear, maxYear]
    );

    // Validation de date pour éviter les dates impossibles
    const isValidDate = (day: number, month: number, year: number) => {
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && 
             date.getMonth() === month - 1 && 
             date.getDate() === day;
    };

    const handleDateChange = (field: 'day' | 'month' | 'year', newValue: string) => {
      const currentDay = value ? value.getDate() : 1;
      const currentMonth = value ? value.getMonth() + 1 : 1;
      const currentYear = value ? value.getFullYear() : currentYear;

      let newDay = currentDay;
      let newMonth = currentMonth;
      let newYear = currentYear;

      switch (field) {
        case 'day':
          newDay = parseInt(newValue);
          break;
        case 'month':
          newMonth = parseInt(newValue);
          break;
        case 'year':
          newYear = parseInt(newValue);
          break;
      }

      // Validation et ajustement pour dates impossibles
      if (!isValidDate(newDay, newMonth, newYear)) {
        // Ajuster le jour au dernier jour valide du mois
        const lastDayOfMonth = new Date(newYear, newMonth, 0).getDate();
        if (newDay > lastDayOfMonth) {
          newDay = lastDayOfMonth;
        }
      }

      const newDate = new Date(newYear, newMonth - 1, newDay);
      
      // Vérifier les contraintes min/max
      if (minDate && newDate < minDate) return;
      if (maxDate && newDate > maxDate) return;

      onChange(newDate);
    };

    const selectorWidth = isMobile ? "w-20" : isTablet ? "w-24" : "w-28";
    const monthSelectorWidth = isMobile ? "w-20" : isTablet ? "w-32" : "w-36";

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label className="flex items-center text-base font-medium text-thai-green">
            <Calendar className="mr-2 h-4 w-4 text-thai-orange" />
            {label}
            {required && <span className="text-thai-red ml-1">*</span>}
          </Label>
        )}
        
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col space-y-2" : "flex-row"
        )}>
          {/* Sélecteur de jour */}
          <Select
            value={value ? value.getDate().toString().padStart(2, '0') : ''}
            onValueChange={(val) => handleDateChange('day', val)}
            disabled={disabled}
          >
            <SelectTrigger className={cn(
              selectorWidth, 
              "text-center [&>span]:text-center",
              isMobile && "w-full"
            )}>
              <SelectValue placeholder={placeholder.day} />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="justify-center"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sélecteur de mois */}
          <Select
            value={value ? (value.getMonth() + 1).toString().padStart(2, '0') : ''}
            onValueChange={(val) => handleDateChange('month', val)}
            disabled={disabled}
          >
            <SelectTrigger className={cn(
              monthSelectorWidth,
              "text-center [&>span]:text-center [&>span]:w-full [&>span]:block",
              isMobile && "w-full"
            )}>
              <SelectValue placeholder={placeholder.month} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="justify-center"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sélecteur d'année */}
          <Select
            value={value ? value.getFullYear().toString() : ''}
            onValueChange={(val) => handleDateChange('year', val)}
            disabled={disabled}
          >
            <SelectTrigger className={cn(
              selectorWidth,
              "text-center [&>span]:text-center",
              isMobile && "w-full"
            )}>
              <SelectValue placeholder={placeholder.year} />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="justify-center"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Indication de la date sélectionnée */}
        {value && (
          <p className="text-xs text-thai-green/70 mt-1">
            📅 {value.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>
    );
  }
);

ResponsiveDateSelector.displayName = 'ResponsiveDateSelector';
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateSelectorProps {
  /** Date actuelle sélectionnée (peut être undefined) */
  value: Date | undefined;
  /** Callback appelé quand la date change */
  onChange: (date: Date | undefined) => void;
  /** Largeur du composant (défaut: "auto") */
  className?: string;
}

/**
 * Composant réutilisable pour sélectionner une date
 * avec 3 selects : Jour, Mois, Année
 * Version compacte sans label pour l'interface admin
 */
export function DateSelector({
  value,
  onChange,
  className = '',
}: DateSelectorProps) {
  const handleDayChange = (day: string) => {
    if (value) {
      const newDate = new Date(value);
      newDate.setDate(parseInt(day));
      // Vérifier si la date est valide après modification
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else {
      const currentYear = new Date().getFullYear();
      onChange(new Date(currentYear, 0, parseInt(day)));
    }
  };

  const handleMonthChange = (month: string) => {
    if (value) {
      const newDate = new Date(value);
      newDate.setMonth(parseInt(month) - 1);
      // Vérifier si la date est valide après modification
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else {
      const currentYear = new Date().getFullYear();
      onChange(new Date(currentYear, parseInt(month) - 1, 1));
    }
  };

  const handleYearChange = (year: string) => {
    if (value) {
      const newDate = new Date(value);
      newDate.setFullYear(parseInt(year));
      // Vérifier si la date est valide après modification
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else {
      onChange(new Date(parseInt(year), 0, 1));
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Select JOUR */}
      <Select
        value={value ? value.getDate().toString().padStart(2, '0') : ''}
        onValueChange={handleDayChange}
      >
        <SelectTrigger className="w-20 text-center [&>span]:text-center">
          <SelectValue placeholder="J" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <SelectItem
              key={day}
              value={day.toString().padStart(2, '0')}
              className="justify-center"
            >
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select MOIS */}
      <Select
        value={
          value ? (value.getMonth() + 1).toString().padStart(2, '0') : ''
        }
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-28 text-center [&>span]:text-center [&>span]:w-full [&>span]:block">
          <SelectValue placeholder="Mois" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="01" className="justify-center">
            Janvier
          </SelectItem>
          <SelectItem value="02" className="justify-center">
            Février
          </SelectItem>
          <SelectItem value="03" className="justify-center">
            Mars
          </SelectItem>
          <SelectItem value="04" className="justify-center">
            Avril
          </SelectItem>
          <SelectItem value="05" className="justify-center">
            Mai
          </SelectItem>
          <SelectItem value="06" className="justify-center">
            Juin
          </SelectItem>
          <SelectItem value="07" className="justify-center">
            Juillet
          </SelectItem>
          <SelectItem value="08" className="justify-center">
            Août
          </SelectItem>
          <SelectItem value="09" className="justify-center">
            Septembre
          </SelectItem>
          <SelectItem value="10" className="justify-center">
            Octobre
          </SelectItem>
          <SelectItem value="11" className="justify-center">
            Novembre
          </SelectItem>
          <SelectItem value="12" className="justify-center">
            Décembre
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Select ANNÉE */}
      <Select
        value={value ? value.getFullYear().toString() : ''}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-24 text-center [&>span]:text-center">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(
            { length: 10 }, // 10 ans (année actuelle - 5 à +5)
            (_, i) => new Date().getFullYear() - 5 + i
          ).map(year => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="justify-center"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

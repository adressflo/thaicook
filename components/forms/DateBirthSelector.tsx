'use client';

import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateBirthSelectorProps {
  /** Date actuelle sélectionnée (peut être undefined) */
  value: Date | undefined;
  /** Callback appelé quand la date change */
  onChange: (date: Date | undefined) => void;
  /** Afficher le label avec icône (défaut: true) */
  showLabel?: boolean;
  /** Texte du label (défaut: "Date de naissance") */
  labelText?: string;
  /** Afficher le texte d'aide en bas (défaut: true) */
  showHelperText?: boolean;
  /** Texte d'aide personnalisé */
  helperText?: string;
}

/**
 * Composant réutilisable pour sélectionner une date de naissance
 * avec 3 selects : Jour, Mois, Année
 */
export function DateBirthSelector({
  value,
  onChange,
  showLabel = true,
  labelText = 'Date de naissance',
  showHelperText = true,
  helperText = 'Sélectionnez votre jour, mois et année de naissance dans les menus déroulants ci-dessus.',
}: DateBirthSelectorProps) {
  const handleDayChange = (day: string) => {
    if (value) {
      const newDate = new Date(value);
      newDate.setDate(parseInt(day));
      // Vérifier si la date est valide après modification
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else {
      onChange(new Date(1990, 0, parseInt(day)));
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
      onChange(new Date(1990, parseInt(month) - 1, 1));
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
    <div className="space-y-2">
      {showLabel && (
        <Label className="flex items-center gap-2 text-thai-green font-medium">
          <Calendar className="h-4 w-4" />
          {labelText}
        </Label>
      )}

      <div className="flex gap-2">
        {/* Select JOUR */}
        <Select
          value={
            value ? value.getDate().toString().padStart(2, '0') : ''
          }
          onValueChange={handleDayChange}
        >
          <SelectTrigger className="w-28 text-center [&>span]:text-center">
            <SelectValue placeholder="Jour" />
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
            value
              ? (value.getMonth() + 1).toString().padStart(2, '0')
              : ''
          }
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-36 text-center [&>span]:text-center [&>span]:w-full [&>span]:block">
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
          <SelectTrigger className="w-28 text-center [&>span]:text-center">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: new Date().getFullYear() - 1900 + 1 },
              (_, i) => new Date().getFullYear() - i
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

      {showHelperText && (
        <p className="text-sm text-gray-600 mt-2">{helperText}</p>
      )}
    </div>
  );
}

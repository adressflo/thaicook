import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarIconProps {
  date: Date;
  className?: string;
}

export const CalendarIcon = React.memo<CalendarIconProps>(({ date, className = "" }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const dayNumber = format(date, 'd');
  const monthName = format(date, 'MMM', { locale: fr }).toLowerCase().substring(0, 4);
  const dayName = format(date, 'EEE', { locale: fr }).toUpperCase().substring(0, 3);
  const timeString = format(date, 'HH:mm');
  
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Calendar body */}
      <div 
        className={`bg-white border-2 border-thai-orange rounded-lg shadow-md transition-all duration-300 cursor-pointer w-[90px] ${
          isHovered ? 'shadow-xl scale-105 -translate-y-1' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Calendar header - Day name */}
        <div className={`py-1.5 rounded-t-md text-xs font-bold text-center transition-all duration-300 ${
          isHovered 
            ? 'bg-gradient-to-r from-thai-orange/90 to-thai-gold text-white' 
            : 'bg-gradient-to-r from-thai-orange to-thai-orange/90 text-white'
        }`}>
          {dayName}
        </div>
        
        {/* Calendar body */}
        <div className="px-3 py-2 text-center bg-gradient-to-b from-white to-thai-cream/30">
          {/* Day number - Plus grand et centré */}
          <div className={`text-3xl font-bold transition-all duration-300 leading-none mb-1 ${
            isHovered ? 'text-thai-orange scale-110' : 'text-thai-green'
          }`}>
            {dayNumber}
          </div>
          
          {/* Month name - Plus petit */}
          <div className={`text-[10px] font-medium transition-colors duration-300 mb-1 leading-none ${
            isHovered ? 'text-thai-green' : 'text-gray-600'
          }`}>
            {monthName}
          </div>
          
          {/* Time - Compact */}
          <div className={`text-[10px] font-bold text-white transition-colors duration-300 rounded px-2 py-0.5 leading-none ${
            isHovered ? 'bg-thai-gold' : 'bg-thai-orange'
          }`}>
            {timeString}
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-thai-orange/20 to-thai-gold/20 transition-opacity duration-300 -z-10 blur-sm scale-110 ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
});

CalendarIcon.displayName = 'CalendarIcon';
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center pt-1 pb-3",
        caption_label: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-thai-orange hover:bg-thai-orange/10 rounded-md border border-thai-orange/30 hover:border-thai-orange",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-thai-green rounded-md w-9 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative h-9 w-9 hover:bg-thai-orange/10 focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal hover:bg-thai-orange hover:text-white rounded-md transition-all",
        day_selected: "bg-thai-orange text-white hover:bg-thai-orange/90 focus:bg-thai-orange focus:text-white rounded-md",
        day_today: "bg-thai-cream text-thai-orange font-bold border-2 border-thai-orange rounded-md",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => {
          const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
          ];
          
          return (
            <div className="flex justify-between items-center py-2">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(displayMonth);
                  prev.setMonth(prev.getMonth() - 1);
                  props.onMonthChange?.(prev);
                }}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-thai-orange hover:bg-thai-orange/10 rounded-md border border-thai-orange/30 hover:border-thai-orange"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <Select
                value={displayMonth.getMonth().toString()}
                onValueChange={(value) => {
                  const newMonth = new Date(displayMonth);
                  newMonth.setMonth(parseInt(value));
                  props.onMonthChange?.(newMonth);
                }}
              >
                <SelectTrigger className="w-auto border-0 text-lg font-bold text-thai-green hover:bg-thai-orange/10">
                  <SelectValue>{months[displayMonth.getMonth()]} {displayMonth.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <button
                type="button"
                onClick={() => {
                  const next = new Date(displayMonth);
                  next.setMonth(next.getMonth() + 1);
                  props.onMonthChange?.(next);
                }}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-thai-orange hover:bg-thai-orange/10 rounded-md border border-thai-orange/30 hover:border-thai-orange"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
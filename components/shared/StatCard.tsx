import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
  trendUp?: boolean // true = vert, false = rouge
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="text-thai-orange h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-thai-green text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trendUp === true ? "text-green-600" : trendUp === false ? "text-red-500" : ""
                )}
              >
                {trend}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

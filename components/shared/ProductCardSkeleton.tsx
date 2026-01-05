import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      {/* Image Skeleton */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-200">
        <Skeleton className="h-full w-full" />
        {/* Badge Position Skeleton */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      <CardContent className="flex grow flex-col space-y-3 p-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Badges Skeleton */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>

        {/* Footer Actions Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

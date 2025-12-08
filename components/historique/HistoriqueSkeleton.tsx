import { Skeleton } from "@/components/ui/skeleton"

export function HistoriqueSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="bg-thai-cream/30 border-thai-orange/20 grid h-12 w-full grid-cols-1 gap-4 rounded-lg border px-4 py-3 md:grid-cols-5">
        <Skeleton className="h-full w-full opacity-50" />
      </div>

      {/* Rows Skeleton */}
      <div className="border-thai-orange/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex min-h-16 items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-4"
          >
            <div className="grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-5">
              {/* Date */}
              <div className="flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Main Content (Dishes/Events) */}
              <div className="flex flex-col items-center justify-center md:col-span-2">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>

              {/* Amount/Count */}
              <div className="flex items-center justify-center md:-ml-12">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-center justify-center gap-3 md:-ml-8">
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

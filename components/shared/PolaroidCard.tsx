import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { cn } from "@/lib/utils"

interface PolaroidCardProps {
  title?: string
  description?: string
  children?: React.ReactNode
  photoSrc: string
  photoAlt: string
  photoCaption?: string
  photoRotation?: number
  photoSize?: number
  className?: string
}

export function PolaroidCard({
  title,
  description,
  children,
  photoSrc,
  photoAlt,
  photoCaption,
  photoRotation = -6,
  photoSize = 140,
  className,
}: PolaroidCardProps) {
  return (
    <Card
      className={cn(
        "bg-thai-cream/10 border-thai-orange/20 relative min-h-[320px] overflow-visible",
        className
      )}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-thai-orange">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      <PolaroidPhoto
        src={photoSrc}
        alt={photoAlt}
        caption={photoCaption}
        position="center"
        size={photoSize}
        rotation={photoRotation}
        className="bottom-8"
      />
    </Card>
  )
}

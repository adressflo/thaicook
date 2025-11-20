import { motion } from "framer-motion"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ChanthanaAvatarProps {
  className?: string
}

export function ChanthanaAvatar({ className }: ChanthanaAvatarProps) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "pointer-events-none fixed z-40",
        isMobile ? "top-20 right-2 h-24 w-24" : "bottom-0 left-0 h-80 w-64 xl:h-96 xl:w-80",
        className
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src="/chanthana.svg"
          alt="Chanthana prend votre commande"
          fill
          className="object-contain object-bottom"
          priority
        />

        {/* Bulle de dialogue optionnelle - visible au chargement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className={cn(
            "border-thai-orange absolute rounded-2xl border-2 bg-white p-3 shadow-xl",
            isMobile
              ? "top-full right-0 mt-2 w-32 text-[10px]"
              : "top-10 right-[-60px] w-40 text-xs"
          )}
        >
          <div className="text-thai-green relative text-center font-medium">
            <span className="mb-1 block">Sawadee kha ! 🙏</span>
            Je prends votre commande.
            {/* Triangle de la bulle */}
            <div
              className={cn(
                "border-thai-orange absolute h-3 w-3 rotate-45 transform border-t-2 border-l-2 bg-white",
                isMobile
                  ? "-top-2 right-4 border-r-0 border-b-0 bg-white"
                  : "bottom-4 -left-2 border-t-0 border-r-0 border-b-2 border-l-2"
              )}
              style={{
                [isMobile ? "top" : "left"]: isMobile ? "-7px" : "-7px",
                backgroundColor: "white",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

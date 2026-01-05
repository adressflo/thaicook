"use client"

import { CartItemCard } from "@/components/shared/CartItemCard"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { ProductCard } from "@/components/shared/ProductCard"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

type PreviewMode = "desktop" | "tablet" | "mobile"

function PreviewContent() {
  const searchParams = useSearchParams()

  // Props du composant depuis URL
  const component = searchParams.get("component") || "CartItemCard"
  const name = searchParams.get("name") || "Exemple"
  const imageUrl = searchParams.get("imageUrl") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const quantity = parseInt(searchParams.get("quantity") || "1")
  const isVegetarian = searchParams.get("isVegetarian") === "true"
  const readOnly = searchParams.get("readOnly") === "true"
  const imageAspectRatio = (searchParams.get("imageAspectRatio") || "square") as
    | "square"
    | "video"
    | "auto"
    | "square-contain"
    | "video-contain"
  const imageZoom = parseFloat(searchParams.get("imageZoom") || "1")

  // State LOCAL pour mode et taille (autonome)
  const [mode, setMode] = useState<PreviewMode>("mobile")
  const [mobileWidth, setMobileWidth] = useState(375)
  const [tabletWidth, setTabletWidth] = useState(768)

  const isDevice = mode !== "desktop"
  const currentWidth = mode === "mobile" ? mobileWidth : tabletWidth

  const renderComponent = () => {
    switch (component) {
      case "CartItemCard":
        return (
          <CartItemCard
            name={name}
            imageUrl={imageUrl}
            unitPrice={price}
            quantity={quantity}
            isVegetarian={isVegetarian}
            readOnly={readOnly}
            imageAspectRatio={imageAspectRatio}
            imageZoom={imageZoom}
            onQuantityChange={() => {}}
            onRemove={() => {}}
          />
        )
      case "ProductCard":
        return (
          <ProductCard
            title={name}
            price={price}
            description="Description du produit"
            imageSrc={imageUrl}
            isVegetarian={false}
            isSpicy={false}
            quantityInCart={0}
            onAdd={() => {}}
          />
        )
      case "PolaroidPhoto":
        return <PolaroidPhoto src={imageUrl || "/placeholder.jpg"} alt={name} />
      case "StatCard":
        return <StatCard title={name} value={String(price)} icon={ShoppingCart} />
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <span className="mb-2 text-4xl">❓</span>
            <p className="font-medium">Composant inconnu</p>
            <p className="text-sm">{component}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-linear-to-br from-gray-100 to-gray-200 p-4">
      {/* Header avec Toggle Desktop/Tablette/Mobile */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant={mode === "desktop" ? "default" : "outline"}
          onClick={() => setMode("desktop")}
          className={cn(
            mode === "desktop"
              ? "bg-thai-green hover:bg-thai-green/90"
              : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
          )}
        >
          🖥️ Desktop
        </Button>
        <Button
          size="sm"
          variant={mode === "tablet" ? "default" : "outline"}
          onClick={() => setMode("tablet")}
          className={cn(
            mode === "tablet"
              ? "bg-thai-green hover:bg-thai-green/90"
              : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
          )}
        >
          📱 Tablette
        </Button>
        <Button
          size="sm"
          variant={mode === "mobile" ? "default" : "outline"}
          onClick={() => setMode("mobile")}
          className={cn(
            mode === "mobile"
              ? "bg-thai-green hover:bg-thai-green/90"
              : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
          )}
        >
          📱 Mobile
        </Button>
      </div>

      {/* Badges info */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="bg-thai-green rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
          {isDevice ? `${currentWidth}px` : "100%"}
        </span>
        <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-white shadow-md">
          {component}
        </span>
      </div>

      {/* Container principal avec slider à gauche */}
      <div className="flex flex-1 items-stretch justify-center gap-4">
        {/* Slider vertical (si device) */}
        {isDevice && (
          <div className="flex flex-col items-center gap-2 py-2">
            {/* Valeur en haut */}
            <span className="text-thai-green text-xs font-bold whitespace-nowrap">
              {currentWidth}px
            </span>

            {/* Slider vertical */}
            <div className="relative flex min-h-[200px] flex-1 items-center justify-center">
              <input
                type="range"
                min={mode === "mobile" ? 240 : 480}
                max={mode === "mobile" ? 430 : 1024}
                value={currentWidth}
                onChange={(e) => {
                  const w = parseInt(e.target.value)
                  if (mode === "mobile") {
                    setMobileWidth(w)
                  } else {
                    setTabletWidth(w)
                  }
                }}
                className="accent-thai-green h-2 cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  width: "200px",
                  height: "8px",
                }}
              />
            </div>

            {/* Presets verticaux */}
            <div className="flex flex-col gap-1">
              {mode === "mobile" ? (
                <>
                  <Button
                    size="sm"
                    variant={mobileWidth === 280 ? "default" : "outline"}
                    onClick={() => setMobileWidth(280)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 280
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    280
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 320 ? "default" : "outline"}
                    onClick={() => setMobileWidth(320)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 320
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    SE
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 375 ? "default" : "outline"}
                    onClick={() => setMobileWidth(375)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 375
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    12
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 390 ? "default" : "outline"}
                    onClick={() => setMobileWidth(390)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 390
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    14
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 414 ? "default" : "outline"}
                    onClick={() => setMobileWidth(414)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 414
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Plus
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant={tabletWidth === 600 ? "default" : "outline"}
                    onClick={() => setTabletWidth(600)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 600
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    600
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 768 ? "default" : "outline"}
                    onClick={() => setTabletWidth(768)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 768
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Mini
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 820 ? "default" : "outline"}
                    onClick={() => setTabletWidth(820)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 820
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Air
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 1024 ? "default" : "outline"}
                    onClick={() => setTabletWidth(1024)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 1024
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Pro
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Device Frame ou Desktop */}
        <div
          className={cn(
            "transition-all duration-300",
            isDevice && "rounded-4xl bg-gray-800 p-2 shadow-2xl"
          )}
          style={isDevice ? { width: currentWidth + 16 } : { width: "100%", maxWidth: "1200px" }}
        >
          {/* Notch (Mobile) */}
          {mode === "mobile" && (
            <div className="mb-1 flex justify-center">
              <div className="relative h-3 w-16 rounded-b-lg bg-gray-800">
                <div className="absolute top-0.5 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-black" />
              </div>
            </div>
          )}

          {/* Camera (Tablet) */}
          {mode === "tablet" && (
            <div className="mb-1 flex justify-center">
              <div className="h-2 w-2 rounded-full bg-gray-600" />
            </div>
          )}

          {/* Screen */}
          <div
            className={cn("overflow-auto bg-white", isDevice && "rounded-3xl")}
            style={
              isDevice
                ? {
                    width: currentWidth,
                    minHeight: 400,
                    maxHeight: 600,
                  }
                : undefined
            }
          >
            <div className="p-0">{renderComponent()}</div>
          </div>

          {/* Home Bar */}
          {isDevice && (
            <div className="mt-2 flex justify-center">
              <div
                className="h-1 rounded-full bg-white/80"
                style={{ width: mode === "mobile" ? 100 : 120 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-center text-xs text-gray-500">
        <span className="text-thai-green font-semibold">Page autonome</span> - Changez de mode et de
        taille librement
      </p>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="text-gray-500">Chargement de la preview...</div>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  )
}

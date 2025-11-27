"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { ProductCard } from "@/components/shared/ProductCard"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const imageAspectRatio = (searchParams.get("imageAspectRatio") || "square") as "square" | "video" | "auto" | "square-contain" | "video-contain"
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
            id={1}
            nom={name}
            prix={String(price)}
            description="Description du produit"
            image={imageUrl}
            categorie="Plats"
            disponible={true}
          />
        )
      case "PolaroidPhoto":
        return (
          <PolaroidPhoto
            src={imageUrl || "/placeholder.jpg"}
            alt={name}
            caption={name}
          />
        )
      case "StatCard":
        return (
          <StatCard
            title={name}
            value={String(price)}
            icon="TrendingUp"
          />
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <span className="text-4xl mb-2">❓</span>
            <p className="font-medium">Composant inconnu</p>
            <p className="text-sm">{component}</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center p-4">
      {/* Header avec Toggle Desktop/Tablette/Mobile */}
      <div className="flex items-center justify-center gap-2 mb-4">
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="bg-thai-green text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {isDevice ? `${currentWidth}px` : "100%"}
        </span>
        <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {component}
        </span>
      </div>

      {/* Container principal avec slider à gauche */}
      <div className="flex gap-4 justify-center items-stretch flex-1">
        {/* Slider vertical (si device) */}
        {isDevice && (
          <div className="flex flex-col items-center gap-2 py-2">
            {/* Valeur en haut */}
            <span className="text-xs font-bold text-thai-green whitespace-nowrap">
              {currentWidth}px
            </span>

            {/* Slider vertical */}
            <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
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
                className="h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-thai-green"
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
            isDevice && "bg-gray-800 rounded-[2rem] p-2 shadow-2xl"
          )}
          style={isDevice ? { width: currentWidth + 16 } : { width: "100%", maxWidth: "1200px" }}
        >
          {/* Notch (Mobile) */}
          {mode === "mobile" && (
            <div className="flex justify-center mb-1">
              <div className="w-16 h-3 bg-gray-800 rounded-b-lg relative">
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-black" />
              </div>
            </div>
          )}

          {/* Camera (Tablet) */}
          {mode === "tablet" && (
            <div className="flex justify-center mb-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Screen */}
          <div
            className={cn(
              "bg-white overflow-auto",
              isDevice && "rounded-[1.5rem]"
            )}
            style={isDevice ? {
              width: currentWidth,
              minHeight: 400,
              maxHeight: 600
            } : undefined}
          >
            <div className="p-0">
              {renderComponent()}
            </div>
          </div>

          {/* Home Bar */}
          {isDevice && (
            <div className="flex justify-center mt-2">
              <div
                className="h-1 bg-white/80 rounded-full"
                style={{ width: mode === "mobile" ? 100 : 120 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        <span className="text-thai-green font-semibold">Page autonome</span> - Changez de mode et de taille librement
      </p>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Chargement de la preview...</div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}

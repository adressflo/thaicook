"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PreviewMode = "desktop" | "tablet" | "mobile"

function PreviewContainer() {
  const searchParams = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // State LOCAL pour mode et taille (autonome)
  const [mode, setMode] = useState<PreviewMode>("mobile")
  const [mobileWidth, setMobileWidth] = useState(375)
  const [tabletWidth, setTabletWidth] = useState(768)
  const [mobileHeight, setMobileHeight] = useState(667)
  const [tabletHeight, setTabletHeight] = useState(1024)
  const [refreshKey, setRefreshKey] = useState(0)

  const isDevice = mode !== "desktop"
  const currentWidth = mode === "mobile" ? mobileWidth : tabletWidth
  const currentHeight = mode === "mobile" ? mobileHeight : tabletHeight

  // URL de l'iframe avec les paramètres initiaux
  const iframeUrl = `/preview/render?${searchParams.toString()}`

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      {/* Header - Tous les contrôles sur une ligne */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
        {/* Toggle Desktop/Tablette/Mobile */}
        <Button
          size="sm"
          variant={mode === "desktop" ? "default" : "outline"}
          onClick={() => setMode("desktop")}
          className={cn(
            "h-7",
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
            "h-7",
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
            "h-7",
            mode === "mobile"
              ? "bg-thai-green hover:bg-thai-green/90"
              : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
          )}
        >
          📱 Mobile
        </Button>

        {/* Séparateur */}
        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Badges info */}
        <span className="bg-thai-green rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
          {mode === "mobile"
            ? `${mobileWidth}x${mobileHeight}`
            : mode === "tablet"
              ? `${tabletWidth}x${tabletHeight}`
              : "100%"}
        </span>

        {/* Séparateur */}
        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Bouton Rafraîchir */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="border-thai-orange/50 text-thai-orange hover:bg-thai-orange h-6 px-2 text-xs hover:text-white"
          title="Rafraîchir le composant"
        >
          🔄
        </Button>

        {/* Presets de taille (si device) */}
        {isDevice && (
          <>
            <div className="mx-1 h-5 w-px bg-gray-300" />
            {mode === "mobile" ? (
              <>
                {[
                  { label: "XS", width: 320 },
                  { label: "S", width: 360 },
                  { label: "M", width: 375 },
                  { label: "L", width: 390 },
                  { label: "XL", width: 414 },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    size="sm"
                    variant={mobileWidth === preset.width ? "default" : "outline"}
                    onClick={() => setMobileWidth(preset.width)}
                    className={cn(
                      "h-6 px-2 text-[10px]",
                      mobileWidth === preset.width
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                    title={`${preset.width}px`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: "S", width: 600 },
                  { label: "M", width: 768 },
                  { label: "L", width: 820 },
                  { label: "XL", width: 1024 },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    size="sm"
                    variant={tabletWidth === preset.width ? "default" : "outline"}
                    onClick={() => setTabletWidth(preset.width)}
                    className={cn(
                      "h-6 px-2 text-[10px]",
                      tabletWidth === preset.width
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                    title={`${preset.width}px`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Sliders horizontaux (si device) */}
      {isDevice && (
        <div className="mb-4 flex w-full max-w-md flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          {/* Slider Largeur */}
          <div className="flex items-center gap-2">
            <span className="w-6 text-[10px] text-gray-500">W</span>
            <span className="w-8 text-[10px] text-gray-400">
              {mode === "mobile" ? "240" : "480"}
            </span>
            <input
              type="range"
              min={mode === "mobile" ? 240 : 480}
              max={mode === "mobile" ? 480 : 1024}
              value={currentWidth}
              onChange={(e) => {
                const w = parseInt(e.target.value)
                if (mode === "mobile") {
                  setMobileWidth(w)
                } else {
                  setTabletWidth(w)
                }
              }}
              className="accent-thai-green h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <span className="w-8 text-right text-[10px] text-gray-400">
              {mode === "mobile" ? "480" : "1024"}
            </span>
            <span className="text-thai-green w-10 text-right text-[10px] font-semibold">
              {currentWidth}
            </span>
          </div>
          {/* Slider Hauteur */}
          <div className="flex items-center gap-2">
            <span className="w-6 text-[10px] text-gray-500">H</span>
            <span className="w-8 text-[10px] text-gray-400">
              {mode === "mobile" ? "480" : "600"}
            </span>
            <input
              type="range"
              min={mode === "mobile" ? 480 : 600}
              max={mode === "mobile" ? 926 : 1366}
              value={currentHeight}
              onChange={(e) => {
                const h = parseInt(e.target.value)
                if (mode === "mobile") {
                  setMobileHeight(h)
                } else {
                  setTabletHeight(h)
                }
              }}
              className="accent-thai-orange h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <span className="w-8 text-right text-[10px] text-gray-400">
              {mode === "mobile" ? "926" : "1366"}
            </span>
            <span className="text-thai-orange w-10 text-right text-[10px] font-semibold">
              {currentHeight}
            </span>
          </div>
        </div>
      )}

      {/* Container du device */}
      <div className="flex w-full flex-1 items-start justify-center overflow-auto">
        {/* Device Frame - tous les modes ont un cadre */}
        <div
          className={cn(
            "relative bg-gray-800 shadow-2xl transition-all duration-300",
            mode === "mobile" && "rounded-[2.5rem] border-4 border-gray-900 p-3",
            mode === "tablet" && "rounded-[2rem] border-4 border-gray-900 p-3",
            mode === "desktop" &&
              "h-full w-full max-w-[1400px] rounded-lg border border-gray-300 p-1"
          )}
          style={{
            width:
              mode === "desktop" ? "100%" : mode === "mobile" ? mobileWidth + 24 : tabletWidth + 24,
            height:
              mode === "desktop"
                ? "calc(100vh - 150px)"
                : mode === "mobile"
                  ? mobileHeight + 24
                  : tabletHeight + 24,
          }}
        >
          {/* Notch (Mobile) */}
          {mode === "mobile" && (
            <div className="absolute top-0 left-1/2 z-20 flex h-6 w-32 -translate-x-1/2 items-center justify-center rounded-b-xl bg-gray-900">
              <div className="h-1 w-16 rounded-full bg-gray-800"></div>
            </div>
          )}

          {/* Camera (Tablet) */}
          {mode === "tablet" && (
            <div className="absolute top-0 left-1/2 z-20 mt-1 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-700"></div>
          )}

          {/* Screen - IFRAME */}
          <div
            className={cn(
              "h-full w-full overflow-hidden bg-white",
              mode === "mobile" && "rounded-[2rem]",
              mode === "tablet" && "rounded-[1.5rem]",
              mode === "desktop" && "rounded"
            )}
          >
            <iframe
              key={refreshKey}
              ref={iframeRef}
              src={iframeUrl}
              className="h-full w-full border-0"
              title="Preview"
            />
          </div>

          {/* Home Bar (Mobile/Tablet) */}
          {(mode === "mobile" || mode === "tablet") && (
            <div className="absolute bottom-1 left-1/2 z-20 mb-1 h-1 w-32 -translate-x-1/2 rounded-full bg-gray-600"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-4">Chargement...</div>}>
      <PreviewContainer />
    </Suspense>
  )
}

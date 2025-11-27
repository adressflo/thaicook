"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { ProductCard } from "@/components/shared/ProductCard"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { StatCard } from "@/components/shared/StatCard"
import { Spice } from "@/components/shared/Spice"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

// Composant wrapper pour Suspense
function RenderContent() {
  const searchParams = useSearchParams()

  // État local pour les props (initialisé avec l'URL, mis à jour via BroadcastChannel)
  const [props, setProps] = useState<any>({
    component: searchParams.get("component") || "CartItemCard",
    name: searchParams.get("name") || "Exemple",
    imageUrl: searchParams.get("imageUrl") || "",
    price: parseFloat(searchParams.get("price") || "0"),
    quantity: parseInt(searchParams.get("quantity") || "1"),
    description: searchParams.get("description") || "",
    isVegetarian: searchParams.get("isVegetarian") === "true",
    readOnly: searchParams.get("readOnly") === "true",
    imageAspectRatio: (searchParams.get("imageAspectRatio") || "square") as
      | "square"
      | "video"
      | "auto"
      | "square-contain"
      | "video-contain",
    imageObjectPosition: (searchParams.get("imageObjectPosition") || "center") as
      | "center"
      | "top"
      | "bottom"
      | "left"
      | "right",
    imageZoom: parseFloat(searchParams.get("imageZoom") || "1"),
    showSpiceSelector: searchParams.get("showSpiceSelector") === "true",
    imageWidth: searchParams.get("imageWidth")
      ? parseInt(searchParams.get("imageWidth")!)
      : undefined,
    imageHeight: searchParams.get("imageHeight")
      ? parseInt(searchParams.get("imageHeight")!)
      : undefined,
    desktopImageWidth: searchParams.get("desktopImageWidth") || "w-24",
    customImageObjectPosition: searchParams.get("customImageObjectPosition") || undefined,
    // Props spécifiques Polaroid
    title: searchParams.get("title") || "",
    // description déjà définie plus haut
    titleColor: searchParams.get("titleColor") || "thai-green",
    scrollingText: searchParams.get("scrollingText") === "true",
    scrollDuration: parseInt(searchParams.get("scrollDuration") || "10"),
    position: searchParams.get("position") || "center",
    customX: searchParams.get("customX") || "50%",
    customY: searchParams.get("customY") || "50%",
    size: searchParams.get("size") || "md",
    customSize: parseInt(searchParams.get("customSize") || "150"),
    rotation: parseInt(searchParams.get("rotation") || "-3"),
    borderColor: searchParams.get("borderColor") || "thai-green",
    customBorderColor: searchParams.get("customBorderColor") || "",
    borderWidth:
      searchParams.get("borderWidth") === "custom"
        ? "custom"
        : parseInt(searchParams.get("borderWidth") || "1"),
    customBorderWidth: parseInt(searchParams.get("customBorderWidth") || "3"),
    animateBorder: searchParams.get("animateBorder") === "true",
    hoverScale: searchParams.get("hoverScale") !== "false", // Default true
  })

  // Écouter le canal de diffusion pour les mises à jour en temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")

    channel.onmessage = (event) => {
      if (event.data.type === "UPDATE_PROPS") {
        setProps((prev: any) => ({ ...prev, ...event.data.payload }))
      }
    }

    return () => {
      channel.close()
    }
  }, [])

  const renderComponent = () => {
    switch (props.component) {
      case "CartItemCard":
        return (
          <div className="p-4">
            <CartItemCard
              name={props.name}
              imageUrl={props.imageUrl}
              unitPrice={props.price}
              quantity={props.quantity}
              isVegetarian={props.isVegetarian}
              readOnly={props.readOnly}
              imageAspectRatio={props.imageAspectRatio}
              imageObjectPosition={props.imageObjectPosition}
              imageZoom={props.imageZoom}
              showSpiceSelector={props.showSpiceSelector}
              imageWidth={props.imageWidth}
              imageHeight={props.imageHeight}
              desktopImageWidth={props.desktopImageWidth}
              customImageObjectPosition={props.customImageObjectPosition}
              spiceSelectorSlot={<Spice distribution={[0, 0, 1, 0]} readOnly />}
              onQuantityChange={() => {}}
              onRemove={() => {}}
            />
          </div>
        )
      case "ProductCard":
        return (
          <div className="mx-auto max-w-sm p-4">
            <ProductCard
              title={props.name}
              price={props.price}
              description={props.description || "Description du produit"}
              imageSrc={props.imageUrl}
              isVegetarian={props.isVegetarian}
              quantityInCart={props.quantity}
            />
          </div>
        )
      case "PolaroidPhoto":
        return (
          <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
            <PolaroidPhoto
              src={props.imageUrl || "/placeholder.jpg"}
              alt={props.name}
              // Props spécifiques
              title={props.title}
              description={props.description}
              titleColor={props.titleColor}
              scrollingText={props.scrollingText}
              scrollDuration={props.scrollDuration}
              position={props.position}
              customX={props.customX}
              customY={props.customY}
              size={props.size}
              customSize={props.customSize}
              rotation={props.rotation}
              aspectRatio={props.imageAspectRatio}
              borderColor={props.borderColor}
              customBorderColor={props.customBorderColor}
              borderWidth={props.borderWidth}
              customBorderWidth={props.customBorderWidth}
              animateBorder={props.animateBorder}
              hoverScale={props.hoverScale}
            />
          </div>
        )
      case "StatCard":
        return (
          <div className="max-w-sm p-4">
            <StatCard title={props.name} value={String(props.price)} icon={TrendingUp} />
          </div>
        )
      default:
        return (
          <div className="flex h-screen flex-col items-center justify-center p-8 text-gray-500">
            <span className="mb-2 text-4xl">❓</span>
            <p className="font-medium">Composant inconnu</p>
            <p className="text-sm">{props.component}</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white" id="preview-root">
      <style jsx global>{`
        /* Masquer les éléments du layout principal qui polluent la preview */
        footer,
        nav,
        header,
        [class*="FloatingUserIcon"],
        [class*="OfflineIndicator"],
        [class*="OfflineBanner"],
        .fixed.bottom-4.right-4 {
          display: none !important;
        }

        /* Force le background blanc et reset le padding du body si nécessaire */
        body {
          background-color: white !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: auto !important; /* Laisser le scroll se faire dans l'iframe */
        }
      `}</style>
      {renderComponent()}
    </div>
  )
}

export default function RenderPage() {
  return (
    <Suspense fallback={<div className="p-4">Chargement...</div>}>
      <RenderContent />
    </Suspense>
  )
}

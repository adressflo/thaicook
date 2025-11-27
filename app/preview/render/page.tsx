"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { ProductCard } from "@/components/shared/ProductCard"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { StatCard } from "@/components/shared/StatCard"
import { Spice } from "@/components/shared/Spice"
import { SmartSpice } from "@/components/shared/SmartSpice"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import { Button } from "@/components/ui/button"

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
    // Props spécifiques Toaster
    variant: searchParams.get("variant") || "default",
    tilted: searchParams.get("tilted") === "true",
    tiltedAngle: parseInt(searchParams.get("tiltedAngle") || "-3"),
    duration: parseInt(searchParams.get("duration") || "5000"),
    shadowSize: searchParams.get("shadowSize") || "lg",
    maxWidth: searchParams.get("maxWidth") || "lg",
    titleFontWeight: searchParams.get("titleFontWeight") || "bold",
    descriptionColor: searchParams.get("descriptionColor") || "thai-green",
    descriptionFontWeight: searchParams.get("descriptionFontWeight") || "semibold",
    redirectUrl: searchParams.get("redirectUrl") || "",
    redirectBehavior: searchParams.get("redirectBehavior") || "auto",
    // Props spécifiques ToasterVideo
    media: searchParams.get("media") || "",
    aspectRatio: searchParams.get("aspectRatio") || "16:9",
    polaroid: searchParams.get("polaroid") === "true",
    playCount:
      searchParams.get("playCount") === "custom"
        ? "custom"
        : parseInt(searchParams.get("playCount") || "1"),
    customPlayCount: parseInt(searchParams.get("customPlayCount") || "3"),
    customDuration: parseInt(searchParams.get("customDuration") || "0"),
    showCloseButton: searchParams.get("showCloseButton") !== "false",
  })

  // État local pour la distribution des épices
  const [spiceDistribution, setSpiceDistribution] = useState<number[]>([0, 1, 1, 0])

  // Écouter le canal de diffusion pour les mises à jour en temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")

    channel.onmessage = (event) => {
      if (event.data.type === "UPDATE_PROPS") {
        setProps((prev: any) => {
          const newProps = { ...prev, ...event.data.payload }

          // Déclencher le toast automatiquement si on est sur le composant Toaster ou ToasterVideo
          if (newProps.component === "Toaster") {
            setTimeout(() => {
              toast({
                title: newProps.title,
                description: newProps.description,
                variant: newProps.variant,
                tilted: newProps.tilted ? newProps.tiltedAngle : false,
                duration: newProps.duration,
                borderColor: newProps.borderColor === "custom" ? "custom" : newProps.borderColor,
                customBorderColor:
                  newProps.borderColor === "custom" ? newProps.customBorderColor : undefined,
                borderWidth: newProps.borderWidth,
                customBorderWidth:
                  newProps.borderWidth === "custom" ? newProps.customBorderWidth : undefined,
                shadowSize: newProps.shadowSize,
                maxWidth: newProps.maxWidth,
                titleColor: newProps.titleColor,
                titleFontWeight: newProps.titleFontWeight,
                descriptionColor: newProps.descriptionColor,
                descriptionFontWeight: newProps.descriptionFontWeight,
                animateBorder: newProps.animateBorder,
                hoverScale: newProps.hoverScale,
                position: newProps.position,
                customX: newProps.position === "custom" ? newProps.customX : undefined,
                customY: newProps.position === "custom" ? newProps.customY : undefined,
                redirectUrl: newProps.redirectUrl || undefined,
                redirectBehavior: newProps.redirectUrl ? newProps.redirectBehavior : undefined,
              })
            }, 100)
          } else if (newProps.component === "ToasterVideo") {
            setTimeout(() => {
              toastVideo({
                title: newProps.title,
                description: newProps.description,
                media: newProps.media,
                position: newProps.position,
                customX: newProps.position === "custom" ? newProps.customX : undefined,
                customY: newProps.position === "custom" ? newProps.customY : undefined,
                aspectRatio: newProps.aspectRatio,
                polaroid: newProps.polaroid,
                scrollingText: newProps.scrollingText,
                scrollDuration: newProps.scrollDuration,
                borderColor: newProps.borderColor === "custom" ? "custom" : newProps.borderColor,
                customBorderColor:
                  newProps.borderColor === "custom" ? newProps.customBorderColor : undefined,
                borderWidth: newProps.borderWidth,
                customBorderWidth:
                  newProps.borderWidth === "custom" ? newProps.customBorderWidth : undefined,
                shadowSize: newProps.shadowSize,
                maxWidth: newProps.maxWidth,
                titleColor: newProps.titleColor,
                descriptionColor: newProps.descriptionColor,
                animateBorder: newProps.animateBorder,
                hoverScale: newProps.hoverScale,
                playCount: newProps.playCount,
                customPlayCount:
                  newProps.playCount === "custom" ? newProps.customPlayCount : undefined,
                customDuration: newProps.customDuration > 0 ? newProps.customDuration : undefined,
                redirectUrl: newProps.redirectUrl || undefined,
                redirectBehavior: newProps.redirectUrl ? newProps.redirectBehavior : undefined,
                showCloseButton: newProps.showCloseButton,
              })
            }, 100)
          }

          return newProps
        })
      }
    }

    return () => {
      channel.close()
    }
  }, [])

  // Déclenchement initial au montage si c'est un toast
  useEffect(() => {
    if (props.component === "Toaster") {
      setTimeout(() => {
        toast({
          title: props.title,
          description: props.description,
          variant: props.variant,
          tilted: props.tilted ? props.tiltedAngle : false,
          duration: props.duration,
          borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
          customBorderColor: props.borderColor === "custom" ? props.customBorderColor : undefined,
          borderWidth: props.borderWidth,
          customBorderWidth: props.borderWidth === "custom" ? props.customBorderWidth : undefined,
          shadowSize: props.shadowSize,
          maxWidth: props.maxWidth,
          titleColor: props.titleColor,
          titleFontWeight: props.titleFontWeight,
          descriptionColor: props.descriptionColor,
          descriptionFontWeight: props.descriptionFontWeight,
          animateBorder: props.animateBorder,
          hoverScale: props.hoverScale,
          position: props.position,
          customX: props.position === "custom" ? props.customX : undefined,
          customY: props.position === "custom" ? props.customY : undefined,
          redirectUrl: props.redirectUrl || undefined,
          redirectBehavior: props.redirectUrl ? props.redirectBehavior : undefined,
        })
      }, 500)
    } else if (props.component === "ToasterVideo") {
      setTimeout(() => {
        toastVideo({
          title: props.title,
          description: props.description,
          media: props.media,
          position: props.position,
          customX: props.position === "custom" ? props.customX : undefined,
          customY: props.position === "custom" ? props.customY : undefined,
          aspectRatio: props.aspectRatio,
          polaroid: props.polaroid,
          scrollingText: props.scrollingText,
          scrollDuration: props.scrollDuration,
          borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
          customBorderColor: props.borderColor === "custom" ? props.customBorderColor : undefined,
          borderWidth: props.borderWidth,
          customBorderWidth: props.borderWidth === "custom" ? props.customBorderWidth : undefined,
          shadowSize: props.shadowSize,
          maxWidth: props.maxWidth,
          titleColor: props.titleColor,
          descriptionColor: props.descriptionColor,
          animateBorder: props.animateBorder,
          hoverScale: props.hoverScale,
          playCount: props.playCount,
          customPlayCount: props.playCount === "custom" ? props.customPlayCount : undefined,
          customDuration: props.customDuration > 0 ? props.customDuration : undefined,
          redirectUrl: props.redirectUrl || undefined,
          redirectBehavior: props.redirectUrl ? props.redirectBehavior : undefined,
          showCloseButton: props.showCloseButton,
        })
      }, 500)
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
              spiceSelectorSlot={
                <SmartSpice
                  quantity={props.quantity}
                  distribution={spiceDistribution}
                  onDistributionChange={setSpiceDistribution}
                />
              }
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
      case "Toaster":
        return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
            <Button
              size="lg"
              onClick={() => {
                toast({
                  title: props.title,
                  description: props.description,
                  variant: props.variant,
                  tilted: props.tilted ? props.tiltedAngle : false,
                  duration: props.duration,
                  borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
                  customBorderColor:
                    props.borderColor === "custom" ? props.customBorderColor : undefined,
                  borderWidth: props.borderWidth,
                  customBorderWidth:
                    props.borderWidth === "custom" ? props.customBorderWidth : undefined,
                  shadowSize: props.shadowSize,
                  maxWidth: props.maxWidth,
                  titleColor: props.titleColor,
                  titleFontWeight: props.titleFontWeight,
                  descriptionColor: props.descriptionColor,
                  descriptionFontWeight: props.descriptionFontWeight,
                  animateBorder: props.animateBorder,
                  hoverScale: props.hoverScale,
                  position: props.position,
                  customX: props.position === "custom" ? props.customX : undefined,
                  customY: props.position === "custom" ? props.customY : undefined,
                  redirectUrl: props.redirectUrl || undefined,
                  redirectBehavior: props.redirectUrl ? props.redirectBehavior : undefined,
                })
              }}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Afficher le Toast
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Le toast s'affiche automatiquement lors des modifications.
            </p>
          </div>
        )
      case "ToasterVideo":
        return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
            <Button
              size="lg"
              onClick={() => {
                toastVideo({
                  title: props.title,
                  description: props.description,
                  media: props.media,
                  position: props.position,
                  customX: props.position === "custom" ? props.customX : undefined,
                  customY: props.position === "custom" ? props.customY : undefined,
                  aspectRatio: props.aspectRatio,
                  polaroid: props.polaroid,
                  scrollingText: props.scrollingText,
                  scrollDuration: props.scrollDuration,
                  borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
                  customBorderColor:
                    props.borderColor === "custom" ? props.customBorderColor : undefined,
                  borderWidth: props.borderWidth,
                  customBorderWidth:
                    props.borderWidth === "custom" ? props.customBorderWidth : undefined,
                  shadowSize: props.shadowSize,
                  maxWidth: props.maxWidth,
                  titleColor: props.titleColor,
                  descriptionColor: props.descriptionColor,
                  animateBorder: props.animateBorder,
                  hoverScale: props.hoverScale,
                  playCount: props.playCount,
                  customPlayCount: props.playCount === "custom" ? props.customPlayCount : undefined,
                  customDuration: props.customDuration > 0 ? props.customDuration : undefined,
                  redirectUrl: props.redirectUrl || undefined,
                  redirectBehavior: props.redirectUrl ? props.redirectBehavior : undefined,
                  showCloseButton: props.showCloseButton,
                })
              }}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Afficher le Toast Vidéo
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Le toast s'affiche automatiquement lors des modifications.
            </p>
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

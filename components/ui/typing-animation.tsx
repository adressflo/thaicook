"use client"

import { useEffect, useState, ReactNode, ReactElement } from "react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps {
  children: ReactNode
  duration?: number
  className?: string
  as?: React.ElementType
}

interface TextSegment {
  text: string
  className: string
}

export function TypingAnimation({
  children,
  duration = 30,
  className,
  as: Component = "span",
}: TypingAnimationProps) {
  const [displayedContent, setDisplayedContent] = useState<ReactNode[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [textSegments, setTextSegments] = useState<TextSegment[]>([])

  // Extraire les segments au montage
  useEffect(() => {
    const segments = extractTextSegments(children)
    setTextSegments(segments)
  }, [children])

  const totalLength = textSegments.reduce((sum, seg) => sum + seg.text.length, 0)

  useEffect(() => {
    if (currentIndex < totalLength) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, duration, totalLength])

  useEffect(() => {
    if (textSegments.length === 0) return

    const result: ReactNode[] = []
    let charCount = 0

    for (let i = 0; i < textSegments.length; i++) {
      const segment = textSegments[i]
      const visibleLength = Math.max(0, Math.min(segment.text.length, currentIndex - charCount))

      if (visibleLength > 0) {
        result.push(
          <span key={i} className={segment.className}>
            {segment.text.substring(0, visibleLength)}
          </span>
        )
      }

      charCount += segment.text.length

      if (charCount > currentIndex) break
    }

    setDisplayedContent(result)
  }, [currentIndex, textSegments])

  return (
    <Component className={cn("inline-block", className)}>
      {displayedContent}
      {currentIndex < totalLength && <span className="animate-pulse">|</span>}
    </Component>
  )
}

// Fonction helper pour extraire les segments de texte avec leurs classes
function extractTextSegments(node: ReactNode): TextSegment[] {
  const segments: TextSegment[] = []

  const traverse = (child: ReactNode, inheritedClassName = ""): void => {
    if (child === null || child === undefined) {
      return
    }

    if (typeof child === "string") {
      segments.push({ text: child, className: inheritedClassName })
      return
    }

    if (typeof child === "number") {
      segments.push({ text: String(child), className: inheritedClassName })
      return
    }

    if (Array.isArray(child)) {
      child.forEach((c) => traverse(c, inheritedClassName))
      return
    }

    // Vérifier si c'est un ReactElement
    if (typeof child === "object" && "props" in child) {
      const element = child as ReactElement
      const props = element.props as { className?: string; children?: ReactNode }
      // Combiner les classes (inherited + current)
      const combinedClassName = [inheritedClassName, props.className].filter(Boolean).join(" ")

      if (props.children !== undefined) {
        if (typeof props.children === "string" || typeof props.children === "number") {
          segments.push({ text: String(props.children), className: combinedClassName })
        } else if (Array.isArray(props.children)) {
          props.children.forEach((subChild) => traverse(subChild, combinedClassName))
        } else {
          traverse(props.children, combinedClassName)
        }
      }
    }
  }

  traverse(node)
  return segments
}

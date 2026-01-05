"use client"

import type {
  BorderColor,
  DescriptionColor,
  FontWeight,
  MaxWidth,
  RedirectBehavior,
  ShadowSize,
  TitleColor,
  ToastActionElement,
  ToastPosition,
  ToastProps,
} from "@/components/ui/toast"
import * as React from "react"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000 // 1 seconde pour laisser le temps à l'animation de sortie

type ToasterToastVideo = Omit<ToastProps, "title" | "description"> & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  media?: string // URL de l'image ou video
  position?: ToastPosition
  customX?: string // Position X custom (si position="custom")
  customY?: string // Position Y custom (si position="custom")
  scrollingText?: boolean
  scrollDuration?: number
  animateOut?: boolean
  mangaExplosion?: boolean
  polaroid?: boolean
  aspectRatio?: "16:9" | "4:5" | "1:1" | "auto"
  // Props de style
  borderColor?: BorderColor
  customBorderColor?: string
  borderWidth?: 1 | 2 | 4 | "custom"
  customBorderWidth?: number
  shadowSize?: ShadowSize
  maxWidth?: MaxWidth
  titleColor?: TitleColor
  titleFontWeight?: FontWeight
  descriptionColor?: DescriptionColor
  descriptionFontWeight?: FontWeight
  animateBorder?: boolean
  hoverScale?: boolean
  rotation?: boolean
  // Polaroid padding props
  polaroidPaddingSides?: number
  polaroidPaddingTop?: number
  polaroidPaddingBottom?: number
  // Animation typing
  typingAnimation?: boolean
  typingSpeed?: number
  // Synchronisation marquee avec vidéo
  scrollSyncWithVideo?: boolean // Si true, la durée du marquee = durée vidéo × playCount
  // Lecture video (remplace loopVideo)
  playCount?: 1 | 2 | "custom"
  customPlayCount?: number
  customDuration?: number
  // Redirection
  redirectUrl?: string
  redirectBehavior?: RedirectBehavior
  showCloseButton?: boolean
}

export type {
  BorderColor,
  DescriptionColor,
  FontWeight,
  MaxWidth,
  RedirectBehavior,
  ShadowSize,
  TitleColor,
  ToastPosition,
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToastVideo
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToastVideo>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToastVideo["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToastVideo["id"]
    }

interface State {
  toasts: ToasterToastVideo[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastVideo = Omit<ToasterToastVideo, "id">

function toastVideo({ ...props }: ToastVideo) {
  const id = genId()

  const update = (props: ToasterToastVideo) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToastVideo() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toastVideo,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

function toastVideoCenter(props: ToastVideo) {
  return toastVideo({ ...props, position: "center" })
}

export { toastVideo, toastVideoCenter, useToastVideo }

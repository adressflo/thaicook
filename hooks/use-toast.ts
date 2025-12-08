"use client"

import * as React from "react"

import type {
  BorderColor,
  DescriptionColor,
  FontWeight,
  MaxWidth,
  RedirectBehavior,
  ShadowSize,
  TitleColor,
  ToastActionElement,
  ToastExtendedProps,
  ToastPosition,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps &
  ToastExtendedProps & {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    /** Couleur du titre */
    titleColor?: TitleColor
    /** Poids de la police du titre */
    titleFontWeight?: FontWeight
    /** Couleur de la description */
    descriptionColor?: DescriptionColor
    /** Poids de la police de la description */
    descriptionFontWeight?: FontWeight
    /** Position du toast */
    position?: ToastPosition
    /** Position X custom (si position="custom") */
    customX?: string
    /** Position Y custom (si position="custom") */
    customY?: string
    /** Animation dactylographie (typing) */
    typingAnimation?: boolean
    /** Vitesse de l'animation typing (ms par caractère) */
    typingSpeed?: number
    /** Animation de sortie */
    animateOut?: boolean
    /** Texte défilant */
    scrollingText?: boolean
    /** Durée du défilement */
    scrollDuration?: number
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
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
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

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
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

type Toast = Omit<ToasterToast, "id">

// Valeurs par défaut pour tous les toasts de l'application
const DEFAULT_TOAST_OPTIONS: Partial<Toast> = {
  duration: 1500,
  borderColor: "thai-green",
  animateBorder: true,
  hoverScale: true,
  rotation: true,
  typingAnimation: true,
  typingSpeed: 10,
  mangaExplosion: true,
}

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Haptic Feedback for Toast
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    const isDestructive = props.variant === "destructive"
    try {
      // Pattern Error vs Pattern Success/Info
      navigator.vibrate(isDestructive ? [50, 100, 50, 100, 50] : [10, 30, 10])
    } catch (e) {
      // Ignore errors
    }
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...DEFAULT_TOAST_OPTIONS,
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

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { DEFAULT_TOAST_OPTIONS, toast, useToast }

"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { PhotoEditModal } from "@/components/ui/PhotoEditModal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, Edit3, ImageIcon, X } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

interface EditableFieldProps {
  value: any
  onSave: (newValue: any) => Promise<void>
  type?: "text" | "number" | "textarea" | "boolean" | "date" | "image" | "select"
  options?: { label: string; value: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
  displayClassName?: string
  editClassName?: string
  showEditIcon?: boolean
  multiline?: boolean
  validation?: (value: any) => boolean | string
  formatDisplay?: (value: any) => string
  parseValue?: (value: any) => any
}

export function EditableField({
  value,
  onSave,
  type = "text",
  options = [],
  placeholder,
  disabled = false,
  className = "",
  displayClassName = "",
  editClassName = "",
  showEditIcon = true,
  multiline = false,
  validation,
  formatDisplay,
  parseValue,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === "text" || type === "number") {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleStartEdit = () => {
    if (disabled) return
    if (type === "image") {
      setShowPhotoModal(true)
      return
    }
    setIsEditing(true)
    setError("")
    setEditValue(value)
  }

  const handleSave = async () => {
    if (isLoading) return

    let processedValue = parseValue ? parseValue(editValue) : editValue

    if (validation) {
      const validationResult = validation(processedValue)
      if (validationResult !== true) {
        setError(typeof validationResult === "string" ? validationResult : "Valeur invalide")
        return
      }
    }

    try {
      setSaving(true)
      setError("")
      await onSave(processedValue)
      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      setError("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value)
    setError("")
  }

  const handlePhotoSave = async (newImageUrl: string) => {
    try {
      setSaving(true)
      setError("")
      await onSave(newImageUrl)
      setShowPhotoModal(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image:", error)
      setError("Erreur lors de la sauvegarde de l'image")
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && type !== "textarea") {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  const renderDisplayValue = () => {
    if (formatDisplay) {
      return formatDisplay(value)
    }

    switch (type) {
      case "boolean":
        return value ? "Oui" : "Non"
      case "date":
        return value ? format(new Date(value), "PPP", { locale: fr }) : "Aucune date"
      case "number":
        return value?.toString() || "0"
      case "image":
        return value ? (
          <img
            src={value}
            alt="Image"
            className="border-thai-gold/30 h-32 w-32 rounded-lg border-2 object-cover shadow-sm transition-shadow hover:shadow-md"
          />
        ) : (
          <div className="from-thai-cream/20 to-thai-gold/10 border-thai-gold/30 hover:border-thai-gold/50 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed bg-linear-to-br transition-colors">
            <ImageIcon className="text-thai-gold/60 h-8 w-8" />
          </div>
        )
      case "select":
        const option = options.find((opt) => opt.value === value)
        return option?.label || value
      default:
        return value || placeholder || "Cliquez pour modifier"
    }
  }

  const renderEditField = () => {
    const commonProps = {
      ref: inputRef as any,
      value: editValue || "",
      onChange: (e: any) => setEditValue(e.target.value),
      onKeyDown: handleKeyDown,
      className: cn("w-full", editClassName),
      disabled: isLoading,
    }

    switch (type) {
      case "textarea":
        return <Textarea {...commonProps} placeholder={placeholder} rows={multiline ? 4 : 2} />

      case "number":
        return (
          <Input {...commonProps} type="number" step="0.01" min="0" placeholder={placeholder} />
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch checked={!!editValue} onCheckedChange={setEditValue} disabled={isLoading} />
            <span>{editValue ? "Oui" : "Non"}</span>
          </div>
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !editValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editValue
                  ? format(new Date(editValue), "PPP", { locale: fr })
                  : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editValue ? new Date(editValue) : undefined}
                onSelect={(date) => setEditValue(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "image":
        // Les images utilisent maintenant le modal PhotoEditModal
        return null

      case "select":
        return (
          <select {...commonProps} className={cn("rounded border px-2 py-1", editClassName)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      default:
        return <Input {...commonProps} type="text" placeholder={placeholder} />
    }
  }

  if (isEditing) {
    return (
      <div className={cn("space-y-2", className)}>
        {renderEditField()}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={handleSave} disabled={isLoading} className="h-7 px-2">
            {isLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-7 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-colors",
        type === "image" ? "" : "rounded px-2 py-1 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-50",
        displayClassName,
        className
      )}
      onClick={handleStartEdit}
    >
      {type === "image" ? (
        <div className="relative inline-block">
          {renderDisplayValue()}
          {showEditIcon && !disabled && (
            <div className="bg-thai-orange absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <Edit3 className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">{renderDisplayValue()}</div>
          {showEditIcon && !disabled && (
            <Edit3 className="ml-2 h-3 w-3 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      )}

      {/* Modal pour édition des photos */}
      <PhotoEditModal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false)
          setError("")
        }}
        currentImage={value}
        onSave={handlePhotoSave}
        title="Modifier la Photo du Plat"
      />
    </div>
  )
}

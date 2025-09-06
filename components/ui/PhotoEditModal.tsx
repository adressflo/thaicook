'use client'

import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Link, X, Check, ImageIcon } from 'lucide-react'

interface PhotoEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage?: string
  onSave: (newImageUrl: string) => Promise<void>
  title?: string
}

export function PhotoEditModal({
  isOpen,
  onClose,
  currentImage,
  onSave,
  title = "Modifier la Photo"
}: PhotoEditModalProps) {
  const [imageUrl, setImageUrl] = useState(String(currentImage || ''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    const urlToSave = String(imageUrl || '').trim()
    if (!urlToSave) {
      setError('Veuillez saisir une URL ou télécharger une image')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      await onSave(urlToSave)
      onClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError('Erreur lors de la sauvegarde de l\'image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      
      // Pour l'instant, on convertit en base64
      // En production, vous pourriez uploader vers Supabase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageUrl(result)
        setActiveTab('url')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erreur upload:', error)
      setError('Erreur lors du téléchargement de l\'image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setImageUrl(String(currentImage || ''))
    setError('')
    setActiveTab('url')
    onClose()
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    setError('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-thai-orange">
            <ImageIcon className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'url' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Télécharger
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">URL de l'image</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  disabled={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label>Télécharger une image</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-thai-gold/30 rounded-lg cursor-pointer bg-gradient-to-br from-thai-cream/10 to-thai-gold/5 hover:border-thai-gold/50 hover:bg-thai-gold/10 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-thai-gold" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-thai-orange">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max 5MB)</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Aperçu de l'image */}
          {imageUrl && (
            <div className="space-y-2">
              <Label>Aperçu</Label>
              <div className="flex justify-center p-4 bg-gradient-to-br from-thai-cream/10 to-thai-gold/5 rounded-lg border border-thai-gold/20">
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="max-w-full max-h-48 object-contain rounded border shadow-sm"
                  onError={() => setError('Impossible de charger l\'image. Vérifiez l\'URL.')}
                />
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading || !imageUrl || !String(imageUrl).trim()}
            className="bg-gradient-to-r from-thai-orange to-thai-red text-white hover:from-thai-red hover:to-thai-orange transition-all duration-300 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
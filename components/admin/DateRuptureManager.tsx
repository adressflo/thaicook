'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { 
  CalendarIcon, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format, isSameDay, isPast, isFuture } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  usePlatRuptures, 
  useCreatePlatRupture, 
  useDeletePlatRupture,
  useCheckPlatAvailability
} from '@/hooks/useSupabaseData'

interface DateRuptureManagerProps {
  platId: number
  platNom: string
}

interface PlatRupture {
  id: number
  plat_id: number
  date_rupture: string
  raison_rupture: string
  type_rupture: 'stock' | 'conges' | 'maintenance' | 'autre'
  notes_rupture?: string
  is_active: boolean
  created_at: string
  created_by?: string
}

const typeRuptureOptions = [
  { value: 'stock', label: 'Rupture de stock', icon: '📦', color: 'bg-red-100 text-red-800' },
  { value: 'conges', label: 'Congés', icon: '🏖️', color: 'bg-blue-100 text-blue-800' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'autre', label: 'Autre', icon: '❓', color: 'bg-gray-100 text-gray-800' }
]

export function DateRuptureManager({ platId, platNom }: DateRuptureManagerProps) {
  const [isAddingRupture, setIsAddingRupture] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [raisonRupture, setRaisonRupture] = useState('')
  const [typeRupture, setTypeRupture] = useState<'stock' | 'conges' | 'maintenance' | 'autre'>('stock')
  const [notesRupture, setNotesRupture] = useState('')

  const { toast } = useToast()
  
  // Hooks pour les données
  const { data: ruptures = [], isLoading: loadingRuptures } = usePlatRuptures(platId)
  const createRuptureMutation = useCreatePlatRupture()
  const deleteRuptureMutation = useDeletePlatRupture()

  // Hook pour vérifier la disponibilité d'un plat à une date donnée
  const { data: platAvailability } = useCheckPlatAvailability(
    platId, 
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  )

  const handleAddRupture = async () => {
    if (!selectedDate) {
      toast({
        variant: 'destructive',
        title: 'Date requise',
        description: 'Veuillez sélectionner une date'
      })
      return
    }

    if (!raisonRupture.trim()) {
      toast({
        variant: 'destructive',
        title: 'Raison requise',
        description: 'Veuillez indiquer la raison de la rupture'
      })
      return
    }

    try {
      await createRuptureMutation.mutateAsync({
        plat_id: platId,
        date_rupture: format(selectedDate, 'yyyy-MM-dd'),
        raison_rupture: raisonRupture.trim(),
        type_rupture: typeRupture,
        notes_rupture: notesRupture.trim() || null,
        is_active: true
      })

      // Reset du formulaire
      setSelectedDate(undefined)
      setRaisonRupture('')
      setTypeRupture('stock')
      setNotesRupture('')
      setIsAddingRupture(false)

      toast({
        title: 'Rupture ajoutée',
        description: `${platNom} sera indisponible le ${format(selectedDate, 'PPP', { locale: fr })}`
      })
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la rupture:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter la rupture'
      })
    }
  }

  const handleDeleteRupture = async (ruptureId: number, dateRupture: string) => {
    try {
      await deleteRuptureMutation.mutateAsync(ruptureId)
      
      toast({
        title: 'Rupture supprimée',
        description: `${platNom} sera à nouveau disponible le ${format(new Date(dateRupture), 'PPP', { locale: fr })}`
      })
    } catch (error) {
      console.error('Erreur lors de la suppression de la rupture:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer la rupture'
      })
    }
  }

  const getRupturesByStatus = () => {
    const today = new Date()
    const actives = ruptures.filter(r => r.is_active && isFuture(new Date(r.date_rupture)))
    const passees = ruptures.filter(r => r.is_active && isPast(new Date(r.date_rupture)))
    const desactivees = ruptures.filter(r => !r.is_active)

    return { actives, passees, desactivees }
  }

  const { actives, passees, desactivees } = getRupturesByStatus()

  const getTypeRuptureConfig = (type: string) => {
    return typeRuptureOptions.find(opt => opt.value === type) || typeRuptureOptions[3]
  }

  const renderRuptureCard = (rupture: PlatRupture, status: 'active' | 'passee' | 'desactivee') => {
    const typeConfig = getTypeRuptureConfig(rupture.type_rupture)
    const dateRupture = new Date(rupture.date_rupture)
    const isToday = isSameDay(dateRupture, new Date())

    return (
      <div
        key={rupture.id}
        className={cn(
          'p-3 border rounded-lg space-y-2 transition-all',
          status === 'active' && 'border-red-200 bg-red-50',
          status === 'passee' && 'border-gray-200 bg-gray-50 opacity-75',
          status === 'desactivee' && 'border-gray-200 bg-gray-100 opacity-50'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={cn('text-xs', typeConfig.color)}>
              {typeConfig.icon} {typeConfig.label}
            </Badge>
            {isToday && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                Aujourd'hui
              </Badge>
            )}
          </div>
          {status === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteRupture(rupture.id, rupture.date_rupture)}
              disabled={deleteRuptureMutation.isPending}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-sm font-medium">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {format(dateRupture, 'EEEE dd MMMM yyyy', { locale: fr })}
          </div>
          
          <div className="text-sm text-gray-600">
            <strong>Raison:</strong> {rupture.raison_rupture}
          </div>

          {rupture.notes_rupture && (
            <div className="text-sm text-gray-600">
              <strong>Notes:</strong> {rupture.notes_rupture}
            </div>
          )}

          <div className="text-xs text-gray-400">
            Créé le {format(new Date(rupture.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Gestion des ruptures par date - {platNom}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout de rupture */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Nouvelle rupture</h3>
            <Button
              variant={isAddingRupture ? "outline" : "default"}
              size="sm"
              onClick={() => setIsAddingRupture(!isAddingRupture)}
              className="flex items-center space-x-1"
            >
              {isAddingRupture ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isAddingRupture ? 'Annuler' : 'Ajouter'}</span>
            </Button>
          </div>

          {isAddingRupture && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2">
                <Label>Date de rupture *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Type de rupture *</Label>
                <Select value={typeRupture} onValueChange={(value: any) => setTypeRupture(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeRuptureOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center">
                          {option.icon} {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Raison de la rupture *</Label>
                <Input
                  value={raisonRupture}
                  onChange={(e) => setRaisonRupture(e.target.value)}
                  placeholder="Ex: Rupture de stock tomates"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notes additionnelles</Label>
                <Textarea
                  value={notesRupture}
                  onChange={(e) => setNotesRupture(e.target.value)}
                  placeholder="Notes internes (optionnel)"
                  rows={2}
                  maxLength={250}
                />
              </div>

              <div className="md:col-span-2 flex space-x-2">
                <Button
                  onClick={handleAddRupture}
                  disabled={createRuptureMutation.isPending}
                  className="flex-1"
                >
                  {createRuptureMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Ajouter la rupture
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des ruptures actives */}
        {actives.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-500" />
              Ruptures futures ({actives.length})
            </h3>
            <div className="space-y-2">
              {actives
                .sort((a, b) => new Date(a.date_rupture).getTime() - new Date(b.date_rupture).getTime())
                .map(rupture => renderRuptureCard(rupture, 'active'))}
            </div>
          </div>
        )}

        {/* Liste des ruptures passées (limitée à 5) */}
        {passees.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
              Ruptures passées ({passees.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {passees
                .sort((a, b) => new Date(b.date_rupture).getTime() - new Date(a.date_rupture).getTime())
                .slice(0, 5)
                .map(rupture => renderRuptureCard(rupture, 'passee'))}
            </div>
          </div>
        )}

        {/* État quand aucune rupture */}
        {loadingRuptures && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-thai-orange rounded-full animate-spin" />
            <span className="ml-2 text-gray-500">Chargement des ruptures...</span>
          </div>
        )}

        {!loadingRuptures && ruptures.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Aucune rupture programmée pour ce plat</p>
            <p className="text-xs mt-1">Le plat sera disponible selon sa configuration hebdomadaire</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
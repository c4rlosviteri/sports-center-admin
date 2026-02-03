'use client'

import { ChevronDown, Pencil } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { updatePackageTemplate } from '~/actions/packages'

type ValidityType = 'unlimited' | 'days' | 'months'

interface Package {
  id: string
  name: string
  description: string | null
  classCount: number
  price: number
  validityType: ValidityType
  validityPeriod: number | null
  maxClassesPerDay: number | null
  maxClassesPerWeek: number | null
  isActive: boolean
}

interface FormData {
  name: string
  description: string
  classCount: number
  price: number
  validityType: ValidityType
  validityPeriod: number
  hasMaxPerDay: boolean
  maxClassesPerDay: number
  hasMaxPerWeek: boolean
  maxClassesPerWeek: number
  isActive: boolean
}

interface EditPackageDialogProps {
  package: Package
  onSuccess?: () => void
}

export function EditPackageDialog({
  package: pkg,
  onSuccess,
}: EditPackageDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: pkg.name,
    description: pkg.description ?? '',
    classCount: pkg.classCount,
    price: pkg.price,
    validityType: pkg.validityType,
    validityPeriod: pkg.validityPeriod ?? 30,
    hasMaxPerDay: pkg.maxClassesPerDay !== null,
    maxClassesPerDay: pkg.maxClassesPerDay ?? 1,
    hasMaxPerWeek: pkg.maxClassesPerWeek !== null,
    maxClassesPerWeek: pkg.maxClassesPerWeek ?? 3,
    isActive: pkg.isActive,
  })
  const [limitsOpen, setLimitsOpen] = useState(
    pkg.maxClassesPerDay !== null || pkg.maxClassesPerWeek !== null
  )

  const nameId = useId()
  const descriptionId = useId()
  const classCountId = useId()
  const priceId = useId()
  const validityPeriodId = useId()
  const validityUnlimitedId = useId()
  const validityDaysId = useId()
  const validityMonthsId = useId()
  const hasMaxPerDayId = useId()
  const hasMaxPerWeekId = useId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updatePackageTemplate(pkg.id, {
        name: formData.name,
        description: formData.description || undefined,
        classCount: formData.classCount,
        price: formData.price,
        validityType: formData.validityType,
        validityPeriod:
          formData.validityType === 'unlimited'
            ? undefined
            : formData.validityPeriod,
        maxClassesPerDay: formData.hasMaxPerDay
          ? formData.maxClassesPerDay
          : null,
        maxClassesPerWeek: formData.hasMaxPerWeek
          ? formData.maxClassesPerWeek
          : null,
        isActive: formData.isActive,
      })

      toast.success('Paquete actualizado exitosamente')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating package:', error)
      toast.error('Error al actualizar el paquete')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Editar Paquete</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica la configuración del paquete
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor={nameId} className="text-white">
                  Nombre del Paquete
                </Label>
                <Input
                  id={nameId}
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Ej: Pack 20 Clases Flex"
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={descriptionId} className="text-white">
                  Descripción
                </Label>
                <Textarea
                  id={descriptionId}
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  placeholder="Descripción del paquete..."
                  className="bg-white/5 border-white/10 text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={classCountId} className="text-white">
                    Número de Clases
                  </Label>
                  <Input
                    id={classCountId}
                    type="number"
                    value={formData.classCount}
                    onChange={(e) =>
                      updateFormData({
                        classCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    min="1"
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Usa 9999 para ilimitado
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={priceId} className="text-white">
                    Precio ($)
                  </Label>
                  <Input
                    id={priceId}
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      updateFormData({
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Validity Section */}
            <div className="space-y-4">
              <Label className="text-white font-medium">Validez</Label>
              <RadioGroup
                value={formData.validityType}
                onValueChange={(value: ValidityType) =>
                  updateFormData({ validityType: value })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="unlimited"
                    id={validityUnlimitedId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityUnlimitedId}
                    className="text-gray-400 cursor-pointer"
                  >
                    Ilimitado (nunca expira)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="days"
                    id={validityDaysId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityDaysId}
                    className="text-gray-400 cursor-pointer"
                  >
                    Días
                  </Label>
                  {formData.validityType === 'days' && (
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        id={validityPeriodId}
                        type="number"
                        value={formData.validityPeriod}
                        onChange={(e) =>
                          updateFormData({
                            validityPeriod: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        min="1"
                        className="bg-white/5 border-white/10 text-white w-20"
                      />
                      <span className="text-gray-400">días</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="months"
                    id={validityMonthsId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityMonthsId}
                    className="text-gray-400 cursor-pointer"
                  >
                    Meses
                  </Label>
                  {formData.validityType === 'months' && (
                    <div className="flex items-center gap-2 ml-4">
                      <Input
                        type="number"
                        value={formData.validityPeriod}
                        onChange={(e) =>
                          updateFormData({
                            validityPeriod: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        min="1"
                        className="bg-white/5 border-white/10 text-white w-20"
                      />
                      <span className="text-gray-400">mes(es)</span>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Usage Limits Section (Collapsible) */}
            <Collapsible open={limitsOpen} onOpenChange={setLimitsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
                <span className="text-white font-medium">
                  Límites de Uso (Opcional)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    limitsOpen ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={hasMaxPerDayId}
                      checked={formData.hasMaxPerDay}
                      onCheckedChange={(checked) =>
                        updateFormData({ hasMaxPerDay: !!checked })
                      }
                      className="border-white/30"
                    />
                    <Label
                      htmlFor={hasMaxPerDayId}
                      className="text-gray-400 cursor-pointer"
                    >
                      Máximo por día
                    </Label>
                  </div>
                  {formData.hasMaxPerDay && (
                    <Input
                      type="number"
                      value={formData.maxClassesPerDay}
                      onChange={(e) =>
                        updateFormData({
                          maxClassesPerDay: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      min="1"
                      className="bg-white/5 border-white/10 text-white w-20"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={hasMaxPerWeekId}
                      checked={formData.hasMaxPerWeek}
                      onCheckedChange={(checked) =>
                        updateFormData({ hasMaxPerWeek: !!checked })
                      }
                      className="border-white/30"
                    />
                    <Label
                      htmlFor={hasMaxPerWeekId}
                      className="text-gray-400 cursor-pointer"
                    >
                      Máximo por semana
                    </Label>
                  </div>
                  {formData.hasMaxPerWeek && (
                    <Input
                      type="number"
                      value={formData.maxClassesPerWeek}
                      onChange={(e) =>
                        updateFormData({
                          maxClassesPerWeek: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      min="1"
                      className="bg-white/5 border-white/10 text-white w-20"
                    />
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  Si no se establecen límites, el usuario puede usar todas sus
                  clases cuando quiera.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

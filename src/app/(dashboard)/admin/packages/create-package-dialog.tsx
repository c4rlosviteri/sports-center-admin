'use client'

import { ChevronDown, Plus } from 'lucide-react'
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
import { createPackageTemplate } from '~/actions/packages'

type ValidityType = 'unlimited' | 'days' | 'months'

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
}

const initialFormData: FormData = {
  name: '',
  description: '',
  classCount: 10,
  price: 0,
  validityType: 'days',
  validityPeriod: 30,
  hasMaxPerDay: false,
  maxClassesPerDay: 1,
  hasMaxPerWeek: false,
  maxClassesPerWeek: 3,
}

interface CreatePackageDialogProps {
  onSuccess?: () => void
}

export function CreatePackageDialog({ onSuccess }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [limitsOpen, setLimitsOpen] = useState(false)

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
      await createPackageTemplate({
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
        isGiftEligible: false,
        isShareable: false,
        allowsWaitlist: true,
        priorityBooking: false,
        isActive: true,
      })

      toast.success('Paquete creado exitosamente')
      setOpen(false)
      setFormData(initialFormData)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating package:', error)
      toast.error('Error al crear el paquete')
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
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="size-4" />
          Crear Paquete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              Crear Nuevo Paquete
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Configura un paquete flexible de clases
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            {/* Package Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor={nameId}
                className="text-white text-sm font-medium"
              >
                Nombre del Paquete
              </Label>
              <Input
                id={nameId}
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Ej: Pack 20 Clases Flex"
                required
                className="bg-white/5 border-white/10 text-white h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor={descriptionId}
                className="text-white text-sm font-medium"
              >
                Descripción
              </Label>
              <Textarea
                id={descriptionId}
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                placeholder="Descripción del paquete..."
                className="bg-white/5 border-white/10 text-white resize-none min-h-[60px]"
              />
            </div>

            {/* Class Count and Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor={classCountId}
                  className="text-white text-sm font-medium"
                >
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
                  className="bg-white/5 border-white/10 text-white h-10"
                />
                <p className="text-xs text-gray-400">Usa 9999 para ilimitado</p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={priceId}
                  className="text-white text-sm font-medium"
                >
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
                  className="bg-white/5 border-white/10 text-white h-10"
                />
              </div>
            </div>

            {/* Validity Section */}
            <div className="space-y-3">
              <Label className="text-white text-sm font-medium">Validez</Label>
              <RadioGroup
                value={formData.validityType}
                onValueChange={(value: ValidityType) =>
                  updateFormData({ validityType: value })
                }
                className="grid gap-2"
              >
                {/* Unlimited Option */}
                <div className="flex items-center space-x-3 rounded-md border border-white/10 bg-white/5 px-3 py-2.5">
                  <RadioGroupItem
                    value="unlimited"
                    id={validityUnlimitedId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityUnlimitedId}
                    className="text-gray-400 text-sm cursor-pointer flex-1"
                  >
                    Ilimitado (nunca expira)
                  </Label>
                </div>

                {/* Days Option */}
                <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2.5">
                  <RadioGroupItem
                    value="days"
                    id={validityDaysId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityDaysId}
                    className="text-gray-400 text-sm cursor-pointer"
                  >
                    Días
                  </Label>
                  {formData.validityType === 'days' && (
                    <div className="flex items-center gap-2 ml-auto">
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
                        className="bg-white/10 border-white/10 text-white w-16 h-8 text-sm text-center"
                      />
                      <span className="text-gray-400 text-sm">días</span>
                    </div>
                  )}
                </div>

                {/* Months Option */}
                <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2.5">
                  <RadioGroupItem
                    value="months"
                    id={validityMonthsId}
                    className="border-white/30 text-red-500"
                  />
                  <Label
                    htmlFor={validityMonthsId}
                    className="text-gray-400 text-sm cursor-pointer"
                  >
                    Meses
                  </Label>
                  {formData.validityType === 'months' && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Input
                        type="number"
                        value={formData.validityPeriod}
                        onChange={(e) =>
                          updateFormData({
                            validityPeriod: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        min="1"
                        className="bg-white/10 border-white/10 text-white w-16 h-8 text-sm text-center"
                      />
                      <span className="text-gray-400 text-sm">meses</span>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Usage Limits Section (Collapsible) */}
            <Collapsible open={limitsOpen} onOpenChange={setLimitsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
                <span className="text-white text-sm font-medium">
                  Límites de Uso (Opcional)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    limitsOpen ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="rounded-md border border-white/10 bg-white/5 p-3 space-y-3">
                  {/* Max Per Day */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={hasMaxPerDayId}
                        checked={formData.hasMaxPerDay}
                        onCheckedChange={(checked) =>
                          updateFormData({ hasMaxPerDay: !!checked })
                        }
                        className="border-white/30 h-4 w-4"
                      />
                      <Label
                        htmlFor={hasMaxPerDayId}
                        className="text-gray-400 text-sm cursor-pointer"
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
                        className="bg-white/10 border-white/10 text-white w-16 h-8 text-sm text-center"
                      />
                    )}
                  </div>

                  {/* Max Per Week */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={hasMaxPerWeekId}
                        checked={formData.hasMaxPerWeek}
                        onCheckedChange={(checked) =>
                          updateFormData({ hasMaxPerWeek: !!checked })
                        }
                        className="border-white/30 h-4 w-4"
                      />
                      <Label
                        htmlFor={hasMaxPerWeekId}
                        className="text-gray-400 text-sm cursor-pointer"
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
                            maxClassesPerWeek:
                              parseInt(e.target.value, 10) || 1,
                          })
                        }
                        min="1"
                        className="bg-white/10 border-white/10 text-white w-16 h-8 text-sm text-center"
                      />
                    )}
                  </div>

                  <p className="text-xs text-gray-400 pt-1">
                    Si no se establecen límites, el usuario puede usar todas sus
                    clases cuando quiera.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/5 h-9 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white h-9 px-4"
            >
              {isSubmitting ? 'Creando...' : 'Crear Paquete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

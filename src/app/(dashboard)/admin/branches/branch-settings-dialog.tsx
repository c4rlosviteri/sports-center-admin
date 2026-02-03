'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateBranchSettings } from '~/actions/branches'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { NumberInput } from '~/components/ui/number-input'

interface BranchSettingsDialogProps {
  branchId: string
  branchName: string
  cancellationHoursBefore: number
  bookingHoursBefore: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BranchSettingsDialog({
  branchId,
  branchName,
  cancellationHoursBefore,
  bookingHoursBefore,
  open,
  onOpenChange,
}: BranchSettingsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateBranchSettings(branchId, formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al actualizar configuración'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 bg-gray-900 border-white/10 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              Configuración de Sucursal
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {branchName} - Políticas de reserva y cancelación
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="cancellationHoursBefore"
                className="text-gray-400"
              >
                Horas antes para cancelar *
              </Label>
              <NumberInput
                name="cancellationHoursBefore"
                min={0}
                max={72}
                defaultValue={cancellationHoursBefore}
                suffix="hrs"
              />
              <p className="text-xs text-gray-400">
                Mínimo de horas antes del inicio de la clase para permitir
                cancelaciones (ej: 2 = no se puede cancelar 2h antes)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bookingHoursBefore" className="text-gray-400">
                Horas antes para reservar *
              </Label>
              <NumberInput
                name="bookingHoursBefore"
                min={0}
                max={72}
                defaultValue={bookingHoursBefore}
                suffix="hrs"
              />
              <p className="text-xs text-gray-400">
                Mínimo de horas antes del inicio de la clase para permitir
                reservas (0 = sin restricción, 2 = no se puede reservar 2h
                antes)
              </p>
            </div>

            <div className="bg-blue-500/10 border border-info/30 rounded-lg p-3">
              <p className="text-sm text-info">
                <strong>Nota:</strong> Estas configuraciones aplican por defecto
                a todas las clases de esta sucursal. Puedes configurar
                restricciones específicas para cada clase individualmente.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

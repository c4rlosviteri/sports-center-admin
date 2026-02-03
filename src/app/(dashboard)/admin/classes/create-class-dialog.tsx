'use client'

import { Calendar as CalendarIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DurationSelect } from '@/components/ui/duration-select'
import { HoursBeforeSelect } from '@/components/ui/hours-before-select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { TimeInput } from '@/components/ui/time-input'
import { createClass } from '~/actions/admin'

interface CreateClassDialogProps {
  children?: React.ReactNode
  selectedDate?: Date
  onSuccess?: () => void
}

export function CreateClassDialog({
  children,
  selectedDate: initialDate = new Date(),
  onSuccess,
}: CreateClassDialogProps) {
  const nameId = useId()
  const instructorId = useId()
  const dateId = useId()
  const timeId = useId()
  const durationId = useId()
  const capacityId = useId()
  const waitlistId = useId()
  const bookingHoursId = useId()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    scheduledTime: '06:00',
    durationMinutes: 45,
    capacity: 20,
    waitlistCapacity: 5,
    bookingHoursBefore: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const scheduledAt = new Date(selectedDate)
      const [hours, minutes] = formData.scheduledTime.split(':')
      scheduledAt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

      await createClass({
        name: formData.name,
        instructor: formData.instructor,
        scheduledAt,
        durationMinutes: formData.durationMinutes,
        capacity: formData.capacity,
        waitlistCapacity: formData.waitlistCapacity,
        bookingHoursBefore: formData.bookingHoursBefore,
      })

      setOpen(false)
      setFormData({
        name: '',
        instructor: '',
        scheduledTime: '',
        durationMinutes: 45,
        capacity: 20,
        waitlistCapacity: 5,
        bookingHoursBefore: 0,
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al crear la clase'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <CalendarIcon className="size-4" />
            Nueva Clase
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Crear Nueva Clase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa los datos para crear una nueva clase
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={nameId} className="text-white">
                Nombre de la Clase
              </Label>
              <Input
                id={nameId}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Spinning Intenso"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={instructorId} className="text-white">
                Instructor
              </Label>
              <Input
                id={instructorId}
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                placeholder="Juan Pérez"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={dateId} className="text-white">
                Fecha
              </Label>
              <Input
                id={dateId}
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value)
                  setSelectedDate(newDate)
                }}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={timeId} className="text-white">
                Hora
              </Label>
              <TimeInput
                value={formData.scheduledTime || '06:00'}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    scheduledTime: value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor={durationId} className="text-white">
                  Duración
                </Label>
                <DurationSelect
                  value={formData.durationMinutes}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      durationMinutes: value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={capacityId} className="text-white">
                  Capacidad
                </Label>
                <NumberInput
                  value={formData.capacity}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      capacity: value,
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={waitlistId} className="text-white">
                  Lista Espera
                </Label>
                <NumberInput
                  value={formData.waitlistCapacity}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      waitlistCapacity: value,
                    })
                  }
                  min={0}
                  max={50}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={bookingHoursId} className="text-white">
                Horas antes para reservar
              </Label>
              <HoursBeforeSelect
                value={formData.bookingHoursBefore}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    bookingHoursBefore: value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/5 hover:border-white/30"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Creando...' : 'Crear Clase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

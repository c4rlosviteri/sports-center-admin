'use client'

import {
  Calendar as CalendarIcon,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Calendar } from '@/components/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DurationSelect } from '@/components/ui/duration-select'
import { HoursBeforeSelect } from '@/components/ui/hours-before-select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { TimeInput } from '@/components/ui/time-input'
import { deleteClass, updateClass } from '~/actions/admin'
import { useAdminClasses } from '~/hooks/use-classes'
import { CreateClassDialog } from './create-class-dialog'

interface Class {
  id: string
  name: string
  instructor: string | null
  scheduledAt: Date
  durationMinutes: number
  capacity: number
  waitlistCapacity: number
  confirmedCount: number | null
  waitlistCount: number | null
}

export function ClassesCalendar() {
  const router = useRouter()
  const editNameId = useId()
  const editInstructorId = useId()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewedMonth, setViewedMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  })
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    classId: string
    className: string
  }>({ open: false, classId: '', className: '' })

  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    scheduledTime: '',
    durationMinutes: 45,
    capacity: 20,
    waitlistCapacity: 5,
    bookingHoursBefore: 0,
  })

  const {
    data: rawClasses = [],
    isLoading,
    mutate,
  } = useAdminClasses(viewedMonth.year, viewedMonth.month)

  const classes = useMemo(
    () =>
      rawClasses.map((c) => ({ ...c, scheduledAt: new Date(c.scheduledAt) })),
    [rawClasses]
  )

  const selectedDateClasses = classes.filter((cls) => {
    const clsDate = new Date(cls.scheduledAt)
    return (
      clsDate.getDate() === selectedDate.getDate() &&
      clsDate.getMonth() === selectedDate.getMonth() &&
      clsDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const classesDataForCalendar = classes.reduce(
    (acc, cls) => {
      const date = new Date(cls.scheduledAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const key = `${year}-${month}-${day}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const handleMonthChange = (year: number, month: number) => {
    setViewedMonth({ year, month })
  }

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass) return

    try {
      const scheduledAt = new Date(selectedDate)
      const [hours, minutes] = formData.scheduledTime.split(':')
      scheduledAt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

      await updateClass(editingClass.id, {
        name: formData.name,
        instructor: formData.instructor,
        scheduledAt,
        durationMinutes: formData.durationMinutes,
        capacity: formData.capacity,
        waitlistCapacity: formData.waitlistCapacity,
        bookingHoursBefore: formData.bookingHoursBefore,
      })

      setEditingClass(null)
      setFormData({
        name: '',
        instructor: '',
        scheduledTime: '',
        durationMinutes: 45,
        capacity: 20,
        waitlistCapacity: 5,
        bookingHoursBefore: 0,
      })
      mutate()
    } catch (error) {
      console.error('Error updating class:', error)
      toast.error('Error al actualizar la clase')
    }
  }

  const handleDeleteClass = (classId: string, className: string) => {
    setDeleteConfirm({ open: true, classId, className })
  }

  const confirmDeleteClass = async () => {
    try {
      await deleteClass(deleteConfirm.classId)
      mutate()
    } catch (error) {
      console.error('Error deleting class:', error)
      toast.error('Error al eliminar la clase')
    }
  }

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls)
    const scheduledAt = new Date(cls.scheduledAt)
    setFormData({
      name: cls.name,
      instructor: cls.instructor ?? '',
      scheduledTime: `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`,
      durationMinutes: cls.durationMinutes,
      capacity: cls.capacity,
      waitlistCapacity: cls.waitlistCapacity,
      bookingHoursBefore: 0,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-1">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
          classesData={classesDataForCalendar}
        />
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-white capitalize">
            {selectedDate.toLocaleDateString('es-EC', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <CreateClassDialog
            selectedDate={selectedDate}
            onSuccess={() => mutate()}
          >
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 w-full sm:w-auto">
              <CalendarIcon className="size-4" />
              Nueva Clase
            </Button>
          </CreateClassDialog>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400">Cargando clases...</p>
            </div>
          ) : selectedDateClasses.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400">
                No hay clases programadas para este día
              </p>
            </div>
          ) : (
            selectedDateClasses
              .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
              .map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/5 hover:border-white/20 transition-all shadow-lg hover:shadow-xl relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-lg font-bold text-white">
                          {cls.name}
                        </h4>
                        <Badge
                          variant={
                            (cls.confirmedCount ?? 0) >= cls.capacity
                              ? 'destructive'
                              : 'default'
                          }
                          className={
                            (cls.confirmedCount ?? 0) >= cls.capacity
                              ? 'bg-red-600 text-white'
                              : 'bg-green-600 text-white'
                          }
                        >
                          {cls.confirmedCount ?? 0}/{cls.capacity}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 font-medium">
                        Instructor: {cls.instructor ?? 'Sin asignar'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="font-semibold text-white">
                          {new Date(cls.scheduledAt).toLocaleTimeString(
                            'es-EC',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                        <span>{cls.durationMinutes} min</span>
                        {(cls.waitlistCount ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Users className="h-3 w-3" />
                            {cls.waitlistCount} en espera
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Desktop buttons */}
                    <div className="hidden sm:flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5"
                        onClick={() => router.push(`/admin/classes/${cls.id}`)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={editingClass?.id === cls.id}
                        onOpenChange={(open) => !open && setEditingClass(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(cls)}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg">
                          <form onSubmit={handleUpdateClass}>
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Editar Clase
                              </DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Modifica los datos de la clase
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label
                                  htmlFor={editNameId}
                                  className="text-white"
                                >
                                  Nombre de la Clase
                                </Label>
                                <Input
                                  id={editNameId}
                                  value={formData.name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label
                                  htmlFor={editInstructorId}
                                  className="text-white"
                                >
                                  Instructor
                                </Label>
                                <Input
                                  id={editInstructorId}
                                  value={formData.instructor}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      instructor: e.target.value,
                                    })
                                  }
                                  required
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label
                                  htmlFor="edit-time"
                                  className="text-white"
                                >
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
                                  <Label
                                    htmlFor="edit-duration"
                                    className="text-white"
                                  >
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
                                  <Label
                                    htmlFor="edit-capacity"
                                    className="text-white"
                                  >
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
                                  <Label
                                    htmlFor="edit-waitlist"
                                    className="text-white"
                                  >
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
                                <Label
                                  htmlFor="edit-bookingHoursBefore"
                                  className="text-white"
                                >
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
                                onClick={() => setEditingClass(null)}
                                className="bg-white/5 border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Guardar Cambios
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id, cls.name)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile three-dot menu - positioned top-right */}
                    <div className="sm:hidden absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-900 border-white/10 text-white"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/classes/${cls.id}`)
                            }
                            className="hover:bg-white/5 focus:bg-white/10 cursor-pointer"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Ver reservas
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(cls)}
                            className="hover:bg-white/5 focus:bg-white/10 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClass(cls.id, cls.name)}
                            className="text-primary hover:bg-primary/10 focus:bg-primary/10 focus:text-primary cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title="Eliminar Clase"
        description={`¿Estás seguro de que deseas eliminar la clase "${deleteConfirm.className}"?`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmDeleteClass}
      />
    </div>
  )
}

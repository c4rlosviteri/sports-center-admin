'use client'

import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { createBranch } from '~/actions/branches'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export function CreateBranchDialog() {
  const nameInputId = useId()
  const addressInputId = useId()
  const phoneInputId = useId()
  const emailInputId = useId()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createBranch(formData)
      setOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Error creating branch:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al crear sucursal'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="size-4" />
          Nueva Sucursal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 bg-gray-900 border-white/10 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              Crear Nueva Sucursal
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa los datos de la nueva sucursal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={nameInputId} className="text-gray-400">
                Nombre *
              </Label>
              <Input
                id={nameInputId}
                name="name"
                placeholder="Ej: Biciantro Norte"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={addressInputId} className="text-gray-400">
                Dirección
              </Label>
              <Input
                id={addressInputId}
                name="address"
                placeholder="Av. Principal 123"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={phoneInputId} className="text-gray-400">
                Teléfono
              </Label>
              <Input
                id={phoneInputId}
                name="phone"
                type="tel"
                placeholder="+593 2 2345678"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={emailInputId} className="text-gray-400">
                Email
              </Label>
              <Input
                id={emailInputId}
                name="email"
                type="email"
                placeholder="sucursal@biciantro.ec"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
              {isLoading ? 'Creando...' : 'Crear Sucursal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

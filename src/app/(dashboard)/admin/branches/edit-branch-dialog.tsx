'use client'

import { useId, useState } from 'react'
import { toast } from 'sonner'
import { updateBranch } from '~/actions/branches'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Branch {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date | null
}

interface EditBranchDialogProps {
  branch: Branch
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBranchDialog({
  branch,
  open,
  onOpenChange,
}: EditBranchDialogProps) {
  const nameInputId = useId()
  const addressInputId = useId()
  const phoneInputId = useId()
  const emailInputId = useId()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateBranch(branch.id, formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating branch:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al actualizar sucursal'
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
            <DialogTitle className="text-white">Editar Sucursal</DialogTitle>
            <DialogDescription className="text-gray-400">
              Actualiza los datos de la sucursal
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
                defaultValue={branch.name}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={addressInputId} className="text-gray-400">
                Dirección
              </Label>
              <Input
                id={addressInputId}
                name="address"
                defaultValue={branch.address || ''}
                className="bg-white/10 border-white/20 text-white"
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
                defaultValue={branch.phone || ''}
                className="bg-white/10 border-white/20 text-white"
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
                defaultValue={branch.email || ''}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <input
              type="hidden"
              name="isActive"
              value={branch.isActive.toString()}
            />
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

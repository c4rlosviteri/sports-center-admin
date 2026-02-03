'use client'

import { Plus } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBranch } from '~/actions/branches'
import { useBranches } from '~/hooks/use-branches'
import { BranchesTable } from './branches-table'

export function BranchesPageContent() {
  const { isLoading, mutate } = useBranches()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const nameId = useId()
  const addressId = useId()
  const phoneId = useId()
  const emailId = useId()

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createBranch(formData)
      setCreateDialogOpen(false)
      mutate()
      toast.success('Sucursal creada exitosamente')
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Error creating branch:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al crear sucursal'
      )
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Gestión de Sucursales
            </h2>
            <p className="text-gray-400">
              Administra las sucursales de tu negocio
            </p>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
            disabled
          >
            <Plus className="size-4" />
            Crear Sucursal
          </Button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Gestión de Sucursales
          </h2>
          <p className="text-gray-400">
            Administra las sucursales de tu negocio
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <Plus className="size-4" />
              Crear Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125 bg-gray-900 border-white/10 text-white">
            <form onSubmit={handleCreateSubmit}>
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
                  <Label htmlFor={nameId} className="text-gray-400">
                    Nombre *
                  </Label>
                  <Input
                    id={nameId}
                    name="name"
                    placeholder="Ej: Biciantro Norte"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={addressId} className="text-gray-400">
                    Dirección
                  </Label>
                  <Input
                    id={addressId}
                    name="address"
                    placeholder="Calle y número"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={phoneId} className="text-gray-400">
                    Teléfono
                  </Label>
                  <Input
                    id={phoneId}
                    name="phone"
                    type="tel"
                    placeholder="+593 98 765 4321"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={emailId} className="text-gray-400">
                    Email
                  </Label>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder="sucursal@ejemplo.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isCreating ? 'Creando...' : 'Crear Sucursal'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <BranchesTable />
    </main>
  )
}

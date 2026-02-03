'use client'

import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { createAdmin, createSuperuser } from '~/actions/admin'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface Branch {
  id: string
  name: string
}

interface CreateUserDialogProps {
  branches: Branch[]
}

export function CreateUserDialog({ branches }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<'superuser' | 'admin'>('admin')

  const emailId = useId()
  const passwordId = useId()
  const firstNameId = useId()
  const lastNameId = useId()
  const phoneId = useId()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      if (userType === 'superuser') {
        await createSuperuser(formData)
      } else {
        await createAdmin(formData)
      }

      setOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al crear usuario'
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
          Crear Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              Crear Nuevo Usuario
            </DialogTitle>
            <DialogDescription>
              Crea un superusuario o administrador de sucursal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userType">Tipo de Usuario *</Label>
              <Select
                value={userType}
                onValueChange={(value: 'superuser' | 'admin') =>
                  setUserType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="superuser">Superusuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={emailId}>Email *</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                placeholder="usuario@biciantro.ec"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={passwordId}>Contraseña *</Label>
              <Input
                id={passwordId}
                name="password"
                type="password"
                placeholder="********"
                required
                minLength={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor={firstNameId}>Nombre *</Label>
                <Input
                  id={firstNameId}
                  name="firstName"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={lastNameId}>Apellido *</Label>
                <Input
                  id={lastNameId}
                  name="lastName"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={phoneId}>Teléfono</Label>
              <Input
                id={phoneId}
                name="phone"
                type="tel"
                placeholder="+593 99 123 4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="branchId">
                Sucursal {userType === 'admin' ? '*' : '(Principal)'}
              </Label>
              <Select name="branchId" required={userType === 'admin'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {userType === 'superuser' && (
                <p className="text-sm text-gray-400">
                  Sucursal principal para contexto, puede acceder a todas
                </p>
              )}
              {userType === 'admin' && (
                <p className="text-sm text-gray-400">
                  Sucursal principal del administrador
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

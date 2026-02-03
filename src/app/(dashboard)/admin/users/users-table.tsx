'use client'

import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
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
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, updateUserRole } from '~/actions/admin'
import { usePaginatedUsers } from '~/hooks/use-users'
import { formatDateDDMMYYYY } from '~/lib/date-utils'

type RoleFilter = 'all' | 'superuser' | 'admin' | 'client'

interface Branch {
  id: string
  name: string
}

interface UsersTableProps {
  branches: Branch[]
}

export function UsersTable({ branches }: UsersTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    userId: string
    userName: string
  }>({ open: false, userId: '', userName: '' })
  const [promoteDialog, setPromoteDialog] = useState<{
    open: boolean
    userId: string
    userName: string
    selectedBranches: string[]
  }>({ open: false, userId: '', userName: '', selectedBranches: [] })

  const { data, isLoading, mutate } = usePaginatedUsers(
    page,
    pageSize,
    roleFilter === 'all' ? null : roleFilter
  )

  const users = data?.users ?? []
  const pagination = data?.pagination ?? {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  }

  const handleRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRoleChange = (
    userId: string,
    userName: string,
    currentRole: string,
    newRole: 'admin' | 'client'
  ) => {
    if (newRole === 'admin' && currentRole === 'client') {
      // Show branch selection dialog when promoting to admin
      setPromoteDialog({
        open: true,
        userId,
        userName,
        selectedBranches: branches.length > 0 ? [branches[0].id] : [],
      })
    } else {
      // Direct role change (demoting to client)
      performRoleChange(userId, newRole)
    }
  }

  const performRoleChange = async (
    userId: string,
    newRole: 'admin' | 'client',
    branchIds?: string[]
  ) => {
    setIsUpdating(userId)
    try {
      await updateUserRole(userId, newRole, branchIds)
      mutate()
      toast.success(
        newRole === 'admin'
          ? 'Usuario promovido a administrador'
          : 'Rol actualizado correctamente'
      )
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Error al actualizar el rol')
    } finally {
      setIsUpdating(null)
    }
  }

  const handlePromoteConfirm = async () => {
    if (promoteDialog.selectedBranches.length === 0) {
      toast.error('Debe seleccionar al menos una sucursal')
      return
    }
    await performRoleChange(
      promoteDialog.userId,
      'admin',
      promoteDialog.selectedBranches
    )
    setPromoteDialog({
      open: false,
      userId: '',
      userName: '',
      selectedBranches: [],
    })
  }

  const toggleBranchSelection = (branchId: string) => {
    setPromoteDialog((prev) => {
      const isSelected = prev.selectedBranches.includes(branchId)
      return {
        ...prev,
        selectedBranches: isSelected
          ? prev.selectedBranches.filter((id) => id !== branchId)
          : [...prev.selectedBranches, branchId],
      }
    })
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteConfirm({ open: true, userId, userName })
  }

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(deleteConfirm.userId)
      mutate()
      toast.success('Usuario eliminado correctamente')
      setDeleteConfirm({ open: false, userId: '', userName: '' })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar usuario'
      )
      setDeleteConfirm({ open: false, userId: '', userName: '' })
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'superuser') {
      return (
        <Badge
          variant="outline"
          className="text-foreground border-red-600 bg-red-600"
        >
          Superusuario
        </Badge>
      )
    }

    if (role === 'admin') {
      return (
        <Badge variant="outline" className="bg-white text-black">
          Admin
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-white">
        Cliente
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Filtrar por tipo:</span>
          <Select
            value={roleFilter}
            onValueChange={(v) => handleRoleFilterChange(v as RoleFilter)}
          >
            <SelectTrigger className="w-44 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Todos los usuarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="client">Clientes</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="superuser">Superusuarios</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-gray-400 text-sm">
          {pagination.total} usuario{pagination.total !== 1 ? 's' : ''} en total
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-gray-400">Nombre</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Teléfono</TableHead>
              <TableHead className="text-gray-400">Rol</TableHead>
              <TableHead className="text-gray-400">Cambiar Rol</TableHead>
              <TableHead className="text-gray-400">Fecha Registro</TableHead>
              <TableHead className="text-gray-400 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent border-white/10">
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-400 py-8"
                >
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow className="hover:bg-transparent border-white/10">
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-400 py-8"
                >
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-gray-400">{user.email}</TableCell>
                  <TableCell className="text-gray-400">
                    {user.phone || '-'}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.role !== 'superuser' ? (
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(
                            user.id,
                            `${user.firstName} ${user.lastName}`,
                            user.role,
                            value as 'admin' | 'client'
                          )
                        }
                        disabled={isUpdating === user.id}
                      >
                        <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Cliente</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDateDDMMYYYY(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="cursor-pointer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {user.role !== 'superuser' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteUser(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="bg-white/5 border-white/10 text-white hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="bg-white/5 border-white/10 text-white hover:bg-white/5 disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que deseas eliminar a ${deleteConfirm.userName}?`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmDeleteUser}
      />

      <Dialog
        open={promoteDialog.open}
        onOpenChange={(open) => setPromoteDialog((s) => ({ ...s, open }))}
      >
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Promover a Administrador</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona las sucursales que {promoteDialog.userName} podrá
              administrar. La primera sucursal seleccionada será la principal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-white">{branch.name}</span>
                <Switch
                  checked={promoteDialog.selectedBranches.includes(branch.id)}
                  onCheckedChange={() => toggleBranchSelection(branch.id)}
                />
              </div>
            ))}
            {branches.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No hay sucursales disponibles
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setPromoteDialog({
                  open: false,
                  userId: '',
                  userName: '',
                  selectedBranches: [],
                })
              }
              className="bg-white/5 border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePromoteConfirm}
              disabled={promoteDialog.selectedBranches.length === 0}
              className="bg-white text-black hover:bg-gray-200"
            >
              Promover a Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

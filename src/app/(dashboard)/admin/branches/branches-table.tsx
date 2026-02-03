'use client'

import { MoreVertical, Pencil, Power, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { useBranches, useBranchMutations } from '~/hooks/use-branches'
import { formatDateDDMMYYYY } from '~/lib/date-utils'
import { BranchSettingsDialog } from './branch-settings-dialog'
import { EditBranchDialog } from './edit-branch-dialog'

export function BranchesTable() {
  const { data: branches = [], isLoading, mutate } = useBranches()
  const {
    handleDelete: handleDeleteBranch,
    handleToggleStatus: handleToggleBranchStatus,
  } = useBranchMutations(mutate)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const [editingBranch, setEditingBranch] = useState<
    (typeof branches)[0] | null
  >(null)
  const [settingsBranch, setSettingsBranch] = useState<
    (typeof branches)[0] | null
  >(null)

  const handleToggleStatus = async (branchId: string) => {
    setLoadingId(branchId)
    try {
      await handleToggleBranchStatus(branchId)
      toast.success('Estado actualizado')
    } catch (error) {
      console.error('Error toggling branch status:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al cambiar estado'
      )
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteClick = (branch: { id: string; name: string }) => {
    setBranchToDelete(branch)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return

    setLoadingId(branchToDelete.id)
    try {
      await handleDeleteBranch(branchToDelete.id)
      toast.success('Sucursal eliminada')
    } catch (error) {
      console.error('Error deleting branch:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar sucursal'
      )
    } finally {
      setLoadingId(null)
      setDeleteDialogOpen(false)
      setBranchToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="border border-white/10 rounded-lg bg-white/5 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-400">Nombre</TableHead>
            <TableHead className="text-gray-400">Dirección</TableHead>
            <TableHead className="text-gray-400">Teléfono</TableHead>
            <TableHead className="text-gray-400">Email</TableHead>
            <TableHead className="text-gray-400">Estado</TableHead>
            <TableHead className="text-gray-400">Fecha Creación</TableHead>
            <TableHead className="text-right text-gray-400">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow
              key={branch.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="font-medium text-white">
                {branch.name}
              </TableCell>
              <TableCell className="text-gray-400">
                {branch.address || '-'}
              </TableCell>
              <TableCell className="text-gray-400">
                {branch.phone || '-'}
              </TableCell>
              <TableCell className="text-gray-400">
                {branch.email || '-'}
              </TableCell>
              <TableCell>
                <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                  {branch.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400">
                {formatDateDDMMYYYY(branch.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-white hover:bg-white/5"
                      disabled={loadingId === branch.id}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-900 border-white/10 text-white w-48"
                  >
                    <DropdownMenuItem
                      onClick={() => setEditingBranch(branch)}
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSettingsBranch(branch)}
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(branch.id)}
                      disabled={loadingId === branch.id}
                      className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {branch.isActive ? 'Desactivar' : 'Activar'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(branch)}
                      disabled={loadingId === branch.id}
                      className="cursor-pointer text-primary hover:bg-primary/10 focus:bg-primary/10 focus:text-primary"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {branches.length === 0 && (
            <TableRow className="border-white/10">
              <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                No hay sucursales registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Eliminar Sucursal</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de eliminar la sucursal &quot;{branchToDelete?.name}
              &quot;? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={loadingId === branchToDelete?.id}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingBranch && (
        <EditBranchDialog
          branch={editingBranch}
          open={!!editingBranch}
          onOpenChange={(open) => {
            if (!open) {
              setEditingBranch(null)
              mutate()
            }
          }}
        />
      )}

      {/* Settings Dialog */}
      {settingsBranch && (
        <BranchSettingsDialog
          branchId={settingsBranch.id}
          branchName={settingsBranch.name}
          cancellationHoursBefore={settingsBranch.cancellationHoursBefore}
          bookingHoursBefore={settingsBranch.bookingHoursBefore}
          open={!!settingsBranch}
          onOpenChange={(open) => {
            if (!open) {
              setSettingsBranch(null)
              mutate()
            }
          }}
        />
      )}
    </div>
  )
}

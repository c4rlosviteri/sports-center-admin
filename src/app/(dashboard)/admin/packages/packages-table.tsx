'use client'

import { Infinity as InfinityIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deletePackageTemplate, togglePackageStatus } from '~/actions/packages'
import { usePackages } from '~/hooks/use-packages'
import { EditPackageDialog } from './edit-package-dialog'
import { SharePackageDialog } from './share-package-dialog'

export function PackagesTable() {
  const { data: packages = [], isLoading, mutate } = usePackages()
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Check if any packages have branchName (indicates superuser view)
  const hasBranchColumn = packages.some((pkg) => pkg.branchName)

  const handleToggleStatus = async (packageId: string, newStatus: boolean) => {
    setIsTogglingStatus(packageId)
    try {
      await togglePackageStatus(packageId, newStatus)
      toast.success(newStatus ? 'Paquete activado' : 'Paquete desactivado')
      mutate()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Error al cambiar el estado del paquete')
    } finally {
      setIsTogglingStatus(null)
    }
  }

  const handleDelete = async (packageId: string) => {
    setIsDeleting(packageId)
    try {
      await deletePackageTemplate(packageId)
      toast.success('Paquete eliminado')
      mutate()
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el paquete'
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const getValidityLabel = (pkg: {
    validityType: 'unlimited' | 'days' | 'months'
    validityPeriod: number | null
  }) => {
    if (pkg.validityType === 'unlimited') {
      return (
        <span className="flex items-center gap-1">
          <InfinityIcon className="h-4 w-4" />
          Sin límite
        </span>
      )
    }
    const unit = pkg.validityType === 'days' ? 'días' : 'meses'
    return `${pkg.validityPeriod} ${unit}`
  }

  const getLimitsLabel = (pkg: {
    maxClassesPerDay: number | null
    maxClassesPerWeek: number | null
  }) => {
    const limits = []
    if (pkg.maxClassesPerDay) {
      limits.push(`${pkg.maxClassesPerDay}/día`)
    }
    if (pkg.maxClassesPerWeek) {
      limits.push(`${pkg.maxClassesPerWeek}/sem`)
    }
    return limits.length > 0 ? limits.join(', ') : 'Sin límite'
  }

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="text-gray-400">Nombre</TableHead>
            <TableHead className="text-gray-400">Clases</TableHead>
            <TableHead className="text-gray-400">Validez</TableHead>
            <TableHead className="text-gray-400">Límites</TableHead>
            <TableHead className="text-gray-400">Precio</TableHead>
            {hasBranchColumn && (
              <TableHead className="text-gray-400">Sucursal</TableHead>
            )}
            <TableHead className="text-gray-400">Estado</TableHead>
            <TableHead className="text-gray-400 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow className="hover:bg-transparent border-white/10">
              <TableCell
                colSpan={hasBranchColumn ? 8 : 7}
                className="text-center text-gray-400 py-8"
              >
                No hay paquetes registrados. Crea uno nuevo para empezar.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-white font-medium">
                  <div>
                    <div>{pkg.name}</div>
                    {pkg.description && (
                      <div className="text-xs text-gray-400 mt-1">
                        {pkg.description.substring(0, 50)}
                        {pkg.description.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {pkg.classCount >= 9999 ? (
                    <span className="flex items-center gap-1">
                      <InfinityIcon className="h-4 w-4" />
                      Ilimitado
                    </span>
                  ) : (
                    pkg.classCount
                  )}
                </TableCell>
                <TableCell className="text-gray-400">
                  {getValidityLabel(pkg)}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {getLimitsLabel(pkg)}
                </TableCell>
                <TableCell className="text-gray-400">
                  ${pkg.price.toFixed(2)}
                </TableCell>
                {hasBranchColumn && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-500 text-gray-400"
                    >
                      {pkg.branchName}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pkg.isActive}
                      onCheckedChange={(checked) =>
                        handleToggleStatus(pkg.id, checked)
                      }
                      disabled={isTogglingStatus === pkg.id}
                    />
                    <span
                      className={
                        pkg.isActive
                          ? 'text-green-400 text-sm'
                          : 'text-gray-400 text-sm'
                      }
                    >
                      {pkg.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <SharePackageDialog
                      package={{ id: pkg.id, name: pkg.name }}
                    />
                    <EditPackageDialog package={pkg} onSuccess={mutate} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          disabled={isDeleting === pkg.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Eliminar Paquete
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            ¿Estás seguro de eliminar el paquete &quot;
                            {pkg.name}
                            &quot;? Esta acción no se puede deshacer. Si el
                            paquete tiene compras asociadas, no podrá ser
                            eliminado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/5">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pkg.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

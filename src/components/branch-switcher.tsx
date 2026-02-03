'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { switchBranchContext } from '~/actions/admin'
import { Badge } from '~/components/ui/badge'
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
  isPrimary?: boolean
  isActive?: boolean
}

interface BranchSwitcherProps {
  currentBranchId: string
  branches: Branch[]
}

export function BranchSwitcher({
  currentBranchId,
  branches,
}: BranchSwitcherProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBranchChange = async (branchId: string) => {
    if (branchId === currentBranchId) return

    setIsLoading(true)
    try {
      await switchBranchContext(branchId)
      window.location.reload()
    } catch (error) {
      console.error('Error switching branch:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al cambiar sucursal'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const currentBranch = branches.find((b) => b.id === currentBranchId)

  return (
    <Select
      value={currentBranchId}
      onValueChange={handleBranchChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-52 bg-white/10 text-white border-white/20 hover:bg-white/5 transition-colors">
        <SelectValue>
          {isLoading
            ? 'Cambiando...'
            : currentBranch?.name || 'Selecciona sucursal'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-white/20">
        {branches.map((branch) => (
          <SelectItem
            key={branch.id}
            value={branch.id}
            className="text-primary-foreground hover:bg-primary/10 focus:bg-primary/20"
          >
            <div className="flex items-center gap-2">
              <span>{branch.name}</span>
              {branch.isPrimary && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-red-500/20 text-red-400 border-red-500/30"
                >
                  Principal
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

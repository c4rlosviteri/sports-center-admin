'use client'

import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                variant === 'danger' ? 'bg-primary/20' : 'bg-warning/20'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  variant === 'danger' ? 'text-primary' : 'text-warning'
                }`}
              />
            </div>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-white/5 border-white/20 text-white hover:bg-white/5 hover:border-white/30"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              variant === 'danger'
                ? 'bg-primary hover:bg-primary/90 text-foreground'
                : 'bg-warning hover:bg-yellow-700 text-foreground'
            }
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UseConfirmDialogOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
}

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean
    options: UseConfirmDialogOptions
    onConfirm: () => void | Promise<void>
  }>({
    open: false,
    options: { title: '', description: '' },
    onConfirm: () => {},
  })

  const confirm = (
    options: UseConfirmDialogOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    setState({ open: true, options, onConfirm })
  }

  const dialogProps = {
    open: state.open,
    onOpenChange: (open: boolean) => setState((s) => ({ ...s, open })),
    ...state.options,
    onConfirm: state.onConfirm,
  }

  return { confirm, dialogProps, ConfirmDialog }
}

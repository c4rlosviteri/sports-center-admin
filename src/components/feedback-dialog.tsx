'use client'

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export type FeedbackType = 'success' | 'error' | 'info' | 'warning'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: FeedbackType
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'text-success',
  error: 'text-primary',
  warning: 'text-warning',
  info: 'text-info',
}

const bgMap = {
  success: 'bg-success/10',
  error: 'bg-primary/10',
  warning: 'bg-warning/10',
  info: 'bg-info/10',
}

export function FeedbackDialog({
  open,
  onOpenChange,
  type,
  title,
  message,
  confirmText = 'Aceptar',
  onConfirm,
}: FeedbackDialogProps) {
  const Icon = iconMap[type]
  const iconColor = colorMap[type]
  const bgColor = bgMap[type]

  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${bgColor}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <DialogTitle className="text-white text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-base pt-4">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90 text-foreground"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

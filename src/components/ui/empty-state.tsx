import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in',
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-card/50 p-4 border border-border">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface EmptyStateCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  message: string
}

function EmptyStateCompact({
  icon: Icon,
  message,
  className,
  ...props
}: EmptyStateCompactProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 py-8 text-muted-foreground',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span className="text-sm">{message}</span>
    </div>
  )
}

export { EmptyState, EmptyStateCompact }

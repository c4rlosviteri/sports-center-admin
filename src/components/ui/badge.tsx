import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-red-600 text-white hover:bg-red-600/80',
        secondary:
          'border-transparent bg-secondary text-white hover:bg-secondary/80',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-600/80',
        outline: 'text-white',
        success:
          'border-transparent bg-green-500/20 text-green-400 border-green-500/30',
        warning:
          'border-transparent bg-warning/20 text-warning border-warning/30',
        info: 'border-transparent bg-info/20 text-info border-info/30',
        error:
          'border-transparent bg-primary/20 text-primary border-primary/30',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'info' && 'bg-info',
            variant === 'error' && 'bg-primary',
            variant === 'destructive' && 'bg-primary',
            !variant || (variant === 'default' && 'bg-current'),
            variant === 'secondary' && 'bg-current',
            variant === 'outline' && 'bg-current'
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }

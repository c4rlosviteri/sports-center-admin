import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type IconColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: IconColor
  description?: string
  link?: {
    href: string
    label: string
  }
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

const iconColorStyles: Record<
  IconColor,
  { bg: string; text: string; glow: string }
> = {
  blue: {
    bg: 'bg-info/20',
    text: 'text-info',
    glow: 'shadow-blue-500/20',
  },
  green: {
    bg: 'bg-success/20',
    text: 'text-success',
    glow: 'shadow-green-500/20',
  },
  red: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    glow: 'shadow-red-500/20',
  },
  yellow: {
    bg: 'bg-warning/20',
    text: 'text-warning',
    glow: 'shadow-yellow-500/20',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  gray: {
    bg: 'bg-muted/30',
    text: 'text-muted-foreground',
    glow: 'shadow-gray-500/20',
  },
}

function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'blue',
  description,
  link,
  trend,
  className,
  ...props
}: StatsCardProps) {
  const colorStyles = iconColorStyles[iconColor]

  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/5 hover:border-gray-500 group',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.direction === 'up' ? 'text-success' : 'text-primary'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg p-2.5 transition-all duration-300 group-hover:shadow-lg',
            colorStyles.bg,
            colorStyles.glow
          )}
        >
          <Icon className={cn('h-6 w-6', colorStyles.text)} />
        </div>
      </div>
      {(description || link) && (
        <div className="mt-4">
          {description && !link && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
          {link && (
            <Link
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:underline',
                colorStyles.text
              )}
            >
              {link.label} →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export { StatsCard }
export type { StatsCardProps, IconColor }

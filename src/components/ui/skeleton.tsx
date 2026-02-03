import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-card/60 animate-pulse',
        variant === 'default' && 'rounded-md',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  )
}

function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/50 p-6 space-y-4',
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function SkeletonStatsCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/50 p-6',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton variant="circular" className="h-10 w-10" />
      </div>
      <Skeleton className="h-4 w-32 mt-4" />
    </div>
  )
}

function SkeletonTableRow({
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { columns?: number }) {
  return (
    <tr className={cn('border-b border-border', className)} {...props}>
      {Array.from({ length: columns }).map(() => (
        <td key={crypto.randomUUID()} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

function SkeletonList({
  count = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: count }).map(() => (
        <div
          key={crypto.randomUUID()}
          className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonStatsCard,
  SkeletonTableRow,
  SkeletonList,
}

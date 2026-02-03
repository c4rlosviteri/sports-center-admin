'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 h' },
  { value: 90, label: '1h 30 min' },
  { value: 120, label: '2 h' },
]

export interface DurationSelectProps {
  value: number
  onChange: (value: number) => void
  className?: string
  disabled?: boolean
}

const DurationSelect = React.forwardRef<HTMLButtonElement, DurationSelectProps>(
  ({ value, onChange, className, disabled }, ref) => {
    return (
      <Select
        value={value.toString()}
        onValueChange={(v) => onChange(parseInt(v, 10))}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn('bg-card/50 border-border text-foreground', className)}
        >
          <SelectValue placeholder="Seleccionar duración" />
        </SelectTrigger>
        <SelectContent>
          {DURATION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)
DurationSelect.displayName = 'DurationSelect'

export { DurationSelect, DURATION_OPTIONS }

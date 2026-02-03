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

const HOURS_OPTIONS = [
  { value: 0, label: 'Sin restricción' },
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 3, label: '3 horas' },
]

export interface HoursBeforeSelectProps {
  value: number
  onChange: (value: number) => void
  className?: string
  disabled?: boolean
  name?: string
}

const HoursBeforeSelect = React.forwardRef<
  HTMLButtonElement,
  HoursBeforeSelectProps
>(({ value, onChange, className, disabled, name }, ref) => {
  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Select
        value={value.toString()}
        onValueChange={(v) => onChange(parseInt(v, 10))}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn('bg-card/50 border-border text-foreground', className)}
        >
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          {HOURS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
})
HoursBeforeSelect.displayName = 'HoursBeforeSelect'

export { HoursBeforeSelect, HOURS_OPTIONS }

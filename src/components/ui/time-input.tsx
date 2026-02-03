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

export interface TimeInputProps {
  value: string // Format: "HH:MM"
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  minuteStep?: number // Default 5
}

const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
  ({ value, onChange, className, disabled, minuteStep = 5 }, ref) => {
    const [hour, minute] = React.useMemo(() => {
      const parts = value?.split(':') || ['06', '00']
      return [parts[0] || '06', parts[1] || '00']
    }, [value])

    const hours = React.useMemo(
      () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
      []
    )

    const minutes = React.useMemo(
      () =>
        Array.from({ length: 60 / minuteStep }, (_, i) =>
          (i * minuteStep).toString().padStart(2, '0')
        ),
      [minuteStep]
    )

    const handleHourChange = (newHour: string) => {
      onChange(`${newHour}:${minute}`)
    }

    const handleMinuteChange = (newMinute: string) => {
      onChange(`${hour}:${newMinute}`)
    }

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <Select
          value={hour}
          onValueChange={handleHourChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-20 bg-card/50 border-border text-foreground">
            <SelectValue placeholder="Hora" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-foreground/60 text-lg font-medium">:</span>

        <Select
          value={minute}
          onValueChange={handleMinuteChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-20 bg-card/50 border-border text-foreground">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
)
TimeInput.displayName = 'TimeInput'

export { TimeInput }

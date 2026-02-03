'use client'

import { Minus, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
  suffix?: string
  name?: string
}

const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      min = 0,
      max = 999,
      step = 1,
      className,
      disabled,
      suffix,
      name,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? controlledValue ?? min
    )
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const updateValue = (newValue: number) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }

    const handleDecrement = () => {
      const newValue = Math.max(min, value - step)
      updateValue(newValue)
    }

    const handleIncrement = () => {
      const newValue = Math.min(max, value + step)
      updateValue(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!Number.isNaN(newValue)) {
        updateValue(Math.min(max, Math.max(min, newValue)))
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center rounded-md border border-border bg-card/50 w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {name && <input type="hidden" name={name} value={value} />}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="h-10 w-10 shrink-0 rounded-r-none border-r border-border text-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex flex-1 items-center justify-center gap-1 px-2">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-8 bg-transparent text-center text-foreground text-sm font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="text-foreground/60 text-xs shrink-0">{suffix}</span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="h-10 w-10 shrink-0 rounded-l-none border-l border-border text-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }

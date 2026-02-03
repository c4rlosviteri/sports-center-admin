'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onMonthChange?: (year: number, month: number) => void
  classesData?: Record<string, number>
}

export function Calendar({
  selectedDate,
  onDateSelect,
  onMonthChange,
  classesData = {},
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const handlePreviousMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    )
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth.getFullYear(), newMonth.getMonth() + 1)
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    onDateSelect(newDate)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  const getDateKey = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const hasClasses = (day: number) => {
    const key = getDateKey(day)
    const count = classesData?.[key] || 0
    return count > 0
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square p-1" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          type="button"
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            'aspect-square p-2 rounded-lg transition-all relative font-medium',
            'hover:bg-accent hover:scale-105',
            {
              'bg-red-600 hover:bg-red-700 shadow-xl text-foreground':
                isSelected(day),
              'ring-2 ring-ring text-foreground bg-card/50':
                isToday(day) && !isSelected(day),
              'bg-white/5 hover:bg-white/5 text-white':
                !isSelected(day) && !isToday(day),
            }
          )}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className={cn('text-sm', isSelected(day) && 'font-bold')}>
              {day}
            </span>
            {hasClasses(day) && (
              <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2">
                <div
                  className={cn(
                    'w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full shadow-lg',
                    isSelected(day) ? 'bg-white' : 'bg-red-600'
                  )}
                />
              </div>
            )}
          </div>
        </button>
      )
    }

    return days
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="bg-white/5 border-white/20 text-white hover:bg-white/5 hover:border-white/30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="bg-white/5 border-white/20 text-white hover:bg-white/5 hover:border-white/30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider p-2"
          >
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-sm text-gray-400 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg ring-2 ring-white bg-white/5 shrink-0" />
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-red-600 shadow-xl shrink-0" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-white/5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-600 shadow-lg" />
          </div>
          <span>Tiene clases</span>
        </div>
      </div>
    </div>
  )
}

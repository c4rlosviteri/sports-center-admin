/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a date as DD/MM/YYYY with zero padding
 */
export function formatDateDDMMYYYY(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format a date using Intl.DateTimeFormat with zero padding
 */
export function formatDateLocale(date: Date | string): string {
  return formatDateDDMMYYYY(date)
}

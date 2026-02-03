'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface MigrationRunnerProps {
  onMigrationComplete?: () => void
}

export function MigrationRunner({ onMigrationComplete }: MigrationRunnerProps) {
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const runMigrations = async () => {
      if (isRunning) return
      setIsRunning(true)

      try {
        // Run database schema migrations
        const dbResponse = await fetch('/api/admin/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!dbResponse.ok) {
          throw new Error('Failed to run migrations')
        }

        const result = await dbResponse.json()

        if (result.success) {
          if (result.database?.migrationsRun > 0) {
            toast.success(
              `${result.database.migrationsRun} migraciones aplicadas`
            )
          }

          // Refresh the page to show updated data
          if (result.database?.migrationsRun > 0) {
            onMigrationComplete?.()
          }
        } else {
          if (result.database?.errors?.length > 0) {
            console.error('Migration errors:', result.database.errors)
            toast.error('Algunas migraciones fallaron. Revisa la consola.')
          }
        }
      } catch (error) {
        console.error('Error running migrations:', error)
        toast.error('Error al ejecutar migraciones')
      } finally {
        setIsRunning(false)
      }
    }

    runMigrations()
  }, [isRunning, onMigrationComplete])

  return null // This component doesn't render anything
}

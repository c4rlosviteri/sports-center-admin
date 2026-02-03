'use client'

import { ClientCalendar } from './client-calendar'

export function ClassesContent() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Horario de Clases
        </h2>
        <p className="text-gray-400">
          Reserva tu lugar en nuestras clases de cycling. Selecciona una fecha
          en el calendario para ver las clases disponibles.
        </p>
      </div>

      <ClientCalendar />
    </main>
  )
}

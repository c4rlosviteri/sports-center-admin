import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biciantro - Indoor Cycling',
  description: 'Sistema de gestión de clases de cycling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-center"
          closeButton
          toastOptions={{
            style: {
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}

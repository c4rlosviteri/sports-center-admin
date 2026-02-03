'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { forgetPassword } from '~/lib/auth-client'

export default function ForgotPasswordPage() {
  const emailInputId = useId()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const result = await forgetPassword({
        email,
        redirectTo: '/reset-password',
      })

      if (result.error) {
        setError('Error al enviar el correo. Intenta de nuevo.')
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError('Error al enviar el correo. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Biciantro</h1>
          <p className="text-gray-400">Indoor Cycling</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-green-500/20 rounded-lg">
                <p className="text-success text-sm">
                  Si existe una cuenta con ese correo, recibirás un enlace para
                  restablecer tu contraseña. Revisa tu bandeja de entrada y
                  carpeta de spam.
                </p>
              </div>
              <Link href="/login" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5"
                >
                  Volver al Inicio de Sesión
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor={emailInputId}
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id={emailInputId}
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Volver al Inicio de Sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

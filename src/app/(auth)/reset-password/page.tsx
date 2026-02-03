'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { resetPassword } from '~/lib/auth-client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const passwordInputId = useId()
  const confirmPasswordInputId = useId()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setIsLoading(false)
      return
    }

    if (!token) {
      setError('Token de recuperación no válido')
      setIsLoading(false)
      return
    }

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setError(
          'Error al restablecer la contraseña. El enlace puede haber expirado.'
        )
        setIsLoading(false)
        return
      }

      // Redirect to login on success
      router.push('/login?reset=success')
    } catch {
      setError('Error al restablecer la contraseña. Intenta de nuevo.')
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Biciantro</h1>
            <p className="text-gray-400">Indoor Cycling</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-6">
              <p className="text-primary text-sm">
                Enlace de recuperación no válido o expirado. Por favor solicita
                un nuevo enlace.
              </p>
            </div>
            <Link href="/forgot-password" className="cursor-pointer">
              <Button className="w-full" size="lg">
                Solicitar Nuevo Enlace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
            Nueva Contraseña
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor={passwordInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Nueva Contraseña
              </label>
              <input
                id={passwordInputId}
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor={confirmPasswordInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Confirmar Contraseña
              </label>
              <input
                id={confirmPasswordInputId}
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
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
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-white">Cargando...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

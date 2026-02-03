'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '~/lib/auth-client'

export default function LoginPage() {
  const router = useRouter()
  const emailInputId = useId()
  const passwordInputId = useId()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError('Credenciales inválidas')
        setIsLoading(false)
        return
      }

      // Fetch session to determine redirect based on role
      const session = await authClient.getSession()
      const role = (session.data?.user as { role?: string })?.role
      router.push(role === 'client' ? '/client' : '/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/auth/callback',
      })
    } catch {
      setError('Error al iniciar sesión con Google')
      setIsLoading(false)
    }
  }

  const handleAppleLogin = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'apple',
        callbackURL: '/auth/callback',
      })
    } catch {
      setError('Error al iniciar sesión con Apple')
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
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Iniciar Sesión
          </h2>

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

            <div>
              <label
                htmlFor={passwordInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Contraseña
              </label>
              <input
                id={passwordInputId}
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  aria-label="Google"
                >
                  <title>Google</title>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
                onClick={handleAppleLogin}
                disabled={isLoading}
              >
                <svg
                  aria-label="Apple"
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>Apple</title>
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

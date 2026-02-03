'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerAction, validateInviteToken } from '~/actions/auth'
import { signIn } from '~/lib/auth-client'
import { validateEcuadorianCedula } from '~/lib/id-utils'

type TokenStatus = 'loading' | 'valid' | 'used' | 'expired' | 'invalid'

function RegisterForm() {
  const firstNameInputId = useId()
  const lastNameInputId = useId()
  const emailInputId = useId()
  const passwordInputId = useId()
  const dateOfBirthInputId = useId()
  const idNumberInputId = useId()
  const addressInputId = useId()
  const phoneInputId = useId()
  const termsAcceptedInputId = useId()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cedulaError, setCedulaError] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('+593 ')
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('loading')
  const [inviteInfo, setInviteInfo] = useState<{
    branchName?: string
  }>({})

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setTokenStatus('invalid')
        return
      }

      const result = await validateInviteToken(token)
      setTokenStatus(result.status)
      if (result.valid) {
        setInviteInfo({
          branchName: result.branchName,
        })
      }
    }

    checkToken()
  }, [token])

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits except the leading +
    const digits = value.replace(/[^\d]/g, '')

    // Always ensure Ecuador prefix (593)
    let phoneDigits = digits
    if (digits.startsWith('593')) {
      phoneDigits = digits.slice(3)
    } else if (digits.startsWith('0')) {
      // Remove leading 0 if user types it
      phoneDigits = digits.slice(1)
    }

    // Limit to 9 digits (Ecuador mobile numbers)
    phoneDigits = phoneDigits.slice(0, 9)

    // Format as: +593 XXX XXX XXX
    const parts = ['+593']
    if (phoneDigits.length > 0) {
      parts.push(phoneDigits.slice(0, 3))
    }
    if (phoneDigits.length > 3) {
      parts.push(phoneDigits.slice(3, 6))
    }
    if (phoneDigits.length > 6) {
      parts.push(phoneDigits.slice(6, 9))
    }

    return parts.join(' ')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneDisplay(formatted)
  }

  const handleCedulaBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cedula = e.target.value
    if (cedula && !validateEcuadorianCedula(cedula)) {
      setCedulaError('Cédula ecuatoriana inválida')
    } else {
      setCedulaError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const cedula = formData.get('idNumber') as string

    // Validate cedula before submission
    if (!validateEcuadorianCedula(cedula)) {
      setError('Por favor ingresa una cédula ecuatoriana válida')
      setIsLoading(false)
      return
    }

    try {
      formData.append('inviteToken', token || '')
      const result = await registerAction(formData)
      if (result.success && result.credentials) {
        // Sign in using Better Auth client to create proper session
        const signInResult = await signIn.email({
          email: result.credentials.email,
          password: result.credentials.password,
        })

        if (signInResult.error) {
          setError(
            'Registro exitoso pero error al iniciar sesión. Por favor inicia sesión manualmente.'
          )
          setIsLoading(false)
          router.push('/login')
          return
        }

        router.push('/client')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Biciantro</h1>
          <p className="text-gray-400">Registro de Cliente</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            Completa tu Registro
          </h2>

          {tokenStatus === 'loading' && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                Verificando enlace de invitación...
              </p>
            </div>
          )}

          {tokenStatus === 'invalid' && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm">
                No se encontró un enlace de invitación válido. Por favor
                contacta con tu sucursal.
              </p>
            </div>
          )}

          {tokenStatus === 'used' && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Este enlace de invitación ya ha sido utilizado. Si ya te
                registraste, puedes{' '}
                <a href="/login" className="underline hover:text-yellow-400/80">
                  iniciar sesión aquí
                </a>
                . Si necesitas un nuevo enlace, contacta con tu sucursal.
              </p>
            </div>
          )}

          {tokenStatus === 'expired' && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm">
                Este enlace de invitación ha expirado. Por favor contacta con tu
                sucursal para obtener uno nuevo.
              </p>
            </div>
          )}

          {tokenStatus === 'valid' && inviteInfo.branchName && (
            <div className="mb-6 p-4 bg-success/10 border border-green-500/20 rounded-lg">
              <p className="text-success text-sm">
                Te estás registrando en <strong>{inviteInfo.branchName}</strong>
                .
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={firstNameInputId}
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Nombres *
                </label>
                <Input
                  id={firstNameInputId}
                  type="text"
                  name="firstName"
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor={lastNameInputId}
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Apellidos *
                </label>
                <Input
                  id={lastNameInputId}
                  type="text"
                  name="lastName"
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={emailInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Correo Electrónico *
              </label>
              <Input
                id={emailInputId}
                type="email"
                name="email"
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label
                htmlFor={passwordInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Contraseña *
              </label>
              <Input
                id={passwordInputId}
                type="password"
                name="password"
                required
                minLength={8}
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={dateOfBirthInputId}
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Fecha de Nacimiento *
                </label>
                <Input
                  id={dateOfBirthInputId}
                  type="date"
                  name="dateOfBirth"
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor={idNumberInputId}
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Número de Cédula *
                </label>
                <Input
                  id={idNumberInputId}
                  type="text"
                  name="idNumber"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  onBlur={handleCedulaBlur}
                  className="bg-white/10 border-white/20 text-white"
                />
                {cedulaError && (
                  <p className="text-xs text-primary mt-1">{cedulaError}</p>
                )}
                {!cedulaError && (
                  <p className="text-xs text-gray-400 mt-1">10 dígitos</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={addressInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Dirección *
              </label>
              <Input
                id={addressInputId}
                type="text"
                name="address"
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label
                htmlFor={phoneInputId}
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Teléfono *
              </label>
              <Input
                id={phoneInputId}
                type="tel"
                name="phone"
                required
                value={phoneDisplay}
                onChange={handlePhoneChange}
                className="bg-white/10 border-white/20 text-white"
                placeholder="+593 999 999 999"
              />
              <p className="text-xs text-gray-400 mt-1">
                Formato: +593 999 999 999
              </p>
            </div>

            <div className="pt-4">
              <label
                htmlFor={termsAcceptedInputId}
                className="flex items-start space-x-3 cursor-pointer"
              >
                <input
                  id={termsAcceptedInputId}
                  type="checkbox"
                  name="termsAccepted"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-red-600"
                />
                <span className="text-sm text-gray-400">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Términos y condiciones', {
                        description:
                          'Al usar este servicio, aceptas nuestras políticas de uso.',
                        duration: 5000,
                      })
                    }
                    className="text-red-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    términos y condiciones
                  </button>{' '}
                  de uso del servicio *
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={tokenStatus !== 'valid' || isLoading}
              className="w-full mt-6"
              size="lg"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-white">Cargando...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}

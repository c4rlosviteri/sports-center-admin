'use client'

import { Copy, Link2, Share2 } from 'lucide-react'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  generatePackageInvitation,
  getPackageInvitation,
} from '~/actions/package-invitations'

interface Package {
  id: string
  name: string
}

interface SharePackageDialogProps {
  package: Package
}

export function SharePackageDialog({ package: pkg }: SharePackageDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  const invitationUrlId = useId()
  const invitationCodeId = useId()

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const result = await generatePackageInvitation(pkg.id)
      setInvitationUrl(result.invitationUrl)
      setCode(result.code)
      toast.success('Enlace generado exitosamente')
    } catch (error) {
      console.error('Error generating invitation:', error)
      toast.error('Error al generar el enlace')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!invitationUrl) return

    try {
      await navigator.clipboard.writeText(invitationUrl)
      toast.success('Enlace copiado al portapapeles')
    } catch {
      toast.error('Error al copiar el enlace')
    }
  }

  const handleOpen = async () => {
    // Check if there's an existing invitation
    try {
      const existing = await getPackageInvitation(pkg.id)
      if (existing) {
        setInvitationUrl(existing.invitationUrl)
        setCode(existing.code)
      }
    } catch {
      // No existing invitation, that's fine
    }
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-info hover:text-info/80 hover:bg-blue-500/10"
          onClick={handleOpen}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Compartir Paquete
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Genera un enlace de invitación para que los clientes se registren y
            compren el paquete &quot;{pkg.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!invitationUrl ? (
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Genera un enlace único que puedes compartir con tus clientes. Al
                acceder al enlace, podrán registrarse y adquirir este paquete
                automáticamente.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Generando...' : 'Generar Enlace de Invitación'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor={invitationUrlId}
                  className="text-sm text-gray-400"
                >
                  Enlace de invitación:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={invitationUrlId}
                    value={invitationUrl}
                    readOnly
                    className="bg-white/5 border-white/10 text-white flex-1"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/5"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {code && (
                <div className="space-y-2">
                  <Label
                    htmlFor={invitationCodeId}
                    className="text-sm text-gray-400"
                  >
                    Código:
                  </Label>
                  <Input
                    id={invitationCodeId}
                    value={code}
                    readOnly
                    className="bg-white/5 border-white/10 text-white font-mono"
                  />
                </div>
              )}

              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">¿Cómo funciona?</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Copia y comparte el enlace con tus clientes</li>
                  <li>Al acceder, podrán crear una cuenta o iniciar sesión</li>
                  <li>El paquete se asignará automáticamente a su cuenta</li>
                  <li>
                    Podrán pagar y comenzar a usar sus clases inmediatamente
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white/5 border-white/10 text-white hover:bg-white/5"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

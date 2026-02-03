import { Building2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { logoutAction } from '~/actions/auth'
import { BranchSwitcher } from '~/components/branch-switcher'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

interface Branch {
  id: string
  name: string
  isPrimary?: boolean
  isActive?: boolean
}

interface AdminHeaderProps {
  user: {
    firstName?: string | null
    lastName?: string | null
    email: string
    role: string
  }
  currentBranchId: string
  branches: Branch[]
  currentPage?: string
}

const navigationLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    roles: ['admin', 'superuser'],
  },
  {
    href: '/admin/classes',
    label: 'Clases',
    roles: ['admin', 'superuser'],
  },
  {
    href: '/admin/users',
    label: 'Usuarios',
    roles: ['admin', 'superuser'],
  },
  {
    href: '/admin/packages',
    label: 'Paquetes',
    roles: ['admin', 'superuser'],
  },
  {
    href: '/admin/payments',
    label: 'Pagos',
    roles: ['admin', 'superuser'],
  },
  {
    href: '/admin/branches',
    label: 'Sucursales',
    roles: ['superuser'],
  },
]

export function AdminHeader({
  user,
  currentBranchId,
  branches,
  currentPage,
}: AdminHeaderProps) {
  const userRole = user.role as 'admin' | 'superuser'
  const isSuperuser = userRole === 'superuser'

  // Filter navigation links based on user role
  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(userRole)
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Biciantro</h1>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {visibleLinks.map((link) => {
                const isActive =
                  currentPage === link.href ||
                  (link.href !== '/admin' && currentPage?.startsWith(link.href))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Section: Branch Switcher + User Menu */}
          <div className="flex items-center space-x-4">
            {/* Branch Switcher */}
            <div className="hidden md:flex items-center">
              <BranchSwitcher
                currentBranchId={currentBranchId}
                branches={branches}
              />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    {isSuperuser && (
                      <p className="text-xs text-red-400">Superusuario</p>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-900 border-white/20"
              >
                <DropdownMenuLabel className="text-gray-400">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    {isSuperuser && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 w-fit">
                        Superusuario
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                {/* Mobile Branch Switcher */}
                <div className="md:hidden px-2 py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Building2 className="w-3 h-3" />
                    <span>Sucursal actual:</span>
                  </div>
                  <BranchSwitcher
                    currentBranchId={currentBranchId}
                    branches={branches}
                  />
                </div>
                <DropdownMenuSeparator className="bg-white/10 md:hidden" />

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                  {visibleLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-white/10" />
                </div>

                <DropdownMenuItem asChild>
                  <form action={logoutAction} className="w-full">
                    <button
                      type="submit"
                      className="w-full text-left text-gray-400 hover:text-white cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

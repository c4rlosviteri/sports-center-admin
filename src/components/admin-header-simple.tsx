'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { logoutAction } from '~/actions/auth'
import { BranchSwitcher } from '~/components/branch-switcher'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { mutate } = useSWRConfig()

  const handleLogout = () => {
    // Clear all SWR cache entries
    mutate(() => true, undefined, { revalidate: false })
  }

  // Filter navigation links based on user role
  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(userRole)
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Biciantro</h1>
              {isSuperuser && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-medium">
                  Admin
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-1">
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
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Section: Branch Switcher + User Info + Logout */}
          <div className="flex items-center space-x-4">
            {/* Branch Switcher */}
            <div className="hidden sm:block">
              <BranchSwitcher
                currentBranchId={currentBranchId}
                branches={branches}
              />
            </div>

            {/* User Name */}
            <span className="hidden lg:block text-sm text-gray-400">
              {user.firstName} {user.lastName}
            </span>

            {/* Logout Button */}
            <form action={logoutAction} onSubmit={handleLogout}>
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/5"
              >
                Salir
              </button>
            </form>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <>
            {/* Mobile Branch Switcher */}
            <div className="sm:hidden pb-3">
              <BranchSwitcher
                currentBranchId={currentBranchId}
                branches={branches}
              />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-white/10 pt-2 pb-3 space-y-1">
              {visibleLinks.map((link) => {
                const isActive =
                  currentPage === link.href ||
                  (link.href !== '/admin' && currentPage?.startsWith(link.href))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

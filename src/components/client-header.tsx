'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { logoutAction } from '~/actions/auth'

interface ClientHeaderProps {
  user: {
    firstName?: string | null
    lastName?: string | null
    email: string
  }
  currentPage?: string
}

const navigationLinks = [
  { href: '/client', label: 'Dashboard' },
  { href: '/client/classes', label: 'Clases' },
  { href: '/client/payments', label: 'Mis Pagos' },
]

export function ClientHeader({ user, currentPage }: ClientHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/client" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Biciantro</h1>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const isActive =
                  currentPage === link.href ||
                  (link.href !== '/client' &&
                    currentPage?.startsWith(link.href))

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

          {/* Right Section: User Info + Logout */}
          <div className="flex items-center space-x-4">
            {/* User Name */}
            <span className="hidden lg:block text-sm text-gray-400">
              {user.firstName} {user.lastName}
            </span>

            {/* Logout Button */}
            <form action={logoutAction}>
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => {
              const isActive =
                currentPage === link.href ||
                (link.href !== '/client' && currentPage?.startsWith(link.href))

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
        )}
      </div>
    </nav>
  )
}

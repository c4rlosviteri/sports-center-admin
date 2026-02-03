import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from '~/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Skip middleware for API auth routes (Better Auth handles these)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If has session and trying to access auth pages, redirect to appropriate dashboard
  if (session && isPublicRoute) {
    const url = request.nextUrl.clone()
    const role = (session.user as { role?: string }).role
    url.pathname = role === 'client' ? '/client' : '/admin'
    return NextResponse.redirect(url)
  }

  // Check role-based access for authenticated users
  if (session) {
    const role = (session.user as { role?: string }).role
    const isAdmin = role === 'admin' || role === 'superuser'
    const isClient = role === 'client'

    if (pathname.startsWith('/admin') && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/client'
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/client') && !isClient) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

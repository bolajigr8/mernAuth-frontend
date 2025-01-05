import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/home', '/sessions']
const publicRoutes = [
  '/',
  '/signup',
  '/confirm-account',
  'forgot-password',
  'reset-password',
  '/verify-mfa',
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  let accessToken =
    req.cookies.get('accessToken')?.value ||
    req.headers
      .get('cookie')
      ?.split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1]

  if (!accessToken && path !== '/signup' && path !== '/home') {
    accessToken = 'newAccessTokenValue' // Replace with actual token generation logic
    const response = NextResponse.next()
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      path: '/',
    })
    return response
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/signup', req.nextUrl))
  }

  if (isPublicRoute && accessToken && path !== '/logout') {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

  return NextResponse.next()
}

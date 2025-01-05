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

  // Retrieve accessToken from cookies
  let accessToken =
    req.cookies.get('accessToken')?.value ||
    req.headers
      .get('cookie')
      ?.split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1]

  // Handle routes requiring authentication
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/signup', req.nextUrl))
  }

  // Handle public routes when the user is already authenticated
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

  // If no token is found, set a default token for testing (avoid infinite loop)
  if (!accessToken) {
    const response = NextResponse.next()
    response.cookies.set('accessToken', 'testAccessToken', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax', // Ensure the cookie is handled properly
    })
    return response
  }

  return NextResponse.next()
}

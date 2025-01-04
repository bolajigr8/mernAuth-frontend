import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/home', '/sessions']
const publicRoutes = [
  '/',
  '/signup',
  '/confirm-account',
  '/forgot-password',
  '/reset-password',
  '/verify-mfa',
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const accessToken = req.cookies.get('accessToken')?.value

  if (isProtectedRoute) {
    if (!accessToken) {
      console.log('Redirecting to login: missing token')
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    // Optionally validate the token here.
  }

  if (isPublicRoute && accessToken) {
    console.log('Redirecting to home: already logged in')
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

  return NextResponse.next()
}

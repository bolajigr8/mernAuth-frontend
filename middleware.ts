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
      console.log(`Redirecting to login: Path = ${path}`)
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  if (isPublicRoute && accessToken) {
    console.log(`Redirecting to home: Path = ${path}`)
    if (path !== '/home') {
      // Prevent redirecting to '/home' when already on it
      return NextResponse.redirect(new URL('/home', req.nextUrl))
    }
  }

  // Allow all other routes to proceed
  console.log(`Allowing access: Path = ${path}`)
  return NextResponse.next()
}

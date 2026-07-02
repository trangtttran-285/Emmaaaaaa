import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/auth/login')
  const isApi = req.nextUrl.pathname.startsWith('/api/auth')

  if (isApi) return
  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL('/auth/login', req.url))
  }
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL('/records', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

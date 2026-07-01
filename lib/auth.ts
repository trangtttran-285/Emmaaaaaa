import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import type { Role } from '@/types'

// Forward declaration — sheets.ts imports auth.ts so we lazy-import to avoid circular dep
async function getRoleForEmail(email: string): Promise<Role> {
  const { getConfig } = await import('./sheets')
  const config = await getConfig()
  return config[email] ?? 'TA'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email?.endsWith('@crossian.com') ?? false
    },
    async session({ session }) {
      if (session.user?.email) {
        const role = await getRoleForEmail(session.user.email)
        ;(session.user as any).role = role
      }
      return session
    },
  },
})

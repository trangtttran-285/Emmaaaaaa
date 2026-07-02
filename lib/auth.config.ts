import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export const authConfig: NextAuthConfig = {
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
    authorized({ auth }) {
      return !!auth
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}

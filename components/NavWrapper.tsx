'use client'
import { useSession } from 'next-auth/react'
import Nav from './Nav'

export default function NavWrapper() {
  const { data } = useSession()
  if (!data?.user) return null
  return <Nav role={(data.user as any).role ?? 'TA'} name={data.user.name ?? ''} />
}

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role ?? 'TA',
  })
}

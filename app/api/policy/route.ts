import { auth } from '@/lib/auth'
import { getPolicyDocs, syncPolicyDocs } from '@/lib/drive'
import { storeDocs } from '@/lib/drive'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const docs = await getPolicyDocs()
  return NextResponse.json(docs)
}

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role
  if (role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  // Force re-sync: bypass Sheets cache, pull fresh from Drive, then update Sheets
  const docs = await syncPolicyDocs()
  await storeDocs(docs)
  return NextResponse.json(docs)
}

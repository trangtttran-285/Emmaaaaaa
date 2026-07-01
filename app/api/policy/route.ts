import { auth } from '@/lib/auth'
import { getPolicyDocs, syncPolicyDocs } from '@/lib/drive'
import { NextResponse } from 'next/server'
import type { PolicyDoc } from '@/types'

let cache: { docs: PolicyDoc[]; at: number } | null = null
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.docs)
  }

  const docs = await getPolicyDocs()
  cache = { docs, at: Date.now() }
  return NextResponse.json(docs)
}

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role
  if (role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  // Force re-sync: bypass both in-memory and Sheets cache
  cache = null
  const docs = await syncPolicyDocs()
  cache = { docs, at: Date.now() }
  return NextResponse.json(docs)
}

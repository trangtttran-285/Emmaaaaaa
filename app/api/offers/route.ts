import { auth } from '@/lib/auth'
import { getOffers, createOffer, updateOffer } from '@/lib/sheets'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  const taEmail = role === 'TA' ? session.user.email! : undefined
  const offers = await getOffers(taEmail)
  if (role === 'Viewer') {
    return NextResponse.json(offers.map(({ grossNew, vnGross, allowance, monthlyBonus, ...safe }) => safe))
  }
  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role === 'Viewer') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const data = await req.json()
  const offer = await createOffer({ ...data, ta: session.user.email! })
  return NextResponse.json(offer)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as string
  if (role === 'Viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...data } = await req.json()

  // TA can only update their own records
  if (role === 'TA') {
    const all = await getOffers()
    const offer = all.find(o => o.id === id)
    if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (offer.ta !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  await updateOffer(id, data)
  return NextResponse.json({ ok: true })
}

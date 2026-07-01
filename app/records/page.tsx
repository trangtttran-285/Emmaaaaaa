'use client'
import { useEffect, useState } from 'react'
import RecordsTable from '@/components/records/RecordsTable'
import type { OfferRecord } from '@/types'

export default function RecordsPage() {
  const [offers, setOffers] = useState<OfferRecord[]>([])
  const [role, setRole] = useState('TA')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/offers').then(r => r.json()),
      fetch('/api/me').then(r => r.json()),
    ]).then(([offers, me]) => {
      setOffers(offers)
      setRole(me.role)
      setLoading(false)
    })
  }, [])

  async function handleUpdate(id: string, data: Partial<OfferRecord>) {
    await fetch('/api/offers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...data } : o))
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Offer Records</h1>
        <span className="text-sm text-gray-400">{offers.length} records</span>
      </div>
      {loading ? (
        <p className="text-gray-400 text-sm">Đang tải...</p>
      ) : (
        <RecordsTable offers={offers} role={role} onUpdate={handleUpdate} />
      )}
    </main>
  )
}

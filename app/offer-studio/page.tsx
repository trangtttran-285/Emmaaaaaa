'use client'
import { useState } from 'react'
import OfferForm, { DEFAULTS } from '@/components/offer-studio/OfferForm'
import OfferSummary from '@/components/offer-studio/OfferSummary'
import { compute } from '@/components/offer-studio/compute'
import type { OfferInputs } from '@/components/offer-studio/types'

export default function OfferStudioPage() {
  const [inputs, setInputs] = useState<OfferInputs>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const c = compute(inputs)

  async function save() {
    if (!inputs.candidateName || !inputs.startDate) return
    setSaving(true)
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName: inputs.candidateName,
        position: inputs.position,
        level: inputs.level,
        coe: inputs.coe,
        source: inputs.source,
        startDate: inputs.startDate,
        status: 'Pending',
        toPayCom: c.payCom > 0,
        grossNew: inputs.grossNew,
        vnGross: inputs.vnGross,
        allowance: inputs.allowance,
        monthlyBonus: inputs.monthlyBonus,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setToast(`✓ Đã lưu offer — ${inputs.candidateName}`)
      setTimeout(() => setToast(''), 3000)
    } else {
      setToast('Lỗi khi lưu, thử lại.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-semibold">Offer Studio</h1>
      <OfferSummary computed={c} />
      <OfferForm inputs={inputs} onChange={setInputs} />
      <div className="flex items-center gap-3">
        <button
          className="bg-gray-900 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
          onClick={save}
          disabled={saving || !inputs.candidateName || !inputs.startDate}
        >
          {saving ? 'Đang lưu...' : 'Lưu offer'}
        </button>
        {toast && <span className="text-sm text-green-600">{toast}</span>}
      </div>
    </main>
  )
}

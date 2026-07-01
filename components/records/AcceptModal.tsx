'use client'
import { useState } from 'react'
import { calculatePoints, calculatePayCom, isPayComEligible } from '@/lib/commission'
import type { OfferRecord } from '@/types'

interface Props {
  offer: OfferRecord
  onConfirm: (data: Partial<OfferRecord>) => void
  onCancel: () => void
}

const fmtVnd = (v: number) => new Intl.NumberFormat('vi-VN').format(v)

export default function AcceptModal({ offer, onConfirm, onCancel }: Props) {
  const [endProbation, setEndProbation] = useState('')
  const [eligibleMonth, setEligibleMonth] = useState('')

  const points = calculatePoints(offer.level, offer.source, offer.coe)
  const payCom = calculatePayCom(offer.level, offer.source)
  const eligible = isPayComEligible(offer.source)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-base font-semibold mb-1">Xác nhận Accept</h2>
        <p className="text-sm text-gray-500 mb-4">{offer.candidateName} · {offer.level} · {offer.coe}</p>
        <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4 space-y-1">
          <div>Effort Points: <b>{points.toFixed(4)}</b></div>
          <div>Pay COM: <b>{eligible && payCom > 0 ? `${fmtVnd(payCom)}₫` : 'Không áp dụng'}</b>
            {!eligible && <span className="text-gray-400 text-xs ml-1">(Referral/Agency — thuộc BR-01)</span>}
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Ngày kết thúc thử việc</label>
            <input type="date" value={endProbation} onChange={e => setEndProbation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Tháng eligible commission</label>
            <input type="month" value={eligibleMonth} onChange={e => setEligibleMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700"
            onClick={() => onConfirm({
              status: 'Accepted',
              point: points,
              commission: payCom,
              toPayCom: eligible && payCom > 0,
              endProbationDate: endProbation || undefined,
              eligibleCommissionMonth: eligibleMonth || undefined,
            })}
          >
            Xác nhận Accept
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-semibold hover:bg-gray-200"
            onClick={onCancel}>Huỷ</button>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import AcceptModal from './AcceptModal'
import type { OfferRecord } from '@/types'

interface Props {
  offers: OfferRecord[]
  role: string
  onUpdate: (id: string, data: Partial<OfferRecord>) => void
}

const STATUS_STYLE = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Accepted: 'bg-green-50 text-green-700 border-green-200',
  Declined: 'bg-red-50 text-red-700 border-red-200',
}

const fmtVnd = (v?: number) =>
  v ? new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(v) : ''

export default function RecordsTable({ offers, role, onUpdate }: Props) {
  const [acceptTarget, setAcceptTarget] = useState<OfferRecord | null>(null)

  return (
    <>
      {acceptTarget && (
        <AcceptModal
          offer={acceptTarget}
          onConfirm={data => { onUpdate(acceptTarget.id, data); setAcceptTarget(null) }}
          onCancel={() => setAcceptTarget(null)}
        />
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="text-xs border-collapse" style={{ minWidth: 1600 }}>
          <thead className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wide">
            <tr>
              {['No','TA','Candidate','Position','Level','CoE','Start','Status',
                'Source','Referral','Remarks',
              ].map(h => (
                <th key={h} className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
              {role !== 'Viewer' && (
                <th className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">C&amp;B</th>
              )}
              {role !== 'Viewer' && (
                <th className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">Pay?</th>
              )}
              {['Person','End Prob','Elig. Month','1st Pay','Src Inhouse','Type',
              ].map(h => (
                <th key={h} className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
              {role !== 'Viewer' && (
                <th className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">Commission</th>
              )}
              {role !== 'Viewer' && (
                <th className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">CO</th>
              )}
              {['Ref 6M','2nd Pay','Points','Channel',
              ].map(h => (
                <th key={h} className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="px-2.5 py-2 text-left border-b border-gray-200 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2.5 py-2 text-gray-400">{o.no}</td>
                <td className="px-2.5 py-2">{o.ta.replace('@crossian.com', '')}</td>
                <td className="px-2.5 py-2 font-medium text-gray-900 whitespace-nowrap">{o.candidateName}</td>
                <td className="px-2.5 py-2 whitespace-nowrap">{o.position}</td>
                <td className="px-2.5 py-2">{o.level}</td>
                <td className="px-2.5 py-2">{o.coe}</td>
                <td className="px-2.5 py-2 font-mono">{o.startDate}</td>
                <td className="px-2.5 py-2">
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-2.5 py-2 whitespace-nowrap">{o.source}</td>
                <td className="px-2.5 py-2">{o.referralName}</td>
                <td className="px-2.5 py-2 max-w-[100px] truncate" title={o.remarks}>{o.remarks}</td>
                {role !== 'Viewer' && <td className="px-2.5 py-2">{o.cnbCheck}</td>}
                {role !== 'Viewer' && <td className="px-2.5 py-2 text-center">{o.toPayCom ? '✓' : ''}</td>}
                <td className="px-2.5 py-2">{o.personToPayCom}</td>
                <td className="px-2.5 py-2 font-mono">{o.endProbationDate}</td>
                <td className="px-2.5 py-2 font-mono">{o.eligibleCommissionMonth}</td>
                <td className="px-2.5 py-2">{o.firstPaymentStatus}</td>
                <td className="px-2.5 py-2">{o.sourceInhouse}</td>
                <td className="px-2.5 py-2">{o.type}</td>
                {role !== 'Viewer' && <td className="px-2.5 py-2 font-mono text-right">{fmtVnd(o.commission)}</td>}
                {role !== 'Viewer' && <td className="px-2.5 py-2">{o.co}</td>}
                <td className="px-2.5 py-2">{o.eligibleReferral6M}</td>
                <td className="px-2.5 py-2">{o.secondPaymentStatus}</td>
                <td className="px-2.5 py-2 font-mono text-right">{o.point?.toFixed(4)}</td>
                <td className="px-2.5 py-2">{o.sourceChannel}</td>
                <td className="px-2.5 py-2 whitespace-nowrap">
                  {role !== 'Viewer' && o.status === 'Pending' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setAcceptTarget(o)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >Accept</button>
                      <button
                        onClick={() => onUpdate(o.id, { status: 'Declined' })}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >Decline</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr>
                <td colSpan={role !== 'Viewer' ? 26 : 22} className="px-4 py-8 text-center text-gray-400">
                  Chưa có offer nào. Sang Offer Studio để tạo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

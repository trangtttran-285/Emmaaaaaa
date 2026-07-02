'use client'
import { useState } from 'react'
import { searchDocs } from '@/lib/search'
import type { PolicyDoc } from '@/types'

const TYPE_LABELS: Record<PolicyDoc['type'], string> = {
  'tuyen-dung': 'Quy định tuyển dụng',
  'hoa-hong': 'Hoa hồng',
  'tinh-diem': 'Thưởng & Tính điểm',
}

const TYPE_COLORS: Record<PolicyDoc['type'], string> = {
  'tuyen-dung': 'bg-blue-50 text-blue-700 border-blue-200',
  'hoa-hong': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'tinh-diem': 'bg-violet-50 text-violet-700 border-violet-200',
}

const LEVEL_TABLE = [
  { grade: 'Intern',            points: 0.5, payCom: null },
  { grade: 'Junior',            points: 1,   payCom: 3_000_000 },
  { grade: 'Intermediate',      points: 2,   payCom: 4_000_000 },
  { grade: 'Senior',            points: 3,   payCom: 5_000_000 },
  { grade: 'Team Lead',         points: 4,   payCom: 8_000_000 },
  { grade: 'Functional Leader', points: 4,   payCom: 8_000_000 },
  { grade: 'Manager',           points: 6,   payCom: 12_000_000 },
]

const SOURCING_TABLE = [
  { source: 'TA Headhunt',                  mult: 1.25, payCom: true  },
  { source: 'Sourced',                      mult: 1.00, payCom: true  },
  { source: 'Employee Referral (Passive)',  mult: 0.75, payCom: false },
  { source: 'Employee Referral (Active)',   mult: 0.50, payCom: false },
  { source: 'Headhunt (Agency)',            mult: 0.25, payCom: false },
]

const COE_TABLE = [
  { coe: 'SCE',        mult: 1.25 }, { coe: 'CPM.PMKT',  mult: 1.25 },
  { coe: 'CPM.CONT',   mult: 1.25 }, { coe: 'CPM.CREAT', mult: 1.00 },
  { coe: 'CPM.CDM',    mult: 1.00 }, { coe: 'POE',        mult: 1.00 },
  { coe: 'RFS',        mult: 1.00 }, { coe: 'Tech.PMI',   mult: 1.25 },
  { coe: 'BEVA.TP',    mult: 1.25 }, { coe: 'BEVA.3D',    mult: 1.00 },
  { coe: 'BEVA.FD',    mult: 1.25 }, { coe: 'BEVA.PM',    mult: 1.25 },
  { coe: 'BEVA.PC',    mult: 1.00 }, { coe: 'POE.Legal',  mult: 1.25 },
  { coe: 'CEE',        mult: 1.00 },
]

function fmt(n: number | null) {
  if (n === null) return '—'
  return n.toLocaleString('vi-VN') + ' ₫'
}

function multColor(m: number) {
  if (m >= 1.25) return 'text-emerald-700 font-semibold'
  if (m === 1.00) return 'text-gray-700'
  if (m === 0.75) return 'text-amber-600'
  if (m === 0.50) return 'text-orange-600'
  return 'text-red-500'
}

interface Props { docs: PolicyDoc[] }

export default function PolicySearch({ docs }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PolicyDoc['type'] | 'all'>('all')
  const [activeDoc, setActiveDoc] = useState<string | null>(null)

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)
  const results = query.trim() ? searchDocs(filtered, query) : []
  const hasTA01 = docs.some(d => d.name.includes('TA-01'))

  return (
    <div className="space-y-6">

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Tìm kiếm trong tài liệu… (VD: headhunt, thử việc, multiplier)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filter}
          onChange={e => setFilter(e.target.value as PolicyDoc['type'] | 'all')}
        >
          <option value="all">Tất cả loại</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Không tìm thấy kết quả cho &ldquo;{query}&rdquo;</p>
          ) : (
            <>
              <p className="text-xs text-gray-500">{results.length} kết quả</p>
              {results.map(r => (
                <div key={r.doc.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-gray-900">{r.doc.name}</span>
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${TYPE_COLORS[r.doc.type]}`}>
                      {TYPE_LABELS[r.doc.type]}
                    </span>
                  </div>
                  <p className="policy-snippet text-sm leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: r.snippet }} />
                  <a
                    href={`https://docs.google.com/document/d/${r.doc.driveFileId}/edit`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800"
                  >
                    Mở tài liệu gốc ↗
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Document library + quick reference — show when not searching */}
      {!query.trim() && (
        <div className="space-y-6">

          {/* Document cards */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Tài liệu</h2>
            <div className="grid grid-cols-1 gap-3">
              {docs.map(d => (
                <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs border px-2 py-0.5 rounded-full ${TYPE_COLORS[d.type]}`}>
                          {TYPE_LABELS[d.type]}
                        </span>
                        {d.name.includes('TA-01') && (
                          <span className="text-xs text-gray-400">v1.0 · Hiệu lực 01/09/2025</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://docs.google.com/document/d/${d.driveFileId}/edit`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Mở ↗
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference — TA-01 */}
          {hasTA01 && (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tra cứu nhanh — TA-01</h2>

              {/* Formula */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4">
                <p className="text-xs text-violet-500 mb-1 font-medium uppercase tracking-wider">Công thức tính điểm</p>
                <p className="text-sm font-mono font-semibold text-violet-900">
                  Effort Points = Level Points × Sourcing Multiplier × CoE Multiplier
                </p>
              </div>

              {/* Level Points + Pay COM */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Level Points & Pay COM</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-100">
                      <th className="text-left px-4 py-2 font-medium">Cấp bậc</th>
                      <th className="text-center px-4 py-2 font-medium">Level Points</th>
                      <th className="text-right px-4 py-2 font-medium">Pay COM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEVEL_TABLE.map(r => (
                      <tr key={r.grade} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-900">{r.grade}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-violet-700">{r.points}</td>
                        <td className={`px-4 py-2.5 text-right ${r.payCom ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                          {fmt(r.payCom)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sourcing Multiplier */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Sourcing Multiplier</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-100">
                      <th className="text-left px-4 py-2 font-medium">Nguồn</th>
                      <th className="text-center px-4 py-2 font-medium">Multiplier</th>
                      <th className="text-center px-4 py-2 font-medium">Pay COM cho TA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SOURCING_TABLE.map(r => (
                      <tr key={r.source} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-900">{r.source}</td>
                        <td className={`px-4 py-2.5 text-center ${multColor(r.mult)}`}>{r.mult.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-center">
                          {r.payCom
                            ? <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium">✓ Có</span>
                            : <span className="text-gray-400 text-xs">Không</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CoE Multiplier */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">CoE Multiplier</p>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2">
                  {COE_TABLE.map(r => (
                    <div key={r.coe} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                      r.mult >= 1.25 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="text-xs font-medium text-gray-800">{r.coe}</span>
                      <span className={`text-xs font-bold ${r.mult >= 1.25 ? 'text-emerald-700' : 'text-gray-500'}`}>{r.mult.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { searchDocs } from '@/lib/search'
import type { PolicyDoc } from '@/types'

const TYPE_LABELS: Record<PolicyDoc['type'], string> = {
  'tuyen-dung': 'Quy định tuyển dụng',
  'hoa-hong': 'Hoa hồng',
  'tinh-diem': 'Tính điểm TA',
}

interface Props { docs: PolicyDoc[] }

export default function PolicySearch({ docs }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PolicyDoc['type'] | 'all'>('all')

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)
  const results = query.trim() ? searchDocs(filtered, query) : []

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm quy định… (VD: headhunt, thử việc, multiplier)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filter}
          onChange={e => setFilter(e.target.value as PolicyDoc['type'] | 'all')}
        >
          <option value="all">Tất cả</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {query && results.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">
          Không tìm thấy kết quả cho &ldquo;{query}&rdquo;
        </p>
      )}

      {results.map(r => (
        <div key={r.doc.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">{r.doc.name}</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[r.doc.type]}
            </span>
          </div>
          <p
            className="policy-snippet text-sm leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: r.snippet }}
          />
        </div>
      ))}

      {!query.trim() && (
        <div className="grid grid-cols-3 gap-3">
          {docs.map(d => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="font-medium text-sm text-gray-900 mb-1">{d.name}</div>
              <div className="text-xs text-gray-400">{TYPE_LABELS[d.type]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

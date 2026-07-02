'use client'
import { useEffect, useState } from 'react'
import PolicySearch from '@/components/policy/PolicySearch'
import type { PolicyDoc } from '@/types'

export default function PolicyPage() {
  const [docs, setDocs] = useState<PolicyDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/policy')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setDocs(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tài liệu Chính sách</h1>
        <p className="text-sm text-gray-500 mt-1">Tra cứu quy định tuyển dụng, thưởng và tính điểm TA</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Đang tải tài liệu...
        </div>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">Chưa có tài liệu nào.</p>
      ) : (
        <PolicySearch docs={docs} />
      )}
    </main>
  )
}

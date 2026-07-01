'use client'
import { useEffect, useState } from 'react'
import PolicySearch from '@/components/policy/PolicySearch'
import type { PolicyDoc } from '@/types'

export default function PolicyPage() {
  const [docs, setDocs] = useState<PolicyDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/policy').then(r => r.json()).then(d => {
      setDocs(d)
      setLoading(false)
    })
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-semibold">Policy Search</h1>
      {loading ? (
        <p className="text-sm text-gray-400">Đang tải tài liệu từ Drive...</p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400">
          Chưa có tài liệu. Upload file PDF/DOCX vào Google Drive folder để bắt đầu.
        </p>
      ) : (
        <PolicySearch docs={docs} />
      )}
    </main>
  )
}

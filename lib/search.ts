import type { PolicyDoc } from '@/types'

export interface SearchResult {
  doc: PolicyDoc
  snippet: string
  score: number
}

export function searchDocs(docs: PolicyDoc[], query: string): SearchResult[] {
  if (!query.trim()) return []
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results: SearchResult[] = []

  for (const doc of docs) {
    const lower = doc.text.toLowerCase()
    // All terms must appear in the document
    const termCounts = terms.map(term =>
      (lower.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length
    )
    if (termCounts.some(c => c === 0)) continue
    const score = termCounts.reduce((s, c) => s + c, 0)

    const firstIdx = lower.indexOf(terms[0])
    const start = Math.max(0, firstIdx - 80)
    const end = Math.min(doc.text.length, firstIdx + 200)
    let snippet = doc.text.slice(start, end)

    for (const term of terms) {
      snippet = snippet.replace(
        new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<mark>$1</mark>'
      )
    }
    if (start > 0) snippet = '…' + snippet
    if (end < doc.text.length) snippet += '…'

    results.push({ doc, snippet, score })
  }

  return results.sort((a, b) => b.score - a.score)
}

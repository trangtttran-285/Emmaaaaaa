import type { PolicyDoc } from '@/types'

export interface SearchResult {
  doc: PolicyDoc
  snippet: string
  score: number
}

// Build a Unicode-aware word-boundary pattern: the term must not be immediately
// preceded or followed by a Unicode letter or digit, so that e.g. 'gi' does not
// match inside the Vietnamese word 'giờ'.
function wordBoundaryRe(term: string, flags: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<!\\p{L}|\\p{N})${escaped}(?!\\p{L}|\\p{N})`, flags + 'u')
}

export function searchDocs(docs: PolicyDoc[], query: string): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  const results: SearchResult[] = []

  for (const doc of docs) {
    const lower = doc.text.toLowerCase()
    const score = terms.reduce((s, term) => {
      return s + (lower.match(wordBoundaryRe(term, 'g')) ?? []).length
    }, 0)
    if (score === 0) continue  // OR: skip only if NO terms matched

    const firstIdx = Math.max(0, lower.search(wordBoundaryRe(terms[0], '')))
    const start = Math.max(0, firstIdx - 60)
    const end = Math.min(doc.text.length, start + 200)
    let snippet = doc.text.slice(start, end)
    for (const term of terms) {
      snippet = snippet.replace(wordBoundaryRe(term, 'gi'), '<mark>$&</mark>')
    }
    results.push({ doc, snippet, score })
  }

  return results.sort((a, b) => b.score - a.score)
}

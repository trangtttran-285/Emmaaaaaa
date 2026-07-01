import { searchDocs } from '../search'
import type { PolicyDoc } from '@/types'

const docs: PolicyDoc[] = [
  {
    id: '1', name: 'Quy định hoa hồng', type: 'hoa-hong',
    text: 'TA Headhunt có Sourcing Multiplier là 1.25. Sourced có multiplier 1.00.',
    driveFileId: 'abc',
  },
  {
    id: '2', name: 'Quy định tuyển dụng', type: 'tuyen-dung',
    text: 'TA phải cập nhật SageHR trong vòng 24 giờ.',
    driveFileId: 'def',
  },
]

test('finds doc matching keyword', () => {
  const results = searchDocs(docs, 'headhunt')
  expect(results).toHaveLength(1)
  expect(results[0].doc.id).toBe('1')
})

test('returns empty array for no match', () => {
  expect(searchDocs(docs, 'khong co gi')).toHaveLength(0)
})

test('highlights matched term in snippet', () => {
  const results = searchDocs(docs, 'SageHR')
  expect(results[0].snippet).toContain('<mark>')
})

test('search is case-insensitive', () => {
  expect(searchDocs(docs, 'HEADHUNT')).toHaveLength(1)
})

test('empty query returns empty array', () => {
  expect(searchDocs(docs, '')).toHaveLength(0)
  expect(searchDocs(docs, '   ')).toHaveLength(0)
})

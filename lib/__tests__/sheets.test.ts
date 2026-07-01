import { rowToOffer, offerToRow } from '../sheets'

const mockRow = [
  'offer-1', '1', 'ta@crossian.com', 'Nguyen Van A', 'Engineer', 'Senior',
  'SCE', '2026-07-01', 'Pending', 'Sourced', '', '', '', 'false',
  '', '', '', '', '', '', '0', '', '', '', '0', '', '', '', '', ''
]

test('rowToOffer parses sheet row correctly', () => {
  const offer = rowToOffer('offer-1', mockRow)
  expect(offer.id).toBe('offer-1')
  expect(offer.candidateName).toBe('Nguyen Van A')
  expect(offer.level).toBe('Senior')
  expect(offer.toPayCom).toBe(false)
  expect(offer.commission).toBe(0)
  expect(offer.point).toBe(0)
})

test('offerToRow serializes offer correctly', () => {
  const offer = {
    id: 'offer-1', no: 1, ta: 'ta@crossian.com',
    candidateName: 'Test', position: 'Engineer',
    level: 'Junior' as const, coe: 'POE' as const,
    startDate: '2026-07-01', status: 'Pending' as const,
    source: 'Sourced' as const, toPayCom: true, commission: 3000000, point: 1,
  }
  const row = offerToRow(offer)
  expect(row[2]).toBe('ta@crossian.com')
  expect(row[3]).toBe('Test')
  expect(row[13]).toBe('true')
  expect(row[20]).toBe('3000000')
  expect(row[24]).toBe('1')
})

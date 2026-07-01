import { google } from 'googleapis'
import type { OfferRecord, Role } from '@/types'

const OFFERS_SHEET = 'offers'
const CONFIG_SHEET = 'config'

// Column indices in the "offers" sheet (0-indexed, row 1 = header, data from row 2)
const C = {
  id: 0, no: 1, ta: 2, candidateName: 3, position: 4, level: 5,
  coe: 6, startDate: 7, status: 8, source: 9, referralName: 10,
  remarks: 11, cnbCheck: 12, toPayCom: 13, personToPayCom: 14,
  endProbationDate: 15, eligibleCommissionMonth: 16,
  firstPaymentStatus: 17, sourceInhouse: 18, type: 19,
  commission: 20, co: 21, eligibleReferral6M: 22,
  secondPaymentStatus: 23, point: 24, sourceChannel: 25,
  grossNew: 26, vnGross: 27, allowance: 28, monthlyBonus: 29,
} as const

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: Buffer.from(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY!,
        'base64'
      ).toString('utf-8'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

export function rowToOffer(id: string, row: string[]): OfferRecord {
  const g = (i: number) => row[i] ?? ''
  return {
    id,
    no: parseInt(g(C.no)) || 0,
    ta: g(C.ta),
    candidateName: g(C.candidateName),
    position: g(C.position),
    level: g(C.level) as OfferRecord['level'],
    coe: g(C.coe) as OfferRecord['coe'],
    startDate: g(C.startDate),
    status: (g(C.status) || 'Pending') as OfferRecord['status'],
    source: g(C.source) as OfferRecord['source'],
    referralName: g(C.referralName) || undefined,
    remarks: g(C.remarks) || undefined,
    cnbCheck: g(C.cnbCheck) || undefined,
    toPayCom: g(C.toPayCom) === 'true',
    personToPayCom: g(C.personToPayCom) || undefined,
    endProbationDate: g(C.endProbationDate) || undefined,
    eligibleCommissionMonth: g(C.eligibleCommissionMonth) || undefined,
    firstPaymentStatus: g(C.firstPaymentStatus) || undefined,
    sourceInhouse: g(C.sourceInhouse) || undefined,
    type: g(C.type) || undefined,
    commission: parseFloat(g(C.commission)) || 0,
    co: g(C.co) || undefined,
    eligibleReferral6M: g(C.eligibleReferral6M) || undefined,
    secondPaymentStatus: g(C.secondPaymentStatus) || undefined,
    point: parseFloat(g(C.point)) || 0,
    sourceChannel: g(C.sourceChannel) || undefined,
    grossNew: parseFloat(g(C.grossNew)) || undefined,
    vnGross: parseFloat(g(C.vnGross)) || undefined,
    allowance: parseFloat(g(C.allowance)) || undefined,
    monthlyBonus: parseFloat(g(C.monthlyBonus)) || undefined,
  }
}

export function offerToRow(offer: Partial<OfferRecord>): string[] {
  const row = new Array(30).fill('')
  row[C.id] = offer.id ?? ''
  row[C.no] = String(offer.no ?? '')
  row[C.ta] = offer.ta ?? ''
  row[C.candidateName] = offer.candidateName ?? ''
  row[C.position] = offer.position ?? ''
  row[C.level] = offer.level ?? ''
  row[C.coe] = offer.coe ?? ''
  row[C.startDate] = offer.startDate ?? ''
  row[C.status] = offer.status ?? 'Pending'
  row[C.source] = offer.source ?? ''
  row[C.referralName] = offer.referralName ?? ''
  row[C.remarks] = offer.remarks ?? ''
  row[C.cnbCheck] = offer.cnbCheck ?? ''
  row[C.toPayCom] = String(offer.toPayCom ?? false)
  row[C.personToPayCom] = offer.personToPayCom ?? ''
  row[C.endProbationDate] = offer.endProbationDate ?? ''
  row[C.eligibleCommissionMonth] = offer.eligibleCommissionMonth ?? ''
  row[C.firstPaymentStatus] = offer.firstPaymentStatus ?? ''
  row[C.sourceInhouse] = offer.sourceInhouse ?? ''
  row[C.type] = offer.type ?? ''
  row[C.commission] = String(offer.commission ?? 0)
  row[C.co] = offer.co ?? ''
  row[C.eligibleReferral6M] = offer.eligibleReferral6M ?? ''
  row[C.secondPaymentStatus] = offer.secondPaymentStatus ?? ''
  row[C.point] = String(offer.point ?? 0)
  row[C.sourceChannel] = offer.sourceChannel ?? ''
  row[C.grossNew] = offer.grossNew != null ? String(offer.grossNew) : ''
  row[C.vnGross] = offer.vnGross != null ? String(offer.vnGross) : ''
  row[C.allowance] = offer.allowance != null ? String(offer.allowance) : ''
  row[C.monthlyBonus] = offer.monthlyBonus != null ? String(offer.monthlyBonus) : ''
  return row
}

export async function getOffers(taEmail?: string): Promise<OfferRecord[]> {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${OFFERS_SHEET}!A2:AD`,
  })
  const rows = (res.data.values ?? []) as string[][]
  const offers = rows.map((row, i) => rowToOffer(row[C.id] || `row-${i + 2}`, row))
  return taEmail ? offers.filter(o => o.ta === taEmail) : offers
}

export async function createOffer(
  data: Omit<OfferRecord, 'id' | 'no'>
): Promise<OfferRecord> {
  const existing = await getOffers()
  const no = existing.length + 1
  const id = `offer-${Date.now()}`
  const row = offerToRow({ ...data, id, no })
  const sheets = getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: `${OFFERS_SHEET}!A:AD`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
  return rowToOffer(id, row)
}

export async function updateOffer(
  rowId: string,
  data: Partial<OfferRecord>
): Promise<void> {
  const all = await getOffers()
  const existing = all.find(o => o.id === rowId)
  if (!existing) throw new Error(`Offer ${rowId} not found`)
  // Find the actual row number in the sheet (header is row 1, data starts row 2)
  const rowIndex = all.findIndex(o => o.id === rowId)
  const sheetRow = rowIndex + 2
  const updated = offerToRow({ ...existing, ...data })
  const sheets = getSheetsClient()
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range: `${OFFERS_SHEET}!A${sheetRow}:AD${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [updated] },
  })
}

export async function getConfig(): Promise<Record<string, Role>> {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${CONFIG_SHEET}!A2:B`,
  })
  const rows = (res.data.values ?? []) as string[][]
  return Object.fromEntries(rows.map(([email, role]) => [email, role as Role]))
}

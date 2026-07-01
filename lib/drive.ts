import { google } from 'googleapis'
import type { PolicyDoc } from '@/types'

const POLICY_SHEET = 'policy_docs'

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: Buffer.from(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY!,
        'base64'
      ).toString('utf-8'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
  return google.drive({ version: 'v3', auth })
}

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

function inferDocType(name: string): PolicyDoc['type'] {
  const lower = name.toLowerCase()
  if (lower.includes('tuyen-dung') || lower.includes('tuyen dung') || lower.includes('tuyendung')) return 'tuyen-dung'
  if (lower.includes('hoa-hong') || lower.includes('hoa hong') || lower.includes('hoahong')) return 'hoa-hong'
  return 'tinh-diem'
}

async function extractText(drive: ReturnType<typeof getDriveClient>, fileId: string, mimeType: string): Promise<string> {
  if (mimeType === 'application/vnd.google-apps.document') {
    const res = await drive.files.export(
      { fileId, mimeType: 'text/plain' },
      { responseType: 'text' }
    )
    return res.data as string
  }

  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  )
  const buffer = Buffer.from(res.data as ArrayBuffer)

  if (mimeType === 'application/pdf') {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const result = await parser.getText()
    return result.text
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  return ''
}

async function getStoredDocs(): Promise<PolicyDoc[]> {
  try {
    const sheets = getSheetsClient()
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${POLICY_SHEET}!A2:E`,
    })
    const rows = (res.data.values ?? []) as string[][]
    if (rows.length === 0) return []
    return rows.map(row => ({
      id: row[0] ?? '',
      name: row[1] ?? '',
      type: (row[2] ?? 'tinh-diem') as PolicyDoc['type'],
      text: row[3] ?? '',
      driveFileId: row[4] ?? '',
    })).filter(d => d.id && d.name)
  } catch {
    return []
  }
}

async function storeDocs(docs: PolicyDoc[]): Promise<void> {
  try {
    const sheets = getSheetsClient()
    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.SHEET_ID,
      range: `${POLICY_SHEET}!A2:E`,
    })
    if (docs.length === 0) return
    const rows = docs.map(d => [d.id, d.name, d.type, d.text, d.driveFileId])
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: `${POLICY_SHEET}!A:E`,
      valueInputOption: 'RAW',
      requestBody: { values: rows },
    })
  } catch {
    // Non-fatal: Sheets write failure shouldn't break the main flow
  }
}

export async function getPolicyDocs(): Promise<PolicyDoc[]> {
  // Try Sheets cache first
  const stored = await getStoredDocs()
  if (stored.length > 0) return stored

  // Fall back to Drive sync
  const docs = await syncPolicyDocs()
  await storeDocs(docs)
  return docs
}

async function syncPolicyDocs(): Promise<PolicyDoc[]> {
  const drive = getDriveClient()
  const list = await drive.files.list({
    q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id,name,mimeType)',
  })

  const docs: PolicyDoc[] = []
  for (const file of list.data.files ?? []) {
    if (!file.id || !file.name) continue
    try {
      const text = await extractText(drive, file.id, file.mimeType ?? '')
      if (text.trim()) {
        docs.push({
          id: file.id,
          name: file.name,
          type: inferDocType(file.name),
          text,
          driveFileId: file.id,
        })
      }
    } catch {
      // Skip files that can't be parsed (images, unsupported formats)
    }
  }
  return docs
}

export { syncPolicyDocs }

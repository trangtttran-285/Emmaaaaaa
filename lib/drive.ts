import { google } from 'googleapis'
import type { PolicyDoc } from '@/types'

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

export async function getPolicyDocs(): Promise<PolicyDoc[]> {
  const drive = getDriveClient()
  const list = await drive.files.list({
    q: `'${process.env.DRIVE_FOLDER_ID}' in parents and trashed=false`,
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

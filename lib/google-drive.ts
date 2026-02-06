import { google } from 'googleapis'

// Service account authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})

const drive = google.drive({ version: 'v3', auth })

export interface DriveFile {
  id: string
  name: string
  mimeType: string
}

// List files in a folder
export async function listFilesInFolder(folderId: string): Promise<DriveFile[]> {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  })

  return (response.data.files || []) as DriveFile[]
}

// Get JSON file content
export async function getJsonFile<T>(fileId: string): Promise<T> {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'json' }
  )

  return response.data as T
}

// Get file content as text
export async function getFileContent(fileId: string): Promise<string> {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  )

  return response.data as string
}

// Find file by name in folder
export async function findFileByName(
  folderId: string,
  fileName: string
): Promise<DriveFile | null> {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
    fields: 'files(id, name, mimeType)',
  })

  const files = response.data.files || []
  return files.length > 0 ? (files[0] as DriveFile) : null
}

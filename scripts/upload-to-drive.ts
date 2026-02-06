import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
})

const drive = google.drive({ version: 'v3', auth })

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!

async function uploadFile(filePath: string) {
  const fileName = path.basename(filePath)

  // Check if file already exists
  const existing = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
    fields: 'files(id, name)',
  })

  if (existing.data.files && existing.data.files.length > 0) {
    // Update existing file
    const fileId = existing.data.files[0].id!
    await drive.files.update({
      fileId,
      media: {
        mimeType: 'application/json',
        body: fs.createReadStream(filePath),
      },
    })
    console.log(`  ✓ Updated: ${fileName}`)
  } else {
    // Create new file
    await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: 'application/json',
        body: fs.createReadStream(filePath),
      },
    })
    console.log(`  ✓ Uploaded: ${fileName}`)
  }
}

async function main() {
  console.log('Uploading data files to Google Drive...\n')

  const dataDir = path.join(process.cwd(), 'data')
  const files = ['employees.json', 'repositories.json', 'projects.json']

  for (const file of files) {
    await uploadFile(path.join(dataDir, file))
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)

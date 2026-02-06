/**
 * Sync data from Google Drive to Supabase with embeddings
 *
 * Usage: npm run sync
 *
 * Expects these files in the Google Drive folder:
 * - employees.json
 * - repositories.json
 * - projects.json
 */

import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})

const drive = google.drive({ version: 'v3', auth })

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!

interface Employee {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  experience_years: number
  certifications: string[]
  languages: string[]
  bio: string
}

interface Repository {
  id: string
  name: string
  description: string
  language: string
  technologies: string[]
  cloud: string
  features: string[]
  metrics: string
  status: string
}

interface Project {
  id: string
  name: string
  client: string
  industry: string
  duration: string
  value: string
  status: string
  description: string
  technologies: string[]
  capabilities: string[]
  outcomes: string[]
  team_size: number
}

async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

function employeeToText(emp: Employee): string {
  return `${emp.name} - ${emp.role} in ${emp.department}
Skills: ${emp.skills.join(', ')}
Experience: ${emp.experience_years} years
Certifications: ${emp.certifications.join(', ')}
Languages: ${emp.languages.join(', ')}
${emp.bio}`
}

function repoToText(repo: Repository): string {
  return `${repo.name}: ${repo.description}
Language: ${repo.language}
Technologies: ${repo.technologies.join(', ')}
Cloud: ${repo.cloud}
Features: ${repo.features.join(', ')}
Metrics: ${repo.metrics}`
}

function projectToText(proj: Project): string {
  return `${proj.name} - ${proj.client}
Industry: ${proj.industry}
Duration: ${proj.duration}, Value: ${proj.value}
Description: ${proj.description}
Technologies: ${proj.technologies.join(', ')}
Capabilities: ${proj.capabilities.join(', ')}
Outcomes: ${proj.outcomes.join('; ')}
Team size: ${proj.team_size}`
}

async function getJsonFromDrive<T>(fileName: string): Promise<T | null> {
  try {
    // Find the file in the folder
    const response = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
      fields: 'files(id, name)',
    })

    const files = response.data.files || []
    if (files.length === 0) {
      console.log(`  ⚠ File not found: ${fileName}`)
      return null
    }

    // Get file content
    const fileId = files[0].id!
    const content = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'text' }
    )

    return JSON.parse(content.data as string) as T
  } catch (error) {
    console.error(`Error fetching ${fileName}:`, error)
    return null
  }
}

async function syncEmployees(employees: Employee[]) {
  console.log(`\nSyncing ${employees.length} employees...`)

  for (const emp of employees) {
    const text = employeeToText(emp)
    const embedding = await createEmbedding(text)

    const { error } = await supabase.from('employees').upsert({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      skills: emp.skills,
      experience_years: emp.experience_years,
      certifications: emp.certifications,
      languages: emp.languages,
      bio: emp.bio,
      embedding,
    })

    if (error) {
      console.error(`  ✗ ${emp.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${emp.name}`)
    }
  }
}

async function syncRepositories(repos: Repository[]) {
  console.log(`\nSyncing ${repos.length} repositories...`)

  for (const repo of repos) {
    const text = repoToText(repo)
    const embedding = await createEmbedding(text)

    const { error } = await supabase.from('repositories').upsert({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      technologies: repo.technologies,
      cloud: repo.cloud,
      features: repo.features,
      metrics: repo.metrics,
      status: repo.status,
      embedding,
    })

    if (error) {
      console.error(`  ✗ ${repo.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${repo.name}`)
    }
  }
}

async function syncProjects(projects: Project[]) {
  console.log(`\nSyncing ${projects.length} projects...`)

  for (const proj of projects) {
    const text = projectToText(proj)
    const embedding = await createEmbedding(text)

    const { error } = await supabase.from('projects').upsert({
      id: proj.id,
      name: proj.name,
      client: proj.client,
      industry: proj.industry,
      duration: proj.duration,
      value: proj.value,
      status: proj.status,
      description: proj.description,
      technologies: proj.technologies,
      capabilities: proj.capabilities,
      outcomes: proj.outcomes,
      team_size: proj.team_size,
      embedding,
    })

    if (error) {
      console.error(`  ✗ ${proj.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${proj.name}`)
    }
  }
}

async function main() {
  console.log('🐱 AskCat Data Sync')
  console.log('==================')
  console.log(`Drive Folder ID: ${DRIVE_FOLDER_ID}`)

  // Fetch data from Google Drive
  console.log('\nFetching data from Google Drive...')

  const employees = await getJsonFromDrive<Employee[]>('employees.json')
  const repositories = await getJsonFromDrive<Repository[]>('repositories.json')
  const projects = await getJsonFromDrive<Project[]>('projects.json')

  // Sync to Supabase
  if (employees) await syncEmployees(employees)
  if (repositories) await syncRepositories(repositories)
  if (projects) await syncProjects(projects)

  console.log('\n✅ Sync complete!')
}

main().catch(console.error)

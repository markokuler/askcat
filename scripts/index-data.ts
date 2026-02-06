import { LocalIndex } from 'vectra'
import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Employee {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  experience_years: number
  certifications: string[]
  languages: string[]
  projects: string[]
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
  team: string[]
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
  key_people: string[]
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
Metrics: ${repo.metrics}
Status: ${repo.status}`
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

async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

async function main() {
  console.log('Starting indexing...')

  const indexPath = path.join(process.cwd(), '.index')
  const index = new LocalIndex(indexPath)

  // Create fresh index
  if (await index.isIndexCreated()) {
    console.log('Deleting existing index...')
    await index.deleteIndex()
  }
  await index.createIndex()
  console.log('Created new index')

  // Load data
  const dataPath = path.join(process.cwd(), 'data')
  const employees: Employee[] = JSON.parse(fs.readFileSync(path.join(dataPath, 'employees.json'), 'utf-8'))
  const repositories: Repository[] = JSON.parse(fs.readFileSync(path.join(dataPath, 'repositories.json'), 'utf-8'))
  const projects: Project[] = JSON.parse(fs.readFileSync(path.join(dataPath, 'projects.json'), 'utf-8'))

  console.log(`Loaded ${employees.length} employees, ${repositories.length} repos, ${projects.length} projects`)

  // Index employees
  console.log('Indexing employees...')
  for (const emp of employees) {
    const text = employeeToText(emp)
    const embedding = await createEmbedding(text)
    await index.insertItem({
      id: emp.id,
      vector: embedding,
      metadata: {
        type: 'employee',
        name: emp.name,
        role: emp.role,
        department: emp.department,
        skills: emp.skills.join(', '),
        text: text,
      },
    })
    console.log(`  ✓ ${emp.name}`)
  }

  // Index repositories
  console.log('Indexing repositories...')
  for (const repo of repositories) {
    const text = repoToText(repo)
    const embedding = await createEmbedding(text)
    await index.insertItem({
      id: repo.id,
      vector: embedding,
      metadata: {
        type: 'repository',
        name: repo.name,
        language: repo.language,
        technologies: repo.technologies.join(', '),
        cloud: repo.cloud,
        text: text,
      },
    })
    console.log(`  ✓ ${repo.name}`)
  }

  // Index projects
  console.log('Indexing projects...')
  for (const proj of projects) {
    const text = projectToText(proj)
    const embedding = await createEmbedding(text)
    await index.insertItem({
      id: proj.id,
      vector: embedding,
      metadata: {
        type: 'project',
        name: proj.name,
        client: proj.client,
        industry: proj.industry,
        technologies: proj.technologies.join(', '),
        capabilities: proj.capabilities.join(', '),
        text: text,
      },
    })
    console.log(`  ✓ ${proj.name}`)
  }

  console.log('\n✅ Indexing complete!')
  console.log(`Total items indexed: ${employees.length + repositories.length + projects.length}`)
}

main().catch(console.error)

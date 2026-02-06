import { LocalIndex, QueryResult } from 'vectra'
import * as path from 'path'
import { createEmbedding } from './embeddings'

export interface SearchResult {
  id: string
  type: 'employee' | 'repository' | 'project'
  name: string
  content: string
  similarity: number
}

// Lazy initialization of Vectra index
let _index: LocalIndex | null = null

function getIndex(): LocalIndex {
  if (!_index) {
    const indexPath = path.join(process.cwd(), '.index')
    _index = new LocalIndex(indexPath)
  }
  return _index
}

export async function search(query: string, topK: number = 5): Promise<SearchResult[]> {
  const index = getIndex()

  // Check if index exists
  if (!(await index.isIndexCreated())) {
    console.error('Index not created. Run: npx tsx scripts/index-data.ts')
    return []
  }

  // Generate embedding for the query
  const queryEmbedding = await createEmbedding(query)

  // Search the index (vector, query string, topK)
  const results = await index.queryItems(queryEmbedding, query, topK)

  return results.map((item: QueryResult<Record<string, unknown>>) => ({
    id: item.item.id,
    type: item.item.metadata.type as 'employee' | 'repository' | 'project',
    name: item.item.metadata.name as string,
    content: item.item.metadata.text as string,
    similarity: item.score,
  }))
}

// Helper to format search results for Claude context
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant information found in the knowledge base.'
  }

  const sections: string[] = []

  const employees = results.filter((r) => r.type === 'employee')
  const repos = results.filter((r) => r.type === 'repository')
  const projects = results.filter((r) => r.type === 'project')

  if (employees.length > 0) {
    sections.push(
      '## EMPLOYEES\n' +
        employees.map((e) => `[EMPLOYEE:${e.name}]\n${e.content}`).join('\n\n')
    )
  }

  if (repos.length > 0) {
    sections.push(
      '## REPOSITORIES\n' +
        repos.map((r) => `[REPO:${r.name}]\n${r.content}`).join('\n\n')
    )
  }

  if (projects.length > 0) {
    sections.push(
      '## PROJECTS\n' +
        projects.map((p) => `[PROJECT:${p.name}]\n${p.content}`).join('\n\n')
    )
  }

  return sections.join('\n\n---\n\n')
}

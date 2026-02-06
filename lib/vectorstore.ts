import { getSupabaseAdmin, SearchResult } from './supabase'
import { createEmbedding } from './embeddings'

export type { SearchResult }

export async function search(query: string, topK: number = 5): Promise<SearchResult[]> {
  // Generate embedding for the query
  const queryEmbedding = await createEmbedding(query)

  // Search using Supabase function
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.rpc('search_knowledge_base', {
    query_embedding: queryEmbedding,
    match_count: topK,
  })

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return (data || []).map((item: SearchResult) => ({
    id: item.id,
    type: item.type as 'employee' | 'repository' | 'project',
    name: item.name,
    content: item.content,
    similarity: item.similarity,
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

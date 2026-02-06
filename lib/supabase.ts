import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Lazy initialization to avoid build-time errors
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key are required')
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAdmin
}

// For backward compatibility
export const supabase = { get: getSupabase }
export const supabaseAdmin = { get: getSupabaseAdmin }

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  experience_years: number
  certifications: string[]
  languages: string[]
  bio: string
  embedding?: number[]
}

export interface Repository {
  id: string
  name: string
  description: string
  language: string
  technologies: string[]
  cloud: string
  features: string[]
  metrics: string
  status: string
  embedding?: number[]
}

export interface Project {
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
  embedding?: number[]
}

export interface SearchResult {
  id: string
  type: 'employee' | 'repository' | 'project'
  name: string
  content: string
  similarity: number
}

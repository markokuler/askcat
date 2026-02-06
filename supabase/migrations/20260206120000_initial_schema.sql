-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Employees table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  certifications TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  bio TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repositories table
CREATE TABLE repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  technologies TEXT[] DEFAULT '{}',
  cloud TEXT,
  features TEXT[] DEFAULT '{}',
  metrics TEXT,
  status TEXT DEFAULT 'active',
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  industry TEXT,
  duration TEXT,
  value TEXT,
  status TEXT DEFAULT 'completed',
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  capabilities TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  team_size INTEGER,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX employees_embedding_idx ON employees
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX repositories_embedding_idx ON repositories
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX projects_embedding_idx ON projects
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Function for semantic search across all tables
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding vector(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  type TEXT,
  name TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    -- Search employees
    SELECT
      e.id,
      'employee'::TEXT as type,
      e.name,
      FORMAT('%s - %s in %s. Skills: %s. %s',
        e.name, e.role, e.department,
        array_to_string(e.skills, ', '), e.bio
      ) as content,
      1 - (e.embedding <=> query_embedding) as similarity
    FROM employees e
    WHERE e.embedding IS NOT NULL

    UNION ALL

    -- Search repositories
    SELECT
      r.id,
      'repository'::TEXT as type,
      r.name,
      FORMAT('%s: %s. Tech: %s. Cloud: %s. Metrics: %s',
        r.name, r.description,
        array_to_string(r.technologies, ', '), r.cloud, r.metrics
      ) as content,
      1 - (r.embedding <=> query_embedding) as similarity
    FROM repositories r
    WHERE r.embedding IS NOT NULL

    UNION ALL

    -- Search projects
    SELECT
      p.id,
      'project'::TEXT as type,
      p.name,
      FORMAT('%s - %s (%s). %s. Tech: %s. Outcomes: %s',
        p.name, p.client, p.industry, p.description,
        array_to_string(p.technologies, ', '),
        array_to_string(p.outcomes, '; ')
      ) as content,
      1 - (p.embedding <=> query_embedding) as similarity
    FROM projects p
    WHERE p.embedding IS NOT NULL
  ) combined
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER repositories_updated_at
  BEFORE UPDATE ON repositories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

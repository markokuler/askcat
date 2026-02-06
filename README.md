# 🐱 AskCat - Sales Intelligence Assistant

AI-powered assistant that helps sales reps quickly find information about team capabilities, technical expertise, and past projects.

## Features

- **Semantic Search** - Vector search across employees, repositories, and projects
- **Claude AI Responses** - Intelligent answers with cited sources
- **Google Drive Integration** - Keep your data in Drive, sync automatically
- **Supabase Backend** - pgvector for production-ready vector search

## Tech Stack

- **Next.js 15** - App Router
- **Tailwind CSS** - Styling
- **Claude API** - AI reasoning
- **OpenAI Embeddings** - text-embedding-3-small
- **Supabase** - pgvector for vector search
- **Google Drive API** - Data source

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Enable the `vector` extension in SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Run the migration from `supabase/migrations/001_initial_schema.sql`
4. Copy your project URL and keys

### 2. Set Up Google Drive

1. Create a Google Cloud project
2. Enable Google Drive API
3. Create a Service Account and download the JSON key
4. Create a folder in Google Drive
5. Share the folder with your service account email
6. Add these JSON files to the folder:
   - `employees.json`
   - `repositories.json`
   - `projects.json`

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=askcat@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=1abc...xyz
```

### 4. Sync Data

```bash
npm run sync
```

This fetches data from Google Drive, generates embeddings, and stores in Supabase.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Data Format

### employees.json

```json
[
  {
    "id": "emp-001",
    "name": "Milan Petrović",
    "role": "Senior ML Engineer",
    "department": "AI/ML",
    "skills": ["Python", "TensorFlow", "PyTorch"],
    "experience_years": 8,
    "certifications": ["AWS ML Specialty"],
    "languages": ["Serbian", "English"],
    "bio": "Expert in building production ML pipelines..."
  }
]
```

### repositories.json

```json
[
  {
    "id": "repo-001",
    "name": "fraud-detection",
    "description": "Real-time fraud detection ML pipeline",
    "language": "Python",
    "technologies": ["TensorFlow", "Kafka", "Redis"],
    "cloud": "AWS",
    "features": ["Real-time inference", "Model versioning"],
    "metrics": "Processing 10M+ transactions/day",
    "status": "production"
  }
]
```

### projects.json

```json
[
  {
    "id": "proj-001",
    "name": "Digital Banking Transformation",
    "client": "Regional Bank (NDA)",
    "industry": "Financial Services",
    "duration": "18 months",
    "value": "$2.5M",
    "status": "completed",
    "description": "Complete digital transformation...",
    "technologies": ["React Native", "Spring Boot", "AWS"],
    "capabilities": ["Mobile Development", "Backend Engineering"],
    "outcomes": ["2M+ app downloads", "50% reduction in branch visits"],
    "team_size": 15
  }
]
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard.

## License

MIT

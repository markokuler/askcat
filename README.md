# AskCat - Sales Intelligence Assistant

AI-powered sales intelligence tool that helps sales representatives find the right people, projects, and technologies for deals.

## Tech Stack

- **Next.js 15** - App Router
- **Tailwind CSS** - Styling
- **Claude API** - AI reasoning
- **OpenAI Embeddings** - text-embedding-3-small
- **Vectra** - Local vector store (no external database)

## Features

- Chat interface for natural language queries
- Vector search across 3 data sources:
  - Employees (skills, experience, certifications)
  - Repositories (technologies, features, metrics)
  - Projects (clients, outcomes, technologies)
- Claude generates responses with cited sources
- Beautiful cards for employees, repos, and projects

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from example:
```bash
cp .env.local.example .env.local
```

3. Add your API keys to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

4. Index the data (run once, or when data changes):
```bash
npm run index
```

5. Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use AskCat.

## Data Structure

Data is stored in `data/` folder:

- `employees.json` - Employee profiles with skills, experience, certifications
- `repositories.json` - Code repositories with technologies, features, metrics
- `projects.json` - Past projects with clients, outcomes, team info

## How it Works

1. **Indexing**: `npm run index` creates embeddings for all data and stores them in `.index/` folder
2. **Query**: User asks a question in the chat
3. **Search**: Query is embedded and searched against the Vectra index
4. **Context**: Top 5 most relevant results are passed to Claude
5. **Response**: Claude generates a response with cited sources in structured format

## API Endpoint

`POST /api/chat`

Request:
```json
{
  "messages": [
    { "role": "user", "content": "Who has ML experience?" }
  ]
}
```

Response:
```json
{
  "response": "[EMPLOYEE:Name] Description...",
  "sources": [
    { "type": "employee", "name": "Name", "score": 0.85 }
  ]
}
```

## Project Structure

```
askcat/
├── app/
│   ├── page.tsx              # Chat UI
│   ├── layout.tsx            # App layout
│   ├── globals.css           # Styles
│   └── api/chat/route.ts     # Chat API endpoint
├── lib/
│   ├── embeddings.ts         # OpenAI embeddings
│   ├── vectorstore.ts        # Vectra search
│   └── claude.ts             # Claude API
├── data/
│   ├── employees.json
│   ├── repositories.json
│   └── projects.json
├── scripts/
│   └── index-data.ts         # Indexing script
└── .index/                   # Vectra index (generated)
```

## Data Format

### employees.json

```json
[
  {
    "id": "emp-001",
    "name": "Milan Petrovic",
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

## License

MIT

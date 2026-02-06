<p align="center">
  <img src="public/logo-mark.svg" alt="AskCat" width="80" height="70" />
</p>

<h1 align="center">AskCat</h1>

<p align="center">
  <strong>AI-powered sales intelligence assistant with semantic search and outreach generation</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#api-reference">API</a> •
  <a href="#configuration">Configuration</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Claude-Sonnet_4-orange?logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/OpenAI-Embeddings-green?logo=openai" alt="OpenAI" />
</p>

---

## Overview

AskCat helps sales teams instantly find relevant people, projects, and technical capabilities using natural language queries. It uses RAG (Retrieval-Augmented Generation) to search through your company's knowledge base and generate contextual responses with cited sources.

**Key differentiators:**
- No external database required (uses local Vectra vector store)
- One-click personalized outreach email generation
- Structured responses with visual entity cards

## Features

- **Semantic Search** — Query employees, repositories, and projects using natural language
- **RAG Pipeline** — Vector embeddings + Claude for accurate, cited responses
- **Outreach Generation** — Generate personalized sales emails from search results
- **Visual Cards** — Color-coded cards for different entity types (employees, repos, projects)
- **Zero Infrastructure** — Local vector store, no database setup required

## Quick Start

### Prerequisites

- Node.js 18+
- Anthropic API key
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/markokuler/askcat.git
cd askcat

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your API keys

# Generate vector embeddings
npm run index

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Query     │────▶│  Embedding  │────▶│   Vector    │────▶│   Context   │────▶│  Response   │
│  (user)     │     │  (OpenAI)   │     │   Search    │     │  (Top 5)    │     │  (Claude)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. User submits a natural language query
2. Query is converted to a 1536-dimensional vector using OpenAI embeddings
3. Vectra performs cosine similarity search against indexed data
4. Top 5 results are passed as context to Claude
5. Claude generates a structured response with `[EMPLOYEE:Name]`, `[REPO:name]`, `[PROJECT:Name]` citations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Vector Store | Vectra (local) |
| Embeddings | OpenAI `text-embedding-3-small` |
| LLM | Claude Sonnet 4 |

## Project Structure

```
askcat/
├── app/
│   ├── page.tsx                 # Chat UI with outreach modal
│   ├── api/chat/route.ts        # Chat API endpoint
│   └── prezentacija/page.tsx    # Technical presentation
├── lib/
│   ├── vectorstore.ts           # Vectra search implementation
│   ├── embeddings.ts            # OpenAI embeddings wrapper
│   └── claude.ts                # Claude API integration
├── data/
│   ├── employees.json           # Employee profiles
│   ├── repositories.json        # Code repositories
│   └── projects.json            # Past projects
├── scripts/
│   └── index-data.ts            # Embedding generation script
└── .index/                      # Vectra index (generated)
```

## Configuration

### Environment Variables

Create `.env.local` with:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
```

### Data Files

Add your data to `data/` folder in JSON format:

<details>
<summary><code>employees.json</code></summary>

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
    "bio": "Expert in production ML pipelines..."
  }
]
```
</details>

<details>
<summary><code>repositories.json</code></summary>

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
</details>

<details>
<summary><code>projects.json</code></summary>

```json
[
  {
    "id": "proj-001",
    "name": "Fraud Detection Platform",
    "client": "Fortune 500 Payment Processor",
    "industry": "FinTech",
    "duration": "12 months",
    "value": "$1.8M",
    "status": "completed",
    "description": "Real-time ML-powered fraud detection",
    "technologies": ["TensorFlow", "Kafka", "AWS"],
    "capabilities": ["Machine Learning", "Real-time Processing"],
    "outcomes": ["$50M+ fraud prevented annually"],
    "team_size": 8
  }
]
```
</details>

## API Reference

### POST /api/chat

Send a chat message and receive AI-generated response with sources.

**Request:**

```json
{
  "messages": [
    { "role": "user", "content": "Who has experience with ML pipelines?" }
  ]
}
```

**Response:**

```json
{
  "response": "[EMPLOYEE:Milan Petrović] Senior ML Engineer with 8 years experience...",
  "sources": [
    { "type": "employee", "name": "Milan Petrović", "score": 0.89 },
    { "type": "repository", "name": "fraud-detection", "score": 0.76 }
  ]
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run index` | Generate vector embeddings |
| `npm run start` | Start production server |

## License

MIT

---

<p align="center">
  Built with <a href="https://nextjs.org">Next.js</a>, <a href="https://github.com/Stevenic/vectra">Vectra</a>, and <a href="https://anthropic.com">Claude</a>
</p>

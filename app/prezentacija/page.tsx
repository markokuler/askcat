'use client'

import Image from 'next/image'
import Link from 'next/link'

const techStack = [
  { name: 'Next.js 15', desc: 'App Router, Server Actions', icon: '⚡', color: 'from-gray-700 to-black' },
  { name: 'Vectra', desc: 'Lokalni vector store', icon: '🔍', color: 'from-emerald-500 to-green-600' },
  { name: 'Claude API', desc: 'claude-sonnet-4', icon: '🧠', color: 'from-orange-400 to-amber-500' },
  { name: 'OpenAI', desc: 'text-embedding-3-small', icon: '🔮', color: 'from-violet-500 to-purple-600' },
  { name: 'TypeScript', desc: 'End-to-end type safety', icon: '📘', color: 'from-blue-500 to-cyan-500' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: '🎨', color: 'from-cyan-500 to-teal-500' },
]

const dataTypes = [
  {
    type: 'Employees',
    icon: '👥',
    count: '15',
    file: 'data/employees.json',
    fields: ['id, name, role, department', 'skills: string[]', 'experience_years: number', 'certifications: string[]', 'bio: string'],
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    type: 'Repositories',
    icon: '📦',
    count: '12',
    file: 'data/repositories.json',
    fields: ['id, name, description', 'language, technologies[]', 'cloud, features[]', 'metrics: string', 'status: "production" | "dev"'],
    color: 'bg-violet-50 border-violet-200',
  },
  {
    type: 'Projects',
    icon: '📋',
    count: '10',
    file: 'data/projects.json',
    fields: ['id, name, client, industry', 'duration, value, status', 'technologies[], capabilities[]', 'outcomes: string[]', 'team_size, key_people[]'],
    color: 'bg-amber-50 border-amber-200',
  },
]

const queryFlow = [
  { step: '1', title: 'Upit', desc: 'Korisnik postavlja pitanje prirodnim jezikom', icon: '💬', color: 'bg-blue-500' },
  { step: '2', title: 'Embedding', desc: 'OpenAI → 1536-dim vektor', icon: '🔢', color: 'bg-violet-500' },
  { step: '3', title: 'Vector Search', desc: 'Vectra cosine similarity', icon: '🔍', color: 'bg-emerald-500' },
  { step: '4', title: 'Context', desc: 'Top 5 rezultata → Claude', icon: '📄', color: 'bg-amber-500' },
  { step: '5', title: 'Response', desc: 'Strukturiran odgovor + citati', icon: '✨', color: 'bg-cyan-500' },
]

const fileStructure = [
  { path: 'app/', desc: 'Next.js App Router', files: ['page.tsx - Chat UI', 'api/chat/route.ts - API endpoint', 'prezentacija/page.tsx'] },
  { path: 'lib/', desc: 'Core libraries', files: ['vectorstore.ts - Vectra search', 'embeddings.ts - OpenAI embeddings', 'claude.ts - LLM integration'] },
  { path: 'data/', desc: 'JSON data sources', files: ['employees.json', 'repositories.json', 'projects.json'] },
  { path: 'scripts/', desc: 'CLI tools', files: ['index-data.ts - Generiši embeddings'] },
  { path: '.index/', desc: 'Vectra index', files: ['index.json - Vector store (~1.2MB)'] },
]

export default function Prezentacija() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-mark.svg" alt="SmartCat" width={36} height={31} />
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>AskCat</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--smartcat-blue)] text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            Otvori AskCat →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-amber-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--border)] shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-[var(--foreground-muted)]">RAG + LLM Sales Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="bg-gradient-to-r from-[var(--smartcat-blue)] via-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">
              AskCat
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--foreground-muted)] max-w-3xl mx-auto mb-8 leading-relaxed">
            Interni AI asistent koji pomaže sales timu da <strong className="text-[var(--foreground)]">pronađe</strong> relevantne
            ljude, projekte i tehničke kapacitete + <strong className="text-[var(--foreground)]">generiše outreach</strong>.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--border)]">
              <span>🎯</span> Vector Embeddings
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--border)]">
              <span>🤖</span> RAG Architecture
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--border)]">
              <span>📧</span> Outreach Generation
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Ključne funkcionalnosti
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-4 text-cyan-800">Semantic Search</h3>
              <ul className="space-y-3 text-cyan-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Pretraga prirodnim jezikom (ne keyword matching)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Vector similarity preko 3 tipa entiteta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Strukturirani odgovori sa [EMPLOYEE], [REPO], [PROJECT] citatima</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Kartice sa vizuelnim prikazom rezultata</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-4 text-emerald-800">Outreach Generation</h3>
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Jednim klikom generiši personalizovan email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Koristi context iz prethodne pretrage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>Unesi: kompanija, potreba, kontakt osoba</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">→</span>
                  <span>AI generiše email sa konkretnim ljudima i metrikama</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Tech Stack
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg">Minimalan, bez eksterne baze podataka</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="group p-6 rounded-2xl bg-white border border-[var(--border)] hover:shadow-xl hover:shadow-cyan-500/10 hover:border-[var(--accent)] transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {tech.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{tech.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              RAG Pipeline
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg">Retrieval-Augmented Generation flow</p>
          </div>

          {/* Query Flow */}
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-violet-200 via-emerald-200 via-amber-200 to-cyan-200 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {queryFlow.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl border border-[var(--border)] p-6 text-center hover:shadow-lg transition-shadow">
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4 shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="text-xs font-bold text-[var(--foreground-muted)] mb-1">KORAK {item.step}</div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-16 p-8 rounded-2xl bg-gray-900 text-gray-100">
            <h3 className="text-xl font-bold mb-6 text-cyan-400">📐 Tehnički detalji</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-amber-400">Vector Embeddings</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Model: <code className="px-2 py-0.5 rounded bg-gray-800">text-embedding-3-small</code></li>
                  <li>• Dimenzije: <code className="px-2 py-0.5 rounded bg-gray-800">1536</code></li>
                  <li>• Storage: <code className="px-2 py-0.5 rounded bg-gray-800">.index/index.json</code></li>
                  <li>• Similarity: Cosine (Top-K, K=5)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-amber-400">LLM Integration</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Model: <code className="px-2 py-0.5 rounded bg-gray-800">claude-sonnet-4</code></li>
                  <li>• Max tokens: <code className="px-2 py-0.5 rounded bg-gray-800">1024</code></li>
                  <li>• System prompt sa format instrukcijama</li>
                  <li>• Citatni format: [TYPE:Name]</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-amber-400">API Endpoint</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Route: <code className="px-2 py-0.5 rounded bg-gray-800">POST /api/chat</code></li>
                  <li>• Input: <code className="px-2 py-0.5 rounded bg-gray-800">messages[]</code></li>
                  <li>• Output: <code className="px-2 py-0.5 rounded bg-gray-800">response, sources[]</code></li>
                  <li>• Sources: type, name, score</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* File Structure */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Struktura projekta
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg">Minimalna Next.js aplikacija</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileStructure.map((folder) => (
              <div key={folder.path} className="p-5 rounded-xl bg-gray-900 text-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-400">📁</span>
                  <code className="text-cyan-400 font-bold">{folder.path}</code>
                </div>
                <p className="text-xs text-gray-500 mb-3">{folder.desc}</p>
                <ul className="space-y-1">
                  {folder.files.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="text-gray-600">└</span>
                      <code>{file}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Commands */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-gray-100">
            <h4 className="font-bold mb-4 text-cyan-400">⌨️ CLI Commands</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-gray-800">
                <code className="text-emerald-400">npm run dev</code>
                <p className="text-gray-500 mt-1">Start dev server</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <code className="text-emerald-400">npm run index</code>
                <p className="text-gray-500 mt-1">Generiši embeddings</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <code className="text-emerald-400">npm run build</code>
                <p className="text-gray-500 mt-1">Production build</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Structure */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Data Schema
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg">JSON fajlovi u <code className="px-2 py-1 bg-gray-100 rounded">data/</code> folderu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {dataTypes.map((data) => (
              <div key={data.type} className={`p-6 rounded-2xl border-2 ${data.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{data.icon}</span>
                    <h3 className="font-bold text-xl">{data.type}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-sm font-bold">{data.count}</span>
                </div>
                <code className="text-xs text-gray-500 block mb-4">{data.file}</code>
                <ul className="space-y-1.5">
                  {data.fields.map((field, idx) => (
                    <li key={idx} className="text-xs font-mono bg-white/60 px-2 py-1 rounded">
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* JSON Example */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-gray-100 overflow-x-auto">
            <h4 className="font-bold mb-4 text-cyan-400">📄 Primer: employees.json</h4>
            <pre className="text-sm text-gray-300"><code>{`{
  "id": "emp-001",
  "name": "Milan Petrović",
  "role": "Senior ML Engineer",
  "department": "AI/ML",
  "skills": ["Python", "TensorFlow", "PyTorch", "Kafka"],
  "experience_years": 8,
  "certifications": ["AWS ML Specialty", "Google Cloud ML Engineer"],
  "languages": ["Serbian", "English", "German"],
  "bio": "Expert in building production ML pipelines and real-time inference systems."
}`}</code></pre>
          </div>
        </div>
      </section>

      {/* Sales Use Case */}
      <section className="py-20 bg-gradient-to-br from-[var(--smartcat-blue)] to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span>🎯</span>
              <span className="text-sm font-medium">End-to-End Flow</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Praktičan primer
            </h2>
            <p className="text-cyan-100 text-lg max-w-2xl mx-auto">
              Od prodajnog signala do personalizovanog outreach emaila
            </p>
          </div>

          {/* Step 1: Signal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 md:p-12 mb-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-lg font-bold">1</span>
              Selling Signal
            </h3>
            <blockquote className="pl-4 border-l-4 border-amber-400 text-cyan-100 italic">
              &quot;FinTech startup traži senior inženjere za real-time fraud detection.
              Stack: Python, TensorFlow, Kafka, AWS.&quot;
            </blockquote>
          </div>

          {/* Step 2: Query */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 md:p-12 mb-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-400 text-cyan-900 flex items-center justify-center text-lg font-bold">2</span>
              AskCat Query
            </h3>
            <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm">
              <div className="text-cyan-300">
                &quot;Ko ima iskustva sa real-time fraud detection i ML pipeline-ovima?&quot;
              </div>
            </div>
          </div>

          {/* Step 3: Response */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 md:p-12 mb-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center text-lg font-bold">3</span>
              AskCat Response (+ Outreach dugme)
            </h3>
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              <div className="space-y-4">
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                  <h4 className="font-bold text-cyan-800 mb-2">👤 [EMPLOYEE:Milan Petrović]</h4>
                  <p className="text-sm text-cyan-700">Senior ML Engineer, 8 god. iskustva. Vodio fraud detection sistem - 10M+ tx/dan.</p>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                  <h4 className="font-bold text-violet-800 mb-2">📦 [REPO:fraud-detection]</h4>
                  <p className="text-sm text-violet-700">Real-time ML pipeline. &lt;50ms latency, 99.7% accuracy.</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2">📋 [PROJECT:Fraud Detection Platform]</h4>
                  <p className="text-sm text-amber-700">Fortune 500 klijent. $1.8M, $50M+ fraud sprečeno godišnje.</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium">
                  📧 Generiši Outreach
                </span>
              </div>
            </div>
          </div>

          {/* Step 4: Outreach */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 md:p-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-pink-400 text-pink-900 flex items-center justify-center text-lg font-bold">4</span>
              Generisan Outreach Email
            </h3>
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded">To: CTO @ PayFlow</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">AI Generated</span>
              </div>
              <div className="prose prose-sm">
                <p>Zdravo,</p>
                <p>
                  Video sam da gradite fraud detection sistem sa TensorFlow i Kafka stackom.
                  Mi smo upravo to uradili za jednog od najvećih payment processora -
                  <strong> sistem obrađuje 10M+ transakcija dnevno sa 99.7% accuracy i sprečio je $50M+ prevara godišnje.</strong>
                </p>
                <p>
                  Naš tim, predvođen Milanom Petrovićem (8+ godina ML),
                  ima production-ready fraud detection pipeline koji bismo mogli adaptirati za vaš use case.
                </p>
                <p>
                  Da li bi imao 15 minuta da ti pokažem kako smo rešili slične izazove?
                </p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold">~30s</div>
                <div className="text-sm text-cyan-200">Query → Email</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-cyan-200">Context iz baze</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-3xl mb-2">📧</div>
                <div className="text-2xl font-bold">1-click</div>
                <div className="text-sm text-cyan-200">Outreach generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Probaj AskCat
          </h2>
          <p className="text-[var(--foreground-muted)] text-lg mb-8">
            Postavi pitanje, dobij odgovor sa izvorima, generiši outreach email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--smartcat-blue)] text-white text-lg font-medium hover:shadow-xl hover:shadow-cyan-500/30 transition-all"
          >
            Otvori AskCat
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.svg" alt="SmartCat" width={28} height={24} />
            <span className="text-sm text-[var(--foreground-muted)]">SmartCat © 2025</span>
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Next.js • Vectra • Claude AI • OpenAI Embeddings
          </div>
        </div>
      </footer>
    </div>
  )
}

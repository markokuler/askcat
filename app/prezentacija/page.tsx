'use client'

import Image from 'next/image'
import Link from 'next/link'

const techStack = [
  { name: 'Next.js 15', desc: 'App Router, Server Actions', icon: '⚡', color: 'from-gray-700 to-black' },
  { name: 'Vectra', desc: 'Lokalni vector store', icon: '🔍', color: 'from-emerald-500 to-green-600' },
  { name: 'Claude API', desc: 'Claude Sonnet 4 (2025)', icon: '🧠', color: 'from-orange-400 to-amber-500' },
  { name: 'OpenAI', desc: 'text-embedding-3-small', icon: '🔮', color: 'from-violet-500 to-purple-600' },
  { name: 'TypeScript', desc: 'End-to-end type safety', icon: '📘', color: 'from-blue-500 to-cyan-500' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: '🎨', color: 'from-cyan-500 to-teal-500' },
]

const queryFlow = [
  { step: '1', title: 'Upit', desc: 'Prirodni jezik', icon: '💬', color: 'bg-blue-500' },
  { step: '2', title: 'Embedding', desc: 'OpenAI vektor', icon: '🔢', color: 'bg-violet-500' },
  { step: '3', title: 'Search', desc: 'Cosine similarity', icon: '🔍', color: 'bg-emerald-500' },
  { step: '4', title: 'Context', desc: 'Top 5 → Claude', icon: '📄', color: 'bg-amber-500' },
  { step: '5', title: 'Response', desc: 'Odgovor + citati', icon: '✨', color: 'bg-cyan-500' },
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

      {/* Hero - Compact */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-amber-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="bg-gradient-to-r from-[var(--smartcat-blue)] via-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">
              AskCat
            </span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            AI asistent za sales tim - pronađi ljude, projekte i kapacitete, generiši outreach.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
              😤 Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Sales tim gubi vreme na traženje informacija
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border-2 border-red-200 shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-lg mb-2 text-red-800">Rasuti podaci</h3>
              <p className="text-gray-600">
                CVs u Drive-u, projekti u spreadsheetima, skills u glavama ljudi. Nema jedinstvenog izvora.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border-2 border-red-200 shadow-sm">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="font-bold text-lg mb-2 text-red-800">Sporo odgovaranje</h3>
              <p className="text-gray-600">
                Lead traži ML eksperta. Sales pita kolege, čeka odgovore, sastavlja info. Traje satima.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border-2 border-red-200 shadow-sm">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-bold text-lg mb-2 text-red-800">Generički outreach</h3>
              <p className="text-gray-600">
                Copy-paste emailovi bez konkretnih referenci. Nema personalizacije, niske response rate.
              </p>
            </div>
          </div>

          {/* Pain point quote */}
          <div className="mt-12 max-w-3xl mx-auto">
            <blockquote className="text-center text-xl italic text-gray-600 border-l-4 border-red-300 pl-6">
              &quot;Imam lead koji traži Kafka eksperte za FinTech. Ko kod nas to zna? Koji projekti? Koje metrike mogu navesti?&quot;
              <footer className="mt-4 text-sm font-semibold text-gray-500">— Sales rep, svaki dan</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* SOLUTION - Use Case Flow */}
      <section className="py-20 bg-gradient-to-br from-[var(--smartcat-blue)] to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
              ✨ Rešenje
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Od pitanja do outreach emaila za 30 sekundi
            </h2>
            <p className="text-cyan-100 text-lg max-w-2xl mx-auto">
              AskCat pretražuje bazu zaposlenih, projekata i repozitorijuma - i generiše personalizovan email.
            </p>
          </div>

          {/* Step 1: Signal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-lg font-bold">1</span>
              Sales signal
            </h3>
            <blockquote className="pl-4 border-l-4 border-amber-400 text-cyan-100 italic">
              &quot;FinTech startup traži senior inženjere za real-time fraud detection. Stack: Python, TensorFlow, Kafka.&quot;
            </blockquote>
          </div>

          {/* Step 2: Query */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cyan-400 text-cyan-900 flex items-center justify-center text-lg font-bold">2</span>
              Pitanje u AskCat
            </h3>
            <div className="bg-gray-900 rounded-2xl p-5 font-mono text-cyan-300">
              &quot;Ko ima iskustva sa real-time fraud detection i ML pipeline-ovima?&quot;
            </div>
          </div>

          {/* Step 3: Response */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center text-lg font-bold">3</span>
              Odgovor sa izvorima
            </h3>
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              <div className="space-y-3">
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
                  <span className="font-bold text-cyan-800">👤 [EMPLOYEE:Milan Petrović]</span>
                  <span className="text-sm text-cyan-700 ml-2">Senior ML Engineer, 8 god, fraud detection 10M+ tx/dan</span>
                </div>
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-200">
                  <span className="font-bold text-violet-800">📦 [REPO:fraud-detection]</span>
                  <span className="text-sm text-violet-700 ml-2">Real-time ML, &lt;50ms latency, 99.7% accuracy</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800">📋 [PROJECT:Fraud Detection Platform]</span>
                  <span className="text-sm text-amber-700 ml-2">$1.8M, $50M+ fraud sprečeno godišnje</span>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-pink-400 text-pink-900 flex items-center justify-center text-lg font-bold">4</span>
              Generisan email
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden text-gray-800">
              <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100">
                <span className="text-xs font-semibold text-emerald-600">SUBJECT</span>
                <p className="font-semibold text-gray-900">99.7% fraud detection za payment procesore</p>
              </div>
              <div className="p-5 text-[15px] leading-relaxed">
                <p className="text-gray-600 mb-4">Zdravo,</p>
                <p className="mb-4">
                  Za PayTech smo napravili ML sistem koji blokira <strong>$50M prevara godišnje</strong> sa &lt;50ms latency.
                </p>
                <p className="mb-4">
                  Vidim da tražite fraud tim - imamo ljude koji su to već rešili.
                </p>
                <p className="text-gray-600">15 min sledeće nedelje za demo?</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold">~30s</div>
                <div className="text-sm text-cyan-200">Query → Email</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-cyan-200">Pravi podaci</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10">
                <div className="text-2xl font-bold">1-click</div>
                <div className="text-sm text-cyan-200">Outreach</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Compact */}
      <section className="py-16 bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-lg font-bold mb-2 text-cyan-800">Semantic Search</h3>
              <ul className="space-y-2 text-sm text-cyan-700">
                <li>→ Pretraga prirodnim jezikom</li>
                <li>→ Vector similarity preko 3 tipa entiteta</li>
                <li>→ Strukturirani odgovori sa citatima</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="text-2xl mb-3">📧</div>
              <h3 className="text-lg font-bold mb-2 text-emerald-800">Outreach Generation</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li>→ Personalizovan email jednim klikom</li>
                <li>→ Konkretni ljudi i metrike iz baze</li>
                <li>→ Sales-optimized format</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TECH DETAILS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold mb-4">
              🔧 Tehnologija
            </span>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Kako radi
            </h2>
          </div>

          {/* RAG Pipeline */}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-6 text-center text-gray-600">RAG Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {queryFlow.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-[var(--border)] p-4 text-center">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-lg text-white mx-auto mb-2`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-gray-400 mb-1">{item.step}</div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="p-4 rounded-xl bg-white border border-[var(--border)] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center text-lg`}>
                  {tech.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tech.name}</h4>
                  <p className="text-xs text-gray-500">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Details - Compact */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-900 text-gray-100">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-amber-400">Embeddings</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• <code className="text-cyan-300">text-embedding-3-small</code></li>
                  <li>• 1536 dimenzija, Cosine similarity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-amber-400">LLM</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• <code className="text-cyan-300">claude-sonnet-4-20250514</code></li>
                  <li>• System prompt + citatni format</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-amber-400">Storage</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• Vectra lokalni index</li>
                  <li>• JSON fajlovi, zero DB cost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Time */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Od nule do produkcije
            </h2>
            <div className="inline-flex items-baseline gap-2 mt-4">
              <span className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">~2</span>
              <span className="text-2xl text-gray-400">sata</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
              <span className="text-xl">🤖</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-orange-300">Izgrađeno sa Claude Code</p>
                <p className="text-xs text-orange-400/70">Powered by Claude Opus 4.5</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-bold text-cyan-400">37</div>
              <div className="text-xs text-gray-500">entiteta</div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-bold text-emerald-400">6</div>
              <div className="text-xs text-gray-500">core fajlova</div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-bold text-amber-400">$0</div>
              <div className="text-xs text-gray-500">infra cost</div>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-bold text-pink-400">Live</div>
              <div className="text-xs text-gray-500">Vercel</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Probaj AskCat
          </h2>
          <p className="text-[var(--foreground-muted)] mb-6">
            Postavi pitanje, dobij odgovor sa izvorima, generiši outreach.
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
      <footer className="py-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.svg" alt="SmartCat" width={28} height={24} />
            <span className="text-sm text-[var(--foreground-muted)]">SmartCat © 2026</span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">
            Next.js • Vectra • Claude Sonnet 4 • OpenAI • Built with Claude Code (Opus 4.5)
          </div>
        </div>
      </footer>
    </div>
  )
}

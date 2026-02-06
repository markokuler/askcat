'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Source {
  type: 'employee' | 'repository' | 'project'
  name: string
  score: number
}

interface ParsedSegment {
  type: 'text' | 'employee' | 'repository' | 'project'
  name?: string
  content: string
}

const suggestedQueries = [
  {
    icon: '👥',
    text: 'Ko ima iskustva sa ML i real-time sistemima?',
    color: 'from-cyan-500/10 to-blue-500/10',
    border: 'hover:border-cyan-400'
  },
  {
    icon: '📊',
    text: 'Koje projekte smo radili u FinTech industriji?',
    color: 'from-amber-500/10 to-orange-500/10',
    border: 'hover:border-amber-400'
  },
  {
    icon: '☁️',
    text: 'Imamo li Kubernetes i cloud migration eksperte?',
    color: 'from-violet-500/10 to-purple-500/10',
    border: 'hover:border-violet-400'
  },
  {
    icon: '🔒',
    text: 'Ko može da vodi security audit i compliance?',
    color: 'from-emerald-500/10 to-teal-500/10',
    border: 'hover:border-emerald-400'
  },
]

// Parse response to extract cards
function parseResponse(content: string): ParsedSegment[] {
  const segments: ParsedSegment[] = []

  // Split by entity tags - each [TYPE:Name] starts a new entity
  const matches = [...content.matchAll(/\[(EMPLOYEE|REPO|PROJECT):([^\]]+)\]/gi)]

  if (matches.length === 0) {
    // No entity tags - return cleaned text
    const cleanedContent = content
      .replace(/\*\*/g, '')
      .replace(/^[-•]\s*/gm, '')
      .replace(/^#+\s*/gm, '')
      .trim()
    return [{ type: 'text', content: cleanedContent }]
  }

  const typeMap: Record<string, 'employee' | 'repository' | 'project'> = {
    'EMPLOYEE': 'employee',
    'REPO': 'repository',
    'PROJECT': 'project'
  }

  // Check for text before first entity
  const firstMatchIndex = matches[0].index!
  if (firstMatchIndex > 0) {
    const textBefore = content.slice(0, firstMatchIndex).replace(/\*\*/g, '').trim()
    if (textBefore) {
      segments.push({ type: 'text', content: textBefore })
    }
  }

  matches.forEach((match, idx) => {
    const matchStart = match.index!
    const matchEnd = matchStart + match[0].length

    // Find where this entity's content ends
    const nextMatch = matches[idx + 1]
    const contentEnd = nextMatch ? nextMatch.index! : content.length

    // Get all content for this entity
    const entityContent = content.slice(matchEnd, contentEnd).trim()

    segments.push({
      type: typeMap[match[1].toUpperCase()],
      name: match[2].trim(),
      content: entityContent
    })
  })

  return segments
}

// Clean any remaining markdown from text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // Remove *italic*
    .replace(/^[-•]\s*/gm, '')           // Remove bullet points
    .replace(/^#+\s*/gm, '')             // Remove headers
    .replace(/`([^`]+)`/g, '$1')         // Remove code ticks
    .trim()
}

// Format content with styled elements
function FormattedCardContent({ content, accentColor }: { content: string; accentColor: 'cyan' | 'violet' | 'amber' }) {
  const colorClasses = {
    cyan: {
      label: 'text-cyan-700 bg-cyan-100/80',
      value: 'text-gray-800',
      tag: 'bg-white/80 border-cyan-200 text-cyan-700',
      metric: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    },
    violet: {
      label: 'text-violet-700 bg-violet-100/80',
      value: 'text-gray-800',
      tag: 'bg-white/80 border-violet-200 text-violet-700',
      metric: 'bg-violet-50 border-violet-200 text-violet-700',
    },
    amber: {
      label: 'text-amber-700 bg-amber-100/80',
      value: 'text-gray-800',
      tag: 'bg-white/80 border-amber-200 text-amber-700',
      metric: 'bg-amber-50 border-amber-200 text-amber-700',
    },
  }

  const colors = colorClasses[accentColor]

  // Split into lines
  const lines = content.split('\n').filter(line => line.trim())
  const elements: React.ReactElement[] = []

  lines.forEach((line, idx) => {
    let trimmed = cleanMarkdown(line)
    if (!trimmed) return

    // Pattern 1: "Key: Value" or "Key : Value" (label-value pairs)
    const kvMatch = trimmed.match(/^([A-Za-zČĆŽŠĐčćžšđ\s]+):\s*(.+)$/)
    if (kvMatch) {
      const [, label, value] = kvMatch
      const cleanLabel = label.trim()
      const cleanValue = value.trim()

      // Check if value looks like a comma-separated list of skills/tech
      const isTagList = cleanValue.includes(',') &&
                        !cleanValue.includes('.') &&
                        cleanValue.split(',').every(v => v.trim().length < 30)

      // Check for metrics in the value
      const metricPattern = /(\$[\d,.]+[MBK]?|\d+[MBK]\+|\d+%|\d+\+\s*(years?|godina)?)/gi
      const hasMetric = metricPattern.test(cleanValue)

      elements.push(
        <div key={idx} className="flex flex-wrap items-baseline gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.label}`}>
            {cleanLabel}
          </span>
          {isTagList ? (
            <div className="flex flex-wrap gap-1.5">
              {cleanValue.split(',').map((tag, i) => (
                <span key={i} className={`px-2 py-0.5 border rounded text-xs ${colors.tag}`}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          ) : hasMetric ? (
            <span className={`text-sm font-medium px-2 py-0.5 border rounded ${colors.metric}`}>
              {cleanValue}
            </span>
          ) : (
            <span className={`text-sm ${colors.value}`}>{cleanValue}</span>
          )}
        </div>
      )
      return
    }

    // Pattern 2: Regular text (summary line or other)
    // Highlight any metrics inline
    const metricPattern = /(\$[\d,.]+[MBK]?|\d+[MBK]\+|\d+%)/g
    const metrics = trimmed.match(metricPattern)

    if (metrics && metrics.length > 0) {
      const parts = trimmed.split(metricPattern)
      elements.push(
        <p key={idx} className="text-sm text-gray-700 mb-2 leading-relaxed">
          {parts.map((part, i) => {
            if (metrics.includes(part)) {
              return (
                <span key={i} className={`inline-flex mx-0.5 px-1.5 py-0.5 rounded text-xs font-semibold border ${colors.metric}`}>
                  {part}
                </span>
              )
            }
            return <span key={i}>{part}</span>
          })}
        </p>
      )
    } else {
      elements.push(
        <p key={idx} className="text-sm text-gray-700 mb-2 leading-relaxed">
          {trimmed}
        </p>
      )
    }
  })

  return <div className="mt-2">{elements}</div>
}

// Card components for different entity types
function EmployeeCard({ name, content }: { name: string; content: string }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded">Employee</span>
          </div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <FormattedCardContent content={content} accentColor="cyan" />
        </div>
      </div>
    </div>
  )
}

function RepoCard({ name, content }: { name: string; content: string }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100 px-2 py-0.5 rounded">Repository</span>
          </div>
          <h4 className="font-bold text-gray-900 font-mono">{name}</h4>
          <FormattedCardContent content={content} accentColor="violet" />
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ name, content }: { name: string; content: string }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Project</span>
          </div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <FormattedCardContent content={content} accentColor="amber" />
        </div>
      </div>
    </div>
  )
}

function FormattedResponse({ content }: { content: string }) {
  const segments = parseResponse(content)

  return (
    <div className="space-y-2">
      {segments.map((segment, idx) => {
        switch (segment.type) {
          case 'employee':
            return <EmployeeCard key={idx} name={segment.name!} content={segment.content} />
          case 'repository':
            return <RepoCard key={idx} name={segment.name!} content={segment.content} />
          case 'project':
            return <ProjectCard key={idx} name={segment.name!} content={segment.content} />
          default:
            // Clean up all markdown artifacts from text
            const cleanText = cleanMarkdown(segment.content)
              .replace(/\[(EMPLOYEE|REPO|PROJECT):[^\]]+\]/g, '')
              .replace(/---/g, '')
              .trim()

            if (!cleanText) return null

            return (
              <p key={idx} className="text-[15px] leading-relaxed text-gray-700">
                {cleanText}
              </p>
            )
        }
      })}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="typing-dot w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
      <div className="typing-dot w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
      <div className="typing-dot w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
    </div>
  )
}

function SourceBadge({ source }: { source: Source }) {
  const config = {
    employee: {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
    },
    repository: {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
    },
    project: {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
  }

  const style = config[source.type]

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
      {style.icon}
      {source.name}
    </span>
  )
}

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isLast ? 'animate-fade-in' : ''}`}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--smartcat-blue)] flex items-center justify-center mr-3 mt-1 shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--smartcat-blue)] text-white rounded-br-md shadow-lg shadow-cyan-500/20 px-5 py-3.5'
            : 'bg-white border border-[var(--border)] rounded-bl-md shadow-sm px-4 py-4'
        }`}
      >
        {isUser ? (
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <FormattedResponse content={message.content} />
        )}
      </div>
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ml-3 mt-1 shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Outreach Modal Component
function OutreachModal({
  isOpen,
  onClose,
  onSubmit,
  loading
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { company: string; need: string; contact: string }) => void
  loading: boolean
}) {
  const [company, setCompany] = useState('')
  const [need, setNeed] = useState('')
  const [contact, setContact] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !need.trim()) return
    onSubmit({ company, need, contact })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-emerald-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Generiši Outreach Email</h3>
              <p className="text-xs text-gray-500">Na osnovu pronađenih kapaciteta</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kompanija <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="npr. PayFlow"
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Njihova potreba <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="npr. Fraud detection tim"
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kontakt osoba <span className="text-gray-400 text-xs font-normal">(opciono)</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="npr. CTO, VP Engineering"
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border)] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading || !company.trim() || !need.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generišem...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generiši Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState<Source[]>([])
  const [showOutreachModal, setShowOutreachModal] = useState(false)
  const [outreachLoading, setOutreachLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setSources([])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }])
        setSources(data.sources || [])
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: `Greška: ${data.error || 'Nešto nije u redu'}` },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Greška: Nije moguće povezati se sa serverom' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  const handleOutreach = async (data: { company: string; need: string; contact: string }) => {
    setOutreachLoading(true)

    // Build the outreach prompt using the conversation context
    const outreachPrompt = `Napiši cold outreach email za ${data.company}.

KONTEKST:
- Njihova potreba: ${data.need}
${data.contact ? `- Prima: ${data.contact}` : ''}
- Koristi ljude i projekte iz prethodnog odgovora

FORMAT (striktno):
Subject: [jedna rečenica sa konkretnom vrednošću]

[Pozdrav]

[1 rečenica: šta smo uradili za sličnog klijenta + konkretan rezultat]

[1 rečenica: kako to rešava njihovu potrebu]

[CTA: konkretan predlog za sledeći korak - poziv ili demo]

[Potpis]

PRAVILA:
- Max 60 reči u telu emaila
- Počni sa rezultatom, ne sa nama
- Jedan konkretan broj/metrika iz naših projekata
- Bez "mi smo...", "naša kompanija...", "želeo bih..."
- Bez buzzwords (synergy, leverage, solutions)
- CTA = konkretno vreme (npr. "15 min sledeće nedelje?")`

    const outreachMessage: Message = { role: 'user', content: outreachPrompt }
    const newMessages = [...messages, outreachMessage]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const responseData = await res.json()

      if (res.ok) {
        // Add a user-friendly message instead of showing the prompt
        const displayMessage: Message = {
          role: 'user',
          content: `📧 Generiši outreach za ${data.company} (${data.need})`
        }
        setMessages([...messages, displayMessage, { role: 'assistant', content: responseData.response }])
      } else {
        setMessages([
          ...messages,
          { role: 'assistant', content: `Greška: ${responseData.error || 'Nije moguće generisati email'}` },
        ])
      }
    } catch {
      setMessages([
        ...messages,
        { role: 'assistant', content: 'Greška: Nije moguće povezati se sa serverom' },
      ])
    } finally {
      setOutreachLoading(false)
      setShowOutreachModal(false)
    }
  }

  // Check if we should show the outreach button (after assistant response with entity cards)
  const canGenerateOutreach = messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    /\[(EMPLOYEE|REPO|PROJECT):/i.test(messages[messages.length - 1].content)

  return (
    <div className="flex flex-col h-screen bg-gradient-fresh">
      {/* Header */}
      <header className="shrink-0 bg-white/80 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="logo-glow">
              <Image
                src="/logo-mark.svg"
                alt="SmartCat"
                width={44}
                height={38}
                className="shrink-0"
              />
            </div>
            <div>
              <h1
                className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--smartcat-blue)] to-[var(--accent)] bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                AskCat
              </h1>
              <p className="text-xs text-[var(--foreground-muted)] font-medium">Sales Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/prezentacija"
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              Prezentacija
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="mb-6 animate-float">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-2xl opacity-20 scale-150" />
                    <Image
                      src="/logo-mark.svg"
                      alt="SmartCat"
                      width={100}
                      height={87}
                      className="relative logo-glow"
                    />
                  </div>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-[var(--foreground)] animate-slide-up"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Kako ti mogu pomoći?
                </h2>
                <p className="text-[var(--foreground-muted)] mb-10 max-w-md text-lg animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                  Pronađi prave ljude, projekte i tehnologije za tvoj sledeći deal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestedQueries.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(query.text)}
                      className={`group card-elevated flex items-start gap-4 px-5 py-4 text-left opacity-0 animate-fade-in-scale stagger-${idx + 1} ${query.border}`}
                      style={{ animationFillMode: 'forwards' }}
                    >
                      <span className={`text-2xl shrink-0 p-2 rounded-xl bg-gradient-to-br ${query.color}`}>
                        {query.icon}
                      </span>
                      <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--smartcat-blue)] transition-colors leading-relaxed font-medium">
                        {query.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={idx}
                    message={msg}
                    isLast={idx === messages.length - 1}
                  />
                ))}
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--smartcat-blue)] flex items-center justify-center mr-3 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="bg-white border border-[var(--border)] rounded-2xl rounded-bl-md shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Sources + Outreach Button */}
          {sources.length > 0 && (
            <div className="shrink-0 px-6 py-3 border-t border-[var(--border)] bg-[var(--background-tertiary)]/50">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-[var(--foreground-muted)] mr-1">Korišćeni izvori:</span>
                  {sources.map((source, idx) => (
                    <SourceBadge key={idx} source={source} />
                  ))}
                </div>
                {canGenerateOutreach && (
                  <button
                    onClick={() => setShowOutreachModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Generiši Outreach
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 px-6 py-5 border-t border-[var(--border)] bg-white/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pitaj o timu, projektima ili tehnologijama..."
                disabled={loading}
                className="flex-1 bg-white border-2 border-[var(--border)] rounded-2xl px-5 py-4 text-[15px] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-lg focus:shadow-cyan-500/10 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 p-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--smartcat-blue)] text-white hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-3">
              <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xs text-[var(--foreground-muted)]">
                Powered by Claude AI • Podaci iz Google Drive
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Outreach Modal */}
      <OutreachModal
        isOpen={showOutreachModal}
        onClose={() => setShowOutreachModal(false)}
        onSubmit={handleOutreach}
        loading={outreachLoading}
      />
    </div>
  )
}

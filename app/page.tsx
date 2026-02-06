'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Source {
  type: 'employee' | 'repository' | 'project'
  name: string
  score: number
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState<Source[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          { role: 'assistant', content: `Error: ${data.error || 'Something went wrong'}` },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Error: Failed to connect to the server' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return '👤'
      case 'repository':
        return '📦'
      case 'project':
        return '📋'
      default:
        return '📄'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900">
            🐱 AskCat
          </h1>
          <p className="text-sm text-gray-500">Sales Intelligence Assistant</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-4xl flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🐱</div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Welcome to AskCat
                </h2>
                <p className="mt-2 max-w-md text-gray-500">
                  Ask me about our team capabilities, technical expertise, and past projects.
                  Try questions like:
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setInput('Who has experience with real-time streaming on AWS?')}
                    className="block w-full rounded-lg border bg-white px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    &quot;Who has experience with real-time streaming on AWS?&quot;
                  </button>
                  <button
                    onClick={() => setInput('What ML projects have we done in FinTech?')}
                    className="block w-full rounded-lg border bg-white px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    &quot;What ML projects have we done in FinTech?&quot;
                  </button>
                  <button
                    onClick={() => setInput('Do we have Kubernetes and cloud migration expertise?')}
                    className="block w-full rounded-lg border bg-white px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    &quot;Do we have Kubernetes and cloud migration expertise?&quot;
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg border bg-white px-4 py-2 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.1s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <div className="border-t bg-gray-100 px-6 py-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Sources:</span>
                {sources.map((source, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-gray-600"
                  >
                    {getSourceIcon(source.type)} {source.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t bg-white px-6 py-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about team capabilities, projects, or technical expertise..."
                className="flex-1 rounded-lg border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

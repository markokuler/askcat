import { NextRequest, NextResponse } from 'next/server'
import { search } from '@/lib/vectorstore'
import { chat, ChatMessage } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // Get the latest user message for vector search
    const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    if (!latestUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // Search for relevant context
    const searchResults = await search(latestUserMessage.content, 5)

    // Get Claude response
    const response = await chat(messages, searchResults)

    return NextResponse.json({
      response,
      sources: searchResults.map((r) => ({
        type: r.type,
        name: r.name,
        score: r.similarity,
      })),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

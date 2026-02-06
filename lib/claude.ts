import Anthropic from '@anthropic-ai/sdk'
import { SearchResult, formatSearchResults } from './vectorstore'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are AskCat, a sales intelligence assistant for SmartCat consulting company.

Your role is to help sales representatives quickly find information about:
- Employee capabilities, skills, and expertise
- Technical repositories and their capabilities
- Past projects, their outcomes, and technologies used

When answering questions:
1. Use ONLY the context provided below to answer
2. Always cite your sources using the format [EMPLOYEE:Name], [REPO:name], or [PROJECT:Name]
3. If the context doesn't contain enough information, say so clearly
4. Be concise but thorough - sales reps need quick, actionable information
5. Highlight relevant metrics and outcomes when available

Format your responses in clear, scannable sections when appropriate.`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chat(
  messages: ChatMessage[],
  context: SearchResult[]
): Promise<string> {
  const contextText = formatSearchResults(context)

  const systemPrompt = `${SYSTEM_PROMPT}

---
CONTEXT FROM KNOWLEDGE BASE:
${contextText}
---`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock ? textBlock.text : ''
}

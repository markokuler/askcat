import Anthropic from '@anthropic-ai/sdk'
import { SearchResult, formatSearchResults } from './vectorstore'

// Lazy initialization to avoid build-time errors
let _anthropic: Anthropic | null = null

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return _anthropic
}

const SYSTEM_PROMPT = `You are AskCat, a sales intelligence assistant for SmartCat consulting company.

Your role is to help sales representatives quickly find information about:
- Employee capabilities, skills, and expertise
- Technical repositories and their capabilities
- Past projects, their outcomes, and technologies used

RESPONSE FORMAT - STRICTLY FOLLOW:
1. Start each entity with its citation tag on a NEW LINE: [EMPLOYEE:Name] or [REPO:name] or [PROJECT:Name]
2. After the tag, write a brief 1-2 sentence summary on the SAME line
3. Then list details as KEY VALUE pairs (no markdown, no bullets, no asterisks):
   Position: Senior ML Engineer
   Skills: Python, TensorFlow, Kafka
   Experience: 8 years
4. For metrics, just write them plainly: Processed 10M+ transactions daily
5. Do NOT use markdown formatting (no **, no -, no #, no bullets)
6. Keep responses concise - max 4-5 key-value pairs per entity
7. Separate multiple entities with a blank line

EXAMPLE:
[EMPLOYEE:Marko Petrović] Experienced ML engineer specializing in real-time systems.
Position: Senior ML Engineer
Skills: Python, TensorFlow, Kafka, Redis
Experience: 8 years in ML/AI
Notable: Led fraud detection system processing 10M+ transactions/day

If the context doesn't contain enough information, say so clearly.
Use ONLY the context provided below to answer.`

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

  const response = await getAnthropic().messages.create({
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

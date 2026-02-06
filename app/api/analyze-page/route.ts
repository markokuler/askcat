import { NextRequest, NextResponse } from 'next/server'
import { search } from '@/lib/vectorstore'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface PageAnalysisRequest {
  pageContent: string | { text: string; type?: string; metadata?: Record<string, string>; [key: string]: unknown }
  pageUrl: string
  pageTitle: string
  generateOutreach?: boolean
}

const ANALYSIS_PROMPT = `Analiziraj sadržaj ove web stranice i izvuci ključne informacije za sales tim.

TIP STRANICE: {pageType}
URL: {url}
NASLOV: {title}

SADRŽAJ:
{content}

---

KONTEKST PO TIPU STRANICE:
- linkedin_job / hiring_page: Izvuci tražene veštine, tehnologije, senioritet. Potrebe = šta traže.
- linkedin_company / company_about / company_homepage: Izvuci industriju, veličinu, servise. Potrebe = gde možemo pomoći.
- linkedin_profile: Izvuci ime, poziciju, kompaniju. Potrebe = šta ta osoba može trebati.

Tvoj zadatak:
1. Izvuci ključne informacije relevantne za tip stranice
2. Identifikuj potrebe, tehnologije, industriju
3. Predloži ključne reči za pretragu naše baze kapaciteta

Vrati JSON format:
{
  "signals": "Kratak opis šta si pronašao (1-2 rečenice)",
  "company": "Ime kompanije",
  "person": "Ime osobe ako postoji",
  "role": "Pozicija osobe ako postoji",
  "industry": "Industrija",
  "technologies": ["tech1", "tech2"],
  "needs": ["potreba1", "potreba2"],
  "searchQuery": "ključne reči za pretragu naše baze"
}

Vrati SAMO validan JSON, bez dodatnog teksta.`

const OUTREACH_PROMPT = `Na osnovu analize stranice i pronađenih kapaciteta iz naše baze, napiši personalizovan cold outreach email.

STRANICA: {url}
NASLOV: {title}

SADRŽAJ STRANICE:
{content}

---

NAŠI KAPACITETI (pronađeni u bazi):
{capabilities}

---

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
- CTA = konkretno vreme (npr. "15 min sledeće nedelje?")

Vrati JSON:
{
  "subject": "Subject line",
  "email": "Telo emaila"
}`

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PageAnalysisRequest

    if (!body.pageContent) {
      return NextResponse.json({ error: 'Page content is required' }, { status: 400 })
    }

    // Extract text content and page type
    const contentText = typeof body.pageContent === 'string'
      ? body.pageContent
      : body.pageContent.text || JSON.stringify(body.pageContent)

    const pageType = typeof body.pageContent === 'object' && body.pageContent.type
      ? body.pageContent.type
      : 'generic'

    // First, analyze the page to extract signals
    const analysisPrompt = ANALYSIS_PROMPT
      .replace('{pageType}', pageType)
      .replace('{url}', body.pageUrl || 'Unknown')
      .replace('{title}', body.pageTitle || 'Unknown')
      .replace('{content}', contentText.substring(0, 10000))

    const analysisResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: analysisPrompt }],
    })

    let analysis: { signals?: string; searchQuery?: string; [key: string]: unknown } = {}
    const analysisContent = analysisResponse.content[0]
    if (analysisContent.type === 'text') {
      try {
        // Strip markdown if present
        let jsonText = analysisContent.text.trim()
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
        }
        analysis = JSON.parse(jsonText)
      } catch {
        analysis = { signals: analysisContent.text }
      }
    }

    // Search our database for relevant matches
    const searchQuery = analysis.searchQuery || body.pageTitle || ''
    const searchResults = await search(searchQuery, 5)

    // Format search results
    const capabilities = searchResults.map(r => {
      return `[${r.type.toUpperCase()}:${r.name}] ${r.content.substring(0, 200)}`
    }).join('\n\n')

    // If generating outreach, create the email
    if (body.generateOutreach) {
      const outreachPrompt = OUTREACH_PROMPT
        .replace('{url}', body.pageUrl || 'Unknown')
        .replace('{title}', body.pageTitle || 'Unknown')
        .replace('{content}', contentText.substring(0, 5000))
        .replace('{capabilities}', capabilities)

      const outreachResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: outreachPrompt }],
      })

      let emailData: { subject?: string; email?: string } = {}
      const outreachContent = outreachResponse.content[0]
      if (outreachContent.type === 'text') {
        try {
          let jsonText = outreachContent.text.trim()
          if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
          }
          emailData = JSON.parse(jsonText)
        } catch {
          // If not valid JSON, use the raw text as email
          emailData = { email: outreachContent.text }
        }
      }

      return NextResponse.json({
        ...analysis,
        ...emailData,
        sources: searchResults.map(r => ({ type: r.type, name: r.name }))
      })
    }

    // Return analysis with matched capabilities
    const employees = searchResults
      .filter(r => r.type === 'employee')
      .map(r => ({
        name: r.name,
        role: r.content.split('\n')[0],
        match: r.content.substring(0, 100)
      }))

    const projects = searchResults
      .filter(r => r.type === 'project')
      .map(r => ({
        name: r.name,
        match: r.content.substring(0, 100)
      }))

    const repositories = searchResults
      .filter(r => r.type === 'repository')
      .map(r => ({
        name: r.name,
        match: r.content.substring(0, 100)
      }))

    return NextResponse.json({
      ...analysis,
      employees,
      projects,
      repositories,
    })

  } catch (error) {
    console.error('Analyze page error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze page' },
      { status: 500 }
    )
  }
}

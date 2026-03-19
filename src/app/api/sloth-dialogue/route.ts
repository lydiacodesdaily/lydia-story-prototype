import { getOpenAIClient } from '@/lib/openai'
import { buildSystemPrompt, buildUserMessage } from '@/lib/dialoguePrompts'
import type { SlothDialogueRequest } from '@/types/dialogue'

export async function POST(request: Request) {
  try {
    const body: SlothDialogueRequest = await request.json()

    const openai = getOpenAIClient()
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 120,
      temperature: 0.8,
      stream: true,
      messages: [
        { role: 'system', content: buildSystemPrompt(body) },
        ...body.history.slice(-8),
        { role: 'user', content: buildUserMessage(body) },
      ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('[sloth-dialogue] error:', error)
    return new Response(JSON.stringify({ error: 'Mochi is napping, try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

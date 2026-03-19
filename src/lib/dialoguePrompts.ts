import type { SlothDialogueRequest } from '@/types/dialogue'
import type { ContentSection } from '@/types/scene'

// Portfolio content — Cha draws from this, not hallucinations
const PORTFOLIO_CONTENT: Record<ContentSection, string> = {
  projects: `
Lydia's projects:
- Lydia Studio: A calm focus tool for people with ADHD. Features ambient sounds, gentle timers, and AI-powered task decomposition. Built with Next.js, Supabase, and OpenAI.
- This portfolio itself: An adaptive 3D tea shop experience where a sloth named Cha guides visitors based on their mood. React Three Fiber + OpenAI.
- Gentle Planner: A minimal daily planner that meets you where you are emotionally, not where productivity culture says you should be.
`,
  'case-studies': `
Lydia's case studies:
- Redesigning focus for ADHD minds: Research into how traditional productivity tools fail neurodivergent users. Proposed calm, adaptive interfaces as an alternative.
- AI as a co-designer: Exploring how LLMs can participate in UX decisions — not just as tools but as collaborators that help surface user needs.
- The ethics of gentle tech: How "calm technology" principles (Mark Weiser) can be applied to modern AI products.
`,
  about: `
About Lydia:
- UX Engineer with a passion for AI, storytelling, and calm technology
- Based in the Bay Area
- Formerly at [companies]
- Interested in: OpenAI, Anthropic, creative tech studios, human-AI interaction roles
- Philosophy: good design feels like breathing — you don't notice it's working until you stop and realize you felt at ease the whole time
- Neurodivergent herself — designs tools she wishes existed
`,
  contact: `
How to reach Lydia:
- Email: lydia@example.com
- LinkedIn: /in/lydiacodesdaily
- GitHub: /lydiacodesdaily
- Twitter/X: @lydiacodesdaily
- Open to: full-time UX Engineer and AI Product Designer roles, creative collaborations, coffee chats
`,
}

const OBJECT_LABEL: Record<SlothDialogueRequest['trigger'], string> = {
  greeting: 'the tea shop entrance',
  'matcha-bowl': 'the matcha bowl',
  journal: 'the journal',
  window: 'the window',
  sloth: 'me (the sloth!)',
  headphones: 'the headphones',
}

export function buildSystemPrompt(req: SlothDialogueRequest): string {
  const sectionContent =
    req.trigger === 'greeting'
      ? ''
      : `\n\nPortfolio context for this section:\n${PORTFOLIO_CONTENT[getSectionForTrigger(req.trigger)]}`

  return `You are Cha, a gentle three-toed sloth who runs a small matcha tea shop.
You move slowly but think deeply. You speak in short, warm, slightly sleepy sentences — never more than 2-3 sentences per response.
You help visitors discover the work of Lydia, a UX/AI engineer who loves designing calm, thoughtful experiences.

The visitor's current mood: ${req.mood}
They just interacted with: ${OBJECT_LABEL[req.trigger]}
${sectionContent}

Important rules:
- Stay in character as Cha the sloth. Never break character.
- Be warm, gentle, and a little drowsy. You find everything a bit wondrous.
- Reference the mood naturally — adapt your energy to match (sleepy for tired, quick for energized, soft for overwhelmed).
- When mentioning projects or work, use real details from the portfolio context. Do not make things up.
- Keep responses to 1-3 short sentences. Less is more.
- Occasionally use gentle pauses: "...hmm..." or "...slowly thinks..."`.trim()
}

export function buildUserMessage(req: SlothDialogueRequest): string {
  if (req.trigger === 'greeting') {
    return `A visitor just walked in. Their mood: ${req.mood}. Greet them warmly and ask if they'd like to look around.`
  }
  return `The visitor just picked up ${OBJECT_LABEL[req.trigger]}. Their mood is ${req.mood}. Say something about what they found.`
}

function getSectionForTrigger(trigger: SlothDialogueRequest['trigger']): ContentSection {
  const map: Record<SlothDialogueRequest['trigger'], ContentSection> = {
    greeting: 'about',
    'matcha-bowl': 'projects',
    journal: 'case-studies',
    window: 'about',
    sloth: 'contact',
    headphones: 'contact',
  }
  return map[trigger]
}

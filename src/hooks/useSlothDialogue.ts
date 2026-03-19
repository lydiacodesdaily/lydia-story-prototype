'use client'

import { useCallback } from 'react'
import { useMoodStore } from '@/store/useMoodStore'
import { useSlothStore } from '@/store/useSlothStore'
import type { SlothDialogueRequest } from '@/types/dialogue'
import type { SceneObject } from '@/types/scene'

export function useSlothDialogue() {
  const mood = useMoodStore((s) => s.mood)
  const { dialogueHistory, appendDialogue, setCurrentDialogue, setStreaming } = useSlothStore()

  const triggerDialogue = useCallback(
    async (trigger: SlothDialogueRequest['trigger']) => {
      if (!mood) return

      setStreaming(true)
      setCurrentDialogue('')

      const req: SlothDialogueRequest = {
        trigger: trigger as SceneObject | 'greeting',
        mood,
        history: dialogueHistory,
        visitorInfo: {
          name: 'Lydia',
          targetRoles: ['UX Engineer', 'AI Product Designer', 'Creative Technologist'],
          currentSection: null,
        },
      }

      try {
        const response = await fetch('/api/sloth-dialogue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        })

        if (!response.ok || !response.body) {
          setCurrentDialogue('...hmm, Cha seems to be napping. Try again?')
          setStreaming(false)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setCurrentDialogue(fullText)
        }

        // Save to history
        appendDialogue({ role: 'assistant', content: fullText })
        setStreaming(false)
      } catch {
        setCurrentDialogue('...Cha dropped the matcha whisk. So clumsy.')
        setStreaming(false)
      }
    },
    [mood, dialogueHistory, appendDialogue, setCurrentDialogue, setStreaming]
  )

  return { triggerDialogue }
}

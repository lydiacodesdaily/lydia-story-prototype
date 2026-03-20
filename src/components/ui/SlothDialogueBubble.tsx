'use client'

import { useRef, useEffect } from 'react'
import { useSlothStore } from '@/store/useSlothStore'
import { useMoodStore } from '@/store/useMoodStore'
import { useSlothDialogue } from '@/hooks/useSlothDialogue'
import type { Mood } from '@/types/mood'

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: 'calm', emoji: '🌧️', label: 'Calm' },
  { id: 'focused', emoji: '☀️', label: 'Focused' },
  { id: 'tired', emoji: '🕯️', label: 'Tired' },
  { id: 'overwhelmed', emoji: '🌫️', label: 'Overwhelmed' },
  { id: 'energized', emoji: '✨', label: 'Energized' },
]

export function SlothDialogueBubble() {
  const { currentDialogue, isStreaming } = useSlothStore()
  const mood = useMoodStore((s) => s.mood)
  const setMood = useMoodStore((s) => s.setMood)
  const { triggerDialogue } = useSlothDialogue()
  const hasGreeted = useRef(false)

  // Once mood is first set, trigger Cha's mood-specific greeting via API
  useEffect(() => {
    if (mood && !hasGreeted.current) {
      hasGreeted.current = true
      triggerDialogue('greeting')
    }
  }, [mood, triggerDialogue])

  // Pre-selection: static greeting + mood buttons
  if (!mood) {
    return (
      <div className="fixed top-6 left-6 z-50 max-w-xs">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🦥</span>
            <div>
              <p className="text-white/90 text-sm leading-relaxed">
                Oh, hello... welcome. I&apos;m Cha.
                <br />
                How are you feeling today?
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/70 hover:border-matcha-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Post-selection: streaming dialogue (only show if there's content)
  if (!currentDialogue && !isStreaming) return null

  return (
    <div className="fixed top-6 left-6 z-50 max-w-xs pointer-events-none">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🦥</span>
          <div>
            <p className="text-white/90 text-sm leading-relaxed">
              {currentDialogue || '...'}
              {isStreaming && (
                <span className="inline-block w-1 h-3 bg-matcha-400 ml-0.5 animate-pulse rounded-sm" />
              )}
            </p>
            <p className="text-white/30 text-xs mt-1">Cha · feeling {mood}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

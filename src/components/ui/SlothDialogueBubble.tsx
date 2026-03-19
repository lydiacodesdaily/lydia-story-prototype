'use client'

import { useSlothStore } from '@/store/useSlothStore'
import { useMoodStore } from '@/store/useMoodStore'

export function SlothDialogueBubble() {
  const { currentDialogue, isStreaming } = useSlothStore()
  const mood = useMoodStore((s) => s.mood)

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
            {mood && (
              <p className="text-white/30 text-xs mt-1">Cha · feeling {mood}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useMoodStore } from '@/store/useMoodStore'

export function LoadingScreen() {
  const mood = useMoodStore((s) => s.mood)

  return (
    <div className="fixed inset-0 bg-[#0d1a0f] flex flex-col items-center justify-center z-50">
      <span className="text-4xl animate-bounce">🦥</span>
      <p className="text-white/40 text-sm mt-4 tracking-wider">
        {mood === 'tired' ? 'slowly brewing matcha...' :
         mood === 'energized' ? 'whisking fast!' :
         mood === 'calm' ? 'rain is falling...' :
         'preparing the tea house...'}
      </p>
    </div>
  )
}

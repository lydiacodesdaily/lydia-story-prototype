'use client'

import { useMoodStore } from '@/store/useMoodStore'

export function LoadingScreen() {
  const mood = useMoodStore((s) => s.mood)

  return (
    <div className="fixed inset-0 bg-[#0a0a08] flex flex-col items-center justify-center z-50">
      <span className="text-4xl animate-bounce">🦥</span>
      <p className="text-white/40 text-sm mt-4 tracking-wider">
        {mood === 'tired' ? 'slowly warming the oven...' :
         mood === 'energized' ? 'fresh batch in the oven!' :
         mood === 'calm' ? 'rain on the bakery window...' :
         'preparing the bakery...'}
      </p>
    </div>
  )
}

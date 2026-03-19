'use client'

import { useMoodStore } from '@/store/useMoodStore'

export function BreathingCue() {
  const mood = useMoodStore((s) => s.mood)

  if (mood !== 'overwhelmed') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Breathing circle */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border border-white/20 animate-[breathe_4s_ease-in-out_infinite]" />
          <div className="absolute inset-4 rounded-full bg-white/5 animate-[breathe_4s_ease-in-out_infinite_0.5s]" />
        </div>
        <p className="text-white/30 text-xs tracking-widest">breathe</p>
      </div>
    </div>
  )
}
